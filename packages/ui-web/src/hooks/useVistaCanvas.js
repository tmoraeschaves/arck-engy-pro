/**
 * VISTA DO CANVAS (L2 · aplicação) — a "câmara": zoom, deslocamento (pan) e rotação 3D.
 * Estado de vista, independente do documento. Não conhece nós nem ligações a não ser
 * para calcular o pivô 3D (centro do desenho).
 */
import { useState, useMemo, useCallback } from "react";

const CHATO = 1; // graus abaixo dos quais uma rotação conta como "sem inclinação"
const semInclinacao = (x, y, z) =>
  Math.abs(x) < CHATO && Math.abs(y) < CHATO && Math.abs(z) < CHATO;

export function useVistaCanvas(nodes) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);
  const [draggingRot, setDraggingRot] = useState(null);        // {sx,sy,rx,ry}
  const [show3DPanel, setShow3DPanel] = useState(false);
  const [panel3DPos, setPanel3DPos] = useState({ x: 400, y: 70 });
  const [dragging3DPanel, setDragging3DPanel] = useState(null);

  // `is3D` NÃO é um modo que se liga/desliga — é derivado: a vista está em 3D
  // quando está inclinada. Assim nunca existe o estado invisível "3D activo mas à
  // vista igual ao 2D", que bloqueava toda a edição (notas, arrasto, snap) sem o
  // utilizador perceber porquê.
  const is3D = !semInclinacao(rotX, rotY, rotZ);

  // Shim com a forma de um setState booleano para os sítios que pensam em "ligar/
  // desligar o 3D" (botão do painel, Escape, "voltar a editar"): ligar dá uma
  // inclinação inicial visível; desligar volta a 0°.
  const setIs3D = useCallback((valor) => {
    const ligar = typeof valor === "function" ? valor(!semInclinacao(rotX, rotY, rotZ)) : valor;
    if (ligar) {
      if (semInclinacao(rotX, rotY, rotZ)) { setRotX(15); setRotY(-25); }
    } else {
      setRotX(0); setRotY(0); setRotZ(0);
    }
  }, [rotX, rotY, rotZ]);

  // Pivô do mundo 3D: centro do desenho em coordenadas de ecrã (para a inclinação
  // girar à volta da estrutura, não do centro da janela).
  const centro3D = useMemo(() => {
    if (!nodes.length) return "center center";
    const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    return `${cx * zoom + offset.x}px ${cy * zoom + offset.y}px`;
  }, [nodes, zoom, offset]);

  return {
    zoom, setZoom, offset, setOffset, isPanning, setIsPanning, panStart, setPanStart,
    is3D, setIs3D, rotX, setRotX, rotY, setRotY, rotZ, setRotZ,
    draggingRot, setDraggingRot, show3DPanel, setShow3DPanel,
    panel3DPos, setPanel3DPos, dragging3DPanel, setDragging3DPanel,
    centro3D,
  };
}
