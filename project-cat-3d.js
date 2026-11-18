/* Textured GLB mascot. Each project owns and disposes its animation. */
(()=>{let cleanup=()=>{};window.ProjectCat={mount(host){
 cleanup();const stage=host.querySelector('.st');if(!stage)return;
 const lane=document.createElement('div');lane.className='clay-cat-lane';lane.setAttribute('aria-hidden','true');lane.style.cssText='position:absolute;bottom:0;left:0;right:0;height:150px;overflow:hidden;pointer-events:none;filter:invert(1);z-index:4';stage.style.position='relative';stage.append(lane);
 const viewer=document.createElement('model-viewer');viewer.setAttribute('src','clay-cat.glb');viewer.setAttribute('camera-orbit','-52deg 80deg auto');viewer.setAttribute('field-of-view','32deg');viewer.setAttribute('interaction-prompt','none');viewer.setAttribute('environment-image','neutral');viewer.setAttribute('exposure','1.6');viewer.setAttribute('shadow-intensity','.5');viewer.setAttribute('loading','eager');viewer.style.cssText='position:absolute;bottom:0;width:190px;height:150px;background:transparent;visibility:hidden;--poster-color:transparent';lane.append(viewer);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let disposed=false,raf=0,last=0,time=0,visible=false,parts=[],scene=null;
 const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
 viewer.addEventListener('load',()=>{if(disposed)return;scene=viewer[Object.getOwnPropertySymbols(viewer).find(k=>k.description==='scene')];if(!scene)return;viewer.model.materials.forEach(m=>{m.pbrMetallicRoughness.setMetallicFactor(0);m.pbrMetallicRoughness.setRoughnessFactor(.9)});scene.model.updateWorldMatrix(true,true);
 scene.model.traverse(mesh=>{if(!mesh.isMesh)return;const original=mesh.geometry,g=original.clone(),p=g.attributes.position,v=mesh.position.clone(),source=new Float32Array(p.count*3);for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);source.set([v.x,v.y,v.z],i*3);}parts.push({mesh,original,g,source,v,inverse:mesh.matrixWorld.clone().invert()});mesh.geometry=g;});viewer.style.visibility='visible';resume();});
 function draw(){
  if(!scene||disposed)return;const cycle=time%34,direction=Math.floor(time/34)%2? -1:1;
  const walk=cycle<10?1-smooth(9,10,cycle):cycle>23&&cycle<29?smooth(23,24,cycle)*(1-smooth(28,29,cycle)):0;
  const sit=smooth(10,12,cycle)*(1-smooth(21,23,cycle));const groom=smooth(13,14,cycle)*(1-smooth(18,19,cycle));
  const roll=smooth(29,30,cycle)*(1-smooth(32,34,cycle));
  const progress=cycle<10?cycle/20:cycle<23?.5:cycle<29?.5+(cycle-23)/12:1;
  const available=Math.max(0,lane.clientWidth-190);viewer.style.left=(direction>0?available*progress:available*(1-progress))+'px';
  viewer.dataset.action=roll>.1?'rolling':groom>.1?'grooming':sit>.1?'sitting':walk>.1?'walking':'looking';
  const blinkPhase=time%4.7,blink=smooth(0,.1,blinkPhase)*(1-smooth(.14,.26,blinkPhase));
  const step=Math.sin(time*5.2),look=Math.sin(time*.8)*.17+Math.sin(time*1.7)*.06;
  for(const part of parts){const p=part.g.attributes.position;for(let i=0;i<p.count;i++){
   const j=i*3;let x=part.source[j],y=part.source[j+1],z=part.source[j+2];
   const tail=(1-smooth(-.25,-.12,z))*smooth(-.08,.03,y);x+=tail*(.035*Math.sin(time*2.5+y*5)+sit*.025*Math.sin(time*4+y*6));
   const head=smooth(-.02,.12,y)*smooth(.10,.23,z)*(1-tail);
   if(head){const px=x,pz=z-.22,a=look*head;x=px*Math.cos(a)+pz*Math.sin(a);z=.22-px*Math.sin(a)+pz*Math.cos(a);y-=groom*head*.075*(.7+.3*Math.sin(time*5));}
   // Eyelids follow the eye region, leaving ears and whiskers unchanged.
   const eye=Math.exp(-Math.pow((Math.abs(x)-.125)/.048,2)-Math.pow((y-.17)/.055,2)-Math.pow((z-.35)/.09,2));y+=(.17-y)*eye*blink*.85;
   const leg=1-smooth(-.3,-.16,y),front=smooth(.02,.16,z),side=x<0?-1:1;
   if(leg){const swing=walk*step*(front>.5?side:-side)*.14;z+=leg*swing;y+=leg*Math.max(0,-swing)*.3;
    const paw=groom*front*smooth(.01,.06,x);y+=paw*leg*(.22+.025*Math.sin(time*7));z+=paw*leg*.04;}
   const rear=1-smooth(-.10,.06,z);y-=sit*(.11*rear+.025)*(1-smooth(-.48,-.35,y));z+=sit*rear*.06;
   y+=walk*.006*Math.sin(time*10.4);
   if(roll){const a=roll*Math.PI*(.9+.12*Math.sin(time*4)),py=y+.25,px=x;x=px*Math.cos(a)-py*Math.sin(a);y=-.25+px*Math.sin(a)+py*Math.cos(a);y+=roll*.14;}
   part.v.set(x,y,z).applyMatrix4(part.inverse);p.setXYZ(i,part.v.x,part.v.y,part.v.z);
  }p.needsUpdate=true;part.g.computeVertexNormals();part.g.computeBoundingSphere();}
  const orbit=direction>0?-52:128;viewer.setAttribute('camera-orbit',`${orbit}deg 80deg auto`);viewer.jumpCameraToGoal();scene.queueRender();
 }
 let pose=-1;
 function frame(now){raf=0;if(disposed||!visible||document.hidden||document.body.dataset.v!=='project'){last=0;return;}if(last)time+=Math.min(.08,(now-last)/1000);last=now;const next=Math.floor(time*18);if(next!==pose){pose=next;draw();}if(!reduced.matches)raf=requestAnimationFrame(frame);}
 function resume(){cancelAnimationFrame(raf);last=0;draw();if(visible&&!reduced.matches)raf=requestAnimationFrame(frame);}
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;resume()});observer.observe(lane);const resize=new ResizeObserver(()=>draw());resize.observe(lane);document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);
 cleanup=()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();resize.disconnect();document.removeEventListener('visibilitychange',resume);reduced.removeEventListener('change',resume);for(const p of parts){p.mesh.geometry=p.original;p.g.dispose();}viewer.removeAttribute('src');lane.remove();};
}};})();
