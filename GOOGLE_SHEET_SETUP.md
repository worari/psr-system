# การตั้งค่ากูเกิลชีต (Google Sheet)

ระบบเสนอขอบำเหน็จความชอบใช้ Google Sheet เป็นฐานข้อมูล คู่มือนี้จะอธิบายขั้นตอนการตั้งค่า

## 1. สร้าง Google Sheet

1. ไปที่ [Google Sheets](https://sheets.google.com/)
2. คลิก "New" และเลือก "Spreadsheet"
3. ตั้งชื่อเป็น "PSR-Benefits-System"
4. คลิกแชร์และตั้งค่าสิทธิ์:
   - ระดับองค์กร: "Anyone with the link" - Editor
   - ได้รับ Spreadsheet ID จาก URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

## 2. สร้างชีต

สร้างชีตต่อไปนี้โดยคลิกขวาที่แท็บล่าง:

### Sheet 1: Users

| Column | Type | Description |
|--------|------|-------------|
| A | Email | อีเมล |
| B | Password Hash | รหัสผ่านแบบ Hash |
| C | Name | ชื่อจริง |
| D | Nickname | ชื่อเล่น |
| E | Unit | สังกัด |
| F | Register Date | วันลงทะเบียน |
| G | Status | สถานะ (pending/approved/inactive) |
| H | Role | บทบาท (user/admin) |
| I | Reset Token | โทเค็นรีเซ็ต |
| J | Reset Expiry | หมดอายุรีเซ็ต |

### Sheet 2: Requests

| Column | Type | Description |
|--------|------|-------------|
| A | Request ID | หมายเลขคำขอ |
| B | User Email | อีเมลผู้ยื่น |
| C | Affiliation | สังกัด |
| D | Mission Type | ประเภทภารกิจ |
| E | Operation | ยุทธการ |
| F | Area | พื้นที่ |
| G | Province | จังหวัด |
| H | Created Date | วันที่สร้าง |
| I | Status | สถานะ (draft/submitted/approved/rejected) |

### Sheet 3: Beneficiaries

| Column | Type | Description |
|--------|------|-------------|
| A | Request ID | หมายเลขคำขอ |
| B | Rank | ยศ |
| C | First Name | ชื่อจริง |
| D | Last Name | สกุล |
| E | Position | ตำแหน่ง |
| F | Loss Type | ประเภทสูญเสีย |
| G | Benefit Level | เสนอบำเหน็จ |
| H | Current Benefit | ปัจจุบันรับ พ.ส.ร. |
| I | Orders | คำสั่งปฏิบัติหน้าที่ |
| J | Order Date | ลงวันที่ |
| K | Issued By | ออกโดย |
| L | Behavior | พฤติกรรมโดยย่อ |
| M | Created Date | วันที่เพิ่ม |

### Sheet 4: Approvals

| Column | Type | Description |
|--------|------|-------------|
| A | Request ID | หมายเลขคำขอ |
| B | Step | ขั้นตอน |
| C | Action | การดำเนินการ |
| D | Date | วันที่ |
| E | Reviewer | ผู้พิจารณา |
| F | Comment | ความเห็น |
| G | Status | สถานะ (pending/approved/rejected) |

### Sheet 5: MasterData

| Column | Type | Description |
|--------|------|-------------|
| A | Category | หมวดหมู่ |
| B | Value | ค่า |

กำหนดค่าดังนี้:

```
rank        พ.ตท.
rank        พ.ต.
rank        นาย
rank        จ่าสิบ
position    ผู้บัญชาการ
position    นักรบ
position    ยานุยการ
area        ช่องสายตะกู
area        ปราสาทตาเมือน
area        พระวิหาร
province    ตราด
province    สระแก้ว
province    อุบลราชธานี
```

## 3. ได้รับ Spreadsheet ID

นำ Spreadsheet ID ไปบันทึกไว้ใน `.env.local`:

```
VITE_GOOGLE_SHEET_ID=xxxxx
```

## 4. ตั้งค่าการแชร์

1. ให้สิทธิ์แก่ Google Apps Script เพื่อเข้าถึง Sheet
2. ตั้งค่าการสำรองข้อมูลประจำ (บน Drive Settings)
