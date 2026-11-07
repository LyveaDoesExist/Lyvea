// GET  /api/data  -> ข้อมูลเว็บ (เรทการ์ด / Add-On / คิว / สถานะ) จาก Vercel Blob
// POST /api/data  -> บันทึกข้อมูล (ต้องส่งรหัสผ่านแอดมินใน header x-admin-password)
import { put, list } from '@vercel/blob';

const KEY = 'lyvea-data.json';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { blobs } = await list({ prefix: KEY, limit: 1 });
      if (!blobs.length) return res.status(404).json({ error: 'no data yet' });
      const r = await fetch(blobs[0].url + '?t=' + Date.now());
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(await r.json());
    }
    if (req.method === 'POST') {
      const pw = process.env.ADMIN_PASSWORD;
      if (!pw || req.headers['x-admin-password'] !== pw) {
        return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
      }
      const d = req.body;
      if (!d || !Array.isArray(d.tiers) || !Array.isArray(d.addon) || !Array.isArray(d.queue)) {
        return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
      }
      await put(KEY, JSON.stringify(d), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
        cacheControlMaxAge: 0,
      });
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
