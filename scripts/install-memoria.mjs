import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('..', import.meta.url));
const path = p => resolve(root, p);
const read = p => readFileSync(path(p), 'utf8');
const htmlPath = 'src/index.html';
const configPath = 'tsconfig.json';
let html = read(htmlPath);
const cfg = JSON.parse(read(configPath));
if (!Array.isArray(cfg.files) || !cfg.files.includes('src/app.ts')) throw new Error('tsconfig inesperado: mantenha a configuração original do fotolivro.');
if (!html.includes('id="reader"') || !/<\/main\s*>/i.test(html) || !/<\/head\s*>/i.test(html)) throw new Error('HTML inesperado: não foi possível identificar reader/main/head.');
const snippet = read('src/memoria.html').trim();
if (!html.includes('<!-- INICIO MEMORIA FOTOGRAFICA -->')) {
  if (html.includes('id="memoria-fotografica"')) throw new Error('Já existe seção de memória sem marcadores. Verifique antes de continuar.');
  html = html.replace(/<\/main\s*>/i, `  ${snippet}\n  </main>`);
} else {
  html = html.replace(/<!-- INICIO MEMORIA FOTOGRAFICA -->[\s\S]*?<!-- FIM MEMORIA FOTOGRAFICA -->/, snippet);
}
if (!/href=["']memoria\.css["']/i.test(html)) html = html.replace(/<\/head\s*>/i, '  <link rel="stylesheet" href="memoria.css">\n</head>');
if (!cfg.files.includes('src/memoria.ts')) cfg.files.push('src/memoria.ts');
for (const p of [htmlPath, configPath]) if (!existsSync(path(p + '.pre-memoria.bak'))) writeFileSync(path(p + '.pre-memoria.bak'), read(p));
writeFileSync(path(htmlPath), html);
writeFileSync(path(configPath), JSON.stringify(cfg, null, 2) + '\n');
const missing = Array.from({length:42},(_,i)=>`public/mural/${String(i+1).padStart(2,'0')}-large.jpg`).filter(p=>!existsSync(path(p)));
console.log('Memória Fotográfica integrada. HTML e tsconfig atualizados; backups .pre-memoria.bak criados.');
if (missing.length) console.warn(`Atenção: ${missing.length} imagens ausentes em public/mural. Confira nomes e extensão antes de publicar.`);
console.log('Execute npm run build para atualizar dist.');
