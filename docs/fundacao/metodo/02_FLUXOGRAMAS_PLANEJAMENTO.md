# FLUXOGRAMAS DE PLANEJAMENTO DE FLUXOS
## Como pensar a arquitetura ANTES de escrever código

> Estes fluxogramas são ferramentas de decisão. Antes de cada projeto (ou cada funcionalidade nova), percorre o fluxograma relevante. Ele força as perguntas certas na ordem certa — e impede o monobloco antes da primeira linha.

---

## FLUXO 1 — DECISÃO DE ARRANQUE DE PROJETO
### "Que tamanho de fundação este projeto precisa?"

```
                    ┌─────────────────────────┐
                    │   NOVO PROJETO / MÓDULO  │
                    └───────────┬─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │ Vai ter USUÁRIOS         │
                    │ externos OU dados        │
                    │ sensíveis (PII/saúde/    │
                    │ dinheiro/identidade)?    │
                    └─────┬──────────────┬─────┘
                     SIM  │              │  NÃO
                          │              │
            ┌─────────────▼───┐    ┌─────▼──────────────────┐
            │ ESQUELETO        │    │ Vai viver mais de      │
            │ COMPLETO         │    │ 3 meses / crescer?     │
            │ obrigatório      │    └────┬─────────────┬─────┘
            │ (4 camadas, CI,  │    SIM  │             │ NÃO
            │  testes, segur.) │         │             │
            └─────────┬───────┘    ┌─────▼────┐   ┌────▼─────────┐
                      │            │ ESQUELETO │   │ MÍNIMO:      │
                      │            │ COMPLETO  │   │ L3 limpo +   │
                      │            └─────┬─────┘   │ L4 mínimo.   │
                      │                  │         │ Resto é peso │
                      │                  │         │ morto.       │
                      └──────────┬───────┘         └──────┬───────┘
                                 │                        │
                    ┌────────────▼────────────┐           │
                    │ Aplicar Manual completo: │           │
                    │ → Fluxo 2 (camadas)      │           │
                    │ → Checklist 107 itens    │           │
                    │ → Skill Eng. Cético      │           │
                    └─────────────────────────┘            │
                                              ┌────────────▼──────┐
                                              │ Manter L3 testável │
                                              │ e honesto. Evoluir │
                                              │ para completo SE   │
                                              │ crescer.           │
                                              └───────────────────┘
```

**A regra:** a fundação é proporcional ao prédio. Não construas catedral para uma cabana. Mas no minuto em que aparecem usuários ou dados sensíveis, o esqueleto completo deixa de ser opcional.

---

## FLUXO 2 — MONTAGEM DAS CAMADAS (a ordem de construção)
### "De dentro para fora, sempre"

```
   ┌──────────────────────────────────────────────────┐
   │  PASSO 1 · O CORAÇÃO (L3 — Domínio)               │
   │  Defina as ENTIDADES e as REGRAS puras.          │
   │  Sem banco, sem tela, sem framework.             │
   │  ► Teste: roda sem UI? sem banco? (EV-01, EV-02) │
   └───────────────────────┬──────────────────────────┘
                           │ ✅ coração testado
   ┌───────────────────────▼──────────────────────────┐
   │  PASSO 2 · OS CONTRATOS (as portas)              │
   │  Defina as INTERFACES que o domínio precisa      │
   │  (IRepositorio, IServico) e o barrel export.     │
   │  ► O domínio define o QUE; ninguém define o COMO │
   └───────────────────────┬──────────────────────────┘
                           │ ✅ portas definidas
   ┌───────────────────────▼──────────────────────────┐
   │  PASSO 3 · A APLICAÇÃO (L2 — Casos de uso)        │
   │  Orquestre o domínio. Cada fluxo = 1 caso de uso.│
   │  Consome contratos, nunca implementações.        │
   └───────────────────────┬──────────────────────────┘
                           │ ✅ casos de uso
   ┌───────────────────────▼──────────────────────────┐
   │  PASSO 4 · INFRAESTRUTURA (L4)                    │
   │  IMPLEMENTE os contratos: banco, APIs, ficheiros.│
   │  + uma implementação FALSA (in-memory) p/ testes │
   └───────────────────────┬──────────────────────────┘
                           │ ✅ infra plugada
   ┌───────────────────────▼──────────────────────────┐
   │  PASSO 5 · APRESENTAÇÃO (L1 — UI/API)            │
   │  Só renderização e captura. Valida entrada,      │
   │  serializa saída. NÃO contém regra de negócio.   │
   └───────────────────────┬──────────────────────────┘
                           │ ✅ bordas
   ┌───────────────────────▼──────────────────────────┐
   │  PASSO 6 · O COMPOSITION ROOT                     │
   │  O ÚNICO lugar onde tudo se conecta. Injeta as   │
   │  implementações concretas nos contratos.         │
   └───────────────────────┬──────────────────────────┘
                           │
   ┌───────────────────────▼──────────────────────────┐
   │  PASSO 7 · A CI QUE PROTEGE (EV-18)              │
   │  Pipeline reprova se: domínio importar infra,    │
   │  cobertura cair, segredo no commit, lógica       │
   │  duplicada renascer.                              │
   └──────────────────────────────────────────────────┘
```

**Por que esta ordem:** se construíres a UI primeiro (o erro mais comum), a regra de negócio gruda nela e nasce o monobloco. Coração primeiro. Bordas por último. Sempre.

---

## FLUXO 3 — VALIDAÇÃO DE UMA NOVA LIGAÇÃO/CONEXÃO
### O ciclo de vida de uma requisição (genérico)

```
   ENTRADA (L1)
      │
      ▼
   ┌──────────────────┐   NÃO   ┌─────────────────────┐
   │ Autenticado +    ├────────►│ REJEITA (401/403)   │
   │ autorizado?      │         │ + auditoria         │
   └────────┬─────────┘         └─────────────────────┘
        SIM │
            ▼
   ┌──────────────────┐   NÃO   ┌─────────────────────┐
   │ Entrada válida?  ├────────►│ REJEITA (422)       │
   │ (validação L1)   │         │ + mensagem clara    │
   └────────┬─────────┘         └─────────────────────┘
        SIM │ → vira DTO imutável
            ▼
   ┌──────────────────┐
   │ L2: caso de uso  │
   │ orquestra        │
   └────────┬─────────┘
            ▼
   ┌──────────────────┐   NÃO   ┌─────────────────────┐
   │ L3: regra de     ├────────►│ Erro de DOMÍNIO     │
   │ negócio passa?   │         │ (tipado, não técnico)│
   └────────┬─────────┘         └──────────┬──────────┘
        SIM │                              │
            ▼                              ▼
   ┌──────────────────┐         ┌─────────────────────┐
   │ L4: persiste via │         │ L1 traduz p/ resposta│
   │ contrato         │         │ sem vazar interior  │
   └────────┬─────────┘         └─────────────────────┘
            ▼
   ┌──────────────────┐
   │ Auditoria        │
   │ imutável (RL-15) │
   └────────┬─────────┘
            ▼
   ┌──────────────────┐
   │ L1 serializa     │
   │ saída → ENTREGA  │
   └──────────────────┘
```

---

## FLUXO 4 — O CICLO DO ENGENHEIRO CÉTICO (a cada passo)
### "Não confio até provar"

```
   ┌─────────────────────────────┐
   │ Vou escrever/alterar código  │
   └──────────────┬──────────────┘
                  ▼
   ┌─────────────────────────────┐
   │ 1. EXPLORAR: o que já existe?│
   │ Mapeio referências antes de  │
   │ tocar. (RL-37)               │
   └──────────────┬──────────────┘
                  ▼
   ┌─────────────────────────────┐
   │ 2. PLANEJAR: qual regra do   │
   │ Manual isto respeita? Que    │
   │ camada? Que contrato?        │
   └──────────────┬──────────────┘
                  ▼
   ┌─────────────────────────────┐
   │ 3. EXECUTAR: a menor mudança │
   │ que resolve. Nada a mais.    │
   └──────────────┬──────────────┘
                  ▼
   ┌─────────────────────────────┐
   │ 4. TESTAR O CAMINHO FELIZ    │
   │ Funciona no caso normal?     │
   └──────────────┬──────────────┘
                  ▼
   ┌─────────────────────────────┐
   │ 5. INDUZIR FALHA (RL-38)     │
   │ Vazio? Duplicado? Limite?    │
   │ Entrada maliciosa? Nulo?     │
   └──────────────┬──────────────┘
                  ▼
   ┌─────────────────────────────┐   FALHOU
   │ 6. TODOS OS TESTES VERDES?   ├──────────┐
   └──────────────┬──────────────┘          │
              SIM │                          ▼
                  ▼              ┌────────────────────────┐
   ┌─────────────────────────────┐│ PARA. Corrige antes de │
   │ 7. DOCUMENTAR: porquê, não   ││ avançar. Não acumula   │
   │ só o quê. Atualiza INDEX.md  ││ dívida.                │
   └──────────────┬──────────────┘└────────────────────────┘
                  ▼
   ┌─────────────────────────────┐
   │ 8. PRÓXIMO PASSO (volta ao 1)│
   └─────────────────────────────┘
```

**O princípio:** cada passo é verificável. Ou os testes passam, ou paramos. Nunca se avança sobre código não provado. É isto que separa engenharia de "vibe coding".
