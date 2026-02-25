# ระบบเสนอขอบำเหน็จความชอบ (พ.ส.ร.) - Project Summary

## 📋 ภาพรวมโครงการ

นี่คือระบบเว็บแอปพลิเคชันสมบูรณ์ของ Thai Military Benefits Request System ที่สามารถ:
- ลงทะเบียนและจัดการผู้ใช้งาน
- รีเซ็ตรหัสผ่าน
- สร้างและจัดการคำขอเสนอบำเหน็จ
- เพิ่มบุคคลหลายคนต่อคำขอเดียว
- ติดตามสถานะการพิจารณา
- ผู้ดูแลระบบสามารถอนุมัติ/ปฏิเสธ

## 🏗️ สถาปัตยกรรม

```
┌─────────────────────────────────────────────────────┐
│              Frontend (Vue.js + Vite)               │
│              Hosted on Vercel                       │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS/API
┌──────────────────▼──────────────────────────────────┐
│         Google Apps Script Backend                  │
│    (REST API exposed as Web App)                   │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│         Google Sheets Database                      │
│     (Multiple sheets for data storage)             │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│            Google Drive (Files)                     │
└─────────────────────────────────────────────────────┘
```

## 📁 โครงสร้างโฟลเดอร์

```
psr-benefits-system/
├── frontend/
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.vue              ✅ เข้าสู่ระบบ
│   │   │   ├── Register.vue           ✅ ลงทะเบียน
│   │   │   ├── ForgotPassword.vue     ✅ ลืมรหัสผ่าน
│   │   │   └── ResetPassword.vue      ✅ รีเซ็ตรหัสผ่าน
│   │   ├── requests/
│   │   │   ├── CreateRequest.vue      ✅ สร้างคำขอ
│   │   │   ├── RequestList.vue        ✅ รายชื่อคำขอ
│   │   │   └── RequestDetail.vue      ✅ รายละเอียดคำขอ
│   │   ├── admin/
│   │   │   ├── AdminDashboard.vue     ✅ แดชบอร์ดผู้ดูแล
│   │   │   ├── UserApproval.vue       ✅ อนุมัติผู้ใช้
│   │   │   └── RequestReview.vue      ✅ พิจารณาคำขอ
│   │   └── Dashboard.vue              ✅ หน้าหลัก
│   ├── layouts/
│   │   ├── MainLayout.vue             ✅ layout หลัก
│   │   └── AuthLayout.vue             ✅ layout auth
│   ├── assets/
│   │   └── styles/
│   │       └── main.css               ✅ stylesheet
│   ├── router/
│   │   └── index.js                   ✅ Vue Router config
│   ├── store/
│   │   └── index.js                   ✅ Vuex store
│   ├── App.vue                        ✅ root component
│   ├── main.js                        ✅ entry point
│   └── index.html
├── google-apps-script/
│   ├── Code.gs                        ✅ Backend logic
│   └── README.md
├── .github/
│   └── workflows/
│       ├── deploy.yml                 ✅ Deploy workflow
│       └── quality.yml                ✅ Quality checks
├── package.json
├── vite.config.js
├── vercel.json
├── README.md                         ✅ Project README
├── QUICKSTART.md                     ✅ Quick start
├── GOOGLE_SHEET_SETUP.md             ✅ Sheet setup
├── GOOGLE_APPS_SCRIPT_SETUP.md      ✅ GAS setup
└── VERCEL_DEPLOYMENT.md              ✅ Vercel setup
```

## ✨ Features

### 🔐 Authentication System
- ✅ User Registration (สมัครสมาชิก)
- ✅ Login/Logout
- ✅ Forgot Password (ลืมรหัสผ่าน)
- ✅ Password Reset (รีเซ็ตรหัสผ่าน)
- ✅ Session management

### 👥 User Management
- ✅ Admin approval workflow
- ✅ User activation/deactivation
- ✅ Role-based access control
- ✅ User dashboard

### 📝 Benefits Request Form
- ✅ Multiple beneficiary support
- ✅ Dynamic dropdown fields:
  - สังกัด (Affiliation) - autocomplete
  - ประเภทภารกิจ (Mission Type)
  - ยุทธการ (Operation)
  - พื้นที่ (Area)
  - จังหวัด (Province) - autocomplete
  - ยศ (Rank) - autocomplete
  - ตำแหน่ง (Position) - autocomplete
  - ประเภทสูญเสีย (Loss Type)
  - เสนอบำเหน็จ (Benefit Level)

### 📋 Request Management
- ✅ Create/Edit/Delete requests
- ✅ Save as draft
- ✅ Submit for approval
- ✅ Track request status
- ✅ Add/Remove/Edit beneficiaries

### 🔄 Approval Workflow
- ✅ Timeline tracking
- ✅ Multi-step approval process
- ✅ Comments and notes
- ✅ Status updates
- ✅ Approval history

### 📊 Admin Dashboard
- ✅ Pending users count
- ✅ Pending requests count
- ✅ Approved requests statistics
- ✅ User management
- ✅ Request review

## 🔧 Technologies

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation build tool
- **Vue Router** - Client-side routing
- **Vuex** - State management
- **Axios** - HTTP client
- **CSS3** - Responsive styling

### Backend
- **Google Apps Script** - Serverless backend
- **Google Sheets API** - Database
- **Google Drive API** - File storage (ready to integrate)

### Deployment
- **GitHub** - Version control & CI/CD
- **Vercel** - Frontend hosting
- **Google Apps Script** - Backend hosting
- **Google Sheets** - Database
- **GitHub Actions** - CI/CD Pipeline

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 16+
npm or yarn
Git
GitHub Account
Google Account
Vercel Account
```

### Quick Setup
```bash
# 1. Clone repository
git clone <repo>
cd psr-system

# 2. Install dependencies
npm install

# 3. Create .env.local
echo "VITE_GAS_DEPLOYMENT_ID=<your-gas-url>" > .env.local
echo "VITE_GOOGLE_SHEET_ID=<your-sheet-id>" >> .env.local

# 4. Start development
npm run dev

# 5. Build for production
npm run build

# 6. Deploy
git push origin main
```

ดูไฟล์ `QUICKSTART.md` สำหรับการตั้งค่าโดยละเอียด

## 📱 Responsive Design

ระบบนี้ดีไซน์ให้ใช้ได้บน:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px)
- ✅ Tablet (768px)
- ✅ Mobile (320px+)

## 🔒 Security Features

- ✅ Password hashing (SHA-256)
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention (using GAS APIs)
- ✅ Role-based access control
- ✅ Token-based password reset

## 📊 Database Schema

### Users Table
- Email (ป.ค.)
- Password Hash
- Name, Nickname
- Unit (สังกัด)
- Registration Date
- Status (pending/approved/inactive)
- Role (user/admin)

### Requests Table
- Request ID
- User Email
- Mission Details
- Status
- Created Date

### Beneficiaries Table
- ยศ, ชื่อ, สกุล
- ตำแหน่ง
- ประเภทสูญเสีย
- เสนอบำเหน็จ
- คำสั่ง & วันที่

### Approvals Table
- Request ID
- Step/Action
- Reviewer
- Comment
- Status

## 🎯 API Endpoints

All endpoints POST to Google Apps Script Web App:

```javascript
// Authentication
POST ?action=register        // ลงทะเบียน
POST ?action=login           // เข้าสู่ระบบ
POST ?action=forgotPassword  // ลืมรหัสผ่าน
POST ?action=resetPassword   // รีเซ็ตรหัสผ่าน

// Admin
POST ?action=getPendingUsers     // ได้รับผู้ใช้รอ
POST ?action=approveUser         // อนุมัติผู้ใช้
POST ?action=rejectUser          // ปฏิเสธผู้ใช้

// Data
POST ?action=getMasterData           // ดาวน์โหลดข้อมูลมาสเตอร์
POST ?action=createBenefitsRequest   // สร้างคำขอ
POST ?action=addBeneficiary          // เพิ่มบุคคล

// Workflow
POST ?action=getWorkflowTimeline     // ติดตามสถานะ
POST ?action=submitRequest           // ส่งคำขอ
POST ?action=reviewRequest           // พิจารณาคำขอ
```

## 📈 Performance

- ✅ Optimized bundle size (< 300KB gzipped)
- ✅ Lazy loading for routes
- ✅ CSS optimization
- ✅ Image optimization
- ✅ Caching strategies

## 🔍 Monitoring

- ✅ GitHub Actions CI/CD logs
- ✅ Vercel deployment monitoring
- ✅ Error tracking
- ✅ Performance metrics

## 🛠️ Maintenance

### Regular Tasks
1. Monitor logs for errors
2. Back up Google Sheet regularly
3. Update dependencies: `npm update`
4. Review and manage users
5. Archive old requests

### Updates
```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Push changes
git add .
git commit -m "Update dependencies"
git push origin main
```

## 📞 Support Documents

- [README.md](./README.md) - Project overview
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [GOOGLE_SHEET_SETUP.md](./GOOGLE_SHEET_SETUP.md) - Database setup
- [GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md) - Backend setup
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Deployment guide
- [google-apps-script/README.md](./google-apps-script/README.md) - GAS API docs

## 🎓 Learning Resources

- [Vue.js Documentation](https://vuejs.org)
- [Vite Guide](https://vitejs.dev)
- [Google Apps Script](https://script.google.com)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions](https://github.com/features/actions)

## 📄 License

ISC License

## ✅ Implementation Checklist

- [x] Frontend UI components
- [x] Authentication system
- [x] User management
- [x] Request form with beneficiaries
- [x] Admin dashboard
- [x] Workflow/approval system
- [x] Responsive design
- [x] Google Apps Script backend
- [x] Google Sheet database schema
- [x] GitHub CI/CD workflows
- [x] Vercel deployment config
- [x] Documentation

## 🎉 Ready to Deploy!

ระบบนี้พร้อมสำหรับการนำไปใช้งานจริง ทำตามขั้นตอน QUICKSTART.md เพื่อเริ่มต้น

**Happy Coding! 🚀**
