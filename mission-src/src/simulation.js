// All operating values are deliberately simplified educational assumptions.
export const NIGHT_SECONDS = 90;
export const initialState = (challenge = false) => ({
 elapsed:0, battery:challenge?17:22, capacity:24, air:96, water:88, temperature:21,
 backup:false, fan:true, heater:true, recycler:true, grow:true, research:true,
 shield:false, materials:3, exposure:0, food:72, researchPoints:0,
 challenge, visited:{}, startedNight:false, complete:false, assistance:0, changes:0,
});
export function power(s) {
 const generation=s.startedNight?0:Math.max(0,9-s.elapsed*.075);
 const demand=1+(s.fan?2:0)+(s.heater?2:0)+(s.recycler?1:0)+(s.grow?4:0)+(s.research?3:0);
 const supply=generation+(s.backup&&s.battery>0?14:0);
 return {generation,demand,supply,ratio:Math.min(1,supply/demand)};
}
export function step(state,dt) {
 const s={...state,visited:{...state.visited}};
 if(s.complete)return s;
 s.elapsed+=dt;
 const p=power(s),hours=dt*(s.startedNight?80:12)/3600;
 if(s.backup)s.battery=Math.max(0,Math.min(s.capacity,s.battery+(p.generation-p.demand)*hours));
 else s.battery=Math.min(s.capacity,s.battery+Math.max(0,p.generation-p.demand)*hours);
 s.air=Math.max(0,Math.min(100,s.air+(s.fan?(.16*p.ratio-.13):-.25)*dt));
 s.water=Math.max(0,Math.min(100,s.water+((s.recycler?.055*p.ratio:0)-.045)*dt));
 s.temperature+=((s.heater?.045*p.ratio:0)-.043)*dt;
 s.food=Math.max(0,Math.min(100,s.food+(s.grow?.02*p.ratio:-.01)*dt));
 s.researchPoints+=(s.research?.025*p.ratio:0)*dt;
 s.exposure+=(s.challenge?.05:.012)*(s.shield?.15:1)*dt;
 return s;
}
export function healthy(s) {return s.air>=85&&s.water>=65&&s.temperature>=18&&s.temperature<=25&&power(s).ratio>=.99;}
export function nightReady(s) {return s.backup&&healthy(s)&&s.battery>=power(s).demand*2+.5;}
