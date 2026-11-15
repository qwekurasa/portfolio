/* The previous homepage is preserved in index-before-3d.html. */
(() => {
 const host=document.getElementById('map'),card=document.getElementById('heroText');if(!host||!card)return;
 host.classList.add('home-3d');document.getElementById('hero').hidden=true;
 const wrap=document.createElement('div');wrap.className='home-model';
 wrap.innerHTML='<model-viewer id="deskModel" src="desk-scan.glb" alt="3D-скан рабочего места Артёма. Перетаскивайте для вращения." camera-controls disable-pan disable-tap camera-orbit="25deg 72deg auto" field-of-view="32deg" min-camera-orbit="auto 20deg 65%" max-camera-orbit="auto 105deg 200%" exposure="1" shadow-intensity="0" environment-image="neutral" interaction-prompt="none" loading="eager" reveal="auto"><span slot="progress-bar" class="model-loading">Загрузка 3D…</span></model-viewer><p class="model-hint">Вращайте мышью или пальцем</p><button class="model-reset" type="button" aria-label="Вернуть исходный ракурс">↺</button><p class="model-error" hidden>Не удалось загрузить 3D. <a href="index-before-3d.html">Открыть прежнюю версию</a></p>';
 host.prepend(wrap);const viewer=wrap.querySelector('model-viewer');
 const style=document.createElement('style');style.textContent=`
 #map.home-3d{touch-action:auto;background:#fff}
 .home-model{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);width:min(1100px,86vw);height:82svh;filter:invert(1);color:#ddd}
 .home-model model-viewer{display:block;width:100%;height:100%;background:transparent;--poster-color:transparent;touch-action:pan-y;outline:none}
 .model-loading{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:12px var(--sans);color:#888}
 .model-hint{position:absolute;bottom:0;left:0;right:0;text-align:center;color:#777;font:11px var(--sans);pointer-events:none}
 .model-reset{position:absolute;right:18px;bottom:10px;display:grid;place-items:center;width:32px;height:32px;border-radius:50%;border:1px solid #ffffff22;color:#aaa;background:#151517;font-size:20px}
 #map.home-3d .hero-text{left:24px;bottom:24px;top:auto;width:320px;max-width:calc(100vw - 48px);font-size:13px;z-index:10}
 .model-error{position:absolute;left:0;right:0;top:48%;text-align:center;font-size:13px}.model-error a{text-decoration:underline}
 @media(max-width:700px){.home-model{top:33%;width:100vw;height:58svh}.model-hint{bottom:8px;font-size:10px}.model-reset{right:15px;bottom:4px}#map.home-3d .hero-text{left:16px;right:16px;bottom:max(16px,env(safe-area-inset-bottom));width:auto;max-width:none;font-size:12px}.home-model model-viewer{--min-hotspot-opacity:0}}
 `;document.head.append(style);
 function reset(){viewer.cameraOrbit='25deg 72deg auto';viewer.fieldOfView='32deg';viewer.cameraTarget='auto auto auto';}
 wrap.querySelector('.model-reset').onclick=reset;
 viewer.addEventListener('load',()=>{viewer.model.materials.forEach(m=>{m.pbrMetallicRoughness.setMetallicFactor(0);m.pbrMetallicRoughness.setRoughnessFactor(1);});wrap.querySelector('.model-loading').hidden=true;wrap.classList.add('loaded');card.classList.add('on');viewer.dataset.ready='true';});
 viewer.addEventListener('error',()=>{wrap.querySelector('.model-error').hidden=false;wrap.querySelector('.model-loading').hidden=true;card.classList.add('on');});
 window.HERO={start(){card.classList.add('on');}};
 card.classList.add('on');
})();
