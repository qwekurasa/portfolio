/* Full-width project photo grid; preserves existing gallery order. */
(() => {
  const decode = value => { const node=document.createElement('textarea');node.innerHTML=value||'';return node.value; };
  window.CaseFiles = { mount(project,host) {
    const photos=(project.gallery||[]).filter(photo=>photo.src);
    if(!photos.length)return;
    const section=document.createElement('section');
    section.className='project-photo-grid';
    section.setAttribute('aria-label','Фотографии проекта');
    photos.forEach((photo,index)=>{
      const tile=document.createElement('div');
      tile.className='project-photo-tile';
      tile.style.setProperty('--drift-duration',(21+index*3.7)+'s');
      tile.style.setProperty('--drift-delay',(-index*5.3)+'s');
      tile.style.setProperty('--drift-x',(index%2 ? -3 : 3)+'px');
      tile.style.setProperty('--drift-y',(index%3 ? 3 : -3)+'px');
      const image=new Image();image.src=photo.src;image.alt=decode(photo.alt);
      image.loading='lazy';image.decoding='async';
      image.draggable=false;
      tile.append(image);
      section.append(tile);
    });
    host.append(section);
  }};
})();
