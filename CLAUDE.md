# CLAUDE.md — ARCK & ENGY Pro

> Lê este ficheiro PRIMEIRO em qualquer nova sessão. É a planta do projecto.
> Contexto detalhado: `docs/INDEX.md` · Decisões: `docs/DECISOES.md` · Movimentos: `docs/MOVIMENTO_7.md`, `docs/MOVIMENTO_8.md`

## O projecto

**ARCK & ENGY Pro** — ferramenta visual de modelação de arquitectura de sistemas.
- ARCK = o Arquitecto (valida ligações, impede erros)
- ENGY = o Medidor de Tensão (supervisiona o estado — 4 estados)
- MENTOR = o Pedagogo (interpreta o estado, fala com o utilizador)
- Stack: React + Vite + JavaScript, monorepo npm workspaces (`packages/core`, `packages/ui-web`)
- Direcção: ferramenta **aberta e gratuita** (MIT), peça de portefólio (DEC-001, DEC-015). Repositório no GitHub.

## Estado rápido (2026-09-26)

- **Movimentos 0–7 concluídos.** Movimento 8: fatias 1 e 2a feitas, 2b cancelada (DEC-014);
  fatias 3–5 ficam para depois do lançamento público (DEC-016).
- **Lançamento público (DEC-016):** refactor final do `App.jsx` feito — 885 → 342 linhas, só
  composição; **ESLint a 0 problemas** e agora corrido no CI. README com captura actual,
  LICENSE MIT (código) + CC BY 4.0 (`docs/fundacao/`). **Repositório público desde 2026-09-26
  (v2.1.0)** — branch protection activa em `main` (3 checks obrigatórios; fecha a DEC-010).
- **Testes:** core em `tsx` (44 coração + 11 fronteira), `ui-web` em **vitest + jsdom +
  @testing-library/react** (174) — total **229**, 0 falhas.
- **Layout (DEC-018, 2026-09-27):** contentores de agrupamento desenhados à mão (só visuais —
  `containers[]` no documento, conteúdo decidido pela geometria em `lib/contentores.js`) e
  selector de sector em dropdown no cabeçalho. Falta do `layout-alvo.md`: itens 3, 4 e 6.
- **Parqueado (pós-lançamento):** Movimento 8 fatias 3–5, layout novo (DEC-005,
  `docs/referencias/layout-alvo.md`), mobile/touch, notas redimensionáveis, auditoria do
  modelo de camadas (dois "L1–L5": o do diagrama vs. o da arquitectura limpa do código).

## Regra de ouro para este projecto

**A fonte única de verdade da validação é `packages/core/src/`.** Nunca duplicar lógica de
validação nos componentes. Para validar uma ligação, usa a ponte `packages/ui-web/src/lib/core-bridge.js`
(`validarNovaLigacao`, `medirTensao`), que encapsula `criarArck()`/`criarEngy()` de `@arck/core`.

## Verificação rápida

```bash
npm test                        # core (44) + fronteira (11) + ui-web (174) = 229, 0 falhas
npm run lint -w packages/ui-web # ESLint, 0 problemas (também corre no CI)
npm run build                   # Vite produção, dist/index.html gerado
```

## As regras do domínio ARCK

Ligações válidas: `L1→L2`, `L2→L3`, `L3→L4`, `L4→L5`, `L5→L2`. Tudo o resto é proibido.

### Os quatro estados do ENGY

| Estado | Valor | Quando |
|---|---|---|
| INÉRCIA | -1 | Diagrama vazio — sistema em repouso |
| GUIADO | 99.8% | Modo guiado, todas as ligações válidas |
| LIVRE_CORRETO | 100% | Modo livre, tudo correcto |
| ERRO | 0% | Qualquer modo, qualquer ligação inválida (DEC-017) |

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
├── config/              ← dados estáticos (camadas, sectores, formas, templates, tutorial, notas,
│                          modulos, app-meta — a versão mostrada lê o package.json, não se escreve à mão)
├── lib/                 ← funções puras (uid, core-bridge, flow-report)
├── infra/               ← efeitos colaterais isolados (persistencia, exportar)
├── hooks/
│   ├── projeto-reducer.js ← useReducer: o documento (nós, ligações, formas, módulos…) (DEC-004)
│   ├── useVistaCanvas.js  ← zoom, pan, 3D (is3D é DERIVADO da inclinação)
│   ├── useArrastos.js     ← estado de arrasto + o único onMouseMove
│   ├── useIntegridade.js  ← health/estado/análise via core-bridge + pulso das barras
│   └── useAtalhos.js · useColarImagem.js
├── componentes/         ← apresentação: Cabecalho, BarraLateral, Canvas (+ No/Ligacao/Forma/Anotacao/
│                          FormasSVG), PainelModulos, PainelFluxo, BarraEstado, Painel3D, Biblioteca,
│                          Tutorial, ModalSector, ModalGuardarModelo, IconeCamada, LimiteDeErro
└── App.jsx              ← só composição (~340 linhas): documento + callbacks de domínio + layout
packages/ui-web/testes/  ← testes puros (vitest) · src/**/*.test.jsx ← testes de componente
```

## Manual de referência

`docs/fundacao/metodo/01_MANUAL_ESQUELETO_v2.0_FINAL.md` — canónico (RL-01 a RL-39, EV-01 a EV-26,
Lições do Campo). Princípio central: dependência aponta sempre para dentro. Domínio não importa nada de fora.

`docs/fundacao/anatomia-do-software/` — o sistema de navegação M0-M5.
`docs/fundacao/README.md` — índice do que foi consolidado.

⚠️ **Não re-introduzir cópias soltas de `.ts` do core em `docs/`** — a fonte única é `packages/core/src/`.
⚠️ **Este repositório não cita projectos/sistemas/empresas paralelos do Arquitecto** (DEC-008).
