import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ShapePreview, ShapeElements } from "./FormasSVG.jsx";
import { GEO_SHAPES } from "../config/formas.js";

const cubo = GEO_SHAPES.find(s => s.id === "cube");

describe("ShapePreview", () => {
  it("renderiza um <svg> com os elementos da forma", () => {
    const { container } = render(<ShapePreview shape={cubo} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    // o cubo tem 1 polígono + várias linhas
    expect(svg.querySelector("polygon")).toBeInTheDocument();
    expect(svg.querySelectorAll("line").length).toBeGreaterThan(0);
  });
});

describe("ShapeElements", () => {
  it("escala os pontos para a caixa (x,y,w,h) dada", () => {
    const { container } = render(
      <svg><ShapeElements shape={cubo} x={0} y={0} w={100} h={100} /></svg>,
    );
    const poly = container.querySelector("polygon");
    // primeiro ponto do cubo é [50,8] em espaço 0-100 → (50,8) numa caixa 100x100
    expect(poly.getAttribute("points").startsWith("50,8")).toBe(true);
  });

  it("usa a cor de seleção quando selected", () => {
    const { container } = render(
      <svg><ShapeElements shape={cubo} x={0} y={0} w={10} h={10} selected /></svg>,
    );
    expect(container.querySelector("polygon").getAttribute("stroke")).toBe("#60A5FA");
  });
});
