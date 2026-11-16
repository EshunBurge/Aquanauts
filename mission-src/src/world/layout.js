// Master layout in metres. X = east, Z = south. Both map and physical world use this data.
export const HUB={id:'hub',name:'Central Hub',position:[0,0],size:18,color:'#8ce1d2'};
export const FACILITIES=[
 {id:'bloop',name:'Bloop',title:'Life Support Laboratory',short:'Life support',position:[-34,-34],color:'#86e2d4',icon:'◉',implemented:true,doors:['east','south']},
 {id:'moss',name:'Moss',title:'Energy Station',short:'Energy systems',position:[0,-34],color:'#f5c870',icon:'ϟ',implemented:true,doors:['west','east']},
 {id:'nori',name:'Nori',title:'Greenhouse',short:'Food & agriculture',position:[34,-34],color:'#add780',icon:'♧',implemented:true,doors:['west','south']},
 {id:'luma',name:'Luma',title:'Lunar Environment Observatory',short:'Space hazards',position:[34,0],color:'#bca4ee',icon:'✦',implemented:true,doors:['north','south']},
 {id:'pip',name:'Pip',title:'Engineering Workshop',short:'Engineering',position:[34,34],color:'#ff9c7f',icon:'⚒',implemented:true,doors:['north','west']},
 {id:'skim',name:'Skim',title:'Resource Recovery Center',short:'Sustainability',position:[0,34],color:'#87cfd9',icon:'♻',implemented:true,doors:['east','west']},
 {id:'pebble',name:'Pebble',title:'Mission Planning Center',short:'Mission planning',position:[-34,34],color:'#d4b0d7',icon:'◇',implemented:true,doors:['east','north']},
 {id:'tank',name:'Tank',title:'Integrated Mission Center',short:'Final mission',position:[-34,0],color:'#f2a866',icon:'⬡',implemented:true,doors:['north','south','east']},
].map((f,i)=>({...f,order:i+1,size:16}));
export const ENTRY_ROUTE=[[0,-4],[0,-17],[-34,-17],[-34,-34]];
export const TUNNELS=[
 {id:'entry-north',a:[0,0],b:[0,-17]},
 {id:'entry-west',a:[0,-17],b:[-34,-17]},
 ...FACILITIES.map((f,i)=>({id:`ring-${i}`,a:f.position,b:FACILITIES[(i+1)%8].position})),
 {id:'return',a:[-34,0],b:[0,0]},
];
export const ROOM_HALF=8,TUNNEL_HALF=2.3;
export const allRooms=()=>[HUB,...FACILITIES];
export function nextStudy(progress){return FACILITIES.find(f=>!progress.completed.includes(f.id))??null;}
export function unlocked(id,progress){if(progress.teacherMode)return true;const i=FACILITIES.findIndex(f=>f.id===id);return i<0||FACILITIES.slice(0,i).every(f=>progress.completed.includes(f.id));}
export function roomAt(p){return allRooms().find(f=>Math.abs(p[0]-f.position[0])<=f.size/2&&Math.abs(p[1]-f.position[1])<=f.size/2)??null;}
export function insideTunnel(p,t,margin=.3){const dx=t.b[0]-t.a[0],dz=t.b[1]-t.a[1],len=dx*dx+dz*dz;const u=Math.max(0,Math.min(1,((p[0]-t.a[0])*dx+(p[1]-t.a[1])*dz)/len));return Math.hypot(p[0]-t.a[0]-u*dx,p[1]-t.a[1]-u*dz)<=TUNNEL_HALF-margin;}
export function walkable(p,progress){const r=roomAt(p);if(r&&!unlocked(r.id,progress))return false;if(r&&Math.abs(p[0]-r.position[0])<=r.size/2-.35&&Math.abs(p[1]-r.position[1])<=r.size/2-.35)return true;return TUNNELS.some(t=>insideTunnel(p,t));}
export function routeToNext(progress){const next=nextStudy(progress);if(!next)return[];if(next.id==='bloop')return ENTRY_ROUTE;const index=FACILITIES.indexOf(next);return [FACILITIES[index-1].position,next.position];}
export function routeFromHub(id){if(id==='hub')return[[0,-4]];const index=FACILITIES.findIndex(f=>f.id===id);return [...ENTRY_ROUTE,...FACILITIES.slice(1,index+1).map(f=>f.position)];}
export const WORLD_SPEC_VERSION=1;
