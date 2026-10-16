/* Пиксельный qwekurasa: поза собирается из суставов, растеризуется в сетку пикселей и выводится в SVG */
(() => {
const sv = document.getElementById('hero'), txt = document.getElementById('heroText'), NS = 'http://www.w3.org/2000/svg';
const PAL = ['', '#140e0c', '#5e3420', '#84502e', '#f1cfbb', '#d6a58f', '#1d1d22', '#383840', '#2c3242', '#40485c', '#151515', '#e9e9e9', '#2a1610', '#f3bfe2', '#ff5a1f', '#b9746a', '#6e4327', '#8f5b37', '#4f2e1a', '#4a4a53'];
// 16-18 кожанка, 19 надпись на футболке; 1 контур, 2-3 волосы, 4-5 кожа, 6-7 футболка, 8-9 джинсы, 10 обувь, 11 подошва, 12 глаза, 13 сигарета, 14 огонёк, 15 рот
const MAP = { K: 1, H: 2, h: 3, S: 4, s: 5, E: 12, m: 15 };
const HEAD_F = [
  '...K.KK..KK.K.....',
  '..KhKHhKKhHKhKK...',
  '.KHHhHHHHHHHHhHK..',
  'KhHHHHHhHHHHHHHhK.',
  'KHHhHHHHHHhHHHHHK.',
  'KHHHHHHHHHHHHhHHHK',
  'KhHHhHHHHHHHHHHhHK',
  'KHHHSHHhHHHSHHHHK.',
  'KHhSSSSHSSSSSSHhK.',
  'KHHSSSSSSSSSSSHHK.',
  '.KHSKESSSSSKESHK..',
  '.KHSSESSSSSSESHhK.',
  '.KhSSSSSssSSSSHHK.',
  '.KHHSSSSSSSSSSHK..',
  '..KHSSSSmmSSSHK...',
  '..KHKSSSSSSSKHK...',
  '...K.KKSSSKK.K....'];
const HEAD_S = [
  '......K.KK.K......',
  '....KKhKHhKKK.....',
  '...KHHHHHHHHhK....',
  '..KHHhHHHHHHHHK...',
  '.KhHHHHHHHhHHHHK..',
  '.KHSHHHHHHHHHhHK..',
  'KhSSHHHHHHHHHHHHK.',
  'KSSSSSHHHHHhHHHK..',
  'KSSSSSSHHHHHHHHK..',
  'KKESSSSHHHHHHhK...',
  'KSESSSSShHHHHHK...',
  '.KSSSSSSHHHHHK....',
  'KsSSSSSSHHHhK.....',
  'KmSSSSSSSHHK......',
  '.KSSSSSSSHK.......',
  '..KKSSSSKK........',
  '....KKSSK.........'];
const parseHead = a => a.map(r => [...r].map(c => MAP[c] || 0));
const HF = parseHead(HEAD_F), HS = parseHead(HEAD_S);

const GW = 72, GH = 104, OX = 36, OY = 66;           // локальная сетка, таз в (OX,OY)
const buf = new Uint8Array(GW * GH);
const put = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < GW && y < GH) buf[y * GW + x] = c; };
function seg(a, b, r, c) {
  const x0 = Math.floor(Math.min(a[0], b[0]) - r - 1) + OX, x1 = Math.ceil(Math.max(a[0], b[0]) + r + 1) + OX, y0 = Math.floor(Math.min(a[1], b[1]) - r - 1) + OY, y1 = Math.ceil(Math.max(a[1], b[1]) + r + 1) + OY;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy || 1;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const px = x + .5 - OX, py = y + .5 - OY; let t = ((px - a[0]) * dx + (py - a[1]) * dy) / L; t = t < 0 ? 0 : t > 1 ? 1 : t;
    const ex = a[0] + dx * t - px, ey = a[1] + dy * t - py; if (ex * ex + ey * ey <= r * r && x >= 0 && y >= 0 && x < GW && y < GH) buf[y * GW + x] = c;
  }
}
function poly(P, c) {
  const ys = P.map(p => p[1]), y0 = Math.floor(Math.min(...ys)), y1 = Math.ceil(Math.max(...ys));
  for (let y = y0; y <= y1; y++) { const py = y + .5; const xs = [];
    for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; if ((a[1] <= py) !== (b[1] <= py)) xs.push(a[0] + (py - a[1]) / (b[1] - a[1]) * (b[0] - a[0])); }
    xs.sort((m, n) => m - n); for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) put(x + OX, y + OY, c); }
}
const sprite = (S, x, y, flip) => S.forEach((r, j) => r.forEach((c, i) => { if (c) put(OX + x + (flip ? r.length - 1 - i : i), OY + y + j, c); }));

const R = { TOR: 19, SHW: 6, HIP: 2.6, UA: 8.5, FA: 7.5, HAND: 2, TH: 12.5, SH: 12 };
const dir = a => [Math.sin(a), Math.cos(a)], add = (p, a, l) => { const d = dir(a); return [p[0] + d[0] * l, p[1] + d[1] * l]; };
function fk(p) {
  const sy = -R.TOR + (p.br || 0), side = p.side, shw = side ? 1 : R.SHW;
  const ln = p.ln || 0, arm = (x, a) => { const s = [x + ln, sy + 2], e = add(s, a[0], R.UA), w = add(e, a[0] + a[1], R.FA); return { s, e, w, h: add(w, a[0] + a[1], R.HAND) }; };
  const leg = (x, l, ft) => { const hp = [x, 1], k = 1 - .2 * ft, kn = add(hp, l[0], R.TH * k), an = add(kn, l[0] + l[1], R.SH * k); return { hp, kn, an }; };
  const hx = side ? .5 : R.HIP;
  return { sy, aL: arm(-shw, p.aL), aR: arm(shw, p.aR), lL: leg(-hx, p.lL, p.ftL || 0), lR: leg(hx, p.lR, p.ftR || 0) };
}
function drawArm(a, cig) {
  seg(a.w, a.h, 1.75, 4);
  seg(a.s, a.e, 2, 16); seg(a.e, a.w, 1.8, 16);
  seg(add(a.s, Math.atan2(a.e[0] - a.s[0], a.e[1] - a.s[1]), 1), a.e, .5, 17);
  const cu = add(a.w, Math.atan2(a.e[0] - a.w[0], a.e[1] - a.w[1]), 1); seg(cu, a.w, 1.8, 18);
  if (cig) { seg(a.h, [a.h[0] - 2.5, a.h[1] - .8], .55, 13); put(Math.round(a.h[0] - 3 + OX), Math.round(a.h[1] - 1 + OY), 14); }
}
function drawLeg(g, c1, c2, side) {
  seg(g.hp, g.kn, 2.2, c1); seg(g.kn, g.an, 1.95, c1);
  const f = side ? [g.an[0] - 3, g.an[1] + 1.2] : [g.an[0] + (g.hp[0] < 0 ? -.6 : .6), g.an[1] + 1.4];
  seg([g.an[0] + (side ? .8 : 0), g.an[1] + 1], f, 1.5, 10); seg([f[0] - (side ? 1 : 1.3), f[1] + 1.4], [side ? g.an[0] + 1.5 : f[0] + 1.3, f[1] + 1.4], .6, 11);
  seg([g.kn[0] + (side ? 1.2 : -1), g.kn[1] - 3], [g.an[0] + (side ? 1.1 : -.9), g.an[1] - 2], .5, c2);
}
function draw(p) {
  buf.fill(0); const f = fk(p), sy = f.sy, ln = p.ln || 0, hx = ln + (p.hdx || 0), hy = p.hdy || 0;
  const sh = P => P.map(([x, y]) => [x + ln * Math.max(0, Math.min(1, (3 - y) / (3 - sy))), y]);
  if (p.side) {                                   // профиль (смотрит влево)
    drawArm(f.aR); drawLeg(f.lR, 9, 8, 1); drawLeg(f.lL, 8, 9, 1);
    poly([[-3.5, 3], [3.5, 3], [3.5, -2], [-3, -2]], 8);
    poly([[-3.5, sy + 1], [-1, sy - .5], [2, sy - .5], [4.2, sy + 2], [4, 3], [-4, 3]], 6);
    poly([[-2.2, sy], [-1, sy - .7], [2.2, sy - .7], [4.6, sy + 2], [4.6, 4], [-2.4, 4], [-2.8, sy + 6]], 16); seg([-2.2, sy + 1], [-2.6, 3.5], .5, 18); seg([3.6, sy + 3], [3.6, 2], .5, 17);
    seg([0, sy - 2], [0, sy], 1.1, 5); sprite(HS, -10, sy - 18, 0);
    drawArm(f.aL);
  } else {                                        // анфас
    poly([[-R.HIP - 3.4, -1], [R.HIP + 3.4, -1], [R.HIP + 3.2, 4], [-R.HIP - 3.2, 4]], 8);
    drawLeg(f.lL, 8, 9, 0); const kneeUp = (p.seat || 0) > .5; if (!kneeUp) drawLeg(f.lR, 8, 9, 0);
    poly(sh([[-R.SHW, sy + 1], [-2, sy - .5], [2, sy - .5], [R.SHW, sy + 1], [R.SHW - .5, sy + 8], [5, 3], [-5, 3], [-R.SHW + .5, sy + 8]]), 6);
    for (const [x, y] of [[-1, 4], [0, 4], [1, 4], [-1, 6], [1, 6], [0, 7]]) put(OX + x + Math.round(ln * .7), OY + sy + y, 19);
    for (const k of [-1, 1]) { poly(sh([[k * (R.SHW + .6), sy + 1], [k * 2.6, sy - .6], [k * 1.6, sy + 1.5], [k * 2.4, 4.5], [k * (R.SHW + .4), 4.5]]), 16);
      seg([k * 2.4, sy - .2], [k * 1.9, sy + 4], .6, 17); seg([k * 2.1, sy + 5], [k * 2.4, 4], .5, 18); seg([k * (R.SHW - 1), sy + 6], [k * (R.SHW - 1), 3.5], .4, k < 0 ? 17 : 18); }
    seg([-1 + ln, sy - 2], [1 + ln, sy - 2], .9, 5); sprite(HF, Math.round(-8 + hx), Math.round(sy - 18 + hy), 0);
    if (!p.noCig) { seg([-.4, sy - 3.6], [-2.8, sy - 1.4], .6, 13); put(OX - 3, OY + sy - 1, 14); }
    if (kneeUp) drawLeg(f.lR, 8, 9, 0); drawArm(f.aL, p.cigHand); drawArm(f.aR);
  }
  if (p.blink) { for (const [x, y] of [[4, 10], [5, 10], [5, 11], [12, 10], [12, 11], [11, 10]]) put(OX - 8 + Math.round(hx) + x, OY + Math.round(sy - 18 + hy) + y, 4); }
  // контур
  const out = new Uint8Array(buf);
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (!buf[y * GW + x] && ((x && buf[y * GW + x - 1] > 1) || (x < GW - 1 && buf[y * GW + x + 1] > 1) || (y && buf[(y - 1) * GW + x] > 1) || (y < GH - 1 && buf[(y + 1) * GW + x] > 1))) out[y * GW + x] = 1;
  return { out, tip: p.side || p.noCig ? null : [-3, sy - 1], hand: f.aL.h };
}

/* ---------- SVG ---------- */
let S = 3, W = 0, H = 0, G = 0, X0 = 0, XT = 0, t0 = 0, raf = 0, done = false, lastQ = -1;
const paths = PAL.map((c, i) => { if (!i) return null; const p = document.createElementNS(NS, 'path'); p.setAttribute('fill', c); sv.append(p); return p; });
const smokeG = document.createElementNS(NS, 'path'); smokeG.setAttribute('fill', '#b5b5b5'); sv.append(smokeG);
const cigG = document.createElementNS(NS, 'path'); cigG.setAttribute('fill', PAL[13]); sv.append(cigG);
const cigT = document.createElementNS(NS, 'path'); cigT.setAttribute('fill', PAL[14]); sv.append(cigT);
function emit(o, ox, oy) {
  const D = PAL.map(() => []);
  for (let y = 0; y < GH; y++) { let run = 0, st = 0;
    for (let x = 0; x <= GW; x++) { const c = x < GW ? o[y * GW + x] : 0; if (c !== run) { if (run) D[run].push(`M${ox + st} ${oy + y}h${x - st}v1h${st - x}z`); run = c; st = x; } } }
  paths.forEach((p, i) => p && p.setAttribute('d', D[i].join('')));
}

/* ---------- сцена ---------- */
const lerp = (a, b, k) => a + (b - a) * k, ease = k => k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k);
const STAND = { aL: [-.12, .05], aR: [.12, -.05], lL: [-.03, 0], lR: [.03, 0] };
const TL = { drop: .45, pull: 1.0, slip: 1.7, one: 2.0, rel: 2.5 }, GR = 260;
function hangPose(t) {
  const kick = t > TL.drop ? 1 : 0, one = ease((t - TL.one) / .15), sw = .12 * Math.sin(Math.max(0, t - TL.drop) * 4.3);
  const pull = t < TL.pull ? 0 : t < TL.slip ? ease((t - TL.pull) / .3) * (1 - ease((t - TL.slip + .2) / .2)) : 0;
  const k1 = Math.sin(t * 9) * kick, k2 = Math.sin(t * 9 + 2) * kick;
  return { aL: [Math.PI + .25 + pull * .8 + sw, -pull * 1.6], aR: [lerp(Math.PI - .25 - pull * .8 + sw, .7 + .5 * Math.sin(t * 12), one), lerp(pull * 1.6, .3, one)],
    lL: [-.08 - .25 * k1, .3 * Math.max(0, k1)], lR: [.08 + .25 * k2, -.3 * Math.max(0, k2)], ftL: .4 * Math.max(0, k1), ftR: .4 * Math.max(0, k2) };
}
const handY = p => { const f = fk(p); return Math.min(f.aL.h[1], f.aR.h[1]); }, footY = p => { const f = fk(p); return Math.max(f.lL.an[1], f.lR.an[1]) + 2.5; };
function scene(t) {
  if (t < TL.rel) { const p = hangPose(t); let dy = 0;
    if (t < TL.drop) { const u = t / TL.drop; dy = -(1 - u * u) * (H * .5 + 60); } else { const u = t - TL.drop; dy = Math.sin(u * 26) * Math.exp(-u * 9) * 3; }
    return { p, x: X0, y: 1 - handY(p) + dy + ease((t - TL.one) / .15) * 2 }; }
  const y0 = 1 - handY(hangPose(TL.rel - 1e-3)) + 2;
  const pf = { aL: [Math.PI + .6 + .3 * Math.sin(t * 15), .3], aR: [Math.PI - .6 + .3 * Math.sin(t * 15 + 1), -.3], lL: [-.15, .25], lR: [.12, -.15] };
  const yl = G - footY(pf), tl = TL.rel + Math.sqrt(2 * Math.max(1, yl - y0) / GR);
  if (t < tl) { const u = t - TL.rel; return { p: pf, x: X0, y: y0 + GR * u * u / 2 }; }
  const u = t - tl, c = u < .08 ? ease(u / .08) : u < .5 ? 1 : 1 - ease((u - .5) / .5);
  const cr = { aL: [-.6, -.4], aR: [.6, .4], lL: [-.7, 1.35], lR: [.7, -1.35] };
  let p = {}; for (const n in STAND) p[n] = STAND[n].map((v, i) => lerp(v, cr[n][i], c));
  let x = X0, cig = null; const tw = tl + 1.2, dist = X0 - XT, dur = dist / 39, end = tw + dur;
  if (t >= tw && t < end) {                       // идёт влево, профиль
    const e = (t - tw) / dur; x = X0 - dist * e; const ph = (dist * e) / 7 * Math.PI, sn = Math.sin(ph);
    p = { side: 1, aL: [.45 * sn, -.25], aR: [-.45 * sn, -.25], lL: [.5 * sn, -.6 * Math.max(0, -sn) * 0 + (sn > 0 ? -.5 * sn : 0)], lR: [-.5 * sn, sn < 0 ? .5 * sn : 0] };
    p.lL = [-.5 * sn, Math.max(0, sn) * .9]; p.lR = [.5 * sn, Math.max(0, -sn) * .9];
  } else if (t >= end) {
    x = XT; const id = t - end, th = id - 2.3;          // через ~2 c после появления текста: бросок и посадка
    p.br = Math.sin(id * 1.8) > .3 ? 1 : 0; p.blink = id % 3.6 < .14;
    if (th > 0) {
      const up = ease(th / .25), out = ease((th - .3) / .15), back = ease((th - .55) / .3);
      p.aL = [lerp(lerp(-.12, -2.5, up), -1.6, out), lerp(lerp(.05, -1.9, up), -.1, out)];
      p.aL = p.aL.map((v, i) => lerp(v, STAND.aL[i], back));
      p.noCig = th > .2; p.cigHand = th > .2 && th < .45;
      const sit = { aL: [-.25, .5], aR: [-.05, -1.6], lL: [-1.35, 2.55], lR: [2.5, -2.3] }, k = ease((th - .9) / .6);
      if (k > 0) { for (const n in sit) p[n] = p[n].map((v, i) => lerp(v, sit[n][i], k)); p.ln = 4 * k; p.hdx = 3 * k; p.hdy = 4 * k; p.br = 0; }
      p.seat = k;
      if (th > .45) { const u = th - .45, h0 = fk(Object.assign({}, p, { aL: [-1.6, -.1] })).aL.h; cig = { x: x + h0[0] - 2 - 70 * u, y: G - footY(STAND) + h0[1] - 1 - 70 * u + 170 * u * u, a: u * 14 }; }
    }
  }
  return { p, x, y: lerp(G - footY(p), G - 5, p.seat || 0), end, cig };
}

function layout() {
  const vw = innerWidth, vh = innerHeight, mob = vw < 700;
  S = mob ? (vh < 640 ? 2 : 3) : 3; W = Math.floor(vw / S); H = Math.floor(vh / S);
  sv.setAttribute('viewBox', `0 0 ${W} ${H}`); sv.style.width = W * S + 'px'; sv.style.height = H * S + 'px';
  X0 = Math.round(W / 2);
  if (mob) {                                       // телефон: персонаж сверху, текст под ним на всю ширину
    G = Math.round(H * .44); XT = Math.round(W * .36);
    Object.assign(txt.style, { left: '20px', top: (G + 12) * S + 30 + 'px', maxWidth: vw - 40 + 'px' });
  } else {
    G = Math.round(H / 2 + 30); XT = Math.round(W / 2 - W * .14);
    Object.assign(txt.style, { left: (XT + 23) * S + 'px', top: (G - 64) * S + 'px', maxWidth: Math.min(440, vw - (XT + 23) * S - 16) + 'px' });
  }
}
const puffs = [];
function frame(now) {
  const t = (now - t0) / 1000, q = Math.floor(t * 12);
  if (q !== lastQ) {                               // 12 кадров в секунду — как у спрайтов
    lastQ = q; const tq = q / 12, s = scene(tq), ox = Math.round(s.x) - OX, oy = Math.round(s.y) - OY, r = draw(s.p); emit(r.out, ox, oy);
    if (r.tip && q % 3 === 0) puffs.push({ x: ox + OX + r.tip[0], y: oy + OY + r.tip[1] - 1, a: 0 });
    puffs.forEach(o => { o.a++; o.y -= .6; o.x += Math.sin(o.a * .7) * .5 - .15; });
    while (puffs.length && puffs[0].a > 22) puffs.shift();
    smokeG.setAttribute('d', puffs.filter(o => o.a % 4 !== 3).map(o => `M${Math.round(o.x)} ${Math.round(o.y)}h1v1h-1z`).join(''));
    if (t > s.end + .3) txt.classList.add('on');
    if (s.cig && s.cig.y < H + 4) { const c = s.cig, dx = Math.round(Math.cos(c.a) * 1.5), dy = Math.round(Math.sin(c.a) * 1.5), X = Math.round(c.x), Y = Math.round(c.y);
      cigG.setAttribute('d', [[-dx, -dy], [0, 0], [dx, dy]].map(([a, b]) => `M${X + a} ${Y + b}h1v1h-1z`).join('')); cigT.setAttribute('d', `M${X + 2 * dx} ${Y + 2 * dy}h1v1h-1z`); }
    else { cigG.setAttribute('d', ''); cigT.setAttribute('d', ''); }
  }
  if (document.body.dataset.v === 'map') raf = requestAnimationFrame(frame);
}
function start(replay) {
  cancelAnimationFrame(raf); layout(); lastQ = -1;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches, q = new URLSearchParams(location.search).get('t');
  if (replay) txt.classList.remove('on');
  t0 = performance.now() - (q ? +q * 1000 : (!replay && (done || calm)) ? 60000 : 0); done = true;
  raf = requestAnimationFrame(frame);
}
sv.addEventListener('click', () => start(true));
addEventListener('resize', () => { if (document.body.dataset.v === 'map') { layout(); lastQ = -1; } });
window.HERO = { start };
if (document.body.dataset.v === 'map') start();
})();
