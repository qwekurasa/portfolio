/* Project photographs in a fixed three-column grid. */
(() => {
  const decode=value=>{const node=document.createElement('textarea');node.innerHTML=value||'';return node.value;};
  window.CaseFiles={mount(project,host){
    host.querySelector('.project-photo-grid')?.remove();
    const photos=(project.gallery||[]).filter(photo=>photo.src);
    if(!photos.length)return;
    const section=document.createElement('section');
    section.className='project-photo-grid';section.setAttribute('aria-label','Фотографии проекта');
    photos.forEach(photo=>{
      const tile=document.createElement('div');tile.className='project-photo-tile';
      const image=new Image();image.src=photo.src;image.alt=decode(photo.alt);
      image.loading='lazy';image.decoding='async';image.draggable=false;
      tile.append(image);section.append(tile);
    });
    host.append(section);
  }};
})();
