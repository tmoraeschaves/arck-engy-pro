import { SECTORS } from "../config/sectores.js";

// Modal de arranque: escolher o sector que calibra os nomes das camadas L1–L5.
export function ModalSector({ onEscolher, onUsarPadrao }) {
  return (
    <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center">
      <div className="bg-[#1E293B] border border-[#334155] w-[640px] max-w-[95vw] rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-[#059669] to-[#0891b2] px-8 py-6">
          <div className="text-2xl font-black text-white tracking-tight">Architect & Engineer</div>
          <div className="text-sm text-white/80 mt-1">Seleciona o sector para calibrar as camadas L1–L5</div>
        </div>
        <div className="p-5 grid grid-cols-4 gap-3">
          {Object.entries(SECTORS).map(([key,s])=>(
            <button key={key} onClick={()=>onEscolher(key)} className="p-4 rounded-lg border border-[#334155] hover:border-emerald-500 hover:bg-[#0F2D21] text-center transition-all group cursor-pointer">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-[11px] font-black text-white group-hover:text-emerald-400">{s.name}</div>
              <div className="text-[8px] text-slate-400 mt-1 leading-tight break-words">{Object.values(s.names).slice(0,2).join(" · ")}</div>
            </button>
          ))}
        </div>
        <div className="border-t border-[#334155] px-5 py-3 flex justify-end">
          <button onClick={onUsarPadrao} className="text-[10px] text-slate-400 hover:text-white font-bold">USAR ENGENHARIA POR PADRÃO →</button>
        </div>
      </div>
    </div>
  );
}
