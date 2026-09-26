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
