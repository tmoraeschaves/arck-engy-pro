import { Lock, Unlock } from "lucide-react";
import { ShapeElements } from "./FormasSVG.jsx";

// Uma forma geométrica colocada no canvas — com alças de redimensionar quando seleccionada.
// `forma.locked` trava a forma: não se move, não se redimensiona, não se apaga (guarda dura
// no reducer). O cadeado aparece quando seleccionada ou trancada — clicar alterna a trava.
// `paraCanvas(clientX, clientY)` converte coordenadas de ecrã para coordenadas do canvas.
export function Forma({ forma, definicao, seleccionada, paraCanvas, onSeleccionar, onIniciarArrasto, onIniciarRedimensionar, onAlternarTrava, onRemover }) {
  const trancada = !!forma.locked;
  const corners = seleccionada && !trancada ? [
    { id: "tl", cx: forma.x, cy: forma.y, cursor: "nw-resize" },
    { id: "tr", cx: forma.x + forma.w, cy: forma.y, cursor: "ne-resize" },
    { id: "bl", cx: forma.x, cy: forma.y + forma.h, cursor: "sw-resize" },
    { id: "br", cx: forma.x + forma.w, cy: forma.y + forma.h, cursor: "se-resize" },
  ] : [];

  return (
    <g>
      {/* contorno: forte quando seleccionada; ténue e âmbar quando só trancada —
          para o cadeado ter sempre uma caixa a que se agarrar (a forma pode ser um
          wireframe que não preenche a bounding box) */}
      {seleccionada
        ? <rect x={forma.x - 3} y={forma.y - 3} width={forma.w + 6} height={forma.h + 6} fill="none" stroke={trancada ? "#F59E0B" : "#60A5FA"} strokeWidth="1" strokeDasharray="4,3" opacity="0.6" rx="4" style={{ pointerEvents: "none" }} />
        : trancada && <rect x={forma.x - 3} y={forma.y - 3} width={forma.w + 6} height={forma.h + 6} fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3,4" opacity="0.35" rx="4" style={{ pointerEvents: "none" }} />}
      <g data-testid="forma" data-forma-id={forma.id}
        onMouseDown={e => {
          e.stopPropagation();
          onSeleccionar(forma.id);
          if (trancada) return;
          const { x: cx2, y: cy2 } = paraCanvas(e.clientX, e.clientY);
          onIniciarArrasto({ id: forma.id, ox: cx2 - forma.x, oy: cy2 - forma.y });
        }}
        onContextMenu={e => { e.preventDefault(); if (!trancada) onRemover(forma.id); }}
        style={{ cursor: trancada ? "default" : "move", pointerEvents: "all" }}>
        <ShapeElements shape={definicao} x={forma.x} y={forma.y} w={forma.w} h={forma.h} selected={seleccionada} />
      </g>

      {corners.map(c => (
        <rect key={c.id} data-testid="alca" x={c.cx - 5} y={c.cy - 5} width={10} height={10} fill="white" stroke="#60A5FA" strokeWidth="1.5" rx="2"
          style={{ cursor: c.cursor, pointerEvents: "all" }}
          onMouseDown={e => {
            e.stopPropagation();
            onIniciarRedimensionar({ id: forma.id, corner: c.id, ox: forma.x, oy: forma.y, ow: forma.w, oh: forma.h, mx: e.clientX, my: e.clientY });
          }} />
      ))}

      {(trancada || seleccionada) && (
        <g data-testid="trava-forma" transform={`translate(${forma.x - 4},${forma.y - 4})`} style={{ cursor: "pointer" }}
          onMouseDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onAlternarTrava?.(forma.id); }}>
          <title>{trancada ? "Destrancar forma" : "Trancar forma (não move, não redimensiona, não apaga)"}</title>
          <circle r={8} fill="white" stroke={trancada ? "#F59E0B" : "#60A5FA"} strokeWidth={1.5} />
          <g transform="translate(-6,-6)" style={{ pointerEvents: "none" }}>
            {trancada ? <Lock size={12} color="#F59E0B" /> : <Unlock size={12} color="#60A5FA" />}
          </g>
        </g>
      )}
    </g>
  );
}
