const $=s=>document.querySelector(s),cv=$('#chart'),x=cv.getContext('2d');
let W,H,C=[],p=4030,tk=0,pos=[],bal=5291.14,lot=.05,id=0;const SP=.24;
function size(){const d=devicePixelRatio||1,r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0)}
addEventListener('resize',size);size();
const mk=o=>{const c=o+(Math.random()-.5)*4;return{o,c,h:Math.max(o,c)+Math.random()*1.4,l:Math.min(o,c)-Math.random()*1.4}};
for(let i=0;i<70;i++){const k=mk(p);C.push(k);p=k.c}
const mid=()=>C[C.length-1].c;
function step(){const k=C[C.length-1];k.c+=(Math.random()-.5)*1.7+(4030-k.c)*.004;k.h=Math.max(k.h,k.c);k.l=Math.min(k.l,k.c);if(++tk%9==0){C.push(mk(k.c));C.shift()}ui()}
const pl=t=>t.s=='b'?(mid()-t.e)*t.l*100:(t.e-(mid()+SP))*t.l*100;
const f=(n,d=2)=>n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
function ui(){$('#ps').textContent=f(mid(),3);$('#pb').textContent=f(mid()+SP,3);let o=0;pos.forEach(t=>{const v=pl(t);o+=v;const e=$('#pl'+t.id);if(e){e.textContent=(v>=0?'+ ':'- ')+f(Math.abs(v))+' USD';e.className=v>=0?'up':'dn'}});const q=$('#eqv');q.textContent=f(bal+o);q.className=o>=0?'up':'dn'}
function draw(){x.clearRect(0,0,W,H);const pw=62,cw=W-pw;let mn=4004,mx=4056;C.forEach(k=>{mn=Math.min(mn,k.l);mx=Math.max(mx,k.h)});pos.forEach(t=>{mn=Math.min(mn,t.e);mx=Math.max(mx,t.e)});const pd=(mx-mn)*.08;mn-=pd;mx+=pd;const y=v=>H-(v-mn)/(mx-mn)*H;
x.font='11px Manrope,sans-serif';x.lineWidth=1;
for(let i=0;i<=6;i++){const v=mn+(mx-mn)*i/6,yy=y(v);x.strokeStyle='rgba(255,255,255,.05)';x.beginPath();x.moveTo(0,yy);x.lineTo(cw,yy);x.stroke();x.fillStyle='#8a96ae';x.fillText(f(v,1),cw+8,yy+4)}
x.fillStyle='rgba(20,184,122,.2)';x.fillRect(0,y(4054),cw,y(4048)-y(4054));x.fillStyle='rgba(239,68,68,.18)';x.fillRect(0,y(4014),cw,y(4008)-y(4014));
const sp=cw/C.length;C.forEach((k,i)=>{const cx=i*sp+sp/2,u=k.c>=k.o;x.strokeStyle=x.fillStyle=u?'#2f8cff':'#ef4444';x.beginPath();x.moveTo(cx,y(k.h));x.lineTo(cx,y(k.l));x.stroke();const t=y(Math.max(k.o,k.c)),h=Math.max(1.5,Math.abs(y(k.o)-y(k.c)));x.fillRect(cx-sp*.3,t,sp*.6,h)});
const m=mid(),ym=y(m);x.setLineDash([2,3]);x.strokeStyle='#2f8cff';x.beginPath();x.moveTo(0,ym);x.lineTo(cw,ym);x.stroke();x.setLineDash([]);x.fillStyle='#2f8cff';x.fillRect(cw,ym-9,pw,18);x.fillStyle='#fff';x.fillText(f(m,3),cw+4,ym+4);
pos.forEach(t=>{const v=pl(t),ye=y(t.e),col=v>=0?'#14b87a':'#f59e0b';const cur=t.s=='b'?m:m+SP;x.fillStyle=v>=0?'rgba(20,184,122,.22)':'rgba(239,68,68,.22)';x.fillRect(cw*.5,Math.min(ye,y(cur)),cw*.3,Math.abs(ye-y(cur)));x.strokeStyle=col;x.beginPath();x.moveTo(0,ye);x.lineTo(cw,ye);x.stroke();const tx=f(t.l)+'   '+(v>=0?'+ ':'- ')+f(Math.abs(v))+' USD';x.font='700 12px Manrope,sans-serif';const w=x.measureText(tx).width+20;x.fillStyle='#101828';x.fillRect(10,ye-13,w,26);x.strokeRect(10,ye-13,w,26);x.fillStyle=col;x.fillText(tx,20,ye+4);x.font='11px Manrope,sans-serif'});
requestAnimationFrame(draw)}
setInterval(step,130);draw();
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('on'),2200)}
function open(s){const e=s=='b'?mid()+SP:mid();const t={id:++id,s,e,l:lot};pos.push(t);const d=document.createElement('div');d.className='pos';d.id='r'+t.id;d.innerHTML=`<span class="s" style="background:${s=='b'?'#2f8cff':'#ef4444'}">${s=='b'?'Buy':'Sell'} ${f(lot)}</span><span>@ ${f(e,3)}</span><span id="pl${t.id}">0.00 USD</span><button class="x" aria-label="Close trade" data-i="${t.id}">✕</button>`;$('#plist').append(d);toast((s=='b'?'Buy':'Sell')+' opened at '+f(e,3))}
$('#bb').onclick=()=>open('b');$('#bs').onclick=()=>open('s');
$('#plist').onclick=e=>{const b=e.target.closest('.x');if(!b)return;const i=+b.dataset.i,t=pos.find(z=>z.id==i),v=pl(t);bal+=v;pos=pos.filter(z=>z.id!=i);$('#r'+i).remove();toast('Closed '+(v>=0?'+':'-')+f(Math.abs(v))+' USD')};
$('#lots').onclick=e=>{if(e.target.tagName!='BUTTON')return;lot=+e.target.textContent;[...$('#lots').children].forEach(b=>b.classList.toggle('on',b==e.target))};
$('#mq').innerHTML=Array(2).fill(['XAU/USD','Liquidity sweep','FVG and support','Supply and demand','1m','5m','15m','1h','4h','Risk first'].map(s=>'<span>'+s+'</span>').join('<span>◆</span>')+'<span>◆</span>').join('');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');e.target.querySelectorAll('[data-to]').forEach(n=>{const T=+n.dataset.to,d=+n.dataset.d,t0=performance.now();(function s(t){const k=Math.min(1,(t-t0)/1400);n.textContent=(T*(1-Math.pow(1-k,3))).toFixed(d);if(k<1)requestAnimationFrame(s)})(t0)});io.unobserve(e.target)}),{threshold:.2});
document.querySelectorAll('.rv,.eq').forEach(e=>io.observe(e));
document.querySelectorAll('.eq circle').forEach(c=>c.onmouseenter=c.onclick=()=>$('#tip').textContent=c.dataset.t);
document.querySelectorAll('.card').forEach(c=>c.onpointermove=e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')});
document.querySelectorAll('.shot').forEach(b=>b.onclick=()=>{$('#lb img').src=b.querySelector('img').src;$('#lb').classList.add('on')});
$('#lb').onclick=()=>$('#lb').classList.remove('on');addEventListener('keydown',e=>e.key=='Escape'&&$('#lb').classList.remove('on'));
function calc(){const b=+$('#cb').value,r=+$('#cr').value,s=+$('#cs').value,rk=b*r/100;$('#vb').textContent=f(b,0)+' USD';$('#vr').textContent=r+' %';$('#vs').textContent=s+' USD';$('#lot').textContent=f(Math.max(.01,Math.floor(rk/(s*100)*100)/100));$('#rk').textContent='You risk '+f(rk,0)+' USD on this trade.'}
['cb','cr','cs'].forEach(i=>$('#'+i).oninput=calc);calc();
