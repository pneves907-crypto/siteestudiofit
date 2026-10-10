# COWORK FITNESS — Redesign do site institucional

Site institucional estático (HTML/CSS/JS) construído a partir do PRD v1.0 — Outubro de 2026.

## Como visualizar

Não é preciso instalar nada. Basta abrir `index.html` no navegador, ou rodar um servidor local:

```bash
# Python
python -m http.server 8000

# ou Node
npx serve .
```

Depois acesse `http://localhost:8000`.

## Estrutura do projeto

```
index.html            Página inicial (hero, proposta, modalidades, infra, como funciona, depoimentos, contato)
modalidades.html      Musculação, Funcional, Pilates e Terapias (com âncoras navegáveis)
estudio.html          História desde 2020, filosofia, infraestrutura e modelo de escolha do profissional
duvidas.html          Perguntas frequentes (acordeão acessível)
contato.html          Formulário de aula experimental + WhatsApp + mapa
privacidade.html      Política de privacidade (LGPD) — em revisão
404.html              Página de erro
robots.txt            Regras de rastreamento + referência ao sitemap
sitemap.xml           Mapa do site
assets/css/styles.css Design tokens + todos os estilos
assets/js/main.js     Navegação mobile, WhatsApp contextual, formulário e animações
```

## Antes de publicar — checklist de validação com a empresa

Itens que ficaram **pendentes de confirmação** no PRD (seção 13) e já estão marcados no código:

| Item | Onde está no código | O que falta |
| --- | --- | --- |
| Logotipo oficial | `index.html` e todas as páginas (classe `.logo`, comentário "OBSOLOTO" no CSS) | Substituir o wordmark textual pelo arquivo original da marca (SVG/PNG), sem reconstruir a tipografia |
| Fotografias reais | Blocos `.foto` em todas as páginas, com legenda "imagem provisória" | Trocar cada bloco por `<img>` com foto autorizada do estúdio (WebP, com dimensões e `loading="lazy"`) |
| Endereço completo | `index.html`, `contato.html`, rodapé de todas as páginas | Hoje aparece apenas "Vila Madalena, São Paulo — SP"; inserir rua e número, e ajustar o marcador do mapa (coordenadas no `<iframe>` do OpenStreetMap) |
| Redes sociais | Não inseridos de propósito | Inserir Instagram e demais perfis no rodapé e na página de contato somente após confirmação das URLs oficiais (link quebrado reprova no checklist de aceitação) |
| Número do WhatsApp | `assets/js/main.js` → constante `WHATSAPP_NUMERO` (`5511940707066`) | Confirmar que é o número oficial e testar os links |
| Comodidades | `estudio.html` e `index.html` (café, frutas, toalhas, armários, duchas, manobrista) | Validar lista e condições de uso com a empresa |
| Depoimentos | `index.html`, seção 6 | Bloco reservado com aviso; publicar apenas depoimentos reais e autorizados |
| Respostas do FAQ | `duvidas.html` | Aprovação da empresa (especialmente valores, planos, parceiros e check-in) |
| Aula experimental | `contato.html` | Confirmar se é gratuita, modalidades disponíveis e como a equipe recebe as solicitações |

## Configurar o formulário

O formulário funciona em dois modos, definidos em `assets/js/main.js`:

```js
var ENDPOINT_FORMULARIO = "";
```

- **Com endpoint** (recomendado para produção): cole a URL do Formspree (ou use os atributos `netlify`/`data-netlify` do Netlify Forms). O formulário envia JSON, mostra estado de carregamento, sucesso e erro.
- **Sem endpoint** (estado atual): ao enviar, o site abre o WhatsApp com a solicitação já preenchida e mostra a mensagem de sucesso. **Nada se perde** — o contato chega pela conversa.

Proteções já incluídas: campo oculto anti-spam, validação de nome, WhatsApp (10–11 dígitos, com máscara brasileira) e modalidade, mensagens de erro associadas via `aria-describedby`, feedback de sucesso com `role="status"`.

> O texto deixa claro ao usuário que a solicitação **não é uma reserva confirmada** — requisito do PRD 7.2.

## Acessibilidade

- Link "pular para o conteúdo", navegação semântica e um único H1 por página.
- Foco visível (`:focus-visible`) e navegação completa por teclado.
- Rótulos explícitos, erros descritivos e áreas de toque ≥ 48 px.
- Contraste: roxo `#67068A` sobre branco/gelo passa AA em textos e botões; lilás `#B080C2` é usado apenas decorativo.
- `prefers-reduced-motion` desliga animações de entrada e rolagem suave.

## SEO

- Título e meta description exclusivos por página, canonical e Open Graph.
- `HealthAndBeautyBusiness` (JSON-LD) na página inicial — ajustar para o tipo mais específico se a empresa preferir.
- `sitemap.xml` e `robots.txt` prontos; `robots.txt` inclui referência às URLs antigas (`/sobre-ns`, `/infraestrutura`, `/duvidas`) para redirecionamento 301 no hospedador.
- Palavras-chave-alvo tratadas no conteúdo: estúdio fitness, personal trainer, musculação, funcional, Pilates e fisioterapia na Vila Madalena.

## Próximos passos sugeridos

1. Validar com a empresa os itens da tabela acima.
2. Configurar o endpoint do formulário e testar o recebimento.
3. Publicar em ambiente de testes (Netlify/Vercel permitem deploy por arrastar a pasta).
4. Configurar domínio, HTTPS, Google Search Console e Analytics (com consentimento se necessário).
5. Criar redirecionamentos 301 das URLs antigas e medir a linha de base de cliques no WhatsApp e envios de formulário.
