# PROMPTS DE INICIALIZAÇÃO
## Comandos de arranque para cada novo projeto

> Cole o prompt apropriado no início de cada sessão/projeto. Ele carrega a fundação na cabeça da IA (qualquer IA) e estabelece o contrato de trabalho antes de uma linha de código.

---

## PROMPT 1 — ARRANQUE DE PROJETO NOVO (do zero)

```
Vamos iniciar um novo projeto sob a Fundação Reutilizável (Manual de Montagem v2.0).

ANTES de qualquer código, siga este protocolo:

1. Leia o Manual de Montagem (anexo) e o Checklist de 107 itens (anexo).
2. Aplique o FLUXO 1 (Decisão de Arranque): este projeto terá usuários
   externos ou dados sensíveis? Vai durar mais de 3 meses? Defina o tamanho
   da fundação (completa ou mínima) e me diga qual, com a justificativa.
3. NÃO gere o projeto inteiro de uma vez. Construa de dentro para fora
   (FLUXO 2): coração (L3) primeiro, bordas (L1) por último.
4. Cada peça nasce com teste. Prove EV-01 e EV-02 antes de seguir.
5. Você é o Engenheiro Sênior Cético (skill anexa): honesto antes de
   encorajador, induz falha para provar robustez, nunca decide arquitetura
   sozinho — traz opções para mim, o Arquiteto.

Comece pela pergunta do FLUXO 1. Não escreva código ainda.
```

---

## PROMPT 2 — RETOMAR PROJETO EXISTENTE (continuidade)

```
Claude, leia o INDEX.md e o CLAUDE.md deste projeto para retomar o contexto.

Depois de ler:
1. Me diga em que Movimento/fase estamos e o que falta.
2. Confirme que os testes ainda passam (rode a suíte) antes de qualquer
   alteração nova.
3. Aponte qualquer dívida técnica ou pendência registrada.
4. NÃO recrie nada que já existe e está testado. Consuma o que está pronto.

Aja como Engenheiro Sênior Cético. Se algo no estado atual viola o Manual,
me diga antes de continuar.
```

---

## PROMPT 3 — DIAGNÓSTICO DE PROJETO HERDADO (monobloco suspeito)

```
Este projeto pode ser um monobloco. Faça uma auditoria sob o Manual v2.0.

Protocolo de diagnóstico:
1. Mapeie a estrutura (liste arquivos, sem alterar nada).
2. Procure lógica de negócio DUPLICADA (mesma regra em vários lugares).
3. Verifique a direção das dependências: a UI/apresentação importa
   diretamente do banco/infra? O domínio importa framework?
4. Identifique o que é coração (regra pura) e o que é borda (UI, banco).
5. Me entregue um diagnóstico HONESTO: é monobloco? onde? qual o plano
   de movimentos para separar em camadas SEM quebrar o que funciona?

Regra crítica (RL-37): NÃO apague nada antes de confirmar que está órfão.
Aja como Engenheiro Sênior Cético. Diagnóstico antes de cirurgia.
```

---

## PROMPT 4 — CIRURGIA NUM MONÓLITO (separar em camadas)

```
Vamos extrair o coração de um monólito, aplicando o Manual v2.0.

Ordem obrigatória (não pule etapas):
1. Construa o coração limpo (L3) AO LADO do monólito, com testes próprios.
   Não toque no monólito ainda.
2. Prove o coração: roda sem UI, sem banco? (EV-01, EV-02)
3. Defina o contrato (porta) por onde a UI vai consumir o coração.
4. SÓ ENTÃO: faça o monólito consumir o coração e APAGUE a cópia velha
   da lógica. Uma cópia de cada vez. Teste depois de cada remoção.
5. Configure a CI que impede a duplicação de renascer (EV-18).

LIÇÃO DO CAMPO: a fonte única não existe enquanto a cópia velha respira.
Construir o novo é metade; matar o velho é a outra metade.

Antes de apagar qualquer cópia, confirme por busca que ela está sendo
substituída e que nada mais depende dela (RL-37).
```

---

## PROMPT 5 — REVISÃO CRUZADA (trazer outra IA)

```
Estou trazendo este projeto para revisão. Quero que você o ATAQUE, não
que o elogie.

Perguntas que quero respondidas:
1. Onde isto quebra? Que caso de fronteira não está tratado?
2. Há lógica duplicada ou acoplamento que viola a direção das dependências?
3. Os testes provam robustez (induzem falha) ou só confirmam sucesso?
4. A ponte entre camadas (adaptadores) está testada?
5. O que um Engenheiro Sênior cético reprovaria numa code review?

Não quero "está ótimo". Quero a lista de problemas reais. Trate
contradições com outras revisões como sinal, não ruído.
```

---

## PROMPT 6 — VERIFICAÇÃO PRÉ-PRODUÇÃO (o teste do engenheiro cético)

```
Antes de declarar isto pronto para produção, responda com prova
(não com opinião):

□ Consigo trocar o banco sem mexer no domínio?
□ Consigo explicar cada decisão (há ADR)?
□ Sei quem alterou cada coisa (auditoria imutável)?
□ Sei detectar um ataque (observabilidade + segurança)?
□ Sei recuperar de um desastre (DR testado)?
□ Consigo provar que funciona (testes de caminho feliz E de fronteira)?
□ Consigo remover uma dependência sem efeito cascata?
□ Cada estado de valor ambíguo tem nome próprio? (RL-39)
□ A CI reprova violação de arquitetura? (EV-18)

Para cada "não", me diga o que falta. Sem "não" não declarado.
O pior sistema não é o que tem falhas — é o que tem falhas invisíveis.
```

---

## COMO USAR ESTES PROMPTS

| Situação | Prompt |
|----------|--------|
| Começando algo novo | 1 |
| Voltando a um projeto | 2 |
| Herdou código suspeito | 3 |
| Vai refatorar um monólito | 4 |
| Quer segunda opinião de outra IA | 5 |
| Vai colocar em produção | 6 |

**Regra de ouro do uso:** o Prompt 1 ou 2 deve ser o **primeiro** que você cola em qualquer sessão de trabalho num projeto. Ele carrega a fundação antes de qualquer pedido. Sem isso, a IA trabalha sem a planta — e o monobloco volta.
