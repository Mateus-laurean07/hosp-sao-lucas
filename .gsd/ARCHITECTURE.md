# ARCHITECTURE.md

## High-Level System Architecture

- **Framework:** Astro (v5/latest). Escolhido pela alta performance (Zero-JS-by-default) e otimização para SEO, fundamental para o tráfego do hospital.
- **Styling:** Tailwind CSS + Vanilla CSS para animações customizadas e design system premium.
- **Interatividade:** Astro Components + Vanilla JS. O uso de frameworks (como React) só será adicionado se a complexidade do formulário ou interações do usuário exigirem gerenciamento de estado complexo, o que por padrão não parece necessário.
- **Formulário / Geração de Leads:** Client-side JavaScript interceptando o clique, enviando os dados primários via Webhook (para armazenamento ou Pixel tracking) e abrindo via `window.open` o link `wa.me/numero`.
- **Aesthetic / Design System:** O visual será primariamente baseado na referência "Medizin" (askit.dextheme.net) escolhida pelo usuário. Tons primários baseados no azul corporativo da marca, layouts limpos de saúde "enterprise", grande uso de espaços em branco (white-space) e tipografia moderna e elegante sem serifas.

## Directory Structure (Astro Standard)
- `src/`
  - `components/` - Botões, Cards de Médicos, Header, Footer.
  - `layouts/` - Layout Base (Head, SEO tags, Scripts Globais).
  - `pages/` - Rotas (index.astro, estrutura, convenios, corpo-clinico).
  - `assets/` - Imagens comprimidas, ícones, SVGs.
  - `styles/` - global.css com tokens do Tailwind e fonts.

## Data Layer (Static/CMS)
Num primeiro momento, Corpo Clínico e Especialidades poderão ser estruturados usando "Astro Content Collections" (Markdown/JSON) ou hardcoded, facilitando a manutenção futura sem precisar de banco de dados complexos.
