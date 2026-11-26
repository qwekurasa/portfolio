(() => {
  function mount(root, media) {
    if (!media.length) return () => {};
    const stage = root.querySelector('.design-carousel-stage');
    const controls = root.querySelector('.design-carousel-controls');
    const playback = controls.querySelector('[data-playback]');
    const position = controls.querySelector('[data-position]');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const slides = media.map(({ src, alt }, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'design-slide';
      const image = new Image();
      const label = document.createElement('textarea');
      label.innerHTML = alt;
      image.alt = label.value;
      image.draggable = false;
      image.decoding = 'async';
      card.setAttribute('aria-label', label.value || 'Изображение ' + (i + 1));
      card.append(image);
      stage.append(card);
      card.addEventListener('click', () => {
        const side = Number(card.dataset.side);
        if (side) show(i, Math.sign(side));
      });
      return { card, image, src, offset: null };
    });

    let index = 0;
    let paused = motion.matches;
    let inView = false;
    let animating = false;
    const animations = new Set();
    const wrap = i => (i + slides.length) % slides.length;

    function offsetFor(i, current, direction) {
      const forward = wrap(i - current);
      const back = forward - slides.length;
      if (forward === -back) return direction > 0 ? forward : back;
      return forward < -back ? forward : back;
    }

    function pose(offset) {
      const slot = Math.max(-2, Math.min(2, offset));
      const depth = Math.abs(slot);
      return {
        transform: 'translate3d(' + (slot * 68) + '%,0,' + (-depth * 105) + 'px) rotateY(' + (-slot * 31) + 'deg) scale(' + (depth ? .90 : 1) + ')',
        opacity: depth === 0 ? 1 : depth === 1 ? .63 : 0,
        zIndex: 3 - depth,
      };
    }

    function show(i, direction = 1, initial = false) {
      if (animating) return;
      const next = wrap(i);
      if (next === index && !initial) return;
      index = next;
      const running = [];

      slides.forEach((slide, n) => {
        const offset = offsetFor(n, next, direction);
        const poseNext = pose(offset);
        const visible = Math.abs(offset) <= 1;
        if (visible && !slide.image.hasAttribute('src')) slide.image.src = slide.src;
        const { card } = slide;
        card.style.transform = poseNext.transform;
        card.style.opacity = poseNext.opacity;
        card.style.zIndex = poseNext.zIndex;
        card.setAttribute('aria-hidden', String(!visible));
        card.setAttribute('aria-disabled', String(offset === 0));
        card.tabIndex = visible && offset !== 0 ? 0 : -1;
        if (visible && offset !== 0) card.dataset.side = offset;
        else delete card.dataset.side;

        if (!initial && !motion.matches && (visible || Math.abs(slide.offset) <= 1)) {
          const before = pose(slide.offset);
          const crosses = Math.abs(slide.offset - offset) > 1;
          const frames = crosses
            ? [before, { ...pose(slide.offset - direction), opacity: 0, offset: .45 }, { ...pose(offset + direction), opacity: 0, offset: .55 }, poseNext]
            : [before, poseNext];
          const animation = card.animate(frames, { duration: 540, easing: 'cubic-bezier(.22,.75,.28,1)' });
          animations.add(animation);
          running.push(animation.finished.catch(() => {}).finally(() => animations.delete(animation)));
        }
        slide.offset = offset;
      });
      position.textContent = (index + 1) + ' / ' + slides.length;
      if (running.length) {
        animating = true;
        Promise.all(running).then(() => { animating = false; });
      }
    }

    function updatePlayback() {
      playback.textContent = paused ? 'Авто · выкл.' : 'Авто · вкл.';
      playback.setAttribute('aria-pressed', String(!paused));
    }

    function onPreferenceChange() {
      paused = motion.matches;
      updatePlayback();
    }

    controls.hidden = slides.length < 2;
    show(0, 1, true);
    if (slides.length < 2) return () => {};

    controls.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button === playback) {
        paused = !paused;
        updatePlayback();
        return;
      }
      const direction = Number(button.dataset.step);
      show(index + direction, direction);
    });
    root.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      show(index + direction, direction);
    });
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; });
    observer.observe(stage);
    const timer = setInterval(() => {
      if (!paused && inView && !document.hidden && !root.matches(':hover') && !root.contains(document.activeElement)) show(index + 1);
    }, 4200);
    motion.addEventListener('change', onPreferenceChange);
    updatePlayback();
    return () => {
      clearInterval(timer);
      observer.disconnect();
      motion.removeEventListener('change', onPreferenceChange);
      animations.forEach(animation => animation.cancel());
    };
  }

  window.DesignCarousel = { mount };
})();
