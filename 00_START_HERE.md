# 📋 ระบบเสนอขอบำเหน็จความชอบ (พ.ส.ร.) - ภาพรวมสมบูรณ์

นี่คือเอกสารรวมสารสิ่งของสำหรับระบบเว็บแอปพลิเคชันครบถ้วนที่สร้างขึ้นสำหรับการจัดการคำขอบำเหน็จความชอบทหารไทย (พ.ส.ร.)

---

## 🎯 วัตถุประสงค์ของระบบ

ระบบนี้ให้บริการแบบเอ-เอ-วี (End-to-End):

1. **ลงทะเบียน** - ผู้ใช้งานใหม่สามารถลงทะเบียน
2. **การอนุมัติ** - ผู้ดูแลระบบพิจารณาและอนุมัติ
3. **เข้าสู่ระบบ** - ผู้ใช้เข้าถึงหน้า dashboard
4. **สร้างคำขอ** - เสนอขอบำเหน็จพร้อมรายชื่อบุคคล
5. **ส่งการพิจารณา** - ส่งคำขอให้ผู้ดูแลสอบทาน
6. **ติดตามสถานะ** - ดูสถานะการพิจารณาแบบ Real-time

---

## 📁 โครงสร้างไฟล์สมบูรณ์

```
psr-system/
│
├── 📄 Documentation Files
│   ├── README.md                    # หน้าแรกโครงการ
│   ├── QUICKSTART.md               # เริ่มต้นอย่างรวดเร็ว
│   ├── SETUP_INSTRUCTIONS.md       # ขั้นตอนการตั้งค่า (ที่สำคัญที่สุด!)
│   ├── GOOGLE_SHEET_SETUP.md       # ตั้งค่า Google Sheet
│   ├── GOOGLE_APPS_SCRIPT_SETUP.md # ตั้งค่า GAS Backend
│   ├── VERCEL_DEPLOYMENT.md        # ปล่อย Vercel
│   └── PROJECT_SUMMARY.md          # สรุปโครงการ
│
├── 📁 Frontend (Vue.js + Vite)
│   ├── index.html                  # HTML entry point
│   ├── main.js                     # JavaScript entry point
│   ├── App.vue                     # Root Vue component
│   │
│   ├── 📁 router/
│   │   └── index.js               # Vue Router configuration
│   │
│   ├── 📁 store/
│   │   └── index.js               # Vuex state management
│   │
│   ├── 📁 layouts/
│   │   ├── MainLayout.vue         # Main page layout
│   │   └── AuthLayout.vue         # Auth page layout
│   │
│   ├── 📁 pages/
│   │   ├── Dashboard.vue          # User dashboard
│   │   │
│   │   ├── 📁 auth/ (Authentication)
│   │   │   ├── Login.vue          # 🔐 Login page
│   │   │   ├── Register.vue       # 📝 Registration page
│   │   │   ├── ForgotPassword.vue # 🔑 Forgot password
│   │   │   └── ResetPassword.vue  # 🔄 Password reset
│   │   │
│   │   ├── 📁 requests/ (Request Management)
│   │   │   ├── CreateRequest.vue  # ✍️ Create new request
│   │   │   ├── RequestList.vue    # 📋 View all requests
│   │   │   └── RequestDetail.vue  # 👁️ View request details
│   │   │
│   │   └── 📁 admin/ (Admin Panel)
│   │       ├── AdminDashboard.vue # 👨‍💼 Admin main page
│   │       ├── UserApproval.vue   # ✅ Approve users
│   │       └── RequestReview.vue  # 📊 Review requests
│   │
│   └── 📁 assets/
│       └── styles/
│           └── main.css           # Global styling
│
├── 📁 Backend (Google Apps Script)
│   ├── Code.gs                    # Main backend code
│   └── README.md                  # Backend documentation
│
├── 📁 CI/CD Configuration
│   ├── .github/
│   │   └── workflows/
│   │       ├── deploy.yml         # Vercel deployment
│   │       └── quality.yml        # Code quality checks
│   │
│   ├── .gitignore                 # Git ignore file
│   ├── package.json               # npm dependencies
│   ├── vite.config.js             # Vite configuration
│   ├── vercel.json                # Vercel configuration
│   └── package-lock.json          # Dependency lock file
```

---

## 🔌 API Endpoints

ทั้ง POST ไปยัง Google Apps Script URL:

### Authentication APIs
```
POST ?action=register
POST ?action=login
POST ?action=forgotPassword
POST ?action=resetPassword
```

### Admin APIs
```
POST ?action=getPendingUsers
POST ?action=approveUser
POST ?action=rejectUser
```

### Request Management APIs
```
POST ?action=createBenefitsRequest
POST ?action=addBeneficiary
POST ?action=getBeneficiaries
POST ?action=submitRequest
```

### Approval Workflow APIs
```
POST ?action=getWorkflowTimeline
POST ?action=reviewRequest
```

### Master Data APIs
```
POST ?action=getMasterData
```

---

## 🗄️ Database Schema

ทั้งหมด 5 Google Sheets:

### 1. Users Sheet
- Email (Primary Key)
- Password Hash
- Name, Nickname, Unit
- Register Date
- Status (pending/approved/inactive)
- Role (user/admin)

### 2. Requests Sheet
- Request ID (Primary Key)
- User Email (Foreign Key)
- Affiliation, Mission Type, Operation
- Area, Province
- Created Date
- Status (draft/submitted/approved/rejected)

### 3. Beneficiaries Sheet
- Request ID (Foreign Key)
- Rank, First Name, Last Name
- Position
- Loss Type, Benefit Level
- Current Benefit Amount
- Orders, Order Date, Issued By
- Behavior Description

### 4. Approvals Sheet
- Request ID (Foreign Key)
- Step, Action
- Date, Reviewer
- Comment, Status

### 5. MasterData Sheet
- Category (rank, position, area, province)
- Value (ค่าอ้างอิง)

---

## 🎨 User Interface Components

### Pages (11 total)

**Public Pages (No Auth Required)**
- ✅ Login
- ✅ Register
- ✅ Forgot Password
- ✅ Reset Password

**User Pages (Auth Required)**
- ✅ Dashboard
- ✅ Create Request
- ✅ Request List
- ✅ Request Detail

**Admin Pages (Auth + Admin Role)**
- ✅ Admin Dashboard
- ✅ User Approval
- ✅ Request Review

### Components & Features

**Login/Register**
- Form validation
- Error messages
- Password confirmation
- Email verification (ready for email)

**Request Form**
- Multi-field form with autocomplete
- Dynamic dropdown lists
- Add/Edit/Delete beneficiaries in modal
- Save as draft
- Submit for approval

**Request View**
- View all request details
- Timeline sidebar with workflow steps
- Status badges
- Action buttons (Edit, Delete, Submit)

**Admin Panel**
- Dashboard with statistics
- User approval cards with rejection reasons
- Request review with approval decision
- Comments and feedback system

---

## 🚀 Technology Stack

### Frontend
- **Vue 3** - Reactive UI framework
- **Vite** - Modern build tool
- **Vue Router** - Client-side routing
- **Vuex** - State management
- **Axios** - HTTP requests
- **CSS3** - Responsive styling

### Backend
- **Google Apps Script** - Serverless backend
- **JavaScript ES6+** - Backend logic

### Database
- **Google Sheets** - Data storage
- **Google Drive** - File storage (ready to integrate)

### Deployment
- **GitHub** - Version control
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Frontend hosting
- **Google Apps Script** - Backend hosting

---

## 🔐 Security Implementation

✅ Password Hashing
- SHA-256 hashing algorithm
- Stored in database, never visible

✅ Session Management
- localStorage for client-side session
- JWT-ready architecture

✅ Input Validation
- Client-side validation
- Server-side validation in GAS

✅ Access Control
- Role-based access (user vs admin)
- Route guards for protected pages
- Admin-only endpoints

✅ CORS Protection
- Cross-origin headers configured
- Domain-specific access (when deployed)

---

## 📱 Responsive Design

**Breakpoints**
- 📱 Mobile: 320px - 640px
- 📱 Tablet: 640px - 1024px
- 💻 Desktop: 1024px+

**Features**
- Fluid layouts
- Touch-friendly buttons
- Mobile-optimized forms
- Collapsible navigation

---

## ⚡ Performance Optimizations

✅ Bundle Size
- Minified & gzipped
- Lazy route loading
- Code splitting

✅ Caching
- Service worker ready
- Browser cache headers
- CDN optimization (Vercel)

✅ Database Queries
- Efficient API calls
- Batch operations where possible
- Indexed searches

---

## 🔄 Workflow Process Flow

```
┌─────────────────────────────┐
│ 1. User Registration        │ → Status: pending
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│ 2. Admin Approves User      │ → Status: approved
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│ 3. User Creates Request     │ → Status: draft
│    - Add basic info         │
│    - Add beneficiaries      │
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│ 4. User Submits Request     │ → Status: submitted
│    Timeline entry: received │
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│ 5. Admin Reviews & Approves │ → Status: approved
│    - Reviews beneficiaries  │
│    - Approves benefit level │
│    - Timeline entry: approved
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│ 6. Request Complete         │
│    - Display approval page  │
│    - Print certificate      │
│    - Archive request        │
└─────────────────────────────┘
```

---

## 📊 Data Flow

```
┌──────────────────┐
│   User Page      │
│   (Vue.js)       │
└────────┬─────────┘
         │ HTTPS
         ▼
┌──────────────────┐
│   Vercel CDN     │
│   (Frontend)     │
└────────┬─────────┘
         │ HTTPS/JSON
         ▼
┌──────────────────┐
│   GAS Web App    │
│   (Backend)      │
└────────┬─────────┘
         │ APIs
         ▼
┌──────────────────┐
│  Google Sheets   │
│   (Database)     │
└──────────────────┘
```

---

## 🛠️ Development Workflow

### Local Development

```bash
npm run dev     # Start local dev server (port 5173)
```

### Building

```bash
npm run build   # Create optimized build in dist/
npm run preview # Preview production build locally
```

### Deployment

```
git push origin main 
    ↓
GitHub Actions trigger
    ↓
npm run build
    ↓
Vercel deploys dist/ files
    ↓
Live at https://psr-system.vercel.app
```

---

## 📝 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Project overview |
| QUICKSTART.md | Quick setup guide |
| SETUP_INSTRUCTIONS.md | 📌 Detailed step-by-step setup |
| GOOGLE_SHEET_SETUP.md | Database schema & setup |
| GOOGLE_APPS_SCRIPT_SETUP.md | Backend API setup |
| VERCEL_DEPLOYMENT.md | Deployment guide |
| PROJECT_SUMMARY.md | Full project documentation |

---

## ✅ Implementation Status

### Completed ✓
- [x] Frontend UI (11 pages)
- [x] Authentication system
- [x] User management
- [x] Request form with beneficiaries
- [x] Admin panel
- [x] Workflow/approval system
- [x] Google Apps Script backend
- [x] Google Sheet database
- [x] CI/CD pipeline
- [x] Deployment configuration
- [x] Documentation

### Ready for Deployment ✓
- [x] All features implemented
- [x] Error handling
- [x] Responsive design
- [x] Performance optimized

---

## 🎓 How to Get Started

1. **Read** [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Follow step-by-step
2. **Setup** Google Sheet & Apps Script
3. **Clone** the repository
4. **Configure** Environment variables
5. **Test** locally (`npm run dev`)
6. **Deploy** to Vercel

---

## 📞 Support & Resources

- Vue.js: https://vuejs.org/guide/
- Vite: https://vitejs.dev/
- Google Apps Script: https://developers.google.com/apps-script
- Vercel: https://vercel.com/docs

---

## 📄 License

ISC License - See LICENSE file

---

## 🎉 Summary

ระบบนี้เป็นการแก้ปัญหาแบบครบถ้วนสำหรับการจัดการคำขอบำเหน็จทหารไทย มีคุณสมบัติทั้งหมดที่จำเป็น:

✅ ง่ายต่อการใช้งาน
✅ ปลอดภัย
✅ ส่วนได้ส่วนเสีย
✅ สามารถปรับขนาดได้
✅ พร้อมปล่อยใช้งาน

**เริ่มต้นวันนี้จาก [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** 🚀

---

*สร้างด้วย ❤️ สำหรับระบบทหารไทย*
