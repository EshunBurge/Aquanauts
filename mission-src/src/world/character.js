import * as THREE from 'three';
import {portraitCanvas} from './character-reference.js';
export function addBloop(parent,position,onReady,id='bloop'){const group=new THREE.Group();group.position.set(...position);parent.add(group);const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(.85,.98,.28,32),new THREE.MeshStandardMaterial({color:0x527c6b,metalness:.3,roughness:.4}));pedestal.position.y=.14;group.add(pedestal);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.83,.035,8,48),new THREE.MeshBasicMaterial({color:0xe4ec9b}));ring.rotation.x=Math.PI/2;ring.position.y=.29;group.add(ring);
 portraitCanvas(id).then(cv=>{const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;const body=new THREE.Mesh(new THREE.PlaneGeometry(2.3,2.3*cv.height/cv.width),new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide,depthWrite:false}));body.position.y=1.55;group.add(body);onReady?.(group);});return group;}
