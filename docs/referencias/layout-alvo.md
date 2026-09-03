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

## Onde aplicar no código (depois do M7)

- `componentes/Cabecalho.jsx` — o header
- `componentes/Canvas.jsx` — grelha, fundo, agrupamento visual
- `componentes/No.jsx` — bloco + rótulo
- `componentes/Ligacao.jsx` — linha + seta
- Tokens de cor/espaçamento — `tailwind.config.js` / `config/` (a criar)
