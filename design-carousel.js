(() => {
  function mount(root, media) {
    if (!media.length) return () => {};
    const stage = root.querySelector('.design-carousel-stage');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    // A two-image loop also needs a copy on each side of the active card.
    const items = media.length === 2 ? [...media, ...media] : media;
    const count = items.length;
    const wrap = value => ((value % count) + count) % count;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    let width = 0, height = 0, angle = 0, target = 0, direction = 1;
    let frame = 0, timer = 0, drag = null, ignoreClick = false, visible = false;

    const slides = items.map(({ src, alt, width: sourceWidth, height: sourceHeight }, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'design-slide';
      const image = new Image();
      const label = document.createElement('textarea');
      label.innerHTML = alt;
      image.alt = label.value;
      image.draggable = false;
      image.decoding = 'async';
      card.setAttribute('aria-label', label.value || 'Изображение ' + (i % media.length + 1));
      card.append(image);
      stage.append(card);
      card.addEventListener('click', () => {
        const side = Number(card.dataset.side);
        if (side) go(target + side);
      });
      const ratio = sourceWidth / sourceHeight;
      const slide = { card, image, src, ratio: ratio > 0 && Number.isFinite(ratio) ? ratio : 1 };
      image.addEventListener('load', () => {
        if (!image.naturalWidth || !image.naturalHeight || !stage.isConnected) return;
        slide.ratio = image.naturalWidth / image.naturalHeight;
        resize();
      }, { once: true });
      return slide;
    });

    function resize() {
      width = stage.clientWidth;
      height = stage.clientHeight;
      const maxWidth = Math.max(0, Math.min(width * .62, 680) - 2);
      const maxHeight = Math.max(0, height * .94 - 2);
      for (const slide of slides) {
        const innerHeight = Math.min(maxHeight, maxWidth / slide.ratio);
        slide.width = innerHeight * slide.ratio + 2;
        slide.card.style.width = slide.width + 'px';
        slide.card.style.height = innerHeight + 2 + 'px';
      }
      draw();
    }

    function offsetFor(index, current) {
      const forward = wrap(index - current);
      const backward = forward - count;
      if (forward === -backward) return direction > 0 ? forward : backward;
      return forward < -backward ? forward : backward;
    }

    function draw() {
      const base = Math.floor(angle), fraction = angle - base;
      const leftWidth = slides[wrap(base)].width;
      const centerWidth = leftWidth + (slides[wrap(base + 1)].width - leftWidth) * fraction;
      slides.forEach((slide, index) => {
        const offset = offsetFor(index, angle);
        const slot = clamp(offset, -2, 2);
        const depth = Math.abs(slot);
        const yaw = -slot * 34;
        const radians = yaw * Math.PI / 180;
        const z = -depth * 168;
        // Bound the projected card corners so the frame stays inside the stage while turning.
        const nearEdge = z + Math.abs(Math.sin(radians)) * slide.width / 2;
        const magnification = 900 / (900 - nearEdge);
        const halfCard = Math.abs(Math.cos(radians)) * slide.width / 2;
        const maxShift = Math.max(0, (width / 2 - 4) / magnification - halfCard);
        const shift = Math.sign(slot) * Math.min(depth * (centerWidth * .43 + slide.width * .38), maxShift);
        const opacity = depth < 1 ? 1 - depth * .37 : .63 * (1 - Math.min(1, (depth - 1) * 2));
        if (depth <= 1.5 && !slide.image.hasAttribute('src')) slide.image.src = slide.src;
        slide.card.style.opacity = opacity;
        slide.card.style.zIndex = Math.round(100 - depth * 40);
        slide.card.style.transform = 'translate3d(' + shift + 'px,0,' + z + 'px) rotateY(' + yaw + 'deg)';
      });
    }

    function updateControls() {
      slides.forEach(({ card }, index) => {
        const offset = offsetFor(index, target);
        const side = Math.abs(offset) === 1;
        card.setAttribute('aria-hidden', String(Math.abs(offset) > 1));
        card.setAttribute('aria-disabled', String(offset === 0));
        card.tabIndex = side ? 0 : -1;
        if (side) card.dataset.side = offset;
        else delete card.dataset.side;
      });
    }

    function schedule() {
      clearTimeout(timer);
      if (count < 2 || !visible || document.hidden || motion.matches || drag) return;
      timer = setTimeout(() => go(target + 1), 3000);
    }

    function go(next) {
      cancelAnimationFrame(frame);
      if (next !== target) direction = Math.sign(next - target);
      target = next;
      updateControls();
      const start = angle;
      if (motion.matches || Math.abs(start - target) < .001) {
        angle = target;
        draw();
      } else {
        const started = performance.now();
        function turn(now) {
          const t = clamp((now - started) / 580, 0, 1);
          const eased = t * t * (3 - 2 * t);
          angle = start + (target - start) * eased;
          draw();
          if (t < 1) frame = requestAnimationFrame(turn);
        }
        frame = requestAnimationFrame(turn);
      }
      schedule();
    }

    resize();
    updateControls();
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(stage);
    if (count < 2) return () => sizeObserver.disconnect();

    stage.classList.add('is-draggable');
    stage.tabIndex = 0;
    stage.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      ignoreClick = false;
      drag = { pointer: event.pointerId, x: event.clientX, angle, moved: false };
      clearTimeout(timer);
    });
    stage.addEventListener('pointermove', event => {
      if (drag?.pointer !== event.pointerId) return;
      const delta = event.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(delta) < 6) return;
        cancelAnimationFrame(frame);
        drag.angle = angle;
        drag.moved = true;
        stage.setPointerCapture(event.pointerId);
        stage.classList.add('is-dragging');
      }
      direction = delta < 0 ? 1 : -1;
      const distance = Math.max(80, width * .28);
      angle = drag.angle - clamp(delta / distance, -2, 2);
      draw();
    });
    function endDrag(event) {
      if (drag?.pointer !== event.pointerId) return;
      const { moved, angle: start } = drag;
      drag = null;
      stage.classList.remove('is-dragging');
      if (!moved) { schedule(); return; }
      ignoreClick = true;
      const delta = angle - start;
      const next = Math.round(angle + (Math.abs(delta) > .16 ? Math.sign(delta) * .34 : 0));
      go(next);
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('lostpointercapture', endDrag);
    stage.addEventListener('pointerleave', event => { if (!drag?.moved) endDrag(event); });
    stage.addEventListener('click', event => {
      if (!ignoreClick || !event.detail) return;
      event.preventDefault();
      event.stopPropagation();
      ignoreClick = false;
    }, true);
    root.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
      event.preventDefault();
      go(target + (event.key === 'ArrowRight' ? 1 : -1));
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    observer.observe(stage);
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      observer.disconnect();
      sizeObserver.disconnect();
      document.removeEventListener('visibilitychange', schedule);
      motion.removeEventListener('change', schedule);
    };
  }

  window.DesignCarousel = { mount };
})();
