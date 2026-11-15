/* Three draggable vector files and a high-DPI reactive point field. */
(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let cleanup=null;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const decode=s=>{const t=document.createElement('textarea');t.innerHTML=s||'';return t.value;};
  function fileArt(n){const id='case-art-'+n;
    return `<svg viewBox="0 0 160 210" aria-hidden="true"><defs>
      <linearGradient id="${id}-paper" x2=".9" y2="1"><stop stop-color="#3c3c40"/><stop offset=".52" stop-color="#28282c"/><stop offset="1" stop-color="#1a1a1d"/></linearGradient>
      <linearGradient id="${id}-fold" x2="1" y2="1"><stop stop-color="#77777b"/><stop offset="1" stop-color="#353539"/></linearGradient>
      <linearGradient id="${id}-glass" x2="1" y2="1"><stop stop-color="#1b1b1f"/><stop offset="1" stop-color="#070708"/></linearGradient></defs>
      <path d="M21 8H103L149 54V188Q149 199 138 199H21Q10 199 10 188V20Q10 8 21 8Z" fill="url(#${id}-paper)" stroke="#55555a" stroke-width=".55"/>
      <path d="M103 8V43Q103 54 114 54H149" fill="url(#${id}-fold)" stroke="#69696f" stroke-width=".5"/>
      <path d="M21 9H102M11 21V182" fill="none" stroke="#ffffff18"/>
      <text x="29" y="43" font-size="10" letter-spacing="1.8" fill="#9d9da5" font-family="Arial,sans-serif">IMG</text>
      <rect x="29" y="65" width="102" height="95" rx="5" fill="url(#${id}-glass)" stroke="#44444a" stroke-width=".65"/>
      <path d="M38 78H83M38 83H65" stroke="#71717a" stroke-width="1"/>
      ${Array.from({length:13},(_,i)=>`<path d="M39 ${94+i*4}H${50+((i*17+n*11)%61)}" stroke="#${i%3?'45454d':'777780'}" stroke-width=".75"/>`).join('')}
      ${Array.from({length:7},(_,i)=>`<rect x="${88+i*4}" y="${126-((i*9+n*5)%21)}" width="1.5" height="${8+((i*9+n*5)%21)}" rx=".7" fill="#8e8e97" opacity=".7"/>`).join('')}
      <circle cx="115" cy="78" r="1.1" fill="#bebec4"/><path d="M39 148H120" stroke="#303036"/>
      <path d="M29 176H131" stroke="#4a4a50" stroke-width=".6"/><text x="29" y="189" font-size="7.5" letter-spacing="1.2" fill="#777780" font-family="Arial,sans-serif">PROJECT / 0${n+1}</text>
    </svg>`;
  }
  const tabIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 15h6M9 18h4"/></svg>';
  window.CaseFiles={mount(project,host){
    cleanup?.();
    const section=document.createElement('section');section.className='case-field';section.setAttribute('aria-label','Материалы проекта: три интерактивных файла');
    section.innerHTML='<canvas aria-hidden="true"></canvas>';
    host.append(section);
    const names=[0,1,2].map(i=>decode(project.caseFiles?.[i])||['Обзор проекта','Интерфейс','Детали'][i]);
    const photos=project.gallery||[];
    const files=names.map((name,i)=>{
      const el=document.createElement('button');el.type='button';el.className='case-file';el.innerHTML=fileArt(i)+'<span class="case-file-name"></span><span class="case-file-count"></span>';
      el.querySelector('.case-file-name').textContent=name;
      const count=photos.filter(p=>(p.file||0)===i).length;
      el.querySelector('.case-file-count').textContent=`0${i+1} / ${count} ФОТО`;
      el.setAttribute('aria-label',`${name}, ${count} фото. Нажмите для просмотра; стрелки перемещают файл.`);el.setAttribute('aria-haspopup','dialog');
      section.append(el);
      return {el,i,nx:[.23,.5,.77][i],ny:project.device==='ipad'?[.38,.62,.43][i]:.5,x:0,y:0,dx:0,dy:0,dragged:false,suppressClick:false};
    });
    const canvas=section.querySelector('canvas'),ctx=canvas.getContext('2d');
    let w=0,h=0,dpr=1,nodes=[],cols=0,raf=0,visible=false,last=0,time=0,drag=null,destroyed=false;
    function measure(){
      if(view){const panel=view.querySelector('.case-panel');panel.style.left=panel.style.top=panel.style.transform='';}
      w=section.clientWidth;h=section.clientHeight;
      dpr=Math.min(devicePixelRatio||1,3,Math.sqrt(6500000/(w*h)));
      canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
      const gap=w<600?26:38;cols=Math.ceil(w/gap)+1;const rows=Math.ceil(h/gap)+1;
      nodes=[];for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)nodes.push({bx:x*gap,by:y*gap,x:x*gap,y:y*gap});
      files.forEach(f=>{f.x=f.nx*w;f.y=f.ny*h;place(f);});schedule();
    }
    function place(f){const fw=f.el.offsetWidth,fh=f.el.offsetHeight;
      f.x=clamp(f.x,fw*.55,w-fw*.55);f.y=clamp(f.y,fh*.55+58,h-fh*.55-16);
      f.el.style.transform=`translate(${f.x-fw/2}px,${f.y-fh/2}px) rotate(${drag===f?clamp(f.dx*.18,-6,6):0}deg)`;
    }
    function render(now){
      raf=0;if(destroyed||!visible||document.hidden)return;
      const dt=last?Math.min((now-last)/1000,.05):.016;last=now;if(!reduced.matches)time+=dt;
      ctx.clearRect(0,0,w,h);
      files.forEach(f=>{f.dx*=Math.exp(-dt*7);f.dy*=Math.exp(-dt*7);place(f);});
      const radius=Math.min(w*.32,310);
      for(const p of nodes){let tx=p.bx,ty=p.by,illum=0;
        for(const f of files){const vx=p.bx-f.x,vy=p.by-f.y,dist=Math.hypot(vx,vy),q=Math.exp(-dist*dist/(radius*radius));illum=Math.max(illum,q);
          const wave=reduced.matches?0:Math.sin(dist*.022-time*1.3+f.i)*2.8;
          tx+=(vx/(dist||1)*wave+f.dx*1.7)*q;ty+=(vy/(dist||1)*wave+f.dy*1.7)*q;
        }
        const follow=reduced.matches?1:1-Math.exp(-dt*8);p.x+=(tx-p.x)*follow;p.y+=(ty-p.y)*follow;
        const edge=Math.pow(Math.max(0,Math.sin(Math.PI*clamp(p.bx/w,0,1))*Math.sin(Math.PI*clamp(p.by/h,0,1))),.65);
        p.alpha=(.018+.55*Math.pow(illum,2.1))*edge;
      }
      // Whisper-thin strands make the deformation visible without a bright grid.
      ctx.lineWidth=.55;
      for(let i=0;i<nodes.length;i++){const p=nodes[i];ctx.strokeStyle=`rgba(220,220,228,${p.alpha*.15})`;
        for(const j of [i%cols<cols-1?i+1:-1,i+cols])if(j>=0&&j<nodes.length){const q=nodes[j];ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
      }
      for(const p of nodes){ctx.fillStyle=`rgba(240,240,247,${p.alpha})`;ctx.beginPath();ctx.arc(p.x,p.y,.7+p.alpha*.85,0,Math.PI*2);ctx.fill();
        if(p.alpha>.28){ctx.fillStyle=`rgba(220,220,233,${p.alpha*.055})`;ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();}}
      canvas.dataset.time=time.toFixed(2);
      if(!reduced.matches||drag)schedule();
    }
    function schedule(){if(!destroyed&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(render);}
    let view=null,restoreFocus=null,oldOverflow='',oldPadding='',currentPhotos=[],photoIndex=0;
    function close(){if(!view)return;view.remove();view=null;document.body.style.overflow=oldOverflow;document.body.style.paddingRight=oldPadding;document.removeEventListener('keydown',dialogKeys);restoreFocus?.focus({preventScroll:true});}
    function dialogKeys(e){if(e.key==='Escape'){e.preventDefault();close();}else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();selectPhoto(photoIndex+(e.key==='ArrowLeft'?-1:1));}else if(e.key==='Tab'&&view){const els=[...view.querySelectorAll('button:not([disabled])')],first=els[0],last=els[els.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}
    function selectPhoto(index){if(!view||!currentPhotos.length)return;
      photoIndex=clamp(index,0,currentPhotos.length-1);const photo=currentPhotos[photoIndex],im=view.querySelector('.case-photo');
      im.src=photo.src;im.alt=decode(photo.alt);view.querySelector('.case-photo-count').textContent=(photoIndex+1)+' / '+currentPhotos.length;
      view.querySelector('.case-prev').disabled=photoIndex===0;view.querySelector('.case-next').disabled=photoIndex===currentPhotos.length-1;
      view.querySelectorAll('.case-thumb').forEach((b,n)=>{b.setAttribute('aria-current',n===photoIndex?'true':'false');if(n===photoIndex)b.scrollIntoView({block:'nearest',inline:'nearest'});});
    }
    function show(i){
      if(!view){restoreFocus=files[i].el;oldOverflow=document.body.style.overflow;oldPadding=document.body.style.paddingRight;
        const scrollbar=innerWidth-document.documentElement.clientWidth;document.body.style.overflow='hidden';if(scrollbar)document.body.style.paddingRight=scrollbar+'px';
        view=document.createElement('div');view.className='case-view visible';view.innerHTML='<div class="case-scrim"></div><section class="case-panel" role="dialog" aria-modal="true" aria-labelledby="case-dialog-title" tabindex="-1"><header class="case-titlebar"><button class="case-close" aria-label="Закрыть просмотр">×</button><span class="case-window-dots" aria-hidden="true"></span><h2 id="case-dialog-title"></h2><span class="case-photo-count" aria-live="polite"></span></header><nav class="case-photo-toolbar" aria-label="Листать фотографии"><button class="case-prev" aria-label="Предыдущая фотография">‹</button><button class="case-next" aria-label="Следующая фотография">›</button></nav><div class="case-panel-content"><img class="case-photo" alt="" draggable="false"><p class="case-empty" hidden>В этом файле пока нет изображений</p></div><nav class="case-filmstrip" aria-label="Миниатюры фотографий"></nav></section>';
        document.body.append(view);view.querySelector('.case-scrim').onclick=close;view.querySelector('.case-close').onclick=close;document.addEventListener('keydown',dialogKeys);
        view.querySelector('.case-prev').onclick=()=>selectPhoto(photoIndex-1);view.querySelector('.case-next').onclick=()=>selectPhoto(photoIndex+1);
        const title=view.querySelector('.case-titlebar'),panel=view.querySelector('.case-panel');let move=null;
        title.addEventListener('pointerdown',e=>{if(innerWidth<700||e.target.closest('button')||e.button!==0)return;const r=panel.getBoundingClientRect();move={x:e.clientX,y:e.clientY,left:r.left,top:r.top};title.setPointerCapture(e.pointerId);});
        title.addEventListener('pointermove',e=>{if(!move)return;panel.style.left=clamp(move.left+e.clientX-move.x,0,innerWidth-panel.offsetWidth)+'px';panel.style.top=clamp(move.top+e.clientY-move.y,0,innerHeight-panel.offsetHeight)+'px';panel.style.transform='none';});
        title.addEventListener('pointerup',()=>move=null);title.addEventListener('pointercancel',()=>move=null);
        const area=view.querySelector('.case-panel-content');let swipe=null;
        area.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')swipe={x:e.clientX,y:e.clientY};});
        area.addEventListener('pointerup',e=>{if(!swipe)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)selectPhoto(photoIndex+(dx<0?1:-1));});
        area.addEventListener('pointercancel',()=>swipe=null);
        view.querySelector('.case-close').focus({preventScroll:true});
      }
      view.querySelector('h2').textContent=names[i];currentPhotos=photos.filter(p=>(p.file||0)===i);photoIndex=0;
      const strip=view.querySelector('.case-filmstrip');strip.replaceChildren();
      currentPhotos.forEach((photo,n)=>{const button=document.createElement('button');button.className='case-thumb';button.setAttribute('aria-label','Фотография '+(n+1));const im=new Image();im.src=photo.src;im.alt='';im.loading='lazy';button.append(im);button.onclick=()=>selectPhoto(n);strip.append(button);});
      view.querySelector('.case-photo').hidden=!currentPhotos.length;view.querySelector('.case-empty').hidden=!!currentPhotos.length;strip.hidden=!currentPhotos.length;
      view.querySelector('.case-photo-count').textContent=currentPhotos.length?'1 / '+currentPhotos.length:'0 / 0';
      view.querySelector('.case-prev').disabled=view.querySelector('.case-next').disabled=!currentPhotos.length;
      selectPhoto(0);
    }
    files.forEach(f=>{
      let down=null;
      f.el.addEventListener('pointerdown',e=>{if(e.button!==0)return;down={id:e.pointerId,x:e.clientX,y:e.clientY,fx:f.x,fy:f.y};f.suppressClick=false;drag=f;f.el.classList.add('dragging');f.el.setPointerCapture(e.pointerId);schedule();});
      f.el.addEventListener('pointermove',e=>{if(!down||e.pointerId!==down.id)return;
        const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.hypot(dx,dy)>6)f.suppressClick=true;
        const ox=f.x,oy=f.y;f.x=down.fx+dx;f.y=down.fy+dy;place(f);f.dx=f.x-ox;f.dy=f.y-oy;f.nx=f.x/w;f.ny=f.y/h;f.dragged=true;schedule();});
      const up=()=>{down=null;drag=null;f.el.classList.remove('dragging');place(f);schedule();};
      f.el.addEventListener('pointerup',up);f.el.addEventListener('pointercancel',()=>{f.suppressClick=true;up();});
      f.el.addEventListener('lostpointercapture',up);
      f.el.addEventListener('click',e=>{if(f.suppressClick&&e.detail!==0){f.suppressClick=false;return;}show(f.i);});
      f.el.addEventListener('keydown',e=>{const dir={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!dir)return;e.preventDefault();const step=e.shiftKey?24:10;f.dx=dir[0]*step;f.dy=dir[1]*step;f.x+=f.dx;f.y+=f.dy;place(f);f.nx=f.x/w;f.ny=f.y/h;schedule();});
    });
    const resize=new ResizeObserver(measure);resize.observe(section);
    const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)schedule();else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'100px'});intersection.observe(section);
    const visibility=()=>{last=0;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else schedule();};
    document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',schedule);
    const routeClose=()=>{close();if(document.body.dataset.v!=='project'){cancelAnimationFrame(raf);raf=0;}};
    addEventListener('hashchange',routeClose);
    cleanup=()=>{destroyed=true;close();cancelAnimationFrame(raf);resize.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',schedule);removeEventListener('hashchange',routeClose);section.remove();};
    measure();
  }};
})();

