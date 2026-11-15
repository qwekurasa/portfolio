/* Decorative project mascot. All motion is scoped to the visible project. */
(() => {
  let cleanup = () => {};
  window.ProjectCat = {
    mount(host) {
      cleanup();
      const stage = host.querySelector('.phone-project');
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
        <g data-cat shape-rendering="crispEdges">
          <path d="M-33 0H33V3H-33Z" fill="#343438" opacity=".4"/>
          <g data-body>
            <path data-tail d="M-24-21H-36V-27H-42V-45H-39V-54H-30V-48H-33V-42H-33V-30H-24Z" fill="#17171d" stroke="#42424b" stroke-width="2"/>
            <g fill="#111116" stroke="#35353d" stroke-width="2">
              <path data-leg="0" d="M-24-21H-15V-6H-9V0H-24Z"/>
              <path data-leg="1" d="M12-21H21V-6H27V0H12Z"/>
            </g>
            <path d="M-30-27H-24V-33H-12V-36H12V-33H24V-27H27V-15H18V-12H-21V-15H-30Z" fill="#131319" stroke="#41414a" stroke-width="2"/>
            <path d="M-21-30H-9V-33H9V-30H18V-27H-21Z" fill="#282831"/>
            <g fill="#18181f" stroke="#484852" stroke-width="2">
              <path data-leg="2" d="M-24-18H-15V-6H-9V0H-24Z"/>
              <path data-leg="3" d="M12-21H21V-6H27V0H12Z"/>
            </g>
            <g data-head>
              <path d="M15-36V-54H21V-51H24V-48H27V-42H39V-48H42V-51H45V-54H51V-24H48V-18H21V-21H15Z" fill="#131318" stroke="#4b4b54" stroke-width="2"/>
              <path d="M18-48H21V-45H24V-42H18ZM45-48H48V-42H42V-45H45Z" fill="#56505a"/>
              <path d="M21-36H30V-30H21ZM39-36H48V-30H39Z" fill="#f9d94a"/>
              <path d="M27-36H30V-30H27ZM45-36H48V-30H45Z" fill="#171719"/>
              <path d="M33-27H39V-24H33Z" fill="#928389"/>
              <path d="M33-21H30V-24H33ZM39-21H42V-24H39Z" fill="#56515e"/>
              <path d="M9-30H18V-28H9ZM6-24H18V-22H6ZM48-30H60V-28H48ZM48-24H60V-22H48Z" fill="#686873"/>
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
        cat.setAttribute('transform', 'translate(' + Math.round(x / 3) * 3 + ' 90) scale(' + direction + ' 1)');
        body.setAttribute('transform', 'translate(0 ' + (Math.round((-jump - Math.abs(stride) * 3) / 3) * 3) + ')');
        head.setAttribute('transform', 'translate(0 ' + (playing ? 3 : 0) + ')');
        tail.setAttribute('transform', 'translate(' + Math.round(Math.sin(time * 3)) * 3 + ' 0)');
        legs.forEach((leg, i) => {
          const angle = playing && i === 3 ? -35 * Math.max(0, Math.sin(play * 5)) : stride * (i === 0 || i === 3 ? 22 : -22);
          leg.setAttribute('transform', 'translate(' + Math.round(angle / 8) * 3 + ' ' + (angle > 8 ? -3 : 0) + ')');
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
