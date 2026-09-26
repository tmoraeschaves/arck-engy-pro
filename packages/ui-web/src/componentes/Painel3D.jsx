import { GripHorizontal, Rotate3d, X } from "lucide-react";
import { LIMITE_3D } from "../config/app-meta.js";

const PERSPECTIVAS = [
  {n:"Frontal",    x:0,   y:0,   z:0},
  {n:"Perspectiva",x:15,  y:-25, z:0},
  {n:"Isométrica", x:30,  y:-45, z:0},
  {n:"Topo",       x:62,  y:0,   z:0},
  {n:"Lateral Dir",x:0,   y:62,  z:0},
  {n:"Lateral Esq",x:0,   y:-62, z:0},
  {n:"Inclinada",  x:25,  y:20,  z:8},
  {n:"Profunda",   x:52,  y:-38, z:0},
  {n:"Plano Z",    x:0,   y:0,   z:45},
];

// Painel flutuante da rotação 3D: ligar/desligar, perspectivas pré-definidas e sliders por eixo.
// A posição é controlada pelo App (arrasto pela pega → `onIniciarArrasto`).
export function Painel3D({ pos, is3D, setIs3D, rotX, setRotX, rotY, setRotY, rotZ, setRotZ, onIniciarArrasto, onFechar }) {
  const rodar = (x, y, z) => { setRotX(x); setRotY(y); setRotZ(z); };
  return (
    <div className="fixed z-[110] bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden"
      style={{left:Math.max(0,Math.min(pos.x,window.innerWidth-270)),top:Math.max(0,Math.min(pos.y,window.innerHeight-420)),width:260}}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#334155] cursor-grab bg-[#0F172A] rounded-t-xl select-none"
        onMouseDown={e=>{e.stopPropagation();onIniciarArrasto({sx:e.clientX,sy:e.clientY,ox:pos.x,oy:pos.y});}}>
        <div className="flex items-center gap-2">
          <GripHorizontal size={12} className="text-slate-400"/>
          <Rotate3d size={13} className="text-blue-400"/>
          <span className="text-[11px] font-bold text-white">Rotação 3D</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onFechar} className="text-slate-400 hover:text-white"><X size={14}/></button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] text-slate-300 font-bold">Vista 3D</span>
          <button onClick={()=>setIs3D(!is3D)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black border transition-all
              ${is3D?"bg-blue-600 border-blue-500 text-white":"bg-[#0F172A] border-[#334155] text-slate-400 hover:border-blue-600 hover:text-blue-400"}`}>
            {is3D ? "ACTIVA ●" : "INACTIVA ○"}
          </button>
        </div>

        <div className="text-[8px] font-bold text-slate-300 uppercase tracking-wider mb-2">Perspectivas Pré-definidas</div>
        <div className="grid grid-cols-3 gap-1.5 mb-4">
          {PERSPECTIVAS.map(p=>(
            <button key={p.n} onClick={()=>rodar(p.x, p.y, p.z)}
              className="py-1.5 px-1 rounded-lg text-[8px] font-bold border border-[#334155] bg-[#0F172A] text-slate-200 hover:border-blue-500 hover:text-blue-300 hover:bg-blue-900/20 transition-all text-center leading-tight">
              {p.n}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {[
            {lbl:"Eixo X — Inclinação", val:rotX, set:setRotX, min:-LIMITE_3D, max:LIMITE_3D, color:"#EF4444"},
            {lbl:"Eixo Y — Rotação",    val:rotY, set:setRotY, min:-LIMITE_3D, max:LIMITE_3D, color:"#10B981"},
            {lbl:"Eixo Z — Plano",      val:rotZ, set:setRotZ, min:-180,       max:180,       color:"#8B5CF6"},
          ].map(s=>(
            <div key={s.lbl}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-bold text-slate-200">{s.lbl}</span>
                <span className="text-[9px] font-black" style={{color:s.color}}>{Math.round(s.val)}°</span>
              </div>
              <input type="range" min={s.min} max={s.max} step="1" value={Math.round(s.val)}
                onChange={e=>s.set(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{accentColor:s.color}}/>
            </div>
          ))}
        </div>

        <button onClick={()=>rodar(0, 0, 0)}
          className="w-full mt-4 py-1.5 border border-[#334155] text-[9px] font-bold text-slate-200 rounded-lg hover:bg-[#334155] hover:text-white transition-all">
          RESET PARA 2D
        </button>
        <div className="mt-3 text-[8px] text-slate-400 text-center leading-relaxed">
          🖱️ Btn direito + arrasta no canvas para rodar<br/>
          Roda do rato para zoom · ESC desactiva 3D
        </div>
      </div>
    </div>
  );
}
