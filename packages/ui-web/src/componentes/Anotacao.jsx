import { useEffect, useRef, useState } from "react";
import { ChevronUp, ChevronDown, X, Palette } from "lucide-react";
import { NOTA_CORES, notaCor } from "../config/notas.js";

// Uma nota flutuante no canvas — expande/colapsa, edita texto inline, muda de cor.
export function Anotacao({ anotacao, aEditar, onAlternar, onEditarTexto, onComecarEdicao, onDefinirCor, onRemover }) {
  const areaRef = useRef(null);
  const focada = useRef(false);
  const [paletaAberta, setPaletaAberta] = useState(false);
  const c = notaCor(anotacao.cor);

  // Foca a textarea no frame seguinte — não durante o mousedown/click que criou a
  // nota, senão o browser desfaz o .focus() logo a seguir e a nota (vazia) apaga-se
  // sozinha no onBlur. Só se apaga por perda de foco depois de ter sido mesmo focada.
  useEffect(() => {
    if (!aEditar) { focada.current = false; return; }
    const id = requestAnimationFrame(() => areaRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [aEditar]);

  return (
    <foreignObject x={anotacao.x - 80} y={anotacao.y - 20} width={170} height={160} style={{ pointerEvents: "all", overflow: "visible" }}>
      <div className="group rounded-lg shadow-md text-xs overflow-hidden"
        style={{ background: c.bg, border: `1px solid ${c.borda}`, color: c.texto }}
        onContextMenu={e => { e.preventDefault(); onRemover(anotacao.id); }}>
        <div className="flex items-center justify-between px-2 py-1 cursor-pointer"
          style={{ background: c.cabecalho, borderBottom: `1px solid ${c.borda}` }}
          onClick={() => onAlternar(anotacao.id)}>
          <span className="text-[8px] font-bold" style={{ color: c.texto }}>NOTA</span>
          <div className="flex gap-1 items-center">
            <button className="opacity-0 group-hover:opacity-100 hover:opacity-100" style={{ color: c.texto }}
              title="Cor da nota"
              onClick={e => { e.stopPropagation(); setPaletaAberta(p => !p); }}><Palette size={9} /></button>
            {anotacao.expanded ? <ChevronUp size={9} style={{ color: c.texto }} /> : <ChevronDown size={9} style={{ color: c.texto }} />}
            <button className="opacity-0 group-hover:opacity-100 hover:text-red-600" style={{ color: c.texto }}
              onClick={e => { e.stopPropagation(); onRemover(anotacao.id); }}><X size={9} /></button>
          </div>
        </div>

        {paletaAberta && (
          <div className="flex gap-1 px-2 py-1.5 flex-wrap" style={{ background: c.bg, borderBottom: `1px solid ${c.borda}` }}>
            {NOTA_CORES.map(op => (
              <button key={op.key} title={op.nome}
                onClick={e => { e.stopPropagation(); onDefinirCor(anotacao.id, op.key); setPaletaAberta(false); }}
                className="w-4 h-4 rounded-full border"
                style={{ background: op.cabecalho, borderColor: op.key === c.key ? op.texto : op.borda, borderWidth: op.key === c.key ? 2 : 1 }} />
            ))}
          </div>
        )}

        {anotacao.expanded && (
          <div className="p-1.5">
            {aEditar
              ? <textarea ref={areaRef} rows={3} className="w-full text-[10px] bg-transparent resize-none outline-none"
                  style={{ color: c.texto, userSelect: "text" }}
                  value={anotacao.text} placeholder="escreve aqui…"
                  onFocus={() => { focada.current = true; }}
                  onChange={e => onEditarTexto(anotacao.id, e.target.value)}
                  onBlur={() => { if (focada.current && !anotacao.text.trim()) onRemover(anotacao.id); else onComecarEdicao(null); }} />
              : <div className="text-[10px] cursor-text min-h-[18px] whitespace-pre-wrap break-words" style={{ color: c.texto }}
                  onClick={() => onComecarEdicao(anotacao.id)}>
                  {anotacao.text || <span className="italic opacity-50">clique para editar</span>}
                </div>}
          </div>
        )}
      </div>
    </foreignObject>
  );
}
