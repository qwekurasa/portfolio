/* Original reference flight + a feathered landing on the About window. */
(() => {
  const map = document.getElementById('map');
  const card = document.getElementById('heroText');
  if (!map || !card) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.id = 'aboutPigeon';
  canvas.width = canvas.height = 320;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;left:0;top:0;width:210px;height:210px;pointer-events:none;z-index:8;filter:invert(1);opacity:0;transform-origin:50% 85%;';
  map.append(canvas);
  const ctx = canvas.getContext('2d');
  const buffer = document.createElement('canvas');
  buffer.width = buffer.height = 320;
  const bctx = buffer.getContext('2d', {willReadFrequently:true});
  const video = document.createElement('video');
  video.muted = true; video.playsInline = true; video.preload = 'none';
  const sheet = new Image(); sheet.src = 'pigeon-landing.png';
  let ready = false, failed = false, started = false, startTime = 0, raf = 0;
  const ease = t => 1-Math.pow(1-t,3);
  const clamp = t => Math.max(0,Math.min(1,t));
  const sheetReady = new Promise(resolve => {
    if(sheet.complete && sheet.naturalWidth) resolve();
    else {sheet.onload=resolve;sheet.onerror=()=>{failed=true;resolve();};}
  });
  function pose(index, alpha=1, dip=0) {
    const sw=sheet.naturalWidth/4, sh=sheet.naturalHeight;
    ctx.save();ctx.globalAlpha=alpha;
    // The four frames share the same toe line, not their bounding-box centre.
    ctx.drawImage(sheet,index*sw,0,sw,sh,20,0+dip,240,320);
    ctx.restore();
  }
  function flight() {
    bctx.clearRect(0,0,320,320);
    bctx.drawImage(video,0,0,320,320);
    const frame=bctx.getImageData(0,0,320,320),d=frame.data;
    // Remove black without losing the fine ASCII/feather highlights.
    for(let i=0;i<d.length;i+=4){
      const light=Math.max(d[i],d[i+1],d[i+2]);
      const a=light<8?0:Math.min(255,(light-8)*1.035);
      d[i]=d[i+1]=d[i+2]=255;d[i+3]=a;
    }
    bctx.putImageData(frame,0,0);
    ctx.drawImage(buffer,0,0);
  }
  function draw(now) {
    raf=0;
    if(document.body.dataset.v!=='map'||document.hidden) {video.pause();return;}
    const r=card.getBoundingClientRect(),size=innerWidth<700?154:210;
    const target={x:innerWidth<700?r.left+70:r.right-Math.min(66,r.width*.18),y:r.top-1};
    const t=reduced.matches?9:(now-startTime)/1000;
    ctx.clearRect(0,0,320,320);
    let x=target.x,y=target.y,tilt=0;
    if(t<3.45 && ready){
      const u=ease(clamp(t/3.45)),v=1-u;
      const from={x:-size*.7,y:Math.min(60,target.y-140)};
      x=v*v*v*from.x+3*v*v*u*(innerWidth*.17)+3*v*u*u*(target.x-170)+u*u*u*target.x;
      y=v*v*v*from.y+3*v*v*u*(-45)+3*v*u*u*(target.y-100)+u*u*u*target.y;
      y+=Math.sin(t*6)*3*(1-u);tilt=-5*(1-u);
      flight();
      // Smoothly introduce the braking pose as forward travel slows down.
      if(t>3.0) pose(0,clamp((t-3.0)/.45));
    }else if(t<4.25 && !reduced.matches){
      video.pause();
      const k=clamp((t-3.45)/.8)*3,i=Math.min(2,Math.floor(k)),blend=k-i;
      pose(i,1);pose(i+1,blend,Math.sin(blend*Math.PI)*1.4);
      y+=Math.sin(clamp((t-3.45)/.8)*Math.PI)*2;
    }else{
      video.pause();pose(3);
      // Settled toes stay on the ledge; no perpetual whole-bird floating.
      canvas.dataset.state='perched';
    }
    canvas.style.width=canvas.style.height=size+'px';
    canvas.style.opacity=String(clamp(t/.22));
    canvas.style.transform=`translate(${x-size*.55}px,${y-size*.87}px) rotate(${tilt}deg)`;
    if(t<4.4&&!reduced.matches) raf=requestAnimationFrame(draw);
  }
  async function start() {
    if(started||failed||document.body.dataset.v!=='map'||!card.classList.contains('on'))return;
    started=true;
    await sheetReady;
    if(failed)return;
    if(!reduced.matches){
      video.src='pigeon-flight.mp4';
      try {await video.play();ready=true;}catch {ready=false;}
    }
    if(document.body.dataset.v!=='map'){started=false;video.pause();return;}
    startTime=performance.now();canvas.dataset.state=ready?'flying':'perched';
    if(!ready)startTime-=9000;
    raf=requestAnimationFrame(draw);
  }
  const observer=new MutationObserver(start);
  observer.observe(card,{attributes:true,attributeFilter:['class']});
  function resume(){
    if(document.body.dataset.v!=='map'||document.hidden){cancelAnimationFrame(raf);raf=0;video.pause();return;}
    if(!started)start();
    else{startTime=performance.now()-9000;requestAnimationFrame(draw);}
  }
  addEventListener('hashchange',()=>requestAnimationFrame(resume));
  addEventListener('resize',()=>{if(started)requestAnimationFrame(draw);});
  document.addEventListener('visibilitychange',resume);
  reduced.addEventListener('change',resume);
  start();
})();
