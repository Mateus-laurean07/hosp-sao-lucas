# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [ ] Site estruturado em Astro com alta performance de carregamento (SEO).
- [ ] Formulário inteligente que captura nome/telefone e redireciona pro WhatsApp dos médicos.
- [ ] Páginas informativas (Estrutura, LGPD, Convênios).
- [ ] Corpo clínico com fotos e mini-currículos (+ CRM).

## Phases

### Phase 1: Foundation (Setup & Design System)
**Status**: ✅ Done
**Objective**: Inicializar o projeto com Vite/Astro, configurar o TailwindCSS com a paleta de cores institucional baseada nas referências e criar os componentes globais (Navbar, Footer).
**Requirements**: REQ-05

### Phase 2: Landing Page (Core Features)
**Status**: ✅ Done
**Objective**: Desenvolver a página Home, apresentando banner hero, chamada para ação, listagem do corpo clínico resumida e banner de integração com o Centro de Diagnóstico.
**Requirements**: REQ-01, REQ-04

### Phase 3: Páginas Institucionais & Especialidades
**Status**: ⬜ Not Started
**Objective**: Criar a visualização completa do catálogo de médicos e especialidades, além das páginas fixas (Sobre o Hospital, Convênios, Visitas, Direitos e Deveres LGPD).
**Requirements**: REQ-01, REQ-03

### Phase 4: Fluxo de Contato e Leads
**Status**: ⬜ Not Started
**Objective**: Implementar o formulário que intercepta o contato, captura o lead via formulário (com aviso de privacidade) e faz o split para o WhatsApp da secretária do respectivo médico.
**Requirements**: REQ-02

### Phase 5: Polish, SEO & Launch
**Status**: ⬜ Not Started
**Objective**: Refinar as animações visuais, verificar acessibilidade, criar metatags (Title/Descriptions), adicionar o Blog/Notícias e validar a infraestrutura (Vercel ou similar).
**Requirements**: REQ-05
