'use strict';
const products = {
  fences: { title:'Заборы и ворота', image:'hero.jpg', description:'Металлические, комбинированные с деревом и 3D-заборы. Ворота — откатные или распашные, в зависимости от места у въезда.', types:['Металлические заборы','Заборы в сочетании с деревом','3D-ограждения','Откатные ворота','Распашные ворота'] },
  canopies: { title:'Навесы и теплицы', image:'greenhouse.jpg', description:'Навесы для автомобилей, хранения дров и беседок, а также английские теплицы. Размеры и конфигурация зависят от участка.', types:['Навесы для автомобилей','Навесы под дрова','Навесы для беседок','Английские теплицы'] },
  fire: { title:'Мангальные зоны и отдых', image:'outdoor.jpg', description:'Мангальные зоны, отдельные костровые чаши и качели для участка.', types:['Мангальные зоны','Костровые чаши','Качели'] },
  sport: { title:'Спортивное оборудование', image:'sport.jpg', description:'Спортивные площадки и фитнес-оборудование. Состав и размеры оборудования нужно согласовать под место установки.', types:['Спортивные площадки','Фитнес-оборудование'] },
  furniture: { title:'Мебель и освещение', image:'outdoor.jpg', description:'Столы, стулья, скамейки и парковые светильники. Для мебели можно использовать сочетание металла и дерева.', types:['Столы','Стулья','Скамейки','Парковые светильники'] },
  stainless: { title:'Нержавеющая сталь', image:'stainless.jpg', description:'Индивидуальные изделия из нержавеющей стали любой формы и сложности. Конструкция и технические параметры согласовываются под задачу.', types:['Изделия по индивидуальному эскизу','Мебель и интерьерные элементы','Детали сложной формы'] }
};
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));menu.setAttribute('aria-label',expanded?'Открыть меню':'Закрыть меню');nav.classList.toggle('open',!expanded);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const selected=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
  let count=0;document.querySelectorAll('.product').forEach(card=>{card.hidden=selected!=='all'&&card.dataset.group!==selected;if(!card.hidden)count++;});
  document.querySelector('#filter-status').textContent=`Показано направлений: ${count}`;
}));
const dialog=document.querySelector('#product-dialog');let selectedProduct=null;let dialogOpener=null;
document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>{
  selectedProduct=products[button.dataset.product];dialogOpener=button;
  document.querySelector('#dialog-title').textContent=selectedProduct.title;
  document.querySelector('#dialog-description').textContent=selectedProduct.description;
  const picture=document.querySelector('#dialog-image');picture.src=selectedProduct.image;picture.alt=`Визуальная концепция: ${selectedProduct.title.toLowerCase()}`;
  const list=document.querySelector('#dialog-types');list.replaceChildren(...selectedProduct.types.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  dialog.showModal();document.body.classList.add('modal-open');
}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(dialogOpener)dialogOpener.focus({preventScroll:true});});
document.querySelector('#choose-product').addEventListener('click',()=>{
  document.querySelector('#category').value=selectedProduct.title;dialog.close();
  requestAnimationFrame(()=>{document.querySelector('#project').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('#category').focus({preventScroll:true});});
});
document.querySelector('#brief-form').addEventListener('submit',event=>{
  event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
  const data=new FormData(form);const text=['ООО «АСН МЕТАЛЛ» — описание проекта','',`Направление: ${data.get('category')}`,`Размеры: ${String(data.get('dimensions')).trim()||'Нужно уточнить'}`,`Расположение: ${data.get('place')}`,`Описание: ${String(data.get('idea')).trim()||'Нужно уточнить'}`,'','Описание подготовлено на сайте и сохранено локально.','Это не отправленная заявка. Условия, сроки и стоимость требуют согласования.'].join('\n');
  const url=URL.createObjectURL(new Blob(['\uFEFF'+text],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='asn-metall-project.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  document.querySelector('#brief-status').textContent='Описание подготовлено для скачивания. Его можно передать при обсуждении проекта.';
});
document.querySelector('#year').textContent=new Date().getFullYear();
