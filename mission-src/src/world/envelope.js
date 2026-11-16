import * as THREE from 'three';
import {buildEnvelopePlan,ROOMS} from './envelope-plan.js';
import {createBatch} from './batch.js';
export function buildEnvelope(scene,{mat,sign,floorMaterial=null}){const plan=buildEnvelopePlan(),batch=createBatch(scene),gates=[],badges=[];
 const white=mat(0xd1dbdc,.18),trim=mat(0x627e91,.45),dark=mat(0x203b50,.4),floor=floorMaterial??mat(0xaebfc7,.25),ceiling=mat(0x253e53,.25),glass=new THREE.MeshPhysicalMaterial({color:0xa2d5df,transparent:true,opacity:.2,metalness:.18,roughness:.16,side:THREE.DoubleSide,depthWrite:false});
 const b=(m,x,y,z,w,h,d)=>batch.box(m,x,y,z,w,h,d);
 for(const c of plan.cells){b(floor,c.x,-.08,c.z,c.maxX-c.minX+.016,.16,c.maxZ-c.minZ+.016);b(ceiling,c.x,c.height+.12,c.z,c.maxX-c.minX+.016,.24,c.maxZ-c.minZ+.016);}
 for(const wall of plan.walls){const horizontal=wall.axis==='x',len=wall.end-wall.start,count=Math.max(1,Math.ceil(len/2)),span=len/count;const n=wall.normal;
 for(let i=0;i<count;i++){const p=wall.start+(i+.5)*span,x=horizontal?p:wall.fixed,z=horizontal?wall.fixed:p;const put=(m,y,h,thickness=.22)=>b(m,x,y,z,horizontal?span+.012:thickness,h,horizontal?thickness:span+.012);
 if(wall.step){put(white,(wall.top+wall.bottom)/2,wall.top-wall.bottom+.02);continue;}
 // Glass is an actual closed surface, framed between continuous solid bands.
 put(white,.59,1.18);put(white,(wall.top+2.75)/2,wall.top-2.75+.02);put(glass,1.965,1.59,.055);
 put(dark,.13,.22,.3);put(trim,1.18,.12,.28);put(trim,2.76,.12,.28);put(trim,wall.top-.08,.16,.3);
 const edge=horizontal?x-span/2:z-span/2;b(trim,horizontal?edge:x,wall.top/2,horizontal?z:edge,horizontal?.11:.3,wall.top,horizontal?.3:.11);
 const glow=mat(wall.color??0x8ce1d2,.1,true);b(glow,x-n[0]*.15,.36,z-n[1]*.15,horizontal?span-.05:.025,.04,horizontal?.025:span-.05);
 }}
 const vectors={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]};
 for(const f of ROOMS){const [x,z]=f.position,h=f.size/2,color=mat(f.color,.25),glow=mat(f.color,.05,true);
 for(let k=-h+2;k<h;k+=4){b(trim,x+k,4.4,z,.13,.22,f.size);b(trim,x,4.4,z+k,f.size,.22,.13);b(glow,x+k,4.25,z,.065,.035,f.size-.5);}
 for(const side of f.doors){const n=vectors[side],t=[n[1],-n[0]],dx=x+n[0]*h,dz=z+n[1]*h,horizontal=!!n[1],rotation=side==='north'?0:side==='south'?Math.PI:side==='east'?-Math.PI/2:Math.PI/2;
 b(color,dx,3.48,dz,horizontal?5.05:.42,.26,horizontal?.42:5.05);for(const k of [-1,1]){b(color,dx+t[0]*2.46,1.7,dz+t[1]*2.46,horizontal?.25:.42,3.4,horizontal?.42:.25);b(glow,dx+t[0]*2.32-n[0]*.24,1.7,dz+t[1]*2.32-n[1]*.24,horizontal?.045:.03,3.2,horizontal?.03:.045);}
 sign(f.id==='hub'?'CENTRAL HUB':`${String(f.order).padStart(2,'0')} / ${f.name.toUpperCase()}`,dx-n[0]*.3,3.94,dz-n[1]*.3,4.25,f.color,rotation);
 // Both faces are signed so approaching astronauts can identify a facility.
 sign(f.id==='hub'?'CENTRAL HUB':`${String(f.order).padStart(2,'0')} / ${f.name.toUpperCase()}`,dx+n[0]*.31,3.12,dz+n[1]*.31,3.8,f.color,rotation+Math.PI);
 if(f.id!=='hub'){const gate=new THREE.Mesh(new THREE.BoxGeometry(horizontal?4.6:.15,3.4,horizontal?.15:4.6),dark);gate.position.set(dx,1.7,dz);scene.add(gate);const text=sign('STUDY LOCKED',dx-n[0]*.16,1.95,dz-n[1]*.16,3.3,'#afc5cf',rotation);const textBack=sign('COMPLETE PREVIOUS STUDIES',dx+n[0]*.17,1.95,dz+n[1]*.17,3.3,'#afc5cf',rotation+Math.PI);gates.push({id:f.id,gate,text,textBack});}
 }
 for(const dx of [-h+1,h-1])for(const dz of [-h+1,h-1])batch.cylinder(trim,x+dx,-.65,z+dz,.22,1.2);
 // Equipment soffit and exterior dome are sealed above the continuous ceiling.
 const dome=new THREE.Mesh(new THREE.SphereGeometry(f.id==='hub'?8:6.6,32,12,0,Math.PI*2,0,Math.PI/2),mat(0xa8bdc9,.5));dome.position.set(x,4.8,z);dome.scale.y=.45;dome.castShadow=true;scene.add(dome);
 const badge=sign('✓ STUDY COMPLETE',x,3.35,z-h+.34,4.1,'#8de4d6');badge.visible=false;badges.push({id:f.id,mesh:badge});
 }
 // Repeated tunnel ribs and ceiling luminaires, wholly outside room footprints.
 for(const r of plan.regions.filter(r=>r.kind==='tunnel')){const alongX=r.maxX-r.minX>r.maxZ-r.minZ,start=alongX?r.minX:r.minZ,end=alongX?r.maxX:r.maxZ;for(let p=start+1;p<end;p+=3.6){const x=alongX?p:(r.minX+r.maxX)/2,z=alongX?(r.minZ+r.maxZ)/2:p;if(plan.regions.some(a=>a.kind==='room'&&x>=a.minX&&x<=a.maxX&&z>=a.minZ&&z<=a.maxZ))continue;for(const k of [-1,1])batch.cylinder(trim,x+(alongX?0:k*1.8),-.65,z+(alongX?k*1.8:0),.12,1.2);b(trim,x,3.42,z,alongX?.14:4.55,.15,alongX?4.55:.14);b(mat(0xd5f7ef,0,true),x,3.32,z,alongX?.3:2.3,.045,alongX?2.3:.3);}}
 const meshes=batch.flush();return {plan,gates,badges,meshes};
}
