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

/* ---------- иконки: «жидкое стекло», белые глифы ---------- */
const GL = '<defs><linearGradient id="phG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".72"/></linearGradient></defs>';
const W = 'fill="url(#phG)"', L = 'fill="none" stroke="url(#phG)" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = [
  ['Сообщения', `<path d="M30 15c-9.4 0-17 6.2-17 13.8 0 4.4 2.5 8.2 6.4 10.8L18 46l7-3.3c1.6.4 3.3.6 5 .6 9.4 0 17-6.2 17-13.8S39.4 15 30 15z" ${W}/>`],
  ['Календарь', null],
  ['Фото', [0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => `<ellipse cx="30" cy="20.5" rx="5.2" ry="9.5" fill="#fff" opacity="${(.35 + i * .08).toFixed(2)}" transform="rotate(${a} 30 30)"/>`).join('')],
  ['Камера', `<path d="M14 22.5a3 3 0 0 1 3-3h5l2.6-3.5h10.8l2.6 3.5h5a3 3 0 0 1 3 3V41a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3z" ${L} stroke-width="2.6"/><circle cx="30" cy="31.5" r="6.8" ${L} stroke-width="2.6"/>`],
  ['Погода', `<circle cx="24" cy="24" r="7" ${W} opacity=".9"/><path d="M23 43h19a6.5 6.5 0 0 0 .6-13 8.6 8.6 0 0 0-16.3 2.1A5.5 5.5 0 0 0 23 43z" ${W}/>`],
  ['Часы', null],
  ['Карты', `<path d="M13 19l11-4 12 4 11-4v26l-11 4-12-4-11 4z" ${L} stroke-width="2.4"/><path d="M24 15v26M36 19v26" ${L} stroke-width="2" opacity=".6"/><path d="M41 23.5c0 3.6-4.5 8.5-4.5 8.5S32 27.1 32 23.5a4.5 4.5 0 0 1 9 0z" ${W}/>`],
  ['Заметки', `<rect x="15" y="13" width="30" height="34" rx="5" ${L} stroke-width="2.6"/><path d="M15 20.5h30" ${L} stroke-width="5" opacity=".9"/><path d="M21 29h18M21 35h18M21 41h11" ${L} stroke-width="2" opacity=".75"/>`],
  ['Музыка', `<path d="M25 40.5V19.5l17-3.6v20.6" ${L} stroke-width="3"/><ellipse cx="21.5" cy="40.5" rx="4.8" ry="3.9" ${W}/><ellipse cx="38.5" cy="37" rx="4.8" ry="3.9" ${W}/>`],
  ['Калькулятор', `<rect x="14" y="14" width="14" height="14" rx="4.5" ${W} opacity=".55"/><rect x="32" y="14" width="14" height="14" rx="4.5" ${W}/><rect x="14" y="32" width="14" height="14" rx="4.5" ${W} opacity=".55"/><rect x="32" y="32" width="14" height="14" rx="4.5" ${W}/><path d="M36 39h6M39 36v6" stroke="#000" stroke-opacity=".35" stroke-width="1.8" stroke-linecap="round"/>`],
  ['Файлы', `<path d="M13 20.5a3 3 0 0 1 3-3h9l3.5 4H44a3 3 0 0 1 3 3V41a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3z" ${W}/><path d="M13 27h34" stroke="#000" stroke-opacity=".18" stroke-width="1.5"/>`],
  ['Настройки', `<g ${W}>${Array.from({ length: 12 }, (_, i) => `<rect x="27.6" y="10" width="4.8" height="8" rx="1.6" transform="rotate(${i * 30} 30 30)"/>`).join('')}</g><circle cx="30" cy="30" r="13.5" ${W}/><circle cx="30" cy="30" r="6.5" fill="#000" fill-opacity=".38"/>`],
];
const DOCK = [
  ['Телефон', `<path d="M21.5 15c1.6 0 3.6 5.3 3.6 7.1 0 1.6-2.5 2.6-2.5 3.6.9 3.8 5.6 8.5 9.4 9.4 1 0 2-2.5 3.6-2.5 1.8 0 7.1 2 7.1 3.6 0 2.8-3 6.3-6 6.3C25.6 42.5 17.5 34.4 17.5 23.3c0-3 3.3-8.3 4-8.3z" ${W}/>`],
  ['Браузер', `<circle cx="30" cy="30" r="16" ${L} stroke-width="2.6"/><path d="M37 23l-4.4 9.6L23 37l4.4-9.6z" ${W}/><circle cx="30" cy="30" r="1.6" fill="#000" fill-opacity=".35"/>`],
  ['Почта', `<rect x="13" y="18" width="34" height="24" rx="4.5" ${L} stroke-width="2.6"/><path d="M14.5 20.5L30 32l15.5-11.5" ${L} stroke-width="2.6"/>`],
  ['Установка', `<rect x="19" y="12" width="22" height="36" rx="5.5" ${L} stroke-width="2.6"/><path d="M30 20v13M25 28.5l5 5 5-5" ${L} stroke-width="2.6"/><path d="M26.5 42.5h7" ${L} stroke-width="2.2"/>`, 'ipa'],
];
const glass = svg => `<div class="ph-ic gl"><svg viewBox="0 0 60 60">${GL}${svg}</svg></div>`;
const MON = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
function calIcon(d) { return glass(`<text x="30" y="21" text-anchor="middle" font-size="8.5" font-weight="700" letter-spacing=".5" fill="#ff6b62">${MON[(d.getDay() + 6) % 7]}</text><text x="30" y="45" text-anchor="middle" font-size="25" font-weight="300" ${W}>${d.getDate()}</text>`); }
function clockIcon(d) {
  const h = (d.getHours() % 12 + d.getMinutes() / 60) * 30, m = d.getMinutes() * 6, s = d.getSeconds() * 6;
  return glass(`<circle cx="30" cy="30" r="17" ${L} stroke-width="2.2" opacity=".85"/>${Array.from({ length: 12 }, (_, i) => `<rect x="29.4" y="15.5" width="1.2" height="${i % 3 ? 2 : 3.5}" fill="#fff" opacity=".7" transform="rotate(${i * 30} 30 30)"/>`).join('')}<path d="M30 30v-8" ${L} stroke-width="2.6" transform="rotate(${h} 30 30)"/><path d="M30 30V17.5" ${L} stroke-width="1.8" transform="rotate(${m} 30 30)"/><path d="M30 33V16" stroke="#ff9f0a" stroke-width=".9" transform="rotate(${s} 30 30)"/><circle cx="30" cy="30" r="1.5" fill="#ff9f0a"/>`);
}
const icon = svg => glass(svg);

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

/* иконка сайта: apple-touch-icon → favicon, иначе запасная */
function siteIcon(url, fb) {
  let o; try { o = new URL(url).origin; } catch (e) { return Promise.resolve(fb); }
  const c = [o + '/apple-touch-icon.png', o + '/apple-touch-icon-precomposed.png', o + '/icon-192.png', o + '/favicon.ico'];
  return new Promise(res => { const next = () => { const u = c.shift(); if (!u) return res(fb); const im = new Image(); im.onload = () => im.naturalWidth >= 32 ? res(u) : next(); im.onerror = next; im.src = u; }; next(); });
}

/* ---------- телефон ---------- */
function mount(el, opt) {
  const key = 'ph-apps:' + opt.id, load = () => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; } }, save = a => { try { localStorage.setItem(key, JSON.stringify(a)); } catch (e) { } };
  let apps = load(), jiggle = false, openApp = null, page = 0;
  const screens = opt.screens || [], builtin = opt.pwa ? { name: opt.name || 'App', icon: opt.icon || '', builtin: true } : null;
  el.innerHTML = `<div class="ph">${BODY}<div class="ph-scr"><div class="ph-in">
    <div class="ph-wall"></div>
    <div class="ph-sb"><b class="ph-time"></b><span class="ph-ind"><svg viewBox="0 0 18 12" width="17"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg viewBox="0 0 16 12" width="15"><path d="M8 11.5l2.6-2.9a3.8 3.8 0 0 0-5.2 0zM3.6 6.8a6.4 6.4 0 0 1 8.8 0l1.4-1.6a8.6 8.6 0 0 0-11.6 0zM.9 3.8a10.3 10.3 0 0 1 14.2 0L16.5 2.2a12.5 12.5 0 0 0-17 0z"/></svg><i class="ph-batt"></i></span></div>
    <div class="ph-grid"></div>
    <div class="ph-search"><svg viewBox="0 0 12 12" width="10"><circle cx="5" cy="5" r="3.8" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 8l3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>Поиск</div>
    <div class="ph-dock"></div>
    <div class="ph-app" hidden><div class="ph-splash"><div class="ph-sicon"></div><b></b><span></span></div><div class="ph-pages" hidden></div><div class="ph-pdots"></div><iframe class="ph-web" title="Приложение" allow="clipboard-write; fullscreen"></iframe></div>
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
    const sys = ICONS.map(([n, def]) => cell(n, n === 'Календарь' ? calIcon(d) : n === 'Часы' ? clockIcon(d) : icon(def), 'data-dim'));
    const userIc = a => `<div class="ph-ic ph-user"${a.icon ? ` style="background-image:url(&quot;${a.icon}&quot;)"` : ''}>${a.icon ? '' : `<em>${(a.name[0] || '?').toUpperCase()}</em>`}</div>`;
    if (builtin) sys.push(cell(builtin.name, userIc(builtin), 'data-app="b"'));
    const inst = apps.map((a, i) => cell(a.name, `<div class="ph-ic ph-user"${a.icon ? ` style="background-image:url(&quot;${a.icon}&quot;)"` : ''}>${a.icon ? '' : `<em>${(a.name[0] || '?').toUpperCase()}</em>`}${a.prog != null ? `<svg class="ph-prog" viewBox="0 0 60 60"><circle cx="30" cy="30" r="13" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="${(a.prog * 81.7).toFixed(1)} 82" transform="rotate(-90 30 30)"/></svg>` : ''}<button class="ph-x" data-del="${i}" aria-label="Удалить">−</button></div>`, `data-app="${i}"`));
    $('.ph-grid').innerHTML = [...sys, ...inst].join('');
    $('.ph-dock').innerHTML = DOCK.map(([n, def, act]) => cell(n, icon(def), act ? `data-act="${act}"` : 'data-dim')).join('');
    inn.classList.toggle('jiggle', jiggle);
  }
  if (builtin) siteIcon(opt.pwa, opt.icon || '').then(u => { builtin.icon = u; draw(); });
  draw(); const tick = setInterval(() => { if (!el.isConnected) return clearInterval(tick); if (!jiggle) draw(); }, 1000);

  /* приложение: экраны проекта, листаются тапом по краям или свайпом */
  function showPage(n) { page = Math.max(0, Math.min(screens.length - 1, n)); pages.style.transform = `translateX(${-page * 100}%)`; $('.ph-pdots').innerHTML = screens.map((_, k) => `<i${k === page ? ' class="on"' : ''}></i>`).join(''); }
  pages.innerHTML = screens.map(s => `<div class="ph-page">${s}</div>`).join('');
  const bounce = c => { c.classList.remove('tap'); void c.offsetWidth; c.classList.add('tap'); };
  const web = $('.ph-web');
  function launch(a, c) {
    if (!a || a.prog != null) return; openApp = a;
    const r = c.querySelector('.ph-ic').getBoundingClientRect(), s = inn.getBoundingClientRect(), k = s.width / 393;
    appEl.style.transformOrigin = `${(r.left + r.width / 2 - s.left) / k}px ${(r.top + r.height / 2 - s.top) / k}px`;
    $('.ph-sicon').style.backgroundImage = a.icon ? `url("${a.icon}")` : ''; $('.ph-sicon').textContent = a.icon ? '' : a.name[0];
    $('.ph-splash b').textContent = a.name;
    $('.ph-splash span').textContent = [a.version && 'Версия ' + a.version, a.bundle].filter(Boolean).join('\n') + (a.url || opt.pwa || screens.length ? '' : '\nЭкранов проекта пока нет');
    appEl.hidden = false; appEl.classList.remove('open', 'run'); void appEl.offsetWidth; appEl.classList.add('open');
    pages.hidden = true; $('.ph-pdots').innerHTML = '';
    const url = a.url || opt.pwa;
    if (url) {                                   // PWA: живое web-приложение в мобильной ширине 393 px
      const show = () => { if (openApp !== a) return; web.classList.add('on'); appEl.classList.add('run'); };
      if (web.dataset.url === url) setTimeout(show, 250);
      else { web.dataset.url = url; web.onload = () => setTimeout(show, 300); web.src = url; setTimeout(show, 4000); }
    } else if (screens.length) setTimeout(() => { if (openApp !== a) return; pages.hidden = false; appEl.classList.add('run'); showPage(0); }, 1100);
  }
  function home() {
    if (!sheet.hidden) { sheet.hidden = true; return; }
    if (jiggle) { jiggle = false; draw(); return; }
    if (!openApp) return; openApp = null; appEl.classList.remove('open'); appEl.classList.add('close');
    setTimeout(() => { appEl.hidden = true; appEl.classList.remove('close', 'run'); if (web) web.classList.remove('on'); }, 300);
  }
  $('.ph-hi').onclick = home;
  let sx = null;
  appEl.addEventListener('pointerdown', e => { sx = e.clientX; });
  appEl.addEventListener('pointerup', e => {
    if (pages.hidden || sx == null || (web && web.classList.contains('on'))) return; const dx = e.clientX - sx; sx = null;
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
    if (c.dataset.act === 'ipa') { bounce(c); installSheet(); return; }
    if (c.dataset.app != null) { launch(c.dataset.app === 'b' ? builtin : apps[+c.dataset.app], c); return; }
    bounce(c);
  });
  function alert(t, m) { sheet.onclick = null; sheet.innerHTML = `<div class="ph-alert"><b>${t}</b><p>${m}</p><button>OK</button></div>`; sheet.hidden = false; sheet.querySelector('button').onclick = () => sheet.hidden = true; }
  function installSheet() {
    sheet.innerHTML = `<div class="ph-acts"><div class="ph-actg"><p>Установить приложение</p><button data-k="ipa">Файл .ipa</button><button data-k="web">Web-приложение по ссылке</button></div><div class="ph-actg"><button data-k="x"><b>Отменить</b></button></div></div>`;
    sheet.hidden = false;
    sheet.onclick = e => { const k = e.target.closest('button')?.dataset.k; if (e.target === sheet || k === 'x') sheet.hidden = true; if (k === 'ipa') { sheet.hidden = true; file.click(); } if (k === 'web') webForm(); };
  }
  function webForm() {
    sheet.innerHTML = `<form class="ph-alert ph-form"><b>Web-приложение</b><p>Ссылка на сайт — он установится как приложение на экран «Домой»</p><input name="u" inputmode="url" autocapitalize="off" autocomplete="off" placeholder="https://…" required><input name="n" placeholder="Название (необязательно)" maxlength="16"><div><button type="button" data-k="x">Отменить</button><button type="submit"><b>Добавить</b></button></div></form>`;
    sheet.onclick = e => { if (e.target === sheet || e.target.closest('[data-k=x]')) sheet.hidden = true; };
    const f = sheet.querySelector('form'); setTimeout(() => f.u.focus(), 50);
    f.onsubmit = async e => {
      e.preventDefault(); let u = f.u.value.trim(); if (!/^https?:\/\//.test(u)) u = 'https://' + u;
      let host; try { host = new URL(u).hostname.replace(/^www\./, ''); } catch (er) { return; }
      const a = { name: (f.n.value.trim() || host.split('.')[0]).slice(0, 16), url: u, icon: '', prog: .3 }; sheet.hidden = true; apps.push(a); draw();
      a.icon = await siteIcon(u, ''); a.prog = 1; draw(); setTimeout(() => { delete a.prog; save(apps.filter(x => x.prog == null)); draw(); }, 300);
    };
  }
  file.onchange = async () => {
    const f = file.files[0]; file.value = ''; if (!f) return;
    const a = { name: f.name.replace(/\.ipa$/i, '').slice(0, 14), icon: '', prog: .05 }; apps.push(a); draw();
    const step = v => { a.prog = v; draw(); };
    try {
      Object.assign(a, await readIPA(f, step)); step(1);
      setTimeout(() => { delete a.prog; save(apps.filter(x => x.prog == null)); draw(); }, 350);
    } catch (err) {
      apps.splice(apps.indexOf(a), 1); draw();
      alert('Не удалось установить', String(err.message || err).replace(/</g, '&lt;'));
    }
  };
}
/* ---------- iPad: тонкие ровные рамки, камера в рамке, Safari с сайтом ---------- */
const PAD = `<svg class="ph-body" viewBox="0 0 640 880" aria-hidden="true">
<defs><linearGradient id="pdTi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a4a4e"/><stop offset=".5" stop-color="#2a2a2d"/><stop offset="1" stop-color="#3c3c40"/></linearGradient>
<linearGradient id="pdKey" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a2d"/><stop offset=".5" stop-color="#4a4a4e"/><stop offset="1" stop-color="#2a2a2d"/></linearGradient>
<radialGradient id="pdLens" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#2a3150"/><stop offset="1" stop-color="#000"/></radialGradient></defs>
<rect x="486" y="0" width="64" height="4" rx="1.5" fill="url(#pdKey)"/>
<rect x="636" y="96" width="4" height="56" rx="1.5" fill="url(#pdKey)"/><rect x="636" y="160" width="4" height="56" rx="1.5" fill="url(#pdKey)"/>
<rect x="2" y="2" width="634" height="876" rx="40" fill="url(#pdTi)"/>
<rect x="4.5" y="4.5" width="629" height="871" rx="37.5" fill="#0b0b0c"/>
<rect x="4.5" y="4.5" width="629" height="871" rx="37.5" fill="none" stroke="#fff" stroke-opacity=".07"/>
<circle cx="319" cy="16" r="3.4" fill="url(#pdLens)" stroke="#1f1f22"/>
</svg>`;
function mountPad(el, opt) {
  let host = ''; try { host = new URL(opt.url).hostname.replace(/^www\./, ''); } catch (e) { }
  el.innerHTML = `<div class="ph pd">${PAD}<div class="pd-scr"><div class="pd-in">
    <div class="pd-sb"><b class="pd-time"></b><span class="pd-date"></span><span class="ph-ind"><svg viewBox="0 0 16 12" width="15"><path d="M8 11.5l2.6-2.9a3.8 3.8 0 0 0-5.2 0zM3.6 6.8a6.4 6.4 0 0 1 8.8 0l1.4-1.6a8.6 8.6 0 0 0-11.6 0zM.9 3.8a10.3 10.3 0 0 1 14.2 0L16.5 2.2a12.5 12.5 0 0 0-17 0z"/></svg>100%<i class="ph-batt"></i></span></div>
    <div class="pd-bar"><span class="pd-tool"><svg viewBox="0 0 20 16" width="19"><rect x="1" y="1" width="18" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7 1v14" stroke="currentColor" stroke-width="1.6"/></svg></span><span class="pd-tool"><svg viewBox="0 0 10 16" width="10"><path d="M8 2L2 8l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="pd-tool dim"><svg viewBox="0 0 10 16" width="10"><path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <div class="pd-url"><svg viewBox="0 0 10 12" width="9"><rect x="1" y="5" width="8" height="6.5" rx="1.3" fill="currentColor"/><path d="M2.8 5V3.6a2.2 2.2 0 0 1 4.4 0V5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg><span>${host}</span><button class="pd-re" aria-label="Обновить"><svg viewBox="0 0 16 16" width="13"><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v3h-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
      <span class="pd-tool"><svg viewBox="0 0 16 18" width="15"><path d="M8 1v11M4 5l4-4 4 4M2.5 8.5v8h11v-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="pd-tool"><svg viewBox="0 0 16 16" width="15"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span><span class="pd-tool"><svg viewBox="0 0 18 16" width="17"><rect x="1" y="4" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 1h10a2 2 0 0 1 2 2v9" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span></div>
    <div class="pd-load"></div><iframe class="pd-web" title="Сайт" src="${opt.url}"></iframe>
    <div class="pd-hi"></div>
  </div></div></div>`;
  const $ = s => el.querySelector(s), inn = $('.pd-in'), fr = $('.pd-web'), ld = $('.pd-load');
  const fit = () => { inn.style.transform = `scale(${$('.pd-scr').clientWidth / 820})`; }; new ResizeObserver(fit).observe($('.pd-scr')); fit();
  const go = () => { ld.classList.remove('done'); void ld.offsetWidth; ld.classList.add('run'); };
  fr.onload = () => { ld.classList.add('done'); }; go();
  $('.pd-re').onclick = () => { go(); fr.src = opt.url; };
  const MO = ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'], WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const tick = () => { if (!el.isConnected) return clearInterval(iv); const d = new Date(); $('.pd-time').textContent = `${d.getHours()}:${pad(d.getMinutes())}`; $('.pd-date').textContent = `${WD[d.getDay()]} ${d.getDate()} ${MO[d.getMonth()]}`; };
  const iv = setInterval(tick, 1000); tick();
}
window.Phone = { mount, mountPad };
})();
