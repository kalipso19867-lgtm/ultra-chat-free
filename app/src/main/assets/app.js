const $=id=>document.getElementById(id);
const cfg=()=>{try{return JSON.parse(localStorage.ultraCfg||'{}')}catch{return {}}};
function add(t){let d=document.createElement('div');d.className='msg';d.textContent=t;$('conversation').append(d);d.scrollIntoView({behavior:'smooth',block:'nearest'});return d}
async function send(){
 let p=$('prompt').value.trim();if(!p)return;
 $('prompt').value='';add('Вы: '+p);let a=add('Думаю…');let c=cfg();
 try{
  let base=(c.url||'http://127.0.0.1:8080/v1').replace(/\/$/,'');
  let r=await fetch(base+'/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',...(c.key?{Authorization:'Bearer '+c.key}:{})},body:JSON.stringify({model:c.model||'local-model',messages:[{role:'user',content:p}]})});
  if(!r.ok)throw Error('HTTP '+r.status);
  let j=await r.json();a.textContent=j.choices?.[0]?.message?.content||'Модель вернула пустой ответ';
 }catch(e){a.textContent='Не удалось подключиться: '+e.message+'. Проверь URL llama-server, его запуск и доступность сети.'}
}
$('send').onclick=send;
$('prompt').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}});
$('settings').onclick=()=>{
 $('home').hidden=true;$('settingsPage').hidden=false;let c=cfg();
 $('url').value=c.url||'http://127.0.0.1:8080/v1';$('model').value=c.model||'qwen2.5-0.5b-instruct';$('key').value=c.key||'';
};
$('back').onclick=()=>{$('home').hidden=false;$('settingsPage').hidden=true};
$('save').onclick=()=>{localStorage.ultraCfg=JSON.stringify({url:$('url').value.trim(),model:$('model').value.trim(),key:$('key').value});alert('Настройки сохранены')};

// Все плитки главного экрана получают действие. Генерация требует отдельного сервера,
// поэтому приложение честно сообщает об этом, а не имитирует создание результата.
const tiles=[...document.querySelectorAll('.grid button')];
const tileActions=[
 ()=>{ $('prompt').value='Помоги выбрать подходящего ИИ-эксперта для моей задачи.';$('prompt').focus();add('Режим экспертов: опиши задачу в чате, и локальная модель поможет с ней.')},
 ()=>add('Создание фото пока не подключено: нужен отдельный сервер генерации изображений или API. Открой ⚙ Настройки, чтобы настроить подключение, когда сервер будет готов.'),
 ()=>add('Генерация видео пока не подключена: нужен отдельный видеогенератор/API. Эта кнопка работает и показывает, чего не хватает для запуска.'),
 ()=>{$('prompt').value='Помоги мне выполнить задачу пошагово: ';$('prompt').focus()},
 ()=>{$('prompt').value='Реши математическую задачу и покажи ход решения: ';$('prompt').focus()},
 ()=>{add('Камера: нажми системную кнопку выбора файла, чтобы прикрепить фото. Распознавание изображения появится после подключения vision-модели.');let i=document.createElement('input');i.type='file';i.accept='image/*';i.capture='environment';i.onchange=()=>{if(i.files?.[0])add('Выбрано изображение: '+i.files[0].name+'. Анализ изображения пока требует vision-модели.')};i.click()}
];
tiles.forEach((b,i)=>b.addEventListener('click',()=>tileActions[i]?.()));
$('menu').onclick=()=>alert('ULTRA CHAT\nЧат — отправляй сообщения через поле ввода.\nНастройки — ⚙ справа сверху.\nПодключи llama-server в настройках для локального ИИ.');
const nav=[...document.querySelectorAll('nav button')];
nav.forEach((b,i)=>b.addEventListener('click',()=>{
 nav.forEach(x=>x.style.color='');b.style.color='#c5adff';
 if(i===0){$('home').hidden=false;$('settingsPage').hidden=true;add('Открыт раздел «Чат».')}
 if(i===1)add('Ассистенты: выбери плитку «Эксперты» или напиши в чате, какого помощника создать. Создание отдельных профилей ассистентов ещё не реализовано.');
 if(i===2)add('Инструменты: доступны математическая помощь и прикрепление изображения. Генераторы фото/видео и анализ камеры требуют отдельных AI-сервисов.');
}));
