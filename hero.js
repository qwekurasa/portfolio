import * as THREE from 'three';

const cv = document.getElementById('hero'), txt = document.getElementById('heroText');
const R = new THREE.WebGLRenderer({ canvas: cv, antialias: false, alpha: true });
R.setClearColor(0xffffff, 0);
const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
cam.position.set(0, 0, 5);
scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7f78, 1.25));
const sun = new THREE.DirectionalLight(0xfff4ea, 1.6); sun.position.set(-2, 3, 4); scene.add(sun);
const rim = new THREE.DirectionalLight(0xc8d4ff, .5); rim.position.set(3, 1, -2); scene.add(rim);

/* ---------- материалы ---------- */
const M = (c, o = {}) => new THREE.MeshLambertMaterial({ color: c, ...o });
const SKIN = M(0xd2aa9e), TEE = M(0x1d1d20), TEE2 = M(0x2a2a2e), JEANS = M(0x44526a), JEANS2 = M(0x37435a),
  SHOE = M(0xeeeeee), SOLE = M(0xb9b9b9), LACE = M(0x2b2b2b), NAIL = M(0xe6c3b8),
  HAIRS = [M(0x4a2818, { flatShading: true }), M(0x5c3220, { flatShading: true }), M(0x3a1f12, { flatShading: true }), M(0x6e3e24, { flatShading: true })];
const faceTex = new THREE.TextureLoader().load('face.jpg'); faceTex.colorSpace = THREE.SRGBColorSpace;
faceTex.wrapS = faceTex.wrapT = THREE.ClampToEdgeWrapping;
const FACE = M(0xffffff, { map: faceTex, emissive: 0x4a3c38 });

/* ---------- геометрия ---------- */
const mesh = (g, m, p) => { const o = new THREE.Mesh(g, m); if (p) p.add(o); return o; };
const grp = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
// сегмент конечности: от сустава вниз на len
function seg(p, rt, rb, len, m, sz = 1, n = 8) { const g = new THREE.CylinderGeometry(rt, rb, len, n); g.translate(0, -len / 2, 0); g.scale(1, 1, sz); return mesh(g, m, p); }
const ball = (p, r, m, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) => { const o = mesh(new THREE.SphereGeometry(r, 10, 8), m, p); o.position.set(x, y, z); o.scale.set(sx, sy, sz); return o; };
const box = (p, w, h, d, m, x = 0, y = 0, z = 0) => { const o = mesh(new THREE.BoxGeometry(w, h, d), m, p); o.position.set(x, y, z); return o; };

const root = grp(scene), hips = grp(root);
/* таз + джинсы */
seg(hips, .15, .155, .17, JEANS, .68, 10).position.y = .07;
box(hips, .29, .03, .19, M(0x2c2c2c), 0, .07, 0); // ремень
/* корпус */
const spine = grp(hips, 0, .07, 0);
{ const g = new THREE.CylinderGeometry(.175, .148, .5, 12); g.translate(0, .25, 0); g.scale(1, 1, .62); mesh(g, TEE, spine); }
seg(spine, .158, .16, .07, TEE2, .66, 12).position.y = .03; // подол
ball(spine, .1, TEE, 0, .4, .03, 1.5, .8, .62); // грудь
const neckJ = grp(spine, 0, .52, 0);
seg(neckJ, .058, .062, .09, SKIN, 1, 8).position.y = .07;


/* голова: сфера с сужением к подбородку + проекция фото на лицо */
const head = grp(neckJ, 0, .03, .01); head.scale.setScalar(1.27);
{
  const g = new THREE.SphereGeometry(.105, 20, 16), p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    x *= .86; y *= 1.16; z *= .98;
    if (y < 0) { const k = -y / .122; x *= 1 - .3 * k * k; z *= 1 - .12 * k * k; }
    if (z > 0) { const ny = y + .04; z += .012 * Math.exp(-(x * x) / .0006 - (ny * ny) / .0012); }
    p.setXYZ(i, x, y + .1, z);
    uv.setXY(i, .5 + x / .142, (y + .119) / .182);
  }
  g.computeVertexNormals();
  mesh(g, FACE, head);
  // нос
  // уши
}
/* волосы: текстура из фото + рваные пряди */
const hairTex = new THREE.TextureLoader().load('hair.jpg'); hairTex.colorSpace = THREE.SRGBColorSpace; hairTex.wrapS = hairTex.wrapT = THREE.RepeatWrapping;
const HAIR = M(0xb08878, { map: hairTex, side: THREE.DoubleSide });
{
  const rnd = (s => () => (s = s * 16807 % 2147483647) / 2147483647)(11);
  const cap = new THREE.IcosahedronGeometry(.124, 3), p = cap.attributes.position, uv = [];
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const n = 1 + .09 * Math.sin(x * 55 + y * 31) * Math.cos(z * 47 - y * 23) + .05 * Math.sin(x * 120 - z * 90);
    x *= 1.02 * n; y = y * 1.02 * n + .14; z = z * n - .014;
    if (z > .02 && y < .2) { const k = Math.min(1, (z - .02) / .05) * Math.min(1, (.2 - y) / .045); z -= k * .1; y += k * .015; }
    if (y < .06) { x *= 1.06; }
    p.setXYZ(i, x, y, z); uv.push(Math.atan2(x, z) / Math.PI * 1.5 + 1, y * 4);
  }
  cap.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); cap.computeVertexNormals(); mesh(cap, HAIR, head);
  const strand = (x, y, z, len, w, rx, rz) => {
    const g = new THREE.ConeGeometry(w, len, 3, 1, true); g.translate(0, -len / 2, 0); g.scale(1, 1, .35);
    const o = mesh(g, HAIR, head); o.position.set(x, y, z); o.rotation.set(rx, rnd() * 6, rz); return o;
  };
  for (let i = 0; i < 70; i++) {            // пряди от макушки вниз и в стороны
    const a = rnd() * Math.PI * 2, b = .3 + rnd() * 1.3, r = .13;
    const x = Math.sin(b) * Math.cos(a) * r, z = Math.sin(b) * Math.sin(a) * r - .015, y = Math.cos(b) * r + .14;
    if (z > .05 && y < .2) continue;
    strand(x, y, z, z > .02 && Math.abs(x) < .09 ? .025 + rnd() * .025 : .07 + rnd() * .09, .026 + rnd() * .016, -z * 7 + (rnd() - .5) * .5, x * 6 + (rnd() - .5) * .5);
  }
  for (let i = 0; i < 7; i++) {             // чёлка на лоб
    const x = (rnd() - .5) * .17;
    strand(x, .232, .085 - Math.abs(x) * .4, .022 + rnd() * .018, .02, -.45 - rnd() * .3, x * 4 + (rnd() - .5) * .5);
  }
  for (let i = 0; i < 26; i++) {            // торчащие вверх кудри
    const a = rnd() * Math.PI * 2, b = rnd() * .9, r = .125;
    const x = Math.sin(b) * Math.cos(a) * r, z = Math.sin(b) * Math.sin(a) * r - .02, y = Math.cos(b) * r + .14;
    strand(x, y, z, .035 + rnd() * .04, .012 + rnd() * .008, Math.PI + z * 7 + (rnd() - .5) * .8, -x * 8 + (rnd() - .5) * .8);
  }
}
/* сигарета */
const cig = grp(head, -.004, .032, .1);
cig.rotation.set(-1.0, 0, -.5);
{ seg(cig, .0055, .0055, .03, M(0x2a2622), 1, 6); const b = seg(cig, .0058, .0058, .065, M(0xe9b9e0), 1, 6); b.position.y = -.03;
  const tip = mesh(new THREE.CylinderGeometry(.0058, .0058, .008, 6), new THREE.MeshBasicMaterial({ color: 0xff5a1f }), cig); tip.position.y = -.099; }
const tipW = new THREE.Vector3();
const tipObj = grp(cig, 0, -.104, 0);

/* руки */
function arm(s) {
  const sh = grp(spine, s * .2, .47, 0);
  ball(sh, .066, TEE, 0, -.015, 0, 1, .85, .82);
  seg(sh, .068, .062, .17, TEE, .9, 10);
  seg(sh, .046, .04, .3, SKIN);
  const el = grp(sh, 0, -.3, 0); ball(el, .041, SKIN);
  seg(el, .04, .031, .26, SKIN);
  const wr = grp(el, 0, -.26, 0);
  box(wr, .068, .085, .03, SKIN, 0, -.045, 0);
  const fingers = [];
  [[-.025, .046], [-.008, .052], [.009, .05], [.025, .04]].forEach(([x, l]) => {
    const f1 = grp(wr, x * -s, -.085, 0); box(f1, .015, l * .55, .016, SKIN, 0, -l * .27, 0);
    const f2 = grp(f1, 0, -l * .55, 0); box(f2, .014, l * .45, .015, SKIN, 0, -l * .22, 0); box(f2, .01, .008, .004, NAIL, 0, -l * .4, .008);
    fingers.push(f1, f2);
  });
  const th = grp(wr, s * .036, -.025, .01); th.rotation.z = s * .5; box(th, .017, .04, .017, SKIN, 0, -.02, 0);
  const th2 = grp(th, 0, -.04, 0); box(th2, .015, .03, .015, SKIN, 0, -.015, 0);
  return { sh, el, wr, fingers, th, th2, s };
}
const AL = arm(-1), AR = arm(1);
/* ноги */
function leg(s) {
  const hp = grp(hips, s * .085, 0, 0);
  seg(hp, .085, .064, .45, JEANS); const kn = grp(hp, 0, -.45, 0); ball(kn, .06, JEANS);
  seg(kn, .062, .052, .42, JEANS); seg(kn, .058, .06, .06, JEANS2).position.y = -.37;
  const an = grp(kn, 0, -.42, 0);
  box(an, .1, .08, .2, SHOE, 0, -.035, .04); box(an, .108, .025, .27, SOLE, 0, -.078, .04);
  { const t = mesh(new THREE.CylinderGeometry(.05, .05, .1, 8, 1, false, 0, Math.PI), SHOE, an); t.rotation.z = Math.PI / 2; t.rotation.y = 0; t.position.set(0, -.04, .14); t.scale.set(1, .8, .9); t.rotation.x = 0; }
  box(an, .06, .006, .1, LACE, 0, .006, .07);
  return { hp, kn, an };
}
const LL = leg(-1), LR = leg(1);
// тень
const shadow = mesh(new THREE.CircleGeometry(.32, 16), new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: .13 }), scene);
shadow.scale.set(1, .18, 1);

/* дым */
const smokeM = new THREE.MeshBasicMaterial({ color: 0xa8a8a8, transparent: true, depthWrite: false });
const puffs = Array.from({ length: 14 }, () => { const o = mesh(new THREE.CircleGeometry(.011, 6), smokeM.clone(), scene); o.visible = false; return o; });
let puffI = 0, puffT = 0;

/* ---------- позы ---------- */
const lerp = (a, b, k) => a + (b - a) * k, ease = k => k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k);
function mix(A, B, k) { const o = {}; for (const n in A) o[n] = typeof A[n] === 'number' ? lerp(A[n], B[n] ?? A[n], k) : A[n]; return o; }
const STAND = { yaw: .3, lean: 0, hx: 0, hy: 0, hz: 0, // голова
  aLz: -.12, aLx: .05, eLx: -.2, aRz: .12, aRx: .05, eRx: -.2, cL: .35, cR: .35,
  lLx: 0, lLz: -.03, kL: .02, lRx: 0, lRz: .03, kR: .02, fL: 0, fR: 0, br: 0 };
function apply(p) {
  root.rotation.y = p.yaw; spine.rotation.x = p.lean + p.br * .02;
  head.rotation.set(p.hx, p.hy, p.hz);
  AL.sh.rotation.set(p.aLx, 0, p.aLz); AL.el.rotation.x = p.eLx;
  AR.sh.rotation.set(p.aRx, 0, p.aRz); AR.el.rotation.x = p.eRx;
  for (const [A, c] of [[AL, p.cL], [AR, p.cR]]) { A.fingers.forEach((f, i) => f.rotation.x = -c * (i % 2 ? 1.5 : 1.1)); A.th2.rotation.x = -c * .8; A.wr.rotation.x = -c * .2; }
  LL.hp.rotation.set(p.lLx, 0, p.lLz); LL.kn.rotation.x = p.kL; LL.an.rotation.x = p.fL;
  LR.hp.rotation.set(p.lRx, 0, p.lRz); LR.kn.rotation.x = p.kR; LR.an.rotation.x = p.fR;
}
const v3 = new THREE.Vector3();
function handTop() { root.updateMatrixWorld(true); let y = -9, x = 0; for (const A of [AL, AR]) { A.wr.getWorldPosition(v3); x += v3.x / 2; y = Math.max(y, v3.y); } return { x, y }; }
function lowFoot() { root.updateMatrixWorld(true); let y = 9; for (const L of [LL, LR]) { L.an.getWorldPosition(v3); y = Math.min(y, v3.y - .09); } return y; }

/* ---------- сцена во времени ---------- */
let FH = 4, AW = 1, TOP = 2, GROUND = -.9, X0 = 0, XT = -1, done = false, t0 = 0, raf = 0, last = 0;
const TL = { drop: .45, pull: 1.0, slip: 1.75, one: 2.05, rel: 2.55 }, G = 9;
function hang(t) {
  const k = Math.max(0, t - TL.drop), kick = t > TL.drop ? 1 : 0;
  const pull = t < TL.pull ? 0 : t < TL.slip ? ease((t - TL.pull) / .35) * (1 - ease((t - TL.slip + .25) / .25)) : 0;
  const one = ease((t - TL.one) / .2), sw = .14 * Math.sin(k * 4.4) * Math.exp(-k * .5);
  const p = mix(STAND, {}, 0);
  Object.assign(p, { yaw: .15, aLz: -(Math.PI - .3) + sw, aLx: -.15 - pull * .5, eLx: -pull * 2, cL: 1,
    aRz: lerp(Math.PI - .3 + sw, .9 + .4 * Math.sin(t * 13), one), aRx: lerp(-.15 - pull * .5, -.4, one), eRx: lerp(-pull * 2, -.5, one), cR: lerp(1, .1, one),
    lLx: -.5 * Math.sin(t * 9) * kick - .1, kL: .4 + .4 * Math.sin(t * 9 + 1) * kick, lRx: .5 * Math.sin(t * 9) * kick - .1, kR: .4 - .4 * Math.sin(t * 9 + 1) * kick,
    lLz: -.06 + sw, lRz: .06 + sw, hx: -.25 + pull * .2, lean: -.05 });
  return p;
}
function pose(t) {
  if (t < TL.rel) {
    const p = hang(t); apply(p); root.position.set(0, 0, 0);
    const h = handTop(); let dy = 0;
    if (t < TL.drop) { const u = t / TL.drop; dy = (1 - u * u) * (FH * .7); } else { const u = t - TL.drop; dy = -Math.sin(u * 26) * Math.exp(-u * 9) * .05; }
    root.position.set(X0 - h.x, TOP + .02 - h.y + dy - ease((t - TL.one) / .2) * .05, 0);
    return {};
  }
  // падение
  const s = hang(TL.rel - 1e-3); apply(s); root.position.set(0, 0, 0); const h = handTop(), y0 = TOP + .02 - h.y - .05;
  const pf = mix(STAND, {}, 0);
  Object.assign(pf, { yaw: .15, aLz: -(Math.PI - .7) + .3 * Math.sin(t * 15), aRz: Math.PI - .7 + .3 * Math.sin(t * 15 + 1.5), aLx: -.3, aRx: -.3, eLx: -.4, eRx: -.4, cL: .1, cR: .1,
    lLx: -.35, kL: .7, lRx: .1, kR: .3, hx: -.3 });
  apply(pf); root.position.set(0, 0, 0); const fall = GROUND - lowFoot(), tl = TL.rel + Math.sqrt(2 * Math.max(.01, y0 - fall) / G);
  if (t < tl) { const u = t - TL.rel; root.position.set(X0, y0 - G * u * u / 2, 0); return {}; }
  // приземление
  const u = t - tl, c = u < .08 ? ease(u / .08) : u < .5 ? 1 : 1 - ease((u - .5) / .65);
  const crouch = Object.assign(mix(STAND, {}, 0), { yaw: .15, lean: .55, lLx: -1.25, kL: 2.1, lRx: -1.0, kR: 1.8, fL: -.85, fR: -.8, lLz: -.18, lRz: .18,
    aLz: -.35, aLx: -.7, eLx: -.6, aRz: .45, aRx: -1.1, eRx: -.2, hx: .2, cL: .5, cR: .2 });
  let p = mix(STAND, crouch, c), x = X0;
  p.yaw = lerp(.15, STAND.yaw, ease(u / 1));
  const tw = tl + 1.25, dist = X0 - XT, dur = Math.max(.6, dist / .9), tt = tw + .35;
  if (t > tw) {
    const turn = ease((t - tw) / .35) * (1 - ease((t - tt - dur) / .45));
    const pw = Math.min(1, Math.max(0, (t - tt) / dur)), e = pw;
    x = X0 - dist * e; const ph = (dist * e) / .55 * Math.PI, amp = t > tt && t < tt + dur ? Math.min(1, (t - tt) * 5, (tt + dur - t) * 5) : 0;
    p = mix(STAND, {}, 0); p.yaw = lerp(STAND.yaw, -1.25, turn);
    const sn = Math.sin(ph);
    p.lLx = -.5 * sn * amp; p.lRx = .5 * sn * amp; p.kL = Math.max(0, sn) * .9 * amp + .02; p.kR = Math.max(0, -sn) * .9 * amp + .02;
    p.aLx = .4 * sn * amp + .05; p.aRx = -.4 * sn * amp + .05; p.lean = .06 * amp;
    const idle = t - (tt + dur);
    if (idle > 0) { p.br = Math.sin(idle * 1.7); p.hy = .12 * Math.sin(idle * .5); p.hx = .03 * Math.sin(idle * .9); }
  }
  apply(p); root.position.set(0, 0, 0); const lf = lowFoot();
  root.position.set(x, GROUND - lf, 0);
  return { end: tw + .35 + dist / .9 };
}

function layout() {
  const w = innerWidth, h = innerHeight, mob = w < 700;
  R.setPixelRatio(Math.min(devicePixelRatio, 2) * .75); R.setSize(w, h, false); cv.style.width = w + 'px'; cv.style.height = h + 'px';
  FH = 1.9 / (mob ? .42 : .62); AW = FH * w / h; TOP = FH / 2;
  cam.left = -AW / 2; cam.right = AW / 2; cam.top = TOP; cam.bottom = -TOP; cam.updateProjectionMatrix();
  GROUND = -FH * (mob ? .2 : .26); X0 = 0; XT = mob ? -AW * .3 : -AW * .16;
  const px = h / FH, sx = (XT + AW / 2) * px;
  txt.style.left = Math.round(sx + .42 * px) + 'px'; txt.style.top = Math.round((TOP - (GROUND + 1.6)) * px) + 'px';
  txt.style.maxWidth = Math.min(440, w - sx - .42 * px - 16) + 'px';
  shadow.position.set(0, GROUND, -1);
}

function frame(now) {
  const t = (now - t0) / 1000, dt = Math.min(.05, (now - last) / 1000); last = now;
  const s = pose(t);
  // тень под ногами только на земле
  shadow.visible = t > TL.rel + .2; shadow.position.x = root.position.x;
  // дым
  cig.updateMatrixWorld(true); tipObj.getWorldPosition(tipW); puffT -= dt;
  if (puffT <= 0) { puffT = .12; const o = puffs[puffI++ % puffs.length]; o.visible = true; o.position.copy(tipW); o.position.z = 2; o.userData.a = 0; }
  puffs.forEach(o => { if (!o.visible) return; o.userData.a += dt; const a = o.userData.a;
    o.position.y += dt * .2; o.position.x += (Math.sin(a * 4 + o.id) * .05 - .12) * dt; o.scale.setScalar(1 + a * 2.5); o.material.opacity = Math.max(0, .32 - a * .24); if (a > 1.4) o.visible = false; });
  if (s.end && t > s.end + .2) txt.classList.add('on');
  R.render(scene, cam);
  if (document.body.dataset.v === 'map') raf = requestAnimationFrame(frame);
}
function start(replay) {
  cancelAnimationFrame(raf); layout();
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches, q = new URLSearchParams(location.search).get('t');
  if (replay) txt.classList.remove('on');
  t0 = performance.now() - (q ? +q * 1000 : (!replay && (done || calm)) ? 60000 : 0); last = performance.now(); done = true;
  raf = requestAnimationFrame(frame);
}
cv.addEventListener('click', () => start(true));
addEventListener('resize', () => { if (document.body.dataset.v === 'map') layout(); });
window.HERO = { start };
if (document.body.dataset.v === 'map') start();
