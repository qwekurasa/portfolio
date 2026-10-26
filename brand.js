/* бренд-бук проекта: данные по id проекта + рендер под первым экраном */
(()=>{
const LOGO={tempt:{vb:'0 0 66 32',r:[[0,12,66,9],[8,6,10,26],[28,0,10,26],[48,6,10,26]]}};
const DATA={
 mvjxhkra:{
  logo:'tempt',
  tag:'Магазин одежды и сборник вещей',
  about:'Каталог вещей с фото, ценой в рублях и долларах, таблицами размеров и примерной стоимостью доставки до России. Заказ — через Telegram.',
  colors:[['#000000','Фон'],['#171717','Поверхность'],['#262626','Разделители'],['#3B3B3B','Неактивное'],['#C6C6C6','Вторичный текст'],['#D4D4D4','Основной текст'],['#FFFFFF','Акцент']],
  type:{name:'Моноширинный',rules:['Только верхний регистр','Широкая разрядка','Один кегль на экране — иерархия весом и цветом'],
    rows:[['Навигация','О проекте&nbsp;&nbsp;Доставка&nbsp;&nbsp;Форум',''],['Товар','Scarf LV 02','b'],['Цена','2 600 ₽ · $31','b'],['Подпись','Цвет grey · размер 179x63см · срок 18–25 дней','s']]},
  screens:['Каталог','Карточка товара','Форум','Корзина'],
  crops:[['brand/filters.webp','Фильтры'],['brand/item.webp','Фото товара'],['brand/cart.webp','Строка заказа']],
  row:'brand/grid.webp',
  steps:['Нажмите «Оформить заказ» — появится номер заказа','Напишите этот номер в Telegram: @tempt_sup','Получите реквизиты, оплатите — дальше статус доставки']
 }
};
const css=`
.bb{filter:invert(1);background:#000;color:#d4d4d4;font:13px/1.7 ui-monospace,Consolas,"SFMono-Regular",Menlo,monospace;text-transform:uppercase;letter-spacing:.08em;position:relative;overflow:hidden}
.bb-fade{height:10vh;background:linear-gradient(#0000,#000);filter:invert(1)}
.bb a{color:inherit}
.bb-in{max-width:1280px;margin:0 auto;padding:0 32px}
.bb-s{padding:120px 0;border-top:1px solid #171717;display:grid;grid-template-columns:220px minmax(0,1fr);gap:40px}
.bb-k{color:#3b3b3b;font-size:12px;position:sticky;top:90px;align-self:start}.bb-k b{display:block;color:#d4d4d4;font-weight:400;margin-top:6px}
.bb-hero{min-height:80vh;display:grid;place-items:center;text-align:center;padding:80px 0}
.bb-hero svg{width:min(56vw,620px);height:auto;display:block;margin:0 auto 48px;shape-rendering:crispEdges}
.bb-hero svg rect{fill:#d4d4d4;transform-box:fill-box;transform-origin:center;transform:scaleY(0);transition:transform .9s cubic-bezier(.2,.8,.2,1)}
.bb-hero.in svg rect{transform:none}.bb-hero.in svg rect:nth-child(2){transition-delay:.15s}.bb-hero.in svg rect:nth-child(3){transition-delay:.3s}.bb-hero.in svg rect:nth-child(4){transition-delay:.45s}
.bb-hero h2{font-size:clamp(28px,5vw,64px);letter-spacing:.3em;font-weight:400;margin:0 0 10px;color:#fff}
.bb-hero p{color:#3b3b3b;margin:0}
.bb-r{opacity:0;transform:translateY(40px);transition:opacity .9s,transform .9s cubic-bezier(.2,.8,.2,1)}.bb-r.in{opacity:1;transform:none}
.bb-q{font-size:clamp(18px,2vw,26px);line-height:1.6;color:#fff;margin:0 0 48px;max-width:860px}
.bb-meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1px;background:#171717;border:1px solid #171717}
.bb-meta div{background:#000;padding:18px}.bb-meta span{display:block;color:#3b3b3b;font-size:11px}
.bb-logo{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.bb-logo div{aspect-ratio:1;display:grid;place-items:center;border:1px solid #171717;position:relative}
.bb-logo svg{width:52%;shape-rendering:crispEdges}.bb-logo .w{background:#fff}.bb-logo .w rect{fill:#000}.bb-logo .d rect{fill:#d4d4d4}
.bb-logo .g{background:#000 linear-gradient(#171717 1px,#0000 1px) 0 0/100% 8.33%,linear-gradient(90deg,#171717 1px,#0000 1px) 0 0/8.33% 100%}
.bb-logo .g rect{fill:none;stroke:#d4d4d4;stroke-width:.3}
.bb-logo i{position:absolute;left:14px;bottom:10px;font-style:normal;font-size:11px;color:#3b3b3b}.bb-logo .w i{color:#999}
.bb-col{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));height:420px}
.bb-col button{all:unset;cursor:pointer;display:flex;flex-direction:column;justify-content:flex-end;padding:14px;font-size:11px;line-height:1.5;transition:flex-grow .5s;flex-grow:1;border:1px solid #171717}
.bb-col button:hover{transform:translateY(-8px)}.bb-col button{transition:transform .4s cubic-bezier(.2,.8,.2,1)}
.bb-ty{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px;align-items:end}
.bb-aa{font-size:clamp(120px,16vw,240px);line-height:1;color:#fff;letter-spacing:0;text-transform:none}
.bb-abc{color:#c6c6c6;word-break:break-all;margin:0 0 20px}.bb-ty ul{margin:0;padding:0;list-style:none;color:#3b3b3b}.bb-ty li:before{content:"— "}
.bb-rows{margin-top:56px;border-top:1px solid #171717}.bb-rows div{display:grid;grid-template-columns:200px 1fr;padding:22px 0;border-bottom:1px solid #171717}
.bb-rows span{color:#3b3b3b}.bb-rows .b{color:#fff}.bb-rows .s{color:#c6c6c6;font-size:11px}
.bb-scr figure{margin:0 0 80px}.bb-scr img{width:100%;display:block;border:1px solid #171717}
.bb-scr figcaption{display:flex;justify-content:space-between;color:#3b3b3b;margin-top:14px;font-size:11px}.bb-scr figcaption b{color:#d4d4d4;font-weight:400}
.bb-cmp{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.bb-cmp figure{margin:0;border:1px solid #171717;display:flex;flex-direction:column}.bb-cmp figure>div{flex:1;display:grid;place-items:center;padding:28px;min-height:260px}
.bb-cmp img{max-width:100%;max-height:340px;display:block}.bb-cmp figcaption{padding:12px 14px;border-top:1px solid #171717;color:#3b3b3b;font-size:11px}
.bb-btn{all:unset;cursor:pointer;border:1px solid #d4d4d4;color:#fff;padding:18px 0;width:100%;max-width:340px;text-align:center;font-weight:700;letter-spacing:.1em;transition:background .25s,color .25s}.bb-btn:hover{background:#fff;color:#000}
.bb-qty{display:flex;align-items:center;gap:14px}.bb-qty button{all:unset;cursor:pointer;width:24px;height:24px;border:1px solid #3b3b3b;border-radius:3px;display:grid;place-items:center}.bb-qty button:hover{border-color:#fff}
.bb-chk label{display:flex;gap:12px;align-items:center;cursor:pointer;margin:6px 0}.bb-chk input{appearance:none;width:13px;height:13px;border:1px solid #3b3b3b;background:#171717;margin:0}.bb-chk input:checked{background:#d4d4d4;border-color:#d4d4d4}
.bb-row{margin-top:16px;border:1px solid #171717;overflow:hidden}.bb-row div{display:flex;width:max-content;animation:bbm 40s linear infinite}.bb-row img{height:200px;display:block}
@keyframes bbm{to{transform:translateX(-50%)}}
.bb-st{counter-reset:s;list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.bb-st li{border:1px solid #171717;padding:24px;min-height:200px;display:flex;flex-direction:column;justify-content:space-between;text-transform:none;letter-spacing:.02em;color:#c6c6c6}
.bb-st li:before{counter-increment:s;content:"0" counter(s);font-size:48px;color:#fff;line-height:1}
.bb-end{padding:140px 0 160px;text-align:center;border-top:1px solid #171717}
.bb-end a{font-size:clamp(28px,5vw,64px);letter-spacing:.2em;color:#fff;text-decoration:none;display:inline-block;transition:letter-spacing .5s}.bb-end a:hover{letter-spacing:.3em}
.bb-end p{color:#3b3b3b;margin:16px 0 0}
@media(max-width:900px){.bb-s{grid-template-columns:minmax(0,1fr);gap:24px;padding:80px 0}.bb-k{position:static}.bb-logo,.bb-cmp,.bb-st,.bb-ty{grid-template-columns:minmax(0,1fr)}.bb-col{grid-template-columns:1fr;height:auto}.bb-col button{min-height:64px}.bb-rows div{grid-template-columns:minmax(0,1fr)}.bb-in{padding:0 16px}.bb-scr figure{margin-bottom:48px}}
@media(prefers-reduced-motion:reduce){.bb-r{opacity:1;transform:none}.bb-row div{animation:none}.bb-hero svg rect{transform:none}}`;
const svg=(k)=>{const l=LOGO[k];return l?`<svg viewBox="${l.vb}" aria-hidden="true">${l.r.map(r=>`<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}"/>`).join('')}</svg>`:''};
const sec=(n,t,body)=>`<section class="bb-s bb-r"><div class="bb-k">${String(n).padStart(2,'0')}<b>${t}</b></div><div>${body}</div></section>`;
function render(p,raw){const B=DATA[raw];if(!B)return'';
  if(!document.getElementById('bb-css')){const s=document.createElement('style');s.id='bb-css';s.textContent=css;document.head.append(s)}
  const shots=(p.wins||[]).filter(w=>w.img),meta=[['Тип',p.type],['Год',p.created||'—'],...(p.meta||[]).filter(m=>m[0]!=='Ссылка')];
  const lg=svg(B.logo);let n=0;
  return `<div class="bb-fade"></div><div class="bb"><div class="bb-in">
  <header class="bb-hero bb-r"><div>${lg}<h2>${p.name}</h2><p>${B.tag}</p></div></header>
  ${sec(++n,'О проекте',`<p class="bb-q">${B.about}</p><div class="bb-meta">${meta.map(m=>`<div><span>${m[0]}</span>${m[1]}</div>`).join('')}</div>`)}
  ${lg?sec(++n,'Логотип',`<div class="bb-logo"><div class="d">${lg}<i>На тёмном</i></div><div class="w">${lg}<i>На светлом</i></div><div class="g">${lg}<i>Построение · пиксельная сетка</i></div></div>`):''}
  ${sec(++n,'Цвет',`<div class="bb-col">${B.colors.map((c,j)=>`<button data-c="${c[0]}" style="background:${c[0]};color:${j<4?'#d4d4d4':'#000'}">${c[1]}<br>${c[0]}</button>`).join('')}</div>`)}
  ${sec(++n,'Типографика',`<div class="bb-ty"><div class="bb-aa">Aa</div><div><p class="bb-abc">${B.type.name}<br>АБВГДЕЁЖЗИЙКЛМН<br>ABCDEFGHIJKLMN<br>0123456789 ₽ $ ¥ · —</p><ul>${B.type.rules.map(r=>`<li>${r}</li>`).join('')}</ul></div></div>
    <div class="bb-rows">${B.type.rows.map(r=>`<div><span>${r[0]}</span><p class="${r[2]}" style="margin:0">${r[1]}</p></div>`).join('')}</div>`)}
  ${shots.length?sec(++n,'Интерфейс',`<div class="bb-scr">${shots.map((w,j)=>`<figure class="bb-r"><img src="${w.img}" alt="${p.name}: ${B.screens[j]||w.h||''}" loading="lazy"><figcaption><b>${B.screens[j]||w.h||'Экран'}</b><span>${String(j+1).padStart(2,'0')} / ${String(shots.length).padStart(2,'0')}</span></figcaption></figure>`).join('')}</div>`):''}
  ${sec(++n,'Компоненты',`<div class="bb-cmp">
    <figure><div><button class="bb-btn">Оформить заказ</button></div><figcaption>Кнопка · наведи</figcaption></figure>
    <figure><div><div class="bb-qty"><button data-q="-1">−</button><b>1</b><button data-q="1">+</button></div></div><figcaption>Количество</figcaption></figure>
    <figure><div class="bb-chk"><div><label><input type="checkbox" checked>Худи</label><label><input type="checkbox">Куртки</label><label><input type="checkbox">Шарф</label></div></div><figcaption>Фильтр</figcaption></figure>
    ${B.crops.map(c=>`<figure><div><img src="img/${raw}/${c[0]}" alt="${c[1]}" loading="lazy"></div><figcaption>${c[1]}</figcaption></figure>`).join('')}
  </div>${B.row?`<div class="bb-row"><div><img src="img/${raw}/${B.row}" alt="Товарная сетка" loading="lazy"><img src="img/${raw}/${B.row}" alt="" loading="lazy"></div></div>`:''}`)}
  ${B.steps?sec(++n,'Как заказать',`<ol class="bb-st">${B.steps.map(s=>`<li>${s}</li>`).join('')}</ol>`):''}
  <footer class="bb-end bb-r">${p.pwa?`<a href="${p.pwa}" target="_blank" rel="noopener">${p.name} ↗</a><p>Открыть сайт</p>`:`<a>${p.name}</a>`}</footer>
  </div></div>`}
function init(root){const bb=root.querySelector('.bb');if(!bb)return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px'});
  bb.querySelectorAll('.bb-r').forEach(e=>io.observe(e));
  bb.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{navigator.clipboard?.writeText(b.dataset.c);const t=b.innerHTML;b.innerHTML='Скопировано';setTimeout(()=>b.innerHTML=t,900)});
  bb.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const v=b.parentElement.querySelector('b');v.textContent=Math.max(1,+v.textContent+ +b.dataset.q)})}
window.Brand={render,init,has:raw=>!!DATA[raw]};
})();
