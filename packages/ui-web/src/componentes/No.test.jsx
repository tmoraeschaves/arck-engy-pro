import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { No } from "./No.jsx";

const node = { id: "n1", layer: "L1", x: 100, y: 100 };

function montar(props = {}) {
  const onIniciarArrasto = vi.fn(), onClicar = vi.fn(), onRemover = vi.fn(), onAlternarTrava = vi.fn();
  const { container } = render(
    <svg><No node={node} sector="engenharia" cor="#3B82F6" seleccionado={false} todosSeleccionados={false}
      mostrarRotulo rotulo="SENSÓRIA"
      onIniciarArrasto={onIniciarArrasto} onClicar={onClicar} onRemover={onRemover} onAlternarTrava={onAlternarTrava} {...props} /></svg>,
  );
  return { container, onIniciarArrasto, onClicar, onRemover, onAlternarTrava };
}

// o <g> exterior do nó é o primeiro com data-testid
const noG = c => c.querySelector('[data-testid="no"]');

describe("No", () => {
  it("mostra o rótulo e posiciona pelo x/y do nó", () => {
    const { container } = montar();
    expect(container.textContent).toContain("SENSÓRIA");
    expect(noG(container).getAttribute("transform")).toBe("translate(80,80)");
  });

  it("clicar despacha onClicar com o id", () => {
    const { container, onClicar } = montar();
    fireEvent.click(noG(container));
    expect(onClicar).toHaveBeenCalledWith("n1");
  });

  it("mousedown despacha onIniciarArrasto com o nó, excepto quando trancado", () => {
    const { container, onIniciarArrasto } = montar();
    fireEvent.mouseDown(noG(container));
    expect(onIniciarArrasto).toHaveBeenCalledWith(node);

    const trancado = montar({ node: { ...node, locked: true } });
    fireEvent.mouseDown(noG(trancado.container));
    expect(trancado.onIniciarArrasto).not.toHaveBeenCalled();
  });

  it("botão direito despacha onRemover com o id", () => {
    const { container, onRemover } = montar();
    fireEvent.contextMenu(noG(container));
    expect(onRemover).toHaveBeenCalledWith("n1");
  });

  it("trancado: botão direito não remove o nó", () => {
    const { container, onRemover } = montar({ node: { ...node, locked: true } });
    fireEvent.contextMenu(noG(container));
    expect(onRemover).not.toHaveBeenCalled();
  });

  it("seleccionado: o cadeado alterna a trava do nó", () => {
    const { container, onAlternarTrava } = montar({ seleccionado: true });
    const cadeado = container.querySelector('[data-testid="trava-no"]');
    expect(cadeado).toBeTruthy();
    fireEvent.click(cadeado);
    expect(onAlternarTrava).toHaveBeenCalledWith("n1");
  });

  it("não seleccionado e destrancado: sem cadeado", () => {
    const { container } = montar();
    expect(container.querySelector('[data-testid="trava-no"]')).toBeFalsy();
  });
});
