/* Preserve animated GIF frames and force infinite playback via the GIF loop extension. */
window.GalleryMedia={async loopGif(file){
 const bytes=new Uint8Array(await file.arrayBuffer()),label=new TextDecoder('ascii').decode(bytes.slice(0,6));
 if(!['GIF87a','GIF89a'].includes(label)||bytes.length<14)throw new Error('Некорректный GIF');
 const start=13+((bytes[10]&128)?3*(1<<((bytes[10]&7)+1)):0);
 if(start>=bytes.length)throw new Error('Некорректный GIF');
 const skipBlocks=offset=>{while(offset<bytes.length){const size=bytes[offset++];if(!size)return offset;offset+=size;if(offset>bytes.length)break;}throw new Error('Повреждённый GIF');};
 let p=start,loop=false;
 while(p<bytes.length){const type=bytes[p++];if(type===0x3b)break;
  if(type===0x21){const kind=bytes[p++];if(kind===0xff){const size=bytes[p++],name=new TextDecoder('ascii').decode(bytes.slice(p,p+size));p+=size;if(['NETSCAPE2.0','ANIMEXTS1.0'].includes(name)&&bytes[p]===3&&bytes[p+1]===1){bytes[p+2]=0;bytes[p+3]=0;loop=true;}p=skipBlocks(p);}else p=skipBlocks(p);
  }else if(type===0x2c){if(p+9>bytes.length)throw new Error('Повреждённый GIF');const packed=bytes[p+8];p+=9;if(packed&128)p+=3*(1<<((packed&7)+1));p++;p=skipBlocks(p);
  }else throw new Error('Повреждённый GIF');
 }
 bytes.set([71,73,70,56,57,97],0);
 const extension=new Uint8Array([33,255,11,78,69,84,83,67,65,80,69,50,46,48,3,1,0,0,0]);
 return new Blob(loop?[bytes]:[bytes.slice(0,start),extension,bytes.slice(start)],{type:'image/gif'});
}};
