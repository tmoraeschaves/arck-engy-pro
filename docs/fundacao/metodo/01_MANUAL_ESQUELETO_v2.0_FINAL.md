# MANUAL DE MONTAGEM — ESQUELETO DE SOFTWARE
## Versão 2.0 FINAL · Validada em Código Real

> **O que mudou da v1.0 para a v2.0:** A v1.0 era teoria validada por 7 IAs. A v2.0 é a v1.0 **aplicada a um projeto real** (ARCK & ENGY Pro) e corrigida pelo que o código ensinou. Cada lição abaixo veio de um erro real cometido e corrigido durante a montagem — não de especulação.
>
> **Natureza:** Agnóstico de linguagem e framework.
> **Composição:** Princípios (Parte 0) → Regras de Ligação (Partes 1-5) → Validação (Parte 6) → Lições do Campo (Parte 7) → Checklist (documento irmão).

---

## NOTA DE ABERTURA — O QUE O CÓDIGO REAL ENSINOU

Sete IAs aprovaram o Manual v1.0 na teoria. Depois, aplicámos ao ARCK. O que aconteceu na prática confirmou o método **e** revelou cinco coisas que nenhuma revisão teórica tinha apanhado:

1. **O monobloco não morre quando se constrói a fundação certa — morre quando se MATA a cópia velha.** Construir o coração limpo ao lado do monólito é fácil. O difícil, e o que a maioria evita, é a cirurgia que apaga as cópias antigas. Enquanto a cópia velha respira, o monobloco está vivo.

2. **"Apagar código morto" tem uma ordem obrigatória: verificar primeiro, apagar depois.** Durante a montagem, código foi apagado e só *depois* se confirmou que nada o usava. O resultado foi correto, mas o protocolo foi perigoso. Virou regra (RL-37).

3. **Os testes do "caminho feliz" mentem sobre robustez.** 28 testes passavam e o sistema *parecia* sólido. Os testes de fronteira (vazio, IDs duplicados, contaminação parcial) revelaram comportamentos implícitos invisíveis — como `.every()` retornar `true` num array vazio. Robustez prova-se induzindo falha, não confirmando sucesso (RL-38).

4. **A ponte entre camadas precisa de teste tanto quanto as camadas.** Os adaptadores que traduzem dados da UI para o domínio (`toNo`, `toLigacoes`) são onde o lixo entra silenciosamente. Se traduzem errado, o coração recebe veneno e ninguém vê.

5. **Estados que partilham o mesmo valor precisam de nomes diferentes.** No ARCK, "diagrama vazio" e "diagrama com erro" mostravam ambos zero — mas significam coisas opostas (inércia vs. erro). Valor igual, semântica oposta. O estado tem de ser *nomeado* no código, não apenas medido (RL-39).

---

## PARTE 0 — A REGRA DE OURO

> **REGRA DE OURO:** Nenhuma peça se conecta a outra diretamente. Toda conexão passa por um **contrato** (interface). Uma peça depende do *contrato*, nunca da *implementação concreta* da outra.

> **REGRA DE OURO OPERACIONAL (0-B):** Toda regra crítica vira verificação automática — teste ou gate de pipeline. Não confiar em disciplina humana. Uma regra que não pode ser verificada por máquina é uma intenção, não uma garantia.

**Prova no ARCK:** a regra "o domínio não importa nada de fora" não foi confiada à boa vontade. Virou teste (`EV-01`: deletar a infra e o domínio ainda compila). E o teste rodou — 39 vezes, verde.

---

## PARTE 1 — AS 4 CAMADAS E A DIREÇÃO DO FLUXO

```
┌─────────────────────────────────────────────────┐
│  L1 · APRESENTAÇÃO   (UI, API, CLI)              │
├─────────────────────────────────────────────────┤
│  L2 · APLICAÇÃO      (casos de uso, orquestração)│
├─────────────────────────────────────────────────┤
│  L3 · DOMÍNIO        (regras — O CORAÇÃO)         │
├─────────────────────────────────────────────────┤
│  L4 · INFRAESTRUTURA (banco, externos, ficheiros)│
└─────────────────────────────────────────────────┘

        DEPENDÊNCIA APONTA SEMPRE PARA DENTRO →
   L1 ──→ L2 ──→ L3 ←── L4 (implementa contratos de L3)
```

| RL | Permitido | Proibido |
|----|-----------|----------|
| RL-01 | L1→L2→L3 (para dentro) | L1 acessar L3/L4 direto |
| RL-02 | L3 não importa nada externo | L3 conhecer banco/HTTP |
| RL-03 | Comunicação só por contrato | Acoplamento direto |
| RL-04 | L4 implementa contratos | L3 conhecer L4 |

**Prova no ARCK:** o coração (`dominio.ts`, `arck-validador.ts`, `engy-tensao.ts`) não importa React, não importa tela, não importa storage. Roda em milissegundos num terminal. É o L3 soberano, real.

---

## PARTE 2 — INVERSÃO DE DEPENDÊNCIA

L3 define o contrato (`IArck`, `IEngy`). L4/L1 implementam ou consomem. A UI recebe o serviço pronto por uma fábrica (`criarArck()`), nunca instancia o validador diretamente.

| RL | Regra |
|----|-------|
| RL-05 | Dependências injetadas (fábrica/composition root), não instanciadas internamente |
| RL-06 | Um único Composition Root |
| RL-07 | Sem dependências circulares |

**Prova no ARCK:** `servico.ts` é o único ponto que conhece as funções internas. A UI importa `@arck/core` e recebe `criarArck()`. Trocar o motor por dentro não toca na UI.

---

## PARTE 3 — O CONTRATO COMO PORTA ÚNICA DE ENTRADA DO MÓDULO

Esta lição ganhou destaque próprio na v2.0 porque foi decisiva no ARCK.

> **RL-03-bis (Barrel Export):** Cada módulo expõe UM ponto de entrada público (`index.ts`). Consumidores importam só dele. A estrutura interna do módulo pode mudar sem quebrar quem o consome.

**Prova no ARCK:** antes, a UI importava `../../../../core/src/servico` — um caminho relativo frágil que quebraria se a pasta mudasse. Corrigiu-se com um `index.ts` (barrel) + alias `@arck/core`. Agora a UI importa `@arck/core` e a estrutura interna é invisível e livre para evoluir.

---

## PARTE 4 — TABELA-MESTRE DE REGRAS (RL-01 a RL-39)

As regras RL-01 a RL-36 estão consolidadas no Manual v1.0. A v2.0 acrescenta três, nascidas do campo:

| RL | Regra | Origem |
|----|-------|--------|
| RL-37 | **Verificar antes de apagar.** Nenhum código é removido sem antes confirmar (por busca de imports/referências) que nada o usa. A ordem é: mapear referências → confirmar órfão → só então apagar. | Erro real no ARCK |
| RL-38 | **Robustez prova-se induzindo falha.** Além dos testes de caminho feliz, todo módulo crítico tem testes de fronteira: entradas vazias, dados duplicados/inconsistentes, contaminação parcial, limites. O teste que só confirma sucesso não prova robustez. | Erro real no ARCK |
| RL-39 | **Estados com mesmo valor, semântica diferente, têm nomes diferentes.** Se dois estados do sistema mostram o mesmo número mas significam coisas opostas, devem ser nomeados distintamente no código (enum/tipo), não apenas medidos. | Erro real no ARCK (inércia vs. erro) |

---

## PARTE 5 — A PONTE ENTRE CAMADAS (ADAPTADORES)

Lição nova: a fronteira onde os dados da UI viram dados do domínio é um ponto de falha silencioso.

> **RL-PONTE-01:** Os adaptadores que traduzem dados de uma camada para outra (ex: `{id, layer}` da UI → `{id, camada}` do domínio) são código crítico e têm teste próprio. Tradução errada = lixo entra no coração sem alarme.

**Estado no ARCK:** os adaptadores `toNo`, `toLigacoes`, `toModo` existem no hook e funcionam — mas ainda **não têm teste**. Pendência registada. A ponte sem teste é o elo mais fraco identificado na auditoria.

---

## PARTE 6 — CHECKLIST DE VALIDAÇÃO DO ESQUELETO (EV-01 a EV-26)

Os 24 da v1.0 + 2 novos do campo:

**Provados no ARCK (✅):**
- EV-01 — Deleto L4, o domínio L3 ainda compila? ✅
- EV-02 — Testo regra de negócio sem banco/UI? ✅ (39 testes em milissegundos)
- EV-03 — Módulos comunicam só por contrato? ✅ (`IArck`, `IEngy`)
- EV-04 — Um único Composition Root? ✅ (`servico.ts`)
- EV-18 — A CI reprova se o domínio importar a UI? ⬜ (Movimento 6, pendente)

**Novos da v2.0:**
- [ ] EV-25 — Existe teste de fronteira (vazio, duplicado, limite) para cada módulo crítico? *(RL-38)*
- [ ] EV-26 — Cada estado de valor ambíguo tem nome próprio no código? *(RL-39)*

---

## PARTE 7 — LIÇÕES DO CAMPO (O DIÁRIO DA OBRA)

Esta secção é nova e é o coração da v2.0. São os erros reais cometidos ao aplicar o Manual, e o que cada um ensinou. Guardar isto vale mais que mil regras abstratas.

### Lição 1 — A fonte única não existe enquanto a cópia velha respira
Construímos o coração limpo (`packages/core`) e ele passou 39 testes. Mas o `App.jsx` de 1270 linhas **ainda tinha a sua própria cópia da lógica**. Enquanto essa cópia existe, há duas verdades. A fundação só está completa quando a última cópia morre (Movimento 5). **Construir o novo é metade do trabalho; matar o velho é a outra metade — e a mais difícil.**

### Lição 2 — O devaneio de uma IA vira bug real noutra
A Aura "sonhou" uma regra de "compensação por simetria que mantém 100% no erro". Esse devaneio vazou para o código (`useArckCore.js`) e virou um bug: o modo Livre mantinha 100% quando devia ir a 0. Só foi apanhado porque **o arquiteto testou na prática.** Lição: separar sempre *mecânica computável* de *metáfora poética*. Nunca implementar metáfora como regra.

### Lição 3 — `.every()` num array vazio retorna `true`
Detalhe técnico que enganou o sistema: "todas as ligações são válidas" é trivialmente verdadeiro quando não há ligações. Um diagrama vazio dava 100%. Isto não é bug da linguagem — é uma armadilha previsível que só os testes de fronteira revelam. **Todo predicado sobre coleções tem de ser testado com a coleção vazia.**

### Lição 4 — Estados gémeos precisam de nomes
"Vazio" e "erro" mostravam ambos zero. Mas vazio é **inércia** (o sistema ainda não começou) e erro é **falha** (o sistema começou errado). Mesmo número, significado oposto. O Mentor deve dizer coisas diferentes em cada um. A solução não foi mudar o número — foi *nomear o estado*.

### Lição 5 — Limpar é arriscado; limpar com método é seguro
Apagar pastas mortas tornou o projeto profissional e auditável. Mas apagar antes de verificar referências quase introduziu um defeito. A limpeza é necessária — o lixo (`*mkdir`, ficheiros de 0 bytes, código órfão) faz o projeto parecer amador. Mas limpa-se com a ordem certa: mapear → confirmar órfão → apagar.

### Lição 6 — Distinguir o órgão vivo do resto morto
Na limpeza do ARCK, um motor de "lições do Mentor" foi apagado como se fosse código morto. Mas o Mentor é **funcionalidade viva** — é quem impede o erro no modo guiado e ensina "não existe meio-certo". A lógica foi removida e terá de renascer no core, limpa, como terceiro pilar (ao lado do validador e do medidor). Lição: antes de apagar, perguntar não só "isto é referenciado?" mas "isto é um conceito vivo do produto?". Código órfão de uma funcionalidade viva deve ser **reconstruído**, não esquecido.

### Lição 7 — O terceiro estado: nem certo, nem errado — inércia
O diagrama vazio mostrava 100% (o bug do `.every()`). A correção não foi mudar o número para 0 — porque 0 significa "erro", e o vazio não é erro. O vazio é **inércia**: o sistema ainda não começou, está em repouso antes da ignição. É um terceiro estado, com nome próprio, mesmo que partilhe o valor numérico do erro. Generalização (RL-39): um sistema maduro distingue "ainda não começou" de "começou errado", mesmo que ambos mostrem zero. O significado vive no nome do estado, não no número.

---

## PARTE 8 — RELAÇÃO COM O CHECKLIST E PRÓXIMO PASSO

Este Manual ("como conectar") e o Checklist de 107 itens ("o que verificar") são as duas metades. Juntos, com os prompts de inicialização (documento irmão) e a skill do Engenheiro Cético, formam a **fundação reutilizável** — a planta que cada novo projeto herda em vez de reconstruir.

**Estado da prova:** o Manual sobreviveu ao primeiro contacto com código real. Movimentos 0-4 do ARCK concluídos e testados. Faltam Movimento 5 (matar a última cópia no `App.jsx`) e Movimento 6 (a CI que protege). A planta virou concreto e o concreto aguentou. Os 10-15% que faltam são a cirurgia final no monólito — a parte mais difícil, onde a maioria desiste.

> *v2.0 — Validada não por aprovação, mas por sobrevivência ao código real.*
