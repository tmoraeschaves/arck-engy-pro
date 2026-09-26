import { useCallback, useState } from "react";
import { GRID_SIZE, LIMITE_3D } from "../config/app-meta.js";

/**
 * ARRASTOS (L2 · aplicação) — o estado efémero de "o que está a ser arrastado agora"
 * e o único onMouseMove que o interpreta. Prioridade: painel 3D → rotação 3D →
 * (vista 3D bloqueia o resto) → biblioteca → redimensionar forma → nó → forma →
 * pan → linha de corte. O fim de qualquer arrasto (mouseup) está no useAtalhos.
 *
 * `vista` é o que useVistaCanvas devolve; `corte` = { cutMode, cutStart, setCutEnd }.
 */
export function useArrastos({ vista, corte, snapToGrid, canvasRef, dispatch }) {
  const [draggingNode, setDraggingNode] = useState(null);
  const [draggingShape, setDraggingShape] = useState(null);
  const [resizingShape, setResizingShape] = useState(null); // {id, corner, ox,oy,ow,oh, mx,my}
  const [libPos, setLibPos] = useState({ x: 860, y: 70 });
  const [draggingLib, setDraggingLib] = useState(null);     // {sx,sy,ox,oy}

  const {
    zoom, offset, setOffset, isPanning, panStart, setPanStart, is3D,
    draggingRot, setRotX, setRotY, dragging3DPanel, setPanel3DPos,
  } = vista;
  const { cutMode, cutStart, setCutEnd } = corte;

  const onMouseMove = useCallback((e) => {
    if (dragging3DPanel) {
      setPanel3DPos({ x: dragging3DPanel.ox + e.clientX - dragging3DPanel.sx, y: dragging3DPanel.oy + e.clientY - dragging3DPanel.sy });
      return;
    }
    // rotação 3D (botão direito) — limitada a ±LIMITE_3D para nunca ficar de perfil
    if (draggingRot) {
      const lim = v => Math.max(-LIMITE_3D, Math.min(LIMITE_3D, v));
      setRotY(lim(draggingRot.ry + (e.clientX - draggingRot.sx) * 0.4));
      setRotX(lim(draggingRot.rx + (e.clientY - draggingRot.sy) * 0.4));
      return;
    }
    if (is3D) return; // em vista 3D não se edita
    if (draggingLib) {
      setLibPos({ x: draggingLib.ox + e.clientX - draggingLib.sx, y: draggingLib.oy + e.clientY - draggingLib.sy });
      return;
    }
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left - offset.x) / zoom;
    const cy = (e.clientY - rect.top - offset.y) / zoom;

    if (resizingShape) {
      const dx = (e.clientX - resizingShape.mx) / zoom;
      const dy = (e.clientY - resizingShape.my) / zoom;
      let { ox: x, oy: y, ow: w, oh: h } = resizingShape;
      if (resizingShape.corner.includes("r")) w = Math.max(40, resizingShape.ow + dx);
      if (resizingShape.corner.includes("b")) h = Math.max(40, resizingShape.oh + dy);
      if (resizingShape.corner.includes("l")) { x = resizingShape.ox + dx; w = Math.max(40, resizingShape.ow - dx); }
      if (resizingShape.corner.includes("t")) { y = resizingShape.oy + dy; h = Math.max(40, resizingShape.oh - dy); }
      dispatch({ tipo: "REDIMENSIONAR_FORMA", id: resizingShape.id, x, y, w, h });
      return;
    }
    if (draggingNode) {
      let x = cx, y = cy;
      if (snapToGrid) { x = Math.round(x/GRID_SIZE)*GRID_SIZE; y = Math.round(y/GRID_SIZE)*GRID_SIZE; }
      dispatch({ tipo: "MOVER_NO", id: draggingNode.id, x, y });
      return;
    }
    if (draggingShape) {
      dispatch({ tipo: "MOVER_FORMA", id: draggingShape.id, x: cx - draggingShape.ox, y: cy - draggingShape.oy });
      return;
    }
    if (isPanning) {
      setOffset(p => ({ x:p.x+e.clientX-panStart.x, y:p.y+e.clientY-panStart.y }));
      setPanStart({ x:e.clientX, y:e.clientY });
      return;
    }
    if (cutMode && cutStart) setCutEnd({ x:cx, y:cy });
  }, [dragging3DPanel, draggingRot, is3D, draggingLib, resizingShape, draggingNode, draggingShape,
      isPanning, panStart, cutMode, cutStart, zoom, offset, snapToGrid, canvasRef, dispatch,
      setPanel3DPos, setRotX, setRotY, setOffset, setPanStart, setCutEnd]);

  return {
    onMouseMove,
    setDraggingNode, setDraggingShape, setResizingShape,
    libPos, setDraggingLib,
  };
}
