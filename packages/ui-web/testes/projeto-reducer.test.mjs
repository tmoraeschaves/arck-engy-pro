/**
 * REDUCER DO PROJECTO — a máquina de estados do documento.
 * Cada transição é nomeada e testada (Manual Esqueleto v2.0, Regra de Ouro Operacional).
 */
import { describe, it, expect } from "vitest";
import { projetoReducer as r, estadoInicial, snapshot, podeLigar } from "../src/hooks/projeto-reducer.js";

const no = (id, layer, x = 0, y = 0) => ({ id, layer, x, y, createdAt: Number(id.replace(/\D/g, "")) || 0 });
const comNos = (...nos) => ({ ...estadoInicial, nodes: nos });

describe("estado inicial e snapshot", () => {
  it("começa vazio, em modo guiado, sem sector", () => {
    expect(estadoInicial.nodes).toEqual([]);
    expect(estadoInicial.freeMode).toBe(false);
    expect(estadoInicial.sector).toBeNull();
  });
  it("snapshot só expõe os campos do documento", () => {
    const s = snapshot(estadoInicial);
    expect(Object.keys(s).sort()).toEqual(
      ["annotations", "bgImage", "bgOpacity", "connections", "customColors", "freeMode", "nodes", "sector", "shapes"],
    );
  });
  it("acção desconhecida → mesmo estado (referência intacta)", () => {
    expect(r(estadoInicial, { tipo: "??" })).toBe(estadoInicial);
  });
});

describe("nós", () => {
  it("ADICIONAR_NO acrescenta", () => {
    const e = r(estadoInicial, { tipo: "ADICIONAR_NO", no: no("n1", "L1") });
    expect(e.nodes).toHaveLength(1);
    expect(e.nodes[0].id).toBe("n1");
  });

  it("REMOVER_NO tira o nó E as ligações que lhe tocam", () => {
    let e = { ...comNos(no("n1", "L1"), no("n2", "L2")), connections: [{ id: "c1", sourceId: "n1", targetId: "n2" }] };
    e = r(e, { tipo: "REMOVER_NO", id: "n1" });
    expect(e.nodes.map(n => n.id)).toEqual(["n2"]);
    expect(e.connections).toEqual([]);
  });

  it("MOVER_NO altera só as coordenadas do alvo", () => {
    const e = r(comNos(no("n1", "L1", 10, 10), no("n2", "L2", 20, 20)), { tipo: "MOVER_NO", id: "n2", x: 99, y: 88 });
    expect(e.nodes.find(n => n.id === "n2")).toMatchObject({ x: 99, y: 88 });
    expect(e.nodes.find(n => n.id === "n1")).toMatchObject({ x: 10, y: 10 });
  });

  it("ESCALAR_LAYOUT com diagrama vazio → no-op (Lição de fronteira)", () => {
    expect(r(estadoInicial, { tipo: "ESCALAR_LAYOUT", fator: 2 })).toBe(estadoInicial);
  });

  it("ESCALAR_LAYOUT afasta os nós do centróide", () => {
    const e = r(comNos(no("n1", "L1", 0, 0), no("n2", "L2", 100, 0)), { tipo: "ESCALAR_LAYOUT", fator: 2 });
    // centróide (50,0): n1 → -50, n2 → 150
    expect(e.nodes[0].x).toBe(-50);
    expect(e.nodes[1].x).toBe(150);
  });
});

describe("ligações — a regra do domínio via podeLigar", () => {
  const base = comNos(no("n1", "L1"), no("n2", "L2"), no("n3", "L3"));

  it("LIGAR válida em modo guiado entra", () => {
    const e = r(base, { tipo: "LIGAR", ligacao: { id: "c1", sourceId: "n1", targetId: "n2" } });
    expect(e.connections).toHaveLength(1);
  });

  it("LIGAR inválida em modo guiado → no-op", () => {
    const e = r(base, { tipo: "LIGAR", ligacao: { id: "c1", sourceId: "n1", targetId: "n3" } });
    expect(e).toBe(base);
  });

  it("LIGAR inválida entra em modo livre", () => {
    const e = r({ ...base, freeMode: true }, { tipo: "LIGAR", ligacao: { id: "c1", sourceId: "n1", targetId: "n3" } });
    expect(e.connections).toHaveLength(1);
  });

  it("LIGAR duplicada (mesmo par, qualquer sentido) → no-op", () => {
    let e = r(base, { tipo: "LIGAR", ligacao: { id: "c1", sourceId: "n1", targetId: "n2" } });
    e = r(e, { tipo: "LIGAR", ligacao: { id: "c2", sourceId: "n2", targetId: "n1" } });
    expect(e.connections).toHaveLength(1);
  });

  it("LIGAR nó a si próprio → no-op", () => {
    expect(r(base, { tipo: "LIGAR", ligacao: { id: "c1", sourceId: "n1", targetId: "n1" } })).toBe(base);
  });

  it("DESLIGAR remove por id", () => {
    let e = r(base, { tipo: "LIGAR", ligacao: { id: "c1", sourceId: "n1", targetId: "n2" } });
    e = r(e, { tipo: "DESLIGAR", id: "c1" });
    expect(e.connections).toEqual([]);
  });

  it("CORTAR_LIGACOES remove o conjunto indicado; lista vazia → no-op", () => {
    let e = { ...base, connections: [{ id: "c1" }, { id: "c2" }, { id: "c3" }] };
    expect(r(e, { tipo: "CORTAR_LIGACOES", ids: [] })).toBe(e);
    e = r(e, { tipo: "CORTAR_LIGACOES", ids: ["c1", "c3"] });
    expect(e.connections.map(c => c.id)).toEqual(["c2"]);
  });

  it("podeLigar é exportada e coerente com o reducer", () => {
    expect(podeLigar(base, "n1", "n2")).toBe(true);
    expect(podeLigar(base, "n1", "n3")).toBe(false);
  });
});

describe("formas", () => {
  const f = { id: "s1", type: "cube", x: 0, y: 0, w: 140, h: 140 };
  it("ADICIONAR / MOVER / REDIMENSIONAR / REMOVER_FORMA", () => {
    let e = r(estadoInicial, { tipo: "ADICIONAR_FORMA", forma: f });
    expect(e.shapes).toHaveLength(1);
    e = r(e, { tipo: "MOVER_FORMA", id: "s1", x: 10, y: 20 });
    expect(e.shapes[0]).toMatchObject({ x: 10, y: 20 });
    e = r(e, { tipo: "REDIMENSIONAR_FORMA", id: "s1", x: 1, y: 2, w: 50, h: 60 });
    expect(e.shapes[0]).toMatchObject({ x: 1, y: 2, w: 50, h: 60 });
    e = r(e, { tipo: "REMOVER_FORMA", id: "s1" });
    expect(e.shapes).toEqual([]);
  });
});

describe("anotações", () => {
  const a = { id: "a1", x: 0, y: 0, text: "", expanded: true };
  it("ADICIONAR / EDITAR / ALTERNAR / REMOVER_ANOTACAO", () => {
    let e = r(estadoInicial, { tipo: "ADICIONAR_ANOTACAO", anotacao: a });
    e = r(e, { tipo: "EDITAR_ANOTACAO", id: "a1", text: "olá" });
    expect(e.annotations[0].text).toBe("olá");
    e = r(e, { tipo: "ALTERNAR_ANOTACAO", id: "a1" });
    expect(e.annotations[0].expanded).toBe(false);
    e = r(e, { tipo: "REMOVER_ANOTACAO", id: "a1" });
    expect(e.annotations).toEqual([]);
  });
});

describe("aparência", () => {
  it("DEFINIR_COR / LIMPAR_COR / REPOR_CORES", () => {
    let e = r(estadoInicial, { tipo: "DEFINIR_COR", camada: "L1", cor: "#fff" });
    expect(e.customColors.L1).toBe("#fff");
    e = r(r(e, { tipo: "DEFINIR_COR", camada: "L2", cor: "#000" }), { tipo: "LIMPAR_COR", camada: "L1" });
    expect(e.customColors).toEqual({ L2: "#000" });
    e = r(e, { tipo: "REPOR_CORES" });
    expect(e.customColors).toEqual({});
  });
  it("DEFINIR_FUNDO / DEFINIR_OPACIDADE_FUNDO", () => {
    let e = r(estadoInicial, { tipo: "DEFINIR_FUNDO", img: "data:..." });
    expect(e.bgImage).toBe("data:...");
    e = r(e, { tipo: "DEFINIR_OPACIDADE_FUNDO", opacidade: 0.7 });
    expect(e.bgOpacity).toBe(0.7);
  });
});

describe("sector e modo", () => {
  it("DEFINIR_SECTOR / ALTERNAR_MODO_LIVRE / DEFINIR_MODO_LIVRE", () => {
    let e = r(estadoInicial, { tipo: "DEFINIR_SECTOR", sector: "medicina" });
    expect(e.sector).toBe("medicina");
    e = r(e, { tipo: "ALTERNAR_MODO_LIVRE" });
    expect(e.freeMode).toBe(true);
    e = r(e, { tipo: "DEFINIR_MODO_LIVRE", valor: false });
    expect(e.freeMode).toBe(false);
  });
});

describe("projecto inteiro", () => {
  const cheio = {
    ...estadoInicial,
    nodes: [no("n1", "L1")], connections: [], shapes: [{ id: "s1" }],
    annotations: [{ id: "a1" }], customColors: { L1: "#fff" }, bgImage: "x", sector: "negocios", freeMode: true,
  };

  it("RESETAR limpa diagrama + fundo, mantém sector/modo/cores", () => {
    const e = r(cheio, { tipo: "RESETAR" });
    expect(e.nodes).toEqual([]);
    expect(e.shapes).toEqual([]);
    expect(e.annotations).toEqual([]);
    expect(e.bgImage).toBeNull();
    expect(e.sector).toBe("negocios");
    expect(e.freeMode).toBe(true);
    expect(e.customColors).toEqual({ L1: "#fff" });
  });

  it("CARREGAR_PROJETO substitui tudo; campos em falta → vazios", () => {
    const e = r(cheio, { tipo: "CARREGAR_PROJETO", projeto: { nodes: [no("z", "L2")] } });
    expect(e.nodes.map(n => n.id)).toEqual(["z"]);
    expect(e.connections).toEqual([]);
    expect(e.shapes).toEqual([]);
    expect(e.customColors).toEqual({});
  });

  it("CARREGAR_PROJETO preserva sector/modo actuais quando o ficheiro não os traz", () => {
    const e = r(cheio, { tipo: "CARREGAR_PROJETO", projeto: { nodes: [] } });
    expect(e.sector).toBe("negocios");
    expect(e.freeMode).toBe(true);
  });

  it("snapshot(CARREGAR_PROJETO(snapshot)) é idempotente", () => {
    const s1 = snapshot(cheio);
    const s2 = snapshot(r(estadoInicial, { tipo: "CARREGAR_PROJETO", projeto: s1 }));
    expect(s2).toEqual(s1);
  });
});
