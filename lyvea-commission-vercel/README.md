# LyveaV Eve · Commission Website (Vercel)

โครงสร้าง
- `public/index.html` หน้าเว็บทั้งหมด
- `api/playlist.js` ดึงวิดีโอ ชื่อ และภาพพรีวิวจากเพลย์ลิสต์ YouTube อัตโนมัติ
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
