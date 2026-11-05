# LDT — Escopo, estratégia e design (Landing Page Alisson de Araújo)

## Escopo
- Tipo: Landing Page (uma página) + Política de Privacidade + Termos de Uso + 404.
- Objetivo: gerar contatos de contratação de palestras e treinamentos via WhatsApp.
- Público: empresas, equipes comerciais, instituições, escolas e eventos que contratam palestrantes.
- Canais: WhatsApp 45998299255; Instagram @alissonaraujomentor; Cascavel/PR.
- Plataforma: site estático em Cloudflare (Pages/Workers). Sem backend; formulário abre o WhatsApp com a mensagem pronta.
- Conteúdo: extraído dos 2 PDFs do cliente. Nada de depoimentos, números ou clientes inventados.

## Pesquisa e benchmark (limitação)
A busca web retornou apenas resultados genéricos; não foi feito benchmark aprofundado de concorrentes.
A pasta TEMPLATES não foi solicitada como base e não foi consultada. Hipóteses de público e objeções (preço, formato,
resultado) são do autor e devem ser validadas com o cliente.

## Estratégia
Autoridade + prova (1 milhão de pessoas impactadas, palestras e treinamentos) → CTA WhatsApp repetido ao longo da página.
Ordem: hero → números → sobre → palestras → treinamentos → experiência → como contratar → galeria → FAQ → contato.

## Design system
- Cores: azul-marinho (fundos) e dourado (destaques, gradiente), marfim na seção Sobre. Contraste ≥ 4,5:1 verificado.
- Tipografia: Instrument Serif (títulos), Inter (texto). Tokens em `:root` de `assets/css/styles.css`.
- Componentes: hero com slider (3 fotos), acordeões nativos `<details>`, galeria com lightbox `<dialog>`, FAB WhatsApp.
- Animações discretas, respeitam `prefers-reduced-motion`; sem JS o conteúdo permanece visível.

## Arquitetura
HTML/CSS/JS estático, sem build. CSP sem scripts/estilos inline. Exceção ao stack Next.js documentada no README.

## Verificações realizadas (Playwright, ambiente local)
Slider, acordeões, links WhatsApp, galeria/lightbox, formulário, menu mobile, sem rolagem horizontal (360–1440 px),
reduced-motion, sem-JS. Medido via CDP (não é Lighthouse): LCP ≈ 0,5 s desktop e ≈ 1,6 s mobile throttled; CLS ≈ 0,0005.
