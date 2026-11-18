/* Decorative project mascot. All motion is scoped to the visible project. */
(() => {
  let cleanup = () => {};
  window.ProjectCat = {
    mount(host) {
      cleanup();
      const stage = host.querySelector('.st');
      if (!stage) return;
      stage.style.position = 'relative';
      const strip = document.createElement('div');
      strip.setAttribute('aria-hidden', 'true');
      strip.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:96px;overflow:hidden;pointer-events:none;filter:invert(1);z-index:4';
      strip.innerHTML = `<svg width="100%" height="96" xmlns="http://www.w3.org/2000/svg">
        <g data-ball opacity="0">
          <circle r="10" fill="#d5c4b1"/>
          <g fill="none" stroke="#8e7f70" stroke-width="1.1">
            <path d="M-8-5Q5-9 9 4M-10 0Q0-4 8 7M-7 7Q-2 0-4-9M1-10Q7 0 0 10M-9 4Q0 7 8-6"/>
          </g>
        </g>
        <defs>
          <linearGradient id="cat-plastic" x2=".7" y2="1"><stop stop-color="#515159"/><stop offset=".24" stop-color="#25252b"/><stop offset="1" stop-color="#08080c"/></linearGradient>
          <linearGradient id="cat-face" x2=".7" y2="1"><stop stop-color="#3d3d45"/><stop offset=".5" stop-color="#17171d"/><stop offset="1" stop-color="#09090d"/></linearGradient>
        </defs>
        <g data-cat>
          <ellipse cy="1" rx="34" ry="2" fill="#50505a" opacity=".2"/>
          <g data-body>
            <path data-tail d="M-25-24C-48-32-29-66-42-72C-58-78-55-56-49-59" fill="none" stroke="#282831" stroke-width="5" stroke-linecap="round"/>
            <g fill="#16161d" stroke="#363640" stroke-width="1">
             <path data-leg="0" d="M-24-25Q-32-15-26-5L-31-2Q-32 2-20 0L-16-24Z"/>
             <path data-leg="1" d="M12-28L14-5Q6-4 9 0H23L24-28Z"/>
            </g>
            <path d="M-29-26C-25-37-6-28 5-31C11-36 9-48 18-48C28-47 31-28 24-19C11-11-13-14-29-20Z" fill="url(#cat-plastic)" stroke="#40404b" stroke-width="1"/>
            <g fill="url(#cat-plastic)" stroke="#45454e" stroke-width="1">
             <path data-leg="2" d="M-24-26Q-34-17-23-7L-28-3Q-32 2-17 0Q-10-5-15-14L-9-25Z"/>
             <path data-leg="3" d="M17-30Q15-16 18-4Q11-3 13 0H28Q29-4 25-7L27-29Z"/>
            </g>
            <g data-head>
             <path d="M13-45L10-66Q12-72 16-67L26-58Q33-59 40-57L51-67Q55-70 54-63L52-47C58-35 46-27 35-27C21-27 10-34 13-45Z" fill="url(#cat-face)" stroke="#56545f" stroke-width="1"/>
             <path d="M15-63L17-51L24-56ZM49-61L43-55L50-51Z" fill="#785c65"/>
             <ellipse cx="25" cy="-44" rx="8" ry="9" fill="#192127"/><ellipse cx="44" cy="-43" rx="8" ry="9" fill="#192127"/>
             <ellipse cx="25" cy="-43" rx="6.2" ry="7.3" fill="#75bbce"/><ellipse cx="44" cy="-42" rx="6.2" ry="7.3" fill="#75bbce"/>
             <ellipse cx="25" cy="-43" rx="1.8" ry="6" fill="#101419"/><ellipse cx="44" cy="-42" rx="1.8" ry="6" fill="#101419"/>
             <circle cx="23" cy="-46" r="1.7" fill="#d4ebed"/><circle cx="42" cy="-45" r="1.7" fill="#d4ebed"/>
             <path d="M17-48Q24-54 32-47M36-47Q45-52 51-45" fill="none" stroke="#32323d" stroke-width="3"/>
             <path d="M30-34Q35-37 39-33L35-30Z" fill="#c38d8c"/>
             <path d="M35-30Q29-25 25-30M35-30Q40-25 44-30M25-34L2-38M25-31L0-30M43-32L64-35M44-29L64-26" fill="none" stroke="#9b939f" stroke-width=".7"/>
            </g>
          </g>
        </g>
      </svg>`;
      const ns='http://www.w3.org/2000/svg';
      const fur=document.createElementNS(ns,'g');fur.setAttribute('fill','none');fur.setAttribute('stroke','#77717f');fur.setAttribute('stroke-width','.45');fur.setAttribute('opacity','.28');
      for(let i=0;i<70;i++){const path=document.createElementNS(ns,'path'),x=-22+(i*17%44),y=-26+(i*7%10);path.setAttribute('d',`M${x} ${y}q-2 3 2 5`);fur.append(path);}strip.querySelector('[data-body]').insertBefore(fur,strip.querySelector('[data-head]'));
      stage.append(strip);
      const cat = strip.querySelector('[data-cat]');
      const body = strip.querySelector('[data-body]');
      const head = strip.querySelector('[data-head]');
      const tail = strip.querySelector('[data-tail]');
      const ball = strip.querySelector('[data-ball]');
      const legs = [...strip.querySelectorAll('[data-leg]')];
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      let time = 0, last = 0, raf = 0, visible = false, destroyed = false;
      function draw() {
        const poseTime=Math.floor(time*12)/12;
        const width = strip.clientWidth;
        const distance = Math.max(0, width - 180);
        const travel = Math.max(3, distance / 95);
        const lap = travel + 4;
        const direction = Math.floor(time / lap) % 2 ? -1 : 1;
        const phase = time % lap;
        const playing = phase >= travel;
        const play = Math.max(0, phase - travel);
        const progress = Math.min(1, (Math.floor(phase*12)/12) / travel);
        const x = direction > 0 ? 90 + distance * progress : 90 + distance * (1 - progress);
        const jumpPhase = (phase - travel * .52) / .85;
        const jump = jumpPhase > 0 && jumpPhase < 1 ? Math.sin(jumpPhase * Math.PI) * 28 : 0;
        const stride = playing ? 0 : Math.sin(poseTime * 14);
        cat.setAttribute('transform', 'translate(' + x + ' 90) scale(' + direction + ' 1)');
        body.setAttribute('transform', 'translate(0 ' + (-jump - Math.abs(stride)*1.5) + ')');
        head.setAttribute('transform', 'rotate('+(playing?Math.sin(poseTime*2)*12:Math.sin(poseTime*5)*4)+' 34 -40)');
        tail.setAttribute('transform', 'translate(' + Math.round(Math.sin(poseTime * 3)) * 3 + ' 0)');
        legs.forEach((leg, i) => {
          const angle = playing && i === 3 ? -35 * Math.max(0, Math.sin(play * 5)) : stride * (i === 0 || i === 3 ? 22 : -22);
          leg.setAttribute('transform', 'rotate(' + angle + ' ' + (i % 2 === 0 ? '-19 -23' : '16 -23') + ')');
        });
        ball.setAttribute('opacity', playing ? Math.min(1, play * 3, (4 - play) * 3) : 0);
        const roll = Math.max(0, Math.sin(play * 5)) * 13;
        ball.setAttribute('transform', 'translate(' + (x + direction * (60 + roll)) + ' ' + (80 - roll * .22) + ') rotate(' + roll * direction * 9 + ')');
      }
      function frame(now) {
        raf = 0;
        if (destroyed || !visible || document.hidden || document.body.dataset.v !== 'project') { last = 0; return; }
        if (last) time += Math.min(.05, (now - last) / 1000);
        last = now;
        draw();
        if (!reduced.matches) raf = requestAnimationFrame(frame);
      }
      function resume() { cancelAnimationFrame(raf); last = 0; draw(); if (visible && !reduced.matches) raf = requestAnimationFrame(frame); }
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
      observer.observe(strip);
      const resize = new ResizeObserver(draw);
      resize.observe(strip);
      document.addEventListener('visibilitychange', resume);
      reduced.addEventListener('change', resume);
      const route = () => { if (document.body.dataset.v !== 'project') { cancelAnimationFrame(raf); last = 0; } };
      addEventListener('hashchange', route);
      draw();
      cleanup = () => {
        destroyed = true; cancelAnimationFrame(raf); observer.disconnect(); resize.disconnect();
        document.removeEventListener('visibilitychange', resume); reduced.removeEventListener('change', resume);
        removeEventListener('hashchange', route); strip.remove();
      };
    }
  };
})();
