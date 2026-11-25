# Brasília 120 - Digital Photobook | v2.0

*Uma cidade revelada pela noite.*

## Sobre o projeto

O **Brasília 120** é um projeto autoral de fotografia analógica noturna em médio formato (6×6), que investiga as diferentes dimensões estéticas, culturais e sociopolíticas de Brasília e do Distrito Federal.

Realizado com uma câmera TLR alemã Zeiss Ikoflex de 1945, utilizando películas de formato 120 e técnicas de longa exposição, o projeto estabelece um diálogo entre luz, sombra, tempo, memória e cotidiano urbano.

Originalmente publicado em abril de 2022, o fotolivro apresenta três óticas que se complementam e se entrelaçam:

- **I - Monumental:** a dimensão estética e arquitetônica da capital federal, seus monumentos, formas e expressões.
- **II - Flâneur:** um percurso contemplativo e investigativo pelas cenas, histórias e experiências do cotidiano urbano.
- **III - Sociopolítica:** as contradições, desigualdades, manifestações e narrativas sociopolíticas que permeiam a realidade brasiliense.

## Experiência digital

A versão digital do Brasília 120 propõe uma imersão na fotografia analógica noturna, recriando a experiência de folhear um fotolivro físico em um ambiente virtual, interativo e responsivo.

Desenvolvida com TypeScript, HTML5 e CSS3, a plataforma apresenta uma interface minimalista, com fundo preto absoluto, transições tridimensionais e recursos de navegação que valorizam a composição fotográfica e preservam a identidade editorial da publicação original.

O ambiente digital convida o visitante a desacelerar o olhar e experimentar Brasília através das particularidades da fotografia analógica em médio formato.

## Funcionalidades

- **Fotolivro interativo:** visualização das 56 páginas da publicação original, preservando a proporção quadrada 1:1.
- **3D Page Flip:** simulação tridimensional do movimento de folhear um livro físico, com transições suaves.
- **Swipe Navigation:** navegação por gestos horizontais em dispositivos touchscreen.
- **Drag Navigation:** interação por meio do arraste das páginas com o mouse.
- **Keyboard Navigation:** navegação utilizando as setas direcionais do teclado.
- **Fullscreen Mode:** modo imersivo com aproveitamento máximo da área disponível da tela.
- **High Resolution:** renderização das páginas em alta resolução, sem perdas adicionais de compressão.
- **Chapter Navigation:** acesso direto às três óticas do fotolivro.
- **Interactive Thumbnails:** índice visual interativo com miniaturas de todas as páginas.
- **Zoom:** ampliação das páginas para contemplação dos detalhes fotográficos e leitura dos elementos textuais.
- **Progress Bar:** barra de progresso interativa e indicador de paginação.
- **Responsive Design:** adaptação dinâmica para desktops, notebooks, tablets e smartphones.
- **Adaptive Layout:** suporte às orientações vertical e horizontal da tela.
- **Smart Preloading:** pré-carregamento das páginas adjacentes para maior fluidez durante a navegação.
- **Lazy Loading:** carregamento sob demanda, reduzindo o consumo desnecessário de recursos.
- **Original PDF:** acesso à versão original do fotolivro.

## Versão 2.0 - Fullscreen & High Resolution

A versão 2.0 foi desenvolvida com foco na ampliação da experiência imersiva, na fidelidade visual das fotografias e no aprimoramento da interação entre o usuário e a publicação digital.

### Fullscreen Immersive Experience

- Implementação da Fullscreen API nativa dos navegadores.
- Dimensionamento dinâmico do fotolivro para ocupar a maior área disponível da tela.
- Preservação da proporção original 1:1, sem cortes ou distorções.
- Acesso permanente aos capítulos durante o modo imersivo.
- Preservação dos controles de navegação, paginação e ampliação.
- Manutenção da página atual ao entrar ou sair do modo fullscreen.
- Ocultação dos elementos externos à experiência de leitura.
- Modo imersivo alternativo para navegadores com restrições de acesso à Fullscreen API.

### High Resolution & Lossless Rendering

As 56 páginas foram renderizadas diretamente a partir do PDF original, utilizando o formato PNG Lossless, com resolução de 2400 × 2400 pixels por página.

Essa implementação busca preservar as características estéticas da fotografia analógica, incluindo a granulação das películas, as nuances tonais, as texturas, os contrastes e os detalhes presentes nas imagens originais, sem introduzir perdas adicionais de compressão.

A qualidade efetiva permanece condicionada à resolução das fotografias incorporadas ao PDF original.

### Comparativo entre versões

| Recurso | v1.0 | v2.0 |
|---|---|---|
| Total de páginas | 56 | 56 |
| Proporção | 1:1 | 1:1 |
| Resolução máxima | 1600 × 1600 px | 2400 × 2400 px |
| Megapixels por página | 2,56 MP | 5,76 MP |
| Formato de imagem | WebP | PNG Lossless |
| Compressão sem perdas | Não | Sim |
| Fullscreen nativo | Não | Sim |
| Modo imersivo | Sim | Aprimorado |
| Capítulos em fullscreen | Não | Sim |
| Transições tridimensionais | Sim | Sim |
| Navegação por swipe | Sim | Sim |
| Dimensionamento dinâmico | Parcial | Aprimorado |
| Responsividade | Sim | Aprimorada |
| PDF original preservado | Sim | Sim |

A versão 2.0 representa um aumento de **125% na quantidade de pixels renderizados por página**, proporcionando maior definição para a visualização em telas de alta densidade e durante a ampliação.

## Tecnologias e recursos

- TypeScript
- HTML5
- CSS3
- Node.js
- Fullscreen API
- Pointer Events API
- CSS 3D Transforms
- CSS Grid & Flexbox
- RequestAnimationFrame
- Responsive Web Design
- PNG Lossless Rendering
- Smart Preloading & Lazy Loading

## Concepção artística e tecnológica

O Brasília 120 Digital Photobook estabelece uma conexão entre a materialidade da fotografia analógica e as possibilidades interativas das tecnologias digitais contemporâneas.

A proposta não se limita à digitalização de uma publicação impressa, mas busca construir uma experiência de contemplação na qual a tecnologia atua como mediadora entre a obra fotográfica e o observador, preservando a narrativa, a sequência editorial e a singularidade estética do projeto original.

## Autoria

**Fotografia, concepção artística e projeto autoral:** Lucas Ferreira.

**Design, desenvolvimento e implementação da plataforma digital:** Lucas Ferreira (UnB/PPGEduC), 2026.

- Universidade de Brasília (UnB).
- Programa de Pós-Graduação em Educação em Ciências (PPGEduC).
- Publicação original: Brasília, Distrito Federal, abril de 2022.
- Plataforma digital: 2026.
- Versão atual: 2.0 - Fullscreen & High Resolution.
- Instagram: [@picture.insight](https://www.instagram.com/picture.insight/)

## Copyright

© 2022–2026 Lucas Ferreira - Brasília 120. Todos os direitos reservados.

© 2026 Lucas Ferreira (UnB/PPGEduC) - Brasília 120 Digital Photobook.

As fotografias, os textos, a composição editorial, a identidade visual e o código-fonte da plataforma digital são protegidos pela legislação de direitos autorais. A disponibilização pública deste repositório não implica autorização para reprodução, modificação, redistribuição ou exploração comercial de seu conteúdo.

Qualquer utilização, integral ou parcial, está condicionada à autorização prévia e expressa do autor.

---

*Analog photography. Medium format. Long exposures. Urban narratives.*

**Brasília 120 - A city revealed through the night.**