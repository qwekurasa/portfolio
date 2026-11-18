export function start(doll,card){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const scene=doll[Object.getOwnPropertySymbols(doll).find(k=>k.description==='scene')];
 if(!scene?.model){doll.dataset.surfaceReady='true';return;}
 const model=scene.model;model.updateWorldMatrix(true,true);
 const box=scene.boundingBox,H=box.max.y-box.min.y,cx=(box.min.x+box.max.x)/2;
 const parts=[];
 model.traverse(mesh=>{if(!mesh.isMesh)return;const original=mesh.geometry,g=original.clone(),p=g.attributes.position,world=new Float32Array(p.count*3),v=model.position.clone();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);world.set([v.x,v.y,v.z],i*3);}parts.push({mesh,g,original,world,inverse:mesh.matrixWorld.clone().invert(),v});mesh.geometry=g;});
 // Generated scans may bridge fingers to trousers. Hide only those bridge
 // triangles in every pose so small idle gestures cannot pull the trousers.
 for(const part of parts){
  const ix=part.original.index,kept=[],standing=[];part.fullIndex=ix;
  if(ix){for(let i=0;i<ix.count;i+=3){const ids=[ix.getX(i),ix.getX(i+1),ix.getX(i+2)];const flags=ids.map(v=>Math.abs(part.world[v*3]-cx)/H>.09&&(part.world[v*3+1]-box.min.y)/H>.34&&(part.world[v*3+1]-box.min.y)/H<.68);const bridge=flags.some(Boolean)&&!flags.every(Boolean)&&ids.some(v=>(part.world[v*3+1]-box.min.y)/H<.60);if(!bridge)kept.push(...ids);if(!bridge||!ids.some(v=>(part.world[v*3+1]-box.min.y)/H<.46))standing.push(...ids);}part.cutIndex=kept;part.standingIndex=standing;}
 }
 const css=document.createElement('style');css.textContent=`#map.home-3d{overflow:hidden}#heroText.doll-about{position:fixed;z-index:8;width:min(350px,calc(100vw - 32px));max-width:none;font-size:13px;background:transparent;border:0;border-radius:0;box-shadow:none;color:#999;padding:0;transition:opacity .22s steps(3),transform .22s steps(3)}#heroText.doll-about.on{transform:none}#heroText.doll-about .ht-name{display:none}#heroText.doll-about .ht-links{background:none;border:0;padding:0;margin:0!important}@media(max-width:700px){#heroText.doll-about{font-size:12px}}`;document.head.append(css);
 card.classList.add('doll-about');
 let elapsed=0,last=0,frame=-1,settled=false,startX=0;
 const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
 function placeCard(){const r=doll.getBoundingClientRect();card.style.left=Math.max(16,Math.min(innerWidth-card.offsetWidth-16,r.left))+'px';card.style.top=Math.max(16,Math.min(innerHeight-card.offsetHeight-16,r.bottom+12))+'px';}
 function showCard(){if(settled)return;settled=true;doll.dataset.motion='idle';doll.setAttribute('camera-controls','');card.hidden=false;placeCard();requestAnimationFrame(()=>card.classList.add('on'));}
 let handPosition=model.position.clone(),releasePoint=null;
 function pose(hang,head,arms,legs,crouch,t){
  let handX=0,handY=0,handZ=0,handCount=0;
  for(const part of parts){const p=part.g.attributes.position;const raised=false;if(part.cutIndex&&part.raised!==raised){part.g.setIndex(raised?part.cutIndex:part.standingIndex);part.raised=raised;}
   for(let i=0;i<p.count;i++){
    const j=i*3;let x=part.world[j],y=part.world[j+1],z=part.world[j+2];const h=(y-box.min.y)/H,side=x<cx?-1:1,dx=Math.abs(x-cx)/H;
    const arm=(dx>.09&&h>.34?1-smooth(.61,.68,h):0);
    if(arm>0){const lift=side===1?hang:0;const elbow=1-smooth(.47,.54,h);if(lift&&elbow){const ey=box.min.y+H*.51,ez=H*.015,dy=y-ey,dz=z-ez,flex=lift*1.25*elbow;y=ey+dy*Math.cos(flex)-dz*Math.sin(flex);z=ez+dy*Math.sin(flex)+dz*Math.cos(flex);}const angle=side*(lift*1.05+(1-lift)*.085+arms*(side===1?1:.75))*arm;z+=H*lift*.10*arm;const px=cx+side*H*.082,py=box.min.y+H*.655;const thickness=1+.08*arm*(1-smooth(.57,.63,h));const axisX=cx+side*H*.12;x=axisX+(x-axisX)*thickness;z*=thickness;let ax=x-px,ay=y-py;x=px+ax*Math.cos(angle)-ay*Math.sin(angle);y=py+ax*Math.sin(angle)+ay*Math.cos(angle);x-=H*lift*.12*arm;}
    const hw=smooth(.72,.8,h);if(hw){const py=box.min.y+H*.75,ax=x-cx,ay=y-py;x=cx+ax*Math.cos(head*hw)-ay*Math.sin(head*hw);y=py+ax*Math.sin(head*hw)+ay*Math.cos(head*hw);}
    if(h<.41&&arm<.05){const weight=1-smooth(.34,.43,h),angle=legs*side*weight,py=box.min.y+H*.4,ay=y-py,az=z;z=az*Math.cos(angle)-ay*Math.sin(angle);y=py+az*Math.sin(angle)+ay*Math.cos(angle);}
    y-=H*crouch*smooth(0,.5,h);z+=H*crouch*.25*smooth(.1,.5,h);
    if(side===1&&h>.36&&h<.43&&dx>.10){handX+=x;handY+=y;handZ+=z;handCount++;}part.v.set(x,y,z).applyMatrix4(part.inverse);p.setXYZ(i,part.v.x,part.v.y,part.v.z);
   }
   p.needsUpdate=true;part.g.computeVertexNormals();part.g.computeBoundingSphere();
  }if(handCount)handPosition.set(handX/handCount,handY/handCount,handZ/handCount);scene.queueRender();
 }
 const source=parts[0].mesh,props=[];
 function cylinder(length,radius){
  const g=new source.geometry.constructor(),vertices=[],normals=[],uvs=[];
  const add=(x,a,u,v,nx=0)=>{vertices.push(x,Math.cos(a)*radius,Math.sin(a)*radius);normals.push(nx,nx?0:Math.cos(a),nx?0:Math.sin(a));uvs.push(u,v);};
  for(let i=0;i<24;i++){
   const a=i*Math.PI/12,b=(i+1)*Math.PI/12;
   for(const [x,t] of [[0,a],[length,a],[length,b],[0,a],[length,b],[0,b]])add(x,t,x/length,t/(Math.PI*2));
   for(const [x,nx,u] of [[0,-1,0],[length,1,.995]]){vertices.push(x,0,0);normals.push(nx,0,0);uvs.push(u,.5);add(x,nx<0?b:a,u,.1,nx);add(x,nx<0?a:b,u,.9,nx);}
  }
  const Attribute=source.geometry.attributes.position.constructor;
  g.setAttribute('position',new Attribute(new Float32Array(vertices),3));g.setAttribute('normal',new Attribute(new Float32Array(normals),3));g.setAttribute('uv',new Attribute(new Float32Array(uvs),2));
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');
  ctx.fillStyle='#e6deca';ctx.fillRect(0,0,512,128);ctx.fillStyle='#bd874e';ctx.fillRect(0,0,130,128);ctx.fillStyle='#68615a';ctx.fillRect(476,0,36,128);
  let seed=42;for(let i=0;i<8500;i++){seed=(seed*1664525+1013904223)>>>0;const x=seed%512;seed=(seed*1664525+1013904223)>>>0;const y=seed%128;ctx.fillStyle=x<130?'rgba(87,45,20,.19)':x>476?'rgba(20,17,14,.4)':'rgba(112,103,82,.075)';ctx.fillRect(x,y,1,1);}
  ctx.strokeStyle='rgba(130,116,88,.2)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(130,65);ctx.lineTo(476,65);ctx.stroke();
  const texture=new source.material.map.constructor(canvas);texture.colorSpace='srgb';texture.needsUpdate=true;texture.anisotropy=4;
  const m=source.material.clone();for(const key of ['map','normalMap','emissiveMap','metalnessMap','roughnessMap','aoMap'])m[key]=null;
  m.map=texture;m.metalness=0;m.roughness=.96;m.color.set('#ffffff');m.emissive.set('#000000');m.side=0;
  const mesh=new source.constructor(g,m);scene.add(mesh);props.push(mesh);return mesh;
 }
 const cigarette=cylinder(H*.047,H*.0025);const ember=cylinder(H*.002,H*.0026);ember.material.map.dispose();ember.material.map=null;ember.material.color.set('#704b36');ember.material.emissive.set('#be3d0e');ember.material.emissiveIntensity=.4;
 const smoke=document.createElement('span');smoke.slot='hotspot-cigarette';smoke.dataset.normal='0 0 1';smoke.style.cssText='pointer-events:none;position:relative;display:block;width:1px;height:1px';smoke.innerHTML='<i></i><i></i><i></i>';doll.append(smoke);
 const smokeStyle=document.createElement('style');smokeStyle.textContent='[slot="hotspot-cigarette"] i{position:absolute;bottom:0;left:0;width:8px;height:18px;border-left:1px solid #c8c8c8;border-radius:50%;filter:blur(1px);animation:doll-smoke 1.5s ease-out infinite;opacity:0}[slot="hotspot-cigarette"] i:nth-child(2){animation-delay:.5s}[slot="hotspot-cigarette"] i:nth-child(3){animation-delay:1s}@keyframes doll-smoke{0%{opacity:0;transform:translate(0,0) scale(.5)}25%{opacity:.45}100%{opacity:0;transform:translate(10px,-48px) scale(1.8)}}';document.head.append(smokeStyle);
 let disposed=false;
 function propsPose(t){
  if(disposed)return;
  if(t>=3||reduced.matches){if(!disposed){for(const m of props){scene.remove(m);m.geometry.dispose();m.material.map?.dispose();m.material.dispose();}smoke.remove();disposed=true;}return;}
  const take=smooth(1.9,2.25,t),flight=Math.max(0,(t-2.35)/.65);
  cigarette.position.set(cx+H*.005,box.min.y+H*.82,H*.12).lerp(handPosition,take);if(flight>0){if(!releasePoint)releasePoint=cigarette.position.clone();cigarette.position.copy(releasePoint);cigarette.position.x+=H*.32*flight;cigarette.position.y+=H*(.12*Math.sin(flight*Math.PI)-.65*flight*flight);}
  cigarette.rotation.z=-.15-take*.5-flight*4.5;
  ember.position.set(H*.047,0,0).applyAxisAngle(ember.up.clone().set(0,0,1),cigarette.rotation.z).add(cigarette.position);ember.rotation.copy(cigarette.rotation);
  smoke.style.display=t>2.35?'none':'block';smoke.dataset.position=`${ember.position.x}m ${ember.position.y}m ${ember.position.z}m`;
  doll.updateHotspot({name:'hotspot-cigarette',position:smoke.dataset.position,normal:'0 0 1'});scene.queueRender();
 }
 function measure(){const old=doll.style.transform;doll.style.transform='';const r=doll.getBoundingClientRect();startX=-r.right-20;doll.style.transform=old;if(settled)placeCard();}
 measure();addEventListener('resize',measure);doll.removeAttribute('camera-controls');
 pose(0,0,0,0,0,0);propsPose(0);doll.style.transform=`translateX(${startX}px)`;doll.dataset.surfaceReady='true';doll.dataset.motion='walking';
 function tick(now){requestAnimationFrame(tick);if(document.hidden||document.body.dataset.v!=='map'){last=0;return;}if(last)elapsed+=Math.min(100,now-last);last=now;
  if(reduced.matches){propsPose(3);if(!settled){pose(0,0,0,0,0,0);doll.setAttribute('camera-orbit','-30deg 74deg auto');doll.jumpCameraToGoal();doll.style.transform='';showCard();}return;}
  const next=Math.floor(elapsed/16.667);if(next===frame)return;frame=next;const t=elapsed/1000;
  if(elapsed<3000){
   const arrive=smooth(0,2,t),walk=1-smooth(1.65,2.1,t),step=Math.sin(t*9);
   doll.style.transform=`translate(${startX*(1-arrive)}px,${-(1-Math.cos(t*18))*1.2*walk}px)`;doll.dataset.motion=t<2?'walking':'discarding';
   const hand=smooth(1.68,2.12,t)*(1-smooth(2.28,2.82,t));
   pose(hand,.025*Math.sin(t*3)*walk,.13*step*walk,.16*step*walk,.004*walk,t);
   const turn=smooth(1.65,2.8,t);doll.setAttribute('camera-orbit',`${-65+35*turn}deg ${82-8*turn}deg auto`);doll.jumpCameraToGoal();propsPose(t);
  }else{
   propsPose(t);doll.style.transform='';if(!settled){doll.setAttribute('camera-orbit','-30deg 74deg auto');doll.jumpCameraToGoal();}showCard();
   const idle=smooth(3,3.8,t);pose(0,idle*.055*Math.sin(t*.85)+idle*.018*Math.sin(t*1.6),idle*(.07*Math.sin(t*1.1)+.018*Math.sin(t*2.3)),idle*.025*Math.sin(t*.7),idle*.006*(1+Math.sin(t*1.5)),t);
  }
 }
 requestAnimationFrame(tick);
}

