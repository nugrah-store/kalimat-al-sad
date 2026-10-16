import {WORDS,WordGame} from './words.mjs?v=tashkeel-2';
import {illustration} from './art.mjs';
const main=document.querySelector('main'),announce=document.querySelector('#announce');
const ar=x=>String(x).replace(/\d/g,n=>'٠١٢٣٤٥٦٧٨٩'[n]);
let game=new WordGame(),sound=true,audio=null,message='',messageType='';
const praises=['رائعة! صنعتِ كلمة جميلة!','أحسنتِ يا بطلة الحروف!','ممتازة! نجمة جديدة لكِ!','يا سلام! أنتِ مبدعة!','عمل جميل يا نجمة!','أبدعتِ! اكتملت كلماتكِ الست!'];
function tune(){
 if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const notes=[523.25,659.25,783.99,1046.5,1318.51];const t=audio.currentTime;notes.forEach((hz,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,t+i*.12);g.gain.linearRampToValueAtTime(.09,t+i*.12+.02);g.gain.exponentialRampToValueAtTime(.001,t+i*.12+.25);o.connect(g);g.connect(audio.destination);o.start(t+i*.12);o.stop(t+i*.12+.27);});}catch{}}
function feedback(text,type){message=text;messageType=type;announce.textContent=text;}
function render(){
 if(game.status==='finished'){renderResult();return;}
 const w=game.current,correct=game.status==='correct',ready=game.answer.length===w.word.length;
 main.innerHTML=`<section class="intro"><div><span class="eyebrow"><span aria-hidden="true">✦</span> لغتي الجميلة · الصف الأول الابتدائي</span><h1>مَرْحَى، يا <em>صاد!</em></h1><p>صورةٌ، وحروفٌ صغيرة… وكلمةٌ تصنعينها بنفسكِ.</p></div><div class="star-box" aria-label="${ar(game.done.length)} نجوم من أصل ٦"><span aria-hidden="true">★</span><div><b>${ar(game.done.length)} <small>من ٦</small></b><span>نجومكِ المضيئة</span></div></div></section>
 <nav class="journey" aria-label="تقدمك في الكلمات الست">${WORDS.map((x,i)=>`<span class="journey-item ${i===game.index?'current':''} ${i<game.done.length?'done':''}" ${i===game.index?'aria-current="step"':''}><span class="journey-dot" aria-hidden="true">${i<game.done.length?'★':ar(i+1)}</span><span>${x.label}</span><span class="sr-only">${i<game.done.length?'، مكتملة':i===game.index?'، الكلمة الحالية':'، قادمة'}</span></span>`).join('')}</nav>
 <section class="play-area"><div class="picture-card ${w.color}"><div class="card-label"><span>الكلمة ${ar(game.index+1)} <span class="muted">من ٦</span></span><span class="little-flower" aria-hidden="true">✿</span></div><div class="picture">${illustration(w.art,`صورة ${w.word}`)}</div><div class="word-model"><span>${w.label}</span></div><p>${w.hint}</p></div>
 <div class="builder"><div class="builder-heading"><span class="step-label">لِنُكَوِّنِ الكَلِمَةَ</span><span class="writing-direction">ابدئي من اليمين <span aria-hidden="true">←</span></span></div><h2>${correct?'أحسنتِ! هذه كلمتكِ الجميلة.':'اضغطي الحروف بالترتيب الصحيح'}</h2><p class="builder-note">انظري إلى الصورة والكلمة، ثم ضعي كل حرف في مكانه.</p>
 <div class="answer-preview ${correct?'success':''}" aria-label="الكلمة التي كوّنتِها: ${game.vowelledAnswer||'لم تختاري حروفًا بعد'}">${game.vowelledAnswer||'<span class="preview-placeholder">كَلِمَتُكِ هُنا</span>'}${correct?'<span class="word-star" aria-hidden="true">★</span>':''}</div>
 <div class="slots" role="group" aria-label="خانات حروف الكلمة من اليمين إلى اليسار">${Array.from(w.word,(_,i)=>`<button class="slot ${game.selected[i]!==undefined?'filled':''} ${correct?'locked':''}" data-action="remove" data-index="${i}" aria-label="الحرف ${ar(i+1)}: ${game.answerLetters[i]||'مكان فارغ'}${correct?'':game.answer[i]?'، اضغطي لإزالته':''}" ${correct||game.selected[i]===undefined?'disabled':''}>${game.answerLetters[i]||'<span aria-hidden="true">·</span>'}</button>`).join('')}</div>
 <div class="letter-tray" role="group" aria-label="حروف مبعثرة، اختاري حرفًا">${game.letters.map(t=>`<button class="letter ${game.selected.includes(t.id)?'used':''}" data-action="letter" data-id="${t.id}" aria-label="حرف ${t.label}" ${correct||game.selected.includes(t.id)?'disabled':''}>${t.label}</button>`).join('')}</div>
 <div class="small-tools"><button data-action="clear" ${correct||!game.selected.length?'disabled':''}>↶ ابدئي الكلمة من جديد</button><button data-action="hint" ${correct||ready?'disabled':''}>✦ ساعديني بحرف</button></div>
 <div class="message ${messageType}" role="status">${message||'<span class="message-seed" aria-hidden="true">♡</span> خذي وقتكِ، أنتِ قادرة!'}</div>
 ${correct?`<button class="primary next" data-action="next">${game.index===5?'شاهدي نجومكِ الست':'الكلمة التالية'} <span aria-hidden="true">←</span></button>`:`<button class="primary check" data-action="check" ${!ready?'disabled':''}>تحقّقي من كلمتكِ <span aria-hidden="true">✓</span></button>`}
 </div></section><p class="bottom-note"><span aria-hidden="true">☀</span> كل محاولة تعلّمكِ شيئًا جديدًا، وكل كلمة تُضيء نجمة.</p>`;
}
function renderResult(){
 main.innerHTML=`<section class="result"><div class="constellation" aria-hidden="true">★ <span>★</span> ★ <span>★</span> ★ <span>★</span></div><span class="eyebrow">وسام صديقة الصاد</span><h1>ستّ كلمات…<br><em>وستّ نجوم لكِ!</em></h1><p>أحسنتِ يا بطلة! كوّنتِ الكلمات الست.<br>هذه الكلمات الجميلة التي صنعتِها بنفسكِ.</p><div class="result-grid">${WORDS.map((w,i)=>`<div class="result-word ${w.color}">${illustration(w.art,`صورة ${w.word}`)}<strong>${w.label}</strong><span aria-hidden="true">★</span></div>`).join('')}</div><button class="primary" data-action="restart">لنلعب مرّة أخرى <span aria-hidden="true">↶</span></button><p class="result-note">المعلمة: عزيزة الحجاجي · فخورةٌ بمحاولاتكِ الجميلة.</p></section>`;
 announce.textContent='أحسنتِ! أكملتِ الكلمات الست وحصلتِ على ست نجوم.';
}
function focusMain(){main.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
document.addEventListener('click',e=>{
 const b=e.target.closest('button[data-action]');if(!b||b.disabled)return;
 const a=b.dataset.action;
 if(a==='sound'){sound=!sound;b.setAttribute('aria-pressed',String(sound));b.setAttribute('aria-label',sound?'كتم صوت النجوم':'تشغيل صوت النجوم');b.classList.toggle('off',!sound);b.innerHTML=`${sound?'صوت النجوم':'الصوت مغلق'} <span aria-hidden="true">${sound?'♫':'♩'}</span>`;if(sound)tune();return;}
 if(a==='letter'){if(!game.choose(Number(b.dataset.id)))return;message='';messageType='';render();return;}
 if(a==='remove'){game.selected.splice(Number(b.dataset.index),1);message='';messageType='';render();return;}
 if(a==='clear'){game.clear();message='';messageType='';render();return;}
 if(a==='hint'){game.hint();feedback('هذا حرف يساعدكِ. أكملي بقية الكلمة!','hint');render();return;}
 if(a==='check'){const right=game.check();if(right===null)return;if(right){feedback(praises[game.index],'good');tune();}else{feedback('محاولة جميلة! قارني حروفكِ بالكلمة، وجرّبي ترتيبًا آخر.','retry');}render();if(right)main.querySelector('[data-action="next"]').focus({preventScroll:true});return;}
 if(a==='next'){if(!game.next())return;message='';messageType='';render();focusMain();if(game.status==='finished'){tune();}return;}
 if(a==='restart'){game=new WordGame();message='';messageType='';render();focusMain();}
});
render();
