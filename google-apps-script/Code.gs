/**
 * Google Apps Script - PSR Benefits System Backend
 * Main entry point for all API functions
 */

const SHEET_NAMES = {
  USERS: 'Users',
  REQUESTS: 'Requests',
  APPROVALS: 'Approvals',
  BENEFICIARIES: 'Beneficiaries',
  MASTER_DATA: 'MasterData'
};

// ==================== AUTHENTICATION ====================

/**
 * Register new user
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @param {string} nickname
 * @param {string} unit
 */
function doRegister(email, password, name, nickname, unit) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEET_NAMES.USERS);
  
  // Check if email already exists
  const data = usersSheet.getDataRange().getValues();
  const emailExists = data.some((row, idx) => idx > 0 && row[0] === email);
  
  if (emailExists) {
    return { success: false, message: 'อีเมลนี้มีอยู่ในระบบแล้ว' };
  }
  
  // Hash password (Note: In production, use proper hashing)
  const hashedPassword = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
  const passwordHash = Utilities.base64Encode(hashedPassword);
  
  // Add new user (status: pending approval)
  const newRow = [
    email,
    passwordHash,
    name,
    nickname,
    unit,
    new Date(),
    'pending',
    ''
  ];
  
  usersSheet.appendRow(newRow);
  
  return { 
    success: true, 
    message: 'ลงทะเบียนสำเร็จ รอการอนุมัติจากผู้ดูแลระบบ' 
  };
}

/**
 * User login
 * @param {string} email
 * @param {string} password
 */
function doLogin(email, password) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEET_NAMES.USERS);
  
  const data = usersSheet.getDataRange().getValues();
  const hashedPassword = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
  const passwordHash = Utilities.base64Encode(hashedPassword);
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      if (data[i][1] === passwordHash) {
        if (data[i][6] === 'approved') {
          return { 
            success: true, 
            user: {
              email: data[i][0],
              name: data[i][2],
              nickname: data[i][3],
              unit: data[i][4],
              role: data[i][7]
            }
          };
        } else if (data[i][6] === 'pending') {
          return { 
            success: false, 
            message: 'บัญชีนี้รอการอนุมัติจากผู้ดูแลระบบ' 
          };
        } else {
          return { 
            success: false, 
            message: 'บัญชีนี้ถูกปิดใช้งาน' 
          };
        }
      } else {
        return { 
          success: false, 
          message: 'รหัสผ่านไม่ถูกต้อง' 
        };
      }
    }
  }
  
  return { 
    success: false, 
    message: 'ไม่พบอีเมลในระบบ' 
  };
}

/**
 * Request password reset
 * @param {string} email
 */
function doForgotPassword(email) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEET_NAMES.USERS);
  
  const data = usersSheet.getDataRange().getValues();
  const userRow = data.findIndex((row, idx) => idx > 0 && row[0] === email);
  
  if (userRow === -1) {
    return { 
      success: false, 
      message: 'ไม่พบอีเมลในระบบ' 
    };
  }
  
  // Generate reset token
  const resetToken = Utilities.getUuid();
  const resetExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  // Store reset token in user row
  usersSheet.getRange(userRow + 1, 9).setValue(resetToken);
  usersSheet.getRange(userRow + 1, 10).setValue(resetExpiry);
  
  // In production, send email with reset link
  GmailApp.sendEmail(email, 'ตั้งรหัสผ่านใหม่ - ระบบเสนอขอ พ.ส.ร.', 
    `กรุณาคลิกลิงก์ด้านล่างเพื่อตั้งรหัสผ่านใหม่:\nhttps://your-domain.com/reset-password?token=${resetToken}\n\nลิงก์นี้จะหมดอายุใน 24 ชั่วโมง`);
  
  return { 
    success: true, 
    message: 'ลิงก์ตั้งรหัสผ่านใหม่ได้ส่งไปที่อีเมลของคุณแล้ว' 
  };
}

/**
 * Reset password with token
 * @param {string} token
 * @param {string} newPassword
 */
function doResetPassword(token, newPassword) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEET_NAMES.USERS);
  
  const data = usersSheet.getDataRange().getValues();
  let userRow = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][8] === token) {
      const expiry = new Date(data[i][9]);
      if (expiry > new Date()) {
        userRow = i;
        break;
      }
    }
  }
  
  if (userRow === -1) {
    return { 
      success: false, 
      message: 'โทเค็นไม่ถูกต้องหรือหมดอายุแล้ว' 
    };
  }
  
  // Update password
  const hashedPassword = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, newPassword);
  const passwordHash = Utilities.base64Encode(hashedPassword);
  
  usersSheet.getRange(userRow + 1, 2).setValue(passwordHash);
  usersSheet.getRange(userRow + 1, 9).clearContent();
  usersSheet.getRange(userRow + 1, 10).clearContent();
  
  return { 
    success: true, 
    message: 'ตั้งรหัสผ่านใหม่สำเร็จ' 
  };
}

// ==================== USER MANAGEMENT ====================

/**
 * Get all pending users for admin approval
 */
function getPendingUsers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEET_NAMES.USERS);
  
  const data = usersSheet.getDataRange().getValues();
  const pending = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][6] === 'pending') {
      pending.push({
        id: i,
        email: data[i][0],
        name: data[i][2],
        nickname: data[i][3],
        unit: data[i][4],
        registeredDate: data[i][5],
        status: data[i][6]
      });
    }
  }
  
  return pending;
}

/**
 * Approve user registration
 * @param {number} userRow
 */
function approveUser(userRow) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEET_NAMES.USERS);
  
  usersSheet.getRange(userRow + 1, 7).setValue('approved');
  
  // Send approval email
  const userData = usersSheet.getRange(userRow + 1, 1, 1, 8).getValues()[0];
  GmailApp.sendEmail(userData[0], 'อนุมัติการใช้งาน - ระบบเสนอขอ พ.ส.ร.',
    `สวัสดีคุณ ${userData[2]}\n\nการสมัครของคุณได้รับการอนุมัติแล้ว คุณสามารถเข้าใช้งานระบบได้ที่:\nhttps://your-domain.com`);
  
  return { success: true, message: 'อนุมัติสำเร็จ' };
}

/**
 * Reject user registration
 * @param {number} userRow
 * @param {string} reason
 */
function rejectUser(userRow, reason) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEET_NAMES.USERS);
  
  usersSheet.getRange(userRow + 1, 7).setValue('rejected');
  usersSheet.getRange(userRow + 1, 8).setValue(reason);
  
  // Send rejection email
  const userData = usersSheet.getRange(userRow + 1, 1, 1, 8).getValues()[0];
  GmailApp.sendEmail(userData[0], 'ไม่อนุมัติการใช้งาน - ระบบเสนอขอ พ.ส.ร.',
    `สวัสดีคุณ ${userData[2]}\n\nขออภัย การสมัครของคุณไม่ได้รับการอนุมัติ\nเหตุผล: ${reason}`);
  
  return { success: true, message: 'ปฏิเสธสำเร็จ' };
}

// ==================== BENEFITS REQUEST ====================

/**
 * Create new benefits request
 * @param {string} email
 * @param {Object} requestData
 */
function createBenefitsRequest(email, requestData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const requestsSheet = ss.getSheetByName(SHEET_NAMES.REQUESTS);
  
  const requestId = 'PSR-' + Date.now();
  const newRow = [
    requestId,
    email,
    requestData.affiliation,
    requestData.missionType,
    requestData.operation,
    requestData.area,
    requestData.province,
    new Date(),
    'draft'
  ];
  
  requestsSheet.appendRow(newRow);
  
  return { 
    success: true, 
    requestId: requestId,
    message: 'สร้างคำขอสำเร็จ' 
  };
}

/**
 * Add beneficiary to request
 * @param {string} requestId
 * @param {Object} beneficiaryData
 */
function addBeneficiary(requestId, beneficiaryData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const beneficiariesSheet = ss.getSheetByName(SHEET_NAMES.BENEFICIARIES);
  
  const newRow = [
    requestId,
    beneficiaryData.rank,
    beneficiaryData.firstName,
    beneficiaryData.lastName,
    beneficiaryData.position,
    beneficiaryData.lossType,
    beneficiaryData.benefitLevel,
    beneficiaryData.currentBenefit,
    beneficiaryData.orders,
    beneficiaryData.orderDate,
    beneficiaryData.issuedBy,
    beneficiaryData.behavior,
    new Date()
  ];
  
  beneficiariesSheet.appendRow(newRow);
  
  return { 
    success: true, 
    message: 'เพิ่มบุคคลสำเร็จ' 
  };
}

/**
 * Get beneficiaries for request
 * @param {string} requestId
 */
function getBeneficiaries(requestId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const beneficiariesSheet = ss.getSheetByName(SHEET_NAMES.BENEFICIARIES);
  
  const data = beneficiariesSheet.getDataRange().getValues();
  const beneficiaries = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === requestId) {
      beneficiaries.push({
        id: i,
        rank: data[i][1],
        firstName: data[i][2],
        lastName: data[i][3],
        position: data[i][4],
        lossType: data[i][5],
        benefitLevel: data[i][6],
        currentBenefit: data[i][7],
        orders: data[i][8],
        orderDate: data[i][9],
        issuedBy: data[i][10],
        behavior: data[i][11]
      });
    }
  }
  
  return beneficiaries;
}

// ==================== WORKFLOW ====================

/**
 * Get workflow timeline
 * @param {string} requestId
 */
function getWorkflowTimeline(requestId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const approvalsSheet = ss.getSheetByName(SHEET_NAMES.APPROVALS);
  
  const data = approvalsSheet.getDataRange().getValues();
  const timeline = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === requestId) {
      timeline.push({
        step: data[i][1],
        action: data[i][2],
        date: data[i][3],
        reviewer: data[i][4],
        comment: data[i][5],
        status: data[i][6]
      });
    }
  }
  
  return timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Submit request for approval
 * @param {string} requestId
 */
function submitRequest(requestId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const requestsSheet = ss.getSheetByName(SHEET_NAMES.REQUESTS);
  const approvalsSheet = ss.getSheetByName(SHEET_NAMES.APPROVALS);
  
  // Update request status
  const data = requestsSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === requestId) {
      requestsSheet.getRange(i + 1, 9).setValue('submitted');
      
      // Add approval timeline entry
      approvalsSheet.appendRow([
        requestId,
        '1',
        'received',
        new Date(),
        '',
        '',
        'pending'
      ]);
      
      break;
    }
  }
  
  return { 
    success: true, 
    message: 'ส่งคำขอสำเร็จ' 
  };
}

/**
 * Review and approve request
 * @param {string} requestId
 * @param {string} approvalData
 */
function reviewRequest(requestId, approvalData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const approvalsSheet = ss.getSheetByName(SHEET_NAMES.APPROVALS);
  
  approvalsSheet.appendRow([
    requestId,
    approvalData.step,
    approvalData.action,
    new Date(),
    approvalData.reviewer,
    approvalData.comment,
    approvalData.status
  ]);
  
  return { 
    success: true, 
    message: 'บันทึกการพิจารณาสำเร็จ' 
  };
}

// ==================== MASTER DATA ====================

/**
 * Get master data for dropdowns
 */
function getMasterData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const masterSheet = ss.getSheetByName(SHEET_NAMES.MASTER_DATA);
  
  const data = masterSheet.getDataRange().getValues();
  const masterData = {
    ranks: [],
    positions: [],
    areas: [],
    provinces: [],
    missionTypes: [],
    operations: [],
    lossTypes: [],
    benefitLevels: []
  };
  
  // Parse data into categories
  for (let i = 1; i < data.length; i++) {
    const [category, value] = [data[i][0], data[i][1]];
    
    if (category === 'rank') masterData.ranks.push(value);
    else if (category === 'position') masterData.positions.push(value);
    else if (category === 'area') masterData.areas.push(value);
    else if (category === 'province') masterData.provinces.push(value);
    else if (category === 'missionType') masterData.missionTypes.push(value);
    else if (category === 'operation') masterData.operations.push(value);
    else if (category === 'lossType') masterData.lossTypes.push(value);
    else if (category === 'benefitLevel') masterData.benefitLevels.push(value);
  }
  
  return masterData;
}

// ==================== WEB APP ENTRY POINT ====================

function doGet(e) {
  return HtmlService.createHtmlOutput('PSR System Backend Running');
}

function doPost(e) {
  const action = e.parameter.action;
  const payload = JSON.parse(e.postData.contents);
  
  try {
    switch(action) {
      case 'register':
        return sendResponse(doRegister(payload.email, payload.password, payload.name, payload.nickname, payload.unit));
      case 'login':
        return sendResponse(doLogin(payload.email, payload.password));
      case 'forgotPassword':
        return sendResponse(doForgotPassword(payload.email));
      case 'resetPassword':
        return sendResponse(doResetPassword(payload.token, payload.newPassword));
      case 'getPendingUsers':
        return sendResponse(getPendingUsers());
      case 'approveUser':
        return sendResponse(approveUser(payload.userRow));
      case 'rejectUser':
        return sendResponse(rejectUser(payload.userRow, payload.reason));
      case 'getMasterData':
        return sendResponse(getMasterData());
      case 'createBenefitsRequest':
        return sendResponse(createBenefitsRequest(payload.email, payload.data));
      case 'addBeneficiary':
        return sendResponse(addBeneficiary(payload.requestId, payload.data));
      case 'getBeneficiaries':
        return sendResponse(getBeneficiaries(payload.requestId));
      case 'getWorkflowTimeline':
        return sendResponse(getWorkflowTimeline(payload.requestId));
      case 'submitRequest':
        return sendResponse(submitRequest(payload.requestId));
      case 'reviewRequest':
        return sendResponse(reviewRequest(payload.requestId, payload.data));
      default:
        return sendResponse({ success: false, message: 'Unknown action' });
    }
  } catch (error) {
    return sendResponse({ success: false, message: error.toString() });
  }
}

function sendResponse(data) {
  var output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);

  // Add CORS headers so browser clients can call this webapp
  try {
    // Some environments support addHeader on TextOutput
    output.addHeader('Access-Control-Allow-Origin', '*');
    output.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    output.addHeader('Access-Control-Allow-Headers', 'Content-Type');
  } catch (e) {
    // ignore if not supported in the execution environment
  }

  return output;
}

// Simple GET handler to help with browser checks (and some preflight behaviours)
function doGet(e) {
  return sendResponse({ success: false, message: 'Use POST with action parameter' });
}
