import { Lock, Unlock } from "lucide-react";
import { IconeCamada } from "./IconeCamada.jsx";

// Um nó do diagrama — bloco de camada com ícone e rótulo.
// `node.locked` trava o nó: não se move nem se apaga (a guarda dura vive no reducer).
// O cadeado aparece quando o nó está trancado ou seleccionado — clicar alterna a trava.
export function No({
  node, sector, cor, seleccionado, todosSeleccionados, mostrarRotulo, rotulo,
  onIniciarArrasto, onClicar, onRemover, onAbrir, onAlternarTrava,
}) {
  const numModulos = node.modules?.length || 0;
  const trancado = !!node.locked;
  return (
    <g data-testid="no" data-no-id={node.id} transform={`translate(${node.x - 20},${node.y - 20})`}
      style={{ cursor: trancado ? "default" : "move", pointerEvents: "all" }}
      onMouseDown={e => { if (!trancado) { e.stopPropagation(); onIniciarArrasto(node); } }}
      onClick={e => { e.stopPropagation(); onClicar(node.id); }}
      onDoubleClick={e => { e.stopPropagation(); onAbrir?.(node); }}
      onContextMenu={e => { e.preventDefault(); if (!trancado) onRemover(node.id); }}>
      <rect width={40} height={40} rx={8} fill={seleccionado ? "white" : cor}
        stroke={seleccionado || todosSeleccionados ? cor : "transparent"} strokeWidth={seleccionado ? 2.5 : todosSeleccionados ? 1.5 : 0}
        style={{ filter: seleccionado ? `drop-shadow(0 0 8px ${cor}80)` : todosSeleccionados ? `drop-shadow(0 0 4px ${cor}60)` : `drop-shadow(0 2px 4px rgba(0,0,0,.3))` }} />
      <g transform="translate(11,11)" style={{ pointerEvents: "none" }}>
        <IconeCamada sector={sector} camada={node.layer} size={18} color={seleccionado ? cor : "white"} />
      </g>
      {mostrarRotulo && <text x={20} y={52} textAnchor="middle" fontSize={7.5} fontWeight="600" fill={cor} style={{ pointerEvents: "none", fontFamily: "system-ui" }}>{rotulo}</text>}

      {numModulos > 0 && (
        <g transform="translate(34,-6)" style={{ pointerEvents: "none" }}>
          <circle r={7} fill="white" stroke={cor} strokeWidth={1.5} />
          <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontSize={8} fontWeight="700" fill={cor} style={{ fontFamily: "system-ui" }}>{numModulos}</text>
        </g>
      )}

      {(trancado || seleccionado) && (
        <g data-testid="trava-no" transform="translate(-6,-6)" style={{ cursor: "pointer" }}
          onMouseDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onAlternarTrava?.(node.id); }}>
          <title>{trancado ? "Destrancar nó" : "Trancar nó (não move nem apaga)"}</title>
          <circle r={8} fill="white" stroke={trancado ? "#F59E0B" : cor} strokeWidth={1.5} />
          <g transform="translate(-6,-6)" style={{ pointerEvents: "none" }}>
            {trancado ? <Lock size={12} color="#F59E0B" /> : <Unlock size={12} color={cor} />}
          </g>
        </g>
      )}
    </g>
  );
}
