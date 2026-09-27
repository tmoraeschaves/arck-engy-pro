/**
 * lib/contentores — geometria dos contentores de agrupamento (DEC-018).
 */
import { describe, it, expect } from "vitest";
import { conteudoDe, deslocarConteudo, rectDoDesenho, redimensionarRect, porAreaDecrescente } from "../src/lib/contentores.js";
import { TAMANHO_PADRAO_CONTENTOR } from "../src/config/contentores.js";

// A VPC-padrão da AWS: Região ⊃ VPC ⊃ AZ ⊃ sub-rede ⊃ EC2
const regiao = { id: "regiao", x: 0, y: 0, w: 1000, h: 800 };
const vpc = { id: "vpc", x: 50, y: 50, w: 900, h: 700 };
const az1 = { id: "az1", x: 100, y: 100, w: 400, h: 300 };
const vizinho = { id: "viz", x: 900, y: 700, w: 300, h: 300 }; // cruza a VPC, não cabe nela
const doc = {
  containers: [regiao, vpc, az1, vizinho],
  nodes: [{ id: "ec2", x: 200, y: 200 }, { id: "internet", x: -100, y: 200 }],
  shapes: [{ id: "cubo", x: 120, y: 120, w: 40, h: 40 }, { id: "grande", x: 400, y: 300, w: 300, h: 300 }],
  annotations: [{ id: "nota", x: 300, y: 350 }],
};

describe("conteudoDe", () => {
  it("apanha nós e notas pelo ponto, formas e contentores só se couberem inteiros", () => {
    const c = conteudoDe(az1, doc);
    expect(c.nodes.map(n => n.id)).toEqual(["ec2"]);
    expect(c.shapes.map(s => s.id)).toEqual(["cubo"]);
    expect(c.annotations.map(a => a.id)).toEqual(["nota"]);
    expect(c.containers).toEqual([]);
  });

  it("aninhamento: a VPC leva a AZ inteira e o que ela tem; um contentor que só se cruza fica", () => {
    const c = conteudoDe(vpc, doc);
    expect(c.containers.map(k => k.id)).toEqual(["az1"]);
    expect(c.nodes.map(n => n.id)).toEqual(["ec2"]);
    expect(c.containers.map(k => k.id)).not.toContain("viz");
    expect(c.containers.map(k => k.id)).not.toContain("vpc"); // nunca contém a si próprio
  });

  it("devolve as posições de partida e desloca-as por (dx, dy)", () => {
    const d = deslocarConteudo(conteudoDe(az1, doc), 10, -5);
    expect(d.nodes).toEqual([{ id: "ec2", x: 210, y: 195 }]);
    expect(d.shapes).toEqual([{ id: "cubo", x: 130, y: 115 }]);
  });
});

describe("rectDoDesenho", () => {
  it("normaliza um arrasto em qualquer direcção", () => {
    expect(rectDoDesenho({ x0: 300, y0: 250, x1: 100, y1: 50 })).toEqual({ x: 100, y: 50, w: 200, h: 200 });
  });
  it("um clique (ou arrasto minúsculo) dá a caixa padrão centrada no clique", () => {
    const { w, h } = TAMANHO_PADRAO_CONTENTOR;
    expect(rectDoDesenho({ x0: 500, y0: 400, x1: 505, y1: 402 })).toEqual({ x: 500 - w / 2, y: 400 - h / 2, w, h });
  });
});

describe("redimensionarRect", () => {
  const base = { ox: 100, oy: 100, ow: 200, oh: 100 };
  it("canto inferior direito cresce", () => {
    expect(redimensionarRect({ ...base, corner: "br" }, 50, 20, 40)).toEqual({ x: 100, y: 100, w: 250, h: 120 });
  });
  it("canto superior esquerdo: o canto oposto não se mexe, mesmo travado pelo mínimo", () => {
    const r = redimensionarRect({ ...base, corner: "tl" }, 500, 500, 40);
    expect(r).toEqual({ x: 260, y: 160, w: 40, h: 40 });
    expect(r.x + r.w).toBe(300); // borda direita original
    expect(r.y + r.h).toBe(200); // borda de baixo original
  });
});

describe("porAreaDecrescente", () => {
  it("desenha o pai antes do filho, sem mexer no original", () => {
    const lista = [az1, regiao, vpc];
    expect(porAreaDecrescente(lista).map(c => c.id)).toEqual(["regiao", "vpc", "az1"]);
    expect(lista[0]).toBe(az1);
  });
});
