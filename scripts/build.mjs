import {cp,mkdir,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
// Only generated build output is replaced. Website source is never rewritten here.
await rm(path.join(root,'dist'),{recursive:true,force:true});
await mkdir(path.join(root,'dist'),{recursive:true});
execFileSync('npm',['run','build','--','--base=./'],{cwd:path.join(root,'mission-src'),stdio:'inherit',env:{...process.env,VITE_WEBSITE_INTEGRATION:'true'}});
for(const name of ['index.html','login.html','dashboard.html','shop.html','product.html','presentation.html','certificate.html','404.html','favicon.svg','css','js','img','media','models'])
 await cp(path.join(root,name),path.join(root,'dist',name),{recursive:true});
// Keep a generated mission/ alongside the existing static website too. This
// supports its current GitHub Pages "main / root" publication without replacing
// the website framework or introducing a new hosting provider.
await rm(path.join(root,'mission'),{recursive:true,force:true});
await cp(path.join(root,'mission-src/dist'),path.join(root,'mission'),{recursive:true});
await cp(path.join(root,'mission'),path.join(root,'dist/mission'),{recursive:true});
console.log('Connected website built in dist/. Mission: mission/index.html');
