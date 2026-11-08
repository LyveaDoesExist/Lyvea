# LyveaV Eve · Commission Website (Vercel)

โครงสร้าง
- `public/index.html` หน้าเว็บทั้งหมด
- `api/playlist.js` ดึงวิดีโอ ชื่อ และภาพพรีวิวจากเพลย์ลิสต์ YouTube อัตโนมัติ
- `api/sheet.js` อ่านคิวงาน สถานะ Open/Closed และวันที่อัปเดตจาก Google Sheet อัตโนมัติ
- `api/data.js` อ่าน/บันทึกข้อมูลเรทการ์ด Add-On คิว และสถานะ (เก็บใน Vercel Blob)

## วิธีปล่อยเว็บ
1. อัปโหลดโฟลเดอร์นี้ขึ้น GitHub (repo ใหม่) แล้วไปที่ vercel.com → Add New → Project → เลือก repo นั้น กด Deploy
   (หรือใช้ Vercel CLI: `npm i -g vercel` แล้วรัน `vercel` ในโฟลเดอร์นี้)
2. **YouTube API key**
   - เข้า console.cloud.google.com → สร้างโปรเจกต์ → APIs & Services → เปิด **YouTube Data API v3**
   - Credentials → Create credentials → API key → ในหัวข้อ Restrict key เลือก "YouTube Data API v3"
3. **Vercel Blob** (เก็บข้อมูลที่แก้ในหน้าเว็บ)
   - ในโปรเจกต์บน Vercel → Storage → Create → Blob → Connect to Project (ระบบจะเพิ่ม `BLOB_READ_WRITE_TOKEN` ให้เอง)
4. ตั้ง Environment Variables (Project → Settings → Environment Variables)
   | ชื่อ | ค่า |
   |---|---|
   | `YOUTUBE_API_KEY` | key จากข้อ 2 |
   | `ADMIN_PASSWORD` | รหัสผ่านที่ตั้งเองสำหรับหน้าแก้ไข |
   | `PLAYLIST_ID` | (ไม่บังคับ) `PLRZt4hTnFX_eRwNUb-hmVBrTNP-OSNfnY` |
5. กด Redeploy หนึ่งครั้งให้ค่าใหม่มีผล

## วิธีแก้ข้อมูลในเว็บ
เปิด `https://โดเมนของคุณ/#edit` → ใส่รหัสผ่านแอดมิน → แก้ Rate / Add-On / Queue / Showcase / สถานะ → กด "บันทึกและเผยแพร่"
(ครั้งแรกที่บันทึก ระบบจะสร้างไฟล์ข้อมูลใน Blob; ก่อนหน้านั้นเว็บใช้ข้อมูลเริ่มต้นที่ฝังในหน้า)

## หมายเหตุ
- ภาพพรีวิวและชื่อวิดีโอรีเฟรชเองทุกครึ่งชั่วโมง ถ้าเพิ่มวิดีโอใหม่ในเพลย์ลิสต์ จะขึ้นเองโดยไม่ต้องแก้เว็บ
- ถ้า API ใช้ไม่ได้ (เช่น ยังไม่ตั้ง key) หน้า Showcase จะแสดงรายการวิดีโอสำรองที่ฝังไว้ในหน้า

## ซิงก์คิวงานจาก Google Sheet
- เว็บอ่านแท็บ **Status** (แท็บแรกของชีต) ทุกครั้งที่มีคนเข้าเว็บ ผลถูกแคชไว้ประมาณ 10 วินาที และหน้าเว็บที่เปิดค้างไว้จะเช็กชีตซ้ำเองทุก 20 วินาที ดังนั้นแก้ชีตแล้วเว็บอัปเดตตามภายในประมาณครึ่งนาที
- **ต้องแชร์ชีตเป็น "ทุกคนที่มีลิงก์ ดูได้ (Anyone with the link: Viewer)"** ไม่งั้นเว็บอ่านไม่ได้ และจะใช้ข้อมูลที่บันทึกไว้ในหน้าแก้ไขแทน
- เว็บอ่านจากหัวตาราง `Name`, `Commission Type`, `Tier`, `Platform`, `Payment`, `Progressing`, `Month` อย่าเปลี่ยนชื่อหัวตารางเหล่านี้ ช่อง Progressing ใช้ค่า WIP / Briefing / on hold / Finished
- สถานะ Open/Closed อ่านจากข้อความ `Status : Open` และวันที่อัปเดตอ่านจากช่อง `Last Update (D/M/Y)` ในแท็บ Status
- หน้าคิวในเว็บแสดงเฉพาะคิวที่ยังไม่เสร็จก่อน (Active) กดปุ่ม Finished หรือ All เพื่อดูงานที่เสร็จแล้ว
- ถ้าเปลี่ยนไปใช้ชีตอื่น ตั้ง `SHEET_ID` (และ `SHEET_GID` ถ้าแท็บ Status ไม่ใช่แท็บแรก) ใน Environment Variables
- เรทการ์ด Tier และ Add-On ยังแก้ในหน้าแก้ไขของเว็บ (ยังไม่ซิงก์จากชีต)

## รูปโปรไฟล์พาร์ทเนอร์
การ์ดพาร์ทเนอร์ดึงรูปโปรไฟล์จากบัญชี X ผ่านบริการสาธารณะ unavatar.io (ฟรี ไม่ต้องมี token จำกัด 50 ครั้งต่อวันต่อผู้เข้าชมหนึ่งคน) รูปเปลี่ยนตามบัญชีจริงภายในประมาณ 1 ชั่วโมง ถ้าดึงไม่ได้จะแสดงตัวอักษรย่อแทน ไม่ต้องตั้งค่าอะไรเพิ่ม
