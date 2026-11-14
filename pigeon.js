/* Continuous reference-video pigeon, with the original feather/ASCII texture. */
(() => {
  const map=document.getElementById('map'),card=document.getElementById('heroText');
  if(!map||!card)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const canvas=document.createElement('canvas');
  canvas.id='aboutPigeon';canvas.width=canvas.height=360;
  canvas.setAttribute('aria-hidden','true');
  canvas.style.cssText='position:absolute;left:0;top:0;pointer-events:none;z-index:8;filter:invert(1);opacity:0;will-change:transform;';
  map.append(canvas);
  // Keep the information readable when the orbit passes behind a corner.
  card.style.zIndex='9';
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  const video=document.createElement('video');
  video.muted=true;video.playsInline=true;video.loop=true;video.preload='none';
  video.playbackRate=.8;
  let raf=0,started=false,loading=false,elapsed=0,previous=0,lastVideoTime=-1,ready=false;
  const tau=Math.PI*2;
  function active(){return document.body.dataset.v==='map'&&!document.hidden&&card.classList.contains('on');}
  function geometry(){
    const r=card.getBoundingClientRect(),mobile=innerWidth<700;
    return {r,mobile,size:mobile?166:220,cx:(r.left+r.right)/2,cy:(r.top+r.bottom)/2,
      rx:r.width/2+102,ry:r.height/2+105};
  }
  function orbit(t,g){
    // A slow oval around the entire window. On narrow screens, stay above it.
    if(g.mobile){const angle=-Math.PI/2+t*tau/36;
      return {x:g.cx+Math.cos(angle)*Math.min(g.r.width*.34,112),y:g.r.top-100+Math.sin(angle)*28};}
    const angle=-Math.PI/2+t*tau/42;
    return {x:g.cx+Math.cos(angle)*g.rx,y:g.cy+Math.sin(angle)*g.ry};
  }
  function flightPixels(){
    if(video.readyState<2||video.currentTime===lastVideoTime)return;
    lastVideoTime=video.currentTime;
    ctx.clearRect(0,0,360,360);ctx.drawImage(video,0,0,360,360);
    const image=ctx.getImageData(0,0,360,360),d=image.data;
    // Luminance key preserves the original white code trails, even faint glyphs.
    for(let i=0;i<d.length;i+=4){
      const v=Math.max(d[i],d[i+1],d[i+2]);
      d[i+3]=v<=3?0:Math.min(255,(v-3)*1.012);
      d[i]=d[i+1]=d[i+2]=255;
    }
    ctx.putImageData(image,0,0);
  }
  function frame(now){
    raf=0;if(!active()){pause();return;}
    if(previous)elapsed+=Math.min((now-previous)/1000,.06);
    previous=now;
    const g=geometry();let p;
    if(reduced.matches){p=orbit(0,g);canvas.dataset.state='reduced-motion';}
    else if(elapsed<10){
      // Hermite approach matches both position and velocity at the orbit join.
      const u=elapsed/10,u2=u*u,u3=u2*u,end=orbit(0,g),next=orbit(.01,g);
      const x0=-g.size*.6,y0=Math.max(35,g.r.top-195);
      const vx=(next.x-end.x)/.01,vy=(next.y-end.y)/.01;
      p={x:(2*u3-3*u2+1)*x0+(u3-2*u2+u)*110+(-2*u3+3*u2)*end.x+(u3-u2)*vx*10,
         y:(2*u3-3*u2+1)*y0+(u3-2*u2+u)*-75+(-2*u3+3*u2)*end.y+(u3-u2)*vy*10};
      canvas.dataset.state='arriving';
    }else{p=orbit(elapsed-10,g);canvas.dataset.state='orbiting';}
    flightPixels();
    canvas.style.width=canvas.style.height=g.size+'px';
    canvas.style.opacity=reduced.matches?'1':String(Math.min(1,(elapsed+.05)/.8));
    canvas.style.transform=`translate(${p.x-g.size*.53}px,${p.y-g.size*.52}px)`;
    canvas.dataset.elapsed=elapsed.toFixed(2);
    if(!reduced.matches)raf=requestAnimationFrame(frame);
  }
  function pause(){cancelAnimationFrame(raf);raf=0;previous=0;video.pause();}
  async function resume(){
    if(!active()){pause();return;}
    if(loading||raf)return;
    if(!started){started=true;loading=true;video.src='pigeon-flight.mp4';
      try{await video.play();ready=true;}catch{ready=false;}finally{loading=false;}
    }else if(!reduced.matches){try{await video.play();ready=true;}catch{ready=false;}}
    if(!active()){pause();return;}
    if(!ready){canvas.style.opacity='0';return;}
    if(reduced.matches)video.pause();
    previous=0;if(!raf)raf=requestAnimationFrame(frame);
  }
  new MutationObserver(resume).observe(card,{attributes:true,attributeFilter:['class']});
  addEventListener('hashchange',()=>requestAnimationFrame(resume));
  document.addEventListener('visibilitychange',resume);
  reduced.addEventListener('change',()=>{pause();resume();});
  addEventListener('resize',()=>{if(reduced.matches&&ready&&active())requestAnimationFrame(frame);});
  resume();
})();
