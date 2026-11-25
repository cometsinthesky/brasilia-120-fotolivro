import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../dist/',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.pdf':'application/pdf','.svg':'image/svg+xml'};
const port=Number(process.env.PORT || 4173);
createServer((req,res)=>{
  try {
    const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const filename=resolve(root,'.'+(path==='/'?'/index.html':path));
    if(!filename.startsWith(resolve(root)+sep)||!statSync(filename).isFile())throw Error();
    res.writeHead(200,{'Content-Type':mime[extname(filename)]||'application/octet-stream','Cache-Control':'no-cache','Content-Length':statSync(filename).size});
    if(req.method==='HEAD')res.end();else createReadStream(filename).pipe(res);
  } catch {res.writeHead(404);res.end('Arquivo não encontrado');}
}).listen(port,'127.0.0.1',()=>console.log(`Brasília 120: http://localhost:${port}`));
