const crypto = require('crypto');
const GH = 'https://api.github.com/repos/qwekurasa/portfolio';
const PATH = /^img\/[a-z0-9_-]+\/[a-z0-9_.-]+\.(webp|jpe?g|png)$/;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const pw = process.env.ADMIN_PASSWORD || '', tk = process.env.GITHUB_TOKEN;
  const b = req.body || {}, a = Buffer.from(String(b.pw || '')), e = Buffer.from(pw);
  if (!pw || !tk) return res.status(500).json({ error: 'Не заданы ADMIN_PASSWORD / GITHUB_TOKEN в Vercel' });
  if (a.length !== e.length || !crypto.timingSafeEqual(a, e)) {
    await new Promise(r => setTimeout(r, 800));
    return res.status(401).json({ error: 'Неверный пароль' });
  }
  const gh = (p, o = {}) => fetch(GH + p, { ...o, headers: { Authorization: 'Bearer ' + tk, Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-admin' } })
    .then(async r => { const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.message || 'GitHub ' + r.status); return j; });
  try {
    if (b.op === 'check') return res.json({ ok: 1 });
    if (b.op === 'blob') return res.json(await gh('/git/blobs', { method: 'POST', body: JSON.stringify({ content: String(b.data), encoding: 'base64' }) }));
    if (b.op === 'commit') {
      const list = JSON.parse(b.json);
      if (!Array.isArray(list)) throw new Error('Неверные данные');
      const files = b.files || [], del = b.del || [];
      if (![...files.map(f => f.path), ...del].every(p => PATH.test(p))) throw new Error('Неверный путь файла');
      const ref = await gh('/git/ref/heads/main'), head = ref.object.sha, c = await gh('/git/commits/' + head);
      const tree = [
        { path: 'projects.js', mode: '100644', type: 'blob', content: 'window.CUSTOM=' + JSON.stringify(list, null, 1) + ';\n' },
        ...files.map(f => ({ path: f.path, mode: '100644', type: 'blob', sha: f.sha })),
        ...del.map(p => ({ path: p, mode: '100644', type: 'blob', sha: null })),
      ];
      const t = await gh('/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: c.tree.sha, tree }) });
      const nc = await gh('/git/commits', { method: 'POST', body: JSON.stringify({ message: String(b.msg || 'Админка: проекты').slice(0, 120), tree: t.sha, parents: [head] }) });
      await gh('/git/refs/heads/main', { method: 'PATCH', body: JSON.stringify({ sha: nc.sha }) });
      return res.json({ ok: 1 });
    }
    res.status(400).json({ error: 'Неизвестная операция' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
