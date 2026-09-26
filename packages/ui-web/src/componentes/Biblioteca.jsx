import { useState } from "react";
import { GripHorizontal, Trash2, X } from "lucide-react";
import { LAYERS, LAYER_KEYS } from "../config/camadas.js";
import { SECTORS } from "../config/sectores.js";
import { TEMPLATES } from "../config/templates.js";
import { IconeCamada } from "./IconeCamada.jsx";

const SEPARADORES = [["layers","CAMADAS"],["templates","MOLDES"],["models","MODELOS"],["colors","CORES"]];

// Biblioteca flutuante: referência das camadas, moldes (templates), modelos pessoais e cores.
// O separador activo é estado local; a posição é controlada pelo App (arrasto pela pega).
export function Biblioteca({
  pos, sector, sectorActivo, layerName, layerColor, customColors,
  modelos, onInserirTemplate, onCarregarModelo, onApagarModelo,
  dispatch, onIniciarArrasto, onFechar,
}) {
  const [separador, setSeparador] = useState("layers");
  return (
    <div className="fixed z-[100] bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl flex flex-col overflow-hidden"
      style={{left:Math.max(0,Math.min(pos.x,window.innerWidth-290)),top:Math.max(0,Math.min(pos.y,window.innerHeight-400)),width:280,maxHeight:"80vh"}}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#334155] cursor-grab active:cursor-grabbing flex-shrink-0 bg-[#0F172A] rounded-t-xl select-none"
        onMouseDown={e=>{e.stopPropagation();onIniciarArrasto({sx:e.clientX,sy:e.clientY,ox:pos.x,oy:pos.y});}}>
        <div className="flex items-center gap-2">
          <GripHorizontal size={12} className="text-slate-400"/>
          <span className="text-[11px] font-bold text-white">{sectorActivo.icon} {sectorActivo.name} · Biblioteca</span>
        </div>
        <button onClick={onFechar} className="text-slate-400 hover:text-white"><X size={14}/></button>
      </div>

      <div className="flex border-b border-[#334155] flex-shrink-0">
        {SEPARADORES.map(([tab,lbl])=>(
          <button key={tab} onClick={()=>setSeparador(tab)}
            className={`flex-1 py-1.5 text-[8px] font-bold border-r border-[#334155] last:border-r-0 transition-colors
              ${separador===tab?"bg-emerald-800 text-white":"text-slate-400 hover:bg-[#334155] hover:text-white"}`}>
            {lbl}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {separador==="layers"&&LAYER_KEYS.map(key=>(
          <div key={key} className="mb-3 p-3 rounded-lg border border-[#334155] bg-[#0F172A]">
            <div className="flex items-center gap-2 mb-2">
              <span style={{color:layerColor(key)}}><IconeCamada sector={sector} camada={key} size={18} /></span>
              <div>
                <div className="text-[10px] font-bold" style={{color:layerColor(key)}}>{key}: {layerName(key)}</div>
                <div className="text-[8px] text-slate-300">{sectorActivo.desc[key]}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[8px] bg-[#1E293B] rounded p-2 mb-1">
              {Object.entries(LAYERS[key].metrics).map(([k,v])=>(
                <div key={k}><span className="text-slate-400">{k}:</span><span className="font-bold text-white ml-1">{v}</span></div>
              ))}
            </div>
            <div className="text-[8px] text-slate-300">Saída: {LAYERS[key].validNext.map(k=>layerName(k)).join("→")}</div>
          </div>
        ))}

        {separador==="templates"&&(
          <div className="space-y-2">
            <p className="text-[9px] text-slate-300 mb-2">Topologias para <strong className="text-white">{sectorActivo.name}</strong></p>
            {TEMPLATES.map(t=>(
              <div key={t.id} className="p-3 rounded-lg border border-[#334155] bg-[#0F172A] flex items-center justify-between hover:border-emerald-700 transition-all">
                <div>
                  <div className="text-lg mb-0.5">{t.icon}</div>
                  <div className="text-[10px] font-bold text-white">{t.name}</div>
                  <div className="text-[8px] text-slate-300">{t.desc}</div>
                </div>
                <button onClick={()=>onInserirTemplate(t)}
                  className="text-[9px] font-bold bg-emerald-700 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 flex-shrink-0 ml-2">INSERIR</button>
              </div>
            ))}
          </div>
        )}

        {separador==="models"&&(
          <div>
            <p className="text-[9px] text-slate-300 mb-2">Modelos pessoais guardados localmente.</p>
            {!modelos.length?(
              <div className="text-center py-8">
                <div className="text-3xl mb-2 opacity-40">📂</div>
                <div className="text-[10px] text-slate-300">Nenhum modelo.<br/>Clica em <span className="text-emerald-400 font-bold">BookmarkPlus</span> na sidebar.</div>
              </div>
            ):modelos.map(m=>(
              <div key={m.id} className="p-3 rounded-lg border border-[#334155] bg-[#0F172A] mb-2 hover:border-emerald-700 transition-all">
                <div className="text-[10px] font-bold text-white mb-0.5">{m.name}</div>
                <div className="text-[8px] text-slate-300 mb-2">{new Date(m.createdAt).toLocaleDateString("pt-PT")} · {(m.nodes||[]).length} nós · {m.sector&&SECTORS[m.sector]?.icon}</div>
                <div className="flex gap-1">
                  <button onClick={()=>onCarregarModelo(m)} className="flex-1 text-[9px] font-bold bg-emerald-700 text-white py-1 rounded-lg hover:bg-emerald-600">CARREGAR</button>
                  <button onClick={()=>onApagarModelo(m.id)} className="w-7 flex items-center justify-center text-slate-300 hover:text-red-400 border border-[#334155] rounded-lg hover:border-red-700 transition-all"><Trash2 size={11}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {separador==="colors"&&(
          <div>
            <p className="text-[9px] text-slate-300 mb-3">Personaliza a cor de cada camada.</p>
            {LAYER_KEYS.map(key=>(
              <div key={key} className="flex items-center gap-2 mb-2 p-2 rounded-lg border border-[#334155] bg-[#0F172A]">
                <span style={{color:layerColor(key)}}><IconeCamada sector={sector} camada={key} size={18} /></span>
                <span className="text-[10px] font-bold flex-1" style={{color:layerColor(key)}}>{key} — {layerName(key)}</span>
                <input type="color" value={layerColor(key)} onChange={e=>dispatch({tipo:"DEFINIR_COR",camada:key,cor:e.target.value})} className="w-8 h-8 cursor-pointer rounded border border-[#334155] bg-transparent"/>
                {customColors[key]&&<button onClick={()=>dispatch({tipo:"LIMPAR_COR",camada:key})} className="text-[9px] text-slate-300 hover:text-red-400">↩</button>}
              </div>
            ))}
            <button onClick={()=>dispatch({tipo:"REPOR_CORES"})} className="w-full mt-2 py-1.5 border border-[#334155] text-[9px] font-bold text-slate-300 rounded-lg hover:bg-[#334155] hover:text-white transition-all">RESTAURAR PADRÕES</button>
          </div>
        )}
      </div>
    </div>
  );
}
