# Landing Page — Alisson de Araújo (Instituto Voice)

Landing page premium de **palestrante, especialista em oratória e treinador comportamental**, Cascavel/PR.
Tipo de projeto (Framework LDT): **Landing Page** — uma única página comercial + páginas legais
(`/politica-de-privacidade/`, `/termos-de-uso/`) + `404.html`.

## Stack (exceção documentada)
HTML + CSS + JavaScript puro, **sem etapa de build** e sem dependências. O padrão LDT (Next.js/TypeScript) não foi
usado porque o ambiente de desenvolvimento não tinha acesso ao npm. Pode ser portado para Next.js depois.
Fontes (Inter e Instrument Serif, licença OFL) estão hospedadas localmente em `assets/fonts/`.

## Estrutura
```
index.html                      página principal
politica-de-privacidade/        página legal
termos-de-uso/                  página legal
404.html
assets/css  assets/js  assets/fonts  assets/img
_headers  robots.txt  sitemap.xml  wrangler.jsonc  .assetsignore
scripts/set-domain.mjs          troca o domínio provisório
docs/                           escopo, estratégia e decisões
deploy.bat                      envia ao GitHub (Cloudflare publica em seguida)
```

## Executar localmente
Não há instalação. Abra a pasta com qualquer servidor estático, por exemplo:
`python -m http.server 8765` e acesse http://localhost:8765

## Configuração (`assets/js/config.js`)
- `whatsapp`: número do formulário (já: 5545998299255).
- `gaId`: ID do Google Analytics 4 (`G-XXXXXXXXXX`). Vazio = nenhum rastreamento e nenhum aviso de cookies.
  Preenchido = o GA só carrega após o visitante aceitar o aviso de cookies.
Não há variáveis de ambiente nem segredos (veja `.env.example`).

## Domínio e SEO
O site não usa URL absoluta (sem canonical, og:url nem sitemap).
Ao ter um domínio próprio, peça para adicionar canonical, sitemap e og:url (o script abaixo só funciona depois disso):
`node scripts/set-domain.mjs https://www.seudominio.com.br`
Depois cadastre o site no Google Search Console e envie o `sitemap.xml`.

## Deploy (Cloudflare)
1. Preencha `REPO_URL` no `deploy.bat` (uma vez) e rode-o: ele faz commit e push ao GitHub.
2. No Cloudflare, conecte o repositório. Projeto 100% estático: sem comando de build; diretório de saída: raiz (`./`).
   `wrangler.jsonc` e `.assetsignore` já estão configurados; `_headers` define CSP e cache.

## Adicionar fotos à galeria
1. Otimize a foto (WebP/JPG ~640 px de largura para miniatura e versão maior para o lightbox) em `assets/img/`.
2. Adicione o item na lista da galeria em `index.html` (copie um `<li>` existente e ajuste `src`, `alt` e o link da versão grande).
3. Para os slides do topo, edite os `slider__slide` do hero.

## Pendências / a validar
- Domínio definitivo e ID do GA4.
- Textos legais: revisão por advogado; incluir razão social/CNPJ e e-mail de contato quando houver.
- Validar com o Alisson: etapas de "Como contratar", respostas do FAQ, "mais de 27 estados".
- Depoimentos e logos de clientes não foram fornecidos e não foram inventados.
- Lighthouse não foi executado no ambiente de desenvolvimento; rode após o deploy.
