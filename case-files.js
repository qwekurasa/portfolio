/* Project photos and GIFs share a height and keep their original proportions. */
(() => {
  const decode=value=>{const node=document.createElement('textarea');node.innerHTML=value||'';return node.value;};
  window.CaseFiles={mount(project,host){
    host.querySelector('.project-photo-grid')?.remove();
    const photos=(project.gallery||[]).filter(photo=>photo.src);
    if(!photos.length)return;
    const section=document.createElement('section');
    section.className='project-photo-grid';section.setAttribute('aria-label','Фотографии проекта');
    const ratios=photos.map(({width,height})=>width>0&&height>0&&Number.isFinite(width/height)?width/height:1);
    const fitWidest=()=>section.style.setProperty('--widest',Math.max(1,...ratios));
    fitWidest();
    let row;
    photos.forEach((photo,index)=>{
      if(index%5===0){
        row=document.createElement('div');
        row.className='project-photo-row';
        section.append(row);
      }
      const tile=document.createElement('div');tile.className='project-photo-tile';
      tile.style.setProperty('--media-ratio',ratios[index]);
      const image=new Image();image.alt=decode(photo.alt);
      image.addEventListener('load',()=>{
        if(!image.naturalWidth||!image.naturalHeight)return;
        ratios[index]=image.naturalWidth/image.naturalHeight;
        tile.style.setProperty('--media-ratio',ratios[index]);
        fitWidest();
      },{once:true});
      image.loading='lazy';image.decoding='async';image.draggable=false;image.src=photo.src;
      tile.append(image);row.append(tile);
    });
    host.append(section);
  }};
})();
