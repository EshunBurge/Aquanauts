import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {publicPath,websiteLinks} from '../mission-src/src/paths.js';
const root=new URL('../',import.meta.url);
const read=p=>readFile(new URL(p,root),'utf8');
test('mission assets and return navigation resolve beneath root and GitHub Pages mounts',()=>{
 for(const base of ['http://localhost/','http://localhost/Aquanauts/']){
  const mission=new URL('mission/',base);
  for(const p of ['/assets/characters/original-sheet.png','/audio/bloop/theme.m4a','legacy.html'])
   assert.equal(new URL(publicPath(p,'./'),mission).href,mission.href+p.replace(/^\//,''));
  assert.deepEqual(websiteLinks(mission),{home:base,dashboard:base+'dashboard.html'});
 }
 assert.equal(publicPath('/assets/test.glb'),'/assets/test.glb');
});
test('existing Firebase, pets, rewards, certificates and original assets are preserved',async()=>{
 const baseline=JSON.parse(await read('source-provenance.json')).baselineSha256;
 const protectedFiles=Object.keys(baseline).filter(p=>/^(img\/|media\/|models\/)/.test(p)||['js/aq-backend.js','js/firebase-config.js','js/pets.js','js/prizes-data.js','firestore.rules'].includes(p));
 for(const p of protectedFiles){const bytes=await readFile(new URL(p,root));assert.equal(createHash('sha256').update(bytes).digest('hex'),baseline[p],p);}
 // The certificate's shared stylesheet cache key is the only allowed change.
 const certificate=await read('certificate.html');
 assert.match(certificate,/id="png"/);assert.match(certificate,/id="print"/);
});
test('website game launchers use the real mission route with native link navigation',async()=>{
 const home=await read('index.html'),dash=await read('js/dashboard.js'),nav=await read('js/main.js');
 assert.match(home,/href="mission\/">Play Mission/);
 assert.match(dash,/const GAME_URL = 'mission\/'/);
 assert.doesNotMatch(dash,/The game opens here once it is connected/);
 assert.match(nav,/href="mission\/">Play Mission/);
 for(const p of ['js/dashboard.js','js/main.js'])execFileSync(process.execPath,['--check',new URL(p,root).pathname]);
});
test('all local HTML build dependencies exist; nested mission contains models and original music',async()=>{
 async function check(dir){for(const name of await readdir(dir)){const p=path.join(dir,name);if((await stat(p)).isDirectory()){await check(p);continue;}if(!p.endsWith('.html'))continue;
  const html=await readFile(p,'utf8');for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
   const ref=match[1];if(/^(?:https?:|data:|mailto:|tel:|blob:)/.test(ref))continue;
   const clean=ref.split(/[?#]/)[0];if(!clean)continue;
   const target=path.resolve(path.dirname(p),clean);assert.ok((await stat(target)).isFile()||(await stat(target)).isDirectory(),p+' → '+ref);
  }
 }}
 await check(new URL('dist/',root).pathname);
 for(const room of ['bloop','moss','nori','luma','pip','skim','pebble','tank'])
  assert.ok((await stat(new URL(`dist/mission/audio/${room}/theme.m4a`,root))).size>10000);
 const config=JSON.parse(await read('dist/mission/audio/config.json'));assert.equal(config.tracks['central-hub'],null);
 assert.ok((await stat(new URL('dist/mission/assets/characters/original-sheet.png',root))).size>1000);
});
