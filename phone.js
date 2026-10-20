/* Телефон-симулятор: корпус в духе iPhone 7 (SVG), домашний экран, установка .ipa (иконка и имя из пакета) */
(() => {
const NS = 'http://www.w3.org/2000/svg';
const pad = n => String(n).padStart(2, '0');
const DAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

/* ---------- корпус: современный iPhone, тонкие рамки, Dynamic Island ---------- */
const BODY = `<svg class="ph-body" viewBox="0 0 430 880" aria-hidden="true">
<defs>
 <linearGradient id="phTi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a4a4e"/><stop offset=".5" stop-color="#2a2a2d"/><stop offset="1" stop-color="#3c3c40"/></linearGradient>
 <linearGradient id="phKey" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2a2d"/><stop offset=".5" stop-color="#4a4a4e"/><stop offset="1" stop-color="#2a2a2d"/></linearGradient>
</defs>
<rect x="0" y="150" width="4" height="30" rx="1.5" fill="url(#phKey)"/>
<rect x="0" y="212" width="4" height="58" rx="1.5" fill="url(#phKey)"/>
<rect x="0" y="284" width="4" height="58" rx="1.5" fill="url(#phKey)"/>
<rect x="426" y="240" width="4" height="92" rx="1.5" fill="url(#phKey)"/>
<rect x="3" y="0" width="424" height="880" rx="72" fill="url(#phTi)"/>
<rect x="5.5" y="2.5" width="419" height="875" rx="69.5" fill="#0b0b0c"/>
<rect x="5.5" y="2.5" width="419" height="875" rx="69.5" fill="none" stroke="#fff" stroke-opacity=".07"/>
</svg>`;
const ISLAND = `<div class="ph-island"><i></i></div>`;

/* ---------- иконки (свои, простые) ---------- */
const g = (bg, svg) => ({ bg, svg });
const ICONS = [
  ['Сообщения', g('linear-gradient(#6ee36a,#25b83a)', '<path d="M30 14c-10 0-18 6.5-18 14.5 0 4.6 2.6 8.7 6.7 11.3L17 46l7.4-3.5c1.8.4 3.6.7 5.6.7 10 0 18-6.5 18-14.5S40 14 30 14z" fill="#fff"/>')],
  ['Календарь', null],
  ['Фото', g('#fff', [0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => `<ellipse cx="30" cy="20" rx="6" ry="11" fill="${['#f5b400', '#f57b00', '#e8344c', '#b543d6', '#5a5ce6', '#2d9bf0', '#2bc25b', '#a6d61f'][i]}" opacity=".85" transform="rotate(${a} 30 30)" style="mix-blend-mode:multiply"/>`).join(''))],
  ['Камера', g('linear-gradient(#e6e6ea,#a9a9b0)', '<rect x="12" y="20" width="36" height="25" rx="5" fill="#2d2d30"/><rect x="23" y="16" width="14" height="6" rx="2" fill="#2d2d30"/><circle cx="30" cy="32.5" r="8.5" fill="#56565c" stroke="#e6e6ea" stroke-width="2"/><circle cx="30" cy="32.5" r="4.5" fill="#15151a"/>')],
  ['Погода', g('linear-gradient(#3a8ff0,#7fc3ff)', '<circle cx="24" cy="24" r="8" fill="#ffd94a"/><path d="M22 42h20a7 7 0 0 0 0-14 9 9 0 0 0-17 2 6 6 0 0 0-3 12z" fill="#fff"/>')],
  ['Часы', null],
  ['Карты', g('linear-gradient(135deg,#f3efe3 0 48%,#c9e7b4 48%)', '<path d="M8 40L52 18" stroke="#f2c14a" stroke-width="6"/><path d="M24 8v48" stroke="#fff" stroke-width="5"/><path d="M38 22l5 11-5-3-5 3z" fill="#2b7cf5"/>')],
  ['Заметки', g('linear-gradient(#fff 0 26%,#fff 26%)', '<rect x="0" y="0" width="60" height="16" fill="#f7cf3c"/>' + [24, 32, 40, 48].map(y => `<path d="M10 ${y}h40" stroke="#d9d9de" stroke-width="1.5"/>`).join(''))],
  ['Музыка', g('linear-gradient(#ff5a7a,#f2364f)', '<path d="M24 40V18l18-4v22" fill="none" stroke="#fff" stroke-width="3.5"/><ellipse cx="21" cy="41" rx="5" ry="4" fill="#fff"/><ellipse cx="39" cy="37" rx="5" ry="4" fill="#fff"/>')],
  ['Калькулятор', g('#1c1c1e', '<rect x="12" y="11" width="16" height="16" rx="4" fill="#a5a5aa"/><rect x="32" y="11" width="16" height="16" rx="4" fill="#ff9f0a"/><rect x="12" y="31" width="16" height="16" rx="4" fill="#505055"/><rect x="32" y="31" width="16" height="16" rx="4" fill="#ff9f0a"/>')],
  ['Файлы', g('#fff', '<path d="M10 19h14l4 4h22v22a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3z" fill="#3e9bf6"/><path d="M10 27h40" stroke="#76b8fb" stroke-width="2"/>')],
  ['Настройки', g('linear-gradient(#a8a8ae,#6c6c72)', '<g fill="#3a3a3e">' + Array.from({ length: 12 }, (_, i) => `<rect x="28" y="9" width="4" height="9" rx="1" transform="rotate(${i * 30} 30 30)"/>`).join('') + '</g><circle cx="30" cy="30" r="14" fill="#3a3a3e"/><circle cx="30" cy="30" r="9" fill="#a8a8ae"/><circle cx="30" cy="30" r="4" fill="#3a3a3e"/>')],
];
const DOCK = [
  ['Телефон', g('linear-gradient(#6ee36a,#25b83a)', '<path d="M21 14c2 0 4 6 4 8s-3 3-3 4c1 4 6 9 10 10 1 0 2-3 4-3s8 2 8 4c0 3-3 7-6 7-12 0-24-12-24-24 0-3 4-6 7-6z" fill="#fff"/>')],
  ['Браузер', g('linear-gradient(#fff,#e9e9ee)', '<circle cx="30" cy="30" r="20" fill="none" stroke="#2c8df5" stroke-width="3"/><path d="M38 22l-5 11-11 5 5-11z" fill="#ff3b30"/><path d="M38 22l-11 5 6 6z" fill="#e3e3e8"/>')],
  ['Почта', g('linear-gradient(#5ab0ff,#1a74f0)', '<rect x="12" y="18" width="36" height="24" rx="3" fill="#fff"/><path d="M12 20l18 13 18-13" fill="none" stroke="#1a74f0" stroke-width="2"/>')],
  ['Установка', g('linear-gradient(#2b2b30,#0c0c0e)', '<rect x="17" y="10" width="26" height="40" rx="5" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M30 20v15M24 29l6 6 6-6" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 44h10" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'), 'ipa'],
];
function calIcon(d) { return `<div class="ph-ic ph-cal"><b>${DAYS[d.getDay()]}</b><i>${d.getDate()}</i></div>`; }
function clockIcon(d) {
  const h = (d.getHours() % 12 + d.getMinutes() / 60) * 30, m = d.getMinutes() * 6, s = d.getSeconds() * 6;
  return `<div class="ph-ic" style="background:#fff"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="#fff"/>${Array.from({ length: 12 }, (_, i) => `<rect x="29.3" y="5" width="1.4" height="${i % 3 ? 3 : 5}" fill="#1c1c1e" transform="rotate(${i * 30} 30 30)"/>`).join('')}<path d="M30 30V16" stroke="#1c1c1e" stroke-width="2.6" stroke-linecap="round" transform="rotate(${h} 30 30)"/><path d="M30 30V9" stroke="#1c1c1e" stroke-width="1.8" stroke-linecap="round" transform="rotate(${m} 30 30)"/><path d="M30 34V8" stroke="#ff9500" stroke-width=".9" transform="rotate(${s} 30 30)"/><circle cx="30" cy="30" r="1.6" fill="#ff9500"/></svg></div>`;
}
const icon = (def, d) => def ? `<div class="ph-ic" style="background:${def.bg}"><svg viewBox="0 0 60 60">${def.svg}</svg></div>` : null;

/* ---------- чтение .ipa: zip → Info.plist + иконка ---------- */
async function inflate(buf) { const ds = new DecompressionStream('deflate-raw'); return new Uint8Array(await new Response(new Blob([buf]).stream().pipeThrough(ds)).arrayBuffer()); }
async function zipIndex(file) {
  const tail = new DataView(await file.slice(Math.max(0, file.size - 65558)).arrayBuffer());
  let e = -1; for (let i = tail.byteLength - 22; i >= 0; i--) if (tail.getUint32(i, true) === 0x06054b50) { e = i; break; }
  if (e < 0) throw new Error('Это не .ipa (не zip-архив)');
  const cdSize = tail.getUint32(e + 12, true), cdOff = tail.getUint32(e + 16, true);
  const cd = new DataView(await file.slice(cdOff, cdOff + cdSize).arrayBuffer()), dec = new TextDecoder(), out = [];
  for (let p = 0; p + 46 <= cd.byteLength && cd.getUint32(p, true) === 0x02014b50;) {
    const method = cd.getUint16(p + 10, true), csize = cd.getUint32(p + 20, true), usize = cd.getUint32(p + 24, true), nl = cd.getUint16(p + 28, true), xl = cd.getUint16(p + 30, true), cl = cd.getUint16(p + 32, true), off = cd.getUint32(p + 42, true);
    out.push({ name: dec.decode(new Uint8Array(cd.buffer, p + 46, nl)), method, csize, usize, off }); p += 46 + nl + xl + cl;
  }
  return out;
}
async function zipRead(file, en) {
  const h = new DataView(await file.slice(en.off, en.off + 30).arrayBuffer()), start = en.off + 30 + h.getUint16(26, true) + h.getUint16(28, true);
  const raw = await file.slice(start, start + en.csize).arrayBuffer();
  return en.method === 8 ? inflate(raw) : new Uint8Array(raw);
}
function plist(b) {
  const head = new TextDecoder().decode(b.slice(0, 8));
  if (head !== 'bplist00') { const d = new DOMParser().parseFromString(new TextDecoder().decode(b), 'text/xml'); const v = n => { if (!n) return; const t = n.tagName; if (t === 'dict') { const o = {}; const c = [...n.children]; for (let i = 0; i < c.length; i += 2) o[c[i].textContent] = v(c[i + 1]); return o; } if (t === 'array') return [...n.children].map(v); if (t === 'true') return true; if (t === 'false') return false; return n.textContent; }; return v(d.querySelector('plist > *')); }
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength), L = b.length, os = b[L - 26], rs = b[L - 25];
  const num = (o, n) => { let v = 0; for (let i = 0; i < n; i++) v = v * 256 + b[o + i]; return v; };
  const nObj = num(L - 24, 8), top = num(L - 16, 8), tbl = num(L - 8, 8), offs = Array.from({ length: nObj }, (_, i) => num(tbl + i * os, os));
  const obj = i => {
    let o = offs[i]; const m = b[o], t = m >> 4; let n = m & 15, p = o + 1;
    const len = () => { if (n === 15) { const s = 1 << (b[p] & 15); n = num(p + 1, s); p += 1 + s; } };
    if (t === 0) return m === 9; if (t === 1) return num(p, 1 << n); if (t === 2) return n === 3 ? dv.getFloat64(p) : dv.getFloat32(p);
    if (t === 4) { len(); return b.slice(p, p + n); } if (t === 5) { len(); return new TextDecoder('ascii').decode(b.slice(p, p + n)); }
    if (t === 6) { len(); let s = ''; for (let k = 0; k < n; k++) s += String.fromCharCode(dv.getUint16(p + k * 2)); return s; }
    if (t === 10) { len(); return Array.from({ length: n }, (_, k) => obj(num(p + k * rs, rs))); }
    if (t === 13) { len(); const r = {}; for (let k = 0; k < n; k++) r[obj(num(p + k * rs, rs))] = obj(num(p + (n + k) * rs, rs)); return r; }
    return null;
  };
  return obj(top);
}
/* PNG от Xcode («CgBI»): сырой deflate, BGRA, премультипликация — переводим в обычный */
async function pngURL(b) {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength); let p = 8, cg = false, w = 0, h = 0; const idat = [];
  while (p < b.length) { const n = dv.getUint32(p), t = String.fromCharCode(...b.slice(p + 4, p + 8)); if (t === 'CgBI') cg = true; if (t === 'IHDR') { w = dv.getUint32(p + 8); h = dv.getUint32(p + 12); } if (t === 'IDAT') idat.push(b.slice(p + 8, p + 8 + n)); if (t === 'IEND') break; p += 12 + n; }
  if (!cg) return URL.createObjectURL(new Blob([b], { type: 'image/png' }));
  const raw = await inflate(await new Blob(idat).arrayBuffer()), st = w * 4, px = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) { const f = raw[y * (st + 1)], r = y * (st + 1) + 1;
    for (let x = 0; x < st; x++) { const a = x >= 4 ? px[y * st + x - 4] : 0, up = y ? px[(y - 1) * st + x] : 0, c = x >= 4 && y ? px[(y - 1) * st + x - 4] : 0; let v = raw[r + x];
      if (f === 1) v += a; else if (f === 2) v += up; else if (f === 3) v += (a + up) >> 1; else if (f === 4) { const q = a + up - c, pa = Math.abs(q - a), pb = Math.abs(q - up), pc = Math.abs(q - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? up : c; }
      px[y * st + x] = v & 255; } }
  for (let i = 0; i < px.length; i += 4) { const B = px[i], A = px[i + 3] || 255; px[i] = px[i + 2] * 255 / A; px[i + 1] = px[i + 1] * 255 / A; px[i + 2] = B * 255 / A; }
  const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').putImageData(new ImageData(px, w, h), 0, 0); return c.toDataURL();
}
async function readIPA(file, progress) {
  const ents = await zipIndex(file); progress(.25);
  const ip = ents.find(e => /^Payload\/[^/]+\.app\/Info\.plist$/.test(e.name)); if (!ip) throw new Error('В архиве нет Payload/*.app/Info.plist');
  const dir = ip.name.slice(0, -10), info = plist(await zipRead(file, ip)); progress(.5);
  const names = [...new Set([...(info.CFBundleIcons?.CFBundlePrimaryIcon?.CFBundleIconFiles || []), ...(info['CFBundleIcons~ipad']?.CFBundlePrimaryIcon?.CFBundleIconFiles || []), ...(info.CFBundleIconFiles || []), info.CFBundleIconFile].filter(Boolean))];
  let cand = ents.filter(e => e.name.startsWith(dir) && !e.name.slice(dir.length).includes('/') && /\.png$/i.test(e.name) && (names.some(n => e.name.slice(dir.length).startsWith(n)) || /icon/i.test(e.name)));
  cand.sort((a, b) => b.usize - a.usize);
  const art = ents.find(e => e.name === 'iTunesArtwork' || e.name === 'iTunesArtwork@2x');
  let src = '';
  try { if (cand[0]) src = await pngURL(await zipRead(file, cand[0])); else if (art) src = URL.createObjectURL(new Blob([await zipRead(file, art)])); } catch (e) { }
  progress(.8);
  if (src) src = await new Promise(res => { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = c.height = 120; c.getContext('2d').drawImage(im, 0, 0, 120, 120); res(c.toDataURL('image/png')); }; im.onerror = () => res(''); im.src = src; });
  return { name: info.CFBundleDisplayName || info.CFBundleName || file.name.replace(/\.ipa$/i, ''), bundle: info.CFBundleIdentifier || '', version: info.CFBundleShortVersionString || info.CFBundleVersion || '', minOS: info.MinimumOSVersion || '', size: file.size, icon: src };
}

/* ---------- телефон ---------- */
function mount(el, opt) {
  const key = 'ph-apps:' + opt.id, load = () => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; } }, save = a => { try { localStorage.setItem(key, JSON.stringify(a)); } catch (e) { } };
  let apps = load(), jiggle = false, openApp = null, page = 0;
  const screens = opt.screens || [];
  el.innerHTML = `<div class="ph">${BODY}<div class="ph-scr"><div class="ph-in">
    <div class="ph-wall"></div>
    <div class="ph-sb"><b class="ph-time"></b><span class="ph-ind"><svg viewBox="0 0 18 12" width="17"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg viewBox="0 0 16 12" width="15"><path d="M8 11.5l2.6-2.9a3.8 3.8 0 0 0-5.2 0zM3.6 6.8a6.4 6.4 0 0 1 8.8 0l1.4-1.6a8.6 8.6 0 0 0-11.6 0zM.9 3.8a10.3 10.3 0 0 1 14.2 0L16.5 2.2a12.5 12.5 0 0 0-17 0z"/></svg><i class="ph-batt"></i></span></div>
    <div class="ph-grid"></div>
    <div class="ph-search"><svg viewBox="0 0 12 12" width="10"><circle cx="5" cy="5" r="3.8" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 8l3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>Поиск</div>
    <div class="ph-dock"></div>
    <div class="ph-app" hidden><div class="ph-splash"><div class="ph-sicon"></div><b></b><span></span></div><div class="ph-pages" hidden></div><div class="ph-pdots"></div></div>
    <div class="ph-sheet" hidden></div>
    <button class="ph-hi" aria-label="Домой"></button>
    <input type="file" accept=".ipa,application/octet-stream" hidden>
  </div>${ISLAND}</div></div>`;
  const $ = s => el.querySelector(s), inn = $('.ph-in'), file = $('input[type=file]'), appEl = $('.ph-app'), pages = $('.ph-pages'), sheet = $('.ph-sheet');
  const fit = () => { const w = $('.ph-scr').clientWidth; inn.style.transform = `scale(${w / 393})`; };
  new ResizeObserver(fit).observe($('.ph-scr')); fit();

  function cell(label, ic, attrs = '') { return `<div class="ph-cell" ${attrs}>${ic}<span>${label}</span></div>`; }
  function draw() {
    const d = new Date();
    $('.ph-time').textContent = `${d.getHours()}:${pad(d.getMinutes())}`;
    const sys = ICONS.map(([n, def]) => cell(n, n === 'Календарь' ? calIcon(d) : n === 'Часы' ? clockIcon(d) : icon(def)));
    const inst = apps.map((a, i) => cell(a.name, `<div class="ph-ic ph-user"${a.icon ? ` style="background-image:url(${a.icon})"` : ''}>${a.icon ? '' : `<em>${(a.name[0] || '?').toUpperCase()}</em>`}${a.prog != null ? `<svg class="ph-prog" viewBox="0 0 60 60"><circle cx="30" cy="30" r="13" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="${(a.prog * 81.7).toFixed(1)} 82" transform="rotate(-90 30 30)"/></svg>` : ''}<button class="ph-x" data-del="${i}" aria-label="Удалить">−</button></div>`, `data-app="${i}"`));
    $('.ph-grid').innerHTML = [...sys, ...inst].join('');
    $('.ph-dock').innerHTML = DOCK.map(([n, def, act]) => cell(n, icon(def), act ? `data-act="${act}"` : '')).join('');
    inn.classList.toggle('jiggle', jiggle);
  }
  draw(); const tick = setInterval(() => { if (!el.isConnected) return clearInterval(tick); if (!jiggle) draw(); }, 1000);

  /* приложение: экраны проекта, листаются тапом по краям или свайпом */
  function showPage(n) { page = Math.max(0, Math.min(screens.length - 1, n)); pages.style.transform = `translateX(${-page * 100}%)`; $('.ph-pdots').innerHTML = screens.map((_, k) => `<i${k === page ? ' class="on"' : ''}></i>`).join(''); }
  pages.innerHTML = screens.map(s => `<div class="ph-page">${s}</div>`).join('');
  const bounce = c => { c.classList.remove('tap'); void c.offsetWidth; c.classList.add('tap'); };
  function launch(i, c) {
    const a = apps[i]; if (!a || a.prog != null) return; openApp = a;
    const r = c.querySelector('.ph-ic').getBoundingClientRect(), s = inn.getBoundingClientRect(), k = s.width / 393;
    appEl.style.transformOrigin = `${(r.left + r.width / 2 - s.left) / k}px ${(r.top + r.height / 2 - s.top) / k}px`;
    $('.ph-sicon').style.backgroundImage = a.icon ? `url(${a.icon})` : ''; $('.ph-sicon').textContent = a.icon ? '' : a.name[0];
    $('.ph-splash b').textContent = a.name;
    $('.ph-splash span').textContent = [a.version && 'Версия ' + a.version, a.bundle].filter(Boolean).join('\n') + (screens.length ? '' : '\nЭкранов проекта пока нет');
    appEl.hidden = false; appEl.classList.remove('open', 'run'); void appEl.offsetWidth; appEl.classList.add('open');
    pages.hidden = true; $('.ph-pdots').innerHTML = '';
    if (screens.length) setTimeout(() => { if (openApp !== a) return; pages.hidden = false; appEl.classList.add('run'); showPage(0); }, 1100);
  }
  function home() {
    if (!sheet.hidden) { sheet.hidden = true; return; }
    if (jiggle) { jiggle = false; draw(); return; }
    if (!openApp) return; openApp = null; appEl.classList.remove('open'); appEl.classList.add('close');
    setTimeout(() => { appEl.hidden = true; appEl.classList.remove('close', 'run'); }, 300);
  }
  $('.ph-hi').onclick = home;
  let sx = null;
  appEl.addEventListener('pointerdown', e => { sx = e.clientX; });
  appEl.addEventListener('pointerup', e => {
    if (pages.hidden || sx == null) return; const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 30) return showPage(page + (dx < 0 ? 1 : -1));
    const r = appEl.getBoundingClientRect(); showPage(page + (e.clientX - r.left > r.width / 2 ? 1 : -1));
  });

  let pressT = 0;
  inn.addEventListener('pointerdown', e => { const c = e.target.closest('.ph-cell'); if (!c || openApp) return; pressT = setTimeout(() => { pressT = 0; if (apps.length) { jiggle = true; draw(); } }, 600); });
  inn.addEventListener('pointerup', () => clearTimeout(pressT));
  inn.addEventListener('click', e => {
    const x = e.target.closest('[data-del]'); if (x) { const i = +x.dataset.del; apps.splice(i, 1); save(apps.filter(a => a.prog == null)); if (!apps.length) jiggle = false; draw(); return; }
    const c = e.target.closest('.ph-cell'); if (!c) return;
    if (jiggle) { if (!x) { jiggle = false; draw(); } return; }
    if (c.dataset.act === 'ipa') { bounce(c); file.click(); return; }
    if (c.dataset.app != null) { launch(+c.dataset.app, c); return; }
    bounce(c);
  });
  file.onchange = async () => {
    const f = file.files[0]; file.value = ''; if (!f) return;
    const a = { name: f.name.replace(/\.ipa$/i, '').slice(0, 14), icon: '', prog: .05 }; apps.push(a); draw();
    const step = v => { a.prog = v; draw(); };
    try {
      Object.assign(a, await readIPA(f, step)); step(1);
      setTimeout(() => { delete a.prog; save(apps.filter(x => x.prog == null)); draw(); }, 350);
    } catch (err) {
      apps.splice(apps.indexOf(a), 1); draw();
      sheet.innerHTML = `<div class="ph-alert"><b>Не удалось установить</b><p>${String(err.message || err).replace(/</g, '&lt;')}</p><button>OK</button></div>`; sheet.hidden = false; sheet.querySelector('button').onclick = () => sheet.hidden = true;
    }
  };
}
window.Phone = { mount };
})();
