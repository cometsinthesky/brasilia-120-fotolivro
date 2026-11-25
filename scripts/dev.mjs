import { watch } from 'node:fs';
import { spawnSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
process.chdir(root);
function build(){return spawnSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'}).status===0;}
if(!build())process.exit(1);
const server=spawn(process.execPath,['scripts/server.mjs'],{stdio:'inherit',env:{...process.env,PORT:process.env.PORT||'5173'}});
let timer;
for(const dir of ['src','public','public/pages'])watch(dir,()=>{clearTimeout(timer);timer=setTimeout(()=>{build();console.log('Atualize o navegador para ver as mudanças.');},160);});
process.on('SIGINT',()=>{server.kill();process.exit(0);});
