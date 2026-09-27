import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { SECTORS } from "../config/sectores.js";
import { LAYER_KEYS } from "../config/camadas.js";

// Selector de sector do cabeçalho (DEC-018): mostra só o sector activo; um clique abre os 12
// em grelha, cada um com o vocabulário das suas 5 camadas — escolhe-se sabendo o que se leva.
// A faixa de 12 separadores não cabia em ecrãs de 1422/1600 px. Fecha ao escolher, com Esc
// ou com um clique fora.
export function SeletorSector({ sector, sectorActivo, onEscolher }) {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    const fora = e => { if (!raiz.current?.contains(e.target)) setAberto(false); };
    const esc = e => { if (e.key === "Escape") setAberto(false); };
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", fora); document.removeEventListener("keydown", esc); };
  }, [aberto]);

  return (
    <div ref={raiz} className="relative border-l border-[#334155] pl-3 flex-shrink-0">
      <button type="button" onClick={() => setAberto(p => !p)} aria-haspopup="listbox" aria-expanded={aberto}
        title="Mudar de sector"
        className={`h-8 px-3 flex items-center gap-2 rounded-md border text-[10px] font-bold text-white transition-all
          ${aberto ? "border-emerald-600 bg-emerald-900/40" : "border-[#334155] hover:bg-[#1E293B]"}`}>
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Sector</span>
        <span>{sectorActivo.icon} {sectorActivo.name}</span>
        <ChevronDown size={12} className={`text-slate-400 transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>

      {aberto && (
        <div role="listbox" aria-label="Sectores"
          className="absolute left-3 top-full mt-2 z-[60] w-[560px] max-w-[calc(100vw-2rem)] grid grid-cols-3 gap-1.5 p-2
            bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl">
          {Object.entries(SECTORS).map(([key, s]) => {
            const activo = sector === key;
            return (
              <button key={key} type="button" role="option" aria-selected={activo}
                onClick={() => { onEscolher(key); setAberto(false); }}
                className={`text-left px-2.5 py-2 rounded-lg border transition-all
                  ${activo ? "border-emerald-600 bg-emerald-900/40" : "border-transparent hover:bg-[#334155]"}`}>
                <div className="text-[11px] font-bold text-white">{s.icon} {s.name}</div>
                <div className="text-[8px] text-slate-400 leading-snug mt-0.5">
                  {LAYER_KEYS.map(k => s.names[k]).join(" · ")}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
