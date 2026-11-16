import * as THREE from 'three';
import {publicPath} from '../paths.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ROOMS} from '../world/envelope-plan.js';
const PACK_PATH={station:'kenney',space:'space-kit',nature:'nature-kit'};
export function createAssetLibrary(scene,obstacles=[],options={}){THREE.Cache.enabled=true;const loader=new GLTFLoader(),placements=[],cache=new Map(),motions=[],status={loaded:0,failed:[],uniqueModels:0,drawBatches:0,placements:[],violations:[],ready:false};let sequence=0;
 function add(key,x,z,size=1.5,options={}){const p={id:options.id??`prop-${sequence++}`,key,x,z,size,y:options.room?0:-.975,rotation:0,room:null,collide:false,...options};placements.push(p);return p.id;}
 async function load(){const keys=[...new Set(placements.map(p=>p.key))],originals=new Map();status.uniqueModels=keys.length;let index=0;
 const worker=async()=>{while(index<keys.length){const key=keys[index++],[pack,name]=key.split(':');try{const result=options.loadModel?await options.loadModel(key):await loader.loadAsync(publicPath(`assets/${PACK_PATH[pack]}/${name}.glb`));result.scene.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(result.scene),size=box.getSize(new THREE.Vector3());originals.set(key,{scene:result.scene,box,size});}catch(e){status.failed.push(key);}}};await Promise.all(Array.from({length:6},worker));
 const groups=new Map(),resolved=new Map(),matrix=new THREE.Matrix4(),rot=new THREE.Matrix4(),normal=new THREE.Matrix4();
 for(const p of placements){const asset=originals.get(p.key);if(!asset)continue;const uniform=p.height? p.height/asset.size.y:p.size/Math.max(asset.size.x,asset.size.y,asset.size.z);const sx=uniform*(p.stretch?.[0]??1),sy=uniform*(p.stretch?.[1]??1),sz=uniform*(p.stretch?.[2]??1);const parent=p.on?resolved.get(p.on):null;if(p.on&&!parent){status.violations.push(`${p.id}: missing support ${p.on}`);continue;}const y=p.y+(parent?.top??0);const center=asset.box.getCenter(new THREE.Vector3());const forward=p.key.startsWith('space:desk-computer')?Math.PI:0;rot.makeRotationFromEuler(new THREE.Euler(p.rotationX??0,p.rotation+forward,p.rotationZ??0));const linear=rot.clone().multiply(new THREE.Matrix4().makeScale(sx,sy,sz));const oriented=asset.box.clone().applyMatrix4(linear),orientedCenter=oriented.getCenter(new THREE.Vector3());normal.makeTranslation(-orientedCenter.x,-oriented.min.y,-orientedCenter.z);matrix.makeTranslation(p.x,y,p.z).multiply(normal).multiply(linear);
 const bounds=asset.box.clone().applyMatrix4(matrix),room=ROOMS.find(r=>r.id===p.room);const record={id:p.id,key:p.key,room:p.room,x:p.x,z:p.z,bottom:bounds.min.y,top:bounds.max.y,minX:bounds.min.x,maxX:bounds.max.x,minZ:bounds.min.z,maxZ:bounds.max.z,anchor:p.on?'support':p.mount??(p.room?'floor':'exterior')};
 if(room&&bounds.max.y>4.58)status.violations.push(`${p.id}: crosses room ceiling`);
 if(room){const half=room.size/2-.24,[x,z]=room.position;if(bounds.min.x<x-half-.03||bounds.max.x>x+half+.03||bounds.min.z<z-half-.03||bounds.max.z>z+half+.03)status.violations.push(`${p.id} (${p.key}): exceeds ${room.name} wall clearance`);}
 if(record.anchor==='floor'&&Math.abs(bounds.min.y)>.04)status.violations.push(`${p.id}: floating floor prop`);
 if(p.collide)obstacles.push({x:(bounds.min.x+bounds.max.x)/2,z:(bounds.min.z+bounds.max.z)/2,w:bounds.max.x-bounds.min.x,d:bounds.max.z-bounds.min.z,source:p.id});
 resolved.set(p.id,record);status.placements.push(record);
 asset.scene.traverse(child=>{if(!child.isMesh)return;const m=matrix.clone().multiply(child.matrixWorld);const materialKey=(Array.isArray(child.material)?child.material:[child.material]).map(m=>m.uuid).join('|');const key=child.geometry.uuid+materialKey;if(!groups.has(key))groups.set(key,{geometry:child.geometry,material:child.material,matrices:[]});groups.get(key).matrices.push(m);});status.loaded++;}
 for(const g of groups.values()){const mesh=new THREE.InstancedMesh(g.geometry,g.material,g.matrices.length);g.matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);status.drawBatches++;}
 status.ready=true;return status;
 }
 return {add,load,status,placements};
}
