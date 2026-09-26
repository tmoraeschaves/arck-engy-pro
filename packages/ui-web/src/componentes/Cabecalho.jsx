import { useRef } from "react";
import { Download, FileImage, FileText, RotateCcw, Shapes, Upload } from "lucide-react";
import { SECTORS } from "../config/sectores.js";
import { METRICS } from "../config/app-meta.js";

// Barras do cabeçalho: altura e cor vêm da integridade (`health`); `pulso` só dá a fase da onda.
// Erro (fracção 0) fica parado; inércia mexe pouco.
function BarrasIntegridade({ health, inercia, cor, texto, pulso }) {
  const frac = inercia ? 0.16 : Math.max(0, health) / 100;
  const amp = inercia ? 0.5 : frac;
  return (
    <div className="flex items-center gap-2 ml-auto flex-shrink-0" title={`Integridade: ${texto}`}>
      <div className="flex flex-col items-end">
        <span className="text-[8px] font-bold text-white/75">INTEGRIDADE</span>
        <span className="text-sm font-black" style={{color:cor}}>{texto}</span>
      </div>
      <div className="flex gap-0.5 h-7 items-end">
        {Array.from({length:12}).map((_,i)=>{
          const h = Math.min(100, Math.max(6, frac*66 + Math.sin(pulso + i*0.7)*15*amp + i*2*frac));
          return <div key={i} className="rounded-sm transition-all duration-150"
            style={{width:3, background:cor, opacity:0.45 + i*0.045, height:`${h}%`}}/>;
        })}
      </div>
    </div>
  );
}

const botaoExportar = "w-7 h-7 flex items-center justify-center rounded-md text-white hover:bg-[#334155] transition-all";

// Cabeçalho: faixa de versão/sector, integridade, separadores de sector, modo, import/export e marca.
// O <input type=file> do importador vive aqui — é detalhe deste componente, não do App.
export function Cabecalho({
  sector, sectorActivo, modoLivre, modoSilencioso, temNos,
  integridade, onEscolherSector, onAlternarModo,
  onImportar, onExportarJSON, onExportarSVG, onExportarPNG, onResetar,
}) {
  const inputFicheiro = useRef(null);
  const { health, inercia, cor, texto, pulso } = integridade;
  return (
    <header className="flex-shrink-0 bg-[#0F172A] border-b border-[#1E293B] z-50">
      <div className="h-8 bg-gradient-to-r from-[#059669] to-[#0891b2] flex items-center justify-between px-4">
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <span className="font-black text-white text-sm">A&amp;E</span>
          <span className="text-white/60">·</span>
          <span className="text-white">v{METRICS.version}</span>
          <span className="text-white/60">·</span>
          <span className="text-white">{METRICS.kernel}</span>
          <span className="text-white/60">·</span>
          <span className="text-white">{sectorActivo.icon} {sectorActivo.name.toUpperCase()}</span>
          {modoSilencioso && <span className="bg-white/20 px-2 py-0.5 rounded-full text-white text-[9px]">🔇 QUIETO</span>}
          {modoLivre      && <span className="bg-amber-400/30 px-2 py-0.5 rounded-full text-white text-[9px]">🔓 LIVRE</span>}
        </div>
        <span className="text-white text-[10px] font-black tracking-widest opacity-95">ARCHITECT &amp; ENGINEER</span>
      </div>

      <div className="flex items-center h-14 px-4 gap-3">
        <div className="flex flex-col items-center justify-center h-10 w-28 rounded-lg border border-[#334155] px-3 flex-shrink-0">
          <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">Integridade</span>
          <span className="text-base font-black leading-tight" style={{color:cor}}>{texto}</span>
        </div>

        <div className="flex gap-1 border-l border-[#334155] pl-3 overflow-x-auto">
          {Object.entries(SECTORS).map(([key,s])=>(
            <button key={key} onClick={()=>onEscolherSector(key)}
              className={`px-2 h-7 text-[8px] font-bold rounded-md whitespace-nowrap transition-all
                ${sector===key?"bg-emerald-700 text-white":"text-white hover:bg-[#1E293B]"}`}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>

        <button onClick={onAlternarModo}
          className={`ml-1 px-3 h-7 text-[9px] font-black rounded-md border transition-all flex-shrink-0
            ${modoLivre?"border-amber-500 bg-amber-500/10 text-amber-300":"border-emerald-700 bg-emerald-900/30 text-emerald-300"}`}>
          {modoLivre?"🔓 LIVRE":"🔒 GUIADO"}
        </button>

        <div className="flex gap-1 border-l border-[#334155] pl-3 flex-shrink-0">
          <button onClick={()=>inputFicheiro.current?.click()} title="Importar JSON" className={botaoExportar}><Upload size={14}/></button>
          <button onClick={onExportarJSON} title="Exportar JSON" className={botaoExportar}><Download size={14}/></button>
          <button onClick={onExportarSVG} title="Exportar SVG" className={botaoExportar}><Shapes size={14}/></button>
          <button onClick={onExportarPNG} title="Exportar PNG" className={botaoExportar}><FileImage size={14}/></button>
          <button onClick={()=>window.print()} title="Imprimir / PDF" className={botaoExportar}><FileText size={14}/></button>
          <button onClick={onResetar} title="Reset" className={botaoExportar}><RotateCcw size={14}/></button>
          <input type="file" ref={inputFicheiro} className="hidden" accept=".json"
            onChange={e=>{ const f=e.target.files[0]; e.target.value=""; if (f) onImportar(f); }}/>
        </div>

        {temNos && <BarrasIntegridade health={health} inercia={inercia} cor={cor} texto={texto} pulso={pulso} />}

        <div className="ml-3 text-right flex-shrink-0">
          <div className="text-xs font-black text-white tracking-tight">ARCHITECT <span className="text-emerald-400">&amp;</span> ENGINEER</div>
          <div className="text-[8px] text-white/70">TIAGO MORAES CHAVES</div>
        </div>
      </div>
    </header>
  );
}
