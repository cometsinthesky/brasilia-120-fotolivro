# Brasília 120 — Fotolivro digital

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
- Modo imersivo dentro da janela do navegador (Esc para sair), ampliação de páginas, texto extraído do PDF quando disponível e link para o PDF original.
- Páginas WebP de 800 e 1600 px, `srcset`, pré-carregamento limitado a páginas vizinhas, miniaturas com lazy loading. Sem bibliotecas ou CDN em tempo de execução. Respeita `prefers-reduced-motion`.

## Estrutura

```text
brasilia-120/
├── src/
│   ├── index.html      # Interface e apresentação do projeto
│   ├── styles.css      # Layout responsivo, tema e efeitos visuais
│   ├── app.ts          # Navegação, gestos, animação e diálogos
│   └── pages.ts        # Metadados e texto extraído das 56 páginas
├── public/
│   ├── pages/          # 112 imagens WebP em duas resoluções
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

Edite o texto em `src/index.html`, o visual em `src/styles.css` e a lógica em `src/app.ts`. O PDF enviado tem 56 páginas quadradas; a edição web preserva sua ordem e diagramação em imagens rasterizadas, com compressão WebP. Para regenerar os arquivos a partir do mesmo PDF:

```bash
python -m pip install pymupdf pillow
python scripts/prepare_pages.py
npm run build
```

Para um PDF diferente, revise também os títulos de seções, as páginas de capítulos, a capa inicial e os metadados em HTML e TypeScript. A transcrição é extraída automaticamente, podendo conservar a ordem de leitura interna do PDF em páginas com colunas.

## Verificação

Compilação TypeScript em modo strict: concluída sem erros. Foram conferidos o layout em Chromium nas larguras de 320, 390, 768, 820, 1024, 1440 e 1920 px, os controles, saltos de capítulo, índice, ampliação, modo imersivo, arraste e toque emulado. O ambiente de teste bloqueou navegação direta do Chromium para localhost e file://; o teste de interface foi executado com os mesmos HTML, CSS e JavaScript, inserindo as imagens locais em memória. O servidor foi verificado por requisição HTTP. Não houve teste em aparelhos físicos ou Safari.
