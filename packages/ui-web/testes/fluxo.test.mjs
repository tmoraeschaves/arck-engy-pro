/**
 * RELATÓRIO DE FLUXO (computeFlowReport) — inclui os casos de fronteira da Lição 3
 * do Manual: diagrama vazio, ciclos, ramificações, ligações inválidas.
 */
import { describe, it, expect } from "vitest";
import { computeFlowReport } from "../src/lib/flow-report.js";

let t = 0;
const no = (layer) => ({ id: `n${++t}`, layer, x: 0, y: 0, createdAt: t });

describe("casos de fronteira", () => {
  it("diagrama vazio → null (não um relatório de zeros)", () => {
    expect(computeFlowReport([], [])).toBeNull();
  });

  it("nó isolado → um caminho com o próprio rótulo, 0 ligações", () => {
    const solo = no("L1");
    const r = computeFlowReport([solo], []);
    expect(r.paths).toEqual(["L1"]);
    expect(r.stats.total).toBe(0);
  });
});

describe("cadeia linear L1→L2→L3", () => {
  const a = no("L1"), b = no("L2"), c = no("L3");
  const conns = [
    { id: "c1", sourceId: a.id, targetId: b.id },
    { id: "c2", sourceId: b.id, targetId: c.id },
  ];
  const r = computeFlowReport([a, b, c], conns);

  it("descreve o caminho em texto", () => expect(r.paths[0]).toBe("L1 → L2 → L3"));
  it("conta 2 ligações, ambas válidas", () => {
    expect(r.stats).toMatchObject({ total: 2, valid: 2, invalid: 0 });
  });
  it("inventário agrupa por camada", () => {
    expect(r.inventory.L1).toEqual(["L1"]);
    expect(r.inventory.L3).toEqual(["L3"]);
  });
});

describe("estatísticas", () => {
  it("ligação L5→L2 contada como ciclo", () => {
    const h = no("L2"), s = no("L5");
    const r = computeFlowReport([h, s], [{ id: "cyc", sourceId: s.id, targetId: h.id }]);
    expect(r.stats.cycles).toBe(1);
  });

  it("L1→L4 contada como inválida", () => {
    const x = no("L1"), y = no("L4");
    const r = computeFlowReport([x, y], [{ id: "bad", sourceId: x.id, targetId: y.id }]);
    expect(r.stats).toMatchObject({ invalid: 1, valid: 0 });
  });

  it("ramificação usa o símbolo ⊕", () => {
    const p = no("L2"), q1 = no("L3"), q2 = no("L3");
    const r = computeFlowReport([p, q1, q2], [
      { id: "b1", sourceId: p.id, targetId: q1.id },
      { id: "b2", sourceId: p.id, targetId: q2.id },
    ]);
    expect(r.paths[0]).toContain("⊕");
  });
});
