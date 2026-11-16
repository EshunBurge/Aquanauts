import * as THREE from 'three';
export function interactionSystem(camera){const targets=[];const ray=new THREE.Raycaster();return{
 targets,add(id,label,point,objects=[]){const target={id,label,point:new THREE.Vector3(...point),objects};targets.push(target);objects.forEach(o=>o.traverse?.(m=>m.userData.interaction=id));return target;},
 nearby(){const direct=this.atPointer(0,0);if(direct)return direct;const forward=new THREE.Vector3();camera.getWorldDirection(forward);return targets.filter(t=>!t.enabled||t.enabled()).map(t=>({...t,d:t.point.distanceTo(camera.position)})).filter(t=>t.d<3.6&&forward.dot(t.point.clone().sub(camera.position).normalize())>.88).sort((a,b)=>a.d-b.d)[0]??null;},
 atPointer(x,y){ray.setFromCamera(new THREE.Vector2(x,y),camera);const hit=ray.intersectObjects(targets.filter(t=>!t.enabled||t.enabled()).flatMap(t=>t.objects),true).find(h=>h.distance<4.5&&h.object.userData.interaction);return hit?targets.find(t=>t.id===hit.object.userData.interaction):null;}
 };}

// The current task uses the same reach rule as its accessible equipment button.
export function guidedTarget(targets, action, position) {
 return targets.find(t => t.id === action && (!t.enabled || t.enabled()) && t.point.distanceTo(position) < 3.6) ?? null;
}
