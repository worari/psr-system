# การตั้งค่า Google Apps Script

คู่มือการตั้งค่า Google Apps Script เพื่อให้ทำงานเป็นแบ็กเอนด์ของระบบ

## 1. สร้าง Google Apps Script Project

### ขั้นตอน:
1. ไปที่ [Google Apps Script](https://script.google.com)
2. คลิก "New Project"
3. ตั้งชื่อเป็น "PSR Benefits System Backend"

## 2. ลิงก์กับ Google Sheet

ในไฟล์ `Code.gs` ที่บริจาคอดักำหนดชื่อสเปรดชีต:

```javascript
// ที่บริจาคของ setSpreadsheet
const ss = SpreadsheetApp.getActive(); // ใช้ sheet ที่เปิดอยู่
```

หรือใช้ Sheet ID โดยตรง:

```javascript
const ss = SpreadsheetApp.openById('YOUR_SHEET_ID');
```

## 3. คัดลอกโค้ด

1. คัดลอกเนื้อหาจาก `google-apps-script/Code.gs`
2. ในตัวแก้ไข Google Apps Script ให้ทำลายไฟล์ `Code.gs` ที่มีอยู่แล้วและวางลง
3. บันทึก (Ctrl+S)

## 4. เปิดใช้ API

1. ในรูป Google Apps Script -> Applications Script API คลิก "Enable"
2. ไปที่ Project Settings (เฟ้นด์ซ้าย)
3. ดาวน์โหลด Script ID (สำหรับการจัดการรีโมต)

## 5. Deploy as Web App

1. คลิก "Deploy" > "New deployment"
2. เลือก Type: "Web app"
3. Execute as: (อีเมล)
4. Who has access: "Anyone"
5. คลิก Deploy
6. คัดลอกการปล่อยตัว URL นี้

ระบบออกแบบมีรูปแบบ:
```
https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercontent
```

## 6. ตั้งค่าตัวแปร Environment

ใน `.env.local` บันทึก Deployment URL:

```
VITE_GAS_DEPLOYMENT_ID=https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercontent
```

## 7. ทดสอบ

ทดสอบการเชื่อมต่อโดยเลือก `getMasterData` action:

```javascript
// ในเบราว์เซอร์ console
fetch('YOUR_DEPLOYMENT_URL?action=getMasterData', {
  method: 'POST',
  payload: JSON.stringify({})
}).then(r => r.json()).then(console.log)
```

## การแก้ไขปัญหา

### ข้อผิดพลาดการอนุญาต (Permission Denied)
- ตรวจสอบว่า Script ได้รับอนุญาตให้เข้าถึง Google Sheets
- เรียกใช้ฟังก์ชันใดๆ สักครั้งเพื่อให้ Google ขอสิทธิ์

### CORS Error
- ระบบ GAS สนับสนุน CORS สำหรับดเมนเฉพาะ
- เพิ่มเฮดเดอร์ CORS ในตัวอักษร response:

```javascript
function sendResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*')
}
```

### ไม่สามารถหา Sheet
- ตรวจสอบชื่อ Sheet ตรงกับ `SHEET_NAMES` ใน Code.gs
- ใช้ `SpreadsheetApp.getActiveSpreadsheet().getSheets()` เพื่อดูชีตทั้งหมด

## อัพเดท Deployment

1. ทำการเปลี่ยนแปลง Code.gs
2. บันทึก
3. ปล่อย > การปล่อยตัวใหม่ (หรืออับเดทการปล่อยตัวที่มีอยู่)
4. บันทึก Deployment URL ใหม่
