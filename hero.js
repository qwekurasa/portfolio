/* A deterministic, resolution-independent miniature office. */
(() => {
  'use strict';
  const map = document.getElementById('map');
  const svg = document.getElementById('hero');
  const card = document.getElementById('heroText');
  const style = document.createElement('style');
  style.textContent = `
    #map{filter:invert(1);background:radial-gradient(ellipse at 38% 65%,#222b2c 0,#111718 38%,#080c0d 75%);touch-action:auto}
    #hero{filter:none;width:100%;height:100%;overflow:visible;pointer-events:none}
    .dream-nav{position:absolute;top:30px;left:36px;right:36px;display:flex;justify-content:space-between;color:#ddd9ce;z-index:8;font-size:13px}
    .dream-nav a:last-child{color:#929b96}
    #heroText{filter:none;left:60%;top:17%;width:34%;max-width:420px;padding:30px 32px 22px;border-radius:30px;background:linear-gradient(145deg,#f4f0e6,#dcded3);color:#293b36;border:1px solid #fff9;box-shadow:0 16px 70px #0003;font-size:16px;line-height:1.65;overflow:visible;transform:translateY(14px) scale(.94);transform-origin:0 100%;transition:opacity 1.2s,transform 1.2s}
    #heroText.on{transform:none}
    #heroText::before,#heroText::after{content:'';position:absolute;border-radius:50%;background:#dddfd4;box-shadow:0 2px 12px #0001}
    #heroText::before{width:24px;height:20px;left:-29px;bottom:-22px}
    #heroText::after{width:11px;height:10px;left:-46px;bottom:-40px}
    #heroText .ht-name{position:static;background:none;border:0;padding:0;margin:0 0 16px!important;color:#6b7c71;font-size:12px;font-weight:500;letter-spacing:.06em}
    #heroText .ht-name::before{display:none}
    #heroText .ht-links{display:flex;flex-wrap:wrap;gap:16px;border:0;margin:20px 0 0;padding:16px 0 0;border-top:1px solid #40564525;font-size:10px;color:#425b4b}
    #heroText .ht-links a{margin:0;color:#425b4b}
    #heroText .ht-links{margin:20px 0 0!important}
    .dream-controls{position:absolute;bottom:29px;left:36px;right:36px;display:flex;align-items:center;gap:22px;color:#97a39b;z-index:8;font-size:12px}
    .dream-controls button{padding:8px 0}
    .dream-controls button:hover,.dream-nav a:hover{color:#f1e8d0}
    .dream-progress{height:2px;background:#ffffff12;flex:1;max-width:130px;margin-right:auto;overflow:hidden}
    .dream-progress span{display:block;height:100%;background:#b6c3a4;transform-origin:left;transform:scaleX(0)}
    body[data-v=map] .dots{display:none}
    @media(max-width:700px){
      .dream-nav{left:22px;right:22px;top:22px}
      #hero{top:auto;bottom:45px;height:61%;width:140%;left:-20%}
      #heroText{left:24px;top:80px;width:calc(100% - 48px);max-width:none;padding:22px 24px 18px;font-size:14px;border-radius:24px}
      #heroText::before{left:52%;bottom:-28px}#heroText::after{left:49%;bottom:-46px}
      .dream-controls{left:22px;right:22px;bottom:18px;gap:16px}
    }
    @media(max-height:540px) and (min-width:701px){#heroText{top:70px;font-size:13px;padding:18px 22px}.dream-nav{top:18px}.dream-controls{bottom:12px}}
    @media(prefers-reduced-motion:reduce){#heroText{transition:none}}
  `;
  document.head.append(style);
  svg.setAttribute('viewBox', '0 0 1200 760');
  svg.setAttribute('shape-rendering', 'geometricPrecision');
  svg.setAttribute('aria-label', 'Артём приходит с кофе, работает за компьютером и засыпает');
  svg.innerHTML = `
  <defs>
    <linearGradient id="d-plastic" x2=".8" y2="1"><stop stop-color="#626a61"/><stop offset=".32" stop-color="#424c46"/><stop offset="1" stop-color="#202b28"/></linearGradient>
    <linearGradient id="d-skin" x2="1" y2=".3"><stop stop-color="#bc9e71"/><stop offset=".25" stop-color="#e5cfaa"/><stop offset=".65" stop-color="#f3dfb7"/><stop offset="1" stop-color="#c7ac7b"/></linearGradient>
    <linearGradient id="d-hair" x2=".7" y2="1"><stop stop-color="#a87740"/><stop offset=".4" stop-color="#774923"/><stop offset="1" stop-color="#3f291c"/></linearGradient>
    <linearGradient id="d-cream" x2=".6" y2="1"><stop stop-color="#ddd8bd"/><stop offset="1" stop-color="#8d927e"/></linearGradient>
    <linearGradient id="d-screen" x2=".7" y2="1"><stop stop-color="#203f38"/><stop offset="1" stop-color="#0c2422"/></linearGradient>
    <linearGradient id="d-desk" x2=".3" y2="1"><stop stop-color="#8a7c62"/><stop offset="1" stop-color="#403d32"/></linearGradient>
    <linearGradient id="d-chair" x2="1" y2=".5"><stop stop-color="#142a27"/><stop offset=".5" stop-color="#38514a"/><stop offset="1" stop-color="#1b302b"/></linearGradient>
    <radialGradient id="d-light"><stop stop-color="#b9b992" stop-opacity=".12"/><stop offset="1" stop-color="#b9b992" stop-opacity="0"/></radialGradient>
    <pattern id="d-studs" width="30" height="24" patternUnits="userSpaceOnUse"><ellipse cx="15" cy="12" rx="6" ry="3" fill="#36413b" stroke="#596053" stroke-opacity=".22"/></pattern>
    <filter id="d-shadow" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
    <g id="d-mug"><ellipse cx="0" cy="24" rx="21" ry="6" fill="#000" opacity=".18"/><path d="M17-12h10q12 0 12 13t-12 13h-8" fill="none" stroke="#c8cbbb" stroke-width="8"/><path d="M-20-16h40v36q-20 10-40 0z" fill="url(#d-cream)" stroke="#edf0db" stroke-width="1"/><ellipse cy="-16" rx="20" ry="6" fill="#ecebd6"/><ellipse cy="-16" rx="15" ry="3.5" fill="#493529"/></g>
    <g id="d-key"><rect width="13" height="8" rx="1.5" fill="#d5d7bf" stroke="#6a7365" stroke-width=".6"/></g>
  </defs>
  <ellipse cx="510" cy="490" rx="470" ry="280" fill="url(#d-light)"/>
  <path d="M125 578L653 525 1040 636 470 718Z" fill="#1b2522"/>
  <path d="M125 578L653 525 1040 636 470 718Z" fill="url(#d-studs)" opacity=".6"/>
  <ellipse cx="530" cy="604" rx="330" ry="39" fill="#000" opacity=".45" filter="url(#d-shadow)"/>
  <!-- Rear equipment and three CRT screens. -->
  <g transform="translate(535 320)">
    <path d="M-215 82h460v19h-460z" fill="#393e33"/>
    <path d="M-202 100v169h12V100m411 0v169h12V100" fill="#292f29"/>
    <g transform="translate(-198 -87) rotate(-5)">
      <path d="M0 0h143l19 13v136H0z" fill="#6d7768"/><rect width="143" height="140" rx="8" fill="url(#d-cream)" stroke="#e9e2c7"/>
      <rect x="12" y="12" width="120" height="93" rx="7" fill="#172f29" stroke="#828f78" stroke-width="5"/>
      <g fill="#78a38b"><rect x="22" y="24" width="43" height="3"/><rect x="22" y="34" width="78" height="2"/><rect x="22" y="44" width="53" height="2"/><rect x="22" y="54" width="85" height="2"/><rect x="22" y="64" width="36" height="2"/></g>
      <rect x="23" y="78" width="9" height="4" fill="#b8ceb2" id="dream-cursor"/><circle cx="122" cy="120" r="3" fill="#718354"/>
      <path d="M46 141h55v13H36v-7z" fill="#a4ab93"/>
    </g>
    <g transform="translate(-30 -122)">
      <path d="M0 0h159l17 14v149H0z" fill="#747d69"/><rect width="159" height="154" rx="8" fill="url(#d-cream)" stroke="#eee6cd"/>
      <rect x="13" y="14" width="132" height="104" rx="7" fill="url(#d-screen)" stroke="#768570" stroke-width="5"/>
      <g stroke="#6c9c87" fill="none" stroke-width="1.5"><rect x="23" y="25" width="53" height="60"/><path d="M23 39h53M29 49h32m-32 8h40m-40 8h27m-27 8h33"/><circle cx="111" cy="50" r="22"/><ellipse cx="111" cy="50" rx="11" ry="22"/><path d="M89 50h44m-39-11h34m-34 22h34M88 91h42m-42 7h30"/></g>
      <circle cx="139" cy="135" r="3" fill="#b2c88b"/><path d="M53 155h53v18H41v-9z" fill="#a4ab93"/>
    </g>
    <g transform="translate(155 -73) rotate(9)">
      <rect width="132" height="126" rx="7" fill="url(#d-cream)" stroke="#e1dfc3"/><rect x="12" y="12" width="108" height="84" rx="5" fill="url(#d-screen)" stroke="#768570" stroke-width="4"/>
      <path d="M22 27h50m-50 9h83m-83 9h67m-67 9h73m-73 9h42m-42 9h80" stroke="#719c81" stroke-width="2"/><circle cx="111" cy="111" r="3" fill="#90b27b"/><path d="M38 128h53v14H30v-7z" fill="#a4ab93"/>
    </g>
    <g transform="translate(318 37)"><rect width="48" height="70" rx="4" fill="#444b40" stroke="#6b7363"/><circle cx="24" cy="39" r="17" fill="#222e27" stroke="#626d5c" stroke-width="3"/><circle cx="24" cy="39" r="7" fill="#3b493d"/><circle cx="24" cy="12" r="4" fill="#18251e"/></g>
  </g>
  <!-- Chair stays behind the figure. -->
  <g id="dream-chair" transform="translate(464 467)">
    <path d="M-53-107Q-72-112-72-85v100q0 24 22 24h90q21 0 21-24V-85q0-27-25-27z" fill="url(#d-chair)" stroke="#5d7161" stroke-width="2"/>
    <path d="M-51-97h74q15 0 15 20v60" fill="none" stroke="#748373" stroke-opacity=".35" stroke-width="3"/>
    <path d="M-62 38q60 15 118 0v18q-58 15-118 0z" fill="#35483c" stroke="#67735f"/>
    <path d="M0 60v59m-48 13 48-13 48 13" stroke="#647062" stroke-width="10" fill="none"/><path d="M0 117v27" stroke="#647062" stroke-width="8"/>
    <g fill="#111b16"><rect x="-57" y="128" width="17" height="12" rx="4"/><rect x="40" y="128" width="17" height="12" rx="4"/><rect x="-8" y="139" width="16" height="12" rx="4"/></g>
  </g>
  <g id="dream-person">
    <g id="dream-leg-l" transform="translate(-28 137)"><path d="M-23 0h46v91h-46z" fill="#19221f" stroke="#4e5950"/><path d="M-24 70h50v30h-50z" fill="#202b25" stroke="#4e5950"/><path d="M-17 6v59" stroke="#556158" stroke-width="2"/></g>
    <g id="dream-leg-r" transform="translate(28 137)"><path d="M-23 0h46v91h-46z" fill="#16201c" stroke="#4e5950"/><path d="M-24 70h50v30h-50z" fill="#1d2822" stroke="#4e5950"/></g>
    <path d="M-48 128h96v25h-96z" fill="#19221e" stroke="#5d675c"/>
    <path d="M-47 34h94l15 101H-62z" fill="url(#d-plastic)" stroke="#828a76" stroke-width="1.6"/>
    <path d="M-45 37-13 34 0 54 13 34 45 37 30 64 13 57 0 64-13 57-30 64Z" fill="#434e43" stroke="#78836d" stroke-width="1.4"/>
    <path d="M0 64v70" stroke="#b3b8a0" stroke-width="2"/><rect x="-3" y="65" width="6" height="11" rx="2" fill="#c8ccb6"/>
    <path d="M-37 96-45 119m82-23 8 23" stroke="#19251e" stroke-width="6"/><path d="M-35 96-43 117m78-21 8 21" stroke="#6b7866" stroke-width="2"/>
    <g id="dream-arm-l" transform="translate(-50 44)">
      <path d="M0-4q-18-3-23 17l-16 62q1 10 22 10l23-63Q14 4 0-4Z" fill="url(#d-plastic)" stroke="#788471" stroke-width="1.5"/>
      <path d="M-16 14-29 64" stroke="#a4ae93" stroke-width="2" opacity=".5"/>
      <g transform="translate(-28 87)"><path d="M-12 13a16 16 0 1 1 24 0" fill="none" stroke="#b79b6c" stroke-width="10"/><path d="M-12 9a15 15 0 1 1 24 0" fill="none" stroke="url(#d-skin)" stroke-width="9"/></g>
    </g>
    <g id="dream-arm-r" transform="translate(50 44)">
      <path d="M0-4q18-3 23 17l16 62q-1 10-22 10L-6 22Q-14 4 0-4Z" fill="url(#d-plastic)" stroke="#788471" stroke-width="1.5"/>
      <g transform="translate(28 87)"><path d="M-12 13a16 16 0 1 1 24 0" fill="none" stroke="#b79b6c" stroke-width="10"/><path d="M-12 9a15 15 0 1 1 24 0" fill="none" stroke="url(#d-skin)" stroke-width="9"/></g>
    </g>
    <g id="dream-head">
      <rect x="-17" y="15" width="34" height="27" rx="5" fill="url(#d-skin)"/>
      <rect x="-48" y="-57" width="96" height="86" rx="25" fill="url(#d-skin)" stroke="#ad9469" stroke-width="1.2"/>
      <path d="M-39-4q10-8 20-3m38 0q10-5 20 3" fill="none" stroke="#382b21" stroke-width="5" stroke-linecap="round"/>
      <g id="dream-eyes" fill="#26271f"><ellipse cx="-24" cy="4" rx="5" ry="6"/><ellipse cx="24" cy="4" rx="5" ry="6"/><circle cx="-25" cy="2" r="1.4" fill="#f8f1d5"/><circle cx="23" cy="2" r="1.4" fill="#f8f1d5"/></g>
      <path id="dream-closed" d="M-30 5q6 5 12 0m36 0q6 5 12 0" fill="none" stroke="#403427" stroke-width="2.5" opacity="0"/>
      <path d="M-13 18q13 6 26 0" fill="none" stroke="#77533a" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M-47 10q-15-13-13-42-11 2-8-9l12-17q-3-18 15-27 8-14 27-11 14-14 31-4 22-3 29 14 20 4 22 22 16 16 6 36l-6 26-10 13-4-45q-15 1-20-19-6 20-30 23l9-16q-16 18-36 20l8-21q-10 18-24 23z" fill="url(#d-hair)" stroke="#ac8151" stroke-width="1.5"/>
      <g fill="none" stroke-linecap="round"><path d="M-51-39q17-36 44-37M-32-40q28-20 30-37M-8-40q27-13 20-42M17-50q18-24 5-33M35-43q8-15 0-29M-42-68q8-12 24-13" stroke="#c39051" stroke-width="3" opacity=".65"/><path d="M-50-21q-1-22 19-37M-19-34q23-8 26-26M42-29q7-25-6-46" stroke="#4f301e" stroke-width="4"/></g>
    </g>
  </g>
  <!-- Foreground desk hides seated hip joints naturally. -->
  <g id="dream-desk">
    <path d="M336 494 795 475 888 529 412 550Z" fill="url(#d-desk)" stroke="#a2987c"/>
    <path d="M412 550 888 529v16l-476 22z" fill="#393c30"/><path d="M336 494v15l76 58v-17z" fill="#474738"/>
    <path d="M421 564v94h14v-95m420-16v80h14v-81" fill="#4f5546" stroke="#6f7560"/>
    <g transform="translate(417 486) skewX(26) scale(1 .65)"><rect x="-9" y="-7" width="175" height="65" rx="4" fill="#c4c6ab" stroke="#e5e5cc" stroke-width="2"/><g id="dream-keys"></g><rect x="40" y="35" width="66" height="9" rx="2" fill="#e2e0c6" stroke="#7a8571"/></g>
    <ellipse cx="710" cy="506" rx="14" ry="9" fill="#b7bda5" stroke="#d5d9c0"/><path d="M710 498v6" stroke="#6c7f6c"/>
  </g>
  <g id="dream-coffee"><use href="#d-mug"/></g>
  <g id="dream-steam" fill="none" stroke="#e6dec2" stroke-width="2" stroke-linecap="round" opacity=".2"><path d="M0 0q-7-12 0-23t0-24"/><path d="M13 0q-7-12 0-23t0-24"/></g>
  <g id="dream-sleep" fill="#b1c5ac" font-family="Georgia,serif" font-style="italic" opacity="0"><text x="492" y="325" font-size="17">z</text><text x="511" y="302" font-size="24">z</text><text x="538" y="274" font-size="30">z</text></g>
  `;
  const keys = svg.querySelector('#dream-keys');
  for (let row=0;row<3;row++) for(let column=0;column<10;column++) {
    keys.insertAdjacentHTML('beforeend', '<use href="#d-key" x="'+column*15+'" y="'+row*11+'"/>');
  }
  const nav = document.createElement('nav');
  nav.className='dream-nav';nav.setAttribute('aria-label','Главная навигация');
  nav.innerHTML='<a href="#map">qwekurasa</a><a href="#index">Проекты ↗</a>';
  map.append(nav);
  const controls = document.createElement('div');
  controls.className='dream-controls';
  controls.innerHTML='<div class="dream-progress" aria-hidden="true"><span></span></div><button type="button" data-action="pause">Пауза</button><button type="button" data-action="skip">Обо мне ↗</button><button type="button" data-action="replay" hidden>Ещё раз ↺</button>';
  map.append(controls);
  const nodes={};
  for(const name of ['person','leg-l','leg-r','arm-l','arm-r','head','eyes','closed','coffee','steam','sleep','cursor']) nodes[name]=svg.querySelector('#dream-'+name);
  const pause=controls.querySelector('[data-action=pause]');
  const skip=controls.querySelector('[data-action=skip]');
  const replay=controls.querySelector('[data-action=replay]');
  const progress=controls.querySelector('span');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=t=>Math.max(0,Math.min(1,t));
  const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
  const lerp=(a,b,t)=>a+(b-a)*t;
  let elapsed=0,last=0,raf=0,started=false,paused=false;
  const duration=20;
  function transform(name,value){nodes[name].setAttribute('transform',value);}
  function render(t) {
    const arrive=ease(t/3);
    const sit=ease((t-3)/1);
    const drink=ease((t-4)/1.1)*(1-ease((t-6)/1));
    const put=ease((t-7)/1.3);
    const working=clamp((t-8.3)/.5)*(1-ease((t-15)/1.5));
    const sleep=ease((t-15.5)/2.4);
    const walk=Math.sin(t*10)*(1-arrive);
    const x=lerp(166,458,arrive),y=lerp(346,364,sit)-Math.abs(walk)*4;
    const tap=Math.sin(t*22)*working*4;
    transform('person','translate('+x+' '+y+')');
    transform('leg-l','translate(-28 137) rotate('+lerp(walk*15,-73,sit)+')');
    transform('leg-r','translate(28 137) rotate('+lerp(-walk*15,-73,sit)+')');
    transform('head','rotate('+(-5*drink+23*sleep)+' 0 32) translate(0 '+(sleep*9)+')');
    const leftArm=-130*drink+working*(-25+tap)+sleep*-18;
    transform('arm-l','translate(-50 44) rotate('+leftArm+')');
    transform('arm-r','translate(50 44) rotate('+(-walk*12+working*(25-tap)+sleep*17)+')');
    const angle=leftArm*Math.PI/180;
    const mugX=x-50-28*Math.cos(angle)-87*Math.sin(angle)-28;
    const mugY=y+44-28*Math.sin(angle)+87*Math.cos(angle)-3;
    const cupX=lerp(mugX,386,put),cupY=lerp(mugY,508,put);
    transform('coffee','translate('+cupX+' '+cupY+') rotate('+(-13*drink)+') scale(.84)');
    transform('steam','translate('+(cupX-4)+' '+(cupY-28-Math.sin(t*1.2)*3)+')');
    nodes.steam.style.opacity=String(.13+.06*Math.sin(t*1.8));
    nodes.eyes.style.opacity=String(1-sleep);
    nodes.closed.style.opacity=String(sleep);
    nodes.sleep.style.opacity=String(ease((t-17)/1.5));
    transform('sleep','translate(0 '+(-3*Math.sin(t*1.5))+')');
    nodes.cursor.style.opacity=t<17&&Math.floor(t*2)%2?'0':'1';
    const dreaming=t>=18;
    card.classList.toggle('on',dreaming);
    card.inert=!dreaming;
    card.setAttribute('aria-hidden',String(!dreaming));
    progress.style.transform='scaleX('+clamp(t/duration)+')';
    pause.hidden=t>=duration;
    skip.hidden=dreaming;
    replay.hidden=!dreaming;
  }
  function frame(now) {
    raf=0;
    if(document.body.dataset.v!=='map'||document.hidden){last=0;return;}
    if(!paused){elapsed=Math.min(duration,elapsed+(last?Math.min((now-last)/1000,.1):0));render(elapsed);}
    last=now;
    if(elapsed<duration&&!paused)raf=requestAnimationFrame(frame);
  }
  function schedule(){cancelAnimationFrame(raf);last=0;raf=requestAnimationFrame(frame);}
  function start(restart=false) {
    if(restart){elapsed=0;paused=false;pause.textContent='Пауза';}
    if(!started){
      const query=Number(new URLSearchParams(location.search).get('t'));
      elapsed=reduced.matches?duration:Math.max(0,Math.min(duration,query));
      started=true;
    }
    if(reduced.matches)elapsed=duration;
    render(elapsed);schedule();
  }
  pause.onclick=()=>{paused=!paused;pause.textContent=paused?'Продолжить':'Пауза';schedule();};
  skip.onclick=()=>{elapsed=duration;paused=false;render(elapsed);cancelAnimationFrame(raf);};
  replay.onclick=()=>start(true);
  reduced.addEventListener('change',()=>start());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&document.body.dataset.v==='map')schedule();});
  window.HERO={start};
  if(document.body.dataset.v==='map')start();
})();
