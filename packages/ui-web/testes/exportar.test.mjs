/**
 * construirSVG (infra/exportar) — geração pura do SVG do diagrama.
 */
import { describe, it, expect } from "vitest";
import { construirSVG } from "../src/infra/exportar.js";

const cor = () => "#123456";
let t = 0;
const no = (layer) => ({ id: `n${++t}`, layer, x: 100 * t, y: 100 });

describe("construirSVG", () => {
  it("sem nós nem formas → null", () => {
    expect(construirSVG({ nodes: [], connections: [], shapes: [], corDaCamada: cor, modoLivre: false })).toBeNull();
  });

  it("produz documento SVG e usa a cor de corDaCamada", () => {
    const a = no("L1"), b = no("L2");
    const svg = construirSVG({
      nodes: [a, b], shapes: [],
      connections: [{ id: "c", sourceId: a.id, targetId: b.id }],
      corDaCamada: cor, modoLivre: false,
    });
    expect(svg.startsWith("<?xml")).toBe(true);
    expect(svg).toContain("<svg");
    expect(svg).toContain("#123456");
    expect(svg).toContain("#10B981"); // L1→L2 válida → verde
  });

  it("ligação inválida em guiado → vermelho; em livre → verde", () => {
    const a = no("L1"), c = no("L3");
    const conn = [{ id: "c2", sourceId: a.id, targetId: c.id }];
    const guiado = construirSVG({ nodes: [a, c], shapes: [], connections: conn, corDaCamada: cor, modoLivre: false });
    const livre = construirSVG({ nodes: [a, c], shapes: [], connections: conn, corDaCamada: cor, modoLivre: true });
    expect(guiado).toContain("#EF4444");
    expect(livre).toContain("#10B981");
    expect(livre).not.toContain("#EF4444");
  });
});
