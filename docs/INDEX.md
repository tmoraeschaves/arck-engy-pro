# ARCK & ENGY Pro — Índice de Contexto

> Ponto de retomada de sessão. Lê este ficheiro primeiro.

## O que é este projecto

**ARCK** = o Arquitecto. Valida ligações entre camadas. Impede que se aprenda errado.
**ENGY** = o Medidor de Tensão. Supervisiona o estado — 4 estados.
**MENTOR** = o Pedagogo. Interpreta o estado e comunica com o utilizador.

Ferramenta visual de modelação de sistemas com 5 camadas (L1–L5), 7 sectores, canvas SVG interactivo. Stack: React + Vite + JavaScript (monorepo npm workspaces).

## Direcção do projecto

> Registo completo das decisões e das divergências em **`docs/DECISOES.md`**.

ARCK deixa de ser experiência privada. Passa a ser uma **ferramenta aberta e gratuita**,
peça de portefólio para ganhar credibilidade em arquitectura de sistemas. Vector de trabalho:

1. **Consolidar e limpar** ✅ feito (ver secção abaixo)
2. **Movimento 7** — quebrar o monólito `App.jsx` em camadas — fatias 1–4 feitas, faltam 5–6 (ver `docs/MOVIMENTO_7.md`)
3. **Layout novo** — linguagem visual definida em `docs/referencias/layout-alvo.md` (só o visual; portas/propriedades/aninhamento ficam v2)
4. **Renomear** — nome profissional novo (ARCK/ENGY é conceito interno) — *sessão própria, verificar domínio+marca; "Tekton" já rejeitado*
5. **Envelopar** — README (não existe), LICENSE (0 bytes), CONTRIBUTING, demo pública
6. **Anatomia como módulos** + camadas de arquitectura limpa aplicadas ao próprio código

## Visão da integração ADS (descrita por Tiago 2026-08-31 — NÃO confirmada, a validar antes de executar)

- **ARCK = o motor montado, visto em blocos.** As 5 camadas, os sectores, as ligações. O esboço macro.
- **ADS dentro do ARCK = a vista explodida.** Clicar num bloco abre-o: cada peça puxada para fora,
  alinhada, etiquetada — *o que é*, *o que faz*, *onde encaixa*, *a que se liga*. Cada peça pode
  ela própria explodir. **Camadas dentro de camadas**, como o diagrama de um motor desmontado.
- Os **6 módulos M0–M5** da Anatomia são os níveis da explosão — dão fim ao zoom, não é infinito.
- **Implicações:** (1) torna o Movimento 7 obrigatório — não se constrói canvas recursivo sobre
  monólito; (2) decisão de domínio nova — o modelo `No`/`Ligacao`/`Camada` é plano, precisa de
  aninhamento (um nó contém o seu próprio diagrama), a desenhar no `packages/core` com contrato+testes;
  (3) risco de explosão infinita — os 6 gates são a régua de paragem.
- Pendente: gravar isto como `docs/VISAO.md` quando Tiago confirmar/corrigir.

## Estado actual (2026-08-31)

### Movimentos concluídos ✅

| # | Movimento | Resultado |
|---|---|---|
| 0 | Resolver conflito dos dois Claudes | Fonte única em `packages/core/src/` |
| 1 | Coração soberano | `dominio.ts`, `arck-validador.ts`, `engy-tensao.ts`, `mentor.ts` |
| 2 | Testes que provam o coração | 53 testes (42 domínio + 11 fronteira), 0 falhas |
| 3 | Contrato (porta do coração) | `contratos.ts`, `servico.ts` — IArck, IEngy, IMentor |
| 4 | Matar 1ª cópia — `useArckCore.js` consome `@arck/core` | Bug modo Livre corrigido; `tensao` real; alias Vite; `estadoTensao` exportado |
| 5 | Matar 2ª cópia — `App.jsx` consome `@arck/core` directamente | `validNext` eliminado das decisões; ENGY mede; INÉRCIA mostra texto |
| 6 | CI anti-recaída (EV-18) | ARCK CI #4 verde — 3 jobs: testes + isolamento + build Vite |

### Consolidação + Movimento 7 (fatias 1–4) — PR #1

Feito:
- Lixo removido da raiz; ficheiros de referência → `docs/referencias/`
- Método consolidado → `docs/fundacao/` (antes disperso). Ver `docs/fundacao/README.md`
- Movimento 7 fatias 1–4 (`config/`, `lib/`, `infra/`, `hooks/projeto-reducer.js`); órfãos apagados
- Testes: `ui-web` em vitest+jsdom+RTL (57); suite total 110. Ver `docs/MOVIMENTO_7.md`
- Correcções: Tailwind v4, contraste, vista 3D

Por fazer (o "envelope" — bloqueia o "abrir"):
- `LICENSE` a 0 bytes — MIT/Apache p/ código, CC BY p/ `docs/fundacao/`
- `README.md` não existe — escrever depois de decidir o nome
- Movimento 7 Fatia 5 (`Canvas.jsx`) + Fatia 6

### Tarefa de configuração pendente (não é código) — fecha o M6

- GitHub → Settings → Branches → Branch protection rules → main → marcar os 3 jobs como required status checks:
  - `Testes do Coracao (EV-01/EV-02)`
  - `EV-18 - Dominio isolado (RL-02)`
  - `Build de Producao (RL-23)`

## Licenciamento (a decidir)

Peça de portefólio → a atribuição é o objectivo. Proposta:
- **Código** (`packages/`): MIT ou Apache-2.0
- **Método** (`docs/fundacao/`): CC BY 4.0 — quem usa tem de creditar Tiago Moraes Chaves
- Prova de autoria e anterioridade: o próprio histórico de git (commits autorados e datados)

## Verificação rápida

```bash
npm test        # core via tsx (53) + ui-web via vitest (57) = 110, 0 falhas
npm run build   # vite — dist/index.html gerado
```

## Estrutura actual

```
packages/core/            ← @arck/core (TypeScript puro; testes via tsx)
├── src/index.ts          ← barrel export — único ponto de entrada
├── src/dominio.ts arck-validador.ts engy-tensao.ts contratos.ts mentor.ts servico.ts
└── teste-coracao.ts (42) · teste-fronteira.ts (11)

packages/ui-web/          ← React + Vite (alias @arck/core; testes via vitest)
├── vite.config.js        ← alias @arck/core + config vitest (jsdom)
├── src/config/           ← dados estáticos (camadas, sectores, formas, templates, tutorial, app-meta)
├── src/lib/              ← puro (uid, core-bridge, flow-report)
├── src/infra/            ← efeitos colaterais (persistencia, exportar)
├── src/hooks/projeto-reducer.js  ← useReducer: o documento, 21 acções
├── src/componentes/      ← apresentação (FormasSVG; Canvas/No/Ligacao na Fatia 5)
├── src/App.jsx           ← ~1072 linhas de JSX + estado efémero — Fatia 5/6 pendentes
└── testes/*.test.mjs · src/**/*.test.jsx

package.json (root)       ← scripts: dev, build, test, test:core, test:boundary, test:ui
```

## Os quatro estados do ENGY (decisão de Tiago, 2026-06-24)

| Estado | Valor | Quando |
|---|---|---|
| INÉRCIA | -1 | Diagrama vazio — sistema em repouso, ainda não iniciado |
| GUIADO | 99.8 | Modo guiado com ligações |
| LIVRE_CORRETO | 100 | Modo livre, todas as ligações correctas |
| ERRO | 0 | Modo livre, qualquer erro (não existe meio-certo) |

`interpretarTensao(valor)` devolve o nome do estado. INÉRCIA e ERRO têm valor base 0 mas semântica oposta.

## As 5 ligações válidas (regra do domínio)

```
L1 → L2  (Gatilho Único — L1 só dispara uma vez)
L2 → L3  (Cisão Axial — 1 ou mais ramos, simetria natural)
L3 → L4  (Fluxo)
L4 → L5  (Fluxo)
L5 → L2  (Rebate Síncrono — fecha no Hub, nunca na Ignição)
```

Tudo o que não está nesta lista é proibido.

## Referência — Manual de Montagem

`docs/fundacao/metodo/01_MANUAL_ESQUELETO_v2.0_FINAL.md` — **canónico**. Regras de ligação
RL-01 a RL-39, validação estrutural EV-01 a EV-26, Lições do Campo (erros reais deste projecto).
A v1.0 (`docs/fundacao/metodo/MANUAL_ESQUELETO_v1.0_CONSOLIDADO.md`) tem a tabela completa RL-01 a RL-36.

**Auditoria do ARCK contra o Manual:**
- RL-01/02/03/03-bis/05/07 ✅ implementadas (domínio soberano, barrel `@arck/core`, composition root em `servico.ts`)
- RL-37 (verificar antes de apagar), RL-38 (testes de fronteira), RL-39 (estados gémeos: INÉRCIA≠ERRO) ✅
- RL-PONTE-01 — adaptadores `toNo`/`toLigacoes`/`toModo` no hook **sem teste próprio** (elo mais fraco)
- RL-18 (config por ambiente) — não existe ainda
- RL-22-28 (dev→staging→prod) — não existe ainda
- EV-25 / EV-26 — verificar cobertura actual
