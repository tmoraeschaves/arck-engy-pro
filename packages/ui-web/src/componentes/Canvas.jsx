import { X, Rotate3d, Lock, Unlock } from "lucide-react";
import { GEO_SHAPES } from "../config/formas.js";
import { GRID_SIZE } from "../config/app-meta.js";
import { isValidLink } from "../lib/core-bridge.js";
import { lerImagemComoDataURL } from "../infra/persistencia.js";
import { ShapePreview } from "./FormasSVG.jsx";
import { No } from "./No.jsx";
import { Ligacao, MarcadoresLigacao } from "./Ligacao.jsx";
import { Anotacao } from "./Anotacao.jsx";
import { Forma } from "./Forma.jsx";

/**
 * O mundo do diagrama: o `<main>` com o mundo 3D, a camada SVG (formas, ligações,
 * nós, anotações) e os painéis flutuantes que vivem por cima do canvas.
 * Recebe tudo por props — não tem estado próprio. Fatia 5 do Movimento 7.
 */
export function Canvas({
  canvasRef, bgInputRef,
  // documento
  nodes, connections, shapes, annotations, bgImage, bgOpacity, bgLocked, freeMode, silentMode, sector,
  // vista
  zoom, offset, is3D, rotX, rotY, rotZ, draggingRot, centro3D,
  setZoom, setIsPanning, setPanStart, setDraggingRot, setIs3D,
  // selecção e modos de interacção
  selectedNode, setSelectedNode, selectedShapeId, setSelectedShapeId, allSelected, setAllSelected,
  editingAnnotId, setEditingAnnotId, annotationMode, setAnnotationMode,
  placingShapeType, setPlacingShapeType, showShapePicker, setShowShapePicker,
  cutMode, cutStart, cutEnd, showGrid, showBgPanel, setShowBgPanel,
  showLabels,
  setDraggingNode, setDraggingShape, setResizingShape,
  // acções de domínio
  dispatch, addAnnotation, placeShape, scaleLayout, connectNodes, removeNode, abrirModulos,
  // apresentação
  layerName, layerColor, paraCanvas,
}) {
  return (
    <main ref={canvasRef}
      className={`flex-1 relative overflow-hidden ${annotationMode||placingShapeType?"cursor-crosshair":""}`}
      style={{background:"#FAFAFA"}}
      onContextMenu={(e)=>{ if(is3D) e.preventDefault(); }}
      onMouseDown={(e)=>{
        // 3D right-click drag
        if (is3D && e.button===2) { e.preventDefault(); setDraggingRot({sx:e.clientX,sy:e.clientY,rx:rotX,ry:rotY}); return; }
        if (is3D) return; // block all edit interactions in 3D mode
        if ((annotationMode||placingShapeType)&&e.button===0&&canvasRef.current) {
          const r=canvasRef.current.getBoundingClientRect();
          const cx=(e.clientX-r.left-offset.x)/zoom, cy=(e.clientY-r.top-offset.y)/zoom;
          if (annotationMode){addAnnotation(cx,cy);setAnnotationMode(false);}
          else {placeShape(cx,cy);}
          e.stopPropagation(); return;
        }
        if (e.button===1||(e.button===0&&e.altKey)){setIsPanning(true);setPanStart({x:e.clientX,y:e.clientY});}
        if (e.button===0&&!annotationMode&&!placingShapeType){setAllSelected(false);setSelectedShapeId(null);}
      }}
      onWheel={(e)=>{e.preventDefault();setZoom(p=>Math.max(0.2,Math.min(3,p-e.deltaY*0.001)));}}
      onDragOver={(e)=>{ e.preventDefault(); }}
      onDrop={async (e)=>{
        e.preventDefault();
        const ficheiro = [...(e.dataTransfer?.files || [])].find(f => f.type.startsWith("image/"));
        if (!ficheiro) return;
        const url = await lerImagemComoDataURL(ficheiro);
        dispatch({ tipo: "DEFINIR_FUNDO", img: url });
      }}
    >
      {/* ── 3D WORLD (rotates) ─────────────────────────────────────── */}
      {/* `preserve-3d` só quando estamos mesmo em 3D: no Chrome, um ancestral com
          preserve-3d faz o <foreignObject> das notas renderizar em branco (nota
          existe no DOM mas não se vê nada). Em 2D fica `flat`. */}
      <div style={{
        position:"absolute", inset:0,
        transform: is3D ? `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)` : "none",
        transformOrigin: is3D ? centro3D : "center center",
        transformStyle: is3D ? "preserve-3d" : "flat",
        willChange: is3D ? "transform" : "auto",
        transition: draggingRot ? "none" : "transform 0.18s ease",
        cursor: is3D ? (draggingRot ? "grabbing" : "grab") : undefined,
      }}>

      {bgImage && <img src={bgImage} alt="bg" className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{opacity:bgOpacity,transform:`translate(${offset.x}px,${offset.y}px) scale(${zoom})`,transformOrigin:"0 0"}}/>}

      {/* grelha de pontos — desenhada na camada SVG (ver mais abaixo), alinhada
          exactamente com os pontos de snap (múltiplos de GRID_SIZE) */}

      {/* Ctrl+A scale bar */}
      {allSelected && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-[#1E293B] border border-[#334155] rounded-full shadow-xl px-5 py-2 flex items-center gap-4">
          <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">Escala do Layout</span>
          <button onClick={()=>scaleLayout(0.8)} className="w-7 h-7 rounded-full bg-[#334155] text-white text-sm font-bold hover:bg-slate-500 flex items-center justify-center">−</button>
          <span className="text-[10px] text-slate-300 w-20 text-center">{nodes.length} nós selec.</span>
          <button onClick={()=>scaleLayout(1.2)} className="w-7 h-7 rounded-full bg-[#334155] text-white text-sm font-bold hover:bg-slate-500 flex items-center justify-center">+</button>
          <button onClick={()=>setAllSelected(false)} className="text-[9px] text-slate-400 hover:text-slate-200 ml-2">ESC</button>
        </div>
      )}

      {/* fundo panel */}
      {showBgPanel && (
        <div className="absolute top-3 right-3 z-40 bg-[#1E293B] border border-[#334155] p-4 w-56 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center mb-3"><span className="text-[11px] font-bold text-white">Plano de Fundo</span><button onClick={()=>setShowBgPanel(false)} className="text-slate-400 hover:text-white"><X size={14}/></button></div>
          <button onClick={()=>{if(!bgLocked) bgInputRef.current.click();}} disabled={bgLocked}
            title={bgLocked?"Fundo trancado — destranca primeiro para o mudar":undefined}
            className={`w-full mb-2 py-2 text-[10px] font-bold rounded-lg transition-all ${bgLocked?"bg-slate-800 text-slate-600 cursor-not-allowed":"bg-emerald-700 text-white hover:bg-emerald-600"}`}>CARREGAR IMAGEM</button>
          <input type="file" ref={bgInputRef} className="hidden" accept="image/*" onChange={async e=>{const f=e.target.files[0];if(!f)return;const url=await lerImagemComoDataURL(f);dispatch({tipo:"DEFINIR_FUNDO",img:url});}}/>
          <div className="text-[8px] text-slate-400 mb-2 text-center leading-relaxed">{bgLocked?"fundo trancado — arrastar e colar não mudam nada":<>ou arrasta uma imagem para o canvas,<br/>ou cola com Ctrl+V</>}</div>
          {bgImage&&(<>
            <div className="mb-2"><div className="text-[9px] font-bold text-slate-400 mb-1">OPACIDADE: {Math.round(bgOpacity*100)}%</div><input type="range" min="0.05" max="1" step="0.05" value={bgOpacity} onChange={e=>dispatch({tipo:"DEFINIR_OPACIDADE_FUNDO",opacidade:parseFloat(e.target.value)})} className="w-full accent-emerald-500"/></div>
            <button onClick={()=>dispatch({tipo:"ALTERNAR_BLOQUEIO_FUNDO"})} title={bgLocked?"Destrancar o fundo":"Trancar o fundo (fecha-o: nem remover nem substituir)"}
              className={`w-full mb-2 py-1.5 flex items-center justify-center gap-1.5 border text-[10px] font-bold rounded-lg transition-all
                ${bgLocked?"border-amber-600 bg-amber-900/30 text-amber-400 hover:bg-amber-900/50":"border-[#334155] text-slate-300 hover:bg-[#334155]"}`}>
              {bgLocked?<Lock size={12}/>:<Unlock size={12}/>} {bgLocked?"TRANCADO":"TRANCAR FUNDO"}
            </button>
            <button onClick={()=>{if(!bgLocked) dispatch({tipo:"DEFINIR_FUNDO",img:null});}} disabled={bgLocked} title={bgLocked?"Destranca o fundo primeiro para o remover":undefined}
              className={`w-full py-1 border text-[10px] font-bold rounded-lg transition-all
                ${bgLocked?"border-slate-700 text-slate-600 cursor-not-allowed":"border-red-700 text-red-400 hover:bg-red-900/20"}`}>REMOVER</button>
          </>)}
        </div>
      )}

      {/* shape picker */}
      {showShapePicker && (
        <div className="absolute top-3 left-3 z-40 bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl w-76 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-[#334155]">
            <span className="text-[11px] font-bold text-white">Formas Geométricas</span>
            <button onClick={()=>{setShowShapePicker(false);setPlacingShapeType(null);}} className="text-slate-400 hover:text-white"><X size={14}/></button>
          </div>
          {["Sólidos","Poliedros","Prismas","Curvos","Especiais"].map(group=>{
            const gs=GEO_SHAPES.filter(s=>s.group===group); if(!gs.length) return null;
            return (<div key={group} className="p-3">
              <div className="text-[8px] font-bold text-slate-300 uppercase tracking-wider mb-2">{group}</div>
              <div className="grid grid-cols-4 gap-2">
                {gs.map(s=>(
                  <button key={s.id} onClick={()=>{setPlacingShapeType(s.id);setShowShapePicker(false);}} title={s.name}
                    className={`flex flex-col items-center p-1 rounded-lg border transition-all hover:border-emerald-500 hover:bg-emerald-900/20
                      ${placingShapeType===s.id?"border-emerald-500 bg-emerald-900/30":"border-[#334155] bg-[#0F172A]"}`}>
                    <ShapePreview shape={s} size={44}/>
                    <span className="text-[7px] text-slate-200 text-center leading-tight mt-0.5">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>);
          })}
        </div>
      )}

      {/* SVG layer */}
      <svg className="absolute inset-0 w-full h-full" style={{transformOrigin:"0 0",pointerEvents:"none"}}>
        <defs>
          <pattern id="grelha-pontos" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            {/* círculo no canto (0,0): quando o padrão ladrilha, os quartos de
                círculo vizinhos juntam-se num ponto inteiro em cada intersecção
                da grelha — que é onde o snap encaixa os nós */}
            <circle cx={0} cy={0} r={1.6} fill="#64748B" />
          </pattern>
        </defs>
        <g transform={`translate(${offset.x},${offset.y}) scale(${zoom})`} style={{pointerEvents:"all"}}>

          {showGrid && <rect x={-100000} y={-100000} width={200000} height={200000}
            fill="url(#grelha-pontos)" style={{pointerEvents:"none"}} />}

          {/* Formas com alças de redimensionar */}
          {shapes.map(sh => {
            const def = GEO_SHAPES.find(s => s.id === sh.type); if (!def) return null;
            return (
              <Forma key={sh.id} forma={sh} definicao={def} seleccionada={selectedShapeId === sh.id}
                paraCanvas={paraCanvas}
                onSeleccionar={setSelectedShapeId}
                onIniciarArrasto={setDraggingShape}
                onIniciarRedimensionar={setResizingShape}
                onAlternarTrava={id => dispatch({ tipo: "ALTERNAR_TRAVA_FORMA", id })}
                onRemover={id => { dispatch({ tipo: "REMOVER_FORMA", id }); setSelectedShapeId(null); }} />
            );
          })}

          {/* Cut line */}
          {cutMode&&cutStart&&cutEnd&&<line x1={cutStart.x} y1={cutStart.y} x2={cutEnd.x} y2={cutEnd.y} stroke="#EF4444" strokeWidth="2.5" strokeDasharray="10,8" style={{pointerEvents:"none"}}/>}

          {/* Conexões */}
          <MarcadoresLigacao />
          {connections.map(conn => {
            const src = nodes.find(n => n.id === conn.sourceId), tgt = nodes.find(n => n.id === conn.targetId); if (!src || !tgt) return null;
            const valid = isValidLink(src.layer, tgt.layer);
            const retorno = src.layer === "L5" && tgt.layer === "L2";
            const cor = silentMode ? "#475569" : freeMode ? "#F59E0B" : valid ? "#10B981" : "#EF4444";
            const marcador = silentMode ? "arr-mute" : freeMode ? "arr-free" : valid ? "arr-ok" : "arr-err";
            return (
              <Ligacao key={conn.id} id={conn.id} origem={src} destino={tgt} cor={cor} marcador={marcador} retorno={retorno}
                onDesligar={id => dispatch({ tipo: "DESLIGAR", id })} />
            );
          })}

          {/* Nós */}
          {nodes.map(node => (
            <No key={node.id} node={node} sector={sector} cor={layerColor(node.layer)}
              seleccionado={selectedNode?.id === node.id} todosSeleccionados={allSelected}
              mostrarRotulo={showLabels} rotulo={layerName(node.layer)}
              onIniciarArrasto={setDraggingNode}
              onClicar={id => { setSelectedShapeId(null); if (!allSelected) { selectedNode ? connectNodes(id) : setSelectedNode(node); } }}
              onAbrir={abrirModulos}
              onAlternarTrava={id => dispatch({ tipo: "ALTERNAR_TRAVA_NO", id })}
              onRemover={removeNode} />
          ))}

          {/* Anotações */}
          {annotations.map(ann => (
            <Anotacao key={ann.id} anotacao={ann} aEditar={editingAnnotId === ann.id}
              onAlternar={id => dispatch({ tipo: "ALTERNAR_ANOTACAO", id })}
              onEditarTexto={(id, text) => dispatch({ tipo: "EDITAR_ANOTACAO", id, text })}
              onComecarEdicao={setEditingAnnotId}
              onDefinirCor={(id, cor) => dispatch({ tipo: "DEFINIR_COR_ANOTACAO", id, cor })}
              onRemover={id => dispatch({ tipo: "REMOVER_ANOTACAO", id })} />
          ))}
        </g>
      </svg>

      </div>{/* end 3D world */}

      {/* 3D mode overlay */}
      {is3D && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.25) 100%)"}}/>
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-blue-950/95 border border-blue-500 rounded-full px-4 py-1.5 text-[10px] font-bold text-white flex items-center gap-3 pointer-events-auto shadow-xl">
            <Rotate3d size={12} className="text-blue-300"/>
            <span>VISTA 3D — só rotação (btn direito + arrasta). Edição em pausa.</span>
            <button onClick={()=>setIs3D(false)} className="bg-blue-600 hover:bg-blue-500 text-white ml-1 text-[9px] font-black px-2 py-0.5 rounded-full">VOLTAR A EDITAR ✕</button>
          </div>
        </div>
      )}

      {/* hints */}
      {!is3D && (annotationMode||placingShapeType||cutMode)&&(
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full text-[10px] font-bold text-white shadow-lg pointer-events-none"
          style={{background:annotationMode?"#F59E0B":cutMode?"#EF4444":"#3B82F6"}}>
          {annotationMode&&"MODO NOTA — clica no canvas · ESC cancela"}
          {placingShapeType&&`COLOCAR ${GEO_SHAPES.find(s=>s.id===placingShapeType)?.name?.toUpperCase()} — clica para posicionar · ESC cancela`}
          {cutMode&&"MODO CORTE — arrasta sobre ligações · ESC cancela"}
        </div>
      )}

      {/* canvas vazio */}
      {!nodes.length&&!shapes.length&&!placingShapeType&&(
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-5xl mb-4 opacity-10">⬡</div>
            <div className="text-sm font-bold text-slate-400">Architect & Engineer</div>
            <div className="text-[11px] text-slate-400 mt-1">Sidebar esquerda: adiciona nós L1–L5 ou formas geométricas</div>
            <div className="text-[9px] text-slate-600 mt-2">Ctrl+A seleciona tudo · ? abre tutorial</div>
          </div>
        </div>
      )}
    </main>
  );
}
