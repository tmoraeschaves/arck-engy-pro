import React, { useState, useReducer, useRef, useEffect, useMemo, useCallback } from "react";
import {
  RotateCcw, Download, Upload, Shield, X, Scissors,
  Lock, Unlock, Bell, BellOff, Image, Shapes, FileText,
  Type, ChevronDown, ChevronUp, FileImage, Save, Trash2,
  ZoomIn, ZoomOut, Grid, Layers, Menu, Box,
  BookmarkPlus, GripHorizontal, List, Maximize2, Minimize2, Rotate3d
} from "lucide-react";

import { uid } from "./lib/uid.js";
import { LAYERS, LAYER_KEYS } from "./config/camadas.jsx";
import { SECTORS } from "./config/sectores.js";
import { GEO_SHAPES } from "./config/formas.js";
import { TEMPLATES } from "./config/templates.js";
import { TUTORIAL_STEPS } from "./config/tutorial.js";
import { METRICS, GRID_SIZE, LIMITE_3D } from "./config/app-meta.js";
import {
  toNo, toLigacoes, toModo, isValidLink, displayTensao,
  validarNovaLigacao, medirTensao, interpretarTensao,
} from "./lib/core-bridge.js";
import { computeFlowReport } from "./lib/flow-report.js";
import {
  guardarProjetoLocal, apagarProjetoLocal, descarregarProjeto, lerFicheiroJSON,
  lerModelos, guardarModelos, guardarSectorLocal,
} from "./infra/persistencia.js";
import { construirSVG, exportarSVG, exportarPNG } from "./infra/exportar.js";
import { ShapeElements, ShapePreview } from "./componentes/FormasSVG.jsx";
import { projetoReducer, estadoInicial, snapshot } from "./hooks/projeto-reducer.js";

// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  // ── documento (nós, ligações, formas, anotações, cores, fundo, sector, modo) ──
  const [projeto, dispatch] = useReducer(projetoReducer, undefined, () => ({
    ...estadoInicial,
    sector: localStorage.getItem("ae_sector") || null,
  }));
  const { nodes, connections, shapes, annotations, customColors, bgImage, bgOpacity, sector, freeMode } = projeto;

  // ── estado de interacção efémero ──────────────────────────────────────────
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [cutMode, setCutMode] = useState(false);
  const [cutStart, setCutStart] = useState(null);
  const [cutEnd, setCutEnd] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [lockNodes, setLockNodes] = useState(false);
  const [showLabels] = useState(true); // sempre visível por agora — sem toggle na UI
  const [showGrid, setShowGrid] = useState(false);

  // ── estados avançados ─────────────────────────────────────────────────────
  const [silentMode, setSilentMode] = useState(false);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [editingAnnotId, setEditingAnnotId] = useState(null);
  const [showBgPanel, setShowBgPanel] = useState(false);

  // ── modais de arranque ────────────────────────────────────────────────────
  const [showSectorModal, setShowSectorModal] = useState(() => !localStorage.getItem("ae_sector"));
  const [showTutorial, setShowTutorial] = useState(() => !localStorage.getItem("ae_tutorial") && !!localStorage.getItem("ae_sector"));
  const [tutorialStep, setTutorialStep] = useState(0);

  // ── formas geométricas (interacção efémera) ───────────────────────────────
  const [placingShapeType, setPlacingShapeType] = useState(null);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [draggingShape, setDraggingShape] = useState(null);
  const [resizingShape, setResizingShape] = useState(null); // {id, corner, origX,origY,origW,origH,mx,my}
  const [showShapePicker, setShowShapePicker] = useState(false);

  // ── biblioteca flutuante ──────────────────────────────────────────────────
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryTab, setLibraryTab] = useState("layers");
  const [libPos, setLibPos] = useState({ x: 860, y: 70 });
  const [draggingLib, setDraggingLib] = useState(null); // {sx,sy,ox,oy}

  // ── modelos de utilizador ─────────────────────────────────────────────────
  const [userModels, setUserModels] = useState(lerModelos);
  const [saveModelName, setSaveModelName] = useState("");
  const [showSaveModel, setShowSaveModel] = useState(false);

  // ── escala / seleção total ────────────────────────────────────────────────
  const [allSelected, setAllSelected] = useState(false);

  // ── relatório de fluxo ────────────────────────────────────────────────────
  const [showFlowReport, setShowFlowReport] = useState(false);

  // ── 3D rotation ───────────────────────────────────────────────────────────
  const [is3D, setIs3D] = useState(false);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);
  const [draggingRot, setDraggingRot] = useState(null); // {sx,sy,rx,ry}
  const [show3DPanel, setShow3DPanel] = useState(false);
  const [panel3DPos, setPanel3DPos] = useState({ x: 400, y: 70 });
  const [dragging3DPanel, setDragging3DPanel] = useState(null);

  // ── telemetria ────────────────────────────────────────────────────────────
  const [systemLoad, setSystemLoad] = useState(0);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const bgInputRef = useRef(null);

  // ── computed ──────────────────────────────────────────────────────────────
  const activeSector = useMemo(() => sector ? SECTORS[sector] : SECTORS.engenharia, [sector]);
  const layerName  = useCallback(k => activeSector.names[k] || k, [activeSector]);
  const layerColor = useCallback(k => customColors[k] || LAYERS[k]?.color || "#666", [customColors]);

  const analysis = useMemo(() => {
    const conflicts = connections.filter(c => { const s=nodes.find(n=>n.id===c.sourceId),t=nodes.find(n=>n.id===c.targetId); return s&&t&&!isValidLink(s.layer,t.layer); }).length;
    const cycles   = connections.filter(c => { const s=nodes.find(n=>n.id===c.sourceId),t=nodes.find(n=>n.id===c.targetId); return s?.layer==="L5"&&t?.layer==="L2"; }).length;
    return { nodeCount:nodes.length, connCount:connections.length, conflicts, cycles };
  }, [nodes, connections]);

  const health = useMemo(() =>
    medirTensao(toLigacoes(connections, nodes), toModo(freeMode)),
  [connections, nodes, freeMode]);

  const estadoTensao = useMemo(() => interpretarTensao(health), [health]);

  const healthColor = estadoTensao === "INERCIA" ? "#64748B" : health >= 99 ? "#10B981" : health >= 70 ? "#F59E0B" : "#EF4444";

  const flowReport = useMemo(() => computeFlowReport(nodes, connections), [nodes, connections]);

  // Ponto de pivô do mundo 3D: centro do desenho em coordenadas de ecrã
  // (para a inclinação girar à volta da estrutura, não do centro da janela).
  const centro3D = useMemo(() => {
    if (!nodes.length) return "center center";
    const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    return `${cx * zoom + offset.x}px ${cy * zoom + offset.y}px`;
  }, [nodes, zoom, offset]);

  // ── telemetria FIX ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!nodes.length) { setSystemLoad(0); return; }
    const id = setInterval(() => {
      setSystemLoad(30 + nodes.length*5 + connections.length*2 + Math.sin(Date.now()/900)*8 + Math.random()*2);
    }, 120);
    return () => clearInterval(id);
  }, [nodes.length, connections.length]);

  // ── teclado ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onUp = () => {
      if (cutMode && cutStart && cutEnd) cutConnections(cutStart, cutEnd);
      setDraggingNode(null); setIsPanning(false); setDraggingShape(null);
      setResizingShape(null); setDraggingLib(null);
      setDraggingRot(null); setDragging3DPanel(null);
      setCutMode(false); setCutStart(null); setCutEnd(null);
    };
    const onKey = (e) => {
      if (e.key==="Escape") { setSelectedNode(null); setCutMode(false); setAnnotationMode(false); setEditingAnnotId(null); setPlacingShapeType(null); setShowShapePicker(false); setAllSelected(false); setIs3D(false); }
      if (e.key==="a" && e.ctrlKey) { e.preventDefault(); setAllSelected(p=>!p); setSelectedNode(null); }
      if (e.key==="Delete") {
        if (selectedNode) removeNode(selectedNode.id);
        if (selectedShapeId) { dispatch({ tipo:"REMOVER_FORMA", id:selectedShapeId }); setSelectedShapeId(null); }
      }
      if (e.key==="c" && !e.ctrlKey) { e.preventDefault(); setCutMode(true); }
      if (e.key==="+"||e.key==="=") setZoom(p=>Math.min(p+0.1,3));
      if (e.key==="-") setZoom(p=>Math.max(p-0.1,0.2));
      if (e.key==="0") { setZoom(1); setOffset({x:0,y:0}); }
    };
    const onDown = (e) => {
      if (cutMode && !cutStart && canvasRef.current) {
        const r = canvasRef.current.getBoundingClientRect();
        const p = { x:(e.clientX-r.left-offset.x)/zoom, y:(e.clientY-r.top-offset.y)/zoom };
        setCutStart(p); setCutEnd(p);
      }
    };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => { window.removeEventListener("mouseup",onUp); window.removeEventListener("keydown",onKey); window.removeEventListener("mousedown",onDown); };
  }, [cutMode, cutStart, cutEnd, selectedNode, selectedShapeId, zoom, offset]);

  // ── mouse move (canvas + library drag) ───────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    // 3D panel drag
    if (dragging3DPanel) {
      setPanel3DPos({ x: dragging3DPanel.ox + e.clientX - dragging3DPanel.sx, y: dragging3DPanel.oy + e.clientY - dragging3DPanel.sy });
      return;
    }
    // 3D rotation drag (right-click) — limitado a ±LIMITE_3D para nunca ir edge-on
    if (draggingRot) {
      const lim = v => Math.max(-LIMITE_3D, Math.min(LIMITE_3D, v));
      setRotY(lim(draggingRot.ry + (e.clientX - draggingRot.sx) * 0.4));
      setRotX(lim(draggingRot.rx + (e.clientY - draggingRot.sy) * 0.4));
      return;
    }
    // Block all canvas interactions in 3D view mode
    if (is3D) return;
    // Library panel drag (screen-level, no canvas transform)
    if (draggingLib) {
      setLibPos({ x: draggingLib.ox + e.clientX - draggingLib.sx, y: draggingLib.oy + e.clientY - draggingLib.sy });
      return;
    }
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left - offset.x) / zoom;
    const cy = (e.clientY - rect.top - offset.y) / zoom;

    if (resizingShape) {
      const dx = (e.clientX - resizingShape.mx) / zoom;
      const dy = (e.clientY - resizingShape.my) / zoom;
      let { x, y, w, h } = { x:resizingShape.ox, y:resizingShape.oy, w:resizingShape.ow, h:resizingShape.oh };
      if (resizingShape.corner.includes("r")) w = Math.max(40, resizingShape.ow + dx);
      if (resizingShape.corner.includes("b")) h = Math.max(40, resizingShape.oh + dy);
      if (resizingShape.corner.includes("l")) { x = resizingShape.ox + dx; w = Math.max(40, resizingShape.ow - dx); }
      if (resizingShape.corner.includes("t")) { y = resizingShape.oy + dy; h = Math.max(40, resizingShape.oh - dy); }
      dispatch({ tipo: "REDIMENSIONAR_FORMA", id: resizingShape.id, x, y, w, h });
      return;
    }
    if (draggingNode && !lockNodes) {
      let x = cx, y = cy;
      if (snapToGrid) { x = Math.round(x/GRID_SIZE)*GRID_SIZE; y = Math.round(y/GRID_SIZE)*GRID_SIZE; }
      dispatch({ tipo: "MOVER_NO", id: draggingNode.id, x, y });
      return;
    }
    if (draggingShape) {
      dispatch({ tipo: "MOVER_FORMA", id: draggingShape.id, x: cx - draggingShape.ox, y: cy - draggingShape.oy });
      return;
    }
    if (isPanning) {
      setOffset(p => ({ x:p.x+e.clientX-panStart.x, y:p.y+e.clientY-panStart.y }));
      setPanStart({ x:e.clientX, y:e.clientY });
      return;
    }
    if (cutMode && cutStart) {
      setCutEnd({ x:cx, y:cy });
    }
  }, [draggingLib, resizingShape, draggingNode, draggingShape, isPanning, cutMode, cutStart, zoom, offset, snapToGrid, lockNodes]);

  // ── nós ───────────────────────────────────────────────────────────────────
  const addNode = useCallback((layerKey) => {
    let x = 200+Math.random()*250, y = 150+Math.random()*200;
    if (snapToGrid) { x=Math.round(x/GRID_SIZE)*GRID_SIZE; y=Math.round(y/GRID_SIZE)*GRID_SIZE; }
    dispatch({ tipo: "ADICIONAR_NO", no: { id:`node_${uid()}`, layer:layerKey, x, y, createdAt:Date.now() } });
  }, [snapToGrid]);

  const removeNode = useCallback((id) => {
    dispatch({ tipo: "REMOVER_NO", id });
    setSelectedNode(prev => prev?.id === id ? null : prev);
  }, []);

  const connectNodes = useCallback((targetId) => {
    if (selectedNode && selectedNode.id!==targetId) {
      const src=nodes.find(n=>n.id===selectedNode.id), tgt=nodes.find(n=>n.id===targetId);
      if (!src||!tgt) return;
      const permitido = freeMode || validarNovaLigacao(toNo(src), toNo(tgt), toLigacoes(connections, nodes)).valida;
      if (permitido) {
        dispatch({ tipo: "LIGAR", ligacao: { id:`conn_${uid()}`, sourceId:selectedNode.id, targetId } });
      } else if (!silentMode) {
        alert(`⚠️ Fluxo inválido: ${layerName(src.layer)} → ${layerName(tgt.layer)}\n\nUsa Modo Livre para ligações sem restrições.`);
      }
    }
    setSelectedNode(null);
  }, [selectedNode, connections, nodes, silentMode, freeMode, layerName]);

  const cutConnections = useCallback((start,end) => {
    if (!start||!end) return;
    const len = Math.hypot(end.x-start.x,end.y-start.y); if (!len) return;
    const thresh = 15/zoom;
    const ids = connections.filter(c => {
      const s=nodes.find(n=>n.id===c.sourceId), t=nodes.find(n=>n.id===c.targetId); if(!s||!t) return false;
      for (let i=0;i<=1;i+=0.1) { const px=s.x+(t.x-s.x)*i,py=s.y+(t.y-s.y)*i; if(Math.abs((end.x-start.x)*(start.y-py)-(start.x-px)*(end.y-start.y))/len<thresh) return true; }
      return false;
    }).map(c => c.id);
    if (ids.length) dispatch({ tipo: "CORTAR_LIGACOES", ids });
  }, [connections, nodes, zoom]);

  // ── escala de layout ──────────────────────────────────────────────────────
  const scaleLayout = useCallback((factor) => dispatch({ tipo: "ESCALAR_LAYOUT", fator: factor }), []);

  // ── formas ────────────────────────────────────────────────────────────────
  const placeShape = useCallback((cx,cy) => {
    if (!placingShapeType) return;
    dispatch({ tipo: "ADICIONAR_FORMA", forma: { id:`shape_${uid()}`, type:placingShapeType, x:cx-70, y:cy-70, w:140, h:140 } });
    setPlacingShapeType(null);
  }, [placingShapeType]);

  // ── anotações ─────────────────────────────────────────────────────────────
  const addAnnotation = useCallback((x,y) => {
    const id=`ann_${uid()}`;
    dispatch({ tipo: "ADICIONAR_ANOTACAO", anotacao: { id, x, y, text:"", expanded:true } });
    setEditingAnnotId(id);
  }, []);

  // ── modelos ───────────────────────────────────────────────────────────────
  const saveModel = useCallback(() => {
    if (!saveModelName.trim()) return;
    const m = { id:uid(), name:saveModelName.trim(), ...snapshot(projeto), createdAt:Date.now() };
    const upd=[m,...userModels]; setUserModels(upd); guardarModelos(upd);
    setSaveModelName(""); setShowSaveModel(false);
  }, [saveModelName, projeto, userModels]);

  const loadModel = useCallback((m) => {
    dispatch({ tipo: "CARREGAR_PROJETO", projeto: m });
    if (m.sector) guardarSectorLocal(m.sector);
    setShowLibrary(false);
  }, []);

  // ── persistência ──────────────────────────────────────────────────────────
  const saveProject = useCallback(() => {
    const projetoSnap = snapshot(projeto);
    guardarProjetoLocal(projetoSnap);
    descarregarProjeto(projetoSnap);
  }, [projeto]);

  const loadProject = useCallback(async (e) => {
    const file=e.target.files[0]; if(!file) return;
    try {
      const d=await lerFicheiroJSON(file);
      dispatch({ tipo: "CARREGAR_PROJETO", projeto: d });
      if(d.sector) guardarSectorLocal(d.sector);
    } catch{ if(!silentMode) alert("Erro ao carregar ficheiro"); }
  }, [silentMode]);

  const resetSystem = useCallback(() => {
    if(window.confirm("Resetar toda a arquitectura?")) {
      dispatch({ tipo: "RESETAR" });
      setSelectedNode(null); setSelectedShapeId(null);
      apagarProjetoLocal();
    }
  }, []);

  // ── exportação ────────────────────────────────────────────────────────────
  const buildSVG = useCallback(
    () => construirSVG({ nodes, connections, shapes, corDaCamada: layerColor, modoLivre: freeMode }),
    [nodes,connections,shapes,layerColor,freeMode],
  );

  const exportSVG = useCallback(() => exportarSVG(buildSVG()), [buildSVG]);
  const exportPNG = useCallback(() => exportarPNG(buildSVG(), nodes), [buildSVG,nodes]);

  const selectSector = useCallback((key)=>{
    dispatch({ tipo: "DEFINIR_SECTOR", sector: key });guardarSectorLocal(key);setShowSectorModal(false);
    if(!localStorage.getItem("ae_tutorial")){setTutorialStep(0);setShowTutorial(true);}
  },[]);

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col h-screen overflow-hidden select-none" style={{fontFamily:"'Inter',system-ui,sans-serif",background:"#0F172A"}}>

      {/* ── SECTOR MODAL ────────────────────────────────────────────────── */}
      {showSectorModal && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center">
          <div className="bg-[#1E293B] border border-[#334155] w-[640px] max-w-[95vw] rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-[#059669] to-[#0891b2] px-8 py-6">
              <div className="text-2xl font-black text-white tracking-tight">Architect & Engineer</div>
              <div className="text-sm text-white/80 mt-1">Seleciona o sector para calibrar as camadas L1–L5</div>
            </div>
            <div className="p-5 grid grid-cols-4 gap-3">
              {Object.entries(SECTORS).map(([key,s])=>(
                <button key={key} onClick={()=>selectSector(key)} className="p-4 rounded-lg border border-[#334155] hover:border-emerald-500 hover:bg-[#0F2D21] text-center transition-all group cursor-pointer">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-[11px] font-black text-white group-hover:text-emerald-400">{s.name}</div>
                  <div className="text-[8px] text-slate-400 mt-1">{Object.values(s.names).slice(0,3).join("·")}</div>
                </button>
              ))}
            </div>
            <div className="border-t border-[#334155] px-5 py-3 flex justify-end">
              <button onClick={()=>{dispatch({tipo:"DEFINIR_SECTOR",sector:"engenharia"});setShowSectorModal(false);}} className="text-[10px] text-slate-400 hover:text-white font-bold">USAR ENGENHARIA POR PADRÃO →</button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 bg-[#0F172A] border-b border-[#1E293B] z-50">
        {/* gradient strip */}
        <div className="h-8 bg-gradient-to-r from-[#059669] to-[#0891b2] flex items-center justify-between px-4">
          <div className="flex items-center gap-3 text-[10px] font-bold">
            <span className="font-black text-white text-sm">A&amp;E</span>
            <span className="text-white/60">·</span>
            <span className="text-white">v{METRICS.version}</span>
            <span className="text-white/60">·</span>
            <span className="text-white">{METRICS.kernel}</span>
            <span className="text-white/60">·</span>
            <span className="text-white">{activeSector.icon} {activeSector.name.toUpperCase()}</span>
            {silentMode && <span className="bg-white/20 px-2 py-0.5 rounded-full text-white text-[9px]">🔇 QUIETO</span>}
            {freeMode   && <span className="bg-amber-400/30 px-2 py-0.5 rounded-full text-white text-[9px]">🔓 LIVRE</span>}
          </div>
          <span className="text-white text-[10px] font-black tracking-widest opacity-95">ARCHITECT &amp; ENGINEER</span>
        </div>

        {/* main row */}
        <div className="flex items-center h-14 px-4 gap-3">
          {/* integridade */}
          <div className="flex flex-col items-center justify-center h-10 w-28 rounded-lg border border-[#334155] px-3 flex-shrink-0">
            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">Integridade</span>
            <span className="text-base font-black leading-tight" style={{color:healthColor}}>{displayTensao(health, estadoTensao)}</span>
          </div>

          {/* sector tabs */}
          <div className="flex gap-1 border-l border-[#334155] pl-3 overflow-x-auto">
            {Object.entries(SECTORS).map(([key,s])=>(
              <button key={key} onClick={()=>{dispatch({tipo:"DEFINIR_SECTOR",sector:key});guardarSectorLocal(key);}}
                className={`px-2 h-7 text-[8px] font-bold rounded-md whitespace-nowrap transition-all
                  ${sector===key?"bg-emerald-700 text-white":"text-white hover:bg-[#1E293B]"}`}>
                {s.icon} {s.name}
              </button>
            ))}
          </div>

          {/* modo */}
          <button onClick={()=>dispatch({tipo:"ALTERNAR_MODO_LIVRE"})}
            className={`ml-1 px-3 h-7 text-[9px] font-black rounded-md border transition-all flex-shrink-0
              ${freeMode?"border-amber-500 bg-amber-500/10 text-amber-300":"border-emerald-700 bg-emerald-900/30 text-emerald-300"}`}>
            {freeMode?"🔓 LIVRE":"🔒 GUIADO"}
          </button>

          {/* export */}
          <div className="flex gap-1 border-l border-[#334155] pl-3 flex-shrink-0">
            {[
              {icon:<Upload size={14}/>,   fn:()=>fileInputRef.current.click(), tip:"Importar JSON"},
              {icon:<Download size={14}/>, fn:saveProject,                       tip:"Exportar JSON"},
              {icon:<Shapes size={14}/>,   fn:exportSVG,                         tip:"Exportar SVG"},
              {icon:<FileImage size={14}/>,fn:exportPNG,                          tip:"Exportar PNG"},
              {icon:<FileText size={14}/>, fn:()=>window.print(),                 tip:"Imprimir / PDF"},
              {icon:<RotateCcw size={14}/>,fn:resetSystem,                        tip:"Reset"},
            ].map((b,i)=>(
              <button key={i} onClick={b.fn} title={b.tip}
                className="w-7 h-7 flex items-center justify-center rounded-md text-white hover:bg-[#334155] transition-all">
                {b.icon}
              </button>
            ))}
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={loadProject}/>
          </div>

          {/* telemetria */}
          {nodes.length > 0 && (
            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-bold text-white/75">CARGA</span>
                <span className="text-sm font-black text-emerald-400">{Math.round(systemLoad)}%</span>
              </div>
              <div className="flex gap-0.5 h-7 items-end">
                {Array.from({length:12}).map((_,i)=>(
                  <div key={i} className="rounded-sm transition-all duration-150"
                    style={{width:3,background:`hsl(${150+i*3},65%,${45+i*2}%)`,height:`${Math.max(6,systemLoad*0.55+Math.sin(systemLoad*0.08+i*0.9)*18+i*1.5)}%`}}/>
                ))}
              </div>
            </div>
          )}

          {/* brand */}
          <div className="ml-3 text-right flex-shrink-0">
            <div className="text-xs font-black text-white tracking-tight">ARCHITECT <span className="text-emerald-400">&</span> ENGINEER</div>
            <div className="text-[8px] text-white/70">TIAGO MORAES CHAVES</div>
          </div>
        </div>
      </header>

      {/* ── WORKSPACE ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden" onMouseMove={handleMouseMove}>

        {/* LEFT SIDEBAR */}
        <aside className="w-12 bg-[#1E293B] border-r border-[#334155] flex flex-col items-center py-3 gap-1 z-40 flex-shrink-0">
          {LAYER_KEYS.map(key=>(
            <button key={key} onClick={()=>addNode(key)}
              onMouseEnter={()=>setHoveredNode(key)} onMouseLeave={()=>setHoveredNode(null)}
              title={`Adicionar ${layerName(key)}`}
              className="relative w-9 h-9 rounded-lg flex flex-col items-center justify-center border transition-all"
              style={{borderColor:layerColor(key)+"80",background:layerColor(key)+"18"}}>
              <span style={{color:layerColor(key)}}>{LAYERS[key].icon}</span>
              <span className="text-[5px] font-black" style={{color:layerColor(key)}}>{key}</span>
              {hoveredNode===key && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-[#0F172A] border border-[#334155] text-[9px] px-2 py-1 rounded-md whitespace-nowrap z-50 shadow-xl pointer-events-none">
                  <div className="font-bold text-white" style={{color:layerColor(key)}}>{layerName(key)}</div>
                  <div className="text-slate-400">{activeSector.desc[key]}</div>
                </div>
              )}
            </button>
          ))}

          <div className="w-6 h-px bg-[#334155] my-1"/>

          {[
            {icon:<Scissors size={15}/>,fn:()=>setCutMode(p=>!p),active:cutMode,color:"#EF4444",tip:"Cortar (C)"},
            {icon:<Type size={15}/>,fn:()=>{setAnnotationMode(p=>!p);setSelectedNode(null);},active:annotationMode,color:"#F59E0B",tip:"Nota"},
            {icon:<Box size={15}/>,fn:()=>setShowShapePicker(p=>!p),active:showShapePicker||!!placingShapeType,color:"#60A5FA",tip:"Formas Geométricas"},
            {icon:<Image size={15}/>,fn:()=>setShowBgPanel(p=>!p),active:!!bgImage||showBgPanel,color:"#A78BFA",tip:"Fundo"},
          ].map((t,i)=>(
            <button key={i} onClick={t.fn} title={t.tip}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${t.active?"":"border-transparent text-slate-400 hover:bg-[#334155] hover:text-slate-100"}`}
              style={t.active?{borderColor:t.color,color:t.color,background:t.color+"18"}:{}}>
              {t.icon}
            </button>
          ))}

          <div className="w-6 h-px bg-[#334155] my-1"/>

          {[
            {icon:<Grid size={14}/>,fn:()=>setShowGrid(p=>!p),active:showGrid,tip:"Grade de Pontos"},
            {icon:<Layers size={14}/>,fn:()=>setSnapToGrid(p=>!p),active:snapToGrid,tip:"Snap à Grade"},
            {icon:lockNodes?<Lock size={14}/>:<Unlock size={14}/>,fn:()=>setLockNodes(p=>!p),active:lockNodes,tip:"Travar Nós"},
            {icon:silentMode?<BellOff size={14}/>:<Bell size={14}/>,fn:()=>setSilentMode(p=>!p),active:silentMode,tip:"Modo Silencioso"},
          ].map((t,i)=>(
            <button key={i} onClick={t.fn} title={t.tip}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border text-slate-400
                ${t.active?"border-emerald-700 bg-emerald-900/30 text-emerald-400":"border-transparent hover:bg-[#334155] hover:text-slate-100"}`}>
              {t.icon}
            </button>
          ))}

          <div className="flex-1"/>

          <button onClick={()=>{setShow3DPanel(p=>!p);}} title="Rotação 3D"
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border
              ${is3D||show3DPanel?"border-blue-600 bg-blue-900/30 text-blue-400":"border-transparent text-slate-400 hover:bg-[#334155] hover:text-slate-200"}`}>
            <Rotate3d size={15}/>
          </button>

          <button onClick={()=>setZoom(p=>Math.min(p+0.15,3))} title="Zoom +" className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#334155] hover:text-white transition-all"><ZoomIn size={14}/></button>
          <button onClick={()=>setZoom(p=>Math.max(p-0.15,0.2))} title="Zoom -" className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#334155] hover:text-white transition-all"><ZoomOut size={14}/></button>
          <button onClick={()=>{setZoom(1);setOffset({x:0,y:0});}} title="Repor Vista" className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#334155] hover:text-white transition-all text-[9px] font-bold">1:1</button>

          <div className="w-6 h-px bg-[#334155] my-1"/>

          <button onClick={()=>setShowFlowReport(p=>!p)} title="Relatório de Fluxo"
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border
              ${showFlowReport?"border-blue-600 bg-blue-900/30 text-blue-400":"border-transparent text-slate-400 hover:bg-[#334155] hover:text-slate-200"}`}>
            <List size={14}/>
          </button>
          <button onClick={()=>setShowSaveModel(true)} title="Guardar como Modelo" className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#334155] hover:text-emerald-400 transition-all"><BookmarkPlus size={14}/></button>
          <button onClick={()=>{setShowLibrary(p=>!p);setLibraryTab("layers");}} title="Biblioteca"
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border
              ${showLibrary?"border-emerald-700 bg-emerald-900/30 text-emerald-400":"border-transparent text-slate-400 hover:bg-[#334155] hover:text-slate-200"}`}>
            <Menu size={15}/>
          </button>
        </aside>

        {/* CANVAS */}
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
        >
          {/* ── 3D WORLD (rotates) ─────────────────────────────────────── */}
          <div style={{
            position:"absolute", inset:0,
            transform: is3D ? `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)` : "none",
            transformOrigin: is3D ? centro3D : "center center",
            transformStyle: "preserve-3d",
            willChange: is3D ? "transform" : "auto",
            transition: draggingRot ? "none" : "transform 0.18s ease",
            cursor: is3D ? (draggingRot ? "grabbing" : "grab") : undefined,
          }}>

          {bgImage && <img src={bgImage} alt="bg" className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{opacity:bgOpacity,transform:`translate(${offset.x}px,${offset.y}px) scale(${zoom})`,transformOrigin:"0 0"}}/>}

          {showGrid && <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:`radial-gradient(circle,#CBD5E1 1px,transparent 1px)`,backgroundSize:`${GRID_SIZE*zoom}px ${GRID_SIZE*zoom}px`,backgroundPosition:`${offset.x}px ${offset.y}px`,opacity:0.5}}/>}

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
              <button onClick={()=>bgInputRef.current.click()} className="w-full mb-2 py-2 bg-emerald-700 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-600">CARREGAR IMAGEM</button>
              <input type="file" ref={bgInputRef} className="hidden" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>dispatch({tipo:"DEFINIR_FUNDO",img:ev.target.result});r.readAsDataURL(f);}}/>
              {bgImage&&(<><div className="mb-2"><div className="text-[9px] font-bold text-slate-400 mb-1">OPACIDADE: {Math.round(bgOpacity*100)}%</div><input type="range" min="0.05" max="1" step="0.05" value={bgOpacity} onChange={e=>dispatch({tipo:"DEFINIR_OPACIDADE_FUNDO",opacidade:parseFloat(e.target.value)})} className="w-full accent-emerald-500"/></div><button onClick={()=>dispatch({tipo:"DEFINIR_FUNDO",img:null})} className="w-full py-1 border border-red-700 text-red-400 text-[10px] font-bold rounded-lg hover:bg-red-900/20">REMOVER</button></>)}
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
            <g transform={`translate(${offset.x},${offset.y}) scale(${zoom})`} style={{pointerEvents:"all"}}>

              {/* Formas com resize handles */}
              {shapes.map(sh=>{
                const def=GEO_SHAPES.find(s=>s.id===sh.type); if(!def) return null;
                const isSel=selectedShapeId===sh.id;
                const corners = isSel ? [
                  {id:"tl",cx:sh.x,    cy:sh.y,     cursor:"nw-resize"},
                  {id:"tr",cx:sh.x+sh.w,cy:sh.y,    cursor:"ne-resize"},
                  {id:"bl",cx:sh.x,    cy:sh.y+sh.h, cursor:"sw-resize"},
                  {id:"br",cx:sh.x+sh.w,cy:sh.y+sh.h,cursor:"se-resize"},
                ] : [];
                return (
                  <g key={sh.id}>
                    {isSel && <rect x={sh.x-3} y={sh.y-3} width={sh.w+6} height={sh.h+6} fill="none" stroke="#60A5FA" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" rx="4" style={{pointerEvents:"none"}}/>}
                    <g onMouseDown={e=>{e.stopPropagation();setSelectedShapeId(sh.id);const r=canvasRef.current.getBoundingClientRect();const cx2=(e.clientX-r.left-offset.x)/zoom,cy2=(e.clientY-r.top-offset.y)/zoom;setDraggingShape({id:sh.id,ox:cx2-sh.x,oy:cy2-sh.y});}} onContextMenu={e=>{e.preventDefault();dispatch({tipo:"REMOVER_FORMA",id:sh.id});setSelectedShapeId(null);}} style={{cursor:"move",pointerEvents:"all"}}>
                      <ShapeElements shape={def} x={sh.x} y={sh.y} w={sh.w} h={sh.h} selected={isSel}/>
                    </g>
                    {corners.map(c=>(
                      <rect key={c.id} x={c.cx-5} y={c.cy-5} width={10} height={10} fill="white" stroke="#60A5FA" strokeWidth="1.5" rx="2"
                        style={{cursor:c.cursor,pointerEvents:"all"}}
                        onMouseDown={e=>{e.stopPropagation();setResizingShape({id:sh.id,corner:c.id,ox:sh.x,oy:sh.y,ow:sh.w,oh:sh.h,mx:e.clientX,my:e.clientY});}}/>
                    ))}
                  </g>
                );
              })}

              {/* Cut line */}
              {cutMode&&cutStart&&cutEnd&&<line x1={cutStart.x} y1={cutStart.y} x2={cutEnd.x} y2={cutEnd.y} stroke="#EF4444" strokeWidth="2.5" strokeDasharray="10,8" style={{pointerEvents:"none"}}/>}

              {/* Conexões */}
              <defs>
                <marker id="arr-ok"   viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#10B981"/></marker>
                <marker id="arr-err"  viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#EF4444"/></marker>
                <marker id="arr-free" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#F59E0B"/></marker>
                <marker id="arr-mute" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#475569"/></marker>
              </defs>

              {connections.map(conn=>{
                const src=nodes.find(n=>n.id===conn.sourceId),tgt=nodes.find(n=>n.id===conn.targetId); if(!src||!tgt) return null;
                const valid=isValidLink(src.layer,tgt.layer);
                const isRet=src.layer==="L5"&&tgt.layer==="L2";
                const clr=silentMode?"#475569":freeMode?"#F59E0B":valid?"#10B981":"#EF4444";
                const mid=silentMode?"arr-mute":freeMode?"arr-free":valid?"arr-ok":"arr-err";
                return (
                  <g key={conn.id} style={{pointerEvents:"all"}}>
                    <line x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y} stroke={clr} strokeWidth={isRet?2.5:1.8} strokeDasharray={isRet?"7,4":undefined} markerEnd={`url(#${mid})`} style={{pointerEvents:"none"}}/>
                    <circle cx={(src.x+tgt.x)/2} cy={(src.y+tgt.y)/2} r={7} fill="#EF4444"
                      className="opacity-0 hover:opacity-50 transition-opacity cursor-pointer"
                      onClick={()=>dispatch({tipo:"DESLIGAR",id:conn.id})}/>
                  </g>
                );
              })}

              {/* Nós */}
              {nodes.map(node=>{
                const info=LAYERS[node.layer],isSel=selectedNode?.id===node.id,isAllSel=allSelected;
                const color=layerColor(node.layer);
                return (
                  <g key={node.id} transform={`translate(${node.x-20},${node.y-20})`} style={{cursor:"move",pointerEvents:"all"}}
                    onMouseDown={e=>{if(!lockNodes){e.stopPropagation();setDraggingNode(node);}}}
                    onClick={e=>{e.stopPropagation();setSelectedShapeId(null);if(!allSelected){selectedNode?connectNodes(node.id):setSelectedNode(node);}}}
                    onContextMenu={e=>{e.preventDefault();removeNode(node.id);}}>
                    <rect width={40} height={40} rx={8} fill={isSel?"white":color}
                      stroke={isSel||isAllSel?color:"transparent"} strokeWidth={isSel?2.5:isAllSel?1.5:0}
                      style={{filter:isSel?`drop-shadow(0 0 8px ${color}80)`:isAllSel?`drop-shadow(0 0 4px ${color}60)`:`drop-shadow(0 2px 4px rgba(0,0,0,.3))`}}/>
                    <g transform="translate(11,11)" style={{pointerEvents:"none"}}>{React.cloneElement(info.icon, { color: isSel ? color : "white" })}</g>
                    {showLabels&&<text x={20} y={52} textAnchor="middle" fontSize={7.5} fontWeight="600" fill={color} style={{pointerEvents:"none",fontFamily:"system-ui"}}>{layerName(node.layer)}</text>}
                  </g>
                );
              })}

              {/* Anotações */}
              {annotations.map(ann=>(
                <foreignObject key={ann.id} x={ann.x-75} y={ann.y-18} width={150} height={120} style={{pointerEvents:"all"}}>
                  <div className="group bg-amber-50 border border-amber-300 rounded-lg shadow-md text-xs overflow-hidden"
                    onContextMenu={e=>{e.preventDefault();dispatch({tipo:"REMOVER_ANOTACAO",id:ann.id});}}>
                    <div className="flex items-center justify-between px-2 py-1 bg-amber-100 border-b border-amber-200 cursor-pointer"
                      onClick={()=>dispatch({tipo:"ALTERNAR_ANOTACAO",id:ann.id})}>
                      <span className="text-[8px] font-bold text-amber-700">NOTA</span>
                      <div className="flex gap-1">
                        {ann.expanded?<ChevronUp size={9} className="text-amber-600"/>:<ChevronDown size={9} className="text-amber-600"/>}
                        <button className="opacity-0 group-hover:opacity-100 text-amber-500 hover:text-red-500"
                          onClick={e=>{e.stopPropagation();dispatch({tipo:"REMOVER_ANOTACAO",id:ann.id});}}><X size={9}/></button>
                      </div>
                    </div>
                    {ann.expanded&&(
                      <div className="p-1.5">
                        {editingAnnotId===ann.id
                          ? <textarea autoFocus rows={2} className="w-full text-[9px] bg-transparent resize-none outline-none text-amber-900" value={ann.text} placeholder="escreve aqui…" onChange={e=>dispatch({tipo:"EDITAR_ANOTACAO",id:ann.id,text:e.target.value})} onBlur={()=>{if(!ann.text.trim())dispatch({tipo:"REMOVER_ANOTACAO",id:ann.id});else setEditingAnnotId(null);}}/>
                          : <div className="text-[9px] text-amber-900 cursor-text min-h-[18px]" onClick={()=>setEditingAnnotId(ann.id)}>{ann.text||<span className="text-amber-300 italic">clique para editar</span>}</div>
                        }
                      </div>
                    )}
                  </div>
                </foreignObject>
              ))}
            </g>
          </svg>

          </div>{/* end 3D world */}

          {/* 3D mode overlay */}
          {is3D && (
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.25) 100%)"}}/>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#0F172A]/90 border border-[#334155] rounded-full px-4 py-1.5 text-[10px] font-bold text-white flex items-center gap-3 pointer-events-auto">
                <Rotate3d size={12} className="text-blue-400"/>
                <span>VISTA 3D — btn direito + arrasta para rodar</span>
                <button onClick={()=>{setIs3D(false);setRotX(0);setRotY(0);setRotZ(0);}} className="text-slate-400 hover:text-white ml-1 text-[9px]">× EDITAR</button>
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

        {/* FLOW REPORT PANEL */}
        {showFlowReport && (
          <div className="w-60 bg-white border-l border-slate-200 flex flex-col flex-shrink-0 overflow-hidden" id="flow-report-panel">
            <div className="px-3 py-2 bg-[#0F172A] flex items-center justify-between flex-shrink-0">
              <span className="text-[10px] font-black text-white uppercase tracking-wider">Relatório de Fluxo</span>
              <div className="flex gap-1">
                <button onClick={()=>window.print()} title="Imprimir" className="text-slate-400 hover:text-white"><FileText size={12}/></button>
                <button onClick={()=>setShowFlowReport(false)} className="text-slate-400 hover:text-white"><X size={12}/></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 text-xs">
              {flowReport ? (<>
                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-2">Caminho Detectado</div>
                {flowReport.paths.map((p,i)=>(
                  <div key={i} className="font-mono text-[9px] text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2 mb-2 break-all leading-relaxed">
                    {p}
                  </div>
                ))}

                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-3">Inventário de Camadas</div>
                {LAYER_KEYS.map(key=>{
                  const items=flowReport.inventory[key]; if(!items?.length) return null;
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
                  <div className="text-[9px] text-slate-600 flex justify-between"><span>Ligações total</span><span className="font-bold text-slate-800">{flowReport.stats.total}</span></div>
                  <div className="text-[9px] text-emerald-600 flex justify-between"><span>Válidas</span><span className="font-bold">{flowReport.stats.valid}</span></div>
                  {flowReport.stats.invalid>0&&<div className="text-[9px] text-red-500 flex justify-between"><span>Inválidas</span><span className="font-bold">{flowReport.stats.invalid}</span></div>}
                  {flowReport.stats.cycles>0&&<div className="text-[9px] text-emerald-500 flex justify-between"><span>Ciclos L5→L2</span><span className="font-bold">⚡ {flowReport.stats.cycles}</span></div>}
                  <div className="text-[9px] flex justify-between pt-1 border-t border-slate-200" style={{color:healthColor}}><span>Integridade</span><span className="font-black">{displayTensao(health, estadoTensao)}</span></div>
                </div>

                <div className="text-[7px] text-slate-400 mt-2 text-center">{activeSector.icon} {activeSector.name} · {freeMode?"Modo Livre":"Modo Guiado"}</div>
              </>) : (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2 opacity-30">📊</div>
                  <div className="text-[10px] text-slate-400">Adiciona nós e ligações<br/>para gerar o relatório</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── STATUS BAR ──────────────────────────────────────────────────── */}
      <footer className="h-6 bg-[#0F172A] border-t border-[#1E293B] px-4 flex items-center justify-between text-[8px] font-bold flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1" style={{color:healthColor}}><Shield size={9}/> {!nodes.length?"STANDBY":freeMode?"LIVRE":silentMode?"QUIETO":analysis.conflicts>0?"ALERTA":"NOMINAL"}</span>
          <span className="text-white/70">Nós: <span className="text-white">{analysis.nodeCount}</span></span>
          <span className="text-white/70">Links: <span className="text-white">{analysis.connCount}</span></span>
          <span className="text-white/70">Formas: <span className="text-white">{shapes.length}</span></span>
          {analysis.cycles>0&&<span className="text-emerald-400">⚡ {analysis.cycles} ciclo{analysis.cycles>1?"s":""}</span>}
          {!silentMode&&!freeMode&&analysis.conflicts>0&&<span className="text-red-400">⚠ {analysis.conflicts} conflito{analysis.conflicts>1?"s":""}</span>}
          <span className="text-white/55">{activeSector.icon} {activeSector.name} · {Math.round(zoom*100)}%</span>
        </div>
        <div className="text-white/55">TIAGO MORAES CHAVES · ARCHITECT &amp; ENGINEER</div>
      </footer>

      {/* ── PAINEL 3D ───────────────────────────────────────────────────── */}
      {show3DPanel && (
        <div className="fixed z-[110] bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden"
          style={{left:Math.max(0,Math.min(panel3DPos.x,window.innerWidth-270)),top:Math.max(0,Math.min(panel3DPos.y,window.innerHeight-420)),width:260}}>
          {/* drag handle */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#334155] cursor-grab bg-[#0F172A] rounded-t-xl select-none"
            onMouseDown={e=>{e.stopPropagation();setDragging3DPanel({sx:e.clientX,sy:e.clientY,ox:panel3DPos.x,oy:panel3DPos.y});}}>
            <div className="flex items-center gap-2">
              <GripHorizontal size={12} className="text-slate-400"/>
              <Rotate3d size={13} className="text-blue-400"/>
              <span className="text-[11px] font-bold text-white">Rotação 3D</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>setShow3DPanel(false)} className="text-slate-400 hover:text-white"><X size={14}/></button>
            </div>
          </div>

          <div className="p-4">
            {/* Toggle 3D */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-slate-300 font-bold">Vista 3D</span>
              <button onClick={()=>setIs3D(p=>!p)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black border transition-all
                  ${is3D?"bg-blue-600 border-blue-500 text-white":"bg-[#0F172A] border-[#334155] text-slate-400 hover:border-blue-600 hover:text-blue-400"}`}>
                {is3D ? "ACTIVA ●" : "INACTIVA ○"}
              </button>
            </div>

            {/* Pré-visualizações */}
            <div className="text-[8px] font-bold text-slate-300 uppercase tracking-wider mb-2">Perspectivas Pré-definidas</div>
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              {[
                {n:"Frontal",    x:0,   y:0,   z:0},
                {n:"Perspectiva",x:15,  y:-25, z:0},
                {n:"Isométrica", x:30,  y:-45, z:0},
                {n:"Topo",       x:62,  y:0,   z:0},
                {n:"Lateral Dir",x:0,   y:62,  z:0},
                {n:"Lateral Esq",x:0,   y:-62, z:0},
                {n:"Inclinada",  x:25,  y:20,  z:8},
                {n:"Profunda",   x:52,  y:-38, z:0},
                {n:"Plano Z",    x:0,   y:0,   z:45},
              ].map(p=>(
                <button key={p.n} onClick={()=>{setRotX(p.x);setRotY(p.y);setRotZ(p.z);setIs3D(true);}}
                  className="py-1.5 px-1 rounded-lg text-[8px] font-bold border border-[#334155] bg-[#0F172A] text-slate-200 hover:border-blue-500 hover:text-blue-300 hover:bg-blue-900/20 transition-all text-center leading-tight">
                  {p.n}
                </button>
              ))}
            </div>

            {/* Sliders */}
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
                    onChange={e=>{s.set(parseInt(e.target.value));setIs3D(true);}}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{accentColor:s.color}}/>
                </div>
              ))}
            </div>

            {/* Reset + info */}
            <button onClick={()=>{setRotX(0);setRotY(0);setRotZ(0);setIs3D(false);}}
              className="w-full mt-4 py-1.5 border border-[#334155] text-[9px] font-bold text-slate-200 rounded-lg hover:bg-[#334155] hover:text-white transition-all">
              RESET PARA 2D
            </button>
            <div className="mt-3 text-[8px] text-slate-400 text-center leading-relaxed">
              🖱️ Btn direito + arrasta no canvas para rodar<br/>
              Roda do rato para zoom · ESC desactiva 3D
            </div>
          </div>
        </div>
      )}

      {/* ── BIBLIOTECA FLUTUANTE ─────────────────────────────────────────── */}
      {showLibrary && (
        <div className="fixed z-[100] bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl flex flex-col overflow-hidden"
          style={{left:Math.max(0,Math.min(libPos.x,window.innerWidth-290)),top:Math.max(0,Math.min(libPos.y,window.innerHeight-400)),width:280,maxHeight:"80vh"}}>
          {/* drag handle */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#334155] cursor-grab active:cursor-grabbing flex-shrink-0 bg-[#0F172A] rounded-t-xl select-none"
            onMouseDown={e=>{e.stopPropagation();setDraggingLib({sx:e.clientX,sy:e.clientY,ox:libPos.x,oy:libPos.y});}}>
            <div className="flex items-center gap-2">
              <GripHorizontal size={12} className="text-slate-400"/>
              <span className="text-[11px] font-bold text-white">{activeSector.icon} {activeSector.name} · Biblioteca</span>
            </div>
            <button onClick={()=>setShowLibrary(false)} className="text-slate-400 hover:text-white"><X size={14}/></button>
          </div>

          {/* tabs */}
          <div className="flex border-b border-[#334155] flex-shrink-0">
            {[["layers","CAMADAS"],["templates","MOLDES"],["models","MODELOS"],["colors","CORES"]].map(([tab,lbl])=>(
              <button key={tab} onClick={()=>setLibraryTab(tab)}
                className={`flex-1 py-1.5 text-[8px] font-bold border-r border-[#334155] last:border-r-0 transition-colors
                  ${libraryTab===tab?"bg-emerald-800 text-white":"text-slate-400 hover:bg-[#334155] hover:text-white"}`}>
                {lbl}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {/* CAMADAS */}
            {libraryTab==="layers"&&LAYER_KEYS.map(key=>(
              <div key={key} className="mb-3 p-3 rounded-lg border border-[#334155] bg-[#0F172A]">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{color:layerColor(key)}}>{LAYERS[key].icon}</span>
                  <div>
                    <div className="text-[10px] font-bold" style={{color:layerColor(key)}}>{key}: {layerName(key)}</div>
                    <div className="text-[8px] text-slate-300">{activeSector.desc[key]}</div>
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

            {/* MOLDES */}
            {libraryTab==="templates"&&(
              <div className="space-y-2">
                <p className="text-[9px] text-slate-300 mb-2">Topologias para <strong className="text-white">{activeSector.name}</strong></p>
                {TEMPLATES.map(t=>(
                  <div key={t.id} className="p-3 rounded-lg border border-[#334155] bg-[#0F172A] flex items-center justify-between hover:border-emerald-700 transition-all">
                    <div>
                      <div className="text-lg mb-0.5">{t.icon}</div>
                      <div className="text-[10px] font-bold text-white">{t.name}</div>
                      <div className="text-[8px] text-slate-300">{t.desc}</div>
                    </div>
                    <button onClick={()=>{const{nodes:tn,connections:tc}=t.gen();dispatch({tipo:"INSERIR_TEMPLATE",nodes:tn,connections:tc});setShowLibrary(false);}}
                      className="text-[9px] font-bold bg-emerald-700 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 flex-shrink-0 ml-2">INSERIR</button>
                  </div>
                ))}
              </div>
            )}

            {/* MODELOS */}
            {libraryTab==="models"&&(
              <div>
                <p className="text-[9px] text-slate-300 mb-2">Modelos pessoais guardados localmente.</p>
                {!userModels.length?(
                  <div className="text-center py-8">
                    <div className="text-3xl mb-2 opacity-40">📂</div>
                    <div className="text-[10px] text-slate-300">Nenhum modelo.<br/>Clica em <span className="text-emerald-400 font-bold">BookmarkPlus</span> na sidebar.</div>
                  </div>
                ):userModels.map(m=>(
                  <div key={m.id} className="p-3 rounded-lg border border-[#334155] bg-[#0F172A] mb-2 hover:border-emerald-700 transition-all">
                    <div className="text-[10px] font-bold text-white mb-0.5">{m.name}</div>
                    <div className="text-[8px] text-slate-300 mb-2">{new Date(m.createdAt).toLocaleDateString("pt-PT")} · {(m.nodes||[]).length} nós · {m.sector&&SECTORS[m.sector]?.icon}</div>
                    <div className="flex gap-1">
                      <button onClick={()=>loadModel(m)} className="flex-1 text-[9px] font-bold bg-emerald-700 text-white py-1 rounded-lg hover:bg-emerald-600">CARREGAR</button>
                      <button onClick={()=>{const u=userModels.filter(x=>x.id!==m.id);setUserModels(u);guardarModelos(u);}} className="w-7 flex items-center justify-center text-slate-300 hover:text-red-400 border border-[#334155] rounded-lg hover:border-red-700 transition-all"><Trash2 size={11}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CORES */}
            {libraryTab==="colors"&&(
              <div>
                <p className="text-[9px] text-slate-300 mb-3">Personaliza a cor de cada camada.</p>
                {LAYER_KEYS.map(key=>(
                  <div key={key} className="flex items-center gap-2 mb-2 p-2 rounded-lg border border-[#334155] bg-[#0F172A]">
                    <span style={{color:layerColor(key)}}>{LAYERS[key].icon}</span>
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
      )}

      {/* ── TUTORIAL ────────────────────────────────────────────────────── */}
      {showTutorial&&(
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] w-[500px] max-w-[95vw] bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#059669] to-[#0891b2] px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="text-[11px] font-black text-white uppercase tracking-widest">Tutorial</span><span className="text-white/60">·</span><span className="text-[10px] text-white/70">{tutorialStep+1}/{TUTORIAL_STEPS.length}</span></div>
            <button onClick={()=>{setShowTutorial(false);localStorage.setItem("ae_tutorial","1");}} className="text-white/70 hover:text-white"><X size={14}/></button>
          </div>
          <div className="flex h-1">{TUTORIAL_STEPS.map((_,i)=><button key={i} onClick={()=>setTutorialStep(i)} className={`flex-1 transition-all ${i===tutorialStep?"bg-emerald-400":i<tutorialStep?"bg-emerald-800":"bg-[#334155]"}`}/>)}</div>
          <div className="p-5">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl flex-shrink-0">{TUTORIAL_STEPS[tutorialStep].icon}</span>
              <div><div className="text-sm font-black text-white mb-1">{TUTORIAL_STEPS[tutorialStep].title}</div><div className="text-[11px] text-slate-400 leading-relaxed">{TUTORIAL_STEPS[tutorialStep].desc}</div></div>
            </div>
            <div className="flex items-center bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 mb-4">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mr-2">Onde:</span>
              <span className="text-[9px] font-bold text-emerald-400">{TUTORIAL_STEPS[tutorialStep].hint}</span>
            </div>
            <div className="flex items-center justify-between">
              <button onClick={()=>setTutorialStep(p=>Math.max(0,p-1))} disabled={tutorialStep===0} className="text-[10px] font-bold text-slate-400 hover:text-white disabled:opacity-20">← ANTERIOR</button>
              <button onClick={()=>{setShowTutorial(false);localStorage.setItem("ae_tutorial","1");}} className="text-[9px] text-slate-400 hover:text-slate-200 mx-4">pular</button>
              {tutorialStep<TUTORIAL_STEPS.length-1
                ?<button onClick={()=>setTutorialStep(p=>p+1)} className="bg-emerald-700 text-white px-5 py-1.5 rounded-lg text-[10px] font-black hover:bg-emerald-600">PRÓXIMO →</button>
                :<button onClick={()=>{setShowTutorial(false);localStorage.setItem("ae_tutorial","1");}} className="bg-emerald-700 text-white px-5 py-1.5 rounded-lg text-[10px] font-black hover:bg-emerald-600">CONCLUIR ✓</button>
              }
            </div>
          </div>
        </div>
      )}

      {/* ── SAVE MODEL ──────────────────────────────────────────────────── */}
      {showSaveModel&&(
        <div className="fixed inset-0 bg-black/70 z-[180] flex items-center justify-center">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl w-80 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#059669] to-[#0891b2] px-5 py-3 flex items-center justify-between">
              <span className="text-[11px] font-black text-white">Guardar Modelo</span>
              <button onClick={()=>setShowSaveModel(false)} className="text-white/70 hover:text-white"><X size={14}/></button>
            </div>
            <div className="p-5">
              <div className="text-[9px] text-slate-400 mb-2">Nome do modelo:</div>
              <input autoFocus className="w-full bg-[#0F172A] border border-[#334155] text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-emerald-600 mb-1"
                value={saveModelName} onChange={e=>setSaveModelName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveModel()} placeholder="ex: Arquitectura de Microsserviços"/>
              <div className="text-[8px] text-slate-400 mb-4">{nodes.length} nós · {connections.length} links · {shapes.length} formas · {activeSector.icon} {activeSector.name}</div>
              <div className="flex gap-2">
                <button onClick={()=>setShowSaveModel(false)} className="flex-1 py-2 border border-[#334155] text-slate-400 text-[10px] font-bold rounded-lg hover:bg-[#334155]">CANCELAR</button>
                <button onClick={saveModel} disabled={!saveModelName.trim()} className="flex-1 py-2 bg-emerald-700 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-600 disabled:opacity-30">GUARDAR</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── tutorial "?" button ──────────────────────────────────────────── */}
      <button onClick={()=>{setTutorialStep(0);setShowTutorial(true);}}
        className="fixed bottom-9 right-4 w-6 h-6 rounded-full bg-emerald-700 text-white text-[10px] font-black flex items-center justify-center hover:bg-emerald-600 z-40 shadow-lg" title="Tutorial">?</button>
    </div>
  );
}
