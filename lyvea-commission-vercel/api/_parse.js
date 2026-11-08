// ตัวอ่านข้อมูลจากชีต "Status" (CSV) -> { status, updated, queue }
export function parseCSV(t) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"') { if (t[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && t[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const PROG = { wip: 'WIP', briefing: 'Briefing', 'on hold': 'on hold', onhold: 'on hold', finished: 'Finished' };

export function parseSheet(text) {
  const rows = parseCSV(text);
  let status = '', updated = '';
  for (const r of rows) for (const c of r) {
    const s = /status\s*:\s*(open|closed)/i.exec(c);
    if (s && !status) status = s[1].toUpperCase();
    if (/last update/i.test(c) && !updated) {
      const d = /\d{1,2}\/\d{1,2}\/\d{4}/.exec(c);
      if (d) updated = d[0];
    }
  }
  const h = rows.findIndex((r) => r.some((c) => c.trim() === 'Name') && r.some((c) => /^progress/i.test(c.trim())));
  const queue = [];
  if (h >= 0) {
    const idx = (re) => rows[h].findIndex((c) => re.test(c.trim()));
    const iN = idx(/^name$/i), iT = idx(/commission type|^type$/i), iTi = idx(/^tier$/i), iPl = idx(/^platform$/i),
      iPa = idx(/^payment$/i), iPr = idx(/^progress/i), iM = idx(/^month$/i);
    for (const r of rows.slice(h + 1)) {
      const name = (r[iN] || '').trim();
      const prog = PROG[(r[iPr] || '').trim().toLowerCase()];
      if (!name || !prog) continue;
      const g = (i) => (i >= 0 ? (r[i] || '').trim() : '');
      queue.push([name, g(iT), g(iTi), g(iPl) || '-', g(iPa) || '-', prog, g(iM) || '—']);
    }
  }
  return { status, updated, queue };
}
