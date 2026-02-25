# การตั้งค่า Vercel Deployment

คู่มือการปล่อยแอปพลิเคชั่นไปยัง Vercel

## 1. สร้างบัญชี Vercel

1. ไปที่ [Vercel.com](https://vercel.com)
2. ลงชื่อเข้าใช้ด้วย GitHub
3. สร้างช่องว่าง (Team)

## 2. ลิงก์ GitHub Repository

1. ผลักโค้ดไปยัง GitHub
2. ใน Vercel: + Add New > Project
3. เลือก GitHub repository
4. Vercel จะตรวจพบ Vue.js + Vite
5. ตั้งค่า Environment Variables

## 3. ตั้งค่า Environment Variables

ใน Vercel Project > Settings > Environment Variables:

```
VITE_GAS_DEPLOYMENT_ID=https://script.google.com/macros/d/{YOUR_DEPLOYMENT_ID}/usercontent
VITE_GOOGLE_SHEET_ID={YOUR_SHEET_ID}
```

## 4. ปรับแต่งการคอนฟิกเพื่อการสร้าง

ตรวจสอบ Framework: `Vue.js`
Build Command: `npm run build`
Output Directory: `dist`

## 5. ผลักและติดตั้ง

```bash
git push origin main
```

Vercel จะสร้างและปล่อยอัตโนมัติเมื่อบันทึกใหม่ที่มีการผลัก

## 6. ปรับแต่ง Domain

1. Project > Settings > Domains
2. เพิ่ม custom domain (เช่น psr-system.yourdomain.com)
3. ชี้ DNS ไปที่ Vercel nameservers

## การอวดรูป/Preview

- Production: `https://psr-system.vercel.app`
- Preview: สร้างอัตโนมัติสำหรับ PR
- Git branches: แต่ละสาขาจะได้ preview URL

## การแก้ไขปัญหา

### Build ล้มเหลว
- ตรวจสอบบันทึก Build ใน Vercel Dashboard
- ตรวจสอบ Node.js version: 18+
- ตรวจสอบ dependencies: `npm ci`

### Environment Variables ไม่ถูกเลือก
- Redeploy หลังตั้งค่า
- ล้างแคช: Vercel > Settings > Caching

### CORS Error สำหรับ GAS API
- ตรวจสอบ Deployment URL ก่อน
- ตรวจสอบส่วนหัวของ Response ใน GAS

## CI/CD Integration

GitHub Actions จะ:
1. ปลิ้นเมื่อ push
2. ตรวจสอบ Build
3. ปล่อยไปยัง Vercel อัตโนมัติ

ดู `.github/workflows/deploy.yml` สำหรับการตั้งค่า

## Monitoring

- ทำให้ Vercel Analytics เพื่อติดตามประสิทธิภาพ
- ตั้งค่าการแจ้งเตือนสำหรับ deployment failures
