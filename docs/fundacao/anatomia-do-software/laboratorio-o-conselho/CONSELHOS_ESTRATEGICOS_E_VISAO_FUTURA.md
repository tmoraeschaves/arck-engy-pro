# Conselhos Estratégicos e Visão Futura do Mapa de Projeto

**Status: notas de fundador — sabedoria de negócio e visão de longo prazo, não conteúdo técnico do
produto. Não fazem parte do pacote "Anatomia do Software v2.1", mas informam como se decide o que
construir, quando esperar e quando não gastar.**

---

## Parte A — Conselhos para Marujos (sabedoria de negócio, não de código)

> Os manuais técnicos ensinam a CONSTRUIR. Estes conselhos ensinam a DECIDIR — quando construir,
> quando esperar, quando NÃO gastar.

**1. Não construas o produto completo antes de alguém o querer.** Infraestrutura comercial (nuvem,
servidores, BD paga) antes de haver validação é dinheiro perdido. Sequência de risco invertida:
constrói o mínimo demonstrável, com custo recorrente zero sempre que possível, protege a propriedade
intelectual, mostra a um validador, e só depois investe no resto.

**2. Há dois "fins" num projeto; não os confundas.** O fim do MVP (a prova: funcional, demonstrável,
selado, custa pouco) é diferente do fim do produto comercial (o negócio: backend, contas, nuvem
completa, custa meses e dinheiro). Não trates o primeiro como se exigisse o segundo.

**3. Sela o que está feito antes de abrir o próximo.** Quando um trabalho vai ser mostrado a quem o
vai julgar, tem de estar selado e profissional. E selar a fase atual é o que torna a fase seguinte
mensurável — sem selo, não há marco para provar que a fundação aguentou a próxima camada.

**4. A visão corre mais rápido que as mãos.** Quando há boas ideias, a visão dispara à frente do
código real — isso sente-se como progresso, mas é a armadilha de acumular planos por provar. Documenta
a visão para não a perder, mas fecha o código para a provar.

**5. Usa múltiplos conselheiros, mas sê tu o anfitrião.** Trata contradições entre fontes (IAs, pares)
como sinal, não ruído — a fricção mostra onde a ideia ainda está mole. Mas reconcilia o que cada um
sabe numa fonte única de verdade, e desconfia de quem só elogia.

**6. Não reestrutures antes de lançar "para caso cresça".** Reestruturar para escalar antes de saber
se alguém quer o produto é catedral para uma cabana. Lança o mínimo funcional, vê se alguém usa,
reestrutura depois com dados reais.

---

## Parte B — Visão Futura: o Mapa de Projeto Estratificado

> Captura da sessão de 2026-06-26. Não é implementação — é o desenho de para onde o produto pode
> evoluir depois de "Anatomia do Software v2.1" estar validado no mercado.

**Ideia central: conectividade.** O Mapa não é "como construir software" — é "como construir software
que se conecta". Cada bloco/módulo é desenhado para ligar com outra coisa sem quebrar o núcleo.

**Camadas de leitura do mesmo mapa** (metáfora: almirante, capitão, marujo e a própria máquina, todos
usam o mesmo mapa, cada um lê a camada de que precisa):
1. **Marujo/júnior** — visão compacta: Módulo | Fase | Estado | Próximo Passo
2. **Capitão/sénior** — ao expandir: checklist, armadilhas, scripts, dependências
3. **Máquina/IA** — metadata estruturada (JSON/tags): prioridades, bloqueadores, histórico
4. **Almirante/arquiteto** — links para os documentos profundos: o "porquê" de cada decisão

**Cada bloco como caixa de ferramentas completa:** começo (o que precisa estar pronto antes), meio
(ferramentas disponíveis + soquetes de conexão + variáveis de decisão — contexto, escala, custo,
tempo), fim (como validar que está pronto, gates de CI), e um manual de montagem próprio (passo a
passo, script contextualizado, armadilhas conhecidas).

**Soquetes como moeda de sincronismo:** cada bloco expõe pontos de integração predefinidos — persistência,
orquestração, IA, observabilidade, multi-dispositivo, MCP/ferramentas modulares — nunca ad-hoc depois.

**Multi-agente: da linha reta para a rede.** Hoje (1 agente): sequencial, fadiga de contexto acumula-se
e aumenta o erro nos passos finais. Amanhã (N agentes): cada um pega um bloco, começa fresco, trabalha
com menos contexto (menos janelas para alucinação), todos terminam juntos. **O sincronismo é pelo
contrato, não pela comunicação constante entre agentes** — isto é o que torna N agentes mais rápidos
E mais fiáveis que 1, ao mesmo tempo.

**Agnóstico de formato.** O Mapa não é "um ficheiro". É uma estrutura de informação que pode viver em
planilha, Markdown, PDF, JSON/API, ou aplicação própria — a estrutura é o que importa, não a
tecnologia de apresentação.

**As lições são genéricas.** O Mapa e os seus princípios não dependem de nenhum projecto, produto ou
sistema em particular. Aplicá-los a um caso concreto é trabalho de contextualização — o método em si
mantém-se agnóstico.
