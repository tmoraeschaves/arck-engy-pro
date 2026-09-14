import { X, ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";
import { uid } from "../lib/uid.js";
import { MODULO_KINDS, MODULO_KIND_PADRAO, kindInfo } from "../config/modulos.js";

/**
 * Painel lateral dos módulos de um nó (Movimento 8, Fatia 2a).
 * Props-in, sem estado próprio — despacha para o reducer do projecto.
 * Abre por duplo-clique no nó; serve o Modo Livre por inteiro.
 */
export function PainelModulos({ no, layerName, layerColor, dispatch, onFechar }) {
  if (!no) return null;
  const modulos = no.modules || [];
  const cor = layerColor(no.layer);

  const adicionar = () =>
    dispatch({ tipo: "ADICIONAR_MODULO", noId: no.id, modulo: { id: `mod_${uid()}`, label: "Novo módulo", kind: MODULO_KIND_PADRAO } });

  const editar = (moduloId, patch) => dispatch({ tipo: "EDITAR_MODULO", noId: no.id, moduloId, patch });
  const remover = (moduloId) => dispatch({ tipo: "REMOVER_MODULO", noId: no.id, moduloId });
  const mover = (moduloId, direccao) => dispatch({ tipo: "MOVER_MODULO", noId: no.id, moduloId, direccao });

  return (
    <div className="w-64 bg-white border-l border-slate-200 flex flex-col flex-shrink-0 overflow-hidden" id="painel-modulos">
      <div className="px-3 py-2 flex items-center justify-between flex-shrink-0" style={{ background: "#0F172A" }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cor }} />
          <span className="text-[10px] font-black text-white uppercase tracking-wider truncate">{layerName(no.layer)}</span>
        </div>
        <button onClick={onFechar} className="text-slate-400 hover:text-white flex-shrink-0"><X size={12} /></button>
      </div>

      <div className="px-3 py-2 flex-shrink-0 border-b border-slate-100">
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
          Módulos e funções {modulos.length > 0 && `· ${modulos.length}`}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {modulos.length === 0 && (
          <div className="text-center py-8 px-3">
            <div className="text-[10px] text-slate-400 leading-relaxed">
              Ainda sem módulos.<br />O que é que vive dentro desta camada?
            </div>
          </div>
        )}

        {modulos.map((m, i) => {
          const { Icone } = kindInfo(m.kind);
          return (
            <div key={m.id} className="border border-slate-200 rounded-lg p-2 bg-slate-50">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icone size={13} className="text-slate-500 flex-shrink-0" />
                <select
                  aria-label="Tipo do módulo"
                  value={m.kind || MODULO_KIND_PADRAO}
                  onChange={e => editar(m.id, { kind: e.target.value })}
                  className="text-[9px] font-bold text-slate-500 bg-transparent outline-none cursor-pointer flex-1 min-w-0">
                  {MODULO_KINDS.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}
                </select>
                <button onClick={() => mover(m.id, -1)} disabled={i === 0}
                  className="text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300"><ChevronUp size={12} /></button>
                <button onClick={() => mover(m.id, 1)} disabled={i === modulos.length - 1}
                  className="text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300"><ChevronDown size={12} /></button>
                <button onClick={() => remover(m.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={11} /></button>
              </div>
              <input
                aria-label="Nome do módulo"
                value={m.label || ""}
                onChange={e => editar(m.id, { label: e.target.value })}
                placeholder="nome do módulo"
                className="w-full text-[11px] font-semibold text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-1 outline-none focus:border-slate-400 mb-1" />
              <input
                aria-label="Nota do módulo"
                value={m.nota || ""}
                onChange={e => editar(m.id, { nota: e.target.value })}
                placeholder="nota (opcional)"
                className="w-full text-[9px] text-slate-500 bg-transparent outline-none" />
            </div>
          );
        })}
      </div>

      <div className="p-2 flex-shrink-0 border-t border-slate-100">
        <button onClick={adicionar}
          className="w-full py-1.5 flex items-center justify-center gap-1 text-[10px] font-bold rounded-lg border border-dashed transition-all hover:bg-slate-50"
          style={{ borderColor: cor + "80", color: cor }}>
          <Plus size={12} /> Adicionar módulo
        </button>
      </div>
    </div>
  );
}
