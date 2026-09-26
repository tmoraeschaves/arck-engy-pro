import { Shield } from "lucide-react";

// Barra de estado no rodapé: estado do sistema, contagens, conflitos, sector e zoom.
export function BarraEstado({ analise, formas, modoLivre, modoSilencioso, corIntegridade, sector, zoom }) {
  const estado = !analise.nodeCount ? "STANDBY"
    : modoLivre ? "LIVRE"
    : modoSilencioso ? "QUIETO"
    : analise.conflicts > 0 ? "ALERTA" : "NOMINAL";
  return (
    <footer className="h-6 bg-[#0F172A] border-t border-[#1E293B] px-4 flex items-center justify-between text-[8px] font-bold flex-shrink-0">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1" style={{color:corIntegridade}}><Shield size={9}/> {estado}</span>
        <span className="text-white/70">Nós: <span className="text-white">{analise.nodeCount}</span></span>
        <span className="text-white/70">Links: <span className="text-white">{analise.connCount}</span></span>
        <span className="text-white/70">Formas: <span className="text-white">{formas}</span></span>
        {analise.cycles>0&&<span className="text-emerald-400">⚡ {analise.cycles} ciclo{analise.cycles>1?"s":""}</span>}
        {!modoSilencioso&&!modoLivre&&analise.conflicts>0&&<span className="text-red-400">⚠ {analise.conflicts} conflito{analise.conflicts>1?"s":""}</span>}
        <span className="text-white/55">{sector.icon} {sector.name} · {Math.round(zoom*100)}%</span>
      </div>
      <div className="text-white/55">TIAGO MORAES CHAVES · ARCHITECT &amp; ENGINEER</div>
    </footer>
  );
}
