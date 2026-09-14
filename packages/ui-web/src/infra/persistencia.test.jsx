import { describe, it, expect, beforeEach } from "vitest";
import { autoguardarProjetoLocal, lerProjetoLocal, apagarProjetoLocal } from "./persistencia.js";

describe("autosave (autoguardar / lerProjetoLocal)", () => {
  beforeEach(() => localStorage.clear());

  it("round-trip: o que se guarda é o que se lê", () => {
    const proj = { nodes: [{ id: "n1", layer: "L1", x: 10, y: 20 }], connections: [], shapes: [], annotations: [], sector: "medicina", freeMode: true };
    expect(autoguardarProjetoLocal(proj)).toBe(true);
    expect(lerProjetoLocal()).toEqual(proj);
  });

  it("sem nada guardado → null", () => {
    expect(lerProjetoLocal()).toBe(null);
  });

  it("JSON corrompido → null (nunca rebenta)", () => {
    localStorage.setItem("ae_project", "{isto não é json");
    expect(lerProjetoLocal()).toBe(null);
  });

  it("objeto sem `nodes` (formato errado) → null", () => {
    localStorage.setItem("ae_project", JSON.stringify({ foo: 1 }));
    expect(lerProjetoLocal()).toBe(null);
  });

  it("apagar remove o autosave", () => {
    autoguardarProjetoLocal({ nodes: [] });
    apagarProjetoLocal();
    expect(lerProjetoLocal()).toBe(null);
  });
});
