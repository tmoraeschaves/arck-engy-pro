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
      ["annotations", "bgImage", "bgLocked", "bgOpacity", "connections", "containers", "customColors", "freeMode", "nodes", "sector", "shapes"],
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

  it("ALTERNAR_TRAVA_NO liga e desliga o `locked` do nó", () => {
    let e = r(comNos(no("n1", "L1")), { tipo: "ALTERNAR_TRAVA_NO", id: "n1" });
    expect(e.nodes[0].locked).toBe(true);
    e = r(e, { tipo: "ALTERNAR_TRAVA_NO", id: "n1" });
    expect(e.nodes[0].locked).toBe(false);
  });

  it("nó trancado: REMOVER_NO e MOVER_NO são no-op", () => {
    const trancado = comNos({ ...no("n1", "L1", 10, 10), locked: true });
    expect(r(trancado, { tipo: "REMOVER_NO", id: "n1" })).toBe(trancado);
    expect(r(trancado, { tipo: "MOVER_NO", id: "n1", x: 99, y: 99 })).toBe(trancado);
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

describe("módulos dentro de um nó (Movimento 8)", () => {
  const base = comNos(no("n1", "L3"), no("n2", "L2"));
  const mod = (id, label) => ({ id, label });

  it("ADICIONAR_MODULO anexa à lista do nó certo", () => {
    const e = r(base, { tipo: "ADICIONAR_MODULO", noId: "n1", modulo: mod("m1", "Autenticação") });
    expect(e.nodes.find(n => n.id === "n1").modules).toEqual([{ id: "m1", label: "Autenticação" }]);
    expect(e.nodes.find(n => n.id === "n2").modules).toBeUndefined();
  });

  it("ADICIONAR_MODULO para um nó inexistente → no-op", () => {
    expect(r(base, { tipo: "ADICIONAR_MODULO", noId: "xxx", modulo: mod("m1", "x") })).toBe(base);
  });

  it("EDITAR_MODULO faz merge de label/kind/nota e nunca toca em id nem filho", () => {
    let e = r(base, { tipo: "ADICIONAR_MODULO", noId: "n1", modulo: { id: "m1", label: "A", filho: null } });
    e = r(e, { tipo: "EDITAR_MODULO", noId: "n1", moduloId: "m1", patch: { label: "B", kind: "função", id: "HACK", filho: { nodes: [] } } });
    const m = e.nodes.find(n => n.id === "n1").modules[0];
    expect(m).toEqual({ id: "m1", label: "B", kind: "função", filho: null });
  });

  it("REMOVER_MODULO tira só o módulo indicado", () => {
    let e = r(base, { tipo: "ADICIONAR_MODULO", noId: "n1", modulo: mod("m1", "A") });
    e = r(e, { tipo: "ADICIONAR_MODULO", noId: "n1", modulo: mod("m2", "B") });
    e = r(e, { tipo: "REMOVER_MODULO", noId: "n1", moduloId: "m1" });
    expect(e.nodes.find(n => n.id === "n1").modules.map(m => m.id)).toEqual(["m2"]);
  });

  it("MOVER_MODULO troca com o vizinho; nos limites é no-op", () => {
    let e = r(base, { tipo: "ADICIONAR_MODULO", noId: "n1", modulo: mod("m1", "A") });
    e = r(e, { tipo: "ADICIONAR_MODULO", noId: "n1", modulo: mod("m2", "B") });
    e = r(e, { tipo: "ADICIONAR_MODULO", noId: "n1", modulo: mod("m3", "C") });
    const desce = r(e, { tipo: "MOVER_MODULO", noId: "n1", moduloId: "m1", direccao: 1 });
    expect(desce.nodes.find(n => n.id === "n1").modules.map(m => m.id)).toEqual(["m2", "m1", "m3"]);
    const foraDeCima = r(e, { tipo: "MOVER_MODULO", noId: "n1", moduloId: "m1", direccao: -1 });
    expect(foraDeCima).toBe(e);
    const foraDeBaixo = r(e, { tipo: "MOVER_MODULO", noId: "n1", moduloId: "m3", direccao: 1 });
    expect(foraDeBaixo).toBe(e);
  });

  it("REMOVER_NO leva os módulos do nó com ele", () => {
    let e = r(base, { tipo: "ADICIONAR_MODULO", noId: "n1", modulo: mod("m1", "A") });
    e = r(e, { tipo: "REMOVER_NO", id: "n1" });
    expect(e.nodes.map(n => n.id)).toEqual(["n2"]);
  });

  it("os módulos sobrevivem a snapshot → CARREGAR_PROJETO (andam no nó)", () => {
    const e = r(base, { tipo: "ADICIONAR_MODULO", noId: "n1", modulo: mod("m1", "A") });
    const recarregado = r(estadoInicial, { tipo: "CARREGAR_PROJETO", projeto: snapshot(e) });
    expect(recarregado.nodes.find(n => n.id === "n1").modules).toEqual([{ id: "m1", label: "A" }]);
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

  it("ALTERNAR_TRAVA_FORMA + forma trancada: MOVER / REDIMENSIONAR / REMOVER são no-op", () => {
    let e = r(estadoInicial, { tipo: "ADICIONAR_FORMA", forma: f });
    e = r(e, { tipo: "ALTERNAR_TRAVA_FORMA", id: "s1" });
    expect(e.shapes[0].locked).toBe(true);
    expect(r(e, { tipo: "MOVER_FORMA", id: "s1", x: 99, y: 99 })).toBe(e);
    expect(r(e, { tipo: "REDIMENSIONAR_FORMA", id: "s1", x: 1, y: 1, w: 9, h: 9 })).toBe(e);
    expect(r(e, { tipo: "REMOVER_FORMA", id: "s1" })).toBe(e);
    e = r(e, { tipo: "ALTERNAR_TRAVA_FORMA", id: "s1" });
    expect(e.shapes[0].locked).toBe(false);
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

  it("DEFINIR_COR_ANOTACAO guarda a cor na anotação", () => {
    let e = r(estadoInicial, { tipo: "ADICIONAR_ANOTACAO", anotacao: a });
    e = r(e, { tipo: "DEFINIR_COR_ANOTACAO", id: "a1", cor: "sky" });
    expect(e.annotations[0].cor).toBe("sky");
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

  it("ALTERNAR_BLOQUEIO_FUNDO liga e desliga a trava", () => {
    let e = r(estadoInicial, { tipo: "ALTERNAR_BLOQUEIO_FUNDO" });
    expect(e.bgLocked).toBe(true);
    e = r(e, { tipo: "ALTERNAR_BLOQUEIO_FUNDO" });
    expect(e.bgLocked).toBe(false);
  });

  it("trancado: DEFINIR_FUNDO com img=null (remover) é no-op", () => {
    const trancado = { ...estadoInicial, bgImage: "data:x", bgLocked: true };
    expect(r(trancado, { tipo: "DEFINIR_FUNDO", img: null })).toBe(trancado);
  });

  it("trancado: substituir por outra imagem também é bloqueado (trancar = fechar)", () => {
    const trancado = { ...estadoInicial, bgImage: "data:x", bgLocked: true };
    expect(r(trancado, { tipo: "DEFINIR_FUNDO", img: "data:y" })).toBe(trancado);
  });

  it("destrancado: já se pode substituir a imagem", () => {
    const livre = { ...estadoInicial, bgImage: "data:x", bgLocked: false };
    expect(r(livre, { tipo: "DEFINIR_FUNDO", img: "data:y" }).bgImage).toBe("data:y");
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

  it("RESETAR com o fundo trancado poupa a imagem (esboço-guia sobrevive ao reset)", () => {
    const e = r({ ...cheio, bgLocked: true }, { tipo: "RESETAR" });
    expect(e.nodes).toEqual([]);
    expect(e.bgImage).toBe("x");
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

describe("contentores (DEC-018)", () => {
  const c = (id, x, y, w, h, extra = {}) => ({ id, x, y, w, h, label: "Grupo", cor: "#16A34A", estilo: "continuo", ...extra });

  it("ADICIONAR / REDIMENSIONAR / REMOVER_CONTENTOR", () => {
    let e = r(estadoInicial, { tipo: "ADICIONAR_CONTENTOR", contentor: c("k1", 0, 0, 100, 100) });
    expect(e.containers).toHaveLength(1);
    e = r(e, { tipo: "REDIMENSIONAR_CONTENTOR", id: "k1", x: 5, y: 6, w: 200, h: 150 });
    expect(e.containers[0]).toMatchObject({ x: 5, y: 6, w: 200, h: 150 });
    e = r(e, { tipo: "REMOVER_CONTENTOR", id: "k1" });
    expect(e.containers).toEqual([]);
  });

  it("MOVER_CONTENTOR leva o conteúdo enviado em `levar`, e só esse", () => {
    const e0 = {
      ...comNos(no("n1", "L1", 50, 50), no("n2", "L2", 500, 500)),
      containers: [c("k1", 0, 0, 200, 200), c("k2", 10, 10, 80, 80)],
      annotations: [{ id: "a1", x: 60, y: 60, text: "" }],
    };
    const e = r(e0, {
      tipo: "MOVER_CONTENTOR", id: "k1", x: 100, y: 0,
      levar: { nodes: [{ id: "n1", x: 150, y: 50 }], containers: [{ id: "k2", x: 110, y: 10 }], annotations: [{ id: "a1", x: 160, y: 60 }] },
    });
    expect(e.containers.find(k => k.id === "k1")).toMatchObject({ x: 100, y: 0 });
    expect(e.containers.find(k => k.id === "k2")).toMatchObject({ x: 110, y: 10 });
    expect(e.nodes.find(n => n.id === "n1")).toMatchObject({ x: 150, y: 50 });
    expect(e.nodes.find(n => n.id === "n2")).toMatchObject({ x: 500, y: 500 }); // fora: não se mexe
    expect(e.annotations[0]).toMatchObject({ x: 160, y: 60 });
  });

  it("MOVER_CONTENTOR não arrasta um nó trancado que esteja lá dentro", () => {
    const e0 = { ...comNos({ ...no("n1", "L1", 50, 50), locked: true }), containers: [c("k1", 0, 0, 200, 200)] };
    const e = r(e0, { tipo: "MOVER_CONTENTOR", id: "k1", x: 100, y: 0, levar: { nodes: [{ id: "n1", x: 150, y: 50 }] } });
    expect(e.nodes[0]).toMatchObject({ x: 50, y: 50 });
    expect(e.containers[0]).toMatchObject({ x: 100 });
  });

  it("EDITAR_CONTENTOR muda rótulo/cor/estilo e nunca a geometria", () => {
    let e = { ...estadoInicial, containers: [c("k1", 0, 0, 100, 100)] };
    e = r(e, { tipo: "EDITAR_CONTENTOR", id: "k1", patch: { label: "VPC", estilo: "tracejado", x: 999, w: 1 } });
    expect(e.containers[0]).toMatchObject({ label: "VPC", estilo: "tracejado", cor: "#16A34A", x: 0, w: 100 });
  });

  it("contentor trancado: MOVER / REDIMENSIONAR / REMOVER são no-op", () => {
    let e = { ...estadoInicial, containers: [c("k1", 0, 0, 100, 100)] };
    e = r(e, { tipo: "ALTERNAR_TRAVA_CONTENTOR", id: "k1" });
    expect(e.containers[0].locked).toBe(true);
    expect(r(e, { tipo: "MOVER_CONTENTOR", id: "k1", x: 9, y: 9 })).toBe(e);
    expect(r(e, { tipo: "REDIMENSIONAR_CONTENTOR", id: "k1", x: 0, y: 0, w: 9, h: 9 })).toBe(e);
    expect(r(e, { tipo: "REMOVER_CONTENTOR", id: "k1" })).toBe(e);
  });

  it("remover o contentor não apaga o que estava lá dentro", () => {
    const e = r({ ...comNos(no("n1", "L1", 50, 50)), containers: [c("k1", 0, 0, 200, 200)] }, { tipo: "REMOVER_CONTENTOR", id: "k1" });
    expect(e.nodes).toHaveLength(1);
  });

  it("CARREGAR_PROJETO de um JSON antigo (sem containers) → lista vazia; RESETAR limpa", () => {
    let e = r(estadoInicial, { tipo: "CARREGAR_PROJETO", projeto: { nodes: [] } });
    expect(e.containers).toEqual([]);
    e = r({ ...e, containers: [c("k1", 0, 0, 100, 100)] }, { tipo: "RESETAR" });
    expect(e.containers).toEqual([]);
  });
});
