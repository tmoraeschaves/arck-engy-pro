import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Forma } from "./Forma.jsx";
import { GEO_SHAPES } from "../config/formas.js";

const forma = { id: "s1", type: "cube", x: 0, y: 0, w: 100, h: 100 };
const definicao = GEO_SHAPES.find(s => s.id === "cube");
const paraCanvas = (x, y) => ({ x, y }); // identidade — sem canvasRef em teste

describe("Forma", () => {
  it("sem selecção, não mostra alças", () => {
    const { container } = render(
      <svg><Forma forma={forma} definicao={definicao} seleccionada={false} paraCanvas={paraCanvas}
        onSeleccionar={() => {}} onIniciarArrasto={() => {}} onIniciarRedimensionar={() => {}} onRemover={() => {}} /></svg>,
    );
    expect(container.querySelectorAll('[data-testid="alca"]').length).toBe(0);
  });

  it("seleccionada mostra 4 alças de redimensionar", () => {
    const { container } = render(
      <svg><Forma forma={forma} definicao={definicao} seleccionada paraCanvas={paraCanvas}
        onSeleccionar={() => {}} onIniciarArrasto={() => {}} onIniciarRedimensionar={() => {}} onRemover={() => {}} /></svg>,
    );
    expect(container.querySelectorAll('[data-testid="alca"]').length).toBe(4);
  });

  it("mousedown no corpo despacha onSeleccionar e onIniciarArrasto", () => {
    const onSeleccionar = vi.fn(), onIniciarArrasto = vi.fn();
    const { container } = render(
      <svg><Forma forma={forma} definicao={definicao} seleccionada={false} paraCanvas={paraCanvas}
        onSeleccionar={onSeleccionar} onIniciarArrasto={onIniciarArrasto} onIniciarRedimensionar={() => {}} onRemover={() => {}} /></svg>,
    );
    fireEvent.mouseDown(container.querySelector("g > g"), { clientX: 10, clientY: 20 });
    expect(onSeleccionar).toHaveBeenCalledWith("s1");
    expect(onIniciarArrasto).toHaveBeenCalledWith({ id: "s1", ox: 10, oy: 20 });
  });

  it("botão direito despacha onRemover", () => {
    const onRemover = vi.fn();
    const { container } = render(
      <svg><Forma forma={forma} definicao={definicao} seleccionada={false} paraCanvas={paraCanvas}
        onSeleccionar={() => {}} onIniciarArrasto={() => {}} onIniciarRedimensionar={() => {}} onRemover={onRemover} /></svg>,
    );
    fireEvent.contextMenu(container.querySelector("g > g"));
    expect(onRemover).toHaveBeenCalledWith("s1");
  });

  it("trancada: sem alças, mousedown não arrasta, botão direito não remove", () => {
    const onIniciarArrasto = vi.fn(), onRemover = vi.fn();
    const { container } = render(
      <svg><Forma forma={{ ...forma, locked: true }} definicao={definicao} seleccionada paraCanvas={paraCanvas}
        onSeleccionar={() => {}} onIniciarArrasto={onIniciarArrasto} onIniciarRedimensionar={() => {}}
        onAlternarTrava={() => {}} onRemover={onRemover} /></svg>,
    );
    expect(container.querySelectorAll('[data-testid="alca"]').length).toBe(0);
    fireEvent.mouseDown(container.querySelector('[data-testid="forma"]'), { clientX: 10, clientY: 20 });
    expect(onIniciarArrasto).not.toHaveBeenCalled();
    fireEvent.contextMenu(container.querySelector('[data-testid="forma"]'));
    expect(onRemover).not.toHaveBeenCalled();
  });

  it("seleccionada: o cadeado alterna a trava da forma", () => {
    const onAlternarTrava = vi.fn();
    const { container } = render(
      <svg><Forma forma={forma} definicao={definicao} seleccionada paraCanvas={paraCanvas}
        onSeleccionar={() => {}} onIniciarArrasto={() => {}} onIniciarRedimensionar={() => {}}
        onAlternarTrava={onAlternarTrava} onRemover={() => {}} /></svg>,
    );
    fireEvent.click(container.querySelector('[data-testid="trava-forma"]'));
    expect(onAlternarTrava).toHaveBeenCalledWith("s1");
  });
  it("trancada sem selecção: nenhum texto solto no SVG (regressão do '}' a mais)", () => {
    const { container } = render(
      <svg><Forma forma={{ ...forma, locked: true }} definicao={definicao} seleccionada={false} paraCanvas={paraCanvas}
        onSeleccionar={() => {}} onIniciarArrasto={() => {}} onIniciarRedimensionar={() => {}} onRemover={() => {}} /></svg>,
    );
    expect(container.textContent).not.toContain("}");
  });
});
