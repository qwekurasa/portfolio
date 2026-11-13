/* Пиксельный qwekurasa: поза собирается из суставов, растеризуется в сетку пикселей и выводится в SVG */
(() => {
const sv = document.getElementById('hero'), txt = document.getElementById('heroText'), NS = 'http://www.w3.org/2000/svg';
const PAL = ['', '#120d0b', '#392c26', '#554239', '#efc8b1', '#d09c85', '#855137', '#a16c49', '#343438', '#48484c', '#141416', '#060607', '#2a1d16', '#ede7dd', '#bcb5ad', '#b9746a', '#241e1d', '#593725', '#0e0e11', '#f8dccb', '#f2c12e', '#38383e', '#5a4430'];
const MAP = { K: 1, H: 2, h: 3, D: 16, S: 4, s: 5, L: 19, E: 12, m: 15, B: 22 };
const HEAD_F = [
  '....KKKKKKKKK.....',
  '..KKhhhHHHHHHKK...',
  '.KhhHHHHhHHHHHDK..',
  '.KhHHHHHHHHHHHHDK.',
  'KhHHHHHHHHHHHHHHDK',
  'KHHHHhHHHHHhHHHHDK',
  'KHHHHDHHHHHHHDHHDK',
  'KHHDHHHSHHDHSHHHDK',
  'KHHDLSSSSSSSSSSDDK',
  'KHHSBBSSSSSSBBSHDK',
  'KHHSKESSSSSSKESHDK',
  'KHHSSSSSSsSSSSSHDK',
  'KHHLSSSSSsSSSSsHDK',
  'KHHsSSSSSSSSSSsHDK',
  'KHHHsSSSmmmSSsHHDK',
  'KHHHKsSSSSSSSsKHDK',
  '.KDHHKKsSSSsKKHDK.',
  '..KKDDKKKSSKKKDKK.'];
const HEAD_S = [
  '......KKKKKKK.....',
  '....KKhhHHHHHKK...',
  '...KhhHHHHHHHHDK..',
  '..KhHHHHHHHHHHHDK.',
  '..KHHHHHHHHHHHHHDK',
  '.KHHHHHhHHHHHHHHDK',
  '.KSHHHHHHHHHHHHHDK',
  '.KSSSHHHHHHHHHHHDK',
  '.KBBSSSHHHHHHHHHDK',
  '.KESSSSShHHHHHHHDK',
  '.KSSSSSSSHHHHHHHDK',
  'KSSSSSSSSHHHHHHHDK',
  '.KsSSSSSSHHHHHHHDK',
  '.KmSSSSSSDHHHHHHDK',
  '..KSSSSSSKDHHHHDK.',
  '...KsSSSK.KDDDDK..',
  '....KKSSK..KKKK...'];
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
function segS(a, b, r0, r1, C) {                    // сужающийся сегмент со светотенью (свет сверху-слева)
  const r = Math.max(r0, r1), x0 = Math.floor(Math.min(a[0], b[0]) - r - 1) + OX, x1 = Math.ceil(Math.max(a[0], b[0]) + r + 1) + OX, y0 = Math.floor(Math.min(a[1], b[1]) - r - 1) + OY, y1 = Math.ceil(Math.max(a[1], b[1]) + r + 1) + OY;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy || 1;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (x < 0 || y < 0 || x >= GW || y >= GH) continue;
    const px = x + .5 - OX, py = y + .5 - OY; let t = ((px - a[0]) * dx + (py - a[1]) * dy) / L; t = t < 0 ? 0 : t > 1 ? 1 : t;
    const rr = r0 + (r1 - r0) * t, ex = px - a[0] - dx * t, ey = py - a[1] - dy * t; if (ex * ex + ey * ey > rr * rr) continue;
    const k = -(ex + ey) * .7071 / rr; buf[y * GW + x] = k > .38 ? C[0] : k < -.42 ? C[2] : C[1];
  }
}
function polyS(P, C, cx, hw) {                      // заливка с тенью по горизонтали
  const ys = P.map(p => p[1]), y0 = Math.floor(Math.min(...ys)), y1 = Math.ceil(Math.max(...ys));
  for (let y = y0; y <= y1; y++) { const py = y + .5, xs = [];
    for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; if ((a[1] <= py) !== (b[1] <= py)) xs.push(a[0] + (py - a[1]) / (b[1] - a[1]) * (b[0] - a[0])); }
    xs.sort((m, n) => m - n); for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) { const u = (x + .5 - cx) / hw; put(x + OX, y + OY, u < -.62 ? C[0] : u > .5 ? C[2] : C[1]); } }
}
const SK = [19, 4, 5], SH = [7, 6, 17], PA = [9, 8, 18], BO = [21, 10, 10], KK = [1, 1, 1], lp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
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
function drawArm(a) {
  const m = lp(a.s, a.e, .5), sl = lp(a.e, a.w, .45);
  segS(m, a.e, 2.8, 2.65, KK); segS(a.e, a.w, 2.65, 2.3, KK); segS(a.w, a.h, 2.3, 2.6, KK);   // контур поверх тела
  segS(m, a.e, 1.95, 1.75, SK); segS(a.e, a.w, 1.8, 1.35, SK);                                       // плечо и предплечье сужаются
  segS(a.w, lp(a.w, a.h, 1.15), 1.4, 1.65, SK); seg(lp(a.w, a.h, .9), lp(a.w, a.h, .9), .5, 5);     // кисть
  segS(a.s, a.e, 2.7, 2.35, [13, 13, 14]);
  segS(a.e, sl, 2.35, 2.15, [13, 13, 14]);
  segS(lp(a.e, a.w, .35), sl, 2.45, 2.35, [13, 14, 14]);
}
function drawLeg(g, side, ring) {
  const f = side ? [g.an[0] - 3.4, g.an[1] + 1.5] : [g.an[0] + (g.hp[0] < 0 ? -.9 : .9), g.an[1] + 1.8], an = [g.an[0], g.an[1] - .4];
  if (ring) { segS(g.hp, g.kn, 3.9, 3.7, KK); segS(g.kn, an, 3.7, 3.8, KK); }
  segS([g.an[0], g.an[1] - 1.5], [g.an[0] + (side ? .6 : 0), g.an[1] + 1], 2.05, 2.05, BO);              // голенище
  segS([g.an[0] + (side ? .8 : 0), g.an[1] + 1.3], f, 1.95, 1.75, BO);                                // носок
  seg([f[0] - (side ? 1.5 : 1.8), f[1] + 1.7], [side ? g.an[0] + 2 : f[0] + 1.8, f[1] + 1.7], .5, 11);   // подошва
  put(Math.round(g.an[0] + OX), Math.round(g.an[1] + OY), 21);
  segS(g.hp, g.kn, 3.05, 2.75, PA); segS(g.kn, an, 2.75, 2.85, PA);                                  // широкие штаны
  seg(lp(g.kn, an, .15), lp(g.kn, an, .9), .4, 18);                                                    // стрелка
  seg([g.kn[0] - 1.6, g.kn[1] - .3], [g.kn[0] + .3, g.kn[1] + .6], .35, 18);                           // складка у колена
  seg([an[0] - 2.4, an[1] + 1.6], [an[0] + 2.4, an[1] + 1.6], .4, 18);                                 // низ штанины
}
function draw(p) {
  buf.fill(0); const f = fk(p), sy = f.sy, ln = p.ln || 0, hx = ln + (p.hdx || 0), hy = p.hdy || 0;
  const sh = P => P.map(([x, y]) => [x + ln * Math.max(0, Math.min(1, (3 - y) / (3 - sy))), y]);
  const neck = () => { segS([ln, sy - 3], [ln, sy], 1.5, 1.6, SK); seg([ln - 1.2, sy - 1.4], [ln + 1.2, sy - 1.4], .45, 5); };
  if (p.side) {                                   // профиль (смотрит влево)
    drawArm(f.aR); drawLeg(f.lR, 1); drawLeg(f.lL, 1);
    polyS([[-4.3, 3.6], [4.3, 3.6], [4.3, -2], [-3.8, -2]], PA, 0, 4.3);
    polyS(sh([[-3.6, sy + 1], [-1.2, sy - .6], [2.2, sy - .6], [4.4, sy + 2.2], [4.3, 3.2], [-4.2, 3.2], [-3.4, sy + 9]]), SH, ln * .5 + .3, 4.2);
    seg([-3.8, 2.8], [4, 2.8], .4, 17); seg([3.4, sy + 4], [3.6, 1], .4, 17);
    neck(); poly(sh([[-4,sy], [1,sy], [-2,sy+5]]),13); sprite(HS, Math.round(ln)-10, sy - 18, 0);
    drawArm(f.aL);
  } else {                                        // анфас
    polyS([[-R.HIP - 4.1, -1], [R.HIP + 4.1, -1], [R.HIP + 4, 4.6], [-R.HIP - 4, 4.6]], PA, 0, 6.6);
    const kneeUp = (p.seat || 0) > .5; drawLeg(f.lL, 0); if (!kneeUp) drawLeg(f.lR, 0);
    polyS(sh([[-R.SHW - .6, sy + 1.2], [-2.4, sy - .6], [2.4, sy - .6], [R.SHW + .6, sy + 1.2], [R.SHW - .2, sy + 8], [5.6, 3.4], [-5.6, 3.4], [-R.SHW + .2, sy + 8]]), SH, ln * .6, R.SHW + .4);
    for (const [a, b] of [[[-3.2, sy + 11], [-1.6, sy + 13.5]], [[3.4, sy + 12], [2, 2.2]], [[-5.2, 2.9], [5.2, 2.9]], [[-R.SHW + 1, sy + 3], [-R.SHW + 1.4, sy + 6]]]) seg([a[0] + ln * .4, a[1]], [b[0] + ln * .3, b[1]], .4, 17);
    seg([-2.3 + ln, sy - .3], [2.3 + ln, sy - .3], .55, 7);
    poly(sh([[-4,sy], [4,sy], [0,sy+6]]), 13);
    poly(sh([[-1,sy+1], [1,sy+1], [0,sy+5]]), 8);
    neck(); sprite(HF, Math.round(-8 + hx), Math.round(sy - 18 + hy), 0);
    if (kneeUp) drawLeg(f.lR, 0, 1); drawArm(f.aL); drawArm(f.aR);
  }
  if (p.blink) { for (const [x, y] of [[4, 10], [5, 10], [12, 10], [13, 10]]) put(OX - 8 + Math.round(hx) + x, OY + Math.round(sy - 18 + hy) + y, 4); }
  // контур
  const out = new Uint8Array(buf);
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (!buf[y * GW + x] && ((x && buf[y * GW + x - 1] > 1) || (x < GW - 1 && buf[y * GW + x + 1] > 1) || (y && buf[(y - 1) * GW + x] > 1) || (y < GH - 1 && buf[(y + 1) * GW + x] > 1))) out[y * GW + x] = 1;
  return { out };
}

/* ---------- SVG ---------- */
let S = 3, W = 0, H = 0, G = 0, XT = 0, t0 = 0, raf = 0, done = false, lastQ = -1;
const paths = PAL.map((c, i) => { if (!i) return null; const p = document.createElementNS(NS, 'path'); p.setAttribute('fill', c); sv.append(p); return p; });
const chair = document.createElementNS(NS, 'g');
sv.prepend(chair);
for (const [color, d] of [
  ['#595a61','M-3 6h4v14h-4z M-12 21h24v2h-24z M-8 19H8v2H-8z'],
  ['#33343a','M-14 22h5v4h-5z M9 22h5v4H9z M-2 22h4v5h-4z'],
  ['#46474e','M4 5l7-25h4L8 7z'],
  ['#23242a','M8-21h9v5h-1v6h-2v6h-2v4H6v-6h1v-8h1z M-10 2h20v5H7v2H-8V7h-2z'],
  ['#64646b','M9-21h7v2H9z M-9 2H8v2H-9z']
]) {
  const part = document.createElementNS(NS, 'path');
  part.setAttribute('fill', color); part.setAttribute('d', d); chair.append(part);
}
function emit(o, ox, oy) {
  const D = PAL.map(() => []);
  for (let y = 0; y < GH; y++) { let run = 0, st = 0;
    for (let x = 0; x <= GW; x++) { const c = x < GW ? o[y * GW + x] : 0; if (c !== run) { if (run) D[run].push(`M${ox + st} ${oy + y}h${x - st}v1h${st - x}z`); run = c; st = x; } } }
  paths.forEach((p, i) => p && p.setAttribute('d', D[i].join('')));
}

/* ---------- сцена ---------- */
const lerp = (a, b, k) => a + (b - a) * k, ease = k => k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k);
const STAND = { aL: [-.12, .05], aR: [.12, -.05], lL: [-.03, 0], lR: [.03, 0] };
const GR = 260;
const footY = p => { const f = fk(p); return Math.max(f.lL.an[1], f.lR.an[1]) + 3.5; };
const seated = { aL: [.25, -1.65], aR: [-.35, -1.2], lL: [-1.99, .14], lR: [-2.08, .35] };
function scene(t) {
  const sit = ease((t - 1.15) / .65);
  const p = { side: t >= 1.15, ln: 6 * sit };
  for (const joint in STAND) p[joint] = STAND[joint].map((angle,i) => lerp(angle,seated[joint][i],sit));
  const seatY = G - 26;
  const standY = G - footY(STAND);
  const drop = Math.min(1, t / .68);
  const y = lerp(-32,standY,drop * drop) + 2 * Math.sin(Math.PI * ease((t-.68)/.22));
  const roll = ease((t - .7) / .65);
  chair.setAttribute('transform', 'translate(' + Math.round(lerp(W+18,XT,roll)) + ' ' + seatY + ')');
  return { p, x: XT, y: lerp(y, seatY, sit) };
}
function layout() {
  const vw = innerWidth, vh = innerHeight;
  S = vw < 700 || vh < 500 ? 2 : 3;
  W = Math.floor(vw / S); H = Math.floor(vh / S);
  sv.setAttribute('viewBox', `0 0 ${W} ${H}`);
  sv.style.width = W*S+'px'; sv.style.height = H*S+'px';
  const mobile = vw < 700, margin = mobile ? 16 : 32;
  const width = Math.min(440, vw - margin*2 - (mobile ? 0 : 48*S));
  const left = mobile ? margin : Math.round((vw-width-42*S)/2);
  XT = Math.min(W-19, Math.round((left+width)/S)+17);
  txt.style.left = left+'px'; txt.style.width = width+'px'; txt.style.maxWidth = width+'px';
  const top = Math.round(Math.max(43*S, (vh-txt.offsetHeight)/2) / S);
  txt.style.top = top*S+'px';
  G = top - footY(seated) + 26;
}
/* ---------- перетаскивание мышкой: невесомость, ветер, падение ---------- */
let drag = null, free = null, last = null, lastPt = null, lastMv = 0, lastF = 0;
const vel = { x: 0, y: 0 }, cl = (v, a, b) => v < a ? a : v > b ? b : v;
function heldPose(ts) {
  const sp = Math.hypot(vel.x, vel.y), w = cl(sp / 260, 0, 1), tr = cl(-vel.x / 170, -1.35, 1.35), up = cl(vel.y / 200, 0, 1.2), dn = cl(-vel.y / 260, 0, .6);
  const f1 = w * .6 * Math.sin(ts * 26), f2 = w * .6 * Math.sin(ts * 26 + 1.9), f3 = w * .5 * Math.sin(ts * 22 + .7);
  const c = 1 - w, z = (a, f, ph) => a * c * Math.sin(ts * f + ph);   // плавное парение, гаснет при быстром движении
  return { noCig: 1, blink: ts % 3.4 < .12,
    aL: [-.9 + z(.35, 1.3, 0) + tr - up * 1.4 + dn * .4 + f1, .55 + z(.3, 1.1, 1) + f2 * .5], aR: [.9 + z(.35, 1.2, 2) + tr + up * 1.4 - dn * .4 + f2, -.55 + z(.3, 1.4, 3) - f1 * .5],
    lL: [-.25 + z(.22, .9, 1.5) + tr * .85 - up * .5 + f3, .55 + z(.3, 1, 0) + Math.abs(f1) * .7], lR: [.3 + z(.22, .8, 4) + tr * .85 + up * .5 - f3, .35 + z(.3, 1.2, 2) + Math.abs(f2) * .7],
    ln: cl(-vel.x / 90, -2.5, 2.5) * w, hdx: cl(-vel.x / 140, -2, 2) * w, hdy: -up * 1.5 };
}
function show(p, x, y) {
  const ox = Math.round(x) - OX, oy = Math.round(y) - OY, r = draw(p); emit(r.out, ox, oy); last = { out: r.out, ox, oy, x, y };
}
function freeFrame(now) {
  const ts = now / 1000, dt = Math.min(.05, (now - (lastF || now)) / 1000); lastF = now;
  if (drag) {
    if (now - lastMv > 60) { const k = Math.pow(.004, dt); vel.x *= k; vel.y *= k; }
    const k = 1 - Math.exp(-dt * 7);                                   // тянется за курсором с запаздыванием
    drag.x += (drag.mx + drag.ox - drag.x) * k; drag.y += (drag.my + drag.oy - drag.y) * k;
    show(heldPose(ts), drag.x + 1.5 * Math.sin(ts * 1.1), drag.y + 3 * Math.sin(ts * 1.6)); return;
  }
  const gy = G - footY(STAND);
  if (free.mode === 'fall') {
    free.vy += GR * 1.6 * dt; free.x += free.vx * dt; free.vx *= Math.pow(.35, dt); free.y += free.vy * dt;
    if (free.x < 12 || free.x > W - 12) { free.x = cl(free.x, 12, W - 12); free.vx *= -.4; }
    if (free.y >= gy) { free.y = gy; free.mode = 'land'; free.t = ts; }
    const k = cl(free.vy / 300, -1, 1);
    show({ noCig: 1, aL: [-.5 - k * 1.2, .3], aR: [.5 + k * 1.2, -.3], lL: [-.2, .4], lR: [.2, -.1] }, free.x, free.y); return;
  }
  free.y = gy; const u = ts - free.t, c = u < .08 ? ease(u / .08) : u < .35 ? 1 : 1 - ease((u - .35) / .4);
  const cr = { aL: [-.6, -.4], aR: [.6, .4], lL: [-.7, 1.35], lR: [.7, -1.35] }, p = { noCig: 1, br: Math.sin(ts * 1.8) > .3 ? 1 : 0, blink: ts % 3.6 < .14 };
  for (const n in STAND) p[n] = STAND[n].map((v, i) => lerp(v, cr[n][i], c));
  show(p, free.x, G - footY(p));
}
const gridPt = e => { const b = sv.getBoundingClientRect(); return [(e.clientX - b.left) / S, (e.clientY - b.top) / S]; };
const hit = ([gx, gy]) => { if (!last) return false; const x = Math.floor(gx) - last.ox, y = Math.floor(gy) - last.oy;
  for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const X = x + a, Y = y + b; if (X >= 0 && Y >= 0 && X < GW && Y < GH && last.out[Y * GW + X]) return true; } return false; };
Object.assign(sv.style, { pointerEvents: 'none', zIndex: 5 }); sv.parentElement.style.touchAction = 'none';   // персонаж поверх окна, клики по ссылкам проходят
const onMap = () => document.body.dataset.v === 'map', cur = c => { document.documentElement.style.cursor = c; };
addEventListener('pointerdown', e => {
  if (!onMap() || e.button) return; const g = gridPt(e); if (!hit(g)) return; e.preventDefault(); e.stopPropagation();
  drag = { ox: last.x - g[0], oy: last.y - g[1], mx: g[0], my: g[1], x: last.x, y: last.y }; vel.x = vel.y = 0; lastPt = { g, t: performance.now() };
  txt.classList.add('on'); cur('grabbing');
  if (!free) { free = { mode: 'fall' }; cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
});
addEventListener('pointermove', e => {
  if (!onMap()) return; const g = gridPt(e);
  if (!drag) { cur(hit(g) ? 'grab' : ''); return; }
  const now = performance.now(), dt = Math.max(.008, (now - lastPt.t) / 1000);
  vel.x = vel.x * .75 + (g[0] - lastPt.g[0]) / dt * .25; vel.y = vel.y * .75 + (g[1] - lastPt.g[1]) / dt * .25;
  lastPt = { g, t: now }; lastMv = now; drag.mx = g[0]; drag.my = g[1];
});
const drop = () => { if (!drag) return; free = { mode: 'fall', x: last.x, y: last.y, vx: cl(vel.x * .6, -400, 400), vy: cl(vel.y * .6, -500, 500) }; drag = null; cur(''); };
addEventListener('pointerup', drop); addEventListener('pointercancel', drop);
function frame(now) {
  if (drag || free) { freeFrame(now); if (document.body.dataset.v === 'map') raf = requestAnimationFrame(frame); return; }
  const t = (now - t0) / 1000, q = Math.floor(t * 12);
  if (q !== lastQ) {                               // 12 кадров в секунду — как у спрайтов
    lastQ = q;
    const s = scene(q / 12);
    show(s.p, s.x, s.y);
    if (t >= .5) txt.classList.add('on');
  }
  if (t < 2 && document.body.dataset.v === 'map') raf = requestAnimationFrame(frame);
}
function start(replay) {
  cancelAnimationFrame(raf); layout(); lastQ = -1; lastF = 0; if (free) free.x = cl(free.x, 12, W - 12);
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches, q = new URLSearchParams(location.search).get('t');
  if (replay) txt.classList.remove('on');
  t0 = performance.now() - (q ? +q * 1000 : (calm || (!replay && done)) ? 60000 : 0); done = true;
  raf = requestAnimationFrame(frame);
}
addEventListener('resize', () => { if (document.body.dataset.v === 'map') { layout(); lastQ = -1; cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } });
window.HERO = { start };
if (document.body.dataset.v === 'map') start();
})();
