# Fundação — o método por trás desta ferramenta

Esta pasta reúne o corpo teórico e prático que originou o projecto. Foi
consolidado aqui a partir de trabalho que antes vivia disperso.

O método é aberto e é a espinha dorsal desta ferramenta — um projecto que mostra,
em código auditável, como se constrói software sem monólitos.
Ver `docs/DECISOES.md` para o registo das decisões.

## `metodo/` — a fundação de engenharia

| Ficheiro | O que é |
|---|---|
| `00_LEIA_PRIMEIRO.md` | Visão geral do pacote e protocolo de arranque de projecto |
| `01_MANUAL_ESQUELETO_v2.0_FINAL.md` | **Canónico.** Regras de ligação RL-01 a RL-39, validação EV-01 a EV-26, Lições do Campo. v2.0 = v1.0 corrigida pelo que este código ensinou |
| `MANUAL_ESQUELETO_v1.0_CONSOLIDADO.md` | Histórico. Tabela completa RL-01 a RL-36 (a v2.0 assume-a e acrescenta 37-39) |
| `02_FLUXOGRAMAS_PLANEJAMENTO.md` | 4 fluxos de decisão (arranque, camadas, requisição, ciclo cético) |
| `03_PROMPTS_INICIALIZACAO.md` | Prompts de arranque de sessão |
| `04_SKILL_engenheiro-senior-cetico.md` | A postura de trabalho como skill reutilizável |
| `software-architecture-checklist.jsx` | Checklist de arquitectura (107 itens) — componente React, candidato a módulo da app |
| `checklist-seguranca-definitivo.jsx` | Checklist de segurança — componente React, candidato a módulo da app |

## `anatomia-do-software/` — o sistema de navegação

| Ficheiro | Estado |
|---|---|
| `ANATOMIA_DO_SOFTWARE_v2.1_PT.md` | 🟢 Completo. 6 módulos M0-M5, 9 sinais de trânsito, radar de maturidade, 20 prompts, checklists dos 6 gates, case study (Login, 19 dias) |
| `ANATOMY_OF_SOFTWARE_v2.1_EN.md` | 🟢 Completo. Tradução EN da v2.1 |
| `organograma-navegacao.png` | Diagrama do sistema de navegação |
| `laboratorio-o-conselho/` | 🟡 Menos maduro. Ciclo de 12 passos + 7 papéis de IA em paralelo ("O Conselho") + conselhos de fundador e visão do "Mapa de Projeto" |

## Como isto liga à ferramenta

- **Aplicado ao próprio código:** o `packages/core` é o L3 (domínio) soberano previsto
  no Manual — sem React, sem storage, testável em milissegundos. O `App.jsx` é o
  monólito que o Manual manda matar (Movimento 7, em curso).
- **Como módulos de uso na app (roadmap):** os 6 módulos M0-M5 da Anatomia e os dois
  checklists `.jsx` passam a ser ferramentas dentro da própria aplicação — não só
  documentação, mas features.
