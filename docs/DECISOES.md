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
