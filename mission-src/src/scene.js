import * as THREE from 'three';
const C={navy:0x183746,mint:0x8ce1d2,coral:0xff865f,pale:0xc3d7da,purple:0x9b8ac4,yellow:0xffcc7b};
export function createWorld(canvas,onInteract){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x070f1e);scene.fog=new THREE.FogExp2(0x0b1725,.008);
 const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,260);camera.position.set(0,1.65,7.4);camera.rotation.order='YXZ';
 scene.add(new THREE.HemisphereLight(0xe6faff,0x556378,2));const sun=new THREE.DirectionalLight(0xffdcc1,2.5);sun.position.set(-8,16,-10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-18;sun.shadow.camera.right=18;sun.shadow.camera.top=18;sun.shadow.camera.bottom=-18;scene.add(sun);
 const targets=[],colliders=[],animated=[];const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.65,...extra});const mats={};for(const [k,v]of Object.entries(C))mats[k]=material(v);
 function mesh(geo,mat,x,y,z,parent=scene){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function box(x,y,z,w,h,d,color,parent=scene){return mesh(new THREE.BoxGeometry(w,h,d),typeof color==='string'?mats[color]:material(color),x,y,z,parent);}
 function sphere(x,y,z,r,color,parent=scene,sx=1,sy=1,sz=1){const m=mesh(new THREE.SphereGeometry(r,24,16),typeof color==='string'?mats[color]:material(color),x,y,z,parent);m.scale.set(sx,sy,sz);return m;}
 function cylinder(x,y,z,r,h,color,parent=scene){return mesh(new THREE.CylinderGeometry(r,r,h,48),typeof color==='string'?mats[color]:material(color),x,y,z,parent);}
 function label(text,x,y,z,color='#94e4d6',scale=1){const cv=document.createElement('canvas');cv.width=1024;cv.height=256;const ctx=cv.getContext('2d');ctx.fillStyle='#153340';ctx.beginPath();ctx.roundRect(0,0,1024,256,35);ctx.fill();ctx.fillStyle=color;ctx.font='bold 62px Trebuchet MS';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,128);const map=new THREE.CanvasTexture(cv);map.colorSpace=THREE.SRGBColorSpace;const m=mesh(new THREE.PlaneGeometry(3.2*scale,.8*scale),new THREE.MeshBasicMaterial({map,transparent:true}),x,y,z);return m;}
 function target(id,name,x,z,objects){targets.push({id,name,point:new THREE.Vector3(x,1.3,z),objects});for(const o of objects)o.userData.station=id;}
 // Exterior: deliberately illustrated procedural terrain, not NASA elevation data.
 box(0,-.65,0,220,.5,220,0x747987);let seed=19;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
 for(let i=0;i<110;i++){const x=(rand()-.5)*150,z=(rand()-.5)*150;if(Math.abs(x)<14&&Math.abs(z)<15)continue;const r=.4+rand()*3;const rock=mesh(new THREE.DodecahedronGeometry(r,0),material(0x7e8390),x,-.5+r*.4,z);rock.scale.y=.5+rand()*.5;rock.rotation.set(rand(),rand(),rand());}
 const stars=new Float32Array(1800);for(let i=0;i<600;i++){const a=rand()*Math.PI*2,b=rand()*Math.PI/2;stars[i*3]=Math.cos(a)*Math.cos(b)*140;stars[i*3+1]=Math.sin(b)*140;stars[i*3+2]=Math.sin(a)*Math.cos(b)*140;}const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(stars,3));scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xd8f2ff,size:.19})));
 const earth=sphere(7,10,-43,4.2,0x4a9db5);for(let i=0;i<14;i++){const a=rand()*6,b=rand()*2-1;const land=sphere(Math.sin(a)*3.9, b*2.7,Math.cos(a)*3.3,.8,0x9cd7ae,earth,1.7,.65,.2);land.lookAt(0,0,0);}const glow=mesh(new THREE.SphereGeometry(4.35,32,24),new THREE.MeshBasicMaterial({color:0x7be4f1,transparent:true,opacity:.12,side:THREE.BackSide}),7,10,-43);
 for(let i=0;i<3;i++){const panel=box(-15+i*4,1.7,-16,3.5,.12,5,0x245f85);panel.rotation.x=.32;box(-15+i*4,.4,-16,.15,2.2,.15,'pale');for(let j=0;j<5;j++)box(-15+i*4,1.8,-18+j*.9,3.3,.02,.025,'mint');}
 // Open-plan habitat with a central commons and two identifiable system bays.
 box(0,-.25,0,23,.5,23,'navy');box(0,-.015,0,21.8,.06,21.8,0xabc5ce);
 for(let x=-10;x<=10;x+=2)for(let z=-10;z<=10;z+=2){box(x,.025,z,1.96,.025,1.96,((x+z)%4===0)?0xaec7d1:0xb9d0d6);}
 // Back wall observation windows and structural ribs.
 box(0,.5,-11,23,1, .4,'navy');box(0,4.8,-11,23,1.2,.4,'navy');
 const glass=new THREE.MeshPhysicalMaterial({color:0x7ad7df,transparent:true,opacity:.13,roughness:.1,metalness:.2,side:THREE.DoubleSide});
 for(let x=-9;x<=9;x+=6){box(x,2.75,-11,.23,3.5,.6,'pale');mesh(new THREE.PlaneGeometry(5.7,3.5),glass,x+3,2.75,-11);}
 for(const x of [-11,11]){box(x,2.5,0,.4,5,22,'pale');box(x*.99,1,0,.08,.18,22,'coral');box(x*.99,4.2,0,.08,.13,22,'mint');}
 box(0,2.5,11,22,5,.4,'pale');box(0,2.5,10.7,3.4,4.2,.2,'navy');label('AIRLOCK 01',0,4.6,10.55,'#ffcc7b',.7).rotation.y=Math.PI;
 box(0,5.45,0,22,.4,22,'navy');
 for(let z=-9;z<=9;z+=6){box(0,5,z,22,.3,.3,'pale');box(0,4.82,z,19,.08,.15,'mint');const l=new THREE.PointLight(0xb2f4eb,28,14,2);l.position.set(0,4.2,z);scene.add(l);}
 for(let x=-9;x<=9;x+=6){box(x,2.6,-10.7,.35,5.2,.6,'pale');box(x,4.9,0,.25,.25,22,'pale');}
 // Floor paths and room accents.
 box(-5,.06,0,.13,.015,19,'mint');box(5,.06,0,.13,.015,19,'coral');
 label('01  /  LIFE SUPPORT',-6.9,3.85,-7.8,'#94e4d6');label('02  /  ENERGY BAY',6.9,3.85,-7.8,'#ffca7e');label('AQUANAUTS  /  LUNAR OUTPOST',0,4.65,-10.65,'#f1f1dd',1.1);
 function consoleUnit(x,z,color,id,name){const group=new THREE.Group();group.position.set(x,0,z);scene.add(group);box(0,.5,0,2.6,1,.9,'navy',group);box(0,1.08,0,2.8,.22,1.15,color,group);const screen=box(0,1.6,-.25,2.4,1,.15,'navy',group);screen.rotation.x=-.18;for(let i=0;i<3;i++){box(-.7+i*.7,1.65,-.145,.47,.06,.025,color,group);box(-.7+i*.7,1.4,-.1,.4,.1,.025,color,group);}for(let i=0;i<4;i++)sphere(-.8+i*.5,1.22,.3,.07,i===0?'coral':color,group);colliders.push({x,z,w:3,d:1.6});target(id,name,x,z,group.children);return group;}
 const life=consoleUnit(-7,-5,'mint','life','Life-support station');const powerUnit=consoleUnit(7,-5,'yellow','power','Power station');
 for(const x of [-8.5,-6.5]){cylinder(x,1.4,-7.3,.62,2.7,'pale');cylinder(x,1.4,-7.3,.64,1.7,'mint');cylinder(x,2.85,-7.3,.3,.2,'navy');}
 for(let i=0;i<3;i++){box(5.4+i*1.4,1.5,-7.5,1.1,3,1,'navy');for(let j=0;j<5;j++)box(5.4+i*1.4,.6+j*.4,-6.96,.8,.22,.06,'mint');}
 // A raised central mission table, navigable on either side.
 const table=cylinder(0,.8,-3,1.5,1.6,'navy');cylinder(0,1.65,-3,1.7,.15,'pale');const holo=mesh(new THREE.IcosahedronGeometry(.6,1),new THREE.MeshStandardMaterial({color:0x8eeadd,emissive:0x4bcaba,emissiveIntensity:.6,transparent:true,opacity:.65,wireframe:true}),0,2.3,-3);animated.push(holo);colliders.push({x:0,z:-3,w:3.8,d:3.8});
 // Moss and Bloop retain silhouettes and palettes from the supplied illustrations.
 function character(id,x,z){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);const bloop=id==='bloop';const skin=bloop?'coral':0xc8ce87;
 cylinder(0,.11,0,1,.2,'navy',g);cylinder(0,.22,0,.91,.05,bloop?'mint':'yellow',g);
 sphere(0,1.45,0,.69,skin,g,1,1.05,.8);const helmet=sphere(0,1.55,-.12,.81,'pale',g,1,1,.75);helmet.material=new THREE.MeshStandardMaterial({color:0xdad8ef,transparent:true,opacity:.2,roughness:.1});
 if(bloop){for(let i=0;i<8;i++){const a=i*Math.PI/4;const t=sphere(Math.cos(a)*.58,.54,Math.sin(a)*.43,.24,skin,g,.62,1.7,.6);t.rotation.z=-Math.cos(a)*.7;sphere(Math.cos(a)*.78,.22,Math.sin(a)*.55,.18,skin,g,1.4,.6,1);}}
 else{for(let i=0;i<10;i++){const a=i*Math.PI/5;const cone=mesh(new THREE.ConeGeometry(.14,.35,5),material(0xc8ce87),Math.cos(a)*.72,1.45+Math.sin(a)*.68,0,g);cone.rotation.z=a-Math.PI/2;}sphere(-.83,1.1,0,.23,skin,g,1.5,.6,.5);sphere(.83,1.1,0,.23,skin,g,1.5,.6,.5);}
 box(0,.94,.12,1.05,.42,.6,'navy',g);box(0,.95,.47,.27,.23,.08,'mint',g);
 for(const x of [-.25,.25]){sphere(x,1.65,.49,.17,0xffe6b7,g);sphere(x,1.63,.64,.105,'navy',g);}const mouth=sphere(0,1.34,.54,.09,'navy',g,1.3,.5,.5);
 const name=label(bloop?'BLOOP':'MOSS',x,2.85,z,'#eaf9f3',.55);target(id,bloop?'Talk to Bloop':'Talk to Moss',x,z,g.children);colliders.push({x,z,w:1.9,d:1.9});animated.push(g);return g;}
 character('bloop',-4.1,-2);character('moss',4.1,-2);
 // Greenhouse and protection alcove.
 for(let i=0;i<3;i++){box(-8.5+i*.7,.9,4, .56,1.6,.65,'pale');for(let j=0;j<3;j++){const leaf=sphere(-8.5+i*.7,1.4+j*.24,4,.2,0x80bb83,scene,1.7,.3,.7);leaf.rotation.z=j*.5;}}
 box(-7.8,2.3,4,3,.15,1.1,'purple');label('GROW LAB',-7.8,3,3.8,'#cab8f0',.7);
 box(7.5,1.4,4,3,2.8,.7,'purple');const shelter=box(7.5,1.5,3.56,2.5,2.4,.1,'navy');label('RADIATION SHELTER',7.5,3.3,3.5,'#cab8f0',.75);target('shelter','Shelter & mission comms',7.5,3.5,[shelter]);colliders.push({x:7.5,z:4,w:3.4,d:1.3});
 let yaw=0,pitch=0,keys={},sensitivity=1,reduced=false,locked=false,active=false,easy=false,near=null;
 function lookAt(x,z){camera.lookAt(x,1.5,z);yaw=camera.rotation.y;pitch=camera.rotation.x;}
 lookAt(0,-5);
 canvas.addEventListener('click',()=>{if(!active)return;if(easy){const ray=new THREE.Raycaster();ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(targets.flatMap(t=>t.objects),false);const hit=hits.find(h=>h.object.userData.station);if(hit){const t=targets.find(t=>t.id===hit.object.userData.station);go(t.id);onInteract(t.id);}return;}if(!locked)canvas.requestPointerLock?.();else if(near)onInteract(near.id);});
 const pointer=new THREE.Vector2();canvas.addEventListener('pointermove',e=>{pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);});
 document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===canvas;keys={};});
 document.addEventListener('mousemove',e=>{if(active&&locked&&!easy){yaw-=e.movementX*.002*sensitivity;pitch=Math.max(-1.25,Math.min(1.25,pitch-e.movementY*.002*sensitivity));}});
 window.addEventListener('keydown',e=>{if(!active||/INPUT|BUTTON/.test(document.activeElement?.tagName))return;keys[e.code]=true;if(['KeyW','KeyS','KeyA','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='KeyE'&&near)onInteract(near.id);});window.addEventListener('keyup',e=>keys[e.code]=false);window.addEventListener('blur',()=>keys={});
 function go(id){const t=targets.find(t=>t.id===id);camera.position.set(t.point.x,1.65,t.point.z+2.6);lookAt(t.point.x,t.point.z);}
 function free(x,z){if(Math.abs(x)>10.25||Math.abs(z)>10.1)return false;return !colliders.some(c=>Math.abs(x-c.x)<c.w/2+.2&&Math.abs(z-c.z)<c.d/2+.2);}
 function frame(dt,time){if(active){camera.rotation.set(pitch,yaw,0);const move=new THREE.Vector3((keys.KeyD?1:0)-(keys.KeyA?1:0),0,(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0));if(keys.ArrowLeft)yaw+=dt*1.4;if(keys.ArrowRight)yaw-=dt*1.4;move.normalize().applyAxisAngle(new THREE.Vector3(0,1,0),yaw).multiplyScalar(dt*3.2);if(free(camera.position.x+move.x,camera.position.z))camera.position.x+=move.x;if(free(camera.position.x,camera.position.z+move.z))camera.position.z+=move.z;near=null;let best=4;const forward=new THREE.Vector3();camera.getWorldDirection(forward);for(const t of targets){const delta=t.point.clone().sub(camera.position),d=delta.length();if(d<best&&(easy||forward.dot(delta.normalize())>.65)){near=t;best=d;}}}if(!reduced){holo.rotation.y=time*.3;for(let i=1;i<animated.length;i++)animated[i].position.y=Math.sin(time*1.5+i)*.035;}renderer.render(scene,camera);return near;}
 window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
 return {frame,go,setNight(night){sun.intensity=night?.35:2.5;},setActive(v){active=v;if(!v){keys={};document.exitPointerLock?.();}},setSettings(s){easy=s.easy;sensitivity=s.sensitivity;reduced=s.reduced;},reset(){camera.position.set(0,1.65,7.4);lookAt(0,-5);},canvas,scene,camera};
}
