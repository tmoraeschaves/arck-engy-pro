# MANUAL DE MONTAGEM — ESQUELETO DE SOFTWARE
## Padrão de Engenharia · Regras de Ligação · Fundação Reutilizável

> **Versão:** 1.0 (CONSOLIDADA) · **Natureza:** Agnóstico de linguagem e framework
> **Origem:** Fundação Claude + validação cruzada de 7 IAs (GPT, DeepSeek, Grok, Perplexity, Copilot, Gemini/Aura) + decisões de Tiago
>
> **O que este documento é:** Não é uma lista do *que* fazer (isso é o Checklist de 107 itens). É o manual de *como as peças se conectam* — as regras de ligação que impedem que software vire um monobloco que desmorona. O Checklist são as peças; este é o manual de montagem.
>
> **O que mudou da v0.2 para a v1.0:** Sete IAs revisaram a fundação. O consenso foi forte: a arquitetura, as camadas e a segurança já estavam em nível sênior. As adições desta versão fecham as lacunas *operacionais* e de *evolução* que faltavam — contrato de erros, observabilidade, eventos, idempotência, governança de IA e o critério de pragmatismo. Cada adição está marcada com sua origem.

---

## NOTA DE HONESTIDADE INTELECTUAL (LEIA ANTES)

As 7 IAs concordaram em quase tudo — e isso é, ao mesmo tempo, tranquilizador e suspeito. Quando todos concordam, vale desconfiar. Por isso, três avisos honestos:

1. **O maior risco apontado por TODAS não é falta de conteúdo — é virar burocracia.** Um manual de 200 regras que ninguém segue é pior que 20 regras vivas. Por isso a regra de ouro da v1.0 (Parte 0-B): *toda regra crítica vira teste/pipeline automático, não disciplina humana*.

2. **Este documento ainda é MAPA, não TERRITÓRIO.** Todas as IAs convergiram no mesmo ponto: falta o esqueleto de código real. O manual está em ~85-90% do nível sênior; os 10-15% restantes só se provam em código rodando. Este é o último documento teórico antes de descer para código.

3. **Há um risco de over-engineering real.** Para um script pequeno ou MVP, aplicar tudo isto é desperdício. Por isso a Parte 16 (Pragmatismo) define o limiar explícito de quando o esqueleto completo se justifica.

---

## PARTE 0 — A REGRA DE OURO (POR QUE O MONOBLOCO ACONTECE)

O monobloco não nasce por falta de funcionalidades. Nasce porque **tudo conhece tudo**. Quando qualquer parte do código pode chamar qualquer outra diretamente, mudar uma peça quebra dez. Isso é acoplamento.

> **REGRA DE OURO:** Nenhuma peça se conecta a outra diretamente. Toda conexão passa por um **contrato** (interface). Uma peça depende do *contrato*, nunca da *implementação concreta* da outra. Você pode arrancar qualquer órgão e plugar outro, desde que respeite o mesmo contrato.

### 0-B — A REGRA DE OURO OPERACIONAL *(consenso de todas as IAs)*

> **Toda regra deste manual que for crítica precisa virar verificação automática — teste, gate de pipeline ou validação de arquitetura. Não confiar em disciplina humana.**

Exemplos do que a CI deve **reprovar automaticamente**:
- `domínio` importa `infraestrutura` → **falha o build**
- `frontend` acessa banco diretamente → **falha o build**
- segredo no histórico git → **falha o build**
- cobertura de testes abaixo do mínimo → **bloqueia o merge**
- dependência com CVE crítico conhecido → **bloqueia o deploy**

Uma regra que não pode ser verificada por máquina é uma intenção, não uma garantia.

---

## PARTE 1 — AS CAMADAS E A DIREÇÃO DO FLUXO

### As 4 camadas universais

```
┌─────────────────────────────────────────────────┐
│  L1 · APRESENTAÇÃO (Entrada/Saída)               │
│  API, CLI, UI, controllers, webhooks             │
├─────────────────────────────────────────────────┤
│  L2 · APLICAÇÃO (Orquestração / Casos de Uso)    │
│  Use cases, services, comandos, consultas        │
├─────────────────────────────────────────────────┤
│  L3 · DOMÍNIO (Regras de Negócio — O CORAÇÃO)    │
│  Entidades, value objects, políticas, eventos    │
├─────────────────────────────────────────────────┤
│  L4 · INFRAESTRUTURA (Detalhes Técnicos)         │
│  Banco, APIs externas, filas, arquivos, e-mail   │
└─────────────────────────────────────────────────┘
```

### A REGRA DA DIREÇÃO (a mais importante de todas)

```
        DEPENDÊNCIA APONTA SEMPRE PARA DENTRO →
   L1 ──depende→ L2 ──depende→ L3
                  ↑              ↑
   L4 (infra) ────┘──────────────┘
   (infra IMPLEMENTA contratos definidos por L3/L2)
```

| Regra | Permitido | PROIBIDO |
|-------|-----------|----------|
| RL-01 | L1 chama L2 | L1 acessar L3 ou L4 diretamente |
| RL-02 | L2 chama L3 | L2 conter detalhe técnico (SQL, HTTP) |
| RL-03 | L3 não chama ninguém de fora | L3 importar QUALQUER coisa de L1, L2 ou L4 |
| RL-04 | L4 implementa contratos de L3/L2 | L3 conhecer detalhes de L4 |

**O coração (L3) é soberano:** não importa nada de fora, não sabe que existe banco nem internet. Se você deletar todo o L4 e o L3 ainda compilar, sua fundação está correta. Trocar de banco (L4) não toca no coração (L3). Trocar de framework web (L1) não toca nas regras (L3).

---

## PARTE 2 — A INVERSÃO DE DEPENDÊNCIA

O truque de engenharia que a maioria das gerações de IA erra e que causa o monobloco.

**Problema:** O domínio (L3) precisa salvar dados, mas salvar é trabalho da infra (L4). Se L3 chamar L4 direto, viola RL-03 e acopla o coração ao banco.

**Solução:**
1. **L3 define o contrato** do que precisa: interface `RepositorioDeUsuario` com `salvar(usuario)`. Define *o que* quer, não *como*.
2. **L4 implementa** esse contrato: `RepositorioDeUsuarioPostgres` que escreve no banco real.
3. **L3 usa o contrato** sem nunca saber qual implementação roda por trás.

**RL-05 (Injeção de Dependência):** implementações concretas são injetadas de fora para dentro, no Composition Root. O coração nunca instancia infraestrutura — recebe-a pronta, no formato do contrato.

**Teste:** se você precisa de banco rodando para testar uma regra de negócio, a ligação está errada. Regra de negócio se testa com mock do contrato, em milissegundos.

---

## PARTE 3 — O ESQUELETO DE PASTAS (CONSOLIDADO)

*Estrutura enriquecida com CQRS leve (Gemini/Aura), bounded contexts (Copilot), e o soquete de segurança explícito (Gemini/Aura).*

```
projeto/
├── src/
│   ├── apresentacao/        ← L1 · pontos de entrada
│   │   ├── http/            (rotas REST/GraphQL, controllers)
│   │   ├── websocket/
│   │   ├── cli/
│   │   └── middleware/      (auth, rate limit, validação, correlation-id)
│   │
│   ├── aplicacao/           ← L2 · casos de uso / orquestração
│   │   ├── comandos/        (operações que ALTERAM estado — CQRS)
│   │   ├── consultas/       (operações que só LEEM estado — CQRS)
│   │   ├── casos-de-uso/    (orquestração de fluxos)
│   │   └── contratos/       (interfaces/portas que L2 espera de L4)
│   │
│   ├── dominio/             ← L3 · O CORAÇÃO (não importa nada de fora)
│   │   ├── usuarios/        ← bounded context (fronteira de negócio)
│   │   ├── pagamentos/      ← bounded context
│   │   │   ├── entidades/
│   │   │   ├── value-objects/
│   │   │   ├── politicas/   (regras de negócio puras)
│   │   │   ├── eventos/     (eventos de domínio)
│   │   │   └── erros/       (erros de negócio bem tipados)
│   │   └── contratos/       (interfaces: o que o domínio precisa)
│   │
│   └── infraestrutura/      ← L4 · detalhes técnicos
│       ├── persistencia/    (repositórios concretos, banco)
│       ├── mensageria/      (filas, brokers, outbox)
│       ├── externos/        (clientes de APIs de terceiros)
│       └── seguranca/
│           ├── cripto/      (hashing, cifragem, chaves)
│           └── soquetes/    ← ONDE O SISTEMA PROPRIETÁRIO PLUGA (RL-21)
│
├── composition-root/        ← O ÚNICO lugar onde tudo se conecta (RL-06)
├── config/                  ← config por ambiente (NUNCA segredos)
├── contracts/               ← contratos versionados compartilhados
│   ├── api/                 (OpenAPI/GraphQL schema)
│   ├── eventos/             (UsuarioCriadoV1, UsuarioCriadoV2...)
│   └── integracao/
├── testes/
│   ├── unidade/             (testam L3 isolado, sem infra)
│   ├── integracao/          (testam L4 contra recursos reais)
│   ├── contrato/            (consumidor/provedor)
│   ├── e2e/                 (jornadas completas L1→L4)
│   └── seguranca/           (abuso, fuzzing, IDOR, injection)
├── infra/                   ← IaC (Terraform, Docker, K8s)
├── docs/
│   ├── INDEX.md             ← ponto de retomada de contexto
│   ├── adr/                 ← Architecture Decision Records
│   ├── arquitetura/         ← diagramas C4
│   ├── threat-model/        ← STRIDE, attack surface, abuse cases
│   ├── runbooks/            ← playbooks por incidente
│   └── governanca/          ← RACI, AI_GOVERNANCE, failure-modes
├── .github/workflows/       ← CI/CD real
├── .env.example             ← template (sem valores reais)
├── README.md · CONTRIBUTING.md · SECURITY.md · CHANGELOG.md
```

**RL-06 (Composition Root):** existe UM e apenas um lugar onde implementações concretas de L4 são plugadas nos contratos de L3/L2. Em nenhum outro lugar peças concretas se instanciam mutuamente.

---

## PARTE 4 — TABELA-MESTRE DE REGRAS DE LIGAÇÃO (RL-01 a RL-36)

### Ligações estruturais

| ID | Regra | Justificativa |
|----|-------|---------------|
| RL-01 | Dependência sempre aponta para dentro (L1→L2→L3) | Mantém o coração isolado |
| RL-02 | O Domínio (L3) não importa nada externo | O coração não depende de detalhes |
| RL-03 | Comunicação entre módulos só via contrato/interface | Permite trocar implementações |
| RL-04 | Infraestrutura implementa contratos, nunca os define | Inverte a dependência |
| RL-05 | Dependências são injetadas, não instanciadas internamente | Desacopla criação de uso |
| RL-06 | Existe um único Composition Root | Centraliza a montagem |
| RL-07 | Sem dependências circulares entre módulos | Ciclo = monobloco |

### Ligações de dados

| ID | Regra | Justificativa |
|----|-------|---------------|
| RL-08 | Dados cruzam fronteiras como DTOs, não entidades cruas | A entidade não vaza do coração |
| RL-09 | Entrada externa é validada na fronteira (L1) antes de entrar | Nada não-confiável chega ao domínio |
| RL-10 | Saída é serializada na fronteira (L1), não no domínio | Domínio não conhece JSON/HTTP |
| RL-11 | O formato do banco (L4) nunca dita o formato do domínio (L3) | Banco serve o domínio |

### Ligações de segurança (transversais)

| ID | Regra | Justificativa |
|----|-------|---------------|
| RL-12 | Toda fronteira de entrada autentica e autoriza antes de processar | Zero Trust entre camadas |
| RL-13 | Segredos só existem em L4/config injetada, nunca em L3 ou no código | Coração não carrega credenciais |
| RL-14 | Erros de domínio não vazam detalhe técnico para fora (L1 traduz) | Não revela interior ao atacante |
| RL-15 | Toda ação sensível gera registro de auditoria imutável | Rastreabilidade |
| RL-19 | Porta única: UM caminho de entrada autenticada, sem porta dos fundos | Toda entrada alternativa é elo fraco |
| RL-20 | Recuperação de emergência só por break-glass (auditado + alarme), nunca backdoor | Retomar controle sem criar vulnerabilidade |
| RL-21 | Um sistema de segurança dedicado pluga por contrato (soquete), não acoplamento | Camada de segurança substituível |

### Ligações de evolução

| ID | Regra | Justificativa |
|----|-------|---------------|
| RL-16 | Contratos públicos têm versão; quebrá-los exige nova versão | Não quebra quem depende |
| RL-17 | Novo recurso entra como peça plugada, não alterando o coração | Aberto/Fechado |
| RL-18 | Configuração muda por ambiente sem recompilar código | Mesmo artefato em todos os ambientes |

### Ligações de promoção entre ambientes

| ID | Regra | Justificativa |
|----|-------|---------------|
| RL-22 | Nada chega à produção sem passar por staging | Staging é o último filtro |
| RL-23 | O MESMO artefato roda nos três ambientes | "Funciona na minha máquina" deixa de existir |
| RL-24 | A diferença entre ambientes é APENAS config injetada | Mesmo código, contextos diferentes |
| RL-25 | Staging espelha produção fielmente | Teste em ambiente diferente não vale |
| RL-26 | Dados de produção NUNCA vão crus para dev/staging | Vazamento de PII |
| RL-27 | Promoção para produção é automatizada e auditável | Deploy manual é erro sem rastro |
| RL-28 | Toda promoção pode ser revertida (rollback testado) | Subir sem poder descer é apostar |

### Ligações de estado, resiliência e operação *(NOVO — v1.0)*

| ID | Regra | Origem |
|----|-------|--------|
| RL-29 | **Idempotência na fronteira:** toda operação mutável aceita chave única (Idempotency-Key); requisição repetida por falha de rede não duplica a ação. Cache da chave fica em L4. | Gemini/Aura |
| RL-30 | **Imutabilidade de DTOs:** dados que cruzam L1→L2 são estritamente read-only; a fronteira não altera um DTO após validá-lo. | Gemini/Aura |
| RL-31 | **Resiliência descentralizada:** retry, circuit breakers e timeouts vivem só em L4 (ou no gateway). O Domínio (L3) assume que o contrato funciona ou falha deterministicamente. | Gemini/Aura |
| RL-32 | **Rede restrita por política:** banco/fila/cache nunca expostos à internet; L4-banco só aceita conexão de L4-app por rede privada; L1 exposta, mas com WAF/rate-limit antes. | DeepSeek |
| RL-33 | **Config e segredos em RUNTIME, nunca em build:** segredos via vault; `.env` não versionado; `.env.example` com placeholders; health-check valida se todas as variáveis obrigatórias existem; rotação e expiração definidas. | DeepSeek + Perplexity |
| RL-34 | **Identidade máquina-a-máquina:** serviços se autenticam entre si (tokens de curta duração ou mTLS), não só humanos. | Perplexity |
| RL-35 | **Compatibilidade código↔banco no rollout:** migração de schema compatível com a versão anterior do código durante deploy gradual (leitura/escrita simultânea sem quebra). | Perplexity |
| RL-36 | **Ambientes fisicamente isolados:** dev/staging/prod em VPCs/sub-redes separadas; credenciais de produção nunca existem fora de produção; acesso a prod restrito com MFA + break-glass. | DeepSeek (reforça RL-26) |

---

## PARTE 5 — O CICLO DE VIDA DE UMA REQUISIÇÃO

```
1. ENTRADA       [L1] Requisição chega (HTTP/CLI/evento)
2. PORTÃO        [L1] Autenticação + Autorização (RL-12, RL-19)
3. IDEMPOTÊNCIA  [L1→L4] Verifica chave de idempotência (RL-29)
4. VALIDAÇÃO     [L1] Entrada validada → DTO imutável (RL-09, RL-30)
5. ORQUESTRAÇÃO  [L2] Caso de uso recebe DTO, coordena (comando ou consulta)
6. REGRA         [L3] Domínio aplica regras de negócio (coração)
7. PERSISTÊNCIA  [L3] pede via CONTRATO → [L4] implementação salva (RL-04)
8. AUDITORIA     [L4] Registro imutável da ação (RL-15)
9. RESPOSTA      [L2] devolve → [L1] serializa saída (RL-10)
10. SAÍDA        [L1] Resposta entregue, sem vazar detalhe interno (RL-14)
```

**Validação:** se em algum passo uma camada "pula" outra (ex: L1 indo direto ao banco), a fundação está rachada ali.

---

## PARTE 5A — A PORTA ÚNICA BLINDADA (SEM PORTA DOS FUNDOS)

> **RL-19 — Existe UMA via de entrada autenticada. Não há entrada alternativa, oculta ou "de emergência". Toda a robustez se concentra nessa porta única.**

Uma porta dos fundos é um *backdoor* — depende de permanecer secreta, e segredos vazam (estão no código, no git, na memória de quem sabe). Um atacante que já entrou procura o backdoor primeiro.

| Sub-regra | Exigência na porta única |
|-----------|--------------------------|
| RL-19.1 | Autenticação forte obrigatória (MFA para acesso privilegiado) |
| RL-19.2 | Autorização por menor privilégio verificada a cada recurso (anti-IDOR) |
| RL-19.3 | Rate limiting e proteção anti-brute-force |
| RL-19.4 | Toda tentativa — sucesso ou falha — é auditada |
| RL-19.5 | Nenhuma credencial padrão; nenhuma conta hardcoded |

---

## PARTE 5B — RECUPERAÇÃO DE EMERGÊNCIA (BREAK-GLASS, NÃO BACKDOOR)

> **RL-20 — A recuperação de emergência é um "cofre com alarme": existe, é conhecida, mas abri-la exige credencial separada e reforçada, dispara notificação imediata e fica registrada para sempre.**

| BACKDOOR (proibido) | BREAK-GLASS (correto) |
|---------------------|------------------------|
| Secreto, oculto | Documentado e conhecido |
| Ignora a autenticação | Usa autenticação *reforçada* |
| Sem rastro | Alarme + auditoria imutável ao usar |
| Uma pessoa decide | Pode exigir dois operadores (dual control) |

**Contra sequestro/ransomware:** a resposta não é uma porta — é restaurar de backup **imutável** + DR **testado** + audit trail imutável. Não negociar; restaurar.

---

## PARTE 5C — ENGANO DEFENSIVO E O SOQUETE DE SEGURANÇA

**Honeypot / tarpit — camada de DETECÇÃO, não barreira.** Uma isca que parece entrada sensível mas não leva a nada real. Dispara alarme silencioso, registra o atacante, pode atrasá-lo (tarpit). Limite honesto: pega o oportunista, não o atacante avançado — é alerta antecipado, não muralha.

> **RL-21 — Um sistema de segurança dedicado (detecção + guardião de integridade + engano defensivo) pluga na fundação por CONTRATO, na pasta `infraestrutura/seguranca/soquetes/`, como órgão substituível. A fundação define o soquete; a implementação vem depois.**

| Sub-regra | Exigência do soquete |
|-----------|----------------------|
| RL-21.1 | A camada de segurança expõe contrato claro: "inspecionar requisição", "registrar evento", "bloquear/alertar" |
| RL-21.2 | O domínio (L3) nunca conhece o sistema concreto, só o contrato |
| RL-21.3 | Trocar/evoluir a segurança não toca no coração |
| RL-21.4 | O sistema recebe os eventos de auditoria (RL-15) como fonte de sinal |

---

## PARTE 5D — PROMOÇÃO ENTRE AMBIENTES (DEV → STAGING → PRODUÇÃO)

```
   DEV ──promove→ STAGING ──promove→ PRODUÇÃO
   (criar)        (validar)          (servir)
```

Regras RL-22 a RL-28 e RL-36 (ver Tabela-Mestre). Síntese operacional acrescentada pelas IAs: o deploy precisa de **graceful shutdown** (conexões ativas terminam antes do desligamento), a nova versão só recebe tráfego após **health-check pós-inicialização**, e há **rollback automático** se o erro 5xx ultrapassar o limiar (ex: 1% em 5 min). *(DeepSeek)*

**Teste:** o artefato em produção é byte-a-byte o mesmo que passou por staging? Se foi recompilado entre ambientes, RL-23 está quebrada.

---

## PARTE 9 — MÓDULOS DE DOMÍNIO E FRONTEIRAS INTERNAS *(NOVO — Copilot)*

Camadas evitam o monobloco *vertical*. Mas o domínio pode virar um monobloco *interno* se tudo dentro de L3 conhecer tudo. A defesa são os **bounded contexts**: fronteiras de negócio dentro do domínio.

> **RL-DDD-01 — Cada contexto de negócio (usuarios, pagamentos, assinaturas) é uma fronteira. Um contexto fala com outro apenas via contrato, nunca acessando suas entidades internas diretamente.**

Exemplo: `pagamentos` não importa a entidade `Usuario` de `usuarios` — recebe um `UsuarioId` ou um DTO. Assim, mudar as regras de usuário não quebra pagamentos.

---

## PARTE 10 — CONTRATO DE ERROS E PROPAGAÇÃO *(NOVO — Copilot + Gemini + Perplexity)*

Este era um ponto aberto da v0.2. Agora fechado. Erros têm tipo por camada e regras de tradução.

| Camada | Tipo de erro | Exemplo |
|--------|--------------|---------|
| L3 Domínio | Erros de negócio ricos e tipados | `SaldoInsuficiente`, `UsuarioBloqueado` |
| L2 Aplicação | Mapeia erro de domínio para resultado de caso de uso | `OperacaoNegada(motivo)` |
| L4 Infra | Encapsula erro técnico genérico; nunca vaza o bruto | `FalhaDePersistencia` (não o erro SQL cru) |
| L1 Apresentação | Traduz para HTTP/CLI sem vazar interior | `422 Unprocessable`, `403 Forbidden` |

**Regras de ligação de erro:**

| ID | Regra |
|----|-------|
| EL-01 | L3 nunca lança erro técnico (timeout, SQL, HTTP); só erro de negócio |
| EL-02 | L4 nunca vaza erro bruto; encapsula em erro técnico genérico para L2 |
| EL-03 | L1 é o único lugar que conhece códigos HTTP/formatos de resposta |
| EL-04 | Todo erro tem código estável, severidade e correlação com auditoria |
| EL-05 | Erro nunca expõe stack trace, query ou dado interno ao usuário final |

---

## PARTE 11 — OBSERVABILIDADE E OPERAÇÃO *(NOVO — Copilot + GPT)*

Auditoria (RL-15) responde "quem fez o quê". Observabilidade responde "como o sistema está e por que falhou". São coisas diferentes.

| ID | Regra |
|----|-------|
| OBS-01 | Toda requisição ganha um ID único em L1 que acompanha logs em L2/L3/L4 (correlation-id) |
| OBS-02 | O domínio (L3) não conhece formato de log; emite eventos de domínio, e L4 registra |
| OBS-03 | Logs são estruturados (JSON), com: request_id, trace_id, user_id, operação, resultado, duração |
| OBS-04 | Logs nunca contêm secrets, PII ou tokens (sanitização obrigatória) |
| OBS-05 | Métricas em percentis (p50/p95/p99) com tendência, não só média |
| OBS-06 | Monitoramento é proativo: alerta de "previsão de esgotamento de disco/memória em 30 dias", não só alarme reativo |
| OBS-07 | SLOs ligados a automação: qual alarme dispara rollback, freeze de deploy ou escalonamento humano |

**Catálogo de modos de falha** (`docs/governanca/failure-modes.md`) — *GPT*: tabela do comportamento esperado quando cada dependência falha (banco fora → retry+fallback; API lenta → timeout; fila parada → dead-letter queue; credencial exposta → rotação).

**Modo degradado** *(Perplexity)*: definir o que acontece quando dependências externas caem — leitura-somente, fila, fallback, ou negação explícita. Sistema confiável degrada de forma controlada, não quebra inteiro.

---

## PARTE 13 — EVENTOS E MENSAGERIA *(NOVO — Copilot + Gemini)*

Para sistemas assíncronos/distribuídos, eventos substituem chamadas diretas. A regra de ligação se mantém: o domínio publica na sua própria linguagem; a infra traduz para o broker.

| ID | Regra |
|----|-------|
| EVT-01 | Domínio (L3) emite eventos de domínio puros, sem detalhe técnico |
| EVT-02 | L4/mensageria traduz evento de domínio em mensagem de fila/broker |
| EVT-03 | Consumidores externos nunca recebem entidade de domínio, só DTO de evento |
| EVT-04 | Eventos são versionados por tipo (`UsuarioCriadoV1`, `UsuarioCriadoV2`) |
| EVT-05 | Consistência via Outbox pattern: o evento e a mudança de estado são atômicos |

---

## PARTE 14 — VERSIONAMENTO DE CONTRATOS *(NOVO — Copilot + Perplexity)*

| ID | Regra |
|----|-------|
| VC-01 | Nunca remover campo de contrato público; apenas depreciar e remover em nova major |
| VC-02 | Semver: patch = correção; minor = adição compatível; major = breaking change |
| VC-03 | Breaking change anunciado com pelo menos 1 release de antecedência + janela de suporte à versão antiga |
| VC-04 | Changelog obrigatório, gerado automaticamente |
| VC-05 | API versionada na rota (`/v1/`, `/v2/`); cliente tipado gerado do contrato (OpenAPI), CI quebra se divergir |

---

## PARTE 15 — GOVERNANÇA DE IA *(NOVO — GPT, o ponto mais original da revisão)*

Esta seção existe especificamente porque o objetivo é construir software sério *usando IA*. É o que separa "IA escrevendo código" de "engenharia assistida por IA".

**A IA PODE:** sugerir código, criar testes, explicar arquitetura, gerar boilerplate.

**A IA NÃO PODE decidir sozinha:**
- modelo de segurança · permissões · criptografia
- migrações destrutivas · contratos públicos
- alterar fronteiras de arquitetura (mover algo entre camadas)

> **RL-IA-01 — Toda mudança gerada por IA precisa responder, antes do merge: (1) Qual problema resolve? (2) Qual regra arquitetural respeita? (3) Qual teste prova? (4) Qual risco introduz?**

Isto vive em `docs/governanca/AI_GOVERNANCE.md`. É a resposta direta ao medo do "vibe coding": não é esconder que a IA ajudou — é provar que houve julgamento de engenharia sobre o que ela produziu.

---

## PARTE 16 — PRAGMATISMO E ESCOPO (QUANDO APLICAR TUDO ISTO) *(NOVO — consenso, especialmente Gemini + Copilot + DeepSeek)*

A crítica mais importante de todas as IAs: **não construa uma catedral vazia.** A fundação deve ser proporcional ao prédio.

| ID | Regra |
|----|-------|
| PRAG-01 | Para script de uso único ou MVP descartável (<3 meses de vida): aplicar apenas L3 limpo + L4 mínimo. O resto é peso morto. |
| PRAG-02 | A partir do momento em que há **usuários externos** OU **dados sensíveis** (PII, financeiro, identidade, saúde): o esqueleto completo é obrigatório. |
| PRAG-03 | Nenhuma abstração existe sem motivo documentado (`docs/governanca/complexity-budget.md`). Se não há motivo escrito, a abstração sai. |

**Itens que TODAS as IAs concordaram em rebaixar de MUST para SHOULD** (para evitar over-engineering):
- Chaos Engineering → SHOULD (só para sistemas críticos)
- Mutation Testing → SHOULD (custo-benefício baixo no início)
- Distributed Tracing → SHOULD (só para sistemas com >5 serviços)
- Bug Bounty → SHOULD (só se exposto publicamente)

---

## PARTE 17 — CHECKLIST DE VALIDAÇÃO DO ESQUELETO (EV-01 a EV-24)

Os 12 originais + 5 da v0.2 + 7 novos das IAs.

**Fundação (provável em código):**
- [ ] EV-01 — Deleto toda L4 e o domínio L3 ainda compila?
- [ ] EV-02 — Testo uma regra de negócio sem banco rodando?
- [ ] EV-03 — Cada módulo comunica com outro só por contrato?
- [ ] EV-04 — Existe um único Composition Root?
- [ ] EV-05 — Não há dependência circular?
- [ ] EV-06 — Trocar de banco afeta só a pasta de persistência?
- [ ] EV-07 — Trocar de framework web afeta só a apresentação?
- [ ] EV-08 — Nenhum segredo no código ou histórico git?
- [ ] EV-09 — Toda entrada externa é validada antes do domínio?
- [ ] EV-10 — Ponto único de auth/autorização por requisição?
- [ ] EV-11 — Novo recurso é peça plugada, não reescrita do coração?
- [ ] EV-12 — Dev novo entende a regra só olhando as pastas?
- [ ] EV-13 — Existe só UMA via de entrada, sem porta dos fundos?
- [ ] EV-14 — Recuperação de emergência é break-glass, não backdoor?
- [ ] EV-15 — O artefato em produção é idêntico ao de staging?
- [ ] EV-16 — Nada chega à produção sem passar por staging, automatizado?
- [ ] EV-17 — Existe soquete (contrato) pronto para um sistema de segurança dedicado?

**Operação e evolução (novos — v1.0):**
- [ ] EV-18 — A CI reprova automaticamente se o domínio importar infraestrutura? *(a regra virou teste)*
- [ ] EV-19 — Operação mutável é idempotente (requisição duplicada não duplica ação)?
- [ ] EV-20 — Erros seguem o contrato EL-01..EL-05 (L3 não vaza erro técnico)?
- [ ] EV-21 — Toda requisição tem correlation-id rastreável L1→L4?
- [ ] EV-22 — Existe rollback automático disparado por SLO quebrado?
- [ ] EV-23 — Toda mudança gerada por IA responde às 4 perguntas (RL-IA-01)?
- [ ] EV-24 — O nível de complexidade é proporcional ao escopo (PRAG-01/02)?

---

## PARTE 18 — O TESTE DO ENGENHEIRO CÉTICO *(GPT + DeepSeek)*

O teste final antes de produção. "Eu confiaria isto em produção?"

- Consigo trocar o banco sem mexer no domínio?
- Consigo explicar cada decisão (há ADR)?
- Sei quem alterou cada coisa (auditoria)?
- Sei detectar um ataque (observabilidade + segurança)?
- Sei recuperar de um desastre (DR testado)?
- Consigo provar que funciona (testes)?
- Consigo remover uma dependência?

**Se alguma resposta for "não", falta fundação.**

E a pergunta que define a postura — *resposta consensual de todas as IAs*: **um bom engenheiro não esconde falhas até alguém competente resolver. Ele procura as falhas de propósito, cedo.** Assume que a arquitetura tem pontos cegos, que a integração vai quebrar, que usuários farão o inesperado — e cria mecanismos para revelar isso antes do atacante. O pior sistema não é o que tem falhas; é o que tem falhas *invisíveis*.

---

## PARTE 19 — VEREDITO DA BANCADA DE IAs (HONESTO)

Notas consolidadas da fundação atual (média das avaliações):

| Dimensão | Nota | Observação |
|----------|------|------------|
| Arquitetura | 9.0/10 | Separação de camadas e inversão de dependência em nível sênior |
| Segurança | 9.0/10 | Porta única, break-glass, audit imutável, Zero Trust |
| Backend | 9.0/10 | Estrutura excelente (CQRS leve, bounded contexts) |
| **Frontend** | **7.5/10** | **Ponto fraco unânime — precisa de typed API client, auth validada no backend, error boundaries** |
| Integração | 8.0/10 | Boa na teoria; precisa contrato forte (OpenAPI + cliente gerado) |
| Operação | 8.0/10 | Precisa de automação: as regras viram testes/pipeline |
| Governança | 8.0/10 | Fechada com AI_GOVERNANCE, RACI, runbooks |

**Consenso final:** com estas adições, a fundação deixa de ser "vibe coding com checklist" e passa a ser **engenharia assistida por IA com governança** — indistinguível de trabalho sênior em método, rastreabilidade e controle. Está em ~85-90% do nível sênior completo.

**Os 10-15% que faltam, segundo TODAS as IAs:** o esqueleto de código real. Este é o último documento teórico. O próximo passo é descer para código.

---

## PARTE 20 — PRÓXIMO PASSO (O ÚNICO QUE FALTA)

Todas as 7 IAs convergiram na mesma recomendação final, sem exceção: **materializar este manual num scaffold de código real**, começando por uma linguagem (a sugestão majoritária foi TypeScript/Node, por facilidade de manutenção e tipagem ponta-a-ponta).

O scaffold mínimo provaria os testes EV-01 a EV-24 em código rodando:
- monorepo com `packages/domain` puro + `packages/contracts`
- 1-2 casos de uso completos (ex: criar usuário) atravessando L1→L4
- Composition Root real
- 1 repositório com interface + duas implementações (in-memory para teste + Postgres)
- CI que reprova violação de arquitetura (EV-18)
- threat model + 1 ADR de exemplo
- Docker Compose para dev

**Quando você decidir a stack do primeiro projeto real, descemos isto para código — e aí a planta vira alicerce de concreto.**

---

> *Documento consolidado a partir da fundação Claude e da revisão cruzada de GPT, DeepSeek, Grok, Perplexity, Copilot e Gemini/Aura. Contradições foram tratadas como sinal. Onde houve divergência (granularidade de camadas, limiar de aplicação, MUST vs SHOULD), a decisão está registrada nas Partes 16 e 19. Versão 1.0 — pronta para virar código.*
