import * as THREE from 'three';
import {FACILITIES,HUB} from './layout.js';
import {characters,portraitCanvas} from './character-reference.js';
export function personalizeStudios(scene,{mat,sign}){const frames=[],sway=[],staticDecor=[],bulbMaterials=new Map(),paintMaterials=new Map();
 const paint=color=>{if(!paintMaterials.has(color))paintMaterials.set(color,new THREE.MeshBasicMaterial({color,toneMapped:false}));return paintMaterials.get(color);};
 const decor=(geo,color,x,y,z)=>{const m=new THREE.Mesh(geo,mat(color,.05));m.position.set(x,y,z);scene.add(m);staticDecor.push(m);return m;};
 // A warm aqua-and-orange gathering place, kept clear of the central route.
 for(const x of [-6,6]){decor(new THREE.BoxGeometry(3,.035,3.6),'#98dce0',x,.06,4.8);decor(new THREE.BoxGeometry(3.8,.14,2.6),'#fa8b50',x,4.36,4.8);for(let i=0;i<5;i++)decor(new THREE.SphereGeometry(.12,10,8),'#ffe2ad',x-1.2+i*.6,3.9,-8.7);}
 sign('ONE CREW / MANY DISCOVERIES',0,3.4,8.75,5,'#98dce0',Math.PI);
 for(const room of FACILITIES){const c=characters[room.id],[x,z]=room.position;const group=new THREE.Group();scene.add(group);function box(color,a,y,b,w,h,d){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color,.05));m.position.set(x+a,y,z+b);group.add(m);return m;}
 for(const a of [-5.3,5.3]){box(c.color,a,.9,-7.73,3.6,1.5,.06);box(c.color,a,4.36,-4.8,3.3,.12,2.2);}
 // Color lives in the personal corner, leaving the approved center paths exposed.
 box(c.color,5.2,.055,5.7,4.5,.02,3.4);box(c.color,7.72,1.05,5.5,.06,1.8,3.7);box(c.color,5.4,4.35,7.72,4.6,.14,.08);box('#f3d9a0',5.5,2.12,7.45,2.4,.15,.45);box(c.color,5.5,2.24,7.45,2.5,.08,.5);
 for(let i=0;i<3;i++){box(['#f5c688',c.color,'#b8a4e2'][i],4.8+i*.32,2.5,7.45,.16,.4,.25);}
 const poster=box('#e9e8d0',7.65,2.85,5.5,.12,2.25,2.2);portraitCanvas(room.id).then(cv=>{const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;const art=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.8*cv.height/cv.width),new THREE.MeshBasicMaterial({map:tex,transparent:true}));art.rotation.y=-Math.PI/2;art.position.set(x+7.56,2.95,z+5.5);scene.add(art);});
 sign(c.name.toUpperCase()+' / '+c.discipline.toUpperCase(),x+7.54,4.06,z+5.5,3,c.color,-Math.PI/2);sign(c.memento,x+5.2,1.65,z+7.75,3.8,c.color,Math.PI);
 // Little string lamps and a favorite specimen make each corner feel inhabited.
 for(let i=0;i<7;i++){const bulb=new THREE.Mesh(new THREE.SphereGeometry(.085,10,6),(()=>{const color=i%2?c.color:'#ffe0a1';if(!bulbMaterials.has(color))bulbMaterials.set(color,new THREE.MeshBasicMaterial({color}));return bulbMaterials.get(color);})());bulb.position.set(x+3.6+i*.6,3.9-Math.sin(i/6*Math.PI)*.25,z+7.6);group.add(bulb);}
 const stem=new THREE.Mesh(new THREE.CylinderGeometry(.03,.035,.5,8),mat('#559c70'));stem.position.set(x+6.3,2.55,z+7.45);group.add(stem);for(const side of [-1,1]){const leaf=new THREE.Mesh(new THREE.SphereGeometry(.19,10,8),mat(c.color));leaf.scale.set(1,.3,.5);leaf.position.set(x+6.3+side*.12,2.7,z+7.45);group.add(leaf);}frames.push(group);
 }
 
 // Bloop’s studio: water mural, bubble lights and a little specimen ocean.
 const wave=new THREE.Group();wave.position.set(-41.7,2.5,-29.3);wave.rotation.y=Math.PI/2;scene.add(wave);for(let row=0;row<4;row++){const points=[];for(let i=0;i<30;i++)points.push(new THREE.Vector3(-1.7+i*.12,Math.sin(i*.38)*.1+row*.3,0));wave.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:row%2?'#98dce0':'#fa8b50'})));}
 sign('EVERY DROP / ANOTHER ADVENTURE',-41.65,3.65,-29.3,3.6,'#98dce0',Math.PI/2);
 for(let i=0;i<9;i++){const b=decor(new THREE.SphereGeometry(.09+i%3*.035,12,8),'#98dce0',-40.7,2.3+i*.17,-29.5);sway.push({mesh:b,y:b.position.y,phase:i});}
 // Nori’s existing authored hydroponic beds become a garden, with warm lights,
 // colored surrounds, blossoms in the growing media, and hanging perimeter vines.
 for(const [index,[dx,dz]]of [[-4.9,-4.5],[4.9,-4.5],[-4.9,4.5],[4.9,4.5]].entries()){const x=34+dx,z=-34+dz,palette=['#fa8b50','#98dce0','#d5ace8','#f3d47e'];for(const side of [-1,1])decor(new THREE.BoxGeometry(3.5,.36,.07),palette[index],x,1.1,z+side*1.2);for(let k=0;k<6;k++){const fx=x-.9+(k%3)*.9,fz=z+(k<3?.8:-.75);decor(new THREE.CylinderGeometry(.025,.025,.4,6),'#59986f',fx,1.65,fz);for(let j=0;j<5;j++){const p=decor(new THREE.SphereGeometry(.09,8,6),['#ff8b74','#b695e8','#f1c55b','#79c9c6'][(k+index)%4],fx+Math.cos(j*1.256)*.12,1.9,fz+Math.sin(j*1.256)*.12);p.material=paint(['#ff8b74','#b695e8','#f1c55b','#79c9c6'][(k+index)%4]);p.scale.y=.5;}decor(new THREE.SphereGeometry(.065,8,6),'#ffe0a1',fx,1.93,fz).material=paint('#ffe0a1');}}
 for(const dx of [-7,7])for(const dz of [-5,5]){const x=34+dx,z=-34+dz;decor(new THREE.CylinderGeometry(.36,.25,.4,10),'#fa8b50',x,3.8,z);decor(new THREE.CylinderGeometry(.02,.02,.55,6),'#98dce0',x,4.275,z);for(let i=0;i<9;i++){const a=i*.7,leaf=decor(new THREE.SphereGeometry(.16,8,6),i%2?'#83c6a2':'#b1db90',x+Math.sin(a)*.13,3.55-i*.16,z+Math.cos(a)*.13);leaf.scale.set(.7,.6,1.2);}}
 // A living trellis fills Nori’s solid east wall; the exploration lanes stay open.
 for(const dz of [-2,-1,0,1,2])decor(new THREE.CylinderGeometry(.025,.025,2.4,6),'#78b59c',41.65,2.4,-34+dz);
 for(const y of [1.3,2.3,3.3])decor(new THREE.BoxGeometry(.05,.05,4.5),'#98dce0',41.65,y,-34);
 for(let i=0;i<35;i++){const z=-36+(i%7)*.66,y=1.35+Math.floor(i/7)*.48,leaf=decor(new THREE.SphereGeometry(.22,10,8),i%2?'#4d9f77':'#79bd87',41.52,y,z);leaf.material=paint(i%2?'#4d9f77':'#79bd87');leaf.scale.set(.24,.7,1);leaf.rotation.x=(i%2?1:-1)*.4;}
 sign('NORI’S MOON GARDEN',41.45,4.0,-34,4.2,'#fa8b50',-Math.PI/2);
 // Batch repeated static petals, leaves, lamps and studio fixtures after placement.
 const moving=new Set(sway.map(b=>b.mesh)),groups=new Map();scene.updateMatrixWorld(true);for(const m of [...staticDecor,...frames.flatMap(g=>g.children)]){if(!m.isMesh||moving.has(m))continue;const key=m.geometry.type+JSON.stringify(m.geometry.parameters)+m.material.uuid;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(m);}for(const meshes of groups.values()){if(meshes.length<2)continue;const instances=new THREE.InstancedMesh(meshes[0].geometry,meshes[0].material,meshes.length);instances.castShadow=instances.receiveShadow=true;meshes.forEach((m,i)=>{instances.setMatrixAt(i,m.matrixWorld);m.removeFromParent();});instances.computeBoundingSphere();scene.add(instances);}
 frames.animate=(time,reduced)=>{for(const b of sway)b.mesh.position.y=b.y+(reduced?0:Math.sin(time+b.phase)*.06);};return frames;
}
