/**
 * TESTES DE INTERACÇÃO NO CANVAS — a parte de maior risco da Fatia 5
 * (Movimento 7): arrastar, ligar, cortar, colocar formas. Simula sequências
 * reais de mousedown → mousemove → mouseup através do DOM, sem mocks do
 * Canvas.jsx nem do useAtalhos — prova que a extracção não partiu o fio.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";

async function arrancar() {
  const user = userEvent.setup();
  const utils = render(<App />);
  await user.click(screen.getByText(/USAR ENGENHARIA POR PADRÃO/i));
  return { user, ...utils };
}

function areaDeTrabalho(container) {
  // o <div> com onMouseMove que envolve a sidebar e o Canvas
  return container.querySelector(".flex.flex-1.overflow-hidden");
}

describe("Canvas — arrastar um nó", () => {
  beforeEach(() => localStorage.clear());

  it("mousedown no nó + mousemove + mouseup move o nó (dispatch MOVER_NO chega ao DOM)", async () => {
    const { user, container } = await arrancar();
    await user.click(screen.getByTitle("Adicionar SENSÓRIA"));

    const no = container.querySelector('[data-testid="no"]');
    const antes = no.getAttribute("transform");

    fireEvent.mouseDown(no, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(areaDeTrabalho(container), { clientX: 250, clientY: 180 });
    fireEvent.mouseUp(window);

    const depois = container.querySelector('[data-testid="no"]').getAttribute("transform");
    expect(depois).not.toBe(antes);
    // moveu-se para a direita e para baixo, como o arrasto pediu
    expect(depois).toBe("translate(230,160)");
  });
});

describe("Canvas — travar um nó (por selecção)", () => {
  beforeEach(() => localStorage.clear());

  const cadeadoDo = no => no.querySelector('[data-testid="trava-no"]');

  it("seleccionar um nó, trancá-lo pelo cadeado, e botão direito + Delete já não o apagam", async () => {
    const { user, container } = await arrancar();
    await user.click(screen.getByTitle("Adicionar SENSÓRIA"));
    expect(container.querySelectorAll('[data-testid="no"]')).toHaveLength(1);

    // selecciona o nó → aparece o cadeado
    await user.click(container.querySelector('[data-testid="no"]'));
    let no = container.querySelector('[data-testid="no"]');
    expect(cadeadoDo(no)).toBeTruthy();

    // tranca
    fireEvent.click(cadeadoDo(no));
    no = container.querySelector('[data-testid="no"]');
    expect(cadeadoDo(no).querySelector("title").textContent).toMatch(/Destrancar/);

    // botão direito não apaga
    fireEvent.contextMenu(no);
    expect(container.querySelectorAll('[data-testid="no"]')).toHaveLength(1);

    // Delete não apaga (o nó continua seleccionado; o reducer recusa REMOVER_NO)
    fireEvent.keyDown(window, { key: "Delete" });
    expect(container.querySelectorAll('[data-testid="no"]')).toHaveLength(1);
  });
});

describe("Canvas — ligar nós", () => {
  beforeEach(() => localStorage.clear());

  it("L1 → L2 (válida) desenha uma linha verde", async () => {
    const { user, container } = await arrancar();
    await user.click(screen.getByTitle("Adicionar SENSÓRIA")); // L1
    await user.click(screen.getByTitle("Adicionar LÓGICA"));   // L2

    const [n1, n2] = container.querySelectorAll('[data-testid="no"]');
    await user.click(n1);
    await user.click(n2);

    const linha = container.querySelector("svg line[marker-end='url(#arr-ok)']");
    expect(linha).toBeInTheDocument();
    expect(linha).toHaveAttribute("stroke", "#10B981");
  });

  it("L1 → L3 (inválida, modo guiado) não liga e avisa", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    const { user, container } = await arrancar();
    await user.click(screen.getByTitle("Adicionar SENSÓRIA")); // L1
    await user.click(screen.getByTitle("Adicionar POTÊNCIA"));  // L3

    const [n1, n3] = container.querySelectorAll('[data-testid="no"]');
    await user.click(n1);
    await user.click(n3);

    expect(alertMock).toHaveBeenCalled();
    // só as ligações do diagrama têm marker-end (as linhas dos ícones lucide não têm)
    expect(container.querySelector("svg line[marker-end]")).not.toBeInTheDocument();
    alertMock.mockRestore();
  });
});

describe("Canvas — modo de corte pelo teclado", () => {
  beforeEach(() => localStorage.clear());

  it("a tecla C activa o modo de corte (aparece a dica)", async () => {
    await arrancar();
    fireEvent.keyDown(window, { key: "c" });
    expect(screen.getByText(/MODO CORTE/)).toBeInTheDocument();
  });

  it("Escape sai do modo de corte", async () => {
    await arrancar();
    fireEvent.keyDown(window, { key: "c" });
    expect(screen.getByText(/MODO CORTE/)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText(/MODO CORTE/)).not.toBeInTheDocument();
  });
});

describe("Canvas — formas geométricas", () => {
  beforeEach(() => localStorage.clear());

  it("colocar um cubo e arrastá-lo move as alças de redimensionar", async () => {
    const { user, container } = await arrancar();
    await user.click(screen.getByTitle("Formas Geométricas"));
    await user.click(screen.getByTitle("Cubo"));

    const main = container.querySelector("main");
    fireEvent.mouseDown(main, { button: 0, clientX: 200, clientY: 200 });

    const forma = container.querySelector('[data-testid="forma"]');
    expect(forma).toBeInTheDocument();

    // seleccionar (o próprio colocar já selecciona implicitamente via placeShape;
    // garantimos a selecção explícita para expor as alças)
    fireEvent.mouseDown(forma, { clientX: 200, clientY: 200 });
    const corner1 = container.querySelectorAll("main rect")[0];
    const xAntes = corner1.getAttribute("x");

    fireEvent.mouseMove(areaDeTrabalho(container), { clientX: 260, clientY: 200 });
    fireEvent.mouseUp(window);

    const xDepois = container.querySelectorAll("main rect")[0].getAttribute("x");
    expect(xDepois).not.toBe(xAntes);
  });
});

describe("Canvas — anotações (notas)", () => {
  beforeEach(() => localStorage.clear());

  it("clicar em Nota e no canvas cria uma anotação já em edição", async () => {
    const { user, container } = await arrancar();
    await user.click(screen.getByTitle("Nota"));
    const main = container.querySelector("main");
    fireEvent.mouseDown(main, { button: 0, clientX: 200, clientY: 200 });

    expect(screen.getByPlaceholderText("escreve aqui…")).toBeInTheDocument();
  });

  it("escrever na nota não é engolido pelos atalhos globais de teclado (c, 0, Delete)", async () => {
    const { user, container } = await arrancar();
    await user.click(screen.getByTitle("Nota"));
    const main = container.querySelector("main");
    fireEvent.mouseDown(main, { button: 0, clientX: 200, clientY: 200 });

    const textarea = screen.getByPlaceholderText("escreve aqui…");
    await user.type(textarea, "corte 0-10%");

    expect(textarea).toHaveValue("corte 0-10%");
    expect(screen.queryByText(/MODO CORTE/)).not.toBeInTheDocument();
  });
});

describe("Canvas — painel de módulos (Movimento 8)", () => {
  beforeEach(() => localStorage.clear());

  it("duplo-clique num nó abre o painel; adicionar módulo mostra o contador no nó", async () => {
    const { user, container } = await arrancar();
    await user.click(screen.getByTitle("Adicionar LÓGICA"));

    await user.dblClick(container.querySelector('[data-testid="no"]'));

    const painel = document.getElementById("painel-modulos");
    expect(painel).toBeInTheDocument();
    expect(within(painel).getByText(/O que é que vive dentro desta camada/)).toBeInTheDocument();

    await user.click(within(painel).getByText("Adicionar módulo"));
    expect(within(painel).getByLabelText("Nome do módulo")).toHaveValue("Novo módulo");

    // o nó passa a mostrar o contador "1"
    const no = container.querySelector('[data-testid="no"]');
    expect(within(no).getByText("1")).toBeInTheDocument();
  });

  it("fechar o painel esconde-o", async () => {
    const { user, container } = await arrancar();
    await user.click(screen.getByTitle("Adicionar LÓGICA"));
    await user.dblClick(container.querySelector('[data-testid="no"]'));

    const painel = document.getElementById("painel-modulos");
    const fechar = within(painel).getAllByRole("button").find(b => b.querySelector(".lucide-x"));
    await user.click(fechar);

    expect(document.getElementById("painel-modulos")).not.toBeInTheDocument();
  });
});

describe("Canvas — imagem de fundo por arrastar ou colar", () => {
  beforeEach(() => localStorage.clear());

  function ficheiroImagem() {
    return new File(["conteudo"], "planta.png", { type: "image/png" });
  }

  it("arrastar uma imagem para o canvas define-a como fundo", async () => {
    await arrancar();
    const main = document.querySelector("main");

    fireEvent.dragOver(main);
    fireEvent.drop(main, { dataTransfer: { files: [ficheiroImagem()] } });

    const fundo = await screen.findByAltText("bg");
    expect(fundo).toHaveAttribute("src", expect.stringMatching(/^data:/));
  });

  it("colar uma imagem (Ctrl+V) define-a como fundo", async () => {
    await arrancar();
    const item = { type: "image/png", getAsFile: () => ficheiroImagem() };
    const evento = new Event("paste");
    evento.clipboardData = { items: [item] };
    fireEvent(window, evento);

    const fundo = await screen.findByAltText("bg");
    expect(fundo).toHaveAttribute("src", expect.stringMatching(/^data:/));
  });
});

describe("Canvas — rotação 3D com o botão direito", () => {
  beforeEach(() => localStorage.clear());

  it("em vista 3D, botão direito + arrastar roda o diagrama (o eixo Y muda)", async () => {
    const { user, container } = await arrancar();
    await user.click(screen.getByTitle("Adicionar SENSÓRIA"));
    await user.click(screen.getByTitle("Rotação 3D"));
    await user.click(screen.getByText(/INACTIVA/));        // liga a vista 3D (inclinação inicial Y = -25°)
    const eixoY = () => screen.getByText("Eixo Y — Rotação").nextElementSibling.textContent;
    expect(eixoY()).toBe("-25°");

    fireEvent.mouseDown(container.querySelector("main"), { button: 2, clientX: 100, clientY: 100 });
    fireEvent.mouseMove(areaDeTrabalho(container), { clientX: 150, clientY: 100 }); // +50px → +20°
    fireEvent.mouseUp(window);

    expect(eixoY()).toBe("-5°");
  });
});

describe("Canvas — contentores de agrupamento (DEC-018)", () => {
  beforeEach(() => localStorage.clear());

  const caixa = c => c.querySelector('[data-testid="contentor"] rect');
  const moverNoPara = (container, no, x, y) => {
    const t = /translate\(([-\d.]+),([-\d.]+)\)/.exec(no.getAttribute("transform"));
    fireEvent.mouseDown(no, { clientX: +t[1] + 20, clientY: +t[2] + 20 });
    fireEvent.mouseMove(areaDeTrabalho(container), { clientX: x, clientY: y });
    fireEvent.mouseUp(window);
  };

  it("desenhar a caixa, dar-lhe nome, arrastá-la leva o nó que está dentro e deixa o de fora", async () => {
    const { user, container } = await arrancar();

    // desenhar: ferramenta → arrastar no canvas → largar
    await user.click(screen.getByTitle(/Contentor — desenha uma caixa/));
    expect(screen.getByText(/CONTENTOR — arrasta para desenhar/)).toBeTruthy();
    fireEvent.mouseDown(container.querySelector("main"), { button: 0, clientX: 100, clientY: 100 });
    fireEvent.mouseMove(areaDeTrabalho(container), { clientX: 500, clientY: 400 });
    expect(container.querySelector('[data-testid="contentor-rascunho"]')).toBeTruthy();
    fireEvent.mouseUp(window);

    expect(container.querySelectorAll('[data-testid="contentor"]')).toHaveLength(1);
    expect(caixa(container).getAttribute("x")).toBe("100");
    expect(caixa(container).getAttribute("width")).toBe("400");
    expect(screen.queryByText(/CONTENTOR — arrasta para desenhar/)).toBeNull(); // a ferramenta desliga-se

    // nasce seleccionada, com a barra de edição: renomear
    const rotulo = screen.getByLabelText("Rótulo do contentor");
    await user.clear(rotulo);
    await user.type(rotulo, "VPC");
    expect(within(container.querySelector('[data-testid="contentor-aba"]')).getByText("VPC")).toBeTruthy();

    // um nó dentro, outro fora
    await user.click(screen.getByTitle("Adicionar SENSÓRIA"));
    await user.click(screen.getByTitle("Adicionar SENSÓRIA"));
    const [dentro, fora] = container.querySelectorAll('[data-testid="no"]');
    moverNoPara(container, dentro, 200, 200);
    moverNoPara(container, fora, 700, 700);

    // arrastar a caixa pela aba do rótulo
    fireEvent.mouseDown(container.querySelector('[data-testid="contentor-aba"]'), { button: 0, clientX: 110, clientY: 110 });
    fireEvent.mouseMove(areaDeTrabalho(container), { clientX: 160, clientY: 130 });
    fireEvent.mouseUp(window);

    expect(caixa(container).getAttribute("x")).toBe("150");
    expect(caixa(container).getAttribute("y")).toBe("120");
    const [d2, f2] = container.querySelectorAll('[data-testid="no"]');
    expect(d2.getAttribute("transform")).toBe("translate(230,200)"); // (200,200) + (50,20), menos o meio-nó
    expect(f2.getAttribute("transform")).toBe("translate(680,680)"); // não se mexeu
  });

  it("o interior da caixa não agarra o rato; Delete apaga a caixa mas não o que está dentro", async () => {
    const { user, container } = await arrancar();
    await user.click(screen.getByTitle(/Contentor — desenha uma caixa/));
    fireEvent.mouseDown(container.querySelector("main"), { button: 0, clientX: 100, clientY: 100 });
    fireEvent.mouseMove(areaDeTrabalho(container), { clientX: 500, clientY: 400 });
    fireEvent.mouseUp(window);
    await user.click(screen.getByTitle("Adicionar SENSÓRIA"));
    moverNoPara(container, container.querySelector('[data-testid="no"]'), 300, 300);

    expect(caixa(container).style.pointerEvents).toBe("none");

    // seleccionar pela borda e apagar
    fireEvent.mouseDown(container.querySelector('[data-testid="contentor-borda"]'), { button: 0, clientX: 100, clientY: 250 });
    fireEvent.mouseUp(window);
    fireEvent.keyDown(window, { key: "Delete" });
    expect(container.querySelectorAll('[data-testid="contentor"]')).toHaveLength(0);
    expect(container.querySelectorAll('[data-testid="no"]')).toHaveLength(1);
  });

  it("um clique sem arrastar cria a caixa de tamanho padrão; trancada não se move", async () => {
    const { user, container } = await arrancar();
    await user.click(screen.getByTitle(/Contentor — desenha uma caixa/));
    fireEvent.mouseDown(container.querySelector("main"), { button: 0, clientX: 400, clientY: 300 });
    fireEvent.mouseUp(window);
    expect(caixa(container).getAttribute("width")).toBe("320");
    expect(caixa(container).getAttribute("x")).toBe("240"); // centrada no clique

    fireEvent.click(container.querySelector('[data-testid="trava-contentor"]'));
    fireEvent.mouseDown(container.querySelector('[data-testid="contentor-aba"]'), { button: 0, clientX: 250, clientY: 210 });
    fireEvent.mouseMove(areaDeTrabalho(container), { clientX: 400, clientY: 400 });
    fireEvent.mouseUp(window);
    expect(caixa(container).getAttribute("x")).toBe("240");
    expect(screen.queryByLabelText("Rótulo do contentor")).toBeNull(); // trancada: sem barra de edição
  });
});
