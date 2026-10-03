/* Mathematical models in baseline units. UI and tests use these same pure functions. */
(function(root){'use strict';
const S=Math.sqrt(3),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const defaults={projectile:{height:20,speed:10,gravity:10},kettle:{voltage:220,r1:44,r2:836},liaoning:{field:1,length:1,charge:48}};
function projectile(p,t){const duration=Math.sqrt(2*p.height/p.gravity);t=clamp(t,0,duration);return{duration,x:p.speed*t,y:Math.max(0,p.height-p.gravity*t*t/2),vx:p.speed,vy:-p.gravity*t,speed:Math.hypot(p.speed,p.gravity*t),range:p.speed*duration};}
function kettle(p,mode,on){const resistance=mode===0?p.r1:p.r1+p.r2,i=on?p.voltage/resistance:0;return{resistance,i,p1:i*i*p.r1,p2:mode===1?i*i*p.r2:0,p:p.voltage*i,u1:i*p.r1,u2:mode===1?i*p.r2:0};}
function orbitGeometry(p,mode){const y=p.length,b=p.field,L=p.charge,m=b*b*y*y*y,R=2*y,C=[-S*y,0],v=(mode===0?2:1+Math.sqrt(1+L/2))/(b*y*y),mu=L/m,e=2*y*v*v/mu-1,a=R/(1-e),minor=a*Math.sqrt(1-e*e),n=Math.sqrt(mu/(a*a*a)),duration=mode===2?Math.PI/n:Math.PI*R/(3*v);return{y,b,L,m,R,C,v,mu,e,a,minor,n,duration};}
function orbit(p,mode,t){const g=orbitGeometry(p,mode);t=clamp(t,0,g.duration);let x,y,vx,vy;
if(mode<2){const angle=-Math.PI/6+g.v/g.R*t;x=g.C[0]+g.R*Math.cos(angle);y=g.R*Math.sin(angle);vx=-g.v*Math.sin(angle);vy=g.v*Math.cos(angle);}
else{const M=g.n*t;let E=M;for(let i=0;i<15;i++)E-=(E-g.e*Math.sin(E)-M)/(1-g.e*Math.cos(E));const u=g.a*(Math.cos(E)-g.e),v=g.minor*Math.sin(E),d=g.n/(1-g.e*Math.cos(E));x=g.C[0]+u*S/2-v/2;y=u/2+v*S/2;vx=d*(-g.a*Math.sin(E)*S/2-g.minor*Math.cos(E)/2);vy=d*(-g.a*Math.sin(E)/2+g.minor*Math.cos(E)*S/2);}
const r=Math.hypot(x-g.C[0],y);return{...g,x,y,vx,vy,r,speed:Math.hypot(vx,vy),ae:mode===0?[0,0]:[-g.mu*(x-g.C[0])/r**3,-g.mu*y/r**3],ab:mode===2?[0,0]:[-g.b/g.m*vy,g.b/g.m*vx]};}
const api={defaults,projectile,kettle,orbit,orbitGeometry};if(typeof module!=='undefined')module.exports=api;else root.PhysicsModels=api;
})(typeof window!=='undefined'?window:globalThis);
