// Bloop's training plant: deliberately simplified educational relationships.
// Percentages below describe reserves/cleanliness, not oxygen concentration in air.
export const createPlant=()=>({air:76,co2:1.4,water:58,temperature:17.5,battery:24,parts:3,filter:35,
 fan:1,recycle:0,heater:1,leak:true,repaired:false,elapsed:0,assistance:0,session:null,lastResult:null});
export const plantPower=s=>({demand:1+[0,2,4][s.fan]+[0,1,3][s.recycle]+[0,2,4][s.heater],supply:s.supplyOverride??(s.battery>0?9:1)});
export function tickPlant(original,dt){const s={...original};const p=plantPower(s),ratio=Math.min(1,p.supply/p.demand);s.elapsed+=dt;s.battery=Math.max(0,s.battery-p.demand*dt/900);
 const filterFactor=s.filter/100;s.air=Math.max(0,Math.min(100,s.air+([0,.65,1.15][s.fan]*ratio*filterFactor-.12)*dt));s.co2=Math.max(.15,Math.min(4,s.co2+(.013-[0,.025,.045][s.fan]*ratio*filterFactor)*dt));
 s.filter=Math.max(5,s.filter-[0,.012,.027][s.fan]*dt);
 s.water=Math.max(0,Math.min(100,s.water+([0,.21,.4][s.recycle]*ratio-.08-(s.leak?.15:0))*dt));
 s.temperature+=( [0,.035,.085][s.heater]*ratio-.03)*dt;
 if(s.session){const session={...s.session,seconds:s.session.seconds+dt,energy:s.session.energy+p.demand*dt/900};
 const safe=s.air>=84&&s.co2<=1&&s.water>=56&&s.temperature>=18&&s.temperature<=24&&p.demand<=9;
 session.stable=safe?session.stable+dt:0;s.session=session;
 if(session.seconds>=24){s.lastResult={...session,passed:session.stable>=10,air:s.air,water:s.water,temp:s.temperature};s.session=null;}}
 return s;}
export function airPass(s){return s.filter>=90&&s.fan>0;}
export function waterPass(s){return !s.leak&&s.recycle>0;}
export function climateReady(s){return s.fan>0&&s.recycle>0&&s.heater>0&&plantPower(s).demand<=9;}
export function replaceFilter(s){if(s.parts<1||s.filter>=90)return s;return{...s,filter:100,parts:s.parts-1};}
export function repairLeak(s){if(s.parts<1||!s.leak)return s;return{...s,leak:false,repaired:true,parts:s.parts-1};}
export function resetTrial(s){return{...s,air:84,co2:1,water:60,temperature:18.2,lastResult:null,session:{seconds:0,stable:0,energy:0}};}
