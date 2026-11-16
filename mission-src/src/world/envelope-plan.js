import {HUB,FACILITIES,TUNNELS,TUNNEL_HALF} from './layout.js';
export const ROOM_HEIGHT=4.55,TUNNEL_HEIGHT=3.55;
export const ROOMS=[{...HUB,doors:['north','west']},...FACILITIES];
export function footprintRegions(){return [
 ...ROOMS.map(f=>({kind:'room',id:f.id,color:f.color,height:ROOM_HEIGHT,minX:f.position[0]-f.size/2,maxX:f.position[0]+f.size/2,minZ:f.position[1]-f.size/2,maxZ:f.position[1]+f.size/2})),
 ...TUNNELS.map(t=>({kind:'tunnel',id:t.id,color:'#99bec9',height:TUNNEL_HEIGHT,minX:Math.min(t.a[0],t.b[0])-TUNNEL_HALF,maxX:Math.max(t.a[0],t.b[0])+TUNNEL_HALF,minZ:Math.min(t.a[1],t.b[1])-TUNNEL_HALF,maxZ:Math.max(t.a[1],t.b[1])+TUNNEL_HALF}))
 ];}
export const inRegion=(p,r)=>p[0]>=r.minX-1e-6&&p[0]<=r.maxX+1e-6&&p[1]>=r.minZ-1e-6&&p[1]<=r.maxZ+1e-6;
export function buildEnvelopePlan(){const regions=footprintRegions(),xs=[...new Set(regions.flatMap(r=>[r.minX,r.maxX]))].sort((a,b)=>a-b),zs=[...new Set(regions.flatMap(r=>[r.minZ,r.maxZ]))].sort((a,b)=>a-b),cells=[],grid=new Map();
 for(let ix=0;ix<xs.length-1;ix++)for(let iz=0;iz<zs.length-1;iz++){const x=(xs[ix]+xs[ix+1])/2,z=(zs[iz]+zs[iz+1])/2;const region=regions.find(r=>inRegion([x,z],r));if(!region)continue;const cell={ix,iz,x,z,minX:xs[ix],maxX:xs[ix+1],minZ:zs[iz],maxZ:zs[iz+1],height:region.height,room:region.kind==='room'?region.id:null,color:region.color};cells.push(cell);grid.set(`${ix},${iz}`,cell);}
 const raw=[];for(const c of cells)for(const [dx,dz,side] of [[-1,0,'west'],[1,0,'east'],[0,-1,'north'],[0,1,'south']]){const other=grid.get(`${c.ix+dx},${c.iz+dz}`);if(other&&other.height>=c.height)continue;raw.push({axis:dx?'z':'x',fixed:dx?(dx<0?c.minX:c.maxX):(dz<0?c.minZ:c.maxZ),start:dx?c.minZ:c.minX,end:dx?c.maxZ:c.maxX,normal:[dx,dz],side,bottom:other?other.height:0,top:c.height,room:c.room,color:c.color,step:!!other});}
 const buckets=new Map();for(const p of raw){const key=[p.axis,p.fixed,p.side,p.bottom,p.top,p.room].join('/');if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(p);}const walls=[];for(const values of buckets.values()){values.sort((a,b)=>a.start-b.start);let segment=null;for(const p of values){if(segment&&Math.abs(segment.end-p.start)<1e-5)segment.end=p.end;else{segment={...p};walls.push(segment);}}}
 return {regions,cells,walls,roomHeight:ROOM_HEIGHT,tunnelHeight:TUNNEL_HEIGHT};}
export function ceilingAt(plan,p){return plan.cells.find(c=>inRegion(p,c))?.height??null;}
