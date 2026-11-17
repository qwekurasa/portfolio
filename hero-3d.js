/* The previous homepage is preserved in index-before-3d.html. */
(() => {
 const host=document.getElementById('map'),card=document.getElementById('heroText');if(!host||!card)return;
 host.classList.add('home-3d');document.getElementById('hero').hidden=true;card.hidden=true;card.classList.remove('on');
 const wrap=document.createElement('div');wrap.className='home-model';
 wrap.innerHTML='<model-viewer id="deskModel" tabindex="0" src="desk-scan.glb" alt="3D-скан рабочего места Артёма. Нажмите на модель, чтобы открыть проекты. Перетаскивайте для вращения." camera-controls rotation-per-second="4deg" auto-rotate-delay="1500" disable-pan disable-tap camera-orbit="25deg 72deg auto" field-of-view="32deg" min-camera-orbit="auto 20deg 65%" max-camera-orbit="auto 105deg 200%" exposure="1" shadow-intensity="0" environment-image="neutral" interaction-prompt="none" loading="eager" reveal="auto"><span slot="progress-bar" class="model-loading">Загрузка 3D…</span></model-viewer><p class="model-error" hidden>Не удалось загрузить 3D. <a href="#index">Открыть проекты</a></p>';
 host.prepend(wrap);const viewer=wrap.querySelector('model-viewer');
 const doll=document.createElement('model-viewer');doll.id='artemDoll';
 doll.setAttribute('src','artem-doll.glb');doll.setAttribute('alt','Фигурка Артёма в коричневой рубашке');
 for(const [key,value] of Object.entries({'camera-controls':'','disable-pan':'','disable-tap':'','camera-orbit':'0deg 90deg auto','field-of-view':'30deg','interaction-prompt':'none','environment-image':'neutral','exposure':'1','shadow-intensity':'0','loading':'eager'}))doll.setAttribute(key,value);
 wrap.append(doll);
 doll.addEventListener('load',()=>{doll.model.materials.forEach(m=>{m.pbrMetallicRoughness.setMetallicFactor(0);m.pbrMetallicRoughness.setRoughnessFactor(.85);});doll.exposure=1.3;doll.dataset.surfaceReady='true';});
 const style=document.createElement('style');style.textContent=`
 #map.home-3d{touch-action:auto;background:#fff}
 .home-model{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(1100px,86vw);height:82svh;filter:invert(1);color:#ddd}
 .home-model model-viewer{display:block;width:100%;height:100%;background:transparent;--poster-color:transparent;touch-action:pan-y;outline:none}
 .home-model model-viewer:not([data-surface-ready]){visibility:hidden}
 .home-model #deskModel{position:absolute;left:22%;width:78%;height:100%}
 .home-model #artemDoll{position:absolute;left:0;top:23%;width:27%;height:58%}
 .model-loading{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:12px var(--sans);color:#888}
 .model-error{position:absolute;left:0;right:0;top:48%;text-align:center;font-size:13px}.model-error a{text-decoration:underline}
 @media(max-width:700px){.home-model{width:100vw;height:70svh}}
 `;document.head.append(style);
 viewer.addEventListener('load',()=>{viewer.model.materials.forEach(m=>{m.pbrMetallicRoughness.setMetallicFactor(0);m.pbrMetallicRoughness.setRoughnessFactor(1);});wrap.querySelector('.model-loading').hidden=true;startPaperUnfold();});
 viewer.addEventListener('error',()=>{viewer.dataset.surfaceReady='true';wrap.querySelector('.model-error').hidden=false;wrap.querySelector('.model-loading').hidden=true;});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let transitioning=false,press=null,animation=null,unfolding=false,finishUnfold=null;const pointers=new Set();
 // A single textured mesh unfolds along the paper simulation and finishes at
 // its exact original vertices. No screenshot, second surface, or crossfade.
 async function startPaperUnfold(){
  if(viewer.dataset.surfaceReady)return;
  const scene=viewer[Object.getOwnPropertySymbols(viewer).find(key=>key.description==='scene')];
  const model=scene?.model,parts=[];let raf=0,finished=false;
  const restore=()=>{
   if(finished)return;finished=true;cancelAnimationFrame(raf);
   for(const part of parts){part.mesh.geometry=part.original;part.geometry.dispose();}
   scene?.queueRender?.();unfolding=false;finishUnfold=null;
   viewer.dataset.surfaceReady='true';viewer.dataset.ready='true';viewer.dataset.unfold='complete';
   viewer.setAttribute('camera-controls','');syncRotation();
  };
  if(reduced.matches||!model||typeof scene.queueRender!=='function'){restore();return;}
  unfolding=true;finishUnfold=restore;syncRotation();viewer.removeAttribute('camera-controls');
  try{
   const response=await fetch('paper-unfold.json?v=2');if(!response.ok)throw new Error('Paper geometry unavailable');
   const data=await response.json();if(finished)return;
   await new Promise(resolve=>{const wait=()=>{if(finished||(!document.hidden&&document.body.dataset.v==='map'))resolve();else requestAnimationFrame(wait);};wait();});
   if(finished)return;
   const decode=value=>{const bytes=Uint8Array.from(atob(value),c=>c.charCodeAt(0)),view=new DataView(bytes.buffer);return Float32Array.from({length:bytes.length/2},(_,i)=>view.getInt16(i*2,true)/12000);};
   const frames=data.frames.map(decode),uv=decode(data.uv),tri=data.triangles;
   const camera=scene.camera;model.updateWorldMatrix(true,true);camera.updateWorldMatrix(true,false);
   const distance=viewer.getCameraOrbit().radius,halfHeight=distance*Math.tan(camera.fov*Math.PI/360);
   let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
   model.traverse(mesh=>{
    if(!mesh.isMesh||!mesh.geometry?.attributes.position||mesh.isSkinnedMesh)return;
    const original=mesh.geometry,geometry=original.clone(),position=original.attributes.position;
    const source=new Float32Array(position.count*3),screen=new Float32Array(position.count*2),point=model.position.clone();
    for(let i=0;i<position.count;i++){
     source.set([position.getX(i),position.getY(i),position.getZ(i)],i*3);
     point.fromBufferAttribute(position,i).applyMatrix4(mesh.matrixWorld).project(camera);
     screen.set([point.x,point.y],i*2);minX=Math.min(minX,point.x);maxX=Math.max(maxX,point.x);minY=Math.min(minY,point.y);maxY=Math.max(maxY,point.y);
    }
    parts.push({mesh,original,geometry,source,screen,inverse:mesh.matrixWorld.clone().invert(),point,mapping:[]});
   });
   if(!parts.length){restore();return;}
   const buckets=Array.from({length:1024},()=>[]),cell=v=>Math.max(0,Math.min(31,Math.floor(v*32)));
   for(let k=0;k<tri.length;k+=3){
    const a=tri[k]*2,b=tri[k+1]*2,c=tri[k+2]*2;
    for(let y=cell(Math.min(uv[a+1],uv[b+1],uv[c+1]));y<=cell(Math.max(uv[a+1],uv[b+1],uv[c+1]));y++)
     for(let x=cell(Math.min(uv[a],uv[b],uv[c]));x<=cell(Math.max(uv[a],uv[b],uv[c]));x++)buckets[y*32+x].push(k);
   }
   for(const part of parts){
    for(let i=0;i<part.screen.length/2;i++){
     const u=Math.max(.00001,Math.min(.99999,(part.screen[i*2]-minX)/(maxX-minX))),v=Math.max(.00001,Math.min(.99999,(part.screen[i*2+1]-minY)/(maxY-minY)));
     let mapping;
     for(const k of buckets[cell(v)*32+cell(u)]){
      const a=tri[k],b=tri[k+1],c=tri[k+2],ax=uv[a*2],ay=uv[a*2+1],bx=uv[b*2],by=uv[b*2+1],cx=uv[c*2],cy=uv[c*2+1];
      const d=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy),wa=((by-cy)*(u-cx)+(cx-bx)*(v-cy))/d,wb=((cy-ay)*(u-cx)+(ax-cx)*(v-cy))/d,wc=1-wa-wb;
      if(Math.min(wa,wb,wc)>=-.0001){mapping=[a,b,c,wa,wb,wc];break;}
     }
     if(!mapping)throw new Error('Paper mapping incomplete');part.mapping.push(mapping);
    }
    part.mesh.geometry=part.geometry;
   }
   const width=halfHeight*camera.aspect*(maxX-minX)/2,height=halfHeight*(maxY-minY)/2;
   const centerX=halfHeight*camera.aspect*(minX+maxX)/2,centerY=halfHeight*(minY+maxY)/2;
   function pose(time){
    const paperProgress=time*.62,index=paperProgress*(frames.length-1),lo=Math.floor(index),hi=Math.min(frames.length-1,lo+1),mix=index-lo;
    const a=frames[lo],b=frames[hi],t=Math.max(0,Math.min(1,(time-.16)/.84)),blend=t*t*t*(t*(t*6-15)+10);
    const turn=Math.pow(1-time,1.4),rx=1.65*turn,ry=.7*turn,rz=-.28*turn;
    for(const part of parts){
     const positions=part.geometry.attributes.position;
     for(let i=0;i<positions.count;i++){
      const m=part.mapping[i],q=[0,0,0];
      for(let axis=0;axis<3;axis++)for(let j=0;j<3;j++){const k=m[j]*3+axis;q[axis]+=(a[k]+(b[k]-a[k])*mix)*m[j+3];}
      const y=q[1]*Math.cos(rx)-q[2]*Math.sin(rx),z=q[1]*Math.sin(rx)+q[2]*Math.cos(rx),x=q[0]*Math.cos(ry)+z*Math.sin(ry);
      const depth=-q[0]*Math.sin(ry)+z*Math.cos(ry);
      part.point.set(centerX+(x*Math.cos(rz)-y*Math.sin(rz))*width,centerY+(x*Math.sin(rz)+y*Math.cos(rz))*height,-distance+depth*Math.min(width,height)).applyMatrix4(camera.matrixWorld).applyMatrix4(part.inverse);
      positions.setXYZ(i,part.point.x+(part.source[i*3]-part.point.x)*blend,part.point.y+(part.source[i*3+1]-part.point.y)*blend,part.point.z+(part.source[i*3+2]-part.point.z)*blend);
     }
     positions.needsUpdate=true;part.geometry.computeVertexNormals();part.geometry.computeBoundingSphere();
    }
    scene.queueRender();
   }
   pose(0);viewer.dataset.surfaceReady='true';viewer.dataset.unfold='playing';
   let elapsed=0,last=0,frame=-1;
   function tick(now){
    if(finished)return;if(reduced.matches){restore();return;}
    if(document.hidden||document.body.dataset.v!=='map'){last=0;raf=requestAnimationFrame(tick);return;}
    if(last)elapsed+=Math.min(now-last,100);last=now;
    const next=Math.floor(Math.max(0,elapsed-180)/70);
    if(next!==frame){frame=next;pose(Math.min(1,next/24));}
    if(elapsed>=1900){restore();return;}raf=requestAnimationFrame(tick);
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
