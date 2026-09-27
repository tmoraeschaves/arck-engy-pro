import { useState } from "react";
import {
  BellOff, Bell, BookmarkPlus, Box, Grid, Group, Image, Layers, List, Menu,
  Rotate3d, Scissors, Type, ZoomIn, ZoomOut,
} from "lucide-react";
import { LAYER_KEYS } from "../config/camadas.js";
import { IconeCamada } from "./IconeCamada.jsx";

const botao = "w-9 h-9 rounded-lg flex items-center justify-center transition-all";
const activoAzul = "border-blue-600 bg-blue-900/30 text-blue-400";
const inactivo = "border-transparent text-slate-400 hover:bg-[#334155] hover:text-slate-200";

// Barra lateral esquerda: adicionar nós por camada, ferramentas de desenho, vista e painéis.
// Só apresentação — cada botão chama o callback que o App lhe dá.
export function BarraLateral({
  sector, sectorActivo, layerName, layerColor, onAdicionarNo,
  ferramentas, opcoes, vista3DActiva, painel3DAberto, onAlternarPainel3D,
  onZoomMais, onZoomMenos, onReporVista,
  relatorioAberto, onAlternarRelatorio, onGuardarModelo, bibliotecaAberta, onAlternarBiblioteca,
}) {
  const [camadaSobre, setCamadaSobre] = useState(null);
  return (
    <aside className="w-12 bg-[#1E293B] border-r border-[#334155] flex flex-col items-center py-3 gap-1 z-40 flex-shrink-0">
      {LAYER_KEYS.map(key=>(
        <button key={key} onClick={()=>onAdicionarNo(key)}
          onMouseEnter={()=>setCamadaSobre(key)} onMouseLeave={()=>setCamadaSobre(null)}
          title={`Adicionar ${layerName(key)}`}
          className="relative w-9 h-9 rounded-lg flex flex-col items-center justify-center border transition-all"
          style={{borderColor:layerColor(key)+"80",background:layerColor(key)+"18"}}>
          <span style={{color:layerColor(key)}}><IconeCamada sector={sector} camada={key} size={18} /></span>
          <span className="text-[5px] font-black" style={{color:layerColor(key)}}>{key}</span>
          {camadaSobre===key && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-[#0F172A] border border-[#334155] text-[9px] px-2 py-1 rounded-md whitespace-nowrap z-50 shadow-xl pointer-events-none">
              <div className="font-bold text-white" style={{color:layerColor(key)}}>{layerName(key)}</div>
              <div className="text-slate-400">{sectorActivo.desc[key]}</div>
            </div>
          )}
        </button>
      ))}

      <div className="w-6 h-px bg-[#334155] my-1"/>

      {[
        {icon:<Scissors size={15}/>, color:"#EF4444", tip:"Cortar (C)",          ...ferramentas.corte},
        {icon:<Type size={15}/>,     color:"#F59E0B", tip:"Nota",                ...ferramentas.nota},
        {icon:<Box size={15}/>,      color:"#60A5FA", tip:"Formas Geométricas",  ...ferramentas.formas},
        {icon:<Group size={15}/>,    color:"#16A34A", tip:"Contentor — desenha uma caixa para agrupar", ...ferramentas.contentor},
        {icon:<Image size={15}/>,    color:"#A78BFA", tip:"Fundo",               ...ferramentas.fundo},
      ].map(t=>(
        <button key={t.tip} onClick={t.fn} title={t.tip}
          className={`${botao} border ${t.active?"":"border-transparent text-slate-400 hover:bg-[#334155] hover:text-slate-100"}`}
          style={t.active?{borderColor:t.color,color:t.color,background:t.color+"18"}:{}}>
          {t.icon}
        </button>
      ))}

      <div className="w-6 h-px bg-[#334155] my-1"/>

      {[
        {icon:<Grid size={14}/>,   tip:"Grade de Pontos", ...opcoes.grelha},
        {icon:<Layers size={14}/>, tip:"Snap à Grade",    ...opcoes.snap},
        {icon:opcoes.silencio.active?<BellOff size={14}/>:<Bell size={14}/>, tip:"Modo Silencioso", ...opcoes.silencio},
      ].map(t=>(
        <button key={t.tip} onClick={t.fn} title={t.tip}
          className={`${botao} border text-slate-400
            ${t.active?"border-emerald-700 bg-emerald-900/30 text-emerald-400":"border-transparent hover:bg-[#334155] hover:text-slate-100"}`}>
          {t.icon}
        </button>
      ))}

      <div className="flex-1"/>

      <button onClick={onAlternarPainel3D} title="Rotação 3D"
        className={`${botao} border ${vista3DActiva||painel3DAberto?activoAzul:inactivo}`}>
        <Rotate3d size={15}/>
      </button>

      <button onClick={onZoomMais} title="Zoom +" className={`${botao} text-slate-400 hover:bg-[#334155] hover:text-white`}><ZoomIn size={14}/></button>
      <button onClick={onZoomMenos} title="Zoom -" className={`${botao} text-slate-400 hover:bg-[#334155] hover:text-white`}><ZoomOut size={14}/></button>
      <button onClick={onReporVista} title="Repor Vista" className={`${botao} text-slate-400 hover:bg-[#334155] hover:text-white text-[9px] font-bold`}>1:1</button>

      <div className="w-6 h-px bg-[#334155] my-1"/>

      <button onClick={onAlternarRelatorio} title="Relatório de Fluxo"
        className={`${botao} border ${relatorioAberto?activoAzul:inactivo}`}>
        <List size={14}/>
      </button>
      <button onClick={onGuardarModelo} title="Guardar como Modelo" className={`${botao} text-slate-400 hover:bg-[#334155] hover:text-emerald-400`}><BookmarkPlus size={14}/></button>
      <button onClick={onAlternarBiblioteca} title="Biblioteca"
        className={`${botao} border ${bibliotecaAberta?"border-emerald-700 bg-emerald-900/30 text-emerald-400":inactivo}`}>
        <Menu size={15}/>
      </button>
    </aside>
  );
}
