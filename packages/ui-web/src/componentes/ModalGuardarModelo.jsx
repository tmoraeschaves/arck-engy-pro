import { useState } from "react";
import { X } from "lucide-react";

// Modal para guardar o diagrama actual como modelo pessoal. O nome é estado local do modal.
export function ModalGuardarModelo({ resumo, onGuardar, onFechar }) {
  const [nome, setNome] = useState("");
  const guardar = () => { if (nome.trim()) onGuardar(nome.trim()); };
  return (
    <div className="fixed inset-0 bg-black/70 z-[180] flex items-center justify-center">
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl w-80 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#059669] to-[#0891b2] px-5 py-3 flex items-center justify-between">
          <span className="text-[11px] font-black text-white">Guardar Modelo</span>
          <button onClick={onFechar} className="text-white/70 hover:text-white"><X size={14}/></button>
        </div>
        <div className="p-5">
          <div className="text-[9px] text-slate-400 mb-2">Nome do modelo:</div>
          <input autoFocus className="w-full bg-[#0F172A] border border-[#334155] text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-emerald-600 mb-1"
            value={nome} onChange={e=>setNome(e.target.value)} onKeyDown={e=>e.key==="Enter"&&guardar()} placeholder="ex: Arquitectura de Microsserviços"/>
          <div className="text-[8px] text-slate-400 mb-4">{resumo}</div>
          <div className="flex gap-2">
            <button onClick={onFechar} className="flex-1 py-2 border border-[#334155] text-slate-400 text-[10px] font-bold rounded-lg hover:bg-[#334155]">CANCELAR</button>
            <button onClick={guardar} disabled={!nome.trim()} className="flex-1 py-2 bg-emerald-700 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-600 disabled:opacity-30">GUARDAR</button>
          </div>
        </div>
      </div>
    </div>
  );
}
