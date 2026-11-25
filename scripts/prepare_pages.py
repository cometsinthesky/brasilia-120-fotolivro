from pathlib import Path
import sys, json, re
import fitz
from PIL import Image
root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]) if len(sys.argv)>1 else root/'public/brasilia-120.pdf'
output = root/'public/pages'; output.mkdir(parents=True, exist_ok=True)
doc = fitz.open(source)
meta=[]
for i, page in enumerate(doc,1):
    pix = page.get_pixmap(matrix=fitz.Matrix(2400/page.rect.width,2400/page.rect.height), alpha=False)
    im = Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
    im.save(output/f'{i:02d}-large.png', 'PNG', compress_level=3)
    im.resize((320,320),Image.Resampling.LANCZOS).save(output/f'{i:02d}-small.png','PNG',compress_level=3)
    txt = page.get_text().strip()
    lines = [x.strip() for x in txt.splitlines() if x.strip() and not re.fullmatch(r'\d+',x.strip())]
    names={1:'Capa',2:'Folha de contatos',3:'Apresentação',4:'Processo fotográfico',5:'Epígrafe',6:'Abertura',7:'I | Monumental',19:'II | Flâneur',34:'Transição',35:'III | Sociopolítica',54:'Ficha técnica',55:'Apresentação final',56:'Contracapa'}
    title=names.get(i, lines[0] if lines else 'Página fotográfica')
    meta.append(dict(number=i,title=title,text=txt))
(root/'src/pages.ts').write_text('const PAGES = '+json.dumps(meta,ensure_ascii=False,indent=2)+';\n', encoding='utf-8')
print(f'{len(meta)} páginas geradas')
