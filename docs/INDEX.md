# ARCK & ENGY Pro — Índice de Contexto

> Ponto de retomada de sessão. Lê este ficheiro primeiro.

## O que é este projecto

**ARCK** = o Arquitecto. Valida ligações entre camadas. Impede que se aprenda errado.
**ENGY** = o Medidor de Tensão. Supervisiona o estado — 4 estados.
**MENTOR** = o Pedagogo. Interpreta o estado e comunica com o utilizador.

Ferramenta visual de modelação de sistemas com 5 camadas (L1–L5), 7 sectores, canvas SVG interactivo. Stack: React + Vite + JavaScript (monorepo npm workspaces).

## Estado actual (2026-06-26)

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

### Tarefa de configuração pendente (não é código)

- GitHub → Settings → Branches → Branch protection rules → main → marcar os 3 jobs como required status checks:
  - `Testes do Coracao (EV-01/EV-02)`
  - `EV-18 - Dominio isolado (RL-02)`
  - `Build de Producao (RL-23)`

## Verificação rápida

```bash
npm test
# 42 passaram (coracao) + 11 passaram (fronteira) = 53 total, 0 falharam.

npm run build
# vite v7.x — 1749 modules transformed. dist/index.html gerado.
```

## Estrutura actual do core

```
packages/core/
├── src/
│   ├── index.ts          ← barrel export — único ponto de entrada (@arck/core)
│   ├── dominio.ts        ← tipos puros (Camada, No, Ligacao, Veredito, TipoLigacao)
│   ├── arck-validador.ts ← ARCK: fonte única de validação
│   ├── engy-tensao.ts    ← ENGY: 4 estados + interpretarTensao()
│   ├── contratos.ts      ← IArck, IEngy, IMentor — porta pública
│   ├── mentor.ts         ← MENTOR: pedagogo (analisarEstado, analisarVeredito)
│   └── servico.ts        ← criarArck(), criarEngy(), criarMentor() — fábrica
├── teste-coracao.ts      ← 42 testes
├── teste-fronteira.ts    ← 11 testes (edge cases)
├── tsconfig.json
└── package.json          ← @arck/core

packages/ui-web/
├── vite.config.js        ← alias @arck/core → ../core/src/index.ts
├── src/
│   ├── App.jsx           ← monólito ~1270 linhas (candidato a M7)
│   └── hooks/useArckCore.js  ← M4: usa @arck/core, tensão real
└── package.json

.gitignore                ← node_modules, dist, arck-project-*.json
package.json (root)       ← scripts: dev, build, test, test:core, test:boundary
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

`docs/MANUAL_MONTAGEM_ESQUELETO.md` — fundação de engenharia de software genérica (v1.0 consolidado com 7 IAs). Contém 36 regras de ligação (RL-01 a RL-36) e 24 testes de validação estrutural (EV-01 a EV-24).

**Auditoria do ARCK contra o Manual:**
- RL-01/02/03/05/07/09 ✅ implementadas
- RL-18 (config por ambiente) — não existe ainda
- RL-22-28 (dev→staging→prod) — não existe ainda
