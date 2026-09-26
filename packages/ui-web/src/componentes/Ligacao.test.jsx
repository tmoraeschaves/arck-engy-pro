import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Ligacao } from "./Ligacao.jsx";

const origem = { x: 0, y: 0 }, destino = { x: 100, y: 0 };

describe("Ligacao", () => {
  it("desenha uma linha entre origem e destino com a cor dada", () => {
    const { container } = render(<svg><Ligacao id="c1" origem={origem} destino={destino} cor="#10B981" marcador="arr-ok" retorno={false} onDesligar={() => {}} /></svg>);
    const linha = container.querySelector("line");
    expect(linha).toHaveAttribute("stroke", "#10B981");
    expect(linha.getAttribute("marker-end")).toBe("url(#arr-ok)");
  });

  it("retorno (L5→L2) usa traço mais grosso e tracejado", () => {
    const { container } = render(<svg><Ligacao id="c1" origem={origem} destino={destino} cor="#10B981" marcador="arr-ok" retorno onDesligar={() => {}} /></svg>);
    const linha = container.querySelector("line");
    expect(linha.getAttribute("stroke-width")).toBe("2.5");
    expect(linha).toHaveAttribute("stroke-dasharray", "7,4");
  });

  it("clicar no alvo do meio despacha onDesligar com o id", () => {
    const onDesligar = vi.fn();
    const { container } = render(<svg><Ligacao id="c1" origem={origem} destino={destino} cor="#10B981" marcador="arr-ok" retorno={false} onDesligar={onDesligar} /></svg>);
    fireEvent.click(container.querySelector("circle"));
    expect(onDesligar).toHaveBeenCalledWith("c1");
  });

  it("a linha acaba na borda do nó de destino (a seta fica visível, não tapada pelo nó)", () => {
    const { container } = render(<svg><Ligacao id="c1" origem={origem} destino={{ x: 200, y: 0 }} cor="#10B981" marcador="arr-ok" retorno={false} onDesligar={() => {}} /></svg>);
    const linha = container.querySelector("line");
    expect(Number(linha.getAttribute("x2"))).toBeLessThanOrEqual(200 - 20);
    expect(Number(linha.getAttribute("x1"))).toBeGreaterThanOrEqual(20);
  });
});
