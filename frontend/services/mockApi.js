/**
 * Mock API Service - สำหรับทดสอบเมื่อยังไม่ connect Google Apps Script
 */

// เก็บข้อมูล users ที่ลงทะเบียน (ในหน่วยความจำเท่านั้น)
const mockUsers = [
  {
    id: 1,
    email: 'admin@test.com',
    password: 'admin123',
    name: 'Admin User',
    nickname: 'Admin',
    unit: 'IT Department',
    status: 'approved',
    role: 'admin'
  },
  {
    id: 2,
    email: 'user@test.com',
    password: 'user1234',
    name: 'Test User',
    nickname: 'Tester',
    unit: 'General Department',
    status: 'approved',
    role: ''
  }
];

const mockRequests = [];
const mockMasterData = {
  ranks: ['พ.ตท.', 'พ.ต.', 'นาย', 'หญิงพ.ต.'],
  positions: ['ผู้บัญชาการ', 'นักรบ', 'ผู้สนับสนุน'],
  areas: ['ช่องสายตะกู', 'ปราสาทตาเมือน', 'อื่นๆ'],
  provinces: ['ตราด', 'สระแก้ว', 'จันทบุรี']
};

/**
 * Simulate register API
 */
export const mockRegister = (email, password, name, nickname, unit) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if email exists
      if (mockUsers.some(u => u.email === email)) {
        resolve({
          success: false,
          message: 'อีเมลนี้มีอยู่ในระบบแล้ว'
        });
        return;
      }

      // Add new user
      const newUser = {
        id: mockUsers.length + 1,
        email,
        password,
        name,
        nickname,
        unit,
        status: 'pending',
        role: ''
      };
      mockUsers.push(newUser);

      resolve({
        success: true,
        message: 'ลงทะเบียนสำเร็จ รอการอนุมัติจากผู้ดูแลระบบ'
      });
    }, 500); // Simulate network delay
  });
};

/**
 * Simulate login API
 */
export const mockLogin = (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        resolve({
          success: false,
          message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        });
        return;
      }

      if (user.password !== password) {
        resolve({
          success: false,
          message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        });
        return;
      }

      if (user.status === 'pending') {
        resolve({
          success: false,
          message: 'บัญชีนี้รอการอนุมัติจากผู้ดูแลระบบ'
        });
        return;
      }

      if (user.status !== 'approved') {
        resolve({
          success: false,
          message: 'บัญชีนี้ถูกปิดใช้งาน'
        });
        return;
      }

      resolve({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          nickname: user.nickname,
          unit: user.unit,
          role: user.role
        }
      });
    }, 500);
  });
};

/**
 * Get Master Data
 */
export const mockGetMasterData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMasterData);
    }, 300);
  });
};

/**
 * Create Request
 */
export const mockCreateRequest = (email, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRequest = {
        id: `REQ-${Date.now()}`,
        email,
        ...data,
        status: 'draft',
        createdDate: new Date().toISOString()
      };
      mockRequests.push(newRequest);

      resolve({
        success: true,
        message: 'สร้างคำขอสำเร็จ',
        requestId: newRequest.id
      });
    }, 300);
  });
};

/**
 * Get Requests
 */
export const mockGetRequests = (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const requests = mockRequests.filter(r => r.email === email);
      resolve({
        success: true,
        requests
      });
    }, 300);
  });
};

export default {
  mockRegister,
  mockLogin,
  mockGetMasterData,
  mockCreateRequest,
  mockGetRequests
};
