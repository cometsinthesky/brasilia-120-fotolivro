// Brasília 120 — leitor editorial, sem dependências em tempo de execução.
function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Elemento ausente: ${id}`);
  return node as T;
}
const book = el<HTMLDivElement>('book');
const reader = el<HTMLElement>('reader');
let pageImage = el<HTMLImageElement>('page');
const turn = el<HTMLDivElement>('turn');
const turnImg = el<HTMLImageElement>('turn-img');
const shade = el<HTMLDivElement>('turn-shade');
const prev = el<HTMLButtonElement>('prev');
const next = el<HTMLButtonElement>('next');
const range = el<HTMLInputElement>('progress');
const focusButton = el<HTMLButtonElement>('focus');
const indexDialog = el<HTMLDialogElement>('index-dialog');
const zoomDialog = el<HTMLDialogElement>('zoom-dialog');
const textDialog = el<HTMLDialogElement>('text-dialog');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const chapterButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-page]')];
const TOTAL = PAGES.length;
const pad = (n: number) => String(n).padStart(2, '0');
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const valid = (n: number) => n >= 1 && n <= TOTAL;
const asset = (n: number, size: 'small' | 'large') => `pages/${pad(n)}-${size}.png`;
const chapterName = (n: number) => n === 1 ? 'Capa' : n < 7 ? 'Abertura' : n < 19 ? 'I — Monumental' : n < 35 ? 'II — Flâneur' : n < 54 ? 'III — Sociopolítica' : n === TOTAL ? 'Contracapa' : 'Encerramento';
const pageAlt = (n: number) => `Página ${n} de ${TOTAL}: ${PAGES[n-1].title}`;
let current = 1;
let busy = false;
let preview: {target: number; direction: number; original: HTMLImageElement; progress: number} | null = null;
let gesture: {id: number; x: number; y: number; dx: number; start: number; horizontal: boolean; target: number | null} | null = null;
const cache = new Map<number, Promise<HTMLImageElement>>();

function loadPage(n: number): Promise<HTMLImageElement> {
  const cached = cache.get(n);
  if (cached) return cached;
  const img = new Image();
  img.id = 'page'; img.className = 'page-image'; img.alt = pageAlt(n);
  img.width = 2400; img.height = 2400; img.draggable = false;
  img.decoding = 'async';
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    img.onload = () => { img.decode().catch(() => {}).then(() => resolve(img)); };
    img.onerror = () => {cache.delete(n); reject(new Error(`Página ${n} indisponível`));};
    img.src = asset(n,'large');
  });
  cache.set(n, promise);
  return promise;
}
function prefetch() {
  // Somente páginas próximas; mantém o consumo de memória previsível.
  for (const n of cache.keys()) if (Math.abs(n-current)>1) cache.delete(n);
  for (const n of [current+1,current-1]) if(valid(n)) void loadPage(n).catch(()=>{});
}
function sync(announce = false) {
  el('current').textContent = pad(current);
  el('total').textContent = pad(TOTAL);
  el('chapter').textContent = chapterName(current);
  prev.disabled = busy || current === 1;
  next.disabled = busy || current === TOTAL;
  range.value = String(current); range.max = String(TOTAL);
  range.style.setProperty('--progress',`${(current-1)/(TOTAL-1)*100}%`);
  range.setAttribute('aria-valuetext',`Página ${current} de ${TOTAL}`);
  chapterButtons.forEach(b => b.setAttribute('aria-current',String(Number(b.dataset.page) === (current>=35&&current<54?35:current>=19&&current<35?19:current>=7&&current<19?7:0))));
  document.querySelectorAll<HTMLButtonElement>('.thumb').forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.number)===current)));
  el<HTMLButtonElement>('read-text').disabled = !PAGES[current-1].text.trim();
  if(announce) el('announce').textContent=pageAlt(current);
}
function replaceBase(img: HTMLImageElement) { if(img !== pageImage){pageImage.replaceWith(img);pageImage=img;} }
function renderTurn(p: number) {
  if(!preview) return;
  p=clamp(p,0,1); preview.progress=p;
  // A folha frontal gira em torno da lombada virtual, revelando a próxima.
  turn.style.transformOrigin = preview.direction>0 ? 'left center' : 'right center';
  turn.style.transform = `rotateY(${preview.direction * -p * 89.5}deg)`;
  turn.style.opacity = String(p>.85 ? (1-p)/.15 : 1);
  shade.style.background = preview.direction>0 ? 'linear-gradient(90deg,#0000 12%,#000d 100%)':'linear-gradient(270deg,#0000 12%,#000d 100%)';
  shade.style.opacity=String(p*.76);
}
function beginPreview(target: number, img: HTMLImageElement) {
  if(preview) return;
  const original = pageImage;
  turnImg.src = original.currentSrc || original.src;
  preview={target,direction:Math.sign(target-current),original,progress:0};
  renderTurn(0);turn.hidden=false;replaceBase(img);
}
function closePreview(commit: boolean) {
  if(!preview) return;
  if(commit) current=preview.target;
  else replaceBase(preview.original);
  turn.hidden=true;turnImg.removeAttribute('src');preview=null;
}
function animateTo(end: number, duration: number): Promise<void> {
  if(!preview || reduced.matches || duration<=0){renderTurn(end);return Promise.resolve();}
  const from = preview.progress;
  return new Promise(resolve=>{
    const start=performance.now();
    const tick=(now:number)=>{
      const t=clamp((now-start)/duration,0,1);
      const eased=1-Math.pow(1-t,3);
      renderTurn(from+(end-from)*eased);
      if(t<1) requestAnimationFrame(tick);else resolve();
    };
    requestAnimationFrame(tick);
  });
}
async function go(target: number, animated = true) {
  target=clamp(Math.round(target),1,TOTAL);
  if(busy || gesture || target===current){sync();return;}
  busy=true;sync();el('error').hidden=true;
  const timer=window.setTimeout(()=>{el('loading').hidden=false;},180);
  try {
    if(preview && preview.target!==target)closePreview(false);
    if(!preview){const img=await loadPage(target);beginPreview(target,img);}
    await animateTo(1,animated?Math.max(160,460*(1-(preview?.progress??0))):0);
    closePreview(true);
  } catch {closePreview(false);el('error').hidden=false;}
  finally {clearTimeout(timer);el('loading').hidden=true;busy=false;sync(true);prefetch();}
}
async function revert() {
  if(!preview) return;
  busy=true;sync();await animateTo(0,190);closePreview(false);busy=false;sync();
}
function showReader(){if(document.body.classList.contains('immersive'))return;reader.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});reader.focus({preventScroll:true});}
prev.addEventListener('click',()=>void go(current-1));next.addEventListener('click',()=>void go(current+1));
el('start').addEventListener('click',showReader);
chapterButtons.forEach(b=>b.addEventListener('click',()=>{showReader();void go(Number(b.dataset.page));}));
range.addEventListener('input',()=>{range.setAttribute('aria-valuetext',`Ir à página ${range.value}`);range.style.setProperty('--progress',`${(Number(range.value)-1)/(TOTAL-1)*100}%`);});
range.addEventListener('change',()=>void go(Number(range.value)));

// Pointer Events unifica mouse, caneta e toque. Movimentos verticais continuam rolando a página.
book.addEventListener('pointerdown',e=>{
  if(busy||gesture||!e.isPrimary||e.button!==0)return;
  gesture={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,start:performance.now(),horizontal:false,target:null};
  book.setPointerCapture(e.pointerId);
});
book.addEventListener('pointermove',e=>{
  const g=gesture;if(!g||g.id!==e.pointerId)return;
  const dx=e.clientX-g.x,dy=e.clientY-g.y;g.dx=dx;
  if(!g.horizontal){
    if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){gesture=null;return;}
    if(Math.abs(dx)<12||Math.abs(dx)<Math.abs(dy)*1.2)return;
    g.horizontal=true;g.target=current+(dx<0?1:-1);
    book.classList.add('dragging');
    if(valid(g.target)){
      const target=g.target;
      void loadPage(target).then(img=>{
        if(gesture!==g||busy)return;
        beginPreview(target,img);renderTurn(Math.min(.85,Math.max(0,-g.dx*Math.sign(target-current)/book.clientWidth)*1.65));
      }).catch(()=>{});
    }
  }
  if(g.horizontal&&preview){renderTurn(Math.min(.85,Math.max(0,-dx*preview.direction/book.clientWidth)*1.65));}
});
function endGesture(e: PointerEvent, cancelled=false){
  const g=gesture;if(!g||g.id!==e.pointerId)return;
  gesture=null;book.classList.remove('dragging');
  if(book.hasPointerCapture(e.pointerId))book.releasePointerCapture(e.pointerId);
  const width=book.clientWidth;
  const distance=-(g.dx)*Math.sign((g.target??current)-current);
  const speed=distance/Math.max(1,performance.now()-g.start);
  const threshold=Math.min(90,Math.max(42,width*.17));
  if(!cancelled&&g.horizontal&&g.target!==null&&valid(g.target)&&(distance>=threshold||(distance>25&&speed>.45)))void go(g.target);
  else void revert();
}
book.addEventListener('pointerup',e=>endGesture(e));book.addEventListener('pointercancel',e=>endGesture(e,true));book.addEventListener('lostpointercapture',e=>endGesture(e,true));
book.addEventListener('dragstart',e=>e.preventDefault());

// Fullscreen nativo quando disponível; fallback de viewport para iOS e ambientes restritos.
type WebKitElement = HTMLElement & { webkitRequestFullscreen?: () => void | Promise<void> };
type WebKitDocument = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => void | Promise<void> };
const fsDoc = document as WebKitDocument;
const fsReader = reader as WebKitElement;
const fullscreenElement = () => document.fullscreenElement || fsDoc.webkitFullscreenElement || null;
let nativeSession = false;
let fullscreenPending = false;
let immersive = false;
let savedScroll = 0;
const outsideReader = document.querySelectorAll<HTMLElement>('.masthead,.intro,.footer,.skip');
function setImmersive(active: boolean) {
  if (active === immersive) return;
  immersive = active;
  if(active) savedScroll = window.scrollY;
  document.body.classList.toggle('immersive',active);
  outsideReader.forEach(node => { node.inert = active; });
  focusButton.setAttribute('aria-pressed',String(active));
  focusButton.setAttribute('aria-label',active?'Sair da tela cheia':'Tela cheia / modo imersivo');
  focusButton.title=active?'Sair da tela cheia':'Tela cheia / modo imersivo';
  document.getElementById('focus-icon')!.setAttribute('d',active?'M3 8h5V3m13 5h-5V3M8 21v-5H3m13 5v-5h5':'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5');
  if(!active) window.scrollTo({top:savedScroll,behavior:'instant'});
  focusButton.focus({preventScroll:true});
  requestAnimationFrame(fitBook);
}
async function toggleFullscreen() {
  if(fullscreenPending)return;
  fullscreenPending=true;
  try {
    if(immersive){
      if(fullscreenElement()===reader){
        try { if(document.exitFullscreen) await document.exitFullscreen(); else await fsDoc.webkitExitFullscreen?.(); }
        catch { if(fullscreenElement()===reader)return; }
      }
      nativeSession=false;setImmersive(false);return;
    }
    // Aciona a API dentro do gesto do usuário. Se rejeitada, preserva o modo imersivo CSS.
    setImmersive(true);
    try {
      if(reader.requestFullscreen && document.fullscreenEnabled) await reader.requestFullscreen();
      else if(fsReader.webkitRequestFullscreen) await fsReader.webkitRequestFullscreen();
      nativeSession=fullscreenElement()===reader;
    } catch { nativeSession=false; }
  } finally { fullscreenPending=false; }
}
function onFullscreenChange(){
  if(fullscreenElement()===reader){nativeSession=true;setImmersive(true);}
  else if(nativeSession){nativeSession=false;setImmersive(false);}
}
document.addEventListener('fullscreenchange',onFullscreenChange);
document.addEventListener('webkitfullscreenchange',onFullscreenChange);
focusButton.addEventListener('click',()=>void toggleFullscreen());
// Dimensiona o quadrado pela área livre real após capítulos e controles, inclusive em rotação.
const frame = reader.querySelector<HTMLElement>('.book-frame')!;
function fitBook(){
  if(!immersive)return;
  const rect=frame.getBoundingClientRect();
  frame.style.setProperty('--book-size',`${Math.max(1,Math.floor(Math.min(rect.width,rect.height)))}px`);
}
if('ResizeObserver' in window) new ResizeObserver(fitBook).observe(frame);
window.addEventListener('resize',fitBook);
window.visualViewport?.addEventListener('resize',fitBook);
// Índice é criado sob demanda; miniaturas carregam conforme a área visível.
function buildIndex(){
  const grid=el('thumbs');if(grid.childElementCount)return;
  const frag=document.createDocumentFragment();
  for(const p of PAGES){
    const button=document.createElement('button');button.type='button';button.className='thumb';button.dataset.number=String(p.number);button.setAttribute('aria-label',pageAlt(p.number));
    const img=new Image();img.loading='lazy';img.decoding='async';img.src=asset(p.number,'small');img.alt='';img.width=320;img.height=320;
    const number=document.createElement('span');number.textContent=pad(p.number);
    const title=document.createElement('small');title.textContent=p.title;
    button.append(img,number,title);button.addEventListener('click',()=>{indexDialog.close();void go(p.number);});frag.append(button);
  }grid.append(frag);
}
el('index').addEventListener('click',()=>{if(busy||gesture)return;buildIndex();sync();indexDialog.showModal();const active=indexDialog.querySelector<HTMLButtonElement>('[aria-current=true]');active?.focus();active?.scrollIntoView({block:'nearest'});});
el('zoom').addEventListener('click',()=>{
  if(busy||gesture)return;
  const img=el<HTMLImageElement>('zoom-image');img.src=asset(current,'large');img.alt=pageAlt(current);
  el('zoom-title').textContent=`Página ${pad(current)} — ampliada`;zoomDialog.showModal();
  zoomDialog.querySelector('.zoom-scroll')?.scrollTo(0,0);
});
el('read-text').addEventListener('click',()=>{el('text-title').textContent=`Texto — página ${pad(current)}`;el('transcript').textContent=PAGES[current-1].text;textDialog.showModal();});
for(const dialog of [indexDialog,zoomDialog,textDialog]){
  dialog.querySelector('.close')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
}
window.addEventListener('keydown',e=>{
  if(document.querySelector('dialog[open]'))return;
  if(e.key==='Escape'&&document.body.classList.contains('immersive')){e.preventDefault();void toggleFullscreen();return;}
  if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.repeat||e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)return;
  const targets:Record<string,number>={ArrowLeft:current-1,ArrowRight:current+1,Home:1,End:TOTAL};
  if(e.key in targets){
    if((e.key==='Home'||e.key==='End')&&!reader.contains(document.activeElement))return;
    e.preventDefault();void go(targets[e.key]);
  }
});
pageImage.addEventListener('error',()=>{el('error').hidden=false;});
sync();prefetch();
