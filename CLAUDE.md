# CLAUDE.md — ARCK & ENGY Pro

> Lê este ficheiro PRIMEIRO em qualquer nova sessão. É a planta do projecto.
> Contexto detalhado: `docs/INDEX.md` · Decisões: `docs/DECISOES.md` · Movimento 7: `docs/MOVIMENTO_7.md`

## O projecto

**ARCK & ENGY Pro** — ferramenta visual de modelação de arquitectura de sistemas.
- ARCK = o Arquitecto (valida ligações, impede erros)
- ENGY = o Medidor de Tensão (supervisiona o estado — 4 estados)
- MENTOR = o Pedagogo (interpreta o estado, fala com o utilizador)
- Stack: React + Vite + JavaScript, monorepo npm workspaces (`packages/core`, `packages/ui-web`)
- Direcção: ferramenta **aberta e gratuita**, peça de portefólio (DEC-001). Repositório no GitHub.

## Estado rápido (2026-09)

- **Movimentos 0–6 concluídos.**
- **Movimento 7 (quebrar o `App.jsx`) — fatias 1–4 feitas:** `config/`, `lib/`, `infra/`,
  `hooks/projeto-reducer.js` extraídos (App.jsx 1293 → ~1072 linhas). Órfãos `useArckCore.js`
  e `components/MentorPanel/` apagados (RL-37). Ver `docs/MOVIMENTO_7.md`.
- **Testes:** core em `tsx` (53), `ui-web` em **vitest + jsdom + @testing-library/react** (57) — total **110** (DEC-009).
- **Correcções recentes:** Tailwind v4 a compilar; contraste; vista 3D utilizável.
- **Falta no v1:** Fatia 5 (`Canvas.jsx` + `No`/`Ligacao`/`Anotacao` + `useAtalhos`), Fatia 6
  (App = composição), e o **envelope**: `LICENSE` (0 bytes), `README.md` (não existe), nome novo.
- **Próximo passo de código:** Movimento 7, Fatia 5.

## Regra de ouro para este projecto

**A fonte única de verdade da validação é `packages/core/src/`.** Nunca duplicar lógica de
validação nos componentes. Para validar uma ligação, usa a ponte `packages/ui-web/src/lib/core-bridge.js`
(`validarNovaLigacao`, `medirTensao`), que encapsula `criarArck()`/`criarEngy()` de `@arck/core`.

## Verificação rápida

```bash
npm test        # core (53) + ui-web (57) = 110, 0 falhas
npm run build   # Vite produção, dist/index.html gerado
```

## As regras do domínio ARCK

Ligações válidas: `L1→L2`, `L2→L3`, `L3→L4`, `L4→L5`, `L5→L2`. Tudo o resto é proibido.

### Os quatro estados do ENGY

| Estado | Valor | Quando |
|---|---|---|
| INÉRCIA | -1 | Diagrama vazio — sistema em repouso |
| GUIADO | 99.8% | Modo guiado com ligações |
| LIVRE_CORRETO | 100% | Modo livre, tudo correcto |
| ERRO | 0% | Modo livre, qualquer erro |

**INÉRCIA ≠ ERRO**: mesmo display zero, semântica oposta. `interpretarTensao(valor)` distingue-os.

## Arquitectura dos pacotes

```
packages/core/           ← @arck/core (TypeScript puro, sem React, sem UI) — testes via tsx
├── src/
│   ├── index.ts         ← barrel export — único ponto de entrada
│   ├── dominio.ts       ← tipos (Camada, No, Ligacao, Veredito, TipoLigacao)
│   ├── arck-validador.ts← ARCK: regras de validação (fonte única)
│   ├── engy-tensao.ts   ← ENGY: 4 estados + interpretarTensao()
│   ├── contratos.ts     ← IArck, IEngy, IMentor — porta pública
│   ├── mentor.ts        ← MENTOR: pedagogo
│   └── servico.ts       ← criarArck(), criarEngy(), criarMentor() — fábrica
├── teste-coracao.ts     ← 42 testes · teste-fronteira.ts ← 11 testes

packages/ui-web/src/     ← React + Vite (consome @arck/core via alias Vite) — testes via vitest
├── config/              ← dados estáticos (camadas, sectores, formas, templates, tutorial, app-meta)
├── lib/                 ← funções puras (uid, core-bridge, flow-report)
├── infra/               ← efeitos colaterais isolados (persistencia, exportar)
├── hooks/projeto-reducer.js ← useReducer: o documento (nós, ligações, formas…), 21 acções (DEC-004)
├── componentes/         ← apresentação (FormasSVG; No/Ligacao/Canvas na Fatia 5)
└── App.jsx              ← ainda ~1072 linhas de JSX/estado efémero — Fatia 5/6 pendentes
packages/ui-web/testes/  ← testes puros (vitest) · src/**/*.test.jsx ← testes de componente
```

## Manual de referência

`docs/fundacao/metodo/01_MANUAL_ESQUELETO_v2.0_FINAL.md` — canónico (RL-01 a RL-39, EV-01 a EV-26,
Lições do Campo). Princípio central: dependência aponta sempre para dentro. Domínio não importa nada de fora.

`docs/fundacao/anatomia-do-software/` — o sistema de navegação M0-M5.
`docs/fundacao/README.md` — índice do que foi consolidado.

⚠️ **Não re-introduzir cópias soltas de `.ts` do core em `docs/`** — a fonte única é `packages/core/src/`.
⚠️ **Este repositório não cita projectos/sistemas/empresas paralelos do Arquitecto** (DEC-008).
