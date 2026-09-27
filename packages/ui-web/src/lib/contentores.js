/**
 * CONTENTORES (L2 · funções puras) — geometria dos contentores de agrupamento (DEC-018).
 *
 * O que está "dentro" de um contentor é decidido pela geometria no momento, nunca guardado
 * no modelo (DEC-005): arrastar a caixa da VPC leva o que lá está desenhado, mas o nó não
 * passa a pertencer a nada — tirá-lo de lá é só arrastá-lo para fora.
 */
import { TAMANHO_MINIMO_CONTENTOR, TAMANHO_PADRAO_CONTENTOR } from "../config/contentores.js";

const contem = (c, x, y) => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h;
const contemRect = (c, r) => contem(c, r.x, r.y) && contem(c, r.x + r.w, r.y + r.h);

/**
 * O que está dentro do contentor `c` agora: nós e notas pelo ponto de ancoragem, formas e
 * outros contentores só se couberem inteiros (um contentor que só se cruza com outro não é
 * filho dele). Devolve as posições actuais — o ponto de partida do arrasto.
 */
export function conteudoDe(c, { nodes = [], containers = [], shapes = [], annotations = [] }) {
  const pos = ({ id, x, y }) => ({ id, x, y });
  return {
    nodes: nodes.filter(n => contem(c, n.x, n.y)).map(pos),
    containers: containers.filter(o => o.id !== c.id && contemRect(c, o)).map(pos),
    shapes: shapes.filter(s => contemRect(c, s)).map(pos),
    annotations: annotations.filter(a => contem(c, a.x, a.y)).map(pos),
  };
}

/** Desloca todo o conteúdo capturado por (dx, dy) a partir das posições de partida. */
export function deslocarConteudo(conteudo, dx, dy) {
  const mover = lista => lista.map(({ id, x, y }) => ({ id, x: x + dx, y: y + dy }));
  return {
    nodes: mover(conteudo.nodes),
    containers: mover(conteudo.containers),
    shapes: mover(conteudo.shapes),
    annotations: mover(conteudo.annotations),
  };
}

/**
 * Rectângulo desenhado entre dois cantos (em qualquer direcção). Um arrasto demasiado
 * pequeno para ser intencional vira uma caixa de tamanho padrão centrada no clique.
 */
export function rectDoDesenho({ x0, y0, x1, y1 }) {
  const w = Math.abs(x1 - x0), h = Math.abs(y1 - y0);
  if (w < TAMANHO_MINIMO_CONTENTOR || h < TAMANHO_MINIMO_CONTENTOR) {
    const { w: pw, h: ph } = TAMANHO_PADRAO_CONTENTOR;
    return { x: x0 - pw / 2, y: y0 - ph / 2, w: pw, h: ph };
  }
  return { x: Math.min(x0, x1), y: Math.min(y0, y1), w, h };
}

/**
 * Novo rectângulo ao arrastar um canto (`tl`/`tr`/`bl`/`br`) por (dx, dy), com lado mínimo.
 * O canto oposto fica parado, também quando o mínimo trava o encolher.
 */
export function redimensionarRect({ ox, oy, ow, oh, corner }, dx, dy, minimo) {
  let x = ox, y = oy, w = ow, h = oh;
  if (corner.includes("r")) w = Math.max(minimo, ow + dx);
  if (corner.includes("b")) h = Math.max(minimo, oh + dy);
  if (corner.includes("l")) { w = Math.max(minimo, ow - dx); x = ox + ow - w; }
  if (corner.includes("t")) { h = Math.max(minimo, oh - dy); y = oy + oh - h; }
  return { x, y, w, h };
}

/** Ordem de desenho: os maiores primeiro, para um contentor aninhado ficar por cima do pai. */
export const porAreaDecrescente = containers =>
  [...containers].sort((a, b) => b.w * b.h - a.w * a.h);
