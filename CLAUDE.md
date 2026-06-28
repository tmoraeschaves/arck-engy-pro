# CLAUDE.md — ARCK & ENGY Pro

> Lê este ficheiro PRIMEIRO em qualquer nova sessão. É a planta do projecto.
> Ficheiro de contexto detalhado: `docs/INDEX.md`

## O projecto

**ARCK & ENGY Pro** — ferramenta visual de modelação de arquitectura de sistemas.
- ARCK = o Arquitecto (valida ligações, impede erros)
- ENGY = o Medidor de Tensão (supervisiona o estado — 4 estados)
- MENTOR = o Pedagogo (interpreta o estado, fala com o utilizador)
- Stack: React + Vite + JavaScript, monorepo npm workspaces
- Repositório: privado no GitHub (INPI classe 42 pendente)

## Estado rápido (2026-06-26)

- **Movimentos 0–6 concluídos** — CI verde no ARCK CI #4 (commit `664598e`)
- **53 testes passando**, validação inline eliminada, INÉRCIA mostra texto
- **Build Vite produção limpo** — fix: alias `@arck/core` em `vite.config.js` corrigido (`../../core` → `../core`)
- **Única tarefa pendente para fechar M6:**
  - GitHub → Settings → Branches → Branch protection rules → main → marcar os 3 jobs como required:
    `Testes do Coracao (EV-01/EV-02)`, `EV-18 - Dominio isolado (RL-02)`, `Build de Producao (RL-23)`

## Regra de ouro para este projecto

**A fonte única de verdade da validação é `packages/core/src/`.** Nunca duplicar lógica de validação no `App.jsx` ou `useArckCore.js`. Se precisas de validar uma ligação, usa `criarArck()` de `@arck/core`.

## Verificação rápida

```bash
npm test
# Deve imprimir: 42 passaram (coracao) + 11 passaram (fronteira) = 53 total, 0 falharam.
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
packages/core/           ← @arck/core (TypeScript puro, sem React, sem UI)
├── src/
│   ├── index.ts         ← barrel export — único ponto de entrada
│   ├── dominio.ts       ← tipos (Camada, No, Ligacao, Veredito, TipoLigacao)
│   ├── arck-validador.ts← ARCK: regras de validação (fonte única)
│   ├── engy-tensao.ts   ← ENGY: 4 estados + interpretarTensao()
│   ├── contratos.ts     ← IArck, IEngy, IMentor — porta pública
│   ├── mentor.ts        ← MENTOR: pedagogo, interpreta e comunica
│   └── servico.ts       ← criarArck(), criarEngy(), criarMentor() — fábrica
├── teste-coracao.ts     ← 42 testes (domínio + Mentor + INÉRCIA)
├── teste-fronteira.ts   ← 11 testes (edge cases)
├── tsconfig.json
└── package.json

packages/ui-web/src/     ← React + Vite (consome @arck/core via alias Vite)
├── hooks/useArckCore.js ← ✅ M4: consome @arck/core, tensão real
└── App.jsx              ← monólito 1270 linhas (Movimento 5 pendente)

packages/cli/            ← CLI (futuro)
packages/exporters/      ← Exportadores (futuro)
```

## Manual de referência

`docs/` — Manual de Montagem v1.0 (fundação Claude + validação cruzada de 7 IAs).
Princípio central: dependência aponta sempre para dentro (L1→L2→L3). Domínio não importa nada de fora.
