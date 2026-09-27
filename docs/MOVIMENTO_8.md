# Movimento 8 — O que cabe dentro de cada camada

> Estado: **concluído** (2026-09-05 → 2026-09-27)
> Decisão que o abre: **DEC-013**. Regra de ouro mantida: a validação de domínio vive
> em `packages/core/src/`; o reducer é a máquina de estados do documento.

## Porquê

Uma camada (L1–L5) representa uma responsabilidade — mas o trabalho real dessa
responsabilidade são **módulos e funções concretos**. Sem um sítio para os arrumar,
o utilizador anda "indo e voltando" entre o diagrama e notas soltas. O Arquitecto
decidiu (DEC-013) resolver isto agora, com o modelo de dados, para não o reescrever
depois.

## O modelo (híbrido — DEC-013)

Cada nó ganha uma lista opcional:

```
node.modules?: Modulo[]

Modulo = {
  id:    string,
  label: string,          // "Autenticação", "parseInput()", "users.sql"
  kind?: string,          // livre: "módulo" | "função" | "ficheiro" | "serviço" | ...
  nota?: string,          // descrição curta opcional
  filho?: Diagrama | null, // null = ainda é só um item de lista.
                           // objeto = foi PROMOVIDO a mini-diagrama próprio.
}

Diagrama = { nodes, connections, shapes, annotations }
  // herda sector / cores / fundo do pai — não os repete.
```

- **Lista primeiro.** Um módulo nasce como texto numa lista. Barato, rápido de escrever.
- **Promoção sob demanda.** Só quando esse módulo precisa de detalhe próprio é que
  ganha um `filho` (um mini-ARCK). Nunca por omissão.
- **Limite de profundidade: 3 níveis.** O reducer recusa promover além disso. O
  Arquitecto foi explícito: nada de "camada dentro de camada dentro de camada" sem fim.

### Guiado vs. Livre (DEC-013 → revisto pela DEC-014, 2026-09-06)

> **DEC-013 dizia:** o Modo Guiado abria um nó com módulos já semeados de um template
> M0–M5. **DEC-014 reverteu:** o M0–M5 é processo, não camada — sai. Não há template de
> arranque; o painel de módulos (Fatia 2a) é idêntico nos dois modos.

O mesmo `Modulo` serve os dois modos. **Não há campo novo, nem ramo no reducer, nem
template.** A única diferença Guiado vs. Livre é a que a app já tem: o Guiado valida o
fluxo L1→L2→L3→L4→L5; o Livre aceita qualquer ligação. Em ambos, um nó começa sem
módulos e o utilizador escreve os seus.

#### Resolução (2026-09-06, DEC-014) — o M0–M5 fica de fora

O Arquitecto fechou: **o Modo Guiado não semeia nada.** M0–M5 são **fases do processo**
(Mentalidade → Descobrir → Projetar → Construir → Proteger → Entregar), não módulos que
vivam dentro de uma camada L1–L5 — *"não é arquitectura, é engenharia; é o processo
posterior"*. Meter M0–M5 na lista de um nó era um erro de categoria.

Sem template de arranque, **Guiado e Livre não se distinguem ao nível dos módulos** — o
painel da Fatia 2a serve os dois igual. A distinção Guiado vs. Livre continua a ser só a
que já está na app: o Guiado valida o fluxo L1→L2→L3→L4→L5, o Livre aceita qualquer
ligação. **A Fatia 2b é cancelada.**

O M0–M5 como auxílio (checklist de fases ao nível do projecto, opt-in, só para software)
fica como ideia parqueada para um movimento futuro — não é o Movimento 8.

## Navegação — duas vistas, à escolha (DEC-013)

Ambas disponíveis, o utilizador escolhe (como "ver como lista / ver como ícones"):

1. **Painel lateral** — seleccionar um nó abre a sua lista de módulos ao lado. O
   canvas principal não muda. É a vista de trabalho rápido.
2. **Duplo-clique entra** — duplo-clique num nó (ou num módulo já promovido) abre o
   conteúdo no próprio canvas, com uma barra de migalhas de pão (`Sistema › L3 Lógica ›
   Autenticação`) para voltar.

**Rejeitado (DEC-013):** zoom infinito para dentro do nó; aninhamento sem limite.

## Fatias

| # | Entrega | Risco | Estado |
|---|---------|-------|--------|
| **1** | Modelo de dados + acções do reducer (`ADICIONAR_MODULO`, `EDITAR_MODULO`, `REMOVER_MODULO`, `MOVER_MODULO`) + testes. Sem UI. | Baixo (aditivo, reversível) | ✅ **feita** |
| **2a** | Painel lateral de módulos: duplo-clique num nó abre a lista; adicionar / editar `label` e `nota` / escolher `kind` / reordenar / remover. Contador de módulos no nó. Vocabulário de `kind` (`config/modulos.js`). Serve o **Modo Livre** por inteiro. | Médio | ✅ **feita** |
| ~~2b~~ | ~~Template de arranque do Modo Guiado.~~ **Cancelada (DEC-014, 2026-09-06):** o M0–M5 é processo, não camada — não há template. Guiado e Livre partilham o painel da 2a. | — | ❌ **cancelada** |
| 3 | `PROMOVER_MODULO` / `DESPROMOVER_MODULO` (com guarda dos 3 níveis) + testes. Botão "abrir como diagrama" no painel. | Médio | ✅ **feita** |
| 4 | Entrar no sub-diagrama; barra de migalhas; o mesmo Canvas mostra o nível actual. Persistência (JSON) do `filho`. | Alto | ✅ **feita** |
| 5 | Export (SVG/PNG/print) ciente da profundidade; modelos guardam sub-diagramas. | Médio | ✅ **feita** |

**Plano validado pelo Arquitecto a 2026-09-27** ("vamos continuar as fatias") — fatias 3, 4 e 5 feitas nesse dia. **Movimento 8 concluído.**

## Fatia 1 — o que entrou (2026-09-05)

`hooks/projeto-reducer.js`:
- `Modulo` documentado; nós podem ter `modules: Modulo[]` (campo opcional, ausente = sem módulos).
- `ADICIONAR_MODULO { noId, modulo }` — anexa; ignora se o nó não existe.
- `EDITAR_MODULO { noId, moduloId, patch }` — merge de `label`/`kind`/`nota`; nunca toca em `id`/`filho`.
- `REMOVER_MODULO { noId, moduloId }`.
- `MOVER_MODULO { noId, moduloId, direccao: -1 | +1 }` — troca com o vizinho; nos limites é no-op.
- `snapshot` / `CARREGAR_PROJETO` já transportam `modules` (andam com o nó, sem código novo).
- `REMOVER_NO` já leva os módulos do nó com ele.

Testes: `testes/projeto-reducer.test.mjs`, bloco "módulos dentro de um nó".

## Fatia 2a — o que entrou (2026-09-05)

- `config/modulos.js` — vocabulário de `kind` (Módulo, Função, Ficheiro, Serviço, Dados,
  Interface, Integração, Segurança), cada um com o seu ícone lucide. `kind` só muda rótulo
  e ícone; o modelo por trás é sempre o mesmo.
- `componentes/PainelModulos.jsx` — painel lateral (à direita, como o Relatório de Fluxo),
  props-in. Lista os módulos do nó: escolher `kind` (select), editar `label` e `nota`
  (inputs), reordenar (▲▼ → `MOVER_MODULO`), remover (🗑 → `REMOVER_MODULO`), "Adicionar
  módulo" (→ `ADICIONAR_MODULO`, nasce como "Novo módulo"/`modulo`).
- `componentes/No.jsx` — duplo-clique no nó (`onAbrir`) abre o painel; contador com o nº de
  módulos no canto do bloco quando > 0.
- `App.jsx` — estado `modulosNoId`; `abrirModulos`; `modulosNo` derivado de `nodes` (o painel
  segue as edições em tempo real e desaparece sozinho se o nó for apagado ou o diagrama
  resetado). Passa `abrirModulos` ao `Canvas`.
- Serve o **Modo Livre** por inteiro. O template de arranque do Modo Guiado é a Fatia 2b.

Testes: `componentes/PainelModulos.test.jsx` (6) + `App.canvas.test.jsx` (2 — duplo-clique
abre, adicionar mostra contador, fechar esconde). 111 testes ui-web.

**Não verificado no browser** (sessão autónoma, sem browser) — falta o smoke test manual do
Arquitecto: duplo-clique num nó, criar/editar/reordenar/remover módulos, confirmar o contador.

## Fatia 3 — o que entrou (2026-09-27)

`hooks/projeto-reducer.js`:
- **`caminho`** — qualquer acção de diagrama aceita `caminho: [{ noId, moduloId }, …]`. O reducer
  desce até ao `filho` desse módulo, aplica lá **a mesma lógica** (travas, validação do Guiado,
  contentores — nada duplicado) e volta a escrever. Sem caminho actua na raiz. Um no-op lá em
  baixo devolve o mesmo estado cá em cima. Acções do documento (sector, modo, cores, fundo,
  carregar, reset) ignoram o caminho.
- `PROMOVER_MODULO { noId, moduloId }` — dá ao módulo um `filho` vazio
  (`{ nodes, connections, shapes, containers, annotations }`). Já promovido → no-op (nunca
  apaga o que lá está). **Guarda dos 3 níveis:** raiz (1) → 2 → 3; promover dentro do nível 3
  é recusado — lá os módulos existem, mas só como lista.
- `DESPROMOVER_MODULO` — volta a item de lista; o sub-diagrama perde-se (a UI confirma antes).
- `diagramaEm(estado, caminho)` — o diagrama nesse caminho, ou `null` se já não existe.
- O `filho` viaja no snapshot: autosave, JSON e modelos guardam os sub-diagramas sem código novo
  (o que a Fatia 4 previa como "persistência" veio de graça).

## Fatia 4 — o que entrou (2026-09-27)

- **Entra-se pelo módulo, não pelo nó.** Um nó tem vários módulos, cada um com o seu diagrama —
  por isso o duplo-clique no nó continua a abrir o painel (vista 1), e cada módulo do painel tem
  **"Abrir como diagrama"** (promove e entra) ou **"Entrar no diagrama · N nós"** (vista 2).
  No nível 3 aparece "os módulos daqui ficam como lista". Desfazer o diagrama e apagar um módulo
  com diagrama pedem confirmação.
- **`App.jsx`** — estado `caminho`; o `dispatch` que o resto da app usa junta-lhe o caminho
  actual, por isso canvas, arrastos, atalhos, biblioteca e contentores actuam no nível em que se
  está sem mudar cada chamada. Os callbacks do documento usam `despacharRaiz`. Se o caminho
  deixar de existir (nó apagado, reset, import), recua sozinho até ao último nível válido.
  Entrar/sair limpa a selecção e repõe a vista 1:1.
- **`Migalhas.jsx`** — `↑ · Sistema › SERVIÇO · Autenticação › GATEWAY · JWT`; cada passo volta
  a esse nível. Canvas vazio num sub-diagrama diz "Diagrama de «…»".
- Integridade, relatório de fluxo, barra de estado e exportação mostram **o nível actual**.

**Bug apanhado pelo lint antes de chegar ao browser:** vários `useCallback` omitiam o `dispatch`
das dependências (era estável; passou a mudar com o nível). Dentro de um sub-diagrama, apagar
um nó despachava para a raiz — no-op silencioso. Teste de regressão: apagar e ligar dentro do
sub-diagrama (verificado que falha com o bug reintroduzido).

Verificado em Chrome real: raiz → Autenticação (nível 2) → JWT (nível 3) → Sistema, por cliques
reais; 0 erros na consola.

## Fatia 5 — o que entrou (2026-09-27)

- **Exportar SVG/PNG de um sub-diagrama leva o título do caminho** (`Sistema › SERVIÇO ·
  Autenticação`), numa faixa própria acima do desenho — sem ele, uma exportação de nível 2/3
  parecia um diagrama solto. Na raiz não há título (exportação igual à de antes).
  Verificado em Chrome real (download interceptado: título, 3 nós e o contentor no ficheiro).
- **Modelos, JSON e autosave já guardavam os sub-diagramas** desde a Fatia 3 (o `filho` viaja
  no snapshot) — testado no reducer.
- **Imprimir/PDF** imprime o ecrã, e as migalhas já mostram o nível — nada a mudar.

Total: 244 testes (44 + 11 + 189).

