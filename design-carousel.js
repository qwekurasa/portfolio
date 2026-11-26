(() => {
  function mount(root, media) {
    if (!media.length) return () => {};
    const stage = root.querySelector('.design-carousel-stage');
    const controls = root.querySelector('.design-carousel-controls');
    const playback = controls.querySelector('[data-playback]');
    const position = controls.querySelector('[data-position]');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const slides = media.map(({ src, alt }) => {
      const image = new Image();
      const label = document.createElement('textarea');
      label.innerHTML = alt;
      image.alt = label.value;
      image.draggable = false;
      image.decoding = 'async';
      return { image, src };
    });

    let index = 0;
    let current = null;
    let paused = motion.matches;
    let inView = false;
    let disposed = false;
    let changing = false;

    function prepare(i) {
      const { image, src } = slides[i];
      if (!image.hasAttribute('src')) image.src = src;
      return image;
    }

    async function show(i, direction = 1) {
      if (changing || disposed) return;
      const next = (i + slides.length) % slides.length;
      if (next === index && current) return;
      changing = true;
      const image = prepare(next);
      await image.decode().catch(() => {});
      if (disposed) return;
      index = next;
      const previous = current;
      current = image;
      stage.replaceChildren(image);
      position.textContent = (index + 1) + ' / ' + slides.length;
      if (previous && !motion.matches) {
        stage.prepend(previous);
        previous.setAttribute('aria-hidden', 'true');
        image.removeAttribute('aria-hidden');
        const duration = 460;
        const timing = { duration, easing: 'cubic-bezier(.22,.75,.28,1)' };
        const outgoing = previous.animate([{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(' + (-direction * 15) + '%)' }], timing);
        image.animate([{ opacity: 0, transform: 'translateX(' + (direction * 15) + '%)' }, { opacity: 1, transform: 'translateX(0)' }], timing);
        await outgoing.finished.catch(() => {});
        previous.remove();
      } else {
        image.removeAttribute('aria-hidden');
      }
      changing = false;
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
    show(0);
    if (slides.length < 2) return () => { disposed = true; };

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
      if (!paused && inView && !document.hidden && !stage.matches(':hover') && !root.contains(document.activeElement)) show(index + 1);
    }, 4200);
    motion.addEventListener('change', onPreferenceChange);
    updatePlayback();
    return () => {
      disposed = true;
      clearInterval(timer);
      observer.disconnect();
      motion.removeEventListener('change', onPreferenceChange);
    };
  }

  window.DesignCarousel = { mount };
})();
