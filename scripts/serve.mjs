import http from 'node:http';
import {stat,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const port=Number(process.env.PORT??5176);
const mount='/'+(process.env.SITE_MOUNT??'').replace(/^\/+|\/+$/g,'');
const prefix=mount==='/'?'':mount;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.glb':'model/gltf-binary','.m4a':'audio/mp4','.mp4':'video/mp4','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
 try {
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
  const url=new URL(req.url,'http://localhost');
  if(prefix&&url.pathname==='/'){res.writeHead(302,{Location:prefix+'/'});return res.end();}
  if(prefix&&!url.pathname.startsWith(prefix+'/'))throw new Error('Outside mount');
  const pathname=decodeURIComponent(url.pathname.slice(prefix.length));
  let filename=path.resolve(root,'.'+pathname);
  if(filename!==root&&!filename.startsWith(root+path.sep))throw new Error('Invalid path');
  if((await stat(filename)).isDirectory()){
   if(!url.pathname.endsWith('/')){res.writeHead(301,{Location:url.pathname+'/'+url.search});return res.end();}
   filename=path.join(filename,'index.html');
  }
  const body=await readFile(filename);
  res.writeHead(200,{'Content-Type':types[path.extname(filename)]??'application/octet-stream','Content-Length':body.length,'Cache-Control':'no-cache'});
  res.end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Aquanauts website: http://127.0.0.1:${port}${prefix}/`));
