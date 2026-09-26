/**
 * aparaNaBorda (lib/geometria) — a linha de uma ligação começa e acaba na borda dos nós,
 * não no centro; senão a seta fica desenhada DENTRO do quadrado de destino e é tapada.
 */
import { describe, it, expect } from "vitest";
import { aparaNaBorda, MEIO_NO } from "../src/lib/geometria.js";

describe("aparaNaBorda", () => {
  it("horizontal: pára a MEIO_NO + folga do centro de cada nó", () => {
    const l = aparaNaBorda({ x: 0, y: 0 }, { x: 200, y: 0 }, 3);
    expect(l).toEqual({ x1: MEIO_NO + 3, y1: 0, x2: 200 - MEIO_NO - 3, y2: 0 });
  });

  it("diagonal: o fim fica sobre a borda do quadrado (não do círculo)", () => {
    const l = aparaNaBorda({ x: 0, y: 0 }, { x: 100, y: 100 }, 0);
    // no canto do quadrado de destino: (100-20, 100-20)
    expect(l.x2).toBeCloseTo(100 - MEIO_NO);
    expect(l.y2).toBeCloseTo(100 - MEIO_NO);
  });

  it("vertical para cima: acaba por baixo do nó de destino", () => {
    const l = aparaNaBorda({ x: 50, y: 300 }, { x: 50, y: 100 }, 0);
    expect(l).toEqual({ x1: 50, y1: 300 - MEIO_NO, x2: 50, y2: 100 + MEIO_NO });
  });

  it("nós sobrepostos (demasiado perto): devolve centro a centro, não inverte a linha", () => {
    const l = aparaNaBorda({ x: 0, y: 0 }, { x: 30, y: 0 }, 3);
    expect(l).toEqual({ x1: 0, y1: 0, x2: 30, y2: 0 });
  });
});
