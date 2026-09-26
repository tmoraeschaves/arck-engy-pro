import { FileText, X } from "lucide-react";
import { LAYER_KEYS } from "../config/camadas.js";

// Relatório de fluxo: caminhos detectados, inventário por camada e estatísticas de ligações.
// `relatorio` vem de computeFlowReport (null quando ainda não há nada para relatar).
export function PainelFluxo({ relatorio, layerName, layerColor, corIntegridade, textoIntegridade, sector, modoLivre, onFechar }) {
  return (
    <div className="w-60 bg-white border-l border-slate-200 flex flex-col flex-shrink-0 overflow-hidden" id="flow-report-panel">
      <div className="px-3 py-2 bg-[#0F172A] flex items-center justify-between flex-shrink-0">
        <span className="text-[10px] font-black text-white uppercase tracking-wider">Relatório de Fluxo</span>
        <div className="flex gap-1">
          <button onClick={()=>window.print()} title="Imprimir" className="text-slate-400 hover:text-white"><FileText size={12}/></button>
          <button onClick={onFechar} className="text-slate-400 hover:text-white"><X size={12}/></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 text-xs">
        {relatorio ? (<>
          <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-2">Caminho Detectado</div>
          {relatorio.paths.map((p,i)=>(
            <div key={i} className="font-mono text-[9px] text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2 mb-2 break-all leading-relaxed">
              {p}
            </div>
          ))}

          <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-3">Inventário de Camadas</div>
          {LAYER_KEYS.map(key=>{
            const items=relatorio.inventory[key]; if(!items?.length) return null;
            return (
              <div key={key} className="flex items-start gap-2 mb-1.5 p-1.5 rounded bg-slate-50 border border-slate-100">
                <span className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{background:layerColor(key)}}/>
                <div>
                  <span className="text-[9px] font-bold" style={{color:layerColor(key)}}>{layerName(key)}</span>
                  <span className="text-[8px] text-slate-400 ml-1">{items.join(", ")}</span>
                </div>
              </div>
            );
          })}

          <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Estatísticas</div>
            <div className="text-[9px] text-slate-600 flex justify-between"><span>Ligações total</span><span className="font-bold text-slate-800">{relatorio.stats.total}</span></div>
            <div className="text-[9px] text-emerald-600 flex justify-between"><span>Válidas</span><span className="font-bold">{relatorio.stats.valid}</span></div>
            {relatorio.stats.invalid>0&&<div className="text-[9px] text-red-500 flex justify-between"><span>Inválidas</span><span className="font-bold">{relatorio.stats.invalid}</span></div>}
            {relatorio.stats.cycles>0&&<div className="text-[9px] text-emerald-500 flex justify-between"><span>Ciclos L5→L2</span><span className="font-bold">⚡ {relatorio.stats.cycles}</span></div>}
            <div className="text-[9px] flex justify-between pt-1 border-t border-slate-200" style={{color:corIntegridade}}><span>Integridade</span><span className="font-black">{textoIntegridade}</span></div>
          </div>

          <div className="text-[7px] text-slate-400 mt-2 text-center">{sector.icon} {sector.name} · {modoLivre?"Modo Livre":"Modo Guiado"}</div>
        </>) : (
          <div className="text-center py-8">
            <div className="text-3xl mb-2 opacity-30">📊</div>
            <div className="text-[10px] text-slate-400">Adiciona nós e ligações<br/>para gerar o relatório</div>
          </div>
        )}
      </div>
    </div>
  );
}
