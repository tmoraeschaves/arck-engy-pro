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

  it("as linhas acabam na borda do nó de destino (a seta não fica tapada pelo nó)", () => {
    const a = { id: "a", layer: "L1", x: 0, y: 0 }, b = { id: "b", layer: "L2", x: 200, y: 0 };
    const svg = construirSVG({ nodes: [a, b], connections: [{ id: "c", sourceId: "a", targetId: "b" }], shapes: [], corDaCamada: cor, modoLivre: false });
    const [, x1, x2] = svg.match(/<line x1="([\d.]+)" y1="[\d.]+" x2="([\d.]+)"/);
    // origem em x=70 e destino em x=270 depois do deslocamento de margem (mx = -70)
    expect(Number(x1)).toBeGreaterThanOrEqual(70 + 20);
    expect(Number(x2)).toBeLessThanOrEqual(270 - 20);
  });
});
