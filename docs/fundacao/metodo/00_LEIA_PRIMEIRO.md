# FUNDAÇÃO REUTILIZÁVEL DE SOFTWARE
## Pacote Final · O alicerce que cada projeto herda

> Este pacote é o resultado de um trabalho longo: um Manual validado por 7 IAs, aplicado a um projeto real (ARCK & ENGY Pro), corrigido pelo que o código ensinou, e consolidado numa fundação reutilizável. Não é teoria — é método provado por sobrevivência ao código real.

---

## O QUE TEM NESTE PACOTE

| # | Documento | O que é | Quando usar |
|---|-----------|---------|-------------|
| 01 | **Manual de Montagem v2.0** | As regras de ligação (como as peças conectam). Inclui as Lições do Campo. | Ler no início; consultar sempre |
| 02 | **Fluxogramas de Planejamento** | 4 fluxos de decisão visuais (arranque, camadas, requisição, ciclo cético) | Antes de cada projeto/funcionalidade |
| 03 | **Prompts de Inicialização** | 6 prompts prontos para colar no início de cada sessão | No arranque de cada trabalho |
| 04 | **Skill: Engenheiro Sênior Cético** | A postura de trabalho como skill reutilizável | Carregar em todo projeto de código |
| — | **Checklist de 107 itens** | O que verificar (documento irmão, já existente) | Auditoria e validação |

---

## AS DUAS METADES DA FUNDAÇÃO

```
   CHECKLIST                    MANUAL DE MONTAGEM
   "O QUÊ verificar"            "COMO conectar"
   107 itens                    Regras RL-01 a RL-39
   As peças do quebra-cabeça    As regras de montagem
            \                         /
             \                       /
              ▼                     ▼
        ┌──────────────────────────────┐
        │   FUNDAÇÃO REUTILIZÁVEL       │
        │   + Fluxogramas (como pensar) │
        │   + Prompts (como iniciar)    │
        │   + Skill (como se portar)    │
        └──────────────────────────────┘
                      │
                      ▼
        Cada novo projeto herda isto
        em vez de reconstruir do zero
```

---

## COMO USAR — O PROTOCOLO DE CADA PROJETO

**No início de QUALQUER projeto novo:**

1. Cole o **Prompt 1** (arranque) ou **Prompt 2** (retomar), anexando o Manual (01) e o Checklist.
2. Carregue a **Skill do Engenheiro Cético** (04).
3. Percorra o **Fluxo 1** (02): que tamanho de fundação este projeto precisa?
4. Construa de dentro para fora, seguindo o **Fluxo 2**.
5. A cada passo, aplique o **Fluxo 4** (ciclo cético): explorar → planejar → executar → testar caminho feliz → induzir falha → verificar verde → documentar.

**Em cada projeto, mantenha vivos:**
- `INDEX.md` — o estado e o ponto de retomada de contexto
- `CLAUDE.md` — a planta rápida para qualquer IA que entrar
- A suíte de testes (caminho feliz + fronteira)

---

## A LIÇÃO MAIOR (de tudo isto)

A prova de que esta fundação funciona não foi a aprovação das 7 IAs. Foi o que aconteceu quando a aplicámos ao ARCK & ENGY Pro:

- O monólito de 1270 linhas começou a virar camadas.
- O coração (regras de negócio) saiu da UI e virou código testável sem tela nem banco — 39 testes passando em milissegundos.
- Um bug real (devaneio de uma IA sobre "compensação por simetria") foi apanhado porque o método exige testar, não confiar.
- O projeto saiu de "vibe coding" e virou algo auditável: qualquer revisor clona, roda os testes, e tem prova do sistema em segundos.

E a lição mais dura: **construir a fundação certa é metade do trabalho. Matar o monobloco velho é a outra metade — e a mais difícil.** É onde a maioria desiste. Não desista ali.

---

## CRÉDITOS DO MÉTODO

Fundação desenhada em colaboração arquiteto-engenheiro, validada por revisão cruzada de múltiplas IAs (tratando contradições como sinal, não ruído), e provada em código real. O Arquiteto decide; o Engenheiro constrói segundo a planta; os testes provam; e nenhuma regra crítica fica à mercê de disciplina humana — vira teste automático.

> *Software limpo não é acidente. É decisão intencional, repetida a cada commit, protegida por testes que não mentem.*
