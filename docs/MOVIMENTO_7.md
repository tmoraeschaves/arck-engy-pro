# Movimento 7 — Quebrar o monólito `App.jsx`

> Estado: **em curso** (iniciado 2026-08-31)
> Regra de ouro mantida: a fonte única de validação é `packages/core/src/`. Nada de lógica de domínio nos componentes.

## Porquê

`App.jsx` tem 1293 linhas: config, ponte para o core, lógica de fluxo, ~50 `useState`,
efeitos, handlers, exportação, persistência e ~725 linhas de JSX — tudo num ficheiro.
Um projecto open-source sobre arquitectura limpa não pode ter isto lá dentro (contradiz a tese).
E a visão da vista explodida (canvas recursivo) é impossível de construir sobre este monólito.

## Alvo — camadas (Manual Esqueleto v2.0, Parte 1)

```
packages/ui-web/src/
├── config/            ← dados estáticos, zero lógica
│   ├── camadas.jsx    ← LAYERS, LAYER_KEYS  (tem JSX nos ícones)
│   ├── sectores.js    ← SECTORS
│   ├── formas.js      ← GEO_SHAPES
│   ├── templates.js   ← TEMPLATES
│   ├── tutorial.js    ← TUTORIAL_STEPS
│   └── app-meta.js    ← METRICS, GRID_SIZE
├── lib/               ← funções puras, testáveis (L2 sem estado)
│   ├── uid.js
│   ├── core-bridge.js ← toNo, toLigacoes, toModo, isValidLink, displayTensao  [TESTES]
│   └── flow-report.js ← computeFlowReport                                      [TESTES]
├── infra/             ← efeitos colaterais isolados (L4)
│   ├── persistencia.js ← localStorage (projecto + modelos), import/export JSON
│   └── exportar.js     ← buildSVG, exportSVG, exportPNG
├── hooks/             ← orquestração de estado (L2)
│   ├── useDiagrama.js   ← nodes, connections, selecção, connect, cut, escala
│   ├── useFormas.js     ← shapes: colocar, arrastar, redimensionar
│   ├── useAnotacoes.js  ← annotations
│   ├── useModelos.js    ← userModels (guardar/carregar/apagar)
│   ├── useVistaCanvas.js← zoom, offset, pan, rotação 3D
│   └── useSector.js     ← sector + freeMode + persistência do sector
├── componentes/       ← apresentação (props-in, sem lógica de domínio)
│   ├── ModalSector.jsx
│   ├── Cabecalho.jsx
│   ├── BarraLateral.jsx
│   ├── Canvas.jsx        ← o mundo SVG (delega em No/Ligacao/Forma/Anotacao)
│   ├── No.jsx  Ligacao.jsx  Forma.jsx  Anotacao.jsx  FormasSVG.jsx (ex-ShapeElements)
│   ├── PainelFluxo.jsx
│   ├── BarraEstado.jsx
│   ├── Painel3D.jsx
│   ├── Biblioteca.jsx
│   ├── Tutorial.jsx
│   └── ModalGuardarModelo.jsx
└── App.jsx            ← só composição (~120 linhas)
```

## Fatias (cada uma: build verde + testes verdes antes de avançar — RL-38)

| # | Fatia | Risco | Testes |
|---|---|---|---|
| 1 | ✅ **FEITA (2026-08-31)** — `config/` (camadas, sectores, formas, templates, tutorial, app-meta) + `lib/` (uid, core-bridge, flow-report) extraídos. `App.jsx` 1293→1109 linhas. `_arck`/`_engy` singletons agora só existem na ponte. `computeFlowReport` perdeu o param morto `layerNameFn`. | Baixo | ✅ `teste-ponte.mjs` (14) + `teste-fluxo.mjs` (8) via `tsx`. `npm test` agora corre core (53) + ui (22) = 75. Build verde. Lint das pastas novas: limpo. |
| 2 | ✅ **FEITA (2026-08-31)** — `infra/persistencia.js` (localStorage projeto+modelos, import/export JSON) + `infra/exportar.js` (`construirSVG` puro + `exportarSVG`/`exportarPNG`). `localStorage` disperso pelo `App.jsx` reduzido a 2 chamadas (`ae_tutorial`, ainda por extrair na Fatia 4). | Baixo-médio | ✅ `teste-exportar.mjs` (6). Build verde. `npm test` = 81. |
| 3a | ✅ **FEITA (2026-08-31)** — `componentes/FormasSVG.jsx` (`ShapeElements` + `ShapePreview`). `App.jsx` 1293→1077 linhas. | Baixo | Build verde |
| 3b | `componentes/` restantes de apresentação de superfície estreita: `BarraEstado`, `Tutorial`, `ModalGuardarModelo`, `ModalSector` | Médio | Build + smoke visual — **precisa de execução real** |
| 4 | ✅ **FEITA (2026-08-31, opção B)** — `hooks/projeto-reducer.js`: `useReducer` possui todo o documento (nós, ligações, formas, anotações, cores, fundo, sector, modo) com **21 acções nomeadas** (`ADICIONAR_NO`, `LIGAR`, `CARREGAR_PROJETO`, `RESETAR`…). `LIGAR` faz o gate de regra+modo+duplicados. `App.jsx` perdeu 9 `useState` de documento e todas as mutações inline (JSX incluído) passaram a `dispatch`. | Médio-alto | ✅ `projeto-reducer.test.mjs` (25, cada transição) + `App.integration.test.jsx` (5, fluxo real render→dispatch). Build verde. |
| 5 | `Canvas.jsx` — o mundo SVG + mundo 3D (`No`, `Ligacao`, `Forma`, `Anotacao`) | Alto | Smoke visual + testes de componente |
| 6 | `App.jsx` = composição; apagar `useArckCore.js` + `MentorPanel/` órfãos (RL-37: só depois de confirmar); resolver lint pré-existente (`setShowLabels` morto, `useEffect` de teclado antes das callbacks) | Médio | Build + suite completa + smoke |

## Infra de testes da UI — FEITA (2026-08-31, decisão do Tiago)

`packages/ui-web` passou a ter **vitest + jsdom + @testing-library/react**.
- `vitest.config` dentro do `vite.config.js` (herda o alias `@arck/core`)
- `vitest.setup.js` — jest-dom + cleanup + `localStorage.clear()` entre testes
- Testes puros migrados para `packages/ui-web/testes/*.test.mjs`
- Testes de componente em `src/**/*.test.jsx` (ex.: `FormasSVG.test.jsx`)
- `npm test` na raiz: core (tsx, 53) + ui-web (vitest, 27) = **80**
- Core continua em `tsx` — fronteira limpa: `packages/core` = tsx, `packages/ui-web` = vitest

## Fork de arquitectura na Fatia 4 — DECISÃO DO TIAGO

O `App.jsx` **não decompõe em 6 hooks independentes**. Razão: `loadModel`/`loadProject`/`resetSystem`
são operações sobre *todo* o estado (nodes + connections + shapes + annotations + colors + bg + sector),
e o `handleMouseMove` é um mega-dispatcher que toca todos os domínios. Opções:

- **A — `useProjeto()` único**: um hook possui todo o estado do diagrama + load/save/reset. Hooks
  pequenos só para o que é mesmo independente (`useVistaCanvas` = zoom/pan/3D, `useTutorial`).
- **B — `useReducer` + acções**: `carregarProjeto`, `resetar`, `adicionarNo`… Estado central, transições
  explícitas e testáveis. Mais trabalho, melhor fim.
- **C — hooks por domínio + um `useProjetoIO` à parte** que orquestra o load/save chamando os setters
  dos outros. Fronteiras mais suaves mas o IO fica com conhecimento de todos.

Recomendação: **B** para um projecto que se quer mostrar como exemplo de arquitectura limpa —
mas é decisão do Arquitecto.

## Estado (2026-08-31, fim da sessão)

**`App.jsx` 1293 → ~1072 linhas.** ~200 linhas de lógica de estado saíram para um reducer puro testado.

Feito: Fatias 1–4 + parte da 6 (órfãos `useArckCore.js` e `components/MentorPanel/` apagados —
RL-37 confirmado; lint reduzido de 6 erros para 2 pré-existentes — o `useEffect` de teclado que
referencia callbacks declaradas depois, a resolver quando o teclado virar `useAtalhos` na Fatia 5).

Ficheiros novos: `config/` (6), `lib/` (3), `infra/` (2), `componentes/FormasSVG.jsx`,
`hooks/projeto-reducer.js`, infra de testes (vitest/jsdom/RTL), `testes/*.test.mjs`,
`src/**/*.test.jsx`. **110 testes** (core 53 + ui-web 57). Build verde.

**Correcções de bugs nesta sessão (independentes do M7):**
- **Tailwind v4 não compilava** — `index.css` tinha sintaxe v3; `output.css` era snapshot obsoleto.
  Corrigido para `@import "tailwindcss"` + `@config`; `output.css` apagado. Todo o texto branco
  em fundos escuros estava a cair para preto.
- **Contraste** — tons de texto fino subidos (`text-white/30→55`, `/40→60`, `/50→70`, `slate-500→400`).
- **Vista 3D inutilizável** — folha 2D ia edge-on e desaparecia. Corrigido: rotação limitada a
  ±68° (`LIMITE_3D`), pivô no centro do desenho (`centro3D`), `preserve-3d`, ícones com cor
  explícita (`cloneElement`) em vez de `currentColor` (que parte sob transform 3D no Chromium).
  Tecto: continua uma folha inclinada, não um sólido orbitável (isso = Three.js, v2).

**Falta:** Fatia 5 (`Canvas.jsx` + `No`/`Ligacao`/`Anotacao` + `useAtalhos`) → Fatia 6 (App = composição).

## Decisões tomadas

- **Runner de testes da `ui-web`: vitest + jsdom + @testing-library/react** (DEC-009). A ideia
  inicial era `node --test` nativo sem dependências; foi revertida na Fatia 4 porque testar hooks
  e componentes React exige um ambiente DOM e um render de teste. Fronteira: `packages/core` = `tsx`,
  `packages/ui-web` = `vitest`. Os testes puros migraram para `packages/ui-web/testes/*.test.mjs`.
- **`useArckCore.js` e `MentorPanel/`**: órfãos confirmados. Adaptadores reaproveitados na ponte
  `lib/core-bridge.js`; ficheiros apagados na Fatia 6 (RL-37: verificado sem referências).
- **Nomes de ficheiros em português** para alinhar com o resto do projecto; identificadores
  seguem o que já existe no código.
- **CI**: o job `test-core` corre também `npm run test:ui` (`cd packages/ui-web && vitest run`).

## Aninhamento (visão explodida) — nota para o desenho

Ao desenhar `useDiagrama.js` e o modelo de `No`, deixar a porta aberta a um nó conter o seu
próprio sub-diagrama (campo opcional `filho?: Diagrama`). Não implementar agora — só não
fechar a porta com um modelo rígido de mais.
