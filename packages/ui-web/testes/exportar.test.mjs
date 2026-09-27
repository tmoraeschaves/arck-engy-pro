/**
 * construirSVG (infra/exportar) — geração pura do SVG do diagrama.
 */
import { describe, it, expect } from "vitest";
import { construirSVG, dimensoesSVG } from "../src/infra/exportar.js";

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

describe("construirSVG — contentores (DEC-018)", () => {
  const vpc = { id: "vpc", x: 0, y: 0, w: 600, h: 400, label: "VPC <10.0.0.0/16>", cor: "#16A34A", estilo: "continuo" };
  const az = { id: "az", x: 50, y: 50, w: 200, h: 200, label: "AZ", cor: "#0284C7", estilo: "tracejado" };

  it("só com contentores já exporta, com rótulo escapado e contorno tracejado", () => {
    const svg = construirSVG({ nodes: [], connections: [], shapes: [], containers: [vpc, az], corDaCamada: cor, modoLivre: false });
    expect(svg).toContain("VPC &lt;10.0.0.0/16&gt;");
    expect(svg).toContain('stroke-dasharray="8,5"');
    expect(svg.indexOf("VPC")).toBeLessThan(svg.indexOf(">AZ<")); // mãe desenhada antes da filha
  });

  it("a imagem cabe a caixa inteira (canto inferior direito incluído)", () => {
    const svg = construirSVG({ nodes: [], connections: [], shapes: [], containers: [vpc], corDaCamada: cor, modoLivre: false });
    const { w, h } = dimensoesSVG(svg);
    expect(w).toBeGreaterThanOrEqual(600 + 70);
    expect(h).toBeGreaterThanOrEqual(400 + 70);
  });

  it("dimensoesSVG lê o tamanho do elemento <svg>, não do <rect> de fundo", () => {
    expect(dimensoesSVG('<?xml version="1.0"?><svg xmlns="x" width="812" height="455"><rect width="1" height="2"/></svg>')).toEqual({ w: 812, h: 455 });
  });
});
