'use strict';
const SQ=Math.sqrt(3), C=[-SQ,0], er=[SQ/2,.5], et=[-.5,SQ/2];
function state(mode,t){
 if(mode<2){const w=mode===0?1:3,a=-Math.PI/6+w*t;return {x:C[0]+2*Math.cos(a),y:2*Math.sin(a),vx:-2*w*Math.sin(a),vy:2*w*Math.cos(a)};}
 const n=SQ/2,M=n*t;let E=M;for(let i=0;i<12;i++)E-=(E-.5*Math.sin(E)-M)/(1-.5*Math.cos(E));
 const u=4*(Math.cos(E)-.5),v=2*SQ*Math.sin(E),d=n/(1-.5*Math.cos(E));
 return {x:C[0]+u*er[0]+v*et[0],y:u*er[1]+v*et[1],vx:d*(-4*Math.sin(E)*er[0]+2*SQ*Math.cos(E)*et[0]),vy:d*(-4*Math.sin(E)*er[1]+2*SQ*Math.cos(E)*et[1])};
}
const totals=[Math.PI/3,Math.PI/9,2*Math.PI/SQ];
if(typeof module!=='undefined')module.exports={state,totals};
if(typeof document!=='undefined'){
const $=id=>document.getElementById(id),canvas=$('orbit'),ctx=canvas.getContext('2d');let mode=0,t=0,playing=false,last=0;
function stop(){playing=false;$('play').textContent='▶ 播放';}
function draw(){
 const W=900,H=640;canvas.width=W;canvas.height=H;const wide=mode===2,s=wide?77:140,ox=wide?700:510,oy=wide?230:320;
 const p=(x,y)=>[ox+x*s,oy-y*s];
 function line(a,b,color,width=2,dash=[]){ctx.beginPath();ctx.setLineDash(dash);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();ctx.setLineDash([]);}
 function label(text,x,y,color='#dce8ff',size=19){ctx.fillStyle=color;ctx.font=`${size}px system-ui`;ctx.fillText(text,x,y);}
 function dot(x,y,color,r=5){ctx.beginPath();ctx.arc(...p(x,y),r,0,7);ctx.fillStyle=color;ctx.fill();}
 function arrow(x,y,dx,dy,color,name){const a=p(x,y),b=[a[0]+dx,a[1]-dy];line(a,b,color,4);const z=Math.atan2(b[1]-a[1],b[0]-a[0]);line(b,[b[0]-11*Math.cos(z-.45),b[1]-11*Math.sin(z-.45)],color,3);line(b,[b[0]-11*Math.cos(z+.45),b[1]-11*Math.sin(z+.45)],color,3);label(name,b[0]+8,b[1]-8,color,20);}
 ctx.fillStyle='#142448';ctx.fillRect(0,0,W,H);ctx.fillStyle='#1c365d';ctx.fillRect(ox,0,W-ox,H);
 for(let x=ox+35;x<W-10;x+=48)for(let y=45;y<H;y+=48){line([x-4,y-4],[x+4,y+4],'#446187');line([x-4,y+4],[x+4,y-4],'#446187');}
 line([20,oy],[W-20,oy],'#7187a8',1);line([ox,H-25],[ox,24],'#b5c7e2',1.5);label('x',W-25,oy-10);label('y',ox-22,30);label('O',ox+10,oy+23);label('B ⊗',W-110,30,'#b2caff');label(wide?'仅电场：N → A':'磁场内：M → N',25,35,'#91ebd6',23);
 if(mode!==0){dot(...C,'#ff9bc8',10);label('−48q',p(...C)[0]-33,p(...C)[1]+35,'#ff9bc8');}else dot(...C,'#dce8ff');label('C',p(...C)[0]-10,p(...C)[1]-18);
 function trace(m,end,color,dashed){ctx.beginPath();ctx.setLineDash(dashed?[6,8]:[]);ctx.lineWidth=dashed?2:4;ctx.strokeStyle=color;for(let i=0;i<=220;i++){const o=state(m,end*i/220);const xy=p(o.x,o.y);i?ctx.lineTo(...xy):ctx.moveTo(...xy);}ctx.stroke();ctx.setLineDash([]);}
 trace(mode,totals[mode],'#536d8c',true);if(wide)trace(1,totals[1],'#91ebd680',true);trace(mode,t,'#91ebd6',false);
 dot(0,-1,'#dce8ff');dot(0,1,'#dce8ff');label('M (0, −y₀)',ox+12,oy+s+24);label('N (0, y₀)',ox+12,oy-s-10);
 if(wide){dot(-4*SQ,-3,'#dce8ff');label('A · 首次反向',p(-4*SQ,-3)[0]-30,p(-4*SQ,-3)[1]+30);line(p(...C),p(-4*SQ,-3),'#516580',1,[4,6]);}
 const o=state(mode,t),r=Math.hypot(o.x-C[0],o.y),v=Math.hypot(o.vx,o.vy);line(p(...C),p(o.x,o.y),'#7286a7',1,[5,6]);dot(o.x,o.y,'#91ebd6',10);label('+q',p(o.x,o.y)[0]+12,p(o.x,o.y)[1]+24,'#91ebd6');
 if($('arrows').checked){arrow(o.x,o.y,o.vx*18,o.vy*18,'#ffc282','v');if(mode<2)arrow(o.x,o.y,-o.vy*12,o.vx*12,'#8faaff','Fᴮ');if(mode>0){const f=mode===2?19:8;arrow(o.x,o.y,-48*(o.x-C[0])/r**3*f,-48*o.y/r**3*f,'#ff9bc8','Fᴱ');}if(wide)arrow(0,1,-.5*65,SQ/2*65,'#a69370','vᴺ');}
 $('seek').value=1000*t/totals[mode];$('clock').textContent=`时间 t = ${t.toFixed(3)} τ / ${totals[mode].toFixed(3)} τ`;
 $('distance').textContent=r.toFixed(2)+' y₀';$('velocity').textContent=v.toFixed(2)+' v*';$('duration').textContent=['πm / (3qB)','πBy₀³ / (9kq)','2√3πBy₀³ / (3kq)'][mode];
 $('phase').textContent=t>=totals[mode]-1e-9?(wide?'A · 速度首次反向':'N · 到达边界'):['磁场力提供向心力','两种力共同指向 C','只受电场力，逐渐减速'][mode];
 $('units').textContent=mode===0?'本段单位：τ = m/(qB)，v* = qBy₀/m。第一问不额外限定质量。':'本段按题设 m = B²y₀³/k：τ = By₀³/(kq)，v* = kq/(By₀²)。';
 $('hint').textContent=['观察：速度始终沿圆弧切线，磁场力始终与速度垂直并指向 C。M → N 只转过 60°，不是半圆。','观察：电场力与磁场力同向，粉色和蓝色箭头重叠在同一径向线上。圆弧保持不变，入射速率增至同质量下第一问的 3 倍。','观察：负电荷仍在 C，磁场只在 y 轴右侧。出场后粒子越走越慢、离 C 越来越远；到 A 时速率从 6v* 降为 2v*，方向与 N 点反向。'][mode];
}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=Number(b.dataset.mode);t=0;stop();document.querySelectorAll('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));draw();});
$('play').onclick=()=>{if(playing)stop();else{if(t>=totals[mode])t=0;playing=true;$('play').textContent='Ⅱ 暂停';last=performance.now();}draw();};$('reset').onclick=()=>{t=0;stop();draw();};$('end').onclick=()=>{t=totals[mode];stop();draw();};$('seek').oninput=()=>{t=Number($('seek').value)/1000*totals[mode];stop();draw();};$('arrows').onchange=draw;
function frame(now){if(playing){t=Math.min(totals[mode],t+Math.min((now-last)/1000,.1)*.18*Number($('speed').value));if(t>=totals[mode])stop();draw();}last=now;requestAnimationFrame(frame);}draw();requestAnimationFrame(frame);
}
