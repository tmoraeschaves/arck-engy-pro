import { useEffect } from "react";

/**
 * ATALHOS GLOBAIS (L2 · aplicação) — teclado + o fim de qualquer arrasto (mouseup)
 * + o início do corte (mousedown). Ouve a `window`, não o canvas, porque o
 * utilizador pode largar o rato fora da área do desenho.
 *
 * Recebe o que precisa de ler e as acções que despacha — não decide nada sozinho
 * que não estivesse já no App.
 */
export function useAtalhos({
  cutMode, cutStart, cutEnd, selectedNode, selectedShapeId, zoom, offset, canvasRef,
  cutConnections, removeNode, dispatch,
  setDraggingNode, setIsPanning, setDraggingShape, setResizingShape, setDraggingLib,
  setDraggingRot, setDragging3DPanel, setCutMode, setCutStart, setCutEnd,
  setSelectedNode, setSelectedShapeId, setAnnotationMode, setEditingAnnotId,
  setPlacingShapeType, setShowShapePicker, setAllSelected, setIs3D, setZoom, setOffset,
}) {
  useEffect(() => {
    const onUp = () => {
      if (cutMode && cutStart && cutEnd) cutConnections(cutStart, cutEnd);
      setDraggingNode(null); setIsPanning(false); setDraggingShape(null);
      setResizingShape(null); setDraggingLib(null);
      setDraggingRot(null); setDragging3DPanel(null);
      setCutMode(false); setCutStart(null); setCutEnd(null);
    };
    const onKey = (e) => {
      // a escrever num campo (nota, nome do modelo, etc.) — os atalhos globais não se aplicam,
      // senão "c", "0", Delete… são engolidos a meio da frase em vez de escritos (RL de fronteira)
      const alvo = e.target;
      if (alvo && (alvo.tagName==="INPUT" || alvo.tagName==="TEXTAREA" || alvo.isContentEditable)) return;
      if (e.key==="Escape") { setSelectedNode(null); setCutMode(false); setAnnotationMode(false); setEditingAnnotId(null); setPlacingShapeType(null); setShowShapePicker(false); setAllSelected(false); setIs3D(false); }
      if (e.key==="a" && e.ctrlKey) { e.preventDefault(); setAllSelected(p=>!p); setSelectedNode(null); }
      if (e.key==="Delete") {
        // nó trancado: o reducer recusa REMOVER_NO — a tecla não faz nada
        if (selectedNode) removeNode(selectedNode.id);
        if (selectedShapeId) { dispatch({ tipo:"REMOVER_FORMA", id:selectedShapeId }); setSelectedShapeId(null); }
      }
      if (e.key==="c" && !e.ctrlKey) { e.preventDefault(); setCutMode(true); }
      if (e.key==="+"||e.key==="=") setZoom(p=>Math.min(p+0.1,3));
      if (e.key==="-") setZoom(p=>Math.max(p-0.1,0.2));
      if (e.key==="0") { setZoom(1); setOffset({x:0,y:0}); }
    };
    const onDown = (e) => {
      if (cutMode && !cutStart && canvasRef.current) {
        const r = canvasRef.current.getBoundingClientRect();
        const p = { x:(e.clientX-r.left-offset.x)/zoom, y:(e.clientY-r.top-offset.y)/zoom };
        setCutStart(p); setCutEnd(p);
      }
    };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => { window.removeEventListener("mouseup",onUp); window.removeEventListener("keydown",onKey); window.removeEventListener("mousedown",onDown); };
  }, [cutMode, cutStart, cutEnd, selectedNode, selectedShapeId, zoom, offset]);
}
