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
function menu(adult=false){privateMode=adult;current=null;clearView();dialog.classList.toggle('intimate',adult);document.querySelector('#socialLabel').textContent=adult?'隐藏彩蛋 · 成人互动':'聚会小游戏';const heading=el('h2',adult?'心跳加一档':'社交小游戏');if(!adult)bindEgg(heading);body.append(heading,el('p',adult?'双方自愿再开始，任何人可随时跳过。':'选一个，直接开玩。一部手机就够。','social-intro'));const grid=el('div','','social-grid');(adult?data.intimate:data.games).forEach(g=>{const b=button('',()=>play(g),'social-tile');b.append(el('small',g.tag),el('strong',g.name),el('span',g.desc));grid.append(b)});body.append(grid);if(!adult){const p=el('p','逛三园题目按常见玩法独立编写，主题方向参考「就喜欢社交」的相关帖子。','social-source');const link=el('a','查看作者原帖');link.href=data.source.url;link.target='_blank';link.rel='noopener';p.append(' ',link);body.append(p)}}
document.querySelector('#openSocial').onclick=()=>{menu(false);show()};
function adultGate(){clearView();privateMode=false;dialog.classList.add('intimate');document.querySelector('#socialLabel').textContent='你发现了彩蛋';body.append(el('h2','成人亲密互动'),el('p','纸巾接力、饼干挑战、心动指令……','social-intro'));const box=el('div','','social-consent'),label=el('label'),check=el('input');check.type='checkbox';label.append(check,el('span','参与者均已成年，并自愿参与。任何人都可以跳过、换搭档或停止，无需接受惩罚。'));box.append(label);const enter=button('进入彩蛋',()=>{if(check.checked)menu(true)},'primary');enter.disabled=true;check.onchange=()=>enter.disabled=!check.checked;body.append(box,enter,button('返回游戏列表',()=>menu(false),'subtle'));show()}
function shuffled(values){const out=[...values];for(let i=out.length-1;i>0;i--){const a=new Uint32Array(1);crypto.getRandomValues(a);const j=Math.floor(a[0]/4294967296*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function pool(){return current.categories?(category==='全部'?Object.values(current.categories).flat():current.categories[category]):current.cards}
function resetBag(){bag=shuffled(pool());drawn=0}
function updateTimerDisplay(){const num=body.querySelector('.social-time');if(num)num.textContent=remaining>0?remaining+' 秒':'时间到';const btn=body.querySelector('[data-timer-start]');if(btn)btn.textContent=timer?'暂停计时':remaining>0?'开始计时':'重新计时'}
function timerSeconds(){const select=body.querySelector('[data-duration]');return select?Number(select.value):current.seconds}
function resetTimer(){stopTimer();remaining=timerSeconds();updateTimerDisplay()}
function startTimer(){if(timer){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));stopTimer();updateTimerDisplay();return}if(remaining<=0)remaining=timerSeconds();deadline=Date.now()+remaining*1000;timer=setInterval(()=>{remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));if(remaining===0){stopTimer();if(navigator.vibrate)navigator.vibrate(120)}updateTimerDisplay()},100);updateTimerDisplay()}
function draw(){resetTimer();if(!bag.length)resetBag();const text=bag.pop();drawn++;body.querySelector('.prompt-card').textContent=text;body.querySelector('.social-meta').textContent=`本轮 ${drawn} / ${pool().length} · 抽完前不重复`;}
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

