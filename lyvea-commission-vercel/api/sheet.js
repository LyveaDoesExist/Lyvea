// GET /api/sheet -> คิวงาน สถานะ และวันที่อัปเดต จาก Google Sheet (ต้องแชร์ชีตเป็น "ทุกคนที่มีลิงก์ ดูได้")
// ตั้งค่าเพิ่มได้ (ไม่บังคับ): SHEET_ID, SHEET_GID
import { parseSheet } from './_parse.js';

const DEFAULT_ID = '1WT_Rz7lt0D7-SI_inaWzPHbiok-E66sMjYZ7WCTyAdQ';

export default async function handler(req, res) {
  const id = process.env.SHEET_ID || DEFAULT_ID;
  const gid = process.env.SHEET_GID || '0';
  const urls = [
    `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`,
    `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&gid=${gid}`,
  ];
  let lastErr = 'unknown';
  for (const u of urls) {
    try {
      const r = await fetch(u, { redirect: 'follow' });
      const text = await r.text();
      if (!r.ok || /^\s*<(!doctype|html)/i.test(text)) { lastErr = 'ชีตยังไม่เปิดแชร์ หรือเข้าไม่ได้ (' + r.status + ')'; continue; }
      const data = parseSheet(text);
      if (!data.queue.length) { lastErr = 'อ่านคิวจากชีตไม่เจอ'; continue; }
      res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=20');
      return res.status(200).json(data);
    } catch (e) {
      lastErr = String((e && e.message) || e);
    }
  }
  return res.status(502).json({ error: lastErr });
}
