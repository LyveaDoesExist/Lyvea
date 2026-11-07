// GET /api/playlist?list=PLAYLIST_ID -> รายการวิดีโอ (id, ชื่อ, ภาพพรีวิว) จาก YouTube Data API v3
// ต้องตั้ง Environment Variable: YOUTUBE_API_KEY  (และ PLAYLIST_ID เป็นค่าเริ่มต้น ถ้าต้องการ)
export default async function handler(req, res) {
  const key = process.env.YOUTUBE_API_KEY;
  const list = String(req.query.list || process.env.PLAYLIST_ID || '').trim();
  if (!key) return res.status(500).json({ error: 'ยังไม่ได้ตั้ง YOUTUBE_API_KEY' });
  if (!/^[\w-]{10,64}$/.test(list)) return res.status(400).json({ error: 'playlist id ไม่ถูกต้อง' });

  const items = [];
  let token = '';
  try {
    for (let page = 0; page < 6; page++) {
      const u = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
      const p = { part: 'snippet,contentDetails', maxResults: '50', playlistId: list, key };
      if (token) p.pageToken = token;
      u.search = new URLSearchParams(p).toString();
      const r = await fetch(u);
      const j = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: (j.error && j.error.message) || 'youtube error' });
      for (const it of j.items || []) {
        const sn = it.snippet;
        if (!sn || sn.title === 'Private video' || sn.title === 'Deleted video') continue;
        const id = (it.contentDetails && it.contentDetails.videoId) || (sn.resourceId && sn.resourceId.videoId);
        if (!id) continue;
        const th = sn.thumbnails || {};
        const t = th.maxres || th.standard || th.high || th.medium || th.default;
        items.push({ id, title: sn.title, thumb: (t && t.url) || `https://i.ytimg.com/vi/${id}/hqdefault.jpg` });
      }
      token = j.nextPageToken;
      if (!token) break;
    }
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
    return res.status(200).json({ items });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
