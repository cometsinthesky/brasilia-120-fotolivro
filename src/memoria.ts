// Brasília 120 — Memória Fotográfica. Visualizador independente do fotolivro.
(() => {
  const get = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const grid = get<HTMLDivElement>('memoria-grid');
  if (!grid) return;
  const dialog = get<HTMLDialogElement>('memoria-dialog');
  const stage = get<HTMLDivElement>('memoria-stage');
  const image = get<HTMLImageElement>('memoria-image');
  const leaf = get<HTMLDivElement>('memoria-turn');
  const leafImage = get<HTMLImageElement>('memoria-turn-image');
  const shade = get<HTMLDivElement>('memoria-shade');
  const status = get<HTMLDivElement>('memoria-status');
  const previous = get<HTMLButtonElement>('memoria-prev');
  const next = get<HTMLButtonElement>('memoria-next');
  const close = get<HTMLButtonElement>('memoria-close');
  const counter = get<HTMLSpanElement>('memoria-current');
  const count = 42;
  const format = (n: number) => String(n).padStart(2, '0');
  const url = (n: number) => `mural/${format(n)}-large.jpg`;
  const description = (n: number) => `Fotografia histórica noturna de Brasília ${format(n)} — Arquivo Público do Distrito Federal`;
  const valid = (n: number) => n >= 1 && n <= count;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const cache = new Map<number, Promise<HTMLImageElement>>();
  let current = 1, session = 0, busy = false, lastTrigger: HTMLButtonElement | null = null;
  let progress = 0, previewTarget = 0, previewDirection = 1;
  interface Drag { id: number; x: number; y: number; dx: number; start: number; horizontal: boolean; target: number; }
  let drag: Drag | null = null;

  const load = (n: number): Promise<HTMLImageElement> => {
    const cached = cache.get(n); if (cached) return cached;
    const task = new Promise<HTMLImageElement>((resolve, reject) => {
      const photo = new Image(); photo.decoding = 'async';
      photo.onload = () => resolve(photo); photo.onerror = () => reject(new Error(url(n)));
      photo.src = url(n);
    });
    cache.set(n, task);
    void task.catch(() => { if (cache.get(n) === task) cache.delete(n); });
    // Keep a small preloading window; the browser's HTTP cache handles revisits.
    while (cache.size > 6) cache.delete(cache.keys().next().value!);
    return task;
  };
  const preload = () => { for (const n of [current - 1, current + 1]) if (valid(n)) void load(n).catch(() => {}); };
  const message = (text = '') => { status.textContent = text; status.hidden = !text; };
  const sync = () => {
    counter.textContent = format(current);
    previous.disabled = busy || current === 1;
    next.disabled = busy || current === count;
  };
  const showImage = (n: number, photo?: HTMLImageElement) => { image.src = photo?.src ?? url(n); image.alt = description(n); };
  const paint = (p: number) => {
    progress = Math.min(1, Math.max(0, p));
    leaf.style.transformOrigin = previewDirection > 0 ? 'left center' : 'right center';
    leaf.style.transform = `rotateY(${previewDirection * -89.5 * progress}deg)`;
    leaf.style.opacity = String(progress > .85 ? (1 - progress) / .15 : 1);
    shade.style.opacity = String(progress * .75);
  };
  const clearLeaf = (restore: boolean) => {
    if (restore && previewTarget) showImage(current);
    leaf.hidden = true; leafImage.removeAttribute('src'); previewTarget = 0; progress = 0;
  };
  const begin = (target: number, photo: HTMLImageElement) => {
    if (previewTarget === target) return;
    clearLeaf(true); previewTarget = target; previewDirection = target > current ? 1 : -1;
    leafImage.src = image.currentSrc || image.src; showImage(target, photo); paint(0); leaf.hidden = false;
  };
  const animate = (end: number, duration: number, token: number): Promise<void> => {
    if (reducedMotion.matches || duration <= 0) { if (token === session) paint(end); return Promise.resolve(); }
    const from = progress;
    return new Promise(resolve => {
      const start = performance.now();
      const step = (time: number) => {
        if (token !== session || !dialog.open) { resolve(); return; }
        const t = Math.min(1, (time - start) / duration); const eased = 1 - Math.pow(1 - t, 3);
        paint(from + (end - from) * eased);
        if (t < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
  };
  const navigate = async (target: number, usePreview = false) => {
    if (!dialog.open || busy || !valid(target) || target === current) return;
    const token = session; busy = true; sync(); message('Carregando fotografia…');
    try {
      const photo = await load(target);
      if (token !== session || !dialog.open) return;
      message();
      if (!reducedMotion.matches) {
        if (!usePreview || previewTarget !== target) begin(target, photo);
        await animate(1, Math.max(130, 430 * (1 - progress)), token);
        if (token !== session || !dialog.open) return;
      }
      current = target; showImage(current, photo); clearLeaf(false); preload();
    } catch { if (token === session && dialog.open) { clearLeaf(true); message('Não foi possível carregar a fotografia. Tente novamente.'); } }
    finally { if (token === session) { busy = false; sync(); } }
  };
  const open = async (n: number, trigger: HTMLButtonElement) => {
    if (dialog.open) return;
    const token = ++session; current = n; lastTrigger = trigger; busy = true; drag = null; clearLeaf(false); sync();
    image.removeAttribute('src'); image.alt = ''; message('Carregando fotografia…');
    dialog.showModal(); document.body.classList.add('memoria-open'); close.focus({preventScroll:true});
    try { const photo = await load(n); if (token !== session || !dialog.open) return; showImage(n, photo); message(); preload(); }
    catch { if (token === session && dialog.open) message('Fotografia indisponível. Verifique o arquivo ou avance.'); }
    finally { if (token === session) { busy = false; sync(); } }
  };
  const fragment = document.createDocumentFragment();
  for (let n = 1; n <= count; n++) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'thumb memoria-thumb';
    button.setAttribute('aria-label', `Ampliar ${description(n)}`);
    const frame = document.createElement('span'); frame.className = 'memoria-thumb-frame';
    const photo = document.createElement('img'); photo.loading = 'lazy'; photo.decoding = 'async'; photo.draggable = false; photo.alt = description(n); photo.src = url(n);
    frame.append(photo); const number = document.createElement('span'); number.className = 'memoria-thumb-number'; number.textContent = format(n);
    button.append(frame, number); button.addEventListener('click', () => void open(n, button)); fragment.append(button);
  }
  grid.append(fragment);
  previous.addEventListener('click', () => void navigate(current - 1)); next.addEventListener('click', () => void navigate(current + 1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    ++session; drag = null; busy = false; clearLeaf(false); image.removeAttribute('src'); stage.classList.remove('is-dragging'); message();
    document.body.classList.remove('memoria-open'); lastTrigger?.focus({preventScroll:true}); lastTrigger = null;
  });
  window.addEventListener('keydown', event => {
    if (!dialog.open) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Home' || event.key === 'End') {
      event.preventDefault(); event.stopPropagation();
      if (!drag && !event.repeat) void navigate(event.key === 'Home' ? 1 : event.key === 'End' ? count : current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  }, true);
  stage.addEventListener('pointerdown', event => {
    if (busy || drag || !event.isPrimary || event.button !== 0) return;
    drag = { id:event.pointerId, x:event.clientX, y:event.clientY, dx:0, start:performance.now(), horizontal:false, target:0 };
    stage.setPointerCapture(event.pointerId); stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', event => {
    const g = drag; if (!g || g.id !== event.pointerId) return;
    g.dx = event.clientX - g.x; const dy = event.clientY - g.y;
    if (!g.horizontal) { if (Math.abs(g.dx) < 10 || Math.abs(g.dx) < Math.abs(dy) * 1.2) return; g.horizontal = true; }
    const target = current + (g.dx < 0 ? 1 : -1);
    if (!valid(target)) { g.target = 0; clearLeaf(true); return; }
    if (target !== g.target) {
      clearLeaf(true); g.target = target; const token = session;
      if (!reducedMotion.matches) void load(target).then(photo => {
        if (drag !== g || g.target !== target || session !== token || !dialog.open) return;
        begin(target, photo); paint(Math.min(.94, Math.abs(g.dx) / Math.max(1, stage.clientWidth) * 1.6));
      }).catch(() => {});
    }
    if (previewTarget === target) paint(Math.min(.94, Math.abs(g.dx) / Math.max(1, stage.clientWidth) * 1.6));
  });
  const endDrag = async (event: PointerEvent, cancelled = false) => {
    const g = drag; if (!g || g.id !== event.pointerId) return;
    drag = null; stage.classList.remove('is-dragging');
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    const distance = Math.abs(g.dx), velocity = distance / Math.max(1, performance.now() - g.start);
    if (!cancelled && g.horizontal && valid(g.target) && (distance >= Math.min(100, stage.clientWidth * .23) || (distance > 28 && velocity > .45))) {
      await navigate(g.target, true); return;
    }
    if (previewTarget) { const token = session; busy = true; sync(); await animate(0, 200, token); if (token === session) { clearLeaf(true); busy = false; sync(); } }
  };
  stage.addEventListener('pointerup', event => void endDrag(event));
  stage.addEventListener('pointercancel', event => void endDrag(event, true));
  stage.addEventListener('lostpointercapture', event => void endDrag(event, true));
})();
