// Geometria pura das ligações — partilhada pelo canvas (Ligacao.jsx) e pela exportação SVG/PNG.

/** Metade do lado do quadrado de um nó (os nós são 40×40 centrados no seu x,y). */
export const MEIO_NO = 20;

/**
 * Apara uma linha centro→centro para começar e acabar na BORDA dos nós (+ folga).
 * Sem isto a seta (marker-end) fica desenhada dentro do quadrado de destino e o
 * nó tapa-a — não se vê o sentido da ligação, que é justamente o que o ARCK valida.
 * Nós demasiado próximos (sobrepostos): devolve centro a centro, sem inverter a linha.
 */
export function aparaNaBorda(origem, destino, folga = 4) {
  const dx = destino.x - origem.x, dy = destino.y - origem.y;
  const maior = Math.max(Math.abs(dx), Math.abs(dy));
  const recuo = MEIO_NO + folga;
  if (maior <= 2 * recuo) return { x1: origem.x, y1: origem.y, x2: destino.x, y2: destino.y };
  // no quadrado, a borda está a MEIO_NO do centro ao longo do eixo dominante
  const kx = (dx / maior) * recuo, ky = (dy / maior) * recuo;
  return { x1: origem.x + kx, y1: origem.y + ky, x2: destino.x - kx, y2: destino.y - ky };
}
