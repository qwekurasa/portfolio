/* Free-floating project photographs with responsive staggered placement. */
(() => {
  let cleanup=()=>{};
  const decode=value=>{const node=document.createElement('textarea');node.innerHTML=value||'';return node.value;};
  window.CaseFiles={mount(project,host){
    cleanup();
    const photos=(project.gallery||[]).filter(photo=>photo.src);
    if(!photos.length)return;
    const section=document.createElement('section');
    section.className='project-photo-grid';section.setAttribute('aria-label','Фотографии проекта');
    const tiles=photos.map((photo,index)=>{
      const tile=document.createElement('div');tile.className='project-photo-tile';
      tile.style.setProperty('--drift-duration',(24+index*4.7)+'s');
      tile.style.setProperty('--drift-delay',(-7-index*6.3)+'s');
      tile.style.setProperty('--tilt',[-3,2.5,-1.8,3.2,-2.4,1.4][index%6]+'deg');
      const image=new Image();image.src=photo.src;image.alt=decode(photo.alt);
      image.loading='lazy';image.decoding='async';image.draggable=false;
      tile.append(image);section.append(tile);return {tile,image,photo};
    });
    host.append(section);
    function layout(){
      const width=section.clientWidth,mobile=width<700,columns=mobile?2:3;
      const bottoms=mobile?[60,150]:[90,205,45];
      let bottom=0;
      tiles.forEach(({tile,image,photo},index)=>{
        const lane=index%columns;
        const fraction=mobile?[.39,.38,.4,.37][index%4]:[.29,.25,.24,.27,.28,.23][index%6];
        const x=mobile?[.06,.55,.08,.53][index%4]:[.045,.395,.725,.09,.425,.735][index%6];
        const tileWidth=width*fraction;
        const ratio=image.naturalWidth?image.naturalHeight/image.naturalWidth:photo.width&&photo.height?photo.height/photo.width:.75;
        const y=bottoms[lane];
        tile.style.width=tileWidth+'px';tile.style.left=width*x+'px';tile.style.top=y+'px';
        tile.style.setProperty('--drift-x',(mobile?7:Math.min(25,width*.015))*(index%2?-1:1)+'px');
        tile.style.setProperty('--drift-y',(mobile?12:25)*(index%3?1:-1)+'px');
        const end=y+tileWidth*ratio;
        bottoms[lane]=end+(mobile?90:145)+(index%2)*35;
        bottom=Math.max(bottom,end);
      });
      section.style.height=bottom+(mobile?95:150)+'px';
    }
    tiles.forEach(({image})=>image.addEventListener('load',layout));
    const observer=new ResizeObserver(layout);observer.observe(host);
    layout();
    cleanup=()=>{observer.disconnect();tiles.forEach(({image})=>image.removeEventListener('load',layout));section.remove();};
  }};
})();
