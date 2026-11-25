# Brasília 120 — Fotolivro digital (v2.0)

Uma edição digital do projeto fotográfico autoral de Lucas Ferreira, Brasília, abril de 2022. Fotografia analógica noturna em médio formato, com 42 fotografias, cinco películas e três óticas: Monumental, Flâneur e Sociopolítica.

## Abrir imediatamente

Extraia **todo o ZIP** e abra `dist/index.html` no navegador. O site já está compilado, usa apenas recursos locais e não exige Node.js para leitura. Se preferir, utilize o servidor local abaixo.

## Desenvolver no VS Code (Windows, macOS ou Linux)

Pré-requisito: Node.js 18+ (recomenda-se 22+). Abra a pasta `brasilia-120` no VS Code e, no terminal Git Bash/PowerShell, execute:

```bash
npm install
npm run dev
```

Abra http://localhost:5173. Alterações nos arquivos de `src/` recompilam automaticamente; atualize o navegador para visualizá-las. Para encerrar o servidor, pressione `Ctrl+C`.

```bash
npm run check    # Validação de tipos
npm run build    # Gera o site estático em dist/
npm run preview  # Visualiza o build em http://localhost:4173
```

## Recursos

- Página quadrada 1:1 em todos os tamanhos de tela; layout editorial preto e responsivo.
- Passagem tridimensional de uma página por vez, com rotação em torno da lombada virtual e sombra dinâmica. Durante um swipe horizontal, a folha acompanha o gesto; abaixo do limiar de movimento, ela retorna à posição inicial.
- Botões Anterior/Próxima; setas esquerda/direita; Home/End quando o leitor está focado; índice com 56 miniaturas; atalhos de capítulos; barra de progresso navegável.
- Deslize para a esquerda para avançar, para a direita para retornar. Também funciona arrastando com o mouse. A rolagem vertical continua disponível.
- Tela cheia nativa via Fullscreen API quando disponível; fallback imersivo CSS em navegadores que não permitem tela cheia (por exemplo, Safari no iPhone). Capítulos no topo e controles disponíveis durante toda a leitura; em paisagem de baixa altura, os controles ficam na lateral para maximizar o quadrado. Saia pelo botão ou Esc. Ampliação, texto e PDF original continuam acessíveis.
- Páginas PNG de 2400 × 2400 px com codificação sem perdas, sem `srcset` de baixa resolução no leitor; miniaturas PNG de 320 px somente no índice. Pré-carregamento limitado às duas páginas vizinhas e miniaturas com lazy loading. Sem bibliotecas ou CDN em tempo de execução. Respeita `prefers-reduced-motion`.

## Estrutura

```text
brasilia-120/
├── src/
│   ├── index.html      # Interface e apresentação do projeto
│   ├── styles.css      # Layout responsivo, tema e efeitos visuais
│   ├── app.ts          # Navegação, gestos, animação e diálogos
│   └── pages.ts        # Metadados e texto extraído das 56 páginas
├── public/
│   ├── pages/          # 56 PNGs de leitura + 56 miniaturas PNG
│   ├── brasilia-120.pdf # PDF original sem alterações
│   └── favicon.svg
├── scripts/            # Build, servidor de desenvolvimento e conversão PDF
├── dist/               # Site compilado, pronto para hospedagem estática
├── package.json
├── tsconfig.json
└── vercel.json
```

## Publicação

- Vercel: importe o repositório no painel, selecione **Other** como framework, raiz do projeto `.`, comando `npm run build` e diretório de saída `dist`. O arquivo `vercel.json` já define build e saída.
- GitHub Pages: publique os conteúdos de `dist/` por um workflow de deployment ou branch dedicada; não publique a pasta do projeto inteira como se fosse a raiz do site. As URLs são relativas, compatíveis com subdiretórios.
- Netlify: comando `npm run build`, pasta de publicação `dist`.

Nenhuma conta ou publicação foi criada pelo projeto. Certifique-se de possuir os direitos necessários para distribuir a edição digital e o PDF.

## Editar ou substituir o PDF

Edite o texto em `src/index.html`, o visual em `src/styles.css` e a lógica em `src/app.ts`. O PDF enviado tem 56 páginas quadradas; a edição web preserva sua ordem e diagramação em imagens rasterizadas, em PNG sem perdas, com 2400 × 2400 px por página. A resolução de renderização não acrescenta detalhes às fotografias rasterizadas originais (que já têm resolução limitada no PDF). Para regenerar os arquivos a partir do mesmo PDF:

```bash
python -m pip install pymupdf pillow
python scripts/prepare_pages.py
npm run build
```

Para um PDF diferente, revise também os títulos de seções, as páginas de capítulos, a capa inicial e os metadados em HTML e TypeScript. A transcrição é extraída automaticamente, podendo conservar a ordem de leitura interna do PDF em páginas com colunas.

## Atualizar no GitHub Pages

Use uma cópia local do repositório existente, mantendo a pasta `.git`. Substitua `src/`, `public/` e `scripts/` pelas versões novas; remova os antigos arquivos `.webp` em `public/pages/` e `dist/pages/`. Preserve alterações próprias nos arquivos de configuração ao mesclar o pacote.

```bash
npm install
npm run build
git add -A
git commit -m "v2.0 - Fullscreen e PNG sem perdas"
git push origin main
npx gh-pages -d dist
```

Se necessário, instale `gh-pages` com `npm install -D gh-pages` antes de publicar. Em Settings → Pages, mantenha `gh-pages` e `/(root)` como origem.

## Verificação

TypeScript strict compilado sem erros. As 56 páginas foram rasterizadas diretamente do PDF de origem, e seis amostras foram comparadas pixel a pixel com o render original. Os controles, capítulo, navegação, arraste, índice, ampliação e dimensões do livro em modo imersivo foram conferidos no Chromium em 1440×900, 390×844, 320×568 e 844×390. O ambiente impede navegação HTTP/file no Chromium; os testes de interface foram realizados com os recursos do projeto inseridos em memória. O fallback sem Fullscreen API e o swipe por toque emulado foram conferidos em 390×844 e 844×390. Não foram testados dispositivos físicos ou Safari. A disponibilidade de fullscreen nativo depende do navegador; o fallback CSS não esconde necessariamente a barra de endereço do sistema.
