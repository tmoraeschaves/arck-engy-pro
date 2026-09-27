# Registo de Decisões — ARCK & ENGY Pro

> Registo das decisões de arquitectura e de direcção deste projecto.
> **O Arquitecto decide; o Engenheiro constrói segundo a planta.**
> Quando a recomendação do Engenheiro (Claude, par de programação) diverge da
> decisão do Arquitecto (Tiago Moraes Chaves), ambas ficam registadas — a
> decisão final e o argumento que a sustenta são do Arquitecto.
>
> A prova de autoria e de data está no histórico de git: cada commit é autorado
> e datado. Este ficheiro é o "porquê" por trás desse histórico.

---

## DEC-001 — Abrir o ARCK como ferramenta gratuita e peça de portefólio
**Data:** 2026-08-31 · **Decisão de:** Tiago Moraes Chaves

O ARCK deixa de ser experiência privada. Passa a ferramenta aberta e gratuita,
usada para ganhar credibilidade em arquitectura de sistemas — "um projecto que
abre portas e mostra do que se é capaz".

**Consequência:** o vector de trabalho passa a ser consolidar → renomear →
quebrar o monólito (Movimento 7) → envelopar (README/LICENSE/demo) → só depois
features novas.

---

## DEC-002 — Integrar a "Anatomia do Software" aberta dentro do ARCK
**Data:** 2026-08-31 · **Decisão de:** Tiago Moraes Chaves

O sistema de navegação M0–M5 (antes pensado como produto pago) passa a viver
aberto em `docs/fundacao/` e a informar o próprio código.

**Recomendação do Engenheiro:** *não* incluir. Havia contradição — publicar de
graça, sob licença aberta, o método que se pensava vender; e é irreversível
depois de num repositório público.

**Decisão do Arquitecto:** incluir e abrir. Argumento: o produto pago não estava
a vender mesmo com o preço já reduzido, e poucos notariam a duplicação; o valor
agora está em ter um projecto forte que abra portas, não em proteger um produto
que não descolou. Decisão consciente, tomada depois de a contradição ser
apresentada.

---

## DEC-003 — "O Conselho" permanece no repositório
**Data:** 2026-09 · **Decisão de:** Tiago Moraes Chaves

O laboratório "O Conselho" (protocolo de 12 passos + conselhos de fundador +
visão futura do Mapa de Projeto) fica em `docs/fundacao/anatomia-do-software/laboratorio-o-conselho/`.

**Recomendação do Engenheiro:** retirar — é material menos maduro e mistura
sabedoria de negócio com o produto técnico.

**Decisão do Arquitecto:** permanece, é parte do corpo de trabalho e da
transparência do projecto. Condição: o repositório **não cita projectos
paralelos** — nenhum outro projecto, produto, empresa ou sistema proprietário do
Arquitecto é nomeado ou descrito neste repositório. As lições são genéricas; o
que as gerou fica fora.

---

## DEC-004 — Estado do editor via `useReducer` (não hooks por domínio)
**Data:** 2026-08-31 · **Decisão de:** Tiago Moraes Chaves (escolha entre opções A/B/C do Engenheiro)

O `App.jsx` não decompunha em hooks independentes porque carregar/repor/guardar
são operações sobre todo o documento. O Engenheiro apresentou três caminhos:
A) um hook `useProjeto` grande; B) `useReducer` + acções nomeadas; C) hooks por
domínio + um orquestrador de IO.

**Decisão:** opção B. Um projecto que se quer mostrar como exemplo de
arquitectura limpa deve ter as transições de estado nomeadas e testadas uma a
uma, não dezenas de `useState` soltos.

**Resultado:** `hooks/projeto-reducer.js` — 21 acções, cada uma com teste.

---

## DEC-005 — Layout novo: adoptar só a linguagem visual, adiar o resto
**Data:** 2026-08-31 · **Decisão de:** Tiago Moraes Chaves (recomendação do Engenheiro aceite)

O mockup de referência (`docs/referencias/layout-alvo.md`) trazia três coisas que
não são cosméticas: portas nomeadas nos nós, painel de propriedades por nó, e
subsistemas como entidade real (aninhamento). Todas mudam o modelo de domínio.

**Decisão:** adoptar agora só a linguagem visual (header com ar, canvas com
grelha, blocos maiores, linhas contínuas, containers de agrupamento puramente
visuais). Portas / propriedades / aninhamento ficam para v2, decididos de
propósito depois de o v1 estar de pé.

---

## DEC-006 — A vista 3D fica no v1 (não é cortada)
**Data:** 2026-09 · **Decisão de:** Tiago Moraes Chaves

**Recomendação do Engenheiro:** cortar o 3D do v1. Estava meio-funcional (a folha
2D ia edge-on e desaparecia); 3D a sério exige um motor (Three.js) e é um
projecto próprio.

**Decisão do Arquitecto:** o 3D fica. Argumento: *"cortar o 3D é como tirar um
dedo para não cortar a unha — não é frente nova, já lá está há muito tempo;
pusemos ferramentas lá de propósito para o 3D ser diferencial (as formas
wireframe, a imagem de molde). O problema é só que quando preciso da vista de
desenho técnico de outro ângulo, ela some."*

**Resultado:** o 3D foi corrigido para ser utilizável — rotação limitada a ±68°
para nunca ir edge-on, pivô no centro do desenho, `preserve-3d`, ícones com cor
explícita. Tecto assumido: continua uma folha inclinada, não um sólido
orbitável; 3D orbitável real = v2.

---

## DEC-007 — Nome do produto: adiado; "Tekton" rejeitado
**Data:** 2026-08-31 · **Decisão de:** Tiago Moraes Chaves

O Engenheiro recomendou "Tekton" (raiz grega de "arquitecto"). O Arquitecto pediu
verificação antes de fixar — e a verificação mostrou colisão directa: `tekton.dev`
é um projecto CI/CD conhecido da Continuous Delivery Foundation, além de uma
empresa de ferramentas manuais. Rejeitado.

**Decisão:** o nome não trava o projecto. Fica para uma sessão dedicada com
verificação de domínio e de marca (classe 42) feita *antes* de apresentar
candidatos. O ARCK/ENGY/MENTOR mantêm-se como nomes dos componentes internos.

### Ponto de situação do naming (2026-09-03)

Sessão de brainstorm gerou ~16 candidatos, verificados na web (sinal de colisão,
**não** limpeza legal de marca).

- **Nome de trabalho até haver bloco dedicado: "A&E / Architect & Engineer"** — o que já está na UI.
  Decisão do Arquitecto: não churnar; fixa-se um nome a sério de uma vez, noutro dia.
- **Rejeitados (colisão):** Tekton (CNCF), A&E/ACE/SAE (descritivo + A&E Networks + Ace editor +
  SAE International — nota: colide como marca, aceite só como nome de trabalho), 5L / Five Tier /
  Application Tier / Logical Architecture / ArchLog / ArchArt (descritivo ou "Arch-" colide com
  ArchUnit), Strata (Strata 3D + metodologia STRATA), Tessera (4+ dev tools), Darque ("dark" +
  Darque Tan), BrightPlan (empresa fintech EUA), Compasso (Compasso UOL, BR), Planta (PLANTA Project).
- **Sobreviventes / shortlist (direcção "o estúdio do arquitecto, não a obra"):**
  **Prancheta** (recomendação — a superfície onde o arquitecto projecta; PT; sem colisão em
  software; `prancheta.dev` provavelmente livre), Estirador, Croqui, Maquete, Nivex.
- Brief da sessão dedicada: `docs/POSICIONAMENTO.md` (as 4 perguntas).

---

## DEC-008 — Repositório não cita projectos paralelos
**Data:** 2026-09 · **Decisão de:** Tiago Moraes Chaves

Regra permanente: este repositório não nomeia nem descreve outros projectos,
produtos, empresas ou sistemas proprietários do Arquitecto. Caminhos de disco
locais, URLs de outros repositórios, e descrições de sistemas proprietários
(ex: um "sistema de segurança proprietário" específico) são genéricos ou
removidos. O método é genérico por definição; a sua origem privada não aparece.

---

## DEC-009 — Runner de testes: `vitest` na `ui-web`, `tsx` no `core`
**Data:** 2026-09 · **Decisão de:** Tiago Moraes Chaves

A intenção inicial da Fatia 1 do Movimento 7 era não introduzir framework de testes —
usar `node --test` nativo e manter o CI mínimo. Revertido na Fatia 4: testar o reducer é
possível com `tsx`, mas testar hooks e componentes React exige um ambiente DOM e um render
de teste.

**Decisão:** `packages/ui-web` passa a usar **vitest + jsdom + @testing-library/react**
(herda o alias `@arck/core` do `vite.config.js`). `packages/core` continua em `tsx` — a
fronteira é explícita. Os testes puros da UI migraram para `packages/ui-web/testes/*.test.mjs`;
os de componente ficam em `src/**/*.test.jsx`. O CI corre `npm run test:ui` dentro do job `test-core`.

---

## DEC-010 — O CI anti-recaída (M6) não é enforced enquanto o repo for privado
**Data:** 2026-09 · **Decisão de:** Tiago Moraes Chaves · **Situação, não escolha**

O Movimento 6 assumia que marcar os 3 jobs como *required status checks* no GitHub
tornava o CI um portão automático (merge bloqueado se vermelho). **Não torna, neste caso:**
a Branch Protection não é *enforced* em repositório privado no plano Free do GitHub — só
funciona em repos públicos ou em contas Team/Enterprise pagas. A regra está configurada
(3 checks, "require PR" desligado) mas aparece como **"Not enforced"**.

Consequência honesta: o PR #1 passou porque o CI estava verde, não porque *tinha* de estar.
A recaída (o domínio voltar a importar UI/infra) continua tecnicamente possível — o
`check-domain-isolation` avisa, mas não bloqueia.

**Decisão:** aceitar e registar. Não pagar o plano Team só para isto (opção rejeitada:
gastar dinheiro para trancar uma porta num projecto solo que vai a público na mesma). O
*enforcement* activa-se sozinho, de graça, quando o repositório for público — o que já é
o roadmap (DEC-001), bloqueado por `LICENSE` (0 bytes) e pelo nome (DEC-007). Até lá, o
M6 é: **CI feito e verde; portão por disciplina, não por mecanismo.**

A tabela de "Movimentos concluídos" no `INDEX.md` passa a dizer isto em vez de "M6 completo".

---

## DEC-011 — Todo o material público parte das quatro perguntas
**Data:** 2026-09 · **Decisão de:** Tiago Moraes Chaves

Todo o material voltado para fora — `README.md`, publicação de lançamento, landing page,
deck, descrição do repositório, texto de loja — parte das mesmas quatro perguntas, pela
mesma ordem, com as mesmas respostas: **O QUÊ · POR QUÊ · PARA QUÊ · PARA QUEM**. A mensagem
não se reinventa por material.

Fonte única: **`docs/POSICIONAMENTO.md`**. Também é o brief para a sessão de naming (DEC-007).

---

## DEC-012 — Licenciamento: rascunho escrito, por confirmar
**Data:** 2026-09-05 · **Situação:** rascunho do Engenheiro, aguarda confirmação do Arquitecto

`LICENSE` estava a 0 bytes — bloqueava o "abrir" (DEC-001/002) porque um repositório público
sem licença não pode ser legalmente usado por ninguém. Escrevi o que já estava proposto no
`INDEX.md` desde 2026-08-31 e nunca fora confirmado:

- **Código** (raiz + `packages/`): `LICENSE` — MIT. `package.json` actualizado (era `UNLICENSED`).
- **Método** (`docs/fundacao/`): `docs/fundacao/LICENSE` — CC BY 4.0, crédito a Tiago Moraes Chaves.

**Isto é um rascunho, não uma decisão fechada** — o repositório continua privado, nada disto
tem efeito legal até ao repo abrir. Precisa da confirmação explícita do Tiago antes de contar
como decidido (ao contrário das outras DECs, esta ainda não tem "Decisão de: Tiago").

---

## DEC-013 — Cada camada passa a poder conter os módulos/funções que lhe cabem (Movimento 8)
**Data:** 2026-09-05 · **Decisão de:** Tiago Moraes Chaves

O "embutir o que cabe dentro de cada camada" (antes adiado como v2 em `MOVIMENTO_7.md`)
passa a prioridade. Razão do Arquitecto: *"é muito importante para não ficarmos indo e
voltando"* — decidir o modelo de dados agora, enquanto ainda se está a reestruturar, evita
reescrever tudo depois.

**Formato (resposta do Arquitecto): híbrido.** Um nó guarda uma **lista** de módulos/funções
(texto simples: `label` + `kind` opcional + `nota` opcional). Qualquer item dessa lista pode,
quando for preciso, ser **promovido** a um mini-diagrama próprio (`filho`) — mas só quando
esse detalhe fizer falta, não por omissão.

**Navegação: duas vistas, à escolha do utilizador** (como os modos de vista de um explorador
de ficheiros) — o Arquitecto quer ambas disponíveis, não uma só:
1. **Painel lateral** — seleccionar um nó mostra a sua lista ao lado; o canvas não muda.
2. **Duplo-clique entra** — abre o conteúdo do nó no próprio canvas, com migalhas de pão
   para voltar.

**Rejeitado pelo Arquitecto:** *zoom infinito* para dentro do nó ("a opção mais arriscada,
o 3D já deu problemas") e **aninhamento profundo sem limite** ("camada dentro de camada
dentro de camada" — não agora). O Engenheiro implementa um **limite de profundidade** (3
níveis) no reducer.

**Consequência:** abre o **Movimento 8** (`docs/MOVIMENTO_8.md`), fatiado e testado como o 7.
Fatia 1 = modelo de dados + acções do reducer + testes, sem UI. As fatias de UI só avançam
depois de o Arquitecto validar o plano de fatiamento.

### Resolução da ambiguidade Guiado vs. Livre (2026-09-05)

Havia duas leituras do aninhamento: níveis fixos (a "Visão da integração ADS" do `INDEX.md`,
com vocabulário fechado) vs. o modelo genérico da Fatia 1. **Fechada pelo Arquitecto: é o
mesmo modelo de dados nos dois modos.** A Fatia 1 (`id`, `label`, `kind`, `nota`, `filho`)
suporta os dois **sem qualquer alteração no reducer**. A diferença é só a camada de cima:

- **Modo Guiado** — os módulos vêm pré-criados de um *template de arranque*, com `label` e
  `kind` fixos no vocabulário da fundação (M0–M5). O utilizador segue a planta, não inventa.
- **Modo Livre** — o utilizador cria o módulo genérico e escreve o seu próprio `label` e
  escolhe o seu próprio `kind` (etiqueta + ícone). A função por trás é a mesma; muda só o
  significado que ele lhe dá no contexto do projecto dele.

É um **template diferente por modo, não um modelo de dados por modo**. Confirma também que
a Fatia 1 foi construída certa — não há nada a refazer.

> ⚠️ A parte do *template M0–M5* foi **revertida pela DEC-014**. O resto (mesmo modelo
> de dados nos dois modos, Fatia 1 certa) mantém-se.

---

## DEC-014 — O M0–M5 não entra nas camadas; Fatia 2b cancelada
**Data:** 2026-09-06 · **Decisão de:** Tiago Moraes Chaves

A DEC-013 previa um *template de arranque* para o Modo Guiado que semeava a lista de
módulos de um nó com o vocabulário M0–M5 da fundação. Ao desenhar a Fatia 2b, o Arquitecto
reavaliou:

> *"Vendo desse ângulo, já não faz sentido — não é arquitectura, é engenharia. Deixamos
> de fora o M0 a M5: não faz parte das camadas, faz parte do processo posterior."*

**Decisão:**
1. **M0–M5 sai do Movimento 8.** São fases do processo (Mentalidade → Descobrir →
   Projetar → Construir → Proteger → Entregar), não módulos que vivam dentro de uma
   camada L1–L5. Semeá-los na lista de um nó era um erro de categoria.
2. **A Fatia 2b é cancelada.** Não há template de arranque. O painel de módulos da
   Fatia 2a serve o Modo Guiado e o Modo Livre exactamente igual.
3. **Guiado vs. Livre** continua a ser só o que a app já faz: o Guiado valida o fluxo
   L1→L2→L3→L4→L5; o Livre aceita qualquer ligação.
4. O M0–M5 como **auxílio opt-in para iniciantes em software** (uma checklist de fases
   ao nível do projecto, não do nó) fica parqueado para um movimento futuro, se e quando
   fizer falta.

**Consequência:** o Movimento 8 salta da Fatia 2a directamente para a Fatia 3
(`PROMOVER_MODULO` / sub-diagramas). Nenhum código a remover — o M0–M5 nunca chegou a
entrar na `ui-web`, só vivia em `docs/fundacao/`.

---

## DEC-015 — Open-source e gratuito, definitivo: a ferramenta é a prova da arquitectura
**Data:** 2026-09-10 · **Decisão de:** Tiago Moraes Chaves

Reafirma a DEC-001 e **fecha a questão de vez**. Entre 2026-09-08 e 2026-09-10 a posição
oscilou três vezes (aberta → vender/fechada → aberta) numa exploração com o Engenheiro sobre
se valia a pena monetizar. Fechada:

> *"Não vamos vender, vamos manter open source. Realmente é a prova da minha arquitectura
> de sistema."*

**Razão que sustenta:** se a ferramenta existe para provar que o Arquitecto sabe desenhar
arquitectura de sistemas (autodidacta, sem título), então **tem de ser vista** — código,
decisões, testes, tudo. Fechada, prova zero. O objectivo "abrir portas" (DEC-001) e o
objectivo "vender" puxam em direcções opostas; escolhido o primeiro como primário.

**O que isto fixa (para não voltar a abrir sozinho):**
- **`LICENSE` MIT (código) + CC BY 4.0 (`docs/fundacao/`) — confirmado.** Deixa de ser
  rascunho (fecha o pendente da DEC-012). Para uma peça de prova, MIT maximiza o que se
  quer: ser lida, usada, citada. *Não* trocar por "todos os direitos reservados".
- **O refactor do `App.jsx` volta a ser prioridade.** Estava adiado (DEC-005) enquanto se
  ponderava vender — aí era dívida técnica tolerável. Numa peça de prova de arquitectura
  limpa, um ficheiro de ~850 linhas com telemetria + toolbar + painel 3D + autosave lá
  dentro, e 2 erros de lint tolerados como *baseline*, é contradição com a tese. É a
  primeira coisa que um avaliador abre.
- **O nome deixa de ser bloqueador crítico (DEC-007).** Em open-source, o pior caso de não
  ter marca registada é ter de renomear — chato, não fatal. Pode lançar-se como
  `arck-engy-pro` e renomear depois. `ARCK` e `ENGY` ficam como os nomes dos **motores**
  (já é o que são: `arck-validador.ts`, `engy-tensao.ts`); o produto pode ganhar uma
  palavra por cima mais tarde, sem urgência e sem drama contratual.
- **INPI/EUIPO passam a dispensáveis de facto**, não por poupança.

**Recomendação do Engenheiro registada:** as imagens de marketing geradas (modelos com
capacete, edifício) servem LinkedIn, não o `README` de um repositório — quem chega a
open-source é convencido por um GIF da ferramenta a funcionar, o diagrama de camadas real,
os testes a passar e o `DECISOES.md`, não por fotografia de campanha. As marcas gráficas
(o "A", as barras do "E") aproveitam-se para favicon/ícone; as fotos não.

**Consequência imediata:** escrever o `README.md` (não existe) a partir do
`docs/POSICIONAMENTO.md` (DEC-011), **depois** de a `mov7-fatia5` estar merjada em `main` —
o README apresenta o repo como prova ("funciona, testes passam") e isso tem de ser verdade
em `main`, não numa branch com 20 commits por integrar.

---

## DEC-016 — Linha de chegada: "finalizado" = lançamento público
**Data:** 2026-09-26 · **Decisão de:** Tiago Moraes Chaves

O Arquitecto pediu para "finalizar o ARCK". Havia três frentes abertas (refactor do
`App.jsx`, Movimento 8 fatias 3–5, layout novo) e nenhuma linha de chegada definida — o
risco era "finalizar" nunca acontecer. O Engenheiro propôs três leituras; escolhida:

> **Lançamento público** — refactor do `App.jsx`, lint a zero, `CLAUDE.md`/`INDEX.md`
> actualizados, repositório tornado público com o CI a valer como portão.

**Fica de fora, para depois do lançamento:** Movimento 8 fatias 3–5 (sub-diagramas),
layout novo (DEC-005), mobile/touch. Não bloqueiam a prova — o que está em `main`
funciona, está testado e está documentado.

**O que o fecho encontrou (e por isso vale a pena registar):** os "2 erros de lint de
baseline" tolerados desde o Movimento 7 não eram os `react-hooks/refs` que se julgava —
eram **erros de parsing** em `App.jsx` e `Forma.jsx` (um `)}` e um `}` a mais). O
esbuild tolerava-os, os testes passavam, mas o ESLint não conseguia ler os dois ficheiros
e por isso não os analisava de todo. Esconderam: (1) o `)}` **visível** no cabeçalho da
app (e na captura do README); (2) a **rotação 3D por arrasto partida** — `handleMouseMove`
ficava com `draggingRot=null` numa closure obsoleta. Os três corrigidos com teste de
regressão primeiro. **Causa raiz:** o CI não corria lint. Passou a correr (job 1).

**Lição (para a fundação):** um erro "tolerado como baseline" tem de ser lido, não
contado. Um erro de parsing não é um aviso — é um ficheiro inteiro fora da rede.

---

## DEC-017 — O ENGY mede sempre, também no Modo Guiado
**Data:** 2026-09-27 · **Decisão de:** Tiago Moraes Chaves

Encontrado pelo Tiago a testar a v2.1.0: desenhou em Modo Livre uma ligação proibida
(ARMAZENAMENTO L4 → SERVIÇO L3), o Livre deu 0% (correcto), passou a Guiado e o medidor
mostrou **99.8%** — com o rodapé a dizer "ALERTA, 1 conflito" ao mesmo tempo.

Causa: `medirTensao` devolvia 99.8% em Guiado **sem olhar para as ligações**, assumindo que a
UI tinha impedido o erro. Essa premissa cai em três portas de entrada: mudar de Livre para
Guiado, importar um JSON, carregar um modelo.

> *"O Guiado devia ter baixado, pois se fizer no Livre e passar a Guiado ele tem que
> continuar a perceber o erro."*

**Regra nova dos estados:**

| Estado | Valor | Quando |
|---|---|---|
| INÉRCIA | -1 | Sem ligações (qualquer modo) |
| GUIADO | 99.8% | Modo Guiado, todas as ligações válidas |
| LIVRE_CORRETO | 100% | Modo Livre, todas as ligações válidas |
| ERRO | 0% | **Qualquer modo**, qualquer ligação inválida |

O Modo Livre não muda — continua livre e avisa com 0%. A mensagem de ERRO do Mentor já não
dependia do modo, por isso serve igual. Testes: +2 no coração (directo e pelo contrato).

**Princípio:** o medidor mede — nunca confia que outra camada (a UI) já impediu o erro.

---

## DEC-018 — Contentores desenhados à mão; sectores num dropdown
**Data:** 2026-09-27 · **Decisão de:** Tiago Moraes Chaves

Fecha as duas decisões pendentes do `layout-alvo.md` (itens 1 e 5).

**1. Agrupamento = desenhar a caixa à mão.** Ferramenta "Contentor" na barra lateral: arrasta-se
uma caixa translúcida (ou clica-se, e nasce com tamanho padrão), com rótulo, cor (6) e contorno
contínuo ou tracejado. Alternativa rejeitada por agora: seleccionar nós → Agrupar (exige
selecção múltipla, que não existe, e aninhar fica difícil).

Caso de teste que decidiu: o Tiago está a fazer a formação AWS (Cloud Practitioner) e os
diagramas de rede são todos contentores dentro de contentores — **Região ⊃ VPC ⊃ Zona de
Disponibilidade ⊃ Sub-rede ⊃ Grupo de segurança ⊃ EC2**. A cor e o contorno distinguem o
tipo de fronteira (VPC contínua a verde, AZ tracejada a azul, grupo de segurança a vermelho),
e há fronteiras que só se *cruzam* (a AZ atravessa a VPC sem ser filha dela). O ARCK tem de
conseguir desenhar a VPC-padrão da AWS — verificado em browser real.

Regras (fiéis à DEC-005, só visual):
- **Nada pertence a um contentor no modelo.** `containers[]` no documento não referencia nós.
- **Arrastar leva o que está dentro _agora_**, calculado pela geometria no início do arrasto
  (`lib/contentores.js`): nós e notas pelo ponto, formas e outros contentores só se couberem
  inteiros. Tirar um nó do grupo é arrastá-lo para fora. Trancados ficam onde estão.
- **Só a aba do rótulo e a borda agarram o rato** — o interior deixa passar os cliques
  (colocar nós e notas dentro da VPC, pan, desseleccionar).
- Apagar a caixa não apaga o conteúdo. Trava igual à das formas.
- Desenho por área decrescente: o filho fica sempre por cima da mãe.

**2. Faixa dos 12 sectores → sector activo + dropdown.** Não cabia em ecrãs de 1422 e 1600 px
(a "Mecatrónica" saía cortada). O cabeçalho mostra só o sector actual; um clique abre os 12 em
grelha. Cabe em qualquer ecrã e deixa crescer a lista.

