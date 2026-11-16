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
      const button=document.createElement('button');
      button.type='button';button.setAttribute('aria-label','Открыть фотографию '+(index+1));
      const image=new Image();image.src=photo.src;image.alt=decode(photo.alt);
      image.loading='lazy';image.decoding='async';
      button.append(image);
      button.onclick=()=>window.lbOpen(photos.map(p=>({img:p.src,h:decode(p.alt),p:''})),index,project.name);
      section.append(button);
    });
    host.append(section);
  }};
})();
