/* The previous homepage is preserved in index-before-3d.html. */
(() => {
 const host=document.getElementById('map'),card=document.getElementById('heroText');if(!host||!card)return;
 host.classList.add('home-3d');document.getElementById('hero').hidden=true;card.hidden=true;card.classList.remove('on');
 const wrap=document.createElement('div');wrap.className='home-model';
 wrap.innerHTML='<model-viewer id="deskModel" tabindex="0" src="desk-scan.glb" alt="3D-скан рабочего места Артёма. Нажмите на модель, чтобы открыть проекты. Перетаскивайте для вращения." camera-controls rotation-per-second="4deg" auto-rotate-delay="1500" disable-pan disable-tap camera-orbit="25deg 72deg auto" field-of-view="32deg" min-camera-orbit="auto 20deg 65%" max-camera-orbit="auto 105deg 200%" exposure="1" shadow-intensity="0" environment-image="neutral" interaction-prompt="none" loading="eager" reveal="auto"><span slot="progress-bar" class="model-loading">Загрузка 3D…</span></model-viewer><p class="model-error" hidden>Не удалось загрузить 3D. <a href="#index">Открыть проекты</a></p>';
 host.prepend(wrap);const viewer=wrap.querySelector('model-viewer');
 const style=document.createElement('style');style.textContent=`
 #map.home-3d{touch-action:auto;background:#fff}
 .home-model{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(1100px,86vw);height:82svh;filter:invert(1);color:#ddd}
 .home-model model-viewer{display:block;width:100%;height:100%;background:transparent;--poster-color:transparent;touch-action:pan-y;outline:none}
 .home-model model-viewer:not([data-surface-ready]){visibility:hidden}
 .model-loading{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:12px var(--sans);color:#888}
 .model-error{position:absolute;left:0;right:0;top:48%;text-align:center;font-size:13px}.model-error a{text-decoration:underline}
 @media(max-width:700px){.home-model{width:100vw;height:70svh}}
 `;document.head.append(style);
 viewer.addEventListener('load',()=>{viewer.model.materials.forEach(m=>{m.pbrMetallicRoughness.setMetallicFactor(0);m.pbrMetallicRoughness.setRoughnessFactor(1);});wrap.querySelector('.model-loading').hidden=true;startPaperUnfold();});
 viewer.addEventListener('error',()=>{viewer.dataset.surfaceReady='true';wrap.querySelector('.model-error').hidden=false;wrap.querySelector('.model-loading').hidden=true;});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let transitioning=false,press=null,animation=null,unfolding=false,finishUnfold=null;const pointers=new Set();
 // A thin sheet with precomputed, length-constrained crumpling. Playback opens
 // successive folds instead of radially shrinking the scanned room geometry.
 async function startPaperUnfold(){
  if(viewer.dataset.surfaceReady)return;
  const scene=viewer[Object.getOwnPropertySymbols(viewer).find(key=>key.description==='scene')];
  let paper=null,geometry=null,material=null,texture=null,bitmap=null,raf=0,finished=false;
  const model=scene?.model;
  const restore=()=>{
   if(finished)return;finished=true;cancelAnimationFrame(raf);
   if(paper)scene.remove(paper);geometry?.dispose();material?.dispose();texture?.dispose();bitmap?.close();
   if(model)model.visible=true;
   scene?.queueRender?.();unfolding=false;finishUnfold=null;
   viewer.dataset.surfaceReady='true';viewer.dataset.ready='true';viewer.dataset.unfold='complete';
   viewer.setAttribute('camera-controls','');syncRotation();
  };
  if(reduced.matches||!model||typeof scene.queueRender!=='function'){restore();return;}
  unfolding=true;finishUnfold=restore;syncRotation();viewer.removeAttribute('camera-controls');
  try{
   const response=await fetch('paper-unfold.json?v=2');
   if(!response.ok)throw new Error('Paper geometry unavailable');
   const data=await response.json();if(finished)return;
   await new Promise(resolve=>{
    const wait=()=>{if(finished||(!document.hidden&&document.body.dataset.v==='map'))resolve();else requestAnimationFrame(wait);};wait();
   });
   if(finished)return;
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   bitmap=await createImageBitmap(await viewer.toBlob({idealAspect:false}));
   if(finished){bitmap.close();return;}
   let source;model.traverse(object=>{if(!source&&object.isMesh&&object.material?.map)source=object;});
   if(!source){bitmap.close();restore();return;}
   const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;
   const ctx=canvas.getContext('2d');
   // The original render is the print on the paper, including the final camera framing.
   const paint=(backing=1)=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.globalAlpha=backing;
    ctx.drawImage(bitmap,bitmap.width*.37,bitmap.height*.28,bitmap.width*.27,bitmap.height*.4,0,0,canvas.width,canvas.height);
    ctx.globalAlpha=1;ctx.drawImage(bitmap,0,0);
    if(texture)texture.needsUpdate=true;
   };
   paint();texture=new source.material.map.constructor(canvas);texture.colorSpace='srgb';texture.flipY=true;texture.needsUpdate=true;
   material=source.material.clone();material.map=texture;material.normalMap=null;material.roughnessMap=null;material.metalnessMap=null;
   material.side=2;material.roughness=1;material.metalness=0;material.flatShading=true;material.transparent=true;
   material.color.setRGB(1,1,1);material.emissive.setRGB(.1,.1,.1);material.emissiveMap=texture;
   geometry=new source.geometry.constructor();
   const Attribute=source.geometry.attributes.position.constructor;
   const decode=value=>{const binary=atob(value),bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));const view=new DataView(bytes.buffer);return Float32Array.from({length:bytes.length/2},(_,i)=>view.getInt16(i*2,true)/12000);};
   const frames=data.frames.map(decode),uv=decode(data.uv),indices=data.triangles;
   const positions=new Float32Array(indices.length*3),uvs=new Float32Array(indices.length*2);
   indices.forEach((index,i)=>{uvs[i*2]=uv[index*2];uvs[i*2+1]=uv[index*2+1];});
   geometry.setAttribute('position',new Attribute(positions,3));geometry.setAttribute('uv',new Attribute(uvs,2));
   paper=new source.constructor(geometry,material);paper.frustumCulled=false;scene.add(paper);
   const camera=scene.camera;camera.updateWorldMatrix(true,false);
   const distance=viewer.getCameraOrbit().radius;
   function align(progress){
    camera.updateWorldMatrix(true,false);
    paper.quaternion.copy(camera.getWorldQuaternion(paper.quaternion));
    paper.position.set(0,0,-distance).applyMatrix4(camera.matrixWorld);
    const halfHeight=distance*Math.tan(camera.fov*Math.PI/360);
    paper.scale.set(halfHeight*(1+(camera.aspect-1)*progress),halfHeight,halfHeight);
   }
   function pose(progress){
    const index=Math.min(frames.length-1,progress*(frames.length-1)),lo=Math.floor(index),hi=Math.min(frames.length-1,lo+1),mix=index-lo;
    const a=frames[lo],b=frames[hi];
    const turn=Math.pow(1-progress,1.4),rx=1.65*turn,ry=.7*turn,rz=-.28*turn;
    indices.forEach((vertex,i)=>{
     const k=vertex*3;let x=a[k]+(b[k]-a[k])*mix,y=a[k+1]+(b[k+1]-a[k+1])*mix,z=a[k+2]+(b[k+2]-a[k+2])*mix;
     const y1=y*Math.cos(rx)-z*Math.sin(rx),z1=y*Math.sin(rx)+z*Math.cos(rx);
     const x1=x*Math.cos(ry)+z1*Math.sin(ry);z=-x*Math.sin(ry)+z1*Math.cos(ry);
     positions[i*3]=x1*Math.cos(rz)-y1*Math.sin(rz);positions[i*3+1]=x1*Math.sin(rz)+y1*Math.cos(rz);positions[i*3+2]=z;
    });
    geometry.attributes.position.needsUpdate=true;geometry.computeVertexNormals();align(progress);
    // Remove the printed border only once the sheet has almost opened.
    const blend=Math.max(0,(progress-.84)/.16);paint(1-blend);
    material.color.setScalar(1-blend);material.emissiveIntensity=1+blend*9;
    const reveal=Math.max(0,(progress-.94)/.06);
    model.visible=reveal>0;material.opacity=1-reveal;
    material.depthTest=reveal===0;paper.renderOrder=reveal>0?100:0;
    scene.queueRender();
   }
   model.visible=false;pose(0);viewer.dataset.surfaceReady='true';viewer.dataset.unfold='playing';
   let elapsed=0,last=0,frame=-1;
   function tick(now){
    if(finished)return;
    if(reduced.matches){restore();return;}
    if(document.hidden||document.body.dataset.v!=='map'){last=0;raf=requestAnimationFrame(tick);return;}
    if(last)elapsed+=Math.min(now-last,100);last=now;
    const next=Math.floor(Math.max(0,elapsed-550)/110);
    if(next!==frame){frame=next;pose(Math.min(1,next/32));}
    if(elapsed>4200){restore();return;}
    raf=requestAnimationFrame(tick);
   }
   raf=requestAnimationFrame(tick);
  }catch(error){console.warn('Paper intro unavailable; showing original scan.',error);restore();}
 }
 function syncRotation(){
  if(reduced.matches&&unfolding)finishUnfold?.();
  viewer.toggleAttribute('auto-rotate',!reduced.matches&&!document.hidden&&document.body.dataset.v==='map'&&!transitioning&&!unfolding);
 }
 reduced.addEventListener('change',syncRotation);
 document.addEventListener('visibilitychange',syncRotation);
 syncRotation();
 function openProjects(){
  if(transitioning||unfolding||document.body.dataset.v!=='map')return;
  transitioning=true;syncRotation();
  const go=()=>{if(document.body.dataset.v==='map')location.hash='index';else transitioning=false;};
  if(reduced.matches){go();return;}
  animation=wrap.animate([
    {opacity:1,transform:'translate(-50%,-50%) perspective(1200px) rotateY(0deg) scale(1)',filter:'invert(1) blur(0px)'},
    {opacity:1,transform:'translate(-50%,-50%) perspective(1200px) rotateY(-10deg) rotateX(3deg) scale(1.12)',filter:'invert(1) blur(0px)',offset:.38},
    {opacity:0,transform:'translate(-50%,-46%) perspective(1200px) rotateY(16deg) rotateX(-5deg) scale(1.6)',filter:'invert(1) blur(12px)'}
  ],{duration:620,easing:'cubic-bezier(.55,0,.25,1)',fill:'forwards'});
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
  if(v==='index'&&transitioning&&!reduced.matches)document.getElementById('index').animate([{opacity:0,transform:'translateY(32px) scale(.96)',filter:'blur(6px)'},{opacity:1,transform:'none',filter:'blur(0)'}],{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});
  animation?.cancel();animation=null;transitioning=false;press=null;pointers.clear();syncRotation();
 });
 window.HERO={start:syncRotation};
})();

