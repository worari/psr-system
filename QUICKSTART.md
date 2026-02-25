# Quick Start Guide - ระบบเสนอขอบำเหน็จความชอบ (พ.ส.ร.)

## ✅ ตรวจสอบความพร้อม

ก่อนเริ่มต้น ให้ติดตั้ง:
- Node.js 16+
- npm หรือ yarn
- Git
- GitHub Account
- Google Account
- Vercel Account

## 🚀 ขั้นตอนการตั้งค่า

### 1. สร้าง Google Sheet

ดูการอ่าน: [GOOGLE_SHEET_SETUP.md](./GOOGLE_SHEET_SETUP.md)

**สรุป:**
- สร้าง Google Sheet ใหม่
- สร้างแผ่นงานตามรูปแบบที่ระบุ
- บันทึก Sheet ID

### 2. ตั้งค่า Google Apps Script

ดูการอ่าน: [GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md)

**สรุป:**
- สร้าง Apps Script project
- ลอกโค้ดจาก `google-apps-script/Code.gs`
- ปล่อยเป็น Web App
- บันทึก Deployment URL

### 3. ตั้งค่าหากในเครื่อง

```bash
# Clone the repository
git clone https://github.com/yourusername/psr-system.git
cd psr-system

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
VITE_GAS_DEPLOYMENT_ID=https://script.google.com/macros/d/{YOUR_ID}/usercontent
VITE_GOOGLE_SHEET_ID={YOUR_SHEET_ID}
EOF

# Start development server
npm run dev
```

เปิด http://localhost:3000 ในเบราว์เซอร์

### 4. ผลักไปยัง GitHub

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/psr-system.git
git push -u origin main
```

### 5. ปล่อยไปยัง Vercel

ดูการอ่าน: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

**สรุป:**
- ลิงค์ GitHub repo กับ Vercel
- ตั้งค่า Environment Variables
- Vercel จะสร้างและปล่อยอัตโนมัติ

## 📋 บัญชีตรวจสอบระบบ

- [ ] Google Sheet ตั้งค่าแล้ว
- [ ] Google Apps Script ปล่อยแล้ว
- [ ] Environment variables ตั้งค่าแล้ว
- [ ] Build สำเร็จในเครื่อง (`npm run build`)
- [ ] Repository push ไป GitHub
- [ ] Vercel deployment สำเร็จ
- [ ] Frontend และ Backend เชื่อมต่อได้

## 🧪 ทดสอบหลังปล่อย

### 1. ทดสอบ Backend

ในเบราว์เซอร์ console:

```javascript
// เลือกข้อมูลหลัก
fetch('YOUR_GAS_DEPLOYMENT_URL?action=getMasterData', {
  method: 'POST',
  payload: JSON.stringify({})
}).then(r => r.json()).then(console.log)
```

### 2. ทดสอบระบบลงทะเบียน

1. ไปที่ http://localhost:3000/register (หรือ Vercel URL)
2. กรอกข้อมูล
3. ตรวจสอบข้อมูลในกูเกิล Sheet `Users`

### 3. ทดสอบระบบเข้าสู่ระบบ

1. ไปที่หน้า login
2. ใช้อีเมลและรหัสผ่านที่ลงทะเบียน
3. ควร redirect ไป dashboard

## 📊 มุมมองผู้ใช้ (Testing Users)

ผู้ดูแลระบบสามารถสร้าง test users:

```javascript
// ใน Google Apps Script console
doRegister('admin@example.com', 'password123', 'Admin User', 'Admin', 'HQ');
approveUser(2); // อนุมัติแบบ row 2
```

จากนั้นเข้าสู่ระบบและไปที่ `/admin`

## 🔧 คำสั่ง Useful

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel (requires Vercel CLI)
npm run deploy

# Check for linting issues
npm run lint

# Format code
npm run format
```

## 📚 Folder Structure

```
├── frontend/
│   ├── pages/              # Vue pages
│   │   ├── auth/          # Auth pages
│   │   ├── requests/      # Request management
│   │   └── admin/         # Admin pages
│   ├── layouts/           # Layout components
│   ├── assets/            # CSS and static files
│   ├── router/            # Vue Router config
│   ├── store/             # Vuex store
│   ├── main.js            # Entry point
│   ├── App.vue            # Root component
│   └── index.html         # HTML template
├── google-apps-script/
│   ├── Code.gs            # GAS backend
│   └── README.md          # GAS docs
├── .github/
│   └── workflows/         # CI/CD pipelines
├── package.json
├── vite.config.js
└── README.md
```

## 🆘 Troubleshooting

### ข้อผิดพลาด: "Cannot find module 'vue'"
```bash
npm install
```

### ข้อผิดพลาด: "GAS authentication failed"
- ตรวจสอบ Deployment URL
- ตรวจสอบ Sheet permissions
- ทำการ re-deploy GAS

### ข้อผิดพลาด: "CORS error"
- ตรวจสอบ GAS `sendResponse()` headers
- ตรวจสอบ Vercel environment variables

### ข้อผิดพลาด: "Build failed on Vercel"
- ลบ `vercel/.output` locally
- ลบ `.env` files (เก็บเฉพาะ `.env.local`)
- Vercel rebuild

## 📞 Support

สำหรับการช่วยเหลือ:
1. ตรวจสอบบันทึก deployment
2. ตรวจสอบ console สำหรับข้อผิดพลาด
3. ลบแคช browser (Ctrl+Shift+Delete)
4. ลองระบบเพียง one piece ที่ a time

## ✨ Next Steps

หลังจากตั้งค่าสำเร็จ:

1. ปรับแต่ง UI พอใจ
2. เพิ่มข้อมูลมาสเตอร์เพิ่มเติมใน Sheet
3. ตั้งค่า email notifications
4. ตั้งค่า Google Drive สำหรับ file uploads
5. ปรับโลโก้และธีมสี
6. ทดสอบด้วยผู้ใช้จริง
7. ตั้นแน่นการรักษาความปลอดภัยและการสำรองข้อมูล

## 📄 License

ISC License - See LICENSE file for details

ยินดีต้อนรับสู่ระบบเสนอขอบำเหน็จความชอบ! 🎉
