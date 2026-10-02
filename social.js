(() => {
'use strict';
const data=window.PartySocial,dialog=document.querySelector('#socialDialog'),body=document.querySelector('#socialBody');
let current=null,privateMode=false,category='全部',bag=[],drawn=0,timer=null,remaining=0,deadline=0,pressTimer=null,startPoint=null,returnFocus=null;
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e};
function button(text,action,cls=''){const b=el('button',text,cls);b.type='button';b.onclick=action;return b}
function stopTimer(){if(timer)clearInterval(timer);timer=null}
function clearView(){stopTimer();cancelPress();body.replaceChildren()}
function show(){if(!dialog.open){returnFocus=document.activeElement;dialog.showModal()}}
function close(){stopTimer();cancelPress();privateMode=false;current=null;dialog.classList.remove('intimate');dialog.close();body.replaceChildren();if(returnFocus&&returnFocus.isConnected)returnFocus.focus()}
document.querySelector('#socialClose').onclick=close;
dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
function menu(adult=false){privateMode=adult;current=null;clearView();dialog.classList.toggle('intimate',adult);document.querySelector('#socialLabel').textContent=adult?'隐藏彩蛋 · 成人互动':'聚会小游戏';const heading=el('h2',adult?'心跳加一档':'社交小游戏');if(!adult)bindEgg(heading);body.append(heading,el('p',adult?'双方自愿再开始，任何人可随时跳过。':'选一个，直接开玩。一部手机就够。','social-intro'));const grid=el('div','','social-grid');(adult?data.intimate:data.games).forEach(g=>{const b=button('',()=>g.id==='taboo'?playTaboo(g):g.id==='garden'?playGarden(g):play(g),'social-tile');b.append(el('small',g.tag),el('strong',g.name),el('span',g.desc));grid.append(b)});body.append(grid);if(!adult){const p=el('p','逛三园默认使用已核对的UP主帖子题目，可切换扩展题库；其他模块为另行整理。','social-source');const link=el('a','查看作者原帖');link.href=data.source.url;link.target='_blank';link.rel='noopener';p.append(' ',link);body.append(p)}}
document.querySelector('#openSocial').onclick=()=>{menu(false);show()};
function adultGate(){clearView();privateMode=false;dialog.classList.add('intimate');document.querySelector('#socialLabel').textContent='你发现了彩蛋';body.append(el('h2','成人亲密互动'),el('p','纸巾接力、饼干挑战、心动指令……','social-intro'));const box=el('div','','social-consent'),label=el('label'),check=el('input');check.type='checkbox';label.append(check,el('span','参与者均已成年，并自愿参与。任何人都可以跳过、换搭档或停止，无需接受惩罚。'));box.append(label);const enter=button('进入彩蛋',()=>{if(check.checked)menu(true)},'primary');enter.disabled=true;check.onchange=()=>enter.disabled=!check.checked;body.append(box,enter,button('返回游戏列表',()=>menu(false),'subtle'));show()}
function shuffled(values){const out=[...values];for(let i=out.length-1;i>0;i--){const a=new Uint32Array(1);crypto.getRandomValues(a);const j=Math.floor(a[0]/4294967296*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function pool(){return current.categories?(category==='全部'?Object.values(current.categories).flat():current.categories[category]):current.cards}
function resetBag(){bag=shuffled(pool());drawn=0}
function playGarden(game){
 current={...game};category='全部';clearView();
 body.append(button('返回游戏列表',()=>menu(false),'subtle'),el('h2',game.name),el('p',game.rules,'social-rules'));
 const library=el('select'),topics=el('select'),info=el('p','','social-source');
 library.setAttribute('aria-label','逛三园题库');topics.setAttribute('aria-label','逛三园题目分类');
 [['posts','UP主帖子 · 78题'],['extra','扩展题库 · 72题']].forEach(([value,label])=>{const o=el('option',label);o.value=value;library.append(o)});library.value='posts';
 function field(label,input){const row=el('div','','social-controls');row.append(el('label',label),input);body.append(row)}
 field('选择题库',library);field('题目分类',topics);body.append(info,el('div','','prompt-card'),el('p','','social-meta'),el('p','','prompt-source social-source'));
 const duration=el('select');duration.dataset.duration='';duration.setAttribute('aria-label','每人时间');[3,5,10,15,20,30,60].forEach(n=>{const o=el('option',n+' 秒');o.value=n;duration.append(o)});duration.value=3;duration.onchange=resetTimer;field('每人时间',duration);
 const timerBox=el('div','','social-timer'),start=button('开始计时',startTimer);start.dataset.timerStart='';timerBox.append(el('span','','social-time'),start);body.append(timerBox);
 const actions=el('div','','social-buttons');actions.append(button('换一道题',draw,'primary'),button('下一位 · 重新计时',()=>{resetTimer();startTimer()}));body.append(actions);
 function switchLibrary(){
  const fromPosts=library.value==='posts';current={...game,categories:fromPosts?game.categories:game.extraCategories,postSources:fromPosts?game.postSources:null};category='全部';topics.replaceChildren();
  ['全部',...Object.keys(current.categories)].forEach(k=>{const o=el('option',k);o.value=k;topics.append(o)});topics.value='全部';
  info.textContent=fromPosts?'按已核对图片的题意整理为简短题名，保留题目条件。②收录30题，③收录15题；基础篇可见18题、校园篇可见15题。嘴硬借口类可以现编，同一个意思换说法也算重复。':'以下72题为另行编写的扩展题目，不是UP主原帖题目。';resetBag();draw();
 }
 library.onchange=switchLibrary;topics.onchange=()=>{category=topics.value;resetBag();draw()};switchLibrary();
}
function playTaboo(game){
 current=game;category='全部';clearView();
 body.append(button('返回游戏列表',()=>menu(false),'subtle'),el('h2',game.name),el('p',game.rules,'social-rules'));
 const row=el('div','','social-controls'),select=el('select');select.setAttribute('aria-label','禁令分类');
 ['全部',...Object.keys(game.categories)].forEach(k=>{const option=el('option',k);option.value=k;select.append(option)});
 row.append(el('label','抽卡范围'),select);body.append(row);
 const card=el('div','','prompt-card'),meta=el('p','','social-meta');
 let secret='',visible=false;
 const reveal=button('亮牌（请其他人点）',()=>{visible=!visible;card.textContent=visible?secret:'先将屏幕朝向其他人，再请别人点亮牌。';reveal.textContent=visible?'遮住卡片':'亮牌（请其他人点）'},'primary');
 function next(){if(!bag.length)resetBag();const value=bag.pop();drawn++;secret=(game.categories['经典动作'].includes(value)?'不能做：':'不能说：')+value;visible=false;card.textContent='先将屏幕朝向其他人，再请别人点亮牌。';reveal.textContent='亮牌（请其他人点）';meta.textContent=`本轮 ${drawn} / ${pool().length} · 抽完前不重复`}
 select.onchange=()=>{category=select.value;resetBag();next()};
 const actions=el('div','','social-buttons');actions.append(reveal,button('换一张（先遮牌）',next));
 body.append(card,meta,actions,el('p','持牌人别偷看；其他人不要把牌上的内容读出来。','fine'));resetBag();next();
}
function updateTimerDisplay(){const num=body.querySelector('.social-time');if(num)num.textContent=remaining>0?remaining+' 秒':'时间到';const btn=body.querySelector('[data-timer-start]');if(btn)btn.textContent=timer?'暂停计时':remaining>0?'开始计时':'重新计时'}
function timerSeconds(){const select=body.querySelector('[data-duration]');return select?Number(select.value):current.seconds}
function resetTimer(){stopTimer();remaining=timerSeconds();updateTimerDisplay()}
function startTimer(){if(timer){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));stopTimer();updateTimerDisplay();return}if(remaining<=0)remaining=timerSeconds();deadline=Date.now()+remaining*1000;timer=setInterval(()=>{remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));if(remaining===0){stopTimer();if(navigator.vibrate)navigator.vibrate(120)}updateTimerDisplay()},100);updateTimerDisplay()}
function draw(){resetTimer();if(!bag.length)resetBag();const text=bag.pop();drawn++;body.querySelector('.prompt-card').textContent=text;body.querySelector('.social-meta').textContent=`本轮 ${drawn} / ${pool().length} · 抽完前不重复`;const attribution=body.querySelector('.prompt-source');if(attribution){attribution.replaceChildren();const key=Object.keys(current.categories).find(k=>current.categories[k].includes(text));const src=current.postSources&&current.postSources[key];if(src){attribution.append(el('span',src.label+' · '));const link=el('a',src.url.includes('/explore/')?'查看原帖':'查看作者主页');link.href=src.url;link.target='_blank';link.rel='noopener';attribution.append(link)}else attribution.textContent='来源：另行编写的扩展题库'}}
function play(game){current=game;category='全部';clearView();body.append(button('返回游戏列表',()=>menu(privateMode),'subtle'),el('h2',game.name),el('p',game.rules,'social-rules'));if(game.categories){const row=el('div','','social-controls'),select=el('select');select.setAttribute('aria-label','逛三园题目分类');['全部',...Object.keys(game.categories)].forEach(k=>{const o=el('option',k);o.value=k;select.append(o)});select.onchange=()=>{category=select.value;resetBag();draw()};row.append(el('label','题目分类'),select);body.append(row)}body.append(el('div','','prompt-card'),el('p','','social-meta'));if(game.seconds){const row=el('div','','social-controls'),select=el('select');select.dataset.duration='';select.setAttribute('aria-label','每轮计时');const choices=[...new Set([3,5,10,15,20,30,60,game.seconds])].sort((a,b)=>a-b);choices.forEach(n=>{const o=el('option',n+' 秒');o.value=n;select.append(o)});select.value=game.seconds;select.onchange=resetTimer;row.append(el('label',game.id==='garden'?'每人时间':'计时时长'),select);body.append(row);const timerBox=el('div','','social-timer'),start=button('开始计时',startTimer);start.dataset.timerStart='';timerBox.append(el('span','','social-time'),start);body.append(timerBox)}const actions=el('div','','social-buttons');actions.append(button(privateMode?'换一张 / 跳过':'换一道题',draw,'primary'));if(game.seconds)actions.append(button(game.id==='garden'?'下一位 · 重新计时':'重置计时',()=>{resetTimer();if(game.id==='garden')startTimer()}));body.append(actions);if(privateMode)body.append(el('p','任意一方不想继续，就跳过或退出。不强制身体接触。','fine'));resetBag();draw()}
let title=null;
function cancelPress(){if(pressTimer)clearTimeout(pressTimer);pressTimer=null;startPoint=null;if(title)title.classList.remove('holding')}
function beginPress(){if(pressTimer||!dialog.open||privateMode||current)return;title.classList.add('holding');pressTimer=setTimeout(()=>{cancelPress();adultGate()},3000)}
function bindEgg(heading){title=heading;title.classList.add('egg-title');title.tabIndex=0;
title.addEventListener('pointerdown',e=>{if(e.button!==0)return;startPoint={x:e.clientX,y:e.clientY};beginPress()});
title.addEventListener('pointermove',e=>{if(startPoint&&Math.hypot(e.clientX-startPoint.x,e.clientY-startPoint.y)>14)cancelPress()});
['pointerup','pointercancel','pointerleave','blur'].forEach(name=>title.addEventListener(name,cancelPress));
title.addEventListener('contextmenu',e=>e.preventDefault());
title.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!e.repeat)beginPress()}});
title.addEventListener('keyup',cancelPress);
}
document.addEventListener('visibilitychange',()=>{cancelPress();if(document.hidden&&timer){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));stopTimer();updateTimerDisplay()}});
})();
