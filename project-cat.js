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
            <path data-tail d="M-26-22H-35Q-44-22-44-33V-44Q-44-51-38-51" fill="none" stroke="#34343c" stroke-width="7" stroke-linecap="round"/>
            <g fill="#14141b" stroke="#45454d" stroke-width="1.2">
              <path data-leg="0" d="M-24-24h10v18h5v6h-15z"/><path data-leg="1" d="M11-24h10v18h5v6H11z"/>
            </g>
            <path d="M-30-29Q-30-34-24-34H18L26-27V-12H-26Q-30-12-30-16Z" fill="url(#cat-plastic)" stroke="#52525c" stroke-width="1.2"/>
            <path d="M-25-31H14L20-27H-25Z" fill="#696972" opacity=".35"/>
            <g fill="url(#cat-plastic)" stroke="#4e4e58" stroke-width="1.2">
              <path data-leg="2" d="M-24-23h11v17h6v6h-17z"/><path data-leg="3" d="M11-24h11v18h6v6H11z"/>
            </g>
            <g data-head>
              <rect x="19" y="-29" width="22" height="15" rx="3" fill="#1d1d24" stroke="#45454d"/>
              <path d="M14-32V-53Q14-57 17-55L26-45H39L49-55Q52-57 52-53V-27Q52-20 45-20H21Q14-20 14-27Z" fill="url(#cat-face)" stroke="#5d5d67" stroke-width="1.3"/>
              <path d="M18-49l6 7h-6zm24 7 6-7v7z" fill="#66616d"/>
              <ellipse cx="25" cy="-33" rx="5.5" ry="5" fill="#f1cb38"/><ellipse cx="43" cy="-33" rx="5.5" ry="5" fill="#f1cb38"/>
              <path d="M25-37v8m18-8v8" stroke="#15151b" stroke-width="2.5"/>
              <circle cx="23" cy="-35" r="1.2" fill="#fff2a0"/><circle cx="41" cy="-35" r="1.2" fill="#fff2a0"/>
              <path d="M31-27h6l-3 3z" fill="#81717a"/><path d="M34-24q-3 4-6 1m6-1q3 4 6 1M19-29l-10-2m10 6-10 1m39-5 10-2m-10 6 10 1" fill="none" stroke="#77717e" stroke-width="1"/>
              <path d="M18-39h6m15 0h9" stroke="#8e8e96" stroke-width="1" opacity=".5"/>
            </g>
          </g>
        </g>
      </svg>`;
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
        const width = strip.clientWidth;
        const distance = Math.max(0, width - 180);
        const travel = Math.max(3, distance / 95);
        const lap = travel + 4;
        const direction = Math.floor(time / lap) % 2 ? -1 : 1;
        const phase = time % lap;
        const playing = phase >= travel;
        const play = Math.max(0, phase - travel);
        const progress = Math.min(1, phase / travel);
        const x = direction > 0 ? 90 + distance * progress : 90 + distance * (1 - progress);
        const jumpPhase = (phase - travel * .52) / .85;
        const jump = jumpPhase > 0 && jumpPhase < 1 ? Math.sin(jumpPhase * Math.PI) * 28 : 0;
        const stride = playing ? 0 : Math.sin(time * 14);
        cat.setAttribute('transform', 'translate(' + x + ' 90) scale(' + direction + ' 1)');
        body.setAttribute('transform', 'translate(0 ' + (-jump - Math.abs(stride)*1.5) + ')');
        head.setAttribute('transform', 'translate(0 ' + (playing ? 3 : 0) + ')');
        tail.setAttribute('transform', 'translate(' + Math.round(Math.sin(time * 3)) * 3 + ' 0)');
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
