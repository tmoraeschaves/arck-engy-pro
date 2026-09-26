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
| 4 | ✅ **FEITA (2026-08-31, opção B)** — `hooks/projeto-reducer.js`: `useReducer` possui todo o documento (nós, ligações, formas, anotações, cores, fundo, sector, modo) com **21 acções nomeadas** (`ADICIONAR_NO`, `LIGAR`, `CARREGAR_PROJETO`, `RESETAR`…). `LIGAR` faz o gate de regra+modo+duplicados. `App.jsx` perdeu 9 `useState` de documento e todas as mutações inline (JSX incluído) passaram a `dispatch`. | Médio-alto | ✅ `projeto-reducer.test.mjs` (25, cada transição) + `App.integration.test.jsx` (5, fluxo real render→dispatch). Build verde. |
| 5 | ✅ **FEITA (2026-09-03)** — `hooks/useVistaCanvas.js` (zoom/pan/3D + `centro3D`); `componentes/No.jsx`, `Ligacao.jsx`, `Anotacao.jsx`, `Forma.jsx` (folhas, props-in); `componentes/Canvas.jsx` (o `<main>` inteiro — mundo 3D, camada SVG, painéis flutuantes, overlays); `hooks/useAtalhos.js` (teclado/mouseup/mousedown global — **corrigiu os 2 erros de lint pré-existentes**). `App.jsx` 1072→848 linhas. | Alto | ✅ `useVistaCanvas.test.jsx` (3), `No/Ligacao/Anotacao/Forma.test.jsx` (14) + **`App.canvas.test.jsx` (6)** — simula sequências reais mousedown→mousemove→mouseup e keydown através do DOM (arrastar nó, ligar válido/inválido, corte por teclado, colocar+arrastar forma). Não mockado — prova o fio Canvas↔useAtalhos↔reducer de ponta a ponta. **134 testes totais.** O que isto não cobre (precisa de olho humano): o aspecto visual real, a perspectiva 3D CSS, a sensação do arrasto. |
| 6 | ✅ **FEITA (2026-09-05)** — `App.jsx` = composição final. `showLabels` deixou de ser `useState` morto (era `true` fixo, sem toggle nem setter — passou a `const`). Removidos 7 imports mortos deixados pela Fatia 5 (`ShapeElements`/`ShapePreview`, `GEO_SHAPES`, `No`, `Ligacao`+`MarcadoresLigacao`, `Anotacao`, `Forma`, `Save`/`Maximize2`/`Minimize2`) — tudo isso já só é usado dentro do `Canvas.jsx`. | Baixo | 134 testes verdes, build limpo. `App.jsx` 850→844 linhas (a queda grande já tinha acontecido na Fatia 5; **1293→844 no total do Movimento 7, −35%**). |

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

## Estado (2026-09-03)

**`App.jsx` 1293 → 848 linhas (−35%).** Fatias 1–5 feitas. Só falta a Fatia 6 (composição final +
um `useState` morto), que é baixo risco.

Órfãos `useArckCore.js` e `components/MentorPanel/` apagados (RL-37 confirmado). Lint: dos 6 erros
originais dos "Cannot access variable before it is declared" (`cutConnections`/`removeNode`),
**ambos resolvidos** ao virar `useAtalhos`. Restam 2 avisos "Cannot access refs during render" em
`fileInputRef.current.click()` — tentei isolar o acesso ao ref num `useCallback` próprio
(`abrirImportador`) e a regra continuou a disparar; é código pré-existente (não tocado por esta
fatia), o padrão (ler `.current` dentro de um `onClick`) é seguro em runtime, e a regra
`react-hooks/refs` (nova no eslint-plugin-react-hooks v7) parece não conseguir provar isso
estaticamente quando o handler vem de um array de dados percorrido no JSX. Não escondido: fica
registado, não é bug, não está em CI.

Ficheiros novos: `config/` (6), `lib/` (3), `infra/` (2), `hooks/` (`projeto-reducer.js`,
`useVistaCanvas.js`, `useAtalhos.js`), `componentes/` (`FormasSVG`, `No`, `Ligacao`, `Anotacao`,
`Forma`, `Canvas`), infra de testes (vitest/jsdom/RTL). **128 testes** (core 53 + ui-web 75). Build verde.

**Correcções de bugs nesta sessão (independentes do M7):**
- **Tailwind v4 não compilava** — `index.css` tinha sintaxe v3; `output.css` era snapshot obsoleto
  (e `index.html` ainda tinha um `<link>` morto para ele). Corrigido para `@import "tailwindcss"` +
  `@config`; ambos removidos. Todo o texto branco em fundos escuros estava a cair para preto.
- **Contraste** — tons de texto fino subidos (`text-white/30→55`, `/40→60`, `/50→70`, `slate-500→400`).
- **Vista 3D inutilizável** — folha 2D ia edge-on e desaparecia. Corrigido: rotação limitada a
  ±68° (`LIMITE_3D`), pivô no centro do desenho (`centro3D`), `preserve-3d`, ícones com cor
  explícita (`cloneElement`) em vez de `currentColor` (que parte sob transform 3D no Chromium).
  Tecto: continua uma folha inclinada, não um sólido orbitável (isso = Three.js, v2).

**Movimento 7 completo (fatias 1–6).** Falta: **smoke manual no browser** (obrigatório antes do
merge — ver checklist no PR) → merge de `mov7-fatia5` → LICENSE/README/nome → ícones por sector
(ver secção própria abaixo).

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

## Ícones por sector — ✅ FEITA (2026-09-05)

Os ícones de camada eram fixos e iguais em todos os sectores (Wifi/Cpu/Battery/Wrench/Repeat).
Com 11 sectores, "RESERVATÓRIO" (Hidráulica, L1) mostrava um ícone de wifi — resolvido.

Cada sector em `SECTORS` ganhou um `icons: { L1..L5 }` opcional (referências a componentes
lucide-react); `componentes/IconeCamada.jsx` resolve o ícone do sector activo, com fallback
para o genérico (`LAYER_ICONS` em `config/camadas.js`, ex-`camadas.jsx` — ficou puro depois
do ícone sair, sem JSX). Engenharia usa o genérico porque já bate certo (Wifi=sensor,
Cpu=lógica, Battery=potência, Wrench=actuação, Repeat=feedback); os outros 11 sectores
(incluindo **Mecatrónica**, adicionado depois) têm ícones próprios.
5 testes novos (`IconeCamada.test.jsx`).

**Mecatrónica** (2026-09-05, pedido do Tiago) — 12º sector: SENSOR→CONTROLO→ACIONAMENTO→
MOVIMENTO→REALIMENTAÇÃO. Também nesta sessão: texto dos cartões do modal de sector reduzido
(2 camadas em vez de 3 + `break-words`) — estava a transbordar da caixa com nomes longos
("TRANSFORMAÇÃO", "ACOMPANHAMENTO"). E **fundo do canvas por arrastar-largar ou colar
(Ctrl+V)**, além do botão de upload — `infra/persistencia.js:lerImagemComoDataURL`,
`hooks/useColarImagem.js`, `onDragOver`/`onDrop` no `Canvas.jsx`. 4 testes novos.

## Trava do plano de fundo — ✅ FEITA (2026-09-05)

Pedido do Tiago: ao usar uma imagem de fundo como esboço-guia (ex.: uma planta), um clique
mal dado ao tentar apagar um nó/camada podia apagar o fundo junto — não havia distinção entre
"apagar o que desenhei por cima" e "apagar o esboço que estou a usar de base". Precisava de
uma trava explícita, com destrava para quando ele realmente quiser trocar/remover o fundo.

Resolvido ao nível do reducer (`hooks/projeto-reducer.js`), não só na UI — o mesmo padrão já
usado para a validade das ligações (`podeLigar`):
- Novo campo de documento `bgLocked` (persiste em `snapshot`/`CARREGAR_PROJETO`).
- Nova acção `ALTERNAR_BLOQUEIO_FUNDO` (liga/desliga a trava).
- `DEFINIR_FUNDO` com `img=null` (remover) é *no-op* quando `bgLocked` é verdadeiro.
  → **Revisto no smoke test (2026-09-06, `e175cac`):** o Arquitecto quis "trancar" = fechar.
  `DEFINIR_FUNDO` passa a ser no-op **completo** quando `bgLocked` (nem remover, nem substituir
  por colar/arrastar/carregar). CARREGAR IMAGEM desactivado no painel. Teste actualizado.
- `RESETAR` poupa `bgImage` quando `bgLocked` é verdadeiro (um esboço-guia trancado sobrevive
  ao reset do diagrama).

UI (`componentes/Canvas.jsx`, painel "Plano de Fundo"): botão TRANCAR/TRANCADO (ícones
`Lock`/`Unlock` do lucide-react) e o botão REMOVER fica desactivado (cinzento, `cursor-not-
allowed`) enquanto trancado — reforça visualmente a garantia que já vem do reducer.

5 testes novos no reducer (`projeto-reducer.test.mjs`): toggle, remoção bloqueada trancado,
substituição continua permitida trancado, reset poupa o fundo trancado. Total: **147 testes**
(42 core + 11 fronteira + 94 ui-web). Build e lint confirmados sem regressões (os 2 avisos/
erros de lint são os já conhecidos e documentados — `react-hooks/refs` no `App.jsx` e
`react-hooks/exhaustive-deps` no `useAtalhos.js` — não relacionados com esta mudança).

## Bug: escrever notas era engolido pelos atalhos globais — ✅ CORRIGIDO (2026-09-05)

Reportado pelo Tiago: "a caixa de ferramentas de escrita para notas não está a funcionar,
tentei adicionar notas escritas e não consegui." Reproduzido primeiro com um teste antes de
mexer no código (`App.canvas.test.jsx`, "escrever na nota não é engolido pelos atalhos globais"):
escrever "corte 0-10%" na textarea da nota resultava em "orte 0-10%" — o "c" desaparecia.

Causa: `useAtalhos.js` ouve `keydown` na `window` para os atalhos (C=cortar, Delete=remover,
+/-/0=zoom, Escape). Esse listener não verificava se o alvo do evento era um campo de texto —
por isso, ao escrever numa nota (ou no nome de um modelo a guardar), a tecla "c" activava o
modo de corte com `preventDefault()`, o que impede o browser de sequer inserir o carácter na
caixa de texto. As outras teclas (Delete, +/-/0) tinham o mesmo problema, embora menos visível.

Corrigido com uma guarda no início do `onKey`: se `e.target` for `INPUT`, `TEXTAREA` ou
`isContentEditable`, o atalho global não corre (RL de fronteira — atalhos globais nunca devem
disparar por cima de um campo de texto focado). 1 teste novo, reproduz o bug antes da correcção
e confirma-a depois. Total: **149 testes** (42 core + 11 fronteira + 96 ui-web).

## Smoke test do Tiago — 2 rondas (2026-09-06 `e175cac`, 2026-09-08 `1402c6e`) — ✅ CORRIGIDO E VERIFICADO EM BROWSER

Depois de a `mov7-fatia5` ficar de pé, o Tiago testou à mão e reportou 4 problemas em duas
rondas. Todos corrigidos e **verificados num browser real** (Chrome headless via CDP: notas
escrevem, grelha aparece, nó trancado não se apaga, zero erros de consola).

### A "armadilha 3D" (a causa raiz de metade das queixas)

`is3D` era um *modo* que se ligava (painel 3D, presets, sliders) e ficava activo mesmo com as
três rotações a 0° — a vista parecia 2D mas `Canvas.onMouseDown` e `App.handleMouseMove` faziam
`if (is3D) return`, bloqueando **criar notas, arrastar nós e o snap** sem qualquer pista para o
utilizador. Os screenshots do Tiago mostravam a faixa "VISTA 3D" — ele não associou.

Correcção: **`is3D` passa a ser derivado da inclinação** (`useVistaCanvas`:
`!semInclinacao(rotX,rotY,rotZ)`). Nunca mais existe "3D activo mas à vista igual ao 2D".
`setIs3D` vira um shim (liga → dá inclinação inicial; desliga → repõe a 0°) para os sítios que
pensam em ligar/desligar. Faixa reescrita: "VISTA 3D — só rotação. Edição em pausa." + botão
**VOLTAR A EDITAR**. Presets/sliders/reset limpos do `setIs3D` redundante.

### Travar nós — de toggle global para trava por nó (pedido do Tiago)

O toggle global "Travar Nós" no sidebar (a) só travava o arrasto, não a exclusão (botão direito
e Delete continuavam a apagar), e (b) o Tiago preferia "uma opção de seleccionar para travar".

- Novo: `node.locked` (viaja no `snapshot`, sem código). Acção `ALTERNAR_TRAVA_NO`.
- **Guarda dura no reducer:** `REMOVER_NO` e `MOVER_NO` são no-op num nó trancado — nenhum
  caminho da UI (botão direito, Delete, futuro) o consegue apagar ou mover.
- `No.jsx`: quando o nó está seleccionado ou trancado, aparece um cadeado no canto
  (`data-testid="trava-no"`) — clicar alterna a trava. Nó trancado mostra o cadeado âmbar sempre.
- Removido: estado `lockNodes` e o botão do sidebar; `lockNodes` fora de `App`/`Canvas`/`useAtalhos`.

### Notas não escreviam / texto invisível

Além da armadilha 3D, a cor do texto (`text-amber-900` do Tailwind) podia herdar o branco do
tema escuro. Correcção: **cor explícita inline** (`config/notas.js`) + `userSelect:text` na
textarea + foco em `requestAnimationFrame` (o `.focus()` durante o mousedown era desfeito pelo
browser) + só apaga por blur depois de ter sido mesmo focada. **Extra pedido pelo Tiago:**
paleta de 6 cores por nota (`DEFINIR_COR_ANOTACAO`, ícone de paleta no cabeçalho da nota).

### Grelha de pontos invisível

Era um `background-image: radial-gradient` num `<div>` — `#CBD5E1` a 50% de opacidade sobre
`#FAFAFA`, na prática invisível. Passou a um **`<pattern>` SVG** na camada do desenho, alinhado
exactamente com os pontos de snap (círculo no canto do tile → ponto inteiro em cada
intersecção múltipla de `GRID_SIZE`). O snap sempre esteve correcto — faltava ver a grelha.

### 3ª ronda (2026-09-08) — trava das formas + onde nascem os nós

- **Formas geométricas trancáveis** (o Tiago notou que a trava por nó não cobria as formas).
  Mesmo padrão: `forma.locked`, acção `ALTERNAR_TRAVA_FORMA`, guardas duras no reducer
  (`MOVER_FORMA` / `REDIMENSIONAR_FORMA` / `REMOVER_FORMA` são no-op numa forma trancada),
  cadeado no canto quando seleccionada ou trancada (`Forma.jsx`, `data-testid="trava-forma"`).
  Forma trancada não mostra alças de redimensionar.
- **Nós nascem à direita do centro da área visível** (`addNode`), não amontoados no canto
  superior esquerdo. Converte o ponto de ecrã (~58% da largura, ~44% da altura do `<main>`)
  para coordenadas do canvas com o `offset`/`zoom` actuais, mais uma dispersão aleatória.
- **O cadeado global do sidebar continua removido** — a trava é sempre por elemento
  (nó ou forma), aparece na selecção. Não há "trancar tudo".

### 4ª/5ª ronda (2026-09-08) — CARGA, autosave, medidor de integridade

- **CARGA passava dos 100%** (`76ab7fa`) — a fórmula linear (`30+nós*5+links*2+…`) chegava a
  118%. Substituída por uma que satura (`100*(1-e^-(nós*0.07+links*0.035))`) + clamp [0,100].
- **Forma trancada não seleccionada** parecia um cadeado a flutuar (`76ab7fa`) — o wireframe
  do cubo não preenche a bounding box. Agora desenha-se um contorno âmbar ténue à volta.
- **Autosave — "continuar de onde parei"** (`9eaf770`). Antes, fechar ou actualizar o browser
  começava do zero (o `localStorage` só era escrito no *Exportar JSON*). Agora:
  `autoguardarProjetoLocal` grava o snapshot a cada mudança (useEffect, 500ms de atraso para
  não escrever a cada pixel do arrasto; se estourar a quota tenta sem o `bgImage`);
  `lerProjetoLocal` recupera no inicializador do `useReducer` (nunca rebenta — JSON corrompido
  → começa vazio). Modal de sector e tutorial não reaparecem se o projecto foi recuperado.
- **Decisão do Arquitecto sobre os medidores** (`9eaf770`): a "CARGA" era um número inventado
  sem significado real (não modela capacidade nenhuma — um diagrama parado não carrega nada).
  Removida. As 12 barras animadas do cabeçalho passam a **mostrar a INTEGRIDADE**: altura e
  cor vêm de `health` (verde alto e vivo em Guiado 99,8%; vermelho baixo e parado em ERRO;
  cinza ténue em INÉRCIA). O `pulse` só faz a onda mexer. Quem diz se está "sólido" é a
  integridade — nunca foi a carga.

### Página em branco — Google Translate a partir o React (`b46e5a7`)

O Tiago abriu a app e apareceu **ecrã branco** com o aviso "Traduzido para português" do
Chrome. Causa: `index.html` tinha `lang="en"` (default do Vite) e a app é toda escrita em
português — o Chrome oferecia traduzir e, ao trocar os nós de texto do DOM, a reconciliação
do React estoirava (`removeChild` num nó que já não era dele) → árvore desmontada, sem
error boundary → branco. Ficou mais provável agora porque há mais estado a tiquetaquear
(o `pulse` das barras de integridade) a forçar re-renders sobre o DOM mexido.

- `index.html`: `lang="pt-PT"` + `translate="no"` + `<meta name="google" content="notranslate">`.
- `componentes/LimiteDeErro.jsx` — error boundary à volta do `App` (`main.jsx`): se rebentar
  por outra razão, mostra "Recarregar" em vez de branco (o autosave não perde o diagrama).
- `<title>`: "ui-web" → "Architect & Engineer".

**133 testes ui-web** (5 de persistência/autosave + 1 de integração "fechar e reabrir" + 2 do
error boundary; mais os das rondas anteriores). Build OK, lint 3 (abaixo do baseline 4).

### O que o "Snap à Grade" faz

Ao arrastar (ou criar) um nó, a posição é arredondada ao ponto de grelha mais próximo —
múltiplos de `GRID_SIZE` (50px em coordenadas do canvas). Serve para alinhar nós entre si
sem os medir à mão. Só afecta nós; as formas e as notas movem-se livremente. A grelha de
pontos (botão ao lado) mostra exactamente esses pontos de encaixe — os dois costumam usar-se
juntos mas são independentes.

## Aninhamento (visão explodida) — nota para o desenho

Ao desenhar `useDiagrama.js` e o modelo de `No`, deixar a porta aberta a um nó conter o seu
próprio sub-diagrama (campo opcional `filho?: Diagrama`). Não implementar agora — só não
fechar a porta com um modelo rígido de mais.

> **Actualização 2026-09-05:** deixou de ser v2. O Arquitecto promoveu-o a prioridade
> (DEC-013) — ver **`docs/MOVIMENTO_8.md`**. Fatia 1 (modelo de dados + reducer) feita.

## Fecho (2026-09-26, DEC-016) — App.jsx = composição de verdade

A Fatia 6 de 2026-09-05 deixou o `App.jsx` com ~850 linhas: cabeçalho, barra lateral,
painel 3D, biblioteca, tutorial e modais continuavam lá dentro. Concluído o que a
estrutura-alvo acima previa:

- **Componentes novos:** `Cabecalho` (com as barras de integridade e o input de importação),
  `BarraLateral`, `BarraEstado`, `PainelFluxo`, `Painel3D`, `Biblioteca`, `Tutorial`,
  `ModalSector`, `ModalGuardarModelo`.
- **Hooks novos:** `useArrastos` (o `onMouseMove` e o estado de arrasto — substitui a
  ideia de `useFormas`/`useDiagrama` separados, já que o mouse-move é um só despachante),
  `useIntegridade` (em vez de calcular health/análise no App).
- **Resultado:** `App.jsx` 885 → 342 linhas (o alvo de ~120 era optimista: o App mantém o
  estado de interacção partilhado entre Canvas, atalhos e painéis e os callbacks de
  domínio — mover isso para mais hooks só trocaria props por parâmetros).
- **ESLint a 0** — ver DEC-016: os "2 erros de baseline" eram parsing errors que escondiam
  `App.jsx` e `Forma.jsx` do lint; ao corrigi-los apareceram 2 bugs reais.
