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
 let elapsed=0,last=0,frame=-1,settled=false,startY=0;
 const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
 function placeCard(){const r=doll.getBoundingClientRect();card.style.left=Math.max(16,Math.min(innerWidth-card.offsetWidth-16,r.left))+'px';card.style.top=Math.max(16,Math.min(innerHeight-card.offsetHeight-16,r.bottom+12))+'px';}
 function showCard(){if(settled)return;settled=true;doll.dataset.motion='idle';doll.setAttribute('camera-controls','');card.hidden=false;placeCard();requestAnimationFrame(()=>card.classList.add('on'));}
 function pose(hang,head,arms,legs,crouch,t){
  for(const part of parts){const p=part.g.attributes.position;const raised=hang>.01;if(part.cutIndex&&part.raised!==raised){part.g.setIndex(raised?part.cutIndex:part.standingIndex);part.raised=raised;}
   for(let i=0;i<p.count;i++){
    const j=i*3;let x=part.world[j],y=part.world[j+1],z=part.world[j+2];const h=(y-box.min.y)/H,side=x<cx?-1:1,dx=Math.abs(x-cx)/H;
    const arm=(dx>.09&&h>.34?1-smooth(.61,.68,h):0);
    if(arm>0){const angle=side*(hang*2.85+(1-hang)*.085+arms*(side===1?1:.75))*arm;const px=cx+side*H*.082,py=box.min.y+H*.655;const thickness=1+.14*arm*(1-smooth(.57,.63,h));const axisX=cx+side*H*.12;x=axisX+(x-axisX)*thickness;z*=thickness;let ax=x-px,ay=y-py;x=px+ax*Math.cos(angle)-ay*Math.sin(angle);y=py+ax*Math.sin(angle)+ay*Math.cos(angle);}
    const hw=smooth(.72,.8,h);if(hw){const py=box.min.y+H*.75,ax=x-cx,ay=y-py;x=cx+ax*Math.cos(head*hw)-ay*Math.sin(head*hw);y=py+ax*Math.sin(head*hw)+ay*Math.cos(head*hw);}
    if(h<.41){const weight=1-smooth(.34,.43,h),angle=legs*side*weight,py=box.min.y+H*.4,ay=y-py,az=z;z=az*Math.cos(angle)-ay*Math.sin(angle);y=py+az*Math.sin(angle)+ay*Math.cos(angle);}
    y-=H*crouch*smooth(0,.5,h);z+=H*crouch*.25*smooth(.1,.5,h);
    part.v.set(x,y,z).applyMatrix4(part.inverse);p.setXYZ(i,part.v.x,part.v.y,part.v.z);
   }
   p.needsUpdate=true;part.g.computeVertexNormals();part.g.computeBoundingSphere();
  }scene.queueRender();
 }
 function measure(){const old=doll.style.transform;doll.style.transform='';startY=-doll.getBoundingClientRect().top-52;doll.style.transform=old;if(settled)placeCard();}
 measure();addEventListener('resize',measure);doll.removeAttribute('camera-controls');
 pose(1,0,0,0,0,0);doll.style.transform=`translateY(${startY}px)`;doll.dataset.surfaceReady='true';doll.dataset.motion='hanging';
 function tick(now){requestAnimationFrame(tick);if(document.hidden||document.body.dataset.v!=='map'){last=0;return;}if(last)elapsed+=Math.min(100,now-last);last=now;
  if(reduced.matches){if(!settled){pose(0,0,0,0,0,0);doll.setAttribute('camera-orbit','-30deg 74deg auto');doll.jumpCameraToGoal();doll.style.transform='';showCard();}return;}
  const next=Math.floor(elapsed/83.333);if(next===frame)return;frame=next;const t=next/12;
  if(elapsed<3000){
   const release=smooth(.72,1.12,t),fall=Math.min(1,Math.max(0,(t-.85)/.9));
   const impact=smooth(1.72,1.9,t)*(1-smooth(2.05,2.95,t));
   const y=startY*(1-fall*fall),tilt=release*(1-smooth(1.75,2.95,t))*Math.sin(t*5)*7;
   doll.style.transform=`translateY(${y}px) rotate(${tilt}deg)`;doll.dataset.motion=t<.85?'hanging':t<1.75?'falling':'standing-up';
   const settle=1-smooth(1.8,3,t);pose(1-release,.03*Math.sin(t*5)*settle,release*.17*settle,release*.12*settle,impact*.085,t);const turn=smooth(1.8,3,t);doll.setAttribute('camera-orbit',`${-30*turn}deg ${90-16*turn}deg auto`);doll.jumpCameraToGoal();
  }else{
   doll.style.transform='';if(!settled){doll.setAttribute('camera-orbit','-30deg 74deg auto');doll.jumpCameraToGoal();}showCard();
   const idle=smooth(3,3.8,t);pose(0,idle*.055*Math.sin(t*.85)+idle*.018*Math.sin(t*1.6),idle*(.07*Math.sin(t*1.1)+.018*Math.sin(t*2.3)),idle*.025*Math.sin(t*.7),idle*.006*(1+Math.sin(t*1.5)),t);
  }
 }
 requestAnimationFrame(tick);
}

