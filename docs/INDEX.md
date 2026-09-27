# ARCK & ENGY Pro — Índice de Contexto

> Ponto de retomada de sessão. Lê este ficheiro primeiro.

## O que é este projecto

**ARCK** = o Arquitecto. Valida ligações entre camadas. Impede que se aprenda errado.
**ENGY** = o Medidor de Tensão. Supervisiona o estado — 4 estados.
**MENTOR** = o Pedagogo. Interpreta o estado e comunica com o utilizador.

Ferramenta visual de modelação de sistemas com 5 camadas (L1–L5), 12 sectores, canvas SVG interactivo. Stack: React + Vite + JavaScript (monorepo npm workspaces).

## Direcção do projecto

> Registo completo das decisões e das divergências em **`docs/DECISOES.md`**.

Ferramenta **aberta e gratuita (MIT)**, peça de portefólio — a ferramenta é a prova da
arquitectura (DEC-001, DEC-015). **"Finalizado" = lançamento público (DEC-016).**

1. **Consolidar e limpar** ✅
2. **Movimento 7** — quebrar o monólito `App.jsx` ✅ (1293 → 342 linhas; `docs/MOVIMENTO_7.md`)
3. **Envelope** ✅ — README com captura, LICENSE MIT + CC BY 4.0 (`docs/fundacao/`), lint no CI
4. **Abrir o repositório** ✅ — público desde 2026-09-26 (v2.1.0); branch protection activa em `main`
   (3 checks obrigatórios, sem force-push; administrador pode fazer push directo — `enforce_admins` desligado)
5. *Pós-lançamento:* Movimento 8 fatias 3–5 · layout novo (`docs/referencias/layout-alvo.md`) ·
   mobile/touch · auditoria do modelo de camadas · nome (não bloqueia — DEC-015)

## Visão da integração — vista explodida (confirmada 2026-09-05, ver DEC-013 + `MOVIMENTO_8.md`)

- **ARCK = o motor montado, visto em blocos.** As 5 camadas, os sectores, as ligações. O esboço macro.
- **A vista explodida = abrir um bloco.** Cada nó guarda uma lista dos módulos/funções que lhe
  cabem — *o que é*, *o que faz*, *onde encaixa*. Qualquer módulo pode ele próprio explodir num
  mini-diagrama. **Camadas dentro de camadas**, com **limite de 3 níveis** (não é infinito).
- **Um modelo de dados, um painel:** o `Modulo` (`id`/`label`/`kind`/`nota`/`filho`) é o mesmo
  em Guiado e em Livre, e o painel de módulos também. Em ambos, o nó começa vazio e o utilizador
  escreve os seus módulos. A distinção Guiado vs. Livre é só a validação de fluxo L1→L5.
  *(DEC-014, 2026-09-06: o template de arranque M0–M5 foi abandonado — M0–M5 é processo, não
  camada.)*
- **Estado:** Fatia 1 (modelo + reducer) e Fatia 2a (painel lateral de módulos) **feitas e em
  `main`** (v2.0.0). Fatia 2b **cancelada**. Fatia 3 (`PROMOVER_MODULO` / sub-diagramas) é
  pós-lançamento (DEC-016) — ver `docs/MOVIMENTO_8.md`.

## Estado actual (2026-09-26)

### Movimentos concluídos ✅

| # | Movimento | Resultado |
|---|---|---|
| 0 | Resolver conflito dos dois Claudes | Fonte única em `packages/core/src/` |
| 1 | Coração soberano | `dominio.ts`, `arck-validador.ts`, `engy-tensao.ts`, `mentor.ts` |
| 2 | Testes que provam o coração | 53 testes (42 domínio + 11 fronteira), 0 falhas |
| 3 | Contrato (porta do coração) | `contratos.ts`, `servico.ts` — IArck, IEngy, IMentor |
| 4 | Matar 1ª cópia — `useArckCore.js` consome `@arck/core` | Bug modo Livre corrigido; alias Vite |
| 5 | Matar 2ª cópia — `App.jsx` consome `@arck/core` directamente | ENGY mede; INÉRCIA mostra texto |
| 6 | CI anti-recaída (EV-18) | 3 jobs: testes (+ lint desde DEC-016) · isolamento · build. Branch protection **activa** desde que o repo ficou público (2026-09-26) — fecha a DEC-010 |
| 7 | Quebrar o monólito `App.jsx` | 1293 → 342 linhas; App = composição; 13 componentes + 6 hooks |

- **v2.0.0** (2026-09-14, `a42d9d5`) — Movimento 7 fatias 1–6 + Movimento 8 fatias 1/2a + autosave + integridade.
- **Lançamento (2026-09-26, DEC-016)** — refactor final, ESLint 0 problemas e no CI, 3 bugs
  apanhados ao ligar o lint (texto `)}` no cabeçalho, `}` na Forma trancada, rotação 3D por
  arrasto partida), versão do cabeçalho lida do `package.json`, captura do README refeita.

## Verificação rápida

```bash
npm test                        # core (44) + fronteira (11) + ui-web (174) = 229, 0 falhas
npm run lint -w packages/ui-web # ESLint, 0 problemas
npm run build                   # vite — dist/index.html gerado
```

## Estrutura actual

```
packages/core/            ← @arck/core (TypeScript puro; testes via tsx)
├── src/index.ts          ← barrel export — único ponto de entrada
├── src/dominio.ts arck-validador.ts engy-tensao.ts contratos.ts mentor.ts servico.ts
└── teste-coracao.ts (42) · teste-fronteira.ts (11)

packages/ui-web/          ← React + Vite (alias @arck/core; testes via vitest)
├── vite.config.js        ← alias @arck/core + config vitest (jsdom)
├── src/config/           ← dados estáticos (camadas, sectores, formas, templates, tutorial, notas, modulos, app-meta)
├── src/lib/              ← puro (uid, core-bridge, flow-report)
├── src/infra/            ← efeitos colaterais (persistencia, exportar)
├── src/hooks/            ← projeto-reducer, useVistaCanvas, useArrastos, useIntegridade, useAtalhos, useColarImagem
├── src/componentes/      ← apresentação (Cabecalho, BarraLateral, Canvas, No, Ligacao, Forma, Anotacao, …)
├── src/App.jsx           ← só composição (~340 linhas)
└── testes/*.test.mjs · src/**/*.test.jsx

package.json (root)       ← scripts: dev, build, test, test:core, test:boundary, test:ui
```

## Os quatro estados do ENGY (decisão de Tiago, 2026-06-24)

| Estado | Valor | Quando |
|---|---|---|
| INÉRCIA | -1 | Diagrama vazio — sistema em repouso, ainda não iniciado |
| GUIADO | 99.8 | Modo guiado, todas as ligações válidas |
| LIVRE_CORRETO | 100 | Modo livre, todas as ligações correctas |
| ERRO | 0 | Qualquer modo, qualquer ligação inválida — não existe meio-certo (DEC-017) |

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
