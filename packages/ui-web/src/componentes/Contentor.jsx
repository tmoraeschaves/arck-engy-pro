import { useEffect, useRef } from "react";
import { Lock, Unlock } from "lucide-react";
import { CORES_CONTENTOR, ESTILOS_CONTENTOR, OPACIDADE_FUNDO_CONTENTOR, ROTULO_CONTENTOR } from "../config/contentores.js";

const ALTURA_ABA = 24;
// largura aproximada do rótulo (a aba agarra o rato; não precisa de ser ao píxel)
const larguraAba = texto => Math.max(64, (texto || ROTULO_CONTENTOR).length * 7.2 + 22);

/**
 * Um contentor de agrupamento (DEC-018): caixa translúcida com rótulo no canto, contorno
 * contínuo ou tracejado. Só a aba do rótulo e o contorno agarram o rato — o interior deixa
 * passar os cliques para o canvas (colocar nós/notas, pan, desseleccionar lá dentro).
 * Seleccionado: alças nos cantos, cadeado e uma barra para editar rótulo, cor e contorno.
 * `novo` = acabou de ser desenhado → o campo do rótulo abre já focado.
 */
export function Contentor({
  contentor, seleccionado, novo, paraCanvas,
  onSeleccionar, onIniciarArrasto, onIniciarRedimensionar, onAlternarTrava, onEditar, onRemover,
}) {
  const { id, x, y, w, h, cor, estilo, label } = contentor;
  const trancado = !!contentor.locked;
  const dash = ESTILOS_CONTENTOR[estilo]?.dash;
  const campoRef = useRef(null);

  useEffect(() => {
    if (seleccionado && novo) requestAnimationFrame(() => { campoRef.current?.focus(); campoRef.current?.select(); });
  }, [seleccionado, novo]);

  const agarrar = e => {
    if (e.button !== 0) return;
    e.stopPropagation();
    onSeleccionar(id);
    if (trancado) return;
    const p = paraCanvas(e.clientX, e.clientY);
    onIniciarArrasto(id, p.x, p.y);
  };
  const menu = e => { e.preventDefault(); e.stopPropagation(); if (!trancado) onRemover(id); };

  const cantos = seleccionado && !trancado ? [
    { c: "tl", cx: x, cy: y, cursor: "nw-resize" },
    { c: "tr", cx: x + w, cy: y, cursor: "ne-resize" },
    { c: "bl", cx: x, cy: y + h, cursor: "sw-resize" },
    { c: "br", cx: x + w, cy: y + h, cursor: "se-resize" },
  ] : [];

  return (
    <g data-testid="contentor" data-contentor-id={id}>
      {/* corpo: não agarra o rato */}
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill={cor} fillOpacity={OPACIDADE_FUNDO_CONTENTOR}
        stroke={cor} strokeWidth={seleccionado ? 2 : 1.5} strokeDasharray={dash}
        style={{ pointerEvents: "none" }} />
      {/* contorno largo e invisível: agarrar pela borda */}
      <rect data-testid="contentor-borda" x={x} y={y} width={w} height={h} rx={6}
        fill="none" stroke="transparent" strokeWidth={12}
        style={{ pointerEvents: "stroke", cursor: trancado ? "default" : "move" }}
        onMouseDown={agarrar} onContextMenu={menu} />
      {/* aba do rótulo */}
      <g data-testid="contentor-aba" onMouseDown={agarrar} onContextMenu={menu}
        style={{ cursor: trancado ? "default" : "move", pointerEvents: "all" }}>
        <rect x={x} y={y} width={larguraAba(label)} height={ALTURA_ABA} rx={6} fill={cor} fillOpacity={0.14} />
        <text x={x + 10} y={y + 16} fontSize={12} fontWeight={700} fill={cor}
          fontFamily="Inter, system-ui, sans-serif" style={{ userSelect: "none" }}>
          {label || ROTULO_CONTENTOR}
        </text>
      </g>

      {trancado && !seleccionado && (
        <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={8} fill="none"
          stroke="#F59E0B" strokeWidth={1} strokeDasharray="3,4" opacity={0.35} style={{ pointerEvents: "none" }} />
      )}

      {cantos.map(k => (
        <rect key={k.c} data-testid="contentor-alca" x={k.cx - 5} y={k.cy - 5} width={10} height={10} rx={2}
          fill="white" stroke={cor} strokeWidth={1.5} style={{ cursor: k.cursor, pointerEvents: "all" }}
          onMouseDown={e => {
            e.stopPropagation();
            onIniciarRedimensionar({ id, corner: k.c, ox: x, oy: y, ow: w, oh: h, mx: e.clientX, my: e.clientY });
          }} />
      ))}

      {(trancado || seleccionado) && (
        <g data-testid="trava-contentor" transform={`translate(${x + w + 2},${y - 2})`} style={{ cursor: "pointer", pointerEvents: "all" }}
          onMouseDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onAlternarTrava(id); }}>
          <title>{trancado ? "Destrancar contentor" : "Trancar contentor (não move, não redimensiona, não apaga)"}</title>
          <circle r={8} fill="white" stroke={trancado ? "#F59E0B" : cor} strokeWidth={1.5} />
          <g transform="translate(-6,-6)" style={{ pointerEvents: "none" }}>
            {trancado ? <Lock size={12} color="#F59E0B" /> : <Unlock size={12} color={cor} />}
          </g>
        </g>
      )}

      {/* barra de edição por cima da caixa */}
      {seleccionado && !trancado && (
        <foreignObject x={x} y={y - 40} width={360} height={34} style={{ overflow: "visible", pointerEvents: "all" }}>
          <div data-testid="contentor-barra" onMouseDown={e => e.stopPropagation()}
            style={{ display: "flex", alignItems: "center", gap: 6, height: 30, padding: "0 6px",
              background: "#1E293B", border: "1px solid #334155", borderRadius: 8, width: "max-content",
              boxShadow: "0 4px 12px rgba(0,0,0,.25)" }}>
            <input ref={campoRef} aria-label="Rótulo do contentor" value={label} placeholder={ROTULO_CONTENTOR}
              onChange={e => onEditar(id, { label: e.target.value })}
              onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur(); }}
              style={{ width: 130, height: 22, fontSize: 11, padding: "0 6px", borderRadius: 5, border: "1px solid #334155",
                background: "#0F172A", color: "#F1F5F9", outline: "none", userSelect: "text" }} />
            {CORES_CONTENTOR.map(c => (
              <button key={c.id} type="button" title={c.nome} aria-label={`Cor ${c.nome}`}
                onClick={() => onEditar(id, { cor: c.cor })}
                style={{ width: 14, height: 14, borderRadius: 999, background: c.cor, cursor: "pointer",
                  border: c.cor === cor ? "2px solid white" : "1px solid #334155" }} />
            ))}
            <button type="button" data-testid="contentor-estilo"
              title={estilo === "tracejado" ? "Contorno tracejado — clicar para contínuo" : "Contorno contínuo — clicar para tracejado"}
              onClick={() => onEditar(id, { estilo: estilo === "tracejado" ? "continuo" : "tracejado" })}
              style={{ width: 26, height: 20, borderRadius: 5, border: "1px solid #334155", background: "#0F172A", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={16} height={10}>
                <rect x={1} y={1} width={14} height={8} rx={2} fill="none" stroke="#CBD5E1" strokeWidth={1.3}
                  strokeDasharray={estilo === "tracejado" ? "3,2" : undefined} />
              </svg>
            </button>
          </div>
        </foreignObject>
      )}
    </g>
  );
}
