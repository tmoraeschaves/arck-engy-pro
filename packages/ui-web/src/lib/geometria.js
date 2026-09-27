// Geometria pura das ligações — partilhada pelo canvas (Ligacao.jsx) e pela exportação SVG/PNG.

/** Metade do lado do quadrado de um nó (os nós são 40×40 centrados no seu x,y). */
export const MEIO_NO = 20;
/** Altura do rótulo em CAIXA ALTA por baixo do nó — a borda de baixo conta com ele. */
export const ROTULO = 14;

// Distância do centro do nó até à borda da "caixa" nó+rótulo, na direcção (ux,uy) unitária.
function ateABorda(ux, uy) {
  const baixo = uy > 0 ? MEIO_NO + ROTULO : MEIO_NO;
  const tx = ux !== 0 ? MEIO_NO / Math.abs(ux) : Infinity;
  const ty = uy !== 0 ? baixo / Math.abs(uy) : Infinity;
  return Math.min(tx, ty);
}

/**
 * Apara uma linha centro→centro para começar e acabar na BORDA dos nós (+ folga).
 * Sem isto a seta (marker-end) fica desenhada dentro do quadrado de destino e o
 * nó tapa-a — não se vê o sentido da ligação, que é justamente o que o ARCK valida.
 * A borda de baixo inclui o rótulo, para a linha não o riscar.
 * Nós demasiado próximos (sobrepostos): devolve centro a centro, sem inverter a linha.
 */
export function aparaNaBorda(origem, destino, folga = 4) {
  const dx = destino.x - origem.x, dy = destino.y - origem.y;
  const dist = Math.hypot(dx, dy);
  if (!dist) return { x1: origem.x, y1: origem.y, x2: destino.x, y2: destino.y };
  const ux = dx / dist, uy = dy / dist;
  const inicio = ateABorda(ux, uy) + folga;     // sai da origem na direcção do destino
  const fim = ateABorda(-ux, -uy) + folga;      // entra no destino vindo da origem
  if (inicio + fim >= dist) return { x1: origem.x, y1: origem.y, x2: destino.x, y2: destino.y };
  return {
    x1: origem.x + ux * inicio, y1: origem.y + uy * inicio,
    x2: destino.x - ux * fim,   y2: destino.y - uy * fim,
  };
}
