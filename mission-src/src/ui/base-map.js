import {HUB,FACILITIES,nextStudy,unlocked} from '../world/layout.js';
// Same look as the dashboard Moon Base map: 3x3 ring of room cards around the Central Hub.
const COLS=[170,500,830],ROWS=[100,360,620],NW=250,NH=104;
const col=v=>v<0?0:v>0?1:1,idx=v=>v<-10?0:v>10?2:1;
const ROLE={bloop:'Life support',moss:'Energy systems',nori:'Food & agriculture',luma:'Space hazards',pip:'Engineering',skim:'Sustainability',pebble:'Mission planning',tank:'Final mission'};
export function mapSVG(progress,position=[0,5.8],standalone=false){
 const next=nextStudy(progress);let nodes='',k=0;
 const state=f=>progress.completed.includes(f.id)?'done':unlocked(f.id,progress)?'cur':'lock';
 const card=(f,hub)=>{
  const st=hub?'open':state(f),x=COLS[idx(f.position[0])]-NW/2,y=ROWS[idx(f.position[1])]-NH/2;
  const pic=hub?`<g class="flagicon"><ellipse class="mound" cx="${x+54}" cy="${y+86}" rx="42" ry="9"/><path class="pole" d="M${x+50} ${y+84}V${y+16}"/><path class="pennant" d="M${x+50} ${y+18}H${x+92}L${x+80} ${y+34}L${x+92} ${y+50}H${x+50}Z"/></g>`
   :`<image data-character="${f.id}" x="${x+10}" y="${y+10}" width="88" height="84" preserveAspectRatio="xMidYMid meet"/>`;
  const lock=st==='lock'?`<g class="lock" transform="translate(${x+NW-30},${y+12})"><rect x="0" y="7" width="14" height="10" rx="2"/><path d="M3 7V4a4 4 0 0 1 8 0v3"/></g>`:'';
  const tick=st==='done'?`<g class="tick" transform="translate(${x+NW-28},${y+4})"><circle cx="12" cy="12" r="13"/><path d="M6 12.500l4 4 8-9"/></g>`:'';
  const mark=next?.id===f.id?`<g class="marker" style="transform-origin:${x+NW/2}px ${y}px"><polygon points="${x+NW/2-14},${y-30} ${x+NW/2+14},${y-30} ${x+NW/2},${y-10}"/></g>`:'';
  const label=hub?'Central Hub':f.name;
  nodes+=`<g class="node ${st}${hub?' hub':''}${st==='lock'?' locked':''}" data-map-room="${f.id}" ${standalone?'':`role="button" tabindex="0" aria-label="${label}, ${hub?'Central Hub':f.title}, ${st==='done'?'complete':st==='cur'?'available':'locked'}"`}><rect class="sh" x="${x+7}" y="${y+7}" width="${NW}" height="${NH}" rx="20"/><g class="lift"><rect class="bd" x="${x}" y="${y}" width="${NW}" height="${NH}" rx="20"/>${pic}<text class="m-num" x="${x+110}" y="${y+30}">${hub?'START':'0'+f.order}</text><text class="m-name" x="${x+110}" y="${y+64}">${label}</text><text class="m-role" x="${x+110}" y="${y+88}">${hub?'Briefing and map':ROLE[f.id]}</text>${lock}${tick}</g>${mark}</g>`;
 };
 FACILITIES.forEach(f=>card(f,false));card(HUB,true);
 const done=id=>progress.completed.includes(id);
 const tun=[['M170 100H830',['bloop','moss','nori']],['M830 100V620',['nori','luma','pip']],['M830 620H170',['pip','skim','pebble']],['M170 620V100',['pebble','tank','bloop']]]
  .map(([d,ids])=>`<path class="tun${ids.some(done)?' on':''}" d="${d}"/>`).join('');
 const link=`<g class="startlink" aria-hidden="true"><path class="sl-path" d="M500 308V240Q500 214 474 214H276Q250 214 250 188V168"/><polygon class="sl-head" points="236,170 264,170 250,150"/><g class="sl-tag" transform="translate(372,214)"><rect x="-58" y="-16" width="116" height="32" rx="16"/><text x="0" y="5" text-anchor="middle">Start here</text></g></g>`;
 return `<svg class="map-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 740" role="${standalone?'img':'group'}" aria-label="Moon Base map. Central Hub in the middle with eight rooms around it, from Bloop to Tank.">${tun}${link}${nodes}<g class="legend"><rect x="40" y="702" width="18" height="18" rx="5" fill="#99dce1"/><text x="68" y="716">Finished</text><rect x="190" y="702" width="18" height="18" rx="5" fill="#f58a53"/><text x="218" y="716">Next</text><rect x="310" y="702" width="18" height="18" rx="5" fill="#0f232b" stroke="#2c5560"/><text x="338" y="716">Locked</text></g></svg>`;
}
