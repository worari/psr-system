# ระบบเสนอขอบำเหน็จความชอบ (พ.ส.ร.)
## Thai Military Benefits Request System

### Overview
This is a comprehensive web application for managing Thai military personnel benefits (พ.ส.ร.) requests with approval workflows.

### Features
- **User Management**
  - User Registration and Sign-up
  - Login/Authentication
  - Password Reset
  - Admin approval workflow

- **Benefits Request Form**
  - Multiple beneficiary support (add/edit/delete)
  - Dynamic fields including:
    - Affiliation (สังกัด)
    - Mission Type (ประเภทภารกิจ)
    - Operation (ยุทธการ)
    - Area (พื้นที่)
    - Province (จังหวัด)
    - Rank, Name, Surname (ยศ/ชื่อ/สกุล)
    - Position (ตำแหน่ง)
    - Loss Type (ประเภทสูญเสีย)
    - Benefits Level (เสนอบำเหน็จ)
    - Current Benefits (ปัจจุบันรับ พ.ส.ร.)
    - Orders and Details

- **Workflow Management**
  - Timeline tracking
  - Admin review and approval
  - Status updates

### Tech Stack
- **Frontend**: Vue 3 + Vite
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **File Storage**: Google Drive
- **Deployment**: Vercel (Frontend) + Google Apps Script (Backend)
- **CI/CD**: GitHub Actions

### Project Structure
```
├── frontend/              # Vue.js application
├── google-apps-script/    # Google Apps Script backend
├── .github/workflows/     # CI/CD pipeline
├── package.json
├── vite.config.js
└── vercel.json
```

### Setup Instructions

#### Prerequisites
- Node.js 16+
- Google Account
- GitHub Account
- Vercel Account

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd psr-benefits-system
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Setup Google Apps Script
- Create a new Google Apps Script project
- Deploy as web app
- Configure deployment ID in environment variables

#### 4. Setup Google Sheet
- Create a new Google Sheet for database
- Set sharing permissions
- Configure Sheet ID in environment variables

#### 5. Development
```bash
npm run dev
```

#### 6. Build for Production
```bash
npm run build
```

#### 7. Deploy to Vercel
```bash
npm run deploy
```

### Environment Variables
Create `.env.local` file with:
```
VITE_GAS_DEPLOYMENT_ID=<Your Google Apps Script Deployment ID>
VITE_GOOGLE_SHEET_ID=<Your Google Sheet ID>
```

### Database Schema (Google Sheet)
- **Users Sheet**: User credentials and profiles
- **Requests Sheet**: Benefits request submissions
- **Approvals Sheet**: Approval workflow tracking
- **Beneficiaries Sheet**: Detailed beneficiary information
- **Master Data Sheet**: Rank, position, area dropdown data

### License
ISC

### Support
For issues or questions, please create an issue in the repository.
"# psr-system" 
