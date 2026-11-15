/* The previous homepage is preserved in index-before-3d.html. */
(() => {
 const host=document.getElementById('map'),card=document.getElementById('heroText');if(!host||!card)return;
 host.classList.add('home-3d');document.getElementById('hero').hidden=true;card.hidden=true;card.classList.remove('on');
 const wrap=document.createElement('div');wrap.className='home-model';
 wrap.innerHTML='<model-viewer id="deskModel" tabindex="0" src="desk-scan.glb" alt="3D-скан рабочего места Артёма. Нажмите на модель, чтобы открыть проекты. Перетаскивайте для вращения." camera-controls disable-pan disable-tap camera-orbit="25deg 72deg auto" field-of-view="32deg" min-camera-orbit="auto 20deg 65%" max-camera-orbit="auto 105deg 200%" exposure="1" shadow-intensity="0" environment-image="neutral" interaction-prompt="none" loading="eager" reveal="auto"><span slot="progress-bar" class="model-loading">Загрузка 3D…</span></model-viewer><p class="model-hint">Вращайте мышью или пальцем · Нажмите, чтобы открыть проекты</p><p class="model-error" hidden>Не удалось загрузить 3D. <a href="#index">Открыть проекты</a></p>';
 host.prepend(wrap);const viewer=wrap.querySelector('model-viewer');
 const style=document.createElement('style');style.textContent=`
 #map.home-3d{touch-action:auto;background:#fff}
 .home-model{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(1100px,86vw);height:82svh;filter:invert(1);color:#ddd}
 .home-model model-viewer{display:block;width:100%;height:100%;background:transparent;--poster-color:transparent;touch-action:pan-y;outline:none}
 .model-loading{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:12px var(--sans);color:#888}
 .model-hint{position:absolute;bottom:0;left:0;right:0;text-align:center;color:#777;font:11px var(--sans);pointer-events:none}
 .model-error{position:absolute;left:0;right:0;top:48%;text-align:center;font-size:13px}.model-error a{text-decoration:underline}
 @media(max-width:700px){.home-model{width:100vw;height:70svh}.model-hint{bottom:8px;font-size:10px;padding:0 20px;line-height:1.6}}
 `;document.head.append(style);
 viewer.addEventListener('load',()=>{viewer.model.materials.forEach(m=>{m.pbrMetallicRoughness.setMetallicFactor(0);m.pbrMetallicRoughness.setRoughnessFactor(1);});wrap.querySelector('.model-loading').hidden=true;viewer.dataset.ready='true';});
 viewer.addEventListener('error',()=>{wrap.querySelector('.model-error').hidden=false;wrap.querySelector('.model-loading').hidden=true;});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let transitioning=false,press=null,animation=null;const pointers=new Set();
 function openProjects(){
  if(transitioning||document.body.dataset.v!=='map')return;
  transitioning=true;
  const go=()=>{if(document.body.dataset.v==='map')location.hash='index';else transitioning=false;};
  if(reduced.matches){go();return;}
  animation=wrap.animate([{opacity:1,scale:1},{opacity:0,scale:.97}],{duration:260,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
  animation.finished.then(go).catch(()=>{});
 }
 viewer.addEventListener('pointerdown',e=>{
  pointers.add(e.pointerId);
  if(pointers.size>1){press=null;return;}
  if(e.button!==0||viewer.dataset.ready!=='true')return;
  const hit=viewer.positionAndNormalFromPoint(e.clientX,e.clientY);
  press=hit?{id:e.pointerId,x:e.clientX,y:e.clientY,time:performance.now(),moved:false}:null;
 },true);
 viewer.addEventListener('pointermove',e=>{if(press?.id===e.pointerId&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>7)press.moved=true;},true);
 viewer.addEventListener('pointerup',e=>{
  pointers.delete(e.pointerId);const p=press;press=null;
  if(!p||p.id!==e.pointerId||p.moved||performance.now()-p.time>700||pointers.size)return;
  if(Math.hypot(e.clientX-p.x,e.clientY-p.y)<=7&&viewer.positionAndNormalFromPoint(e.clientX,e.clientY))openProjects();
 },true);
 viewer.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);press=null;},true);
 viewer.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&viewer.dataset.ready==='true'){e.preventDefault();openProjects();}});
 addEventListener('hashchange',()=>{
  const v=document.body.dataset.v;
  if(v==='index'&&transitioning&&!reduced.matches)document.getElementById('index').animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:340,easing:'cubic-bezier(.2,.7,.2,1)'});
  animation?.cancel();animation=null;transitioning=false;press=null;pointers.clear();
 });
 window.HERO={start(){}};
})();
