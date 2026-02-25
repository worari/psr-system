# Google Apps Script Configuration

This folder contains the Google Apps Script backend for the PSR Benefits System.

## Files

### Code.gs
Main Google Apps Script file containing all API endpoints and backend logic.

## Deployment

### 1. Create Google Apps Script Project
- Go to https://script.google.com
- Create a new project
- Copy the contents of `Code.gs` into the editor

### 2. Create Spreadsheet
- Create a new Google Sheet
- Rename it to a memorable name
- Add the following sheets:
  - Users
  - Requests
  - Approvals
  - Beneficiaries
  - MasterData

### 3. Link Script to Spreadsheet
- In Google Apps Script: Project Settings
- Copy the Script ID
- In Google Sheet: Tools > Script Editor (if needed to link)

### 4. Deploy as Web App
- In Google Apps Script: Deploy > New Deployment
- Select type: Web app
- Execute as: Your email
- Who has access: Anyone
- Copy the Deployment URL
- This is your API endpoint

### 5. Set Environment Variables
Update the following in your Vercel/Frontend:
```
VITE_GAS_DEPLOYMENT_ID=<Deployment URL>
VITE_GOOGLE_SHEET_ID=<Google Sheet ID>
```

## API Endpoints

All requests use POST with JSON body containing an `action` parameter.

### Authentication
- `register` - Register new user
- `login` - User login
- `forgotPassword` - Request password reset
- `resetPassword` - Reset password with token

### Admin
- `getPendingUsers` - Get pending approvals
- `approveUser` - Approve user registration
- `rejectUser` - Reject user registration

### Data Management
- `getMasterData` - Get dropdown data
- `createBenefitsRequest` - Create new request
- `addBeneficiary` - Add beneficiary to request
- `getBeneficiaries` - Get beneficiaries for request

### Workflow
- `getWorkflowTimeline` - Get approval timeline
- `submitRequest` - Submit request for approval
- `reviewRequest` - Add review comment

## Security Notes

- Implement proper authentication tokens (JWT recommended)
- Use CORS configuration
- Validate all inputs server-side
- Implement rate limiting
- Use HTTPS in production
- Never expose sensitive configuration
