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
        <g data-cat>
          <ellipse cx="0" cy="0" rx="33" ry="2.5" fill="#fff" opacity=".07"/>
          <g data-body>
            <path data-tail d="M-24-23Q-47-23-43-45Q-41-55-36-50" fill="none" stroke="#e1e3e5" stroke-width="8" stroke-linecap="round"/>
            <g fill="none" stroke="#bfc5cb" stroke-width="7" stroke-linecap="round">
              <path data-leg="0" d="M-20-20L-23-4H-16"/><path data-leg="1" d="M14-20L16-4H23"/>
            </g>
            <path d="M-28-26Q-21-40-1-33L22-31Q31-25 23-14Q1-7-21-13Q-32-14-28-26Z" fill="#f4f4f1"/>
            <g fill="none" stroke="#f9faf7" stroke-width="8" stroke-linecap="round">
              <path data-leg="2" d="M-21-19L-22-4H-15"/><path data-leg="3" d="M15-22L17-4H24"/>
            </g>
            <g data-head>
              <path d="M17-36L15-54Q16-58 20-54L30-45 38-46 47-56Q50-57 50-52L49-35Q54-21 40-18L25-19Q12-23 17-36Z" fill="#fffefa"/>
              <path d="M19-49L20-39 26-44M42-44L47-50 46-39" fill="#dbb8b8"/>
              <path d="M30-32v3M45-33v3" stroke="#53635d" stroke-width="2.6" stroke-linecap="round"/>
              <path d="M39-27l4 0-2 3z" fill="#bd9295"/>
              <path d="M41-24q-2 4-5 2M43-26l14-2m-14 5 13 2M32-26l-13-3m13 6-13 1" fill="none" stroke="#aeb5b4" stroke-width=".8"/>
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
        body.setAttribute('transform', 'translate(0 ' + (-jump - Math.abs(stride) * 1.3) + ')');
        head.setAttribute('transform', 'rotate(' + (playing ? 12 + Math.sin(play * 5) * 5 : 0) + ' 25 -30)');
        tail.setAttribute('transform', 'rotate(' + (Math.sin(time * 3) * 12) + ' -24 -23)');
        legs.forEach((leg, i) => {
          const rear = i % 2 === 0;
          const angle = playing && i === 3 ? -35 * Math.max(0, Math.sin(play * 5)) : stride * (i === 0 || i === 3 ? 22 : -22);
          leg.setAttribute('transform', 'rotate(' + angle + ' ' + (rear ? '-21 -20' : '15 -22') + ')');
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
