# ANATOMIA DO SOFTWARE — Sistema de Navegação v2.1

**Para quem desenvolve com IA e quer que o resultado pareça (e seja) profissional.**

**Data:** 1 de Agosto de 2026
**Versão:** 2.1 — Operacional (com Prompts Estruturados, Checklists de Gates e Case Study completo)

---

## Como Este Mapa Foi Criado

A Anatomia do Software não é o trabalho de uma única pessoa.

Foi desenvolvida através de um processo colaborativo contínuo entre:
- Um arquiteto humano (Tiago)
- Um conselho de IAs especializadas (Claude, DeepSeek, ChatGPT, Gemini, Perplexity, Copilot)
- Validação cruzada e iteração constante

**O meu papel (Tiago):** Definir visão, fazer perguntas, validar, decidir o que fica.
**Papel do Conselho:** Questionar, simplificar, revelar brechas, transformar teoria em protocolo.

Não é um "método genial de uma pessoa". É um mapa que só existe porque várias perspetivas — humanas e de IA — trabalharam juntas, com humildade e rigor, até que o resultado fizesse sentido.

> "Se este trabalho te ajudar, o mérito é da mesa inteira. Eu fui só mais uma peça."

---

## O Mapa de Navegação

```
TU CONDUZES

M0            M1            M2            M3            M4            M5
Mentalidade → Descobrir  →  Projetar  →  Construir  →  Proteger  →  Entregar
   Visão        Briefing     Arquitetura     Código       Segurança    Produção
    ✓             ✓              ✓             ✓             ✓            ✓
```

**Ferramentas de apoio ao longo do caminho:** Anatomy Radar™ (7 dimensões de saúde) · O Tradutor (linguagem humana → especificação técnica) · 9 Sinais de Trânsito (regras duras) · Perfis adaptativos (Iniciante / Intermédio / Sénior).

**A Filosofia:** *"You drive. AI executes. Anatomy guarantees the path."* Sem este mapa, o código vira monólito caótico em poucos meses. Com este mapa, qualquer IA constrói software profissional estruturado.

Se olhares para isto um minuto, compreendes 80% da Anatomia.

---

## Começar Aqui

### Porque Isto Importa

Toda semana, milhares de pessoas começam projetos com IA.

**Semana 1:** Rápido. Uma funcionalidade sai em poucas horas.
**Semana 3:** Uma mudança quebra outra. O contexto desaparece.
**Mês 1:** Código duplicado. Ninguém sabe onde está cada coisa.
**Mês 2:** A IA passa a consertar bugs que ela própria criou.
**Mês 6:** 400 ficheiros. Ninguém consegue adicionar funcionalidades sem quebrar algo.

### Por Que Isto Acontece

Não é culpa da IA. A IA sabe construir software profissional.

**O problema é este:** ninguém lhe disse **como** trabalhar, **quando** validar, **o que** é suficientemente bom.

O utilizador pede: "Quero login." A IA devolve código. Ninguém validou se o código é seguro, testável, escalável, ou se encaixa com o resto.

### A Solução

**Anatomia do Software** é um **sistema de navegação** que muda isto.

Não é um framework. Não é um protocolo rígido. Não transforma ninguém em engenheiro.

É um **mapa** que diz:
- **Onde estás agora** (maturidade do projeto)
- **Para onde vais** (próximo destino)
- **O que precisa estar pronto** antes de avançar
- **Quando chegaste** (critério de pronto real)

---

## Como Funciona

**Antes (Vibe Coding):** Ideia → IA → Código → Mais Código → Caos

**Depois (Com Anatomia):**
```
Ideia
  ↓
Briefing Rígido
  ↓
Onde estou? (Radar)
  ↓
Qual o próximo destino?
  ↓
O que precisa validar?
  ↓
IA executa
  ↓
Valida + Avança
```

**Os Papéis:**
- **Tu:** Condutor (decides, guias, validas)
- **IA:** Motorista (executa conforme instruções)
- **Anatomia:** Navegador (mostra caminho, evita que te percas)

---

## Começar Já (10 Minutos)

Se não tens tempo para ler tudo agora:

**1. Responde a isto (Briefing Rígido):**
```
Problema: (em 2-3 frases, o que estás a resolver)
Utilizadores: (quem vai usar, por que razão)
Sucesso: (como vais saber que ficou pronto)
Stack: (ex: React/Node/PostgreSQL)
Restrições: (tempo, orçamento, compliance)
Dados Sensíveis: (sim/não, que tipos)
```

**2. Cola isto na IA:**
```
Tens um projeto novo.
A estrutura dele será:
- Domínio isolado (lógica pura, sem dependências externas)
- Contratos explícitos (módulos comunicam apenas por interfaces)
- Validação cedo (gates obrigatórios entre fases)

Antes de codificar qualquer coisa, tens de:
1. Validar o briefing acima
2. Desenhar arquitetura mínima viável
3. Implementar uma fatia pequena
4. Testar + auditar
5. Só depois expandir

Está claro? Vamos começar pelo MÓDULO 1: DESCOBRIR
```

**3. Continua com os 6 módulos abaixo.**

---

## Os 6 Módulos de Navegação

Cada módulo é um **destino claro** no teu projeto. Tens de passar por todos, mas não necessariamente de forma linear — podes recalibrar, voltar se preciso, avançar conforme o projeto justifica.

### Módulo 0: Mentalidade

**Objetivo:** Entender o que significa desenvolver com engenharia, não com vibe.

**O que é isto:**
- Engenharia = decisões documentadas, validadas, auditáveis
- Vibe = código que funciona mas ninguém sabe como, porquê, ou se é seguro
- Anatomia força a primeira, mesmo usando IA

**Gate de Entrada:**
- [ ] Entendi que a IA não é o GPS (não toma decisões)
- [ ] Entendi que eu sou o navegador + condutor
- [ ] Entendi que sem briefing rígido, sou só vibe coding com mais passos

**Saída esperada:** mentalidade clara de que qualidade não é acidente — é decisão repetida a cada commit.

---

### Módulo 1: Descobrir

**Objetivo:** Captar contexto, definir limites, mapear riscos.

**1.1 Briefing Rígido (30 min)**
```
PROBLEMA
O que estás a resolver? (2-3 frases, concreto)

UTILIZADORES
Quem são? (3 perfis reais: idade, contexto, habilidades)
O que fazem com o software? (workflow específico)

SUCESSO
Como vais saber que ficou pronto? (métrica mensurável)
Qual é o mínimo que o torna viável? (MVP)

CONTEXTO TÉCNICO
Stack: [React/Node/Python/outro]
Escala: [10 utilizadores / 10k / 1M]
Timeline: [1 mês / 3 meses / 6 meses]

RESTRIÇÕES
Orçamento: [valor ou "startup"]
Compliance: [RGPD / PCI-DSS / outro]

DADOS SENSÍVEIS
Tem PII? [sim/não]
Tem dados financeiros? [sim/não]
Tem dados médicos? [sim/não]
```

**1.2 Mapa de Riscos (30 min)**
Para cada item acima, pergunta: "O que pode dar errado aqui?"
```
Risco: [o que pode falhar]
Impacto: [o que quebra se isto falhar]
Probabilidade: [alta/média/baixa]
Mitigação: [o que faço para evitar]
```

**Prompt para a IA:**
```
Dados: [Cole o briefing acima]

Tarefa:
1. Reformula o problema em 3 frases claras
2. Identifica 2-3 riscos arquitetónicos (escala, segurança, complexidade)
3. Para cada risco, propõe forma de o bloquear cedo (no Módulo 2)

Reporta:
- Problema confirmado?
- Utilizadores reais identificados?
- Riscos mapeados?
- Pronto para Módulo 2?
```

**Gate de Saída:**
- [ ] Briefing documentado e validado
- [ ] Riscos mapeados
- [ ] Todos na mesma página
→ SIM: avança para Módulo 2 · → NÃO: volta e refaz

---

### Módulo 2: Projetar

**Objetivo:** Desenhar a menor arquitetura viável que bloqueia monólitos.

**2.1 Arquitetura Mínima (1-2 dias)**
```
CAMADA 1 (Apresentação): UI/API/CLI
CAMADA 2 (Aplicação): Casos de uso, orquestração
CAMADA 3 (Domínio): Lógica pura, isolada ← CORAÇÃO
CAMADA 4 (Infra): BD, APIs externas

DEPENDÊNCIA: L1 → L2 → L3 ← L4 (sempre para dentro)
```

Exemplo para "Login": L1 = Formulário de Login · L2 = Caso de Uso "AutenticarUtilizador" · L3 = Agregado "Utilizador" + "Password" · L4 = Repositório (qual BD? qual hash?).

**2.2 Contratos Explícitos (1 dia)** — cada camada só comunica por contratos (interfaces). L3 define, L4 implementa.

**2.3 Mapear Módulos (1 dia)** — que módulos vais criar (`@modulos/autenticacao`, `@modulos/utilizadores`, cada um com `dominio/`, `casos-de-uso/`, `adaptadores/`, `testes/`).

**Prompt para a IA:**
```
Contexto: [Briefing + Riscos]

Tarefa:
1. Desenha 4 camadas para o projeto (incluindo dependências)
2. Identifica 3-4 módulos principais
3. Para cada módulo, lista contratos obrigatórios
4. Propõe forma de isolar domínio (testar sem BD/UI)

Reporta: diagrama arquitetónico, módulos, contratos, forma de testar domínio isolado.
```

**Gate de Saída:**
- [ ] Arquitetura desenhada · [ ] Camadas claras · [ ] Contratos definidos · [ ] Forma de isolar domínio identificada
→ SIM: avança para Módulo 3 · → NÃO: volta e refaz

---

### Módulo 3: Construir

**Objetivo:** Codificar uma fatia pequena seguindo a arquitetura.

**Ciclo Micro (repete para cada funcionalidade):**
1. **Codar** — segue exatamente o design do Módulo 2; não inventes funcionalidades; cada linha tem propósito.
2. **Testar** — caminho feliz, caminho triste (inputs inválidos), stress test, fronteira (vazio, limite, duplicados).
3. **Avaliar** — "É o que imaginei? Outro dev consegue manter? Performance OK?" Se problema, volta ao passo 1.
4. **Refletir** — "Há acoplamento que não devia estar? Posso dividir mais? Isto escala ou é dead-end?"

**Prompt para a IA:**
```
Feature: [nome]
Arquitetura: [do M2]

Tarefa:
1. Implementa a funcionalidade
2. Escreve testes (feliz + triste + fronteira)
3. Valida que L3 (Domínio) é testável sem BD
4. Se encontraste algo não decidido: PARA e reporta

Reporta: código implementado, testes (cobertura %), domínio testável sem infra?, problemas encontrados?
```

**Gate de Saída:**
- [ ] Feature implementada conforme design · [ ] Testes >80% cobertura · [ ] Domínio testável isolado · [ ] Performance aceitável
→ SIM: avança para Módulo 4 · → NÃO: volta e refaz

---

### Módulo 4: Proteger

**Objetivo:** Validar segurança, auditoria, robustez.

**4.1 Segurança:** entrada validada (SQL injection, XSS) · dados sensíveis identificados + encriptados · autorização em cada caso de uso · secrets fora do código · rate limiting · auditoria de ações críticas.

**4.2 Testes de Fronteira:** vazio · limite · duplicado · contaminação · timeout.

**4.3 Auditoria Crítica:** vulnerabilidades óbvias? edge cases não testados? dependências frágeis? se crescer 10x, aguenta?

**Prompt para a IA:**
```
Código: [Feature pronta]
Requisitos de Segurança: [do Briefing]

Tarefa:
1. Auditoria de segurança (entrada, dados, autorização)
2. Testes de fronteira (vazio, limite, duplicado)
3. Análise crítica (vulnerabilidades, edge cases)
4. Relatório de riscos residuais

Reporta: vulnerabilidades encontradas, severidade, testes de fronteira implementados?, pronto para produção?
```

**Gate de Saída:**
- [ ] Segurança auditada · [ ] Testes de fronteira completos · [ ] Vulnerabilidades resolvidas · [ ] Pronto para produção
→ SIM: avança para Módulo 5 · → NÃO: volta ao Módulo 3 e corrige

---

### Módulo 5: Entregar

**Objetivo:** Polimento, documentação, estar pronto para utilização real.

**5.1 Polimento:** código sem warnings · performance <200ms p95 · acessibilidade WCAG AA · UX intuitivo · responsivo.

**5.2 Documentação:** README (como começar) · arquitetura (diagrama + explicação) · APIs documentadas · decisões (porquê de cada estrutura).

**5.3 Operacionalização:** CI/CD automático · testes em pipeline · logs estruturados e auditáveis · monitorização com métricas-chave ativas.

**Prompt para a IA:**
```
Feature: [pronta + auditada]

Tarefa:
1. Checklist final (linting, performance, acessibilidade)
2. Documentação: README + API docs
3. CI/CD: scripts prontos
4. Relatório final

Reporta: checklist tudo verde?, documentação completa?, pronto para produção?
```

**Gate de Saída:**
- [ ] Linter passa · [ ] Benchmarks OK · [ ] Documentação completa · [ ] CI/CD configurado
→ Entregar para utilização

---

## Os 9 Sinais de Trânsito (Regras Duras)

Estas são **não negociáveis**. Se violares uma, volta ao módulo anterior.

| Sinal | Regra | Teste |
|-------|-------|-------|
| 🔴 Domínio nunca importa infra | L3 não conhece BD, HTTP, UI | Apaga L4 — o código L3 ainda compila? |
| 🔴 Comunicação só por contratos | Sem acoplamento direto | Módulos importam interfaces, não implementações |
| 🔴 Uma Composition Root | Um único ponto que cria serviços | Todos os serviços saem de um sítio |
| 🟡 Dependências injetadas | Nada instanciado internamente | Fábrica vs. `new()` |
| 🟡 Sem dependências circulares | Se A→B, B nunca→A | Análise de grafo de dependências |
| 🟡 Validação na entrada | Firewall mental ativo | Cada entrada é validada antes de entrar |
| 🟡 Testes de fronteira obrigatórios | Vazio, limite, duplicado | A suite de testes cobre edge cases |
| 🟢 Código testável isolado | Domínio sem framework | `node test.js` basta |
| 🟢 Robustez prova-se induzindo falha | Não apenas sucesso | Falhas simuladas são testadas |

🔴 = se quebras isto, o projeto fica frágil · 🟡 = se quebras isto, complica depois · 🟢 = se tens isto, consegues evoluir

---

## Radar de Maturidade

Avalia o teu projeto agora (0-10 cada dimensão):

```
Arquitetura       ████████░░ (8/10)  "Domínio está isolado?"
Testes            ███░░░░░░░ (3/10)  "Cobertura >80%?"
Segurança         ██░░░░░░░░ (2/10)  "Auditado?"
Documentação      █░░░░░░░░░ (1/10)  "README + API docs?"
Escalabilidade    ████████░░ (8/10)  "Aguenta 10x?"
Performance       ███░░░░░░░ (3/10)  "Queries <200ms?"
Manutenibilidade  █████░░░░░ (5/10)  "Outro dev entende?"

MÉDIA: ████░░░░░░ (4.3/10)
```

**Interpretação:** <3 = Vibe coding, volta aos Módulos 0-2 · 3-6 = Fundação fraca, prioriza Módulo 4 (segurança) · 6-8 = Bom, pode evoluir · >8 = Pronto, escala com confiança.

---

## O Tradutor

O utilizador diz: **"Quero um CRUD de utilizadores."**

O Tradutor converte automaticamente para:

**Casos de Uso:** listar · criar · editar · deletar · buscar por email.
**Domínio:** Agregado Utilizador · Value Object Email · Value Object Password · regra: email único.
**Segurança:** hash de password (bcrypt) · validação de email · rate limiting (10 reqs/min) · auditoria (quem criou/editou).
**Persistência:** tabela `utilizadores` · índice `email` · constraints `unique`, `not null`.
**Testes:** criar válido · email duplicado → erro · password fraca → erro · delete cascata → verificar.
**API:** `POST/GET/PATCH/DELETE /utilizadores` + `GET /utilizadores?email=X`.

A IA vê isto automaticamente e trabalha com estrutura clara.

---

## Perfis de Utilização

**Perfil A — Nunca Programei** (40% do conteúdo): briefing simplificado, Módulos 0-2 apenas, prompts muito curtos, foco em decisões.

**Perfil B — Uso IA Regularmente** (70% do conteúdo): briefing completo, Módulos 0-5, prompts médios, foco em estrutura + execução.

**Perfil C — Sou Developer** (100% do conteúdo): briefing + riscos, Módulos 0-5 completos, prompts detalhados, regras duras + edge cases.

---

## Lições do Campo

**Lição 1 — Construir o Novo é Fácil, Matar o Velho é Difícil.** Um domínio limpo pode passar todos os testes enquanto o código antigo ainda existe ao lado. Enquanto existir, há duas verdades no sistema. O projeto só fica profissional quando a última cópia velha morre. *Aplicação:* reserva tempo (e coragem) para eliminar o antigo.

**Lição 2 — Devaneios da IA Viram Bugs Reais.** Uma IA pode "sonhar" uma regra que soa elegante e não foi testada — e ela vira bug em produção. *Aplicação:* testa sempre tudo, nunca confies em explicações poéticas.

**Lição 3 — Um Array Vazio é uma Armadilha.** "Todas as ligações são válidas" é trivialmente verdadeiro quando não há ligações nenhumas — `.every()` num array vazio devolve `true`. *Aplicação:* testa sempre com coleções vazias.

**Lição 4 — Estados Gémeos Precisam de Nomes.** Dois estados podem mostrar o mesmo valor (ex: zero) mas significar coisas opostas (inércia vs. erro). *Aplicação:* a semântica vive no nome do estado, não no número.

**Lição 5 — Limpar com Método, Não à Pressa.** Apagar código sem verificar referências pode introduzir um defeito. A ordem certa é: mapear referências → confirmar órfão → apagar. *Aplicação:* limpeza é necessária, mas estruturada.

---

## Posicionamento Comercial

**Para quem é:** Vibe Coders que querem parar de criar caos · Devs Juniores que querem aprender engenharia · Developers Experientes que querem consistência ao usar IA.

**Promessa:** "A Anatomia do Software não transforma ninguém em engenheiro sénior. Mas ensina a orientar uma IA como um engenheiro conduziria uma equipa. O resultado é código que parece profissional porque é profissional — estruturado, testado, auditável, escalável. Sem monólitos, sem caos, sem vibe coding disfarçado de estrutura."

**Métrica de sucesso após usar a Anatomia:** código estruturado em 4 camadas claras · domínio isolado e testável · gates obrigatórios antes de expandir · segurança validada desde o início · projeto auditável (qualquer dev entende).

---

## Honestidade Final

**O que funciona (provado):** os 6 módulos (aplicados em projetos reais) · briefing rígido como gate obrigatório · 4 camadas + isolamento de domínio · testes de fronteira (revelam armadilhas reais) · sistema imunológico (defesa estruturada).

**O que está em amadurecimento:** o Radar de Maturidade (ferramenta em desenvolvimento) · o Tradutor (funciona bem, precisa mais exemplos) · integração com diferentes stacks (TypeScript validado, outros em teste).

**Promessa realista:** a Anatomia não cria software perfeito. Cria software profissional: estruturado, testável, escalável, sustentável. A diferença face a vibe coding é enorme.

---

## Começar Aqui: Quick Start 15 Minutos

**Passo 1 — Olha o Mapa (2 min):** Tu (condutor) decides; 6 Módulos (M0-M5) é o caminho estruturado; Gates são validações obrigatórias; Radar é o diagnóstico do projeto agora; Tradutor transforma ideias em especificações; a IA (executor) constrói conforme instruído.

**Passo 2 — Preenche o Briefing Rígido (5 min):** usa o template da secção "Começar Já" acima, em português simples.

**Passo 3 — Começa em M0 (3 min):** lê só a secção Módulo 0: Mentalidade — 2 parágrafos. A mensagem: "Engenharia ≠ Vibe Coding. O código é uma decisão, não um acidente."

**Passo 4 — Vai para M1, diz à IA (3 min):** cola o briefing preenchido e pede para identificar riscos, mapear dependências e listar o que precisa de validação antes de codificar.

**Passo 5 — Lê o output, valida o Gate 1 (2 min):** "Isto faz sentido? Falta algo óbvio? Concordo com os riscos identificados?" Se sim, avança para M2. Isto não é burocracia — é proteção.

Se em qualquer altura sentires que estás a "cair no caos de novo": tens um Gate por validar? Estás a quebrar um Sinal de Trânsito? O Radar diz que algo está muito baixo? **Pára. Valida. Depois avança.**

---

## Apêndice: Glossário Técnico

**Acoplamento** — quando o código de um componente depende diretamente do funcionamento interno de outro. Elevado acoplamento torna mudanças perigosas.

**Boundary Tests (Testes de Fronteira)** — testes que validam os limites do que o código aceita: valores vazios, nulos, máximos, mínimos, duplicados.

**Composition Root** — o único lugar da aplicação onde todos os componentes são ligados entre si.

**Contrato (Interface)** — definição clara de entrada e saída de um componente, sem expor como funciona internamente.

**Domínio (Domain)** — a lógica pura de negócio, isolada de banco de dados, UI ou frameworks.

**Domínio Isolado** — quando o código de negócio (L3) não conhece nada sobre como é guardado, exibido ou enviado.

**Gate (Portão de Passagem)** — um ponto obrigatório de validação entre módulos.

**Injeção de Dependência** — em vez de um componente criar as suas dependências, elas são fornecidas de fora.

**Monólito** — um bloco gigante de código onde tudo está junto, acoplado, difícil de alterar.

**Radar de Maturidade** — ferramenta de diagnóstico que mede a saúde do projeto em 7 dimensões.

**Sinais de Trânsito** — nove regras duras (críticas / importantes / de força) que protegem a estrutura do projeto.

**Tradutor** — ferramenta que converte um pedido em linguagem humana em especificação técnica completa.

**Value Object** — objeto que representa um conceito de negócio, identificado pelo seu valor e validade, não por um ID.

**Vibe Coding** — desenvolvimento caótico onde o código é escrito conforme as coisas vão aparecendo, sem estrutura, testes ou validação prévia.

---

## Nota sobre os 9 Sinais de Trânsito

Os 9 Sinais são uma **compressão operacional simplificada** das 39 Regras de Ligação (RL-01 a RL-39) desenvolvidas no Manual Esqueleto v1.0/v2.0 (o laboratório de engenharia que precedeu este produto).

| Sinal | Remete a… |
|-------|-----------|
| Domínio nunca importa infra | RL-01, RL-02, RL-10 |
| Comunicação apenas por contratos | RL-03, RL-04, RL-05 |
| Uma Composition Root | RL-06, RL-19 |
| Dependências injetadas | RL-05, RL-17 |
| Sem dependências circulares | RL-07 |
| Validação na entrada | RL-24 |
| Testes de fronteira obrigatórios | RL-32, RL-38 |
| Código testável isolado | RL-35 |
| Robustez por falha induzida | RL-38 |

A Anatomia simplifica sem perder essência. Os 9 Sinais não são uma redução de qualidade — são uma síntese de clareza. Se quebras um Sinal, quebras a estrutura. Se respeitas os 9 Sinais, o teu projeto aguenta crescimento.

---

## Agradecimentos & Co-Criação

A Anatomia do Software é resultado de uma construção coletiva. Nenhum sistema complexo se constrói sozinho — este trabalho é a síntese de uma parceria contínua entre visão humana e inteligência artificial.

**Orquestração:** Tiago Moraes Chaves
**Conselho de Colaboração:** Claude, DeepSeek, ChatGPT, Gemini, Perplexity, GitHub Copilot

Cada uma destas IAs contribuiu com perspetivas distintas ao longo das várias iterações do documento: crítica técnica rigorosa, identificação de brechas lógicas, simplificação de excessos, transformação de teoria em protocolo, validação cruzada de decisões.

**Responsabilidade final:** permaneceu com o autor, que selecionou, integrou e refinou estas contribuições. Mas este trabalho não teria chegado à forma atual sem essa colaboração.

*"You drive. AI executes."* Mas a verdade é: **Driver de qualidade + Executores de qualidade = engenharia verdadeira.**

---
---

# PARTE II — PROMPTS ESTRUTURADOS (v2.1)

**Como usar:** 1. Escolhe o módulo (M0-M5) · 2. Copia o prompt · 3. Cola no ChatGPT / Claude / Gemini · 4. Adapta para o teu projeto específico · 5. Guarda o output em `docs/`.

## M0 — Mentalidade

**Prompt: "Estruturar Briefing Rígido"**
```
Estou começando um novo projeto de software usando Anatomia do Software v2.1.
Preciso estruturar um BRIEFING RÍGIDO (documento de 1 página máximo).

Projeto: [Teu projeto aqui, ex: "Sistema de Login para SaaS"]

Ajuda-me com:
1. PROBLEMA — uma frase clara do que será resolvido
2. UTILIZADORES — quem usa (3 máximo)
3. SUCESSO — 3 critérios mensuráveis (números!)
4. RESTRIÇÕES — tech, orçamento, tempo, legal
5. O QUE NÃO INCLUI — funcionalidades para v2.0

Formato: Markdown com headers claros.
Resultado: BRIEFING.md pronto para passar a M1.
```

## M1 — Descobrir

**Prompt 1: "Mapear Riscos Técnicos"**
```
Estou em M1 (DESCOBRIR) da Anatomia do Software.
Projeto: [Teu projeto]
Briefing disponível: [Cole o BRIEFING.md do M0]

Preciso identificar RISCOS TÉCNICOS para este projeto.
Para cada risco: nome da ameaça, severidade (HIGH/MEDIUM/LOW), descrição, mitigação (ação concreta).
Foca em: segurança (SQL Injection, XSS, auth), performance (bottlenecks), integrações externas (falhas),
data loss (backup, recovery), compliance (RGPD, regulação local).

Output: tabela Markdown com 8-12 riscos. Referência: documento "RISKS.md" no projeto.
```

**Prompt 2: "Mapear Dependências"**
```
Estou em M1 - DESCOBRIR.
Projeto: [Teu projeto]

Preciso mapear DEPENDÊNCIAS EXTERNAS.
Para cada dependência: ID (dep_1, dep_2...), nome, tipo (library/service/infrastructure/external),
status (exists/create/integrate), esforço estimado (horas), descrição (1 linha).

Dependências a considerar: bibliotecas (JWT, bcrypt), serviços internos (database, cache),
serviços externos (email, payment, SMS), infraestrutura (cloud provider, CDN).

Output: JSON estruturado. Referência: "DEPENDENCIES.md".
```

**Prompt 3: "Listar Validações Críticas"**
```
Estou em M1 - DESCOBRIR.
Projeto: [Teu projeto] · Briefing: [Cole o BRIEFING.md] · Riscos: [Cola os RISKS.md]

Preciso de VALIDAÇÕES CRÍTICAS (casos de teste essenciais).
Para cada validação: input (o quê testar), expected output (o quê esperas), tipo (happy-path/boundary/error), razão (porquê é crítico).
Foca em: happy path (utilizador normal), boundaries (limites: vazio, muito grande, mínimo), erros (estados inválidos), segurança (ataques comuns).

Output: tabela Markdown ou JSON. Mínimo: 15 validações. Referência: "VALIDATIONS.md".
```

## M2 — Projetar

**Prompt 1: "Desenhar Arquitetura 4 Camadas"**
```
Estou em M2 - PROJETAR.
Projeto: [Teu projeto] · Análise do M1: [Cola RISKS.md + DEPENDENCIES.md] · Stack: [ex: Node.js + Express + PostgreSQL + TypeScript]

Preciso desenhar a ARQUITETURA 4 CAMADAS.
Para cada camada: L4 Infrastructure (onde? DB, APIs, cache, email), L3 Domain (o quê? lógica pura, sem dependências externas),
L2 Application (como? orquestração, use cases), L1 Presentation (para quem? UI, HTTP endpoints).

Mostra: responsabilidade de cada camada, dependências de cada uma, direção das dependências (sempre inward),
exemplos concretos de classes/módulos em cada camada.

Output: documento Markdown com diagrama ASCII. Referência: "ARCHITECTURE.md".
```

**Prompt 2: "Definir Contratos (Interfaces)"**
```
Estou em M2 - PROJETAR.
Projeto: [Teu projeto] · Arquitetura: [Cola o ARCHITECTURE.md]

Preciso definir os CONTRATOS (interfaces) entre camadas: Input DTOs, Output DTOs, Errors/Exceptions,
Repository interfaces, Service interfaces (dependências injetadas).
Para cada contrato: nome, campos/propriedades, descrição, validações.

Output: interfaces TypeScript (ou JSON se não usar TS). Referência: "CONTRACTS.ts".
```

**Prompt 3: "Gerar Estrutura de Ficheiros"**
```
Estou em M2 - PROJETAR.
Projeto: [Teu projeto] · Stack: Node.js + TypeScript · Arquitetura: [Cola ARCHITECTURE.md] · Contratos: [Cola CONTRACTS.ts]

Preciso da ESTRUTURA DE FICHEIROS completa.
Cria: pastas src/domain, src/application, src/infrastructure, src/presentation; subpastas por responsabilidade;
ficheiro index.ts por pasta (exports); ficheiro .ts vazio com comentário "TODO: Implement [funcionalidade]".
Inclui também: tests/ (unit, integration), docs/, scripts/.

Output: tree ASCII da estrutura (ou script `mkdir -p`). Referência: estrutura pronta para M3 preencher os TODOs.
```

## M3 — Construir

**Prompt 1: "Implementar Camada de Domain (L3)"**
```
Estou em M3 - CONSTRUIR.
Projeto: [Teu projeto] · Arquitetura: [Cola ARCHITECTURE.md] · Contratos: [Cola CONTRACTS.ts] · Estrutura: [Cola a estrutura]

Preciso IMPLEMENTAR a CAMADA DE DOMAIN (L3).
Regras: nenhuma dependência externa (sem imports de L4, L2, L1); Value Objects imutáveis, validam no constructor;
Entities contêm lógica de negócio pura; Errors são classes próprias, não genéricas.
Implementa: value-objects/, entities/, errors/. Para cada VO/Entity: constructor privado + static create(),
validações completas, métodos de negócio (nenhuma I/O), imutabilidade (readonly properties).

Output: ficheiros TypeScript completos, 100% testáveis sem mocks. Testes: unitários (>90% coverage).
```

**Prompt 2: "Implementar Camada de Application (L2)"**
```
Estou em M3 - CONSTRUIR.
Projeto: [Teu projeto] · Contratos: [Cola CONTRACTS.ts] · Domain implementada: [Cola os ficheiros de L3]

Preciso IMPLEMENTAR a CAMADA DE APPLICATION (L2).
Regras: use cases orquestram L3 + L4; dependency injection via constructor; sem lógica de negócio (isso é L3); error handling + logging.
Implementa: use-cases/, services/ (se houver coordenação). Para cada Use Case: constructor com dependências,
execute() que retorna DTO, try-catch com logging, delega lógica pura para L3.

Output: ficheiros TypeScript prontos para L1 chamar. Testes: unitários com mocks (>80% coverage).
```

**Prompt 3: "Implementar Camada de Infrastructure (L4)"**
```
Estou em M3 - CONSTRUIR.
Projeto: [Teu projeto] · Contratos: [Cola CONTRACTS.ts] · Application implementada: [Cola L2]

Preciso IMPLEMENTAR a CAMADA DE INFRASTRUCTURE (L4).
Implementa: database/repositories (PostgreSQL, prepared statements), services/ (email, payment, auth),
middleware/ (rate limiting, logging).
Regras: implementa interfaces de CONTRACTS.ts; prepared statements para SQL; error handling com retry logic;
logging de operações; connection pooling, timeouts configurados.

Output: ficheiros TypeScript prontos. Testes: integração com test database.
```

**Prompt 4: "Implementar Camada de Presentation (L1)"**
```
Estou em M3 - CONSTRUIR.
Projeto: [Teu projeto] · Use Cases (L2): [Cola] · Contratos: [Cola]

Preciso IMPLEMENTAR a CAMADA DE PRESENTATION (L1).
Implementa: controllers/ (HTTP endpoints), middleware/ (request validation, auth), formatters/ (response formatting).
Regras: controllers finos (parsing + delegam para L2); validação de input; error handling com status codes corretos;
logging de requests; não contêm lógica de negócio.

Output: ficheiros TypeScript (Express, Fastify, ou NestJS). Testes: e2e de cada endpoint.
```

**Prompt 5: "Escrever Testes Unitários"**
```
Estou em M3 - CONSTRUIR.
Projeto: [Teu projeto] · Código implementado: [L1-L4 completo] · Validações críticas: [Cola VALIDATIONS.md]

Preciso ESCREVER TESTES UNITÁRIOS. Cobertura alvo: >80%.
Testes para: Domain (mocks zero), Application (mocks de repositórios/serviços), Infrastructure (mocks de DB/APIs),
Controllers (mocks de use cases).
Para cada teste: AAA (Arrange, Act, Assert), nome descritivo (should_[o quê]_[quando]), happy path + error cases,
testa boundaries (vazio, null, max, min).

Output: ficheiros de teste Jest/Vitest. Comando: `npm test -- --coverage`.
```

**Prompt 6: "Escrever Testes de Integração"**
```
Estou em M3 - CONSTRUIR.
Projeto: [Teu projeto] · Código: [tudo implementado] · Testes unitários: [criados]

Preciso de TESTES DE INTEGRAÇÃO. Cobertura alvo: >60%.
Testes para: fluxos completos (L1 → L2 → L3 → L4), database real (test database), serviços externos (mockados).
Para cada teste: setup database (migrations), executa fluxo completo, verifica resultado + side effects, cleanup.

Output: ficheiros de teste em tests/integration/. Comando: `npm run test:integration`.
```

## M4 — Proteger

**Prompt: "Implementar Segurança"**
```
Estou em M4 - PROTEGER.
Projeto: [Teu projeto] · Código (M3): [pronto] · Riscos (M1): [Cola RISKS.md]

Preciso implementar SEGURANÇA. Mitigação de riscos: [para cada risco HIGH/MEDIUM do M1, cola aqui].

Implementa: password hashing (bcrypt 12 rounds), JWT com expiração (access 15min, refresh 7d), HTTPS enforcement,
CSRF tokens, rate limiting, prevenção de SQL injection (prepared statements), prevenção de XSS (CSP headers,
sanitização), audit logging, secrets management (env vars), security headers (HSTS, X-Frame-Options, etc).

Output: código TypeScript com todas as implementações + SECURITY_CHECKLIST.md com item por medida.
```

## M5 — Entregar

**Prompt 1: "Escrever Documentação"**
```
Estou em M5 - ENTREGAR.
Projeto: [Teu projeto] · Código: [completo e securizado]

Preciso de DOCUMENTAÇÃO: README.md (setup, comandos, overview), API.md ou Swagger (todos os endpoints com
exemplos), ARCHITECTURE.md (diagrama 4 camadas), DEPLOYMENT.md (como fazer deploy), TROUBLESHOOTING.md (erros comuns).
Cada documento: Markdown bem formatado, exemplos concretos, comandos prontos para copiar/colar.

Output: 5 ficheiros .md prontos para docs/.
```

**Prompt 2: "Configurar CI/CD"**
```
Estou em M5 - ENTREGAR.
Projeto: [Teu projeto] · GitHub Actions / GitLab CI (escolhe)

Preciso de PIPELINE CI/CD.
Passos: checkout código, npm ci, npm run lint, npm run test (unit + integration), npm run build,
deploy para Staging (blue-green), smoke tests, deploy para Production (se tudo OK).

Output: `.github/workflows/deploy.yml` (ou `.gitlab-ci.yml`).
```

**Prompt 3: "Configurar Observability"**
```
Estou em M5 - ENTREGAR.
Projeto: [Teu projeto] · Stack: [ex: Node.js + Express]

Preciso de MONITORING + ALERTAS.
Integra: logs centralizados (ELK / Loki), métricas (Prometheus / DataDog), alertas (Grafana / PagerDuty), dashboard.
Métricas importantes: login success/failed, response time (p50/p95/p99), error rate, database query duration,
rate limit hits. Alertas: error rate >5%, response time >500ms, DB pool >80%, deployment failed.

Output: docker-compose.yml para a stack + configuração (ou instruções para DataDog/Sentry/New Relic).
```

## Workflow Rápido

**Se usas Claude:**
1. M0: copia o Prompt M0 → gera `BRIEFING.md`
2. M1: copia os 3 Prompts M1 → gera `RISKS.md`, `DEPENDENCIES.md`, `VALIDATIONS.md`
3. M2: copia os 3 Prompts M2 → `ARCHITECTURE.md`, `CONTRACTS.ts`, estrutura de pastas
4. M3: copia os 6 Prompts M3 → código completo L4→L3→L2→L1 + testes
5. M4: copia o Prompt M4 → segurança integrada
6. M5: copia os 3 Prompts M5 → docs, CI/CD, monitoring

**Tempo total estimado:** M0 30min · M1 2-3h · M2 2-3h · M3 5-7h · M4 2-3h · M5 1-2h → **~15-20 horas de IA para produção-ready.**

## Boas Práticas

1. Lê o output completo antes de usar — a IA pode cometer erros.
2. Testa cada fase — não pules validações.
3. Guarda os outputs — a documentação fica no repositório.
4. Revê o código — a IA é ferramenta, tu és responsável.
5. Adapta os prompts — cada projeto é diferente.

## Checkpoints

M0: `BRIEFING.md` existe? · M1: `RISKS.md`, `DEPENDENCIES.md`, `VALIDATIONS.md` existem? · M2: `ARCHITECTURE.md`,
`CONTRACTS.ts`, estrutura de pastas prontos? · M3: código compila? testes passam (>80%)? · M4: security review
aprovado? · M5: deploy automático? monitoring ativo?

Quando todos os checkpoints estão ✅, podes colocar em produção com confiança.

---
---

# PARTE III — CHECKLISTS DE VALIDAÇÃO: OS GATES DA ANATOMIA

**Como usar:** antes de passar para o próximo módulo, valida TODOS os pontos do Gate.

## Gate 0 — M0 → M1 (Briefing Está Claro?)

**Arquivo:** `docs/BRIEFING.md`

**Estrutura (obrigatório):** título "BRIEFING: [Nome do projeto]" · secção Problema (1 parágrafo) · secção Utilizadores
(3 máximo, com roles/permissões) · secção Sucesso (3 métricas mensuráveis, com números) · secção Restrições (Tech,
Orçamento, Tempo, Legal) · secção O Que Não Inclui (funcionalidades para v2.0).

**Conteúdo (qualidade):** problema específico (não vago) · utilizadores com nomes/roles concretos · sucesso com
NÚMEROS (100 logins/dia, <200ms, 99.9% uptime) · restrições realistas · documento cabe em 1 página · linguagem clara.

**Comunicação:** o dono do produto confirma "é isto que queremos" · a equipa técnica confirma "podemos fazer isto" ·
documentação guardada + commit git.

✅ **Gate 0 passou?** SIM → avança para M1 · NÃO → volta a M0, refina o Briefing.

## Gate 1 — M1 → M2 (Análise Está Completa?)

**Arquivos:** `docs/RISKS.md`, `docs/DEPENDENCIES.md`, `docs/VALIDATIONS.md`

**RISKS.md:** mínimo 5 riscos identificados · cada um com nome, severidade, descrição, mitigação concreta · riscos
HIGH têm plano de mitigação antes de M3 · cobrem segurança, performance, dados, compliance.

**DEPENDENCIES.md:** mínimo 3 dependências mapeadas · cada uma com ID, nome, tipo, status, esforço · status é
`exists`/`create`/`integrate` · nenhuma fica indefinida.

**VALIDATIONS.md:** mínimo 15 casos de teste críticos · cada um com input, expected output, tipo, razão · tipos
cobrem happy path (1+), boundary (5+), error (5+) · casos vêm diretamente dos riscos mapeados.

✅ **Gate 1 passou?** SIM → avança para M2 · NÃO → volta a M1, completa a análise em falta.

## Gate 2 — M2 → M3 (Arquitetura Está Validada?)

**Arquivos:** `docs/ARCHITECTURE.md`, `src/`, `docs/CONTRACTS.ts`

**ARCHITECTURE.md:** descreve as 4 camadas (responsabilidade, dependências, exemplos) · mostra a direção das
dependências (sempre inward, L3 soberano) · explica pelo menos 5 dos 9 Sinais · contém diagrama · justifica decisões.

**Estrutura de pastas:** `src/` com `domain`, `application`, `infrastructure`, `presentation` · cada pasta com
`index.ts` · ficheiros vazios com comentários TODO (sem implementação ainda) · `tests/` com `unit/` e `integration/`.

**Contratos:** todos os Input/Output DTOs definidos · todos os Errors/Exceptions definidos · todas as interfaces de
Repository e Service definidas · sem implementação (só tipos).

**Validação de arquitetura:** L3 não depende de L4 · dependency injection será usado · L3 é puro (sem I/O) · cada
camada tem responsabilidade clara.

✅ **Gate 2 passou?** SIM → avança para M3 · NÃO → volta a M2, refaz a arquitetura.

## Gate 3 — M3 → M4 (Testes Estão OK?)

**Arquivos:** `src/` (código completo), `tests/`, `coverage/`

**Código:** sem nenhum TODO por implementar · lint passa (0 erros) · compila (0 erros de tipo) · sem `console.log`
esquecidos.

**Testes unitários:** >80% cobertura de linhas · caminho feliz testado · boundary cases testados (vazio, mínimo,
máximo) · error cases testados · testes independentes · testes rápidos (<500ms total).

**Testes de integração:** >60% cobertura de fluxos · teste completo L1→L2→L3→L4 · database real de teste · serviços
externos mockados · setup/teardown correto.

**Referência ao M1:** todos os casos de `VALIDATIONS.md` têm um teste · todos os riscos de `RISKS.md` têm teste de
mitigação (ex: "SQL Injection" → teste com query maliciosa).

✅ **Gate 3 passou?** SIM → avança para M4 · NÃO → volta a M3, corrige testes/código.

## Gate 4 — M4 → M5 (Segurança Está Aprovada?)

**Arquivos:** `SECURITY_REVIEW.md`, código com segurança implementada

**Checklist de segurança (resumo):** passwords com bcrypt (12 rounds) · mínimo 8 caracteres com regras de força ·
JWT access curto (15-30min) + refresh longo (7 dias) · cookies HttpOnly + Secure + SameSite=Strict · HTTPS + HSTS
+ TLS 1.3 · prepared statements (SQL Injection) · CSP + sanitização (XSS) · tokens CSRF · rate limiting (5
tentativas/15min) · audit logging de todas as tentativas · secrets em variáveis de ambiente · `npm audit` limpo ·
dados sensíveis encriptados em repouso · política de retenção de dados definida · OWASP Top 10 revisto.

**SECURITY_REVIEW.md:** documento com o checklist completo · para cada item HIGH/MEDIUM, descrição da implementação
· conclusão explícita: "APROVADO PARA PRODUÇÃO" ou "NÃO APROVADO — problemas: [lista]".

✅ **Gate 4 passou?** SIM → avança para M5 · NÃO → volta a M4, corrige os problemas de segurança.

## Gate 5 — M5 → Produção (Está Pronto para Deploy?)

**Arquivos:** `docs/`, pipeline CI/CD, monitoring

**Documentação:** README (>200 palavras) · docs de API · diagrama de arquitetura · guia de deployment ·
troubleshooting.

**Pipeline de deployment:** CI/CD configurado (lint → test → build → deploy-staging → smoke-tests → deploy-prod) ·
blue-green deployment · rollback automático se algo quebrar · smoke tests pós-deploy.

**Observabilidade:** logging centralizado · métricas recolhidas · dashboard criado · alertas configurados (error
rate, response time, connection pool, deployment failed) · SLA/uptime monitorizado.

**Migrações de base de dados:** versionadas · reversíveis · sem secrets nem dados de teste · testadas em staging
antes de produção.

**Health checks:** endpoint `/health` rápido (<100ms) · valida ligação à BD e serviços críticos · readiness e
liveness probes.

**Plano de rollback:** documentado (`docs/ROLLBACK.md`) · sabe-se como reverter manualmente em caso de pânico.

**Validação em staging:** deploy testado primeiro em staging (cópia fiel de produção) · smoke + performance +
load testing realizados.

**Checklist de go-live:** confirmação do produto, tech lead, QA, segurança, operações e backup.

✅ **Gate 5 passou?** SIM → **PRODUCTION READY** · NÃO → volta a M5, completa o checklist de deployment.

## Resumo Rápido dos Gates

| Gate | Ficheiro-chave | Pergunta | Passa se… |
|------|----------------|----------|-----------|
| G0 | BRIEFING.md | Briefing está claro? | 1 página, métricas mensuráveis, ok com o dono do produto |
| G1 | RISKS.md + DEPENDENCIES.md + VALIDATIONS.md | Análise completa? | Tudo mapeado, riscos mitigados, validações testáveis |
| G2 | ARCHITECTURE.md + CONTRACTS.ts | Arquitetura validada? | 4 camadas claras, L3 soberano, interfaces definidas |
| G3 | tests/ + coverage | Testes OK? | >80% coverage, sem TODOs, lint passa, compila |
| G4 | SECURITY_REVIEW.md | Segurança aprovada? | OWASP revisto, `npm audit` limpo, review aprovado |
| G5 | docs/ + CI/CD | Deploy pronto? | Docs completa, pipeline automático, monitoring ativo |

**Os Gates são rigorosos:** cada um tem requisitos obrigatórios, não sugestões. Se um requisito falha, o gate não
passa. Não se pulam gates (não se vai de M3 direto para M5) — os gates existem precisamente para evitar problemas
mais tarde, quando são mais caros de corrigir.

> ❌ Errado: "Vou fazer segurança depois, agora quero código." ✅ Certo: Gate 3 inclui testes, Gate 4 inclui
> segurança, Gate 5 inclui deploy — cada coisa no seu lugar.

Quando `G0 ✅ + G1 ✅ + G2 ✅ + G3 ✅ + G4 ✅ + G5 ✅` = **FEATURE PRODUCTION READY**. Tens um sistema bem documentado,
com cobertura de testes, seguro, deployável com confiança, monitorizável e recuperável se quebrar.

---
---

# PARTE IV — CASE STUDY: IMPLEMENTAR LOGIN COM A ANATOMIA DO SOFTWARE

**Objetivo:** demonstrar como a Anatomia guia um projeto real, do conceito até produção.
**Projeto:** sistema de autenticação para uma plataforma SaaS (Login + Sign Up + Recuperação de Password).
**Timeline:** 18-19 dias (2-3 dias por módulo).
**Stack:** Node.js + TypeScript + Express + PostgreSQL + JWT.

## M0 — Mentalidade (Dias 1-2)

**Entrada:** a ideia — "Precisamos de um login seguro para a nossa plataforma SaaS."

**Problema:** utilizadores precisam de autenticar para aceder à plataforma.
**Sucesso mensurável:** 100 logins/dia sem falhas · tempo de resposta <200ms · zero autenticações não autorizadas ·
recovery automático se falhar.
**Utilizadores-alvo:** Admin (gere utilizadores/roles) · Cliente (login, recuperar password) · Staff (suporte,
logs).
**Escopo:** login básico (email+password), sign up com validação, recuperar password. Fora de escopo (v2.0):
OAuth/SSO, 2FA.
**Contexto:** dependências externas (serviço de email, base de dados PostgreSQL existente, biblioteca JWT) ·
restrições (stack Node.js já em produção, orçamento ~€5k, 3 semanas até MVP, conformidade RGPD).

**Output — `BRIEFING.md`:**
```
# BRIEFING: Sistema de Autenticação

## Problema
Utilizadores precisam de forma segura de autenticar na plataforma.

## Utilizadores
- Cliente (2000+ potenciais) · Admin (5 internos) · Staff (10 suporte)

## Sucesso
100 logins/dia, <200ms · zero breaches · 99.9% uptime · recovery automático

## Restrições
Stack Node.js · PostgreSQL · residência de dados na UE (RGPD) · 3 semanas para MVP

## Não incluído (v2.0)
OAuth · 2FA · Social login
```

**Gate 0: ✅ APROVADO** — briefing claro, breve, com critérios mensuráveis.

## M1 — Descobrir (Dias 3-5)

**Riscos identificados (resumo):**

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| SQL Injection (email) | HIGH | Prepared statements |
| Password exposta (transporte) | HIGH | HTTPS only, TLS 1.3 |
| Session hijacking | HIGH | Cookies Secure/HttpOnly + expiração JWT |
| Brute force | HIGH | Rate limiting (5 tentativas/15min por IP) |
| Password fraca | MEDIUM | Validação regex: mín. 8 chars, número, especial |
| Duplicação de email | MEDIUM | Unique constraint + validação |
| Roubo de token | HIGH | Expiração curta (15min), refresh tokens (7 dias) |
| Fuga de base de dados | MEDIUM | Hashing bcrypt, salts |
| Abuso de reset de password | MEDIUM | Expiração de token (30min), validação de IP |

**Dependências mapeadas:** schema de utilizadores (criar, 2h) · biblioteca JWT (já existe, 0h) · serviço de hash de
password (criar, 4h) · serviço de email para reset (integrar SendGrid/Mailgun, 2h) · rate limiter por IP (criar, 3h).

**Validações críticas (excerto):** login válido → sucesso + token · email vazio → erro · email inválido → erro ·
password curta → erro · password sem carácter especial → erro · registo com email já existente → erro · 6 falhas
em 15 min → bloqueio · token expirado (>15min) → erro + redirect para login.

**Gate 1: ✅ APROVADO** — todos os riscos mapeados, dependências claras, validações documentadas.

## M2 — Projetar (Dias 6-8)

**Arquitetura 4 camadas:**
- **L4 Infrastructure:** `PostgresUserRepository` (prepared statements, transações) · `SendGridEmailService`.
- **L3 Domain (soberano):** entidade `User` (id, email, passwordHash, createdAt) · Value Object `Email` (valida
  formato, normaliza) · Value Object `Password` (valida força; o hash é feito por L2).
- **L2 Application:** `LoginUserUseCase` (recebe repositório, hasher e gerador de JWT injetados; orquestra
  `findByEmail` → `verify` → `generate token`).
- **L1 Presentation:** `POST /auth/login` — controller fino que chama o use case e define o cookie httpOnly.

**Contratos (excerto):** `CreateUserDTO { email, password }` · `UserDTO { id, email, createdAt }` ·
`LoginInput { email, password }` · `LoginOutput { token, user }` · erros: `InvalidCredentialsError`,
`UserNotFoundError`, `WeakPasswordError`.

**Estrutura de ficheiros criada:** `src/domain/{entities,value-objects,errors}` · `src/application/{use-cases,dto}`
· `src/infrastructure/{database,services,middleware}` · `src/presentation/controllers` · `tests/{unit,integration}`
· `docs/{ARCHITECTURE.md,CONTRACTS.md,VALIDATIONS.md}` — tudo com TODOs prontos para M3 preencher.

**Gate 2: ✅ APROVADO** — arquitetura respeita os 9 Sinais (domínio independente, injeção de dependências, etc).

## M3 — Construir (Dias 9-14)

Implementação completa das 4 camadas conforme os contratos do M2:
- `Email.create()` valida formato e normaliza (lowercase, trim); lança `InvalidEmailError` se inválido.
- `User.create()` gera a entidade com `Email` validado e o hash de password já calculado.
- `LoginUserUseCase.execute()` orquestra: procura utilizador → verifica password (bcrypt) → gera JWT → devolve
  `{ token, user }`; lança `UserNotFoundError` ou `InvalidCredentialsError` conforme o caso, com logging em cada
  tentativa.
- `PostgresUserRepository` implementa `create`/`findByEmail` com queries parametrizadas.
- `POST /auth/login` define o cookie (`httpOnly`, `secure`, `sameSite: 'Strict'`, `maxAge` de 15 minutos) e traduz
  erros de domínio para códigos HTTP (401 para credenciais inválidas).

**Testes:** unitários para `Email`, `User`, `LoginUserUseCase` (casos de sucesso, password inválida, utilizador não
encontrado) e testes de integração cobrindo o fluxo completo (criar utilizador → login → verificar JWT) e cenários
de falha (base de dados indisponível).

**Resultado de cobertura:** testes unitários ~85% · testes de integração ~70% · todas as validações do M1 cobertas
por pelo menos um teste.

**Gate 3: ✅ APROVADO** — todos os testes passam, cobertura >80%.

## M4 — Proteger (Dias 15-17)

Implementado: hashing de password com bcrypt (12 rounds) · geração de JWT com expiração curta (access 15min,
refresh 7 dias) · middleware de rate limiting por IP (janela de 15 minutos, limite de 5 tentativas) · HTTPS forçado
+ header HSTS · proteção CSRF · audit logger (regista tentativas de login e resets de password com IP e
timestamp) · headers de segurança (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`,
`Content-Security-Policy`).

**`SECURITY_REVIEW.md` (resumo):** autenticação e passwords ✅ · sessão e tokens ✅ · segurança de rede ✅ ·
segurança de aplicação (SQL/XSS/CSRF/rate limit/audit) ✅ · segurança de base de dados ✅ · gestão de secrets
(variáveis de ambiente, rotação mensal) ✅ · dependências (`npm audit` limpo) ✅ · conformidade RGPD ✅ · testes de
penetração (OWASP Top 10 revisto) ✅.

**Conclusão:** ✅ APROVADO PARA PRODUÇÃO.

**Gate 4: ✅ APROVADO** — revisão de segurança passou com zero vulnerabilidades conhecidas.

## M5 — Entregar (Dias 18-19)

**Documentação:** `README.md` (setup, endpoints de API com exemplos de request/response, variáveis de ambiente,
links para deployment e monitoring).

**Pipeline CI/CD:** GitHub Actions — job de teste (`npm ci`, `npm test`, `npm run lint`) seguido de job de deploy
(deploy para staging em blue-green, smoke tests, deploy para produção, verificação de saúde pós-deploy).

**Observabilidade:** dashboard (Grafana) com métricas de tentativas de login (sucesso/falha), tempo de resposta
(p50/p95/p99), taxa de erro, ativações de rate limit, tempo de geração de JWT · alertas (taxa de erro >5%, tempo
de resposta >500ms, rate limit ativado >10x/hora, pool de ligações à BD >80%) · logs centralizados (stack ELK,
todas as tentativas de login pesquisáveis por email/IP/timestamp).

**Outputs finais:** `README.md`, documentação de API, guia de deployment, dashboard de monitorização, pipeline
CI/CD — feature Login + Sign Up + Reset de Password pronta para produção, com 99.9% de uptime esperado,
conformidade OWASP e alertas em tempo real.

## Resumo: Anatomia em Ação

| Módulo | Dias | Entrada | Saída | Gate |
|--------|------|---------|-------|------|
| M0 | 1-2 | Ideia | BRIEFING.md | Briefing claro? ✅ |
| M1 | 3-5 | Briefing | RISKS.md, DEPENDENCIES.md, VALIDATIONS.md | Análise completa? ✅ |
| M2 | 6-8 | Análise | ARCHITECTURE.md, CONTRACTS.ts | Arquitetura validada? ✅ |
| M3 | 9-14 | Arquitetura | Código + testes (85%) | Testes passam? ✅ |
| M4 | 15-17 | Código | Security review | Segurança aprovada? ✅ |
| M5 | 18-19 | Securizado | Docs + deploy | Production ready? ✅ |

**Total: 19 dias para um Login pronto para produção.**

## Como Usar Este Case Study

**Para um dev novo no projeto:** lê M0 (visão) → M1 (o que foi testado) → M2 (arquitetura) → abre o código em M3
(implementação pronta).

**Para auditar:** confirma M2 (arquitetura) → M3 (testes >80%?) → M4 (security review aprovado?) → M5 (deployment
completo?).

**Para replicar noutra funcionalidade:** copia o template de `BRIEFING.md` (M0) → copia o template de `RISKS.md`
(M1) → adapta `ARCHITECTURE.md` (M2) → segue o padrão de código do M3 → reutiliza `SECURITY_REVIEW.md` (M4).

## Conclusão

A Anatomia transformou um projeto potencialmente caótico em: decisões documentadas · risco mapeado desde o início
· arquitetura testável · segurança que não é bola de cristal · deploy previsível · monitorização pronta.

**Próxima funcionalidade? Repete a partir de M0.**

---

> **Anatomia do Software v2.1.** Método agnóstico de linguagem, framework e IA. Provado por sobrevivência ao
> código real — não por aprovação.
>
> *Software limpo não é acidente. É decisão intencional, repetida a cada commit, protegida por testes que não
> mentem.*
