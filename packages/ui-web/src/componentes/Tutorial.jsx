import { X } from "lucide-react";
import { TUTORIAL_STEPS } from "../config/tutorial.js";

// Tutorial em passos, ancorado ao fundo do ecrã. `onFechar` marca-o como visto.
export function Tutorial({ passo, onPasso, onFechar }) {
  const actual = TUTORIAL_STEPS[passo];
  const ultimo = passo === TUTORIAL_STEPS.length - 1;
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] w-[500px] max-w-[95vw] bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#059669] to-[#0891b2] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="text-[11px] font-black text-white uppercase tracking-widest">Tutorial</span><span className="text-white/60">·</span><span className="text-[10px] text-white/70">{passo+1}/{TUTORIAL_STEPS.length}</span></div>
        <button onClick={onFechar} className="text-white/70 hover:text-white"><X size={14}/></button>
      </div>
      <div className="flex h-1">{TUTORIAL_STEPS.map((_,i)=><button key={i} onClick={()=>onPasso(i)} className={`flex-1 transition-all ${i===passo?"bg-emerald-400":i<passo?"bg-emerald-800":"bg-[#334155]"}`}/>)}</div>
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <span className="text-3xl flex-shrink-0">{actual.icon}</span>
          <div><div className="text-sm font-black text-white mb-1">{actual.title}</div><div className="text-[11px] text-slate-400 leading-relaxed">{actual.desc}</div></div>
        </div>
        <div className="flex items-center bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 mb-4">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mr-2">Onde:</span>
          <span className="text-[9px] font-bold text-emerald-400">{actual.hint}</span>
        </div>
        <div className="flex items-center justify-between">
          <button onClick={()=>onPasso(Math.max(0,passo-1))} disabled={passo===0} className="text-[10px] font-bold text-slate-400 hover:text-white disabled:opacity-20">← ANTERIOR</button>
          <button onClick={onFechar} className="text-[9px] text-slate-400 hover:text-slate-200 mx-4">pular</button>
          {!ultimo
            ?<button onClick={()=>onPasso(passo+1)} className="bg-emerald-700 text-white px-5 py-1.5 rounded-lg text-[10px] font-black hover:bg-emerald-600">PRÓXIMO →</button>
            :<button onClick={onFechar} className="bg-emerald-700 text-white px-5 py-1.5 rounded-lg text-[10px] font-black hover:bg-emerald-600">CONCLUIR ✓</button>
          }
        </div>
      </div>
    </div>
  );
}
