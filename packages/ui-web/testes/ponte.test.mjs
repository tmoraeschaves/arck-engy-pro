/**
 * PONTE PARA O CORAÇÃO (RL-PONTE-01) — os adaptadores UI ↔ domínio são código crítico.
 */
import { describe, it, expect } from "vitest";
import {
  toNo, toLigacoes, toModo, isValidLink, displayTensao,
} from "../src/lib/core-bridge.js";

describe("toNo / toLigacoes / toModo", () => {
  it("toNo mapeia layer→camada e descarta campos de UI", () => {
    const n = toNo({ id: "a", layer: "L1", x: 10, y: 20 });
    expect(n).toEqual({ id: "a", camada: "L1" });
  });

  it("toLigacoes constrói Ligacao a partir de sourceId/targetId", () => {
    const nodos = [{ id: "1", layer: "L1" }, { id: "2", layer: "L2" }];
    const ligs = toLigacoes([{ sourceId: "1", targetId: "2" }], nodos);
    expect(ligs).toEqual([{ origem: { id: "1", camada: "L1" }, destino: { id: "2", camada: "L2" } }]);
  });

  it("toLigacoes descarta ligação com nó inexistente", () => {
    const nodos = [{ id: "1", layer: "L1" }];
    expect(toLigacoes([{ sourceId: "1", targetId: "999" }], nodos)).toEqual([]);
  });

  it("toLigacoes com tudo vazio → []", () => {
    expect(toLigacoes([], [])).toEqual([]);
  });

  it("toModo(true) → LIVRE, toModo(false) → GUIADO", () => {
    expect(String(toModo(true))).toContain("LIVRE");
    expect(String(toModo(false))).toContain("GUIADO");
  });
});

describe("isValidLink — regra do domínio, não duplicada na UI", () => {
  it.each([
    ["L1", "L2", true],
    ["L2", "L3", true],
    ["L5", "L2", true],
    ["L2", "L1", false],
    ["L1", "L3", false],
  ])("%s → %s = %s", (a, b, esperado) => {
    expect(isValidLink(a, b)).toBe(esperado);
  });
});

describe("displayTensao", () => {
  it("estado INERCIA → 'INÉRCIA'", () => expect(displayTensao(0, "INERCIA")).toBe("INÉRCIA"));
  it("valor numérico → 'N%'", () => expect(displayTensao(100, "LIVRE_CORRETO")).toBe("100%"));
  it("ERRO com valor 0 → '0%' (não 'INÉRCIA')", () => expect(displayTensao(0, "ERRO")).toBe("0%"));
});
