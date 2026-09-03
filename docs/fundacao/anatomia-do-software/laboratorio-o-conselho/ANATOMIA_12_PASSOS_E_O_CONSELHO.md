# O CONSELHO — Engenharia de Prompt Formalizada

**Status: 🟡 AMARELO — validado internamente, não testado em produção real, não empacotado para venda.**

> Esta é a linha de trabalho anterior ao produto "Anatomia do Software v2.1" (que vive em
> `../produto-final/`). É um sistema diferente e mais antigo: em vez de 6 módulos (M0-M5) para uma
> pessoa + uma IA, descreve um **ciclo de 12 passos** aplicável a qualquer escala, e um protocolo para
> **7 IAs especializadas trabalharem em paralelo** ("O Conselho"). Mantém-se aqui como material de
> laboratório/pesquisa, não como produto pronto a vender.

---

## O que é isto (e o que não é)

O Mapa/Anatomia original **não é uma ferramenta para o Conselho usar para desenvolver software** nem
"como trabalham 7 IAs paralelas". É um **protocolo formal de instrução** para qualquer agente (IA ou
humano) construir software robusto, sem monólitos — composto por:

- **12 Passos** (Planejar → Inspecionar) — processo cognitivo disciplinado
- **4 Camadas** (Coração / Contratos / Aplicação / Infra) — arquitetura estruturada
- **Sistema Imunológico** — defesa integrada
- Verificações explícitas em cada passo

**O Conselho** é *um exemplo* de como esse protocolo pode ser executado — quando várias IAs
especializadas o seguem em paralelo, cada uma num papel profissional. Mas o Conselho não é o
objetivo; é uma aplicação do protocolo, como um cirurgião sénior + assistentes seguem o mesmo
protocolo cirúrgico, sozinho ou em equipa.

---

## Os 12 Passos do Ciclo Completo

Aplica-se a **qualquer escala** — projeto inteiro, etapa/fase, funcionalidade, ou mudança pequena. É
**fractal**: mesmos passos, profundidade diferente.

1. **Planejar** — o que vou fazer, porquê, para quem? (contexto, audiência, objetivo mensurável,
   restrições)
2. **Explorar** — o que já existe, o que posso reutilizar? (padrões, código anterior, bibliotecas)
3. **Organizar** — estruturar o trabalho (cronograma de fases, dependências, marcos de validação)
4. **Refletir** — questionar a necessidade (é preciso mesmo? há forma mais simples? está acoplado?)
5. **Codar** — agora sim, com a cabeça clara (seguir exatamente o decidido, não inventar)
6. **Testar** — prova que funciona (caminho normal, anómalo, dados massivos, falhas)
7. **Avaliar** — olhar criticamente para o resultado (é bom o suficiente para produção?)
8. **Corrigir se necessário** — pequenas correções, não redesenho
9. **Melhorar se necessário** — evolução, se valer o tempo
10. **Testar de novo** — validar que correções/melhorias não quebraram nada
11. **Questionar** — há brechas? vulnerabilidades? isto aguenta 10x?
12. **Inspecionar** — auditoria final linha a linha, como teste de continuidade elétrica

---

## Anatomia Universal — as Camadas

```
L5 — UI / API (Bordas): só o que utilizadores/máquinas vêem
L4 — Infra (Implementação): banco de dados, serviços, plumbing
L3 — Aplicação (Casos de Uso): como se combinam regras para problemas reais
L2 — Contratos (Portas): como as camadas comunicam
L1 — Coração (Domínio Puro): lógica de negócio, regras, sem infra/UI
```

Dependência sempre para dentro: L5 usa L4, L4 usa L3, etc. L1 não usa ninguém.

## Sistema Imunológico (Segurança)

1. **Entrada** (Firewall Mental) — validação, autenticação, autorização
2. **Processamento** (Detetor de Anomalias) — logging, deteção de comportamento anómalo, circuit
   breakers
3. **Armazenamento** (Cofre) — encriptação, backup, auditoria
4. **Saída** (Quarentena) — dados saem limpos, rate limiting, logs

---

## Os 7 Papéis Especializados

Cada papel é uma IA especializada, com conhecimento e ciclo de verificação próprios, que valida o
trabalho dos outros papéis:

| Papel | Especialidade | Valida |
|-------|---------------|--------|
| **Engenheiro** | Arquitetura, design, decisões estruturais | Viabilidade técnica |
| **Programador** | Código, testes, qualidade | Qualidade de código |
| **Designer** | UI/UX, acessibilidade | Usabilidade |
| **Inspetor de Segurança** | Vulnerabilidades, defesas | Risco de segurança |
| **Backend** | Infraestrutura, dados, performance | Performance, escalabilidade |
| **Frontend** | Integração UI↔dados, fluxo UX | UX ponta-a-ponta |
| **Acabamento** | Qualidade final, polish, documentação | Pronto para produção |

Cada papel segue os mesmos 12 passos, mas com foco e perguntas específicas do seu domínio (ex: o
Engenheiro pergunta "isto escala?"; o Inspetor de Segurança pergunta "como é que eu roubaria estes
dados?"). Ao trabalharem em paralelo (não sequencialmente), o tempo total cai (~50%) e a qualidade
sobe de forma exponencial, porque cada papel valida o dos outros e os conflitos entre eles são
tratados como **sinal de um trade-off real**, não como ruído a ignorar.

---

## Protocolo de Conflito Entre IAs

Quando duas IAs discordam (ex: Engenheiro quer multi-tenant, Backend quer shared-DB):

1. Identifica o conflito: quem quer o quê e porquê?
2. Reúne evidência: dados, benchmarks, experiência
3. Negoceia o trade-off: o que se ganha/perde em cada opção?
4. Decide pela métrica que importa ao objetivo (velocidade, segurança, escala) — nunca por votação
5. Escala para o Arquiteto humano se persistir

---

## Como Se Usa (3 cenários)

**A. Sozinho com uma IA:** cola o protocolo (12 passos) + o Prompt Especializado do papel que
precisas + o briefing do projeto. Segue os 12 passos sequencialmente. Timeline: ~1-2 semanas.

**B. Com o Conselho (múltiplas IAs em paralelo):** dá a cada IA o protocolo + o seu Prompt
Especializado + o mesmo briefing. Todas trabalham o mesmo passo em paralelo, reportam, tu recolhes e
partilhas, resolves conflitos pela métrica. Timeline: ~3-5 dias (paralelo).

**C. IA que recebe isto:** lê o protocolo universal → lê o teu papel específico → lê o briefing do
projeto → se há mais IAs envolvidas, lê o protocolo de orquestração. Segue os 12 passos conforme o
papel. Reporta sempre: decisão, razão, para quem.

---

## Honestidade Sobre o Estado

**Provado em código real:** os 12 passos e as 4 camadas foram aplicados e testados neste projecto —
53+ testes, CI a rejeitar violações de arquitetura, sobrevivência a um monólito real de ~1270 linhas.

**Em amadurecimento:** os 7 Prompts Especializados são template — precisam de contextualização por
projeto; a orquestração de 7 IAs em paralelo é conceito forte, mas a execução real (coordenar 7
sessões de IA diferentes, sincronizar relatórios) ainda não foi testada de ponta a ponta num projeto
verdadeiro.

**Antes de vender isto como produto:** falta (1) validação cruzada com outras IAs sobre o protocolo em
si (não a execução), e (2) um teste de acionabilidade real — pegar um projeto, aplicar o Conselho do
início ao fim, documentar o que funcionou e o que não funcionou.
