import {publicPath} from '../paths.js';
// Pixel rectangles in the original unmodified sheet. Rotate clockwise to stand upright.
export const characters={
 bloop:{name:'Bloop',discipline:'Life Support',crop:[925,340,410,450],color:'#d4df88',line:'Every drop deserves a second adventure!',memento:'My tiny ocean, far from home'},
 moss:{name:'Moss',discipline:'Energy Systems',crop:[390,1320,460,450],color:'#70daca',line:'Save a little sunshine for later.',memento:'Sunshine collection club'},
 nori:{name:'Nori',discipline:'Agriculture and Food',crop:[910,1320,440,440],color:'#f5c0a0',line:'Small seeds. Giant possibilities.',memento:'First harvest picnic plans'},
 luma:{name:'Luma',discipline:'Space Hazards',crop:[915,1760,435,450],color:'#b19df5',line:'Wonder is brighter when we explore safely.',memento:'Moon pebble collection'},
 pip:{name:'Pip',discipline:'Engineering',crop:[390,1760,450,450],color:'#ff9385',line:'Let’s give that machine another try!',memento:'Favorite fix-it treasures'},
 skim:{name:'Skim',discipline:'Sustainability',crop:[410,815,450,505],color:'#83cdec',line:'Nothing wasted. New adventures made.',memento:'Found, fixed, loved again'},
 pebble:{name:'Pebble',discipline:'Mission Planning',crop:[950,805,395,510],color:'#d18dbc',line:'A little preparation makes room for discovery.',memento:'Our next great expedition'},
 tank:{name:'Tank',discipline:'Integrated Final Mission',crop:[390,330,445,515],color:'#ff9e79',line:'One crew. One wonderfully connected home.',memento:'Crew keepsakes / all together'}
};
let sheet;
export function portraitCanvas(id){return (sheet??=new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=publicPath('assets/characters/original-sheet.png');})).then(im=>{const [x,y,w,h]=characters[id].crop,cv=document.createElement('canvas');cv.width=h;cv.height=w;const c=cv.getContext('2d');c.translate(h,0);c.rotate(Math.PI/2);c.drawImage(im,x,y,w,h,0,0,w,h);const data=c.getImageData(0,0,h,w);for(let i=0;i<data.data.length;i+=4){const min=Math.min(data.data[i],data.data[i+1],data.data[i+2]);if(min>240)data.data[i+3]=0;}c.putImageData(data,0,0);return cv;});}
export function setPortraitImages(){document.querySelectorAll('img[data-character],image[data-character]').forEach(el=>portraitCanvas(el.dataset.character).then(cv=>{const u=cv.toDataURL();el.tagName.toLowerCase()==='image'?el.setAttribute('href',u):el.src=u;}));}
