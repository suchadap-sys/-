# ระบบประเมินความพึงพอใจการอบรม & แดชบอร์ดเรียลไทม์ (Live Training Satisfaction)

เว็บแอปพลิเคชันเก็บแบบประเมินความพึงพอใจการอบรม 5 ด้าน พร้อมระบบแสดงผลเรียลไทม์บนจอโปรเจกเตอร์

## โครงสร้างไฟล์ Standalone (HTML + JS + Firebase Realtime Database)

1. **`index.html`** (หน้าตอบแบบประเมินสำหรับผู้เข้าอบรม)
   - ออกแบบ Mobile-First ปุ่มสเกล 1-5 ขนาดใหญ่ กดง่ายด้วยนิ้วโป้ง
   - ช่องกรอกข้อเสนอแนะเพิ่มเติม (Optional)
   - ระบบป้องกันการตอบซ้ำในเครื่องเดียวกัน (Device Submission Lock ผ่าน localStorage)
   - ไม่ต้องล็อกอิน ไม่เก็บชื่อผู้ตอบ (Anonymous 100%)
   - มีเอฟเฟกต์ Confetti ฉลองเมื่อส่งแบบประเมิน

2. **`dashboard.html`** (หน้าแดชบอร์ดสรุปผลสำหรับขึ้นจอโปรเจกเตอร์)
   - รับข้อมูลและอัปเดตทันทีที่มีคนตอบ (Realtime Listener)
   - สรุปตัวเลขสำคัญ: จำนวนผู้ตอบ, คะแนนเฉลี่ยรวม (X̄ / 5.00), ส่วนเบี่ยงเบนมาตรฐาน (S.D.)
   - แปลผลอัตโนมัติตามเกณฑ์มาตรฐาน 5 ระดับ (มากที่สุด, มาก, ปานกลาง, น้อย, น้อยที่สุด)
   - กราฟแท่งเปรียบเทียบคะแนนเฉลี่ยรายข้อ 5 ด้าน
   - สัดส่วนการกระจายตัวของคะแนน 1 ถึง 5 ดาว
   - กระดานแสดงข้อเสนอแนะล่าสุดจากผู้เข้าอบรม
   - ปุ่มแสดง QR Code ขนาดใหญ่สำหรับฉายขึ้นจอให้ผู้เข้าอบรมสแกน
   - ปุ่มดาวน์โหลดผลการประเมินเป็นไฟล์ CSV (รองรับ UTF-8 BOM เปิดใน Microsoft Excel ภาษาไทยไม่เพี้ยน)
   - โหมดจอโปรเจกเตอร์ (Projector Contrast Mode) เพิ่มความคมชัดสำหรับห้องประชุม

---

## ขั้นตอนการตั้งค่า Firebase Realtime Database (ฟรี 100%)

### 1. สร้างโปรเจกต์ Firebase
1. ไปที่ [Firebase Console](https://console.firebase.google.com)
2. คลิก **Add project** และตั้งชื่อโปรเจกต์ เช่น `training-survey-2026`
3. ทำตามขั้นตอนจนสร้างโปรเจกต์สำเร็จ

### 2. สร้าง Realtime Database
1. ในแถบเมนูด้านซ้าย เลือก **Build** > **Realtime Database**
2. คลิก **Create Database**
3. เลือกตำแหน่งของฐานข้อมูล แนะนำเลือก **Singapore (asia-southeast1)** หรือ **United States (us-central1)**
4. คลิก Next และกด **Enable**

### 3. ตั้งค่า Security Rules
ไปที่แท็บ **Rules** แล้ววางโค้ดด้านล่างนี้ จากนั้นคลิก **Publish**:

```json
{
  "rules": {
    "responses": {
      ".read": true,
      ".write": true,
      "$response_id": {
        ".validate": "newData.hasChildren(['answers', 'timestamp'])"
      }
    }
  }
}
```

### 4. นำ Firebase Config มาใส่ในโค้ด
1. ไปที่รูปฟันเฟือง ⚙️ ด้านซ้ายบน > **Project settings**
2. ในหัวข้อ **Your apps** คลิกไอคอนเว็บ `</>`
3. ตั้งชื่อแอป เช่น `training-web` แล้วคลิก **Register app**
4. คัดลอกค่าใน `firebaseConfig` มาวางในไฟล์ `index.html` และ `dashboard.html` ตรงส่วน:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_DATABASE_NAME.asia-southeast1.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## วิธี Deploy ขึ้นออนไลน์ฟรี

### ตัวเลือกที่ 1: GitHub Pages (แนะนำ ง่ายที่สุด)
1. นำไฟล์ `index.html` และ `dashboard.html` ไปใส่ใน GitHub Repository
2. เข้าไปที่ **Settings > Pages**
3. เลือก Source เป็น Branch `main` โฟลเดอร์ `/ (root)` แล้วกด Save
4. จะได้ URL ฟรีทันที เช่น `https://username.github.io/my-survey/`

### ตัวเลือกที่ 2: Firebase Hosting
1. ติดตั้ง Firebase CLI: `npm install -g firebase-tools`
2. ล็อกอิน: `firebase login`
3. กำหนดค่า: `firebase init hosting` (เลือกใช้โฟลเดอร์ public และวางไฟล์ทั้ง 2 ไฟล์ในนั้น)
4. สั่ง Deploy: `firebase deploy`
