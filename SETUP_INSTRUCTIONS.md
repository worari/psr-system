# การนำไปใช้งาน - ขั้นตอนทีละขั้น

สารบัญ:
1. [ตั้งค่า Frontend](#ตั้งค่า-frontend)
2. [ตั้งค่า Backend](#ตั้งค่า-backend)
3. [ตั้งค่า Database](#ตั้งค่า-database)
4. [ปล่อยไปใช้งาน](#ปล่อยไปใช้งาน)

---

## ตั้งค่า Frontend

### ขั้นตอนที่ 1: เตรียมเครื่องของคุณ

```bash
# ติดตั้ง Node.js 18+ จาก https://nodejs.org/
node --version   # ต้องเป็น v18+
npm --version    # ต้องเป็น 8+

# ติดตั้ง Git จาก https://git-scm.com/
git --version
```

### ขั้นตอนที่ 2: Clone Repository

```bash
# ไปที่ GitHub และ fork repository นี้
# จากนั้น clone fork ของคุณ

git clone https://github.com/YOUR_USERNAME/psr-system.git
cd psr-system

# ตั้งค่า upstream (เพื่อให้ update ได้)
git remote add upstream https://github.com/ORIGINAL_OWNER/psr-system.git
```

### ขั้นตอนที่ 3: ติดตั้ง Dependencies

```bash
# ติดตั้ง npm packages
npm install

# ตรวจสอบว่าติดตั้งสำเร็จ
npm --version
npm list vue
```

### ขั้นตอนที่ 4: ตั้งค่า Environment Variables

```bash
# สร้างไฟล์ .env.local (อย่ากรรม Git)
cat > .env.local << 'EOF'
# หลังจากรับจาก Google Apps Script
VITE_GAS_DEPLOYMENT_ID=https://script.google.com/macros/d/YOUR_ID/usercontent

# หลังจากรับจาก Google Sheet
VITE_GOOGLE_SHEET_ID=YOUR_SHEET_ID
EOF

# ตรวจสอบไฟล์
cat .env.local
```

### ขั้นตอนที่ 5: ทดสอบ Development Server

```bash
# เริ่มต้น dev server
npm run dev

# ผลลัพธ์:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help

# เปิด http://localhost:5173 ในเบราว์เซอร์
```

---

## ตั้งค่า Backend

### ขั้นตอนที่ 1: สร้าง Google Apps Script Project

```
1. ไปที่ https://script.google.com
2. คลิก "New Project"
3. ตั้งชื่อเป็น "PSR Backend"
4. คัดลอกเนื้อหาจาก google-apps-script/Code.gs
5. วาง ใน Code.gs ใหม่
6. บันทึก (Ctrl+S)
```

### ขั้นตอนที่ 2: ลิงค์กับ Google Sheet

ในไฟล์ Code.gs ที่เปิดอยู่:

```javascript
// ที่แถว 1 ให้แน่ใจว่า Sheet ที่ใช้งาน
const ss = SpreadsheetApp.getActiveSpreadsheet();

// หรือใช้ Sheet ID โดยตรง:
const ss = SpreadsheetApp.openById('YOUR_SHEET_ID_HERE');
```

### ขั้นตอนที่ 3: ปล่อย Apps Script

```
1. คลิก "Deploy" > "New deployment"
2. Type: "Web app"
3. Execute as: (อีเมลของคุณ)
4. Who has access: "Anyone"
5. คลิก "Deploy"
6. คัดลอก URL ที่ปรากฏ (บันทึก!)

URL จะมีลักษณะ:
https://script.google.com/macros/d/AKfycbxxxxxxx/usercontent
```

### ขั้นตอนที่ 4: ขอสิทธิ์

ครั้งแรกที่เรียกใช้ API คุณจะได้รับ authorization prompt:
- คลิก "Review permissions"
- เลือก Google Account ของคุณ
- คลิก "Allow"

---

## ตั้งค่า Database

### ขั้นตอนที่ 1: สร้าง Google Sheet

```
1. ไปที่ https://sheets.google.com
2. คลิก "New"
3. ตั้งชื่อ "PSR-Database"
4. ได้รับ Sheet ID จาก URL:
   https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
```

### ขั้นตอนที่ 2: สร้างแผ่นงาน

คลิกขวาที่แท้บล่าง ชื่อให้แน่ใจชีต:

```
1. Users              (ผู้ใช้งาน)
2. Requests          (คำขอ)
3. Beneficiaries     (บุคคล)
4. Approvals         (การพิจารณา)
5. MasterData        (ข้อมูลอ้างอิง)
```

### ขั้นตอนที่ 3: เพิ่มหัวคอลัมน์

ใน Sheet "Users":
```
A: Email
B: Password Hash
C: Name
D: Nickname
E: Unit
F: Register Date
G: Status
H: Role
```

ทำซ้ำสำหรับ Requests, Beneficiaries, Approvals (ดู GOOGLE_SHEET_SETUP.md)

### ขั้นตอนที่ 4: เพิ่มข้อมูล Master

ใน Sheet "MasterData":
```
Category        Value
rank            พ.ตท.
rank            พ.ต.
rank            นาย
position        ผู้บัญชาการ
position        นักรบ
area            ช่องสายตะกู
area            ปราสาทตาเมือน
province        ตราด
province        สระแก้ว
```

### ขั้นตอนที่ 5: แชร์ Sheet

```
1. คลิก Share (มุมขวาบน)
2. ไปที่ Google Apps Script project
3. ให้สิทธิ์ Editor
```

---

## ปล่อยไปใช้งาน

### ขั้นตอนที่ 1: ตั้งค่า GitHub

```bash
# ตั้งค่า Git user
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# ถ้า fork repo ให้
git add .
git commit -m "Initial setup"
git push origin main

# ถ้าโปรเจคใหม่ให้สร้าง repo ใน GitHub แล้ว
git remote add origin https://github.com/YOUR_USERNAME/psr-system.git
git branch -M main
git push -u origin main
```

### ขั้นตอนที่ 2: สร้าง Vercel Project

```
1. ไปที่ https://vercel.com
2. ลงชื่อเข้าด้วย GitHub
3. คลิก "New Project"
4. เลือก psr-system repository
5. ตั้งค่า:
   - Framework: "Vue.js"
   - Build Command: npm run build
   - Output Directory: dist
```

### ขั้นตอนที่ 3: ตั้งค่า Environment Variables ใน Vercel

ใน Vercel Project Settings > Environment Variables:

```
VITE_GAS_DEPLOYMENT_ID = https://script.google.com/macros/d/YOUR_ID/usercontent
VITE_GOOGLE_SHEET_ID = YOUR_SHEET_ID
```

### ขั้นตอนที่ 4: ปล่อย

```bash
# Vercel จะสร้างอัตโนมัติเมื่อ push

# Push ไปยัง main branch
git push origin main

# ติดตามความคืบหน้าใน Vercel Dashboard
# ผลลัพธ์: https://psr-system.vercel.app
```

---

## ทดสอบระบบ

### ทดสอบเครื่อง (localhost:5173)

```bash
# 1. ทดสอบ Master Data
# เปิด Browser Console (F12)
# แล้วทำ:
fetch('YOUR_GAS_URL?action=getMasterData', {
  method: 'POST',
  payload: JSON.stringify({})
})
.then(r => r.json())
.then(d => console.log(d))

# 2. ทดสอบ Registration
# ไปที่ http://localhost:5173/register
# กรอกข้อมูล
# ตรวจสอบใน Google Sheet Users sheet

# 3. ทดสอบ Login
# เข้าสู่ระบบด้วย email/password
# ควร redirect ไป dashboard
```

### ทดสอบบน Vercel

```bash
# ทดสอบ URL production
# https://psr-system.vercel.app

# ทำการทดสอบเดียวกันกับ localhost
```

---

## การแก้ไขปัญหา

### Frontend ไม่ทำงาน

```bash
# ล้าง dependencies
rm -rf node_modules
npm install

# สะ clean build
rm -rf dist
npm run build

# ตรวจสอบ Node version
node --version  # ต้อง v18+
```

### GAS API มีข้อผิดพลาด

```javascript
// ใน Google Apps Script
// เพิ่ม logging

function doPost(e) {
  Logger.log('Received action: ' + e.parameter.action);
  Logger.log('Received data: ' + e.postData.contents);
  
  // ... rest of code
}

// ลูก logs โดยใช้ Execution Log ใน GAS console
```

### CORS Error

```javascript
// โดย Google Apps Script, เพิ่มเฮดเดอร์ CORS ใน sendResponse
function sendResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'POST')
}
```

### Environment Variables ไม่ถูกโหลด

```bash
# ใน localhost
# ตรวจสอบ .env.local ว่ากรอกถูกต้อง
cat .env.local

# Vercel จำเป็นต้อง redeploy หลังตั้งค่า env
# ไปที่ Vercel Dashboard > Redeploy
```

---

## Useful Commands

```bash
# Development
npm run dev          # เริ่ม dev server
npm run build        # Build สำหรับ production
npm run preview      # Preview production build

# Maintenance
npm update           # Update dependencies
npm audit            # ตรวจสอบ vulnerabilities
npm audit fix        # แก้ไข vulnerabilities

# Git
git status           # ตรวจสอบสถานะ
git log              # ดูประวัติ
git diff             # ดูการเปลี่ยนแปลง
git reset --hard     # ยกเลิกการเปลี่ยนแปลง
```

---

## Next Steps

1. ✅ เสร็จขั้นตอนการตั้งค่า
2. ⏭️ ทดสอบหลักการทำงาน
3. ⏭️ เพิ่มโลโก้และธีมสี
4. ⏭️ ตั้งค่า email notifications
5. ⏭️ ส่งผู้ใช้จริงทดลอง
6. ⏭️ ตั้งแน่นระบบรักษาความปลอดภัย

---

## Support

สำหรับปัญหาเพิ่มเติม โปรดดู:
- [QUICKSTART.md](./QUICKSTART.md)
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- [google-apps-script/README.md](./google-apps-script/README.md)

ยินดีต้อนรับสู่ Project! 🎉
