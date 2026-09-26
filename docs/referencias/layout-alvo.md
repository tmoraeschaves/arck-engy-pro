# Layout alvo — direcção visual (2026-08-31)

Referência recolhida pelo Tiago. **Só a linguagem visual é para adoptar agora** — as portas
rotuladas, o painel de propriedades e o aninhamento real de subsistemas ficam para v2
(ver `docs/MOVIMENTO_7.md` e a nota da visão explodida em `docs/INDEX.md`).

## Decisão (2026-08-31)

Adoptar: header escuro com ar, canvas claro com grelha subtil, blocos maiores com tipografia
em caixa alta por baixo do ícone, linhas de ligação contínuas com setas, paleta calibrada,
**containers de agrupamento puramente visuais** (rectângulo à volta de um conjunto de nós,
sem que o nó "pertença" a nada no modelo).

Adiar (mudam o domínio, não o aspecto):
- Portas nomeadas nos nós (A/B/S/0) — as ligações passariam a agarrar-se a portas
- Painel de propriedades por nó (Name, Módulo, Port, Local, Profundidade…) — nós ganham metadados
- Subsistemas como entidade real (nó pertence a um grupo) — é o aninhamento da visão explodida

## Elementos visuais do mockup

- **Header** escuro, faixa fina, abas de sector com ícone
- **Canvas** cinza-claro, grelha de linhas ténues (padrão geométrico ao fundo)
- **Nós**: rectângulos arredondados, cores planas (vermelho/azul/verde/laranja), ícone branco
  centrado, rótulo em CAIXA ALTA por baixo
- **Ligações**: linha contínua fina, seta direccional, sem tracejado caótico
- **Agrupamento**: caixa translúcida cinza com rótulo no canto ("Subsistema 1")
- **Painel lateral** de propriedades (flutuante, canto inferior direito) — *adiado*
- Tipografia sans-serif moderna, espaçamento generoso

## Prompt usado (gerador de imagem), para iterar

> A high-resolution UI/UX design interface for a node-based visual programming software.
> Crisp vector style, clean dark header, light grey canvas background with subtle grid lines.
> Nodes are grouped inside light semi-transparent gray containers labeled 'Subsistema 1' and
> 'Subsistema 2'. Rounded rectangular node blocks in flat pastel colors (red, blue, green,
> orange) with white flat icons inside (processor, memory, output, monitor, wireless). Clean
> connecting lines with directional arrows and small labeled junction ports. Modern sans-serif
> typography, organized layout, professional software interface screenshot, high quality.

Ajustes-chave do conceito: agrupamento por subsistemas em caixas delimitadoras translúcidas;
linhas contínuas com portas rotuladas (adiado); contraste calibrado entre blocos e tipografia
em caixa alta; barra de topo escura com abas.

## Mobile/táctil — testado 2026-09-05, confirmado não funcional

Aberto no telemóvel via IP da rede local (`http://<IP-LAN>:5173`, `vite --host`). Dois problemas:

- **Layout não responsivo** — cabeçalho sobrepõe-se, texto corta. Desenhado só para ecrã de
  computador.
- **Arrastar não funciona** — todo o arrasto (mover nós/formas, cortar, pan) usa só eventos de
  rato (`onMouseDown`/`onMouseMove` no `Canvas.jsx`, `useAtalhos.js`). Ecrãs tácteis não disparam
  estes eventos da mesma forma; precisaria de `onTouchStart`/`onTouchMove`/`onTouchEnd` a fazer o
  mesmo trabalho em paralelo.

**Decisão do Tiago:** por agora o ARCK usa-se só no computador. Layout responsivo + suporte
táctil ficam para quando o redesign visual for a sério — não implementar isoladamente antes disso.

## Onde aplicar no código (depois do M7)

- `componentes/Cabecalho.jsx` — o header
- `componentes/Canvas.jsx` — grelha, fundo, agrupamento visual
- `componentes/No.jsx` — bloco + rótulo
- `componentes/Ligacao.jsx` — linha + seta
- Tokens de cor/espaçamento — `tailwind.config.js` / `config/` (a criar)

## Estado face ao alvo (2026-09-27, depois da v2.1.0)

Boa parte da linguagem visual já entrou nas rondas de smoke test:

- ✅ Header escuro com abas de sector com ícone
- ✅ Canvas claro com grelha (pontos, alinhada com o snap)
- ✅ Nós: blocos arredondados, cor plana, ícone branco, rótulo em CAIXA ALTA por baixo
- ✅ Ligações contínuas com seta (só o retorno L5→L2 é tracejado — de propósito)

Falta (é o que a DEC-005 manda fazer — só visual):

1. **Containers de agrupamento** — rectângulo translúcido com rótulo ("Subsistema 1"), sem o
   nó pertencer ao grupo no modelo. *Decisão pendente do Tiago:* como se cria (seleccionar nós
   → agrupar, ou desenhar a caixa à mão).
2. ✅ **Setas visíveis** (2026-09-27) — a linha ia de centro a centro e a seta ficava debaixo do
   nó de destino. Agora `lib/geometria.js` (`aparaNaBorda`) apara-a à borda dos nós, no canvas e
   na exportação SVG/PNG; seta um pouco maior. Resta: quando a ligação chega por baixo, a ponta
   encosta ao rótulo do nó.
3. **Grelha de linhas ténues** em vez de pontos — opcional, gosto.
4. **Tokens de cor/espaçamento** num só sítio — hoje há hex espalhados (`#0F172A`, `#1E293B`…).
5. **Faixa dos 12 sectores** — não cabe na maioria dos ecrãs (1422 e 1600 px incluídos). A barra
   de rolagem já está no tema (`.rolagem-fina`); falta decidir a forma (dropdown, só ícones,
   duas linhas).

Os itens 1, 2 e 5 são os que mais se notam para quem chega ao repo público.
