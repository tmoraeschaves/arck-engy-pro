import React, { useState, useReducer, useRef, useEffect, useMemo, useCallback } from "react";
import {
  RotateCcw, Download, Upload, Shield, X, Scissors,
  Bell, BellOff, Image, Shapes, FileText,
  Type, ChevronDown, ChevronUp, FileImage, Trash2,
  ZoomIn, ZoomOut, Grid, Layers, Menu, Box,
  BookmarkPlus, GripHorizontal, List, Rotate3d
} from "lucide-react";

import { uid } from "./lib/uid.js";
import { LAYERS, LAYER_KEYS } from "./config/camadas.js";
import { SECTORS } from "./config/sectores.js";
import { TEMPLATES } from "./config/templates.js";
import { TUTORIAL_STEPS } from "./config/tutorial.js";
import { METRICS, GRID_SIZE, LIMITE_3D } from "./config/app-meta.js";
import {
  toNo, toLigacoes, toModo, isValidLink, displayTensao,
  validarNovaLigacao, medirTensao, interpretarTensao,
} from "./lib/core-bridge.js";
import { computeFlowReport } from "./lib/flow-report.js";
import {
  guardarProjetoLocal, autoguardarProjetoLocal, lerProjetoLocal, apagarProjetoLocal,
  descarregarProjeto, lerFicheiroJSON, lerModelos, guardarModelos, guardarSectorLocal,
} from "./infra/persistencia.js";
import { construirSVG, exportarSVG, exportarPNG } from "./infra/exportar.js";
import { Canvas } from "./componentes/Canvas.jsx";
import { PainelModulos } from "./componentes/PainelModulos.jsx";
import { IconeCamada } from "./componentes/IconeCamada.jsx";
import { projetoReducer, estadoInicial, snapshot } from "./hooks/projeto-reducer.js";
import { useVistaCanvas } from "./hooks/useVistaCanvas.js";
import { useAtalhos } from "./hooks/useAtalhos.js";
import { useColarImagem } from "./hooks/useColarImagem.js";

// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  // ── documento (nós, ligações, formas, anotações, cores, fundo, sector, modo) ──
  // Arranca do autosave (recupera onde o utilizador parou ao reabrir/actualizar);
  // se não houver, começa vazio com o último sector escolhido.
  const [projeto, dispatch] = useReducer(projetoReducer, undefined, () => {
    const guardado = lerProjetoLocal();
    if (guardado) return { ...estadoInicial, ...guardado };
    return { ...estadoInicial, sector: localStorage.getItem("ae_sector") || null };
  });
  const { nodes, connections, shapes, annotations, customColors, bgImage, bgOpacity, bgLocked, sector, freeMode } = projeto;

  // ── estado de interacção efémero ──────────────────────────────────────────
  const {
    zoom, setZoom, offset, setOffset, isPanning, setIsPanning, panStart, setPanStart,
    is3D, setIs3D, rotX, setRotX, rotY, setRotY, rotZ, setRotZ,
    draggingRot, setDraggingRot, show3DPanel, setShow3DPanel,
    panel3DPos, setPanel3DPos, dragging3DPanel, setDragging3DPanel,
    centro3D,
  } = useVistaCanvas(nodes);

  const [selectedNode, setSelectedNode] = useState(null);
  const [modulosNoId, setModulosNoId] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [cutMode, setCutMode] = useState(false);
  const [cutStart, setCutStart] = useState(null);
  const [cutEnd, setCutEnd] = useState(null);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const showLabels = true; // sempre visível por agora — sem toggle na UI
  const [showGrid, setShowGrid] = useState(false);

  // ── estados avançados ─────────────────────────────────────────────────────
  const [silentMode, setSilentMode] = useState(false);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [editingAnnotId, setEditingAnnotId] = useState(null);
  const [showBgPanel, setShowBgPanel] = useState(false);

  // ── modais de arranque ────────────────────────────────────────────────────
  // Se o projecto foi recuperado do autosave já tem sector — não voltar a pedir.
  const [showSectorModal, setShowSectorModal] = useState(() => !projeto.sector);
  const [showTutorial, setShowTutorial] = useState(() => !localStorage.getItem("ae_tutorial") && !!projeto.sector);
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

  // ── pulso da animação das barras (só fase; a altura/cor vêm da integridade) ──
  const [pulse, setPulse] = useState(0);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const bgInputRef = useRef(null);

  // ── computed ──────────────────────────────────────────────────────────────
  const activeSector = useMemo(() => sector ? SECTORS[sector] : SECTORS.engenharia, [sector]);
  const layerName  = useCallback(k => activeSector.names[k] || k, [activeSector]);
  const layerColor = useCallback(k => customColors[k] || LAYERS[k]?.color || "#666", [customColors]);
  const modulosNo = useMemo(() => nodes.find(n => n.id === modulosNoId) || null, [nodes, modulosNoId]);

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

  // As barras do cabeçalho eram uma "CARGA" inventada (podia passar dos 100%).
  // Passam a mostrar a INTEGRIDADE: a altura e a cor vêm de `health`; este intervalo
  // só faz a onda mexer (a fase), para continuarem visualmente vivas. Pára quando
  // não há nada para medir.
  useEffect(() => {
    if (!nodes.length || !connections.length) return;
    const id = setInterval(() => setPulse(p => (p + 0.35) % (Math.PI * 2)), 130);
    return () => clearInterval(id);
  }, [nodes.length, connections.length]);

  // ── autosave — recupera onde o utilizador parou ao reabrir/actualizar ──────
  // Grava o snapshot no localStorage a cada mudança, com um atraso de 500ms para
  // não escrever a cada pixel durante um arrasto. `snapshot` é só o documento.
  useEffect(() => {
    const id = setTimeout(() => autoguardarProjetoLocal(snapshot(projeto)), 500);
    return () => clearTimeout(id);
  }, [projeto]);

  // Converte coordenadas de ecrã (clientX/Y) para coordenadas do canvas (aplica offset/zoom).
  const paraCanvas = useCallback((clientX, clientY) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const r = canvasRef.current.getBoundingClientRect();
    return { x: (clientX - r.left - offset.x) / zoom, y: (clientY - r.top - offset.y) / zoom };
  }, [offset, zoom]);

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
    if (draggingNode) {
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
  }, [draggingLib, resizingShape, draggingNode, draggingShape, isPanning, cutMode, cutStart, zoom, offset, snapToGrid]);

  // ── nós ───────────────────────────────────────────────────────────────────
  // Nasce à direita do centro da área visível (não amontoado no canto superior
  // esquerdo), convertendo o ponto de ecrã para coordenadas do canvas (offset/zoom).
  const addNode = useCallback((layerKey) => {
    const r = canvasRef.current?.getBoundingClientRect();
    const jitter = () => (Math.random() - 0.5) * 130;
    let x = r ? (r.width * 0.58 - offset.x) / zoom + jitter() : 480 + jitter();
    let y = r ? (r.height * 0.44 - offset.y) / zoom + jitter() : 320 + jitter();
    if (snapToGrid) { x=Math.round(x/GRID_SIZE)*GRID_SIZE; y=Math.round(y/GRID_SIZE)*GRID_SIZE; }
    dispatch({ tipo: "ADICIONAR_NO", no: { id:`node_${uid()}`, layer:layerKey, x, y, createdAt:Date.now() } });
  }, [snapToGrid, offset, zoom]);

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

  const abrirModulos = useCallback((node) => {
    setSelectedNode(null);
    setModulosNoId(node.id);
  }, []);

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

  // ── atalhos globais (teclado + fim de arrasto) ────────────────────────────
  useAtalhos({
    cutMode, cutStart, cutEnd, selectedNode, selectedShapeId, zoom, offset, canvasRef,
    cutConnections, removeNode, dispatch,
    setDraggingNode, setIsPanning, setDraggingShape, setResizingShape, setDraggingLib,
    setDraggingRot, setDragging3DPanel, setCutMode, setCutStart, setCutEnd,
    setSelectedNode, setSelectedShapeId, setAnnotationMode, setEditingAnnotId,
    setPlacingShapeType, setShowShapePicker, setAllSelected, setIs3D, setZoom, setOffset,
  });

  useColarImagem(dispatch);

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

  const abrirImportador = useCallback(() => { fileInputRef.current?.click(); }, []);

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
                  <div className="text-[8px] text-slate-400 mt-1 leading-tight break-words">{Object.values(s.names).slice(0,2).join(" · ")}</div>
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
              {icon:<Upload size={14}/>,   fn:abrirImportador,                   tip:"Importar JSON"},
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

          {/* barras de integridade — altura e cor vêm de `health`; a onda só anima */}
          {nodes.length > 0 && (() => {
            const inercia = estadoTensao === "INERCIA";
            const frac = inercia ? 0.16 : Math.max(0, health) / 100;
            const amp = inercia ? 0.5 : frac; // erro (frac 0) fica parado; inércia mexe pouco
            return (
              <div className="flex items-center gap-2 ml-auto flex-shrink-0" title={`Integridade: ${displayTensao(health, estadoTensao)}`}>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-bold text-white/75">INTEGRIDADE</span>
                  <span className="text-sm font-black" style={{color:healthColor}}>{displayTensao(health, estadoTensao)}</span>
                </div>
                <div className="flex gap-0.5 h-7 items-end">
                  {Array.from({length:12}).map((_,i)=>{
                    const h = Math.min(100, Math.max(6, frac*66 + Math.sin(pulse + i*0.7)*15*amp + i*2*frac));
                    return <div key={i} className="rounded-sm transition-all duration-150"
                      style={{width:3, background:healthColor, opacity:0.45 + i*0.045, height:`${h}%`}}/>;
                  })}
                </div>
              </div>
            );
          })()}
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
              <span style={{color:layerColor(key)}}><IconeCamada sector={sector} camada={key} size={18} /></span>
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
        <Canvas
          canvasRef={canvasRef} bgInputRef={bgInputRef}
          nodes={nodes} connections={connections} shapes={shapes} annotations={annotations}
          bgImage={bgImage} bgOpacity={bgOpacity} bgLocked={bgLocked} freeMode={freeMode} silentMode={silentMode} sector={sector}
          zoom={zoom} offset={offset} is3D={is3D} rotX={rotX} rotY={rotY} rotZ={rotZ}
          draggingRot={draggingRot} centro3D={centro3D}
          setZoom={setZoom} setIsPanning={setIsPanning} setPanStart={setPanStart}
          setDraggingRot={setDraggingRot} setIs3D={setIs3D}
          selectedNode={selectedNode} setSelectedNode={setSelectedNode}
          selectedShapeId={selectedShapeId} setSelectedShapeId={setSelectedShapeId}
          allSelected={allSelected} setAllSelected={setAllSelected}
          editingAnnotId={editingAnnotId} setEditingAnnotId={setEditingAnnotId}
          annotationMode={annotationMode} setAnnotationMode={setAnnotationMode}
          placingShapeType={placingShapeType} setPlacingShapeType={setPlacingShapeType}
          showShapePicker={showShapePicker} setShowShapePicker={setShowShapePicker}
          cutMode={cutMode} cutStart={cutStart} cutEnd={cutEnd} showGrid={showGrid}
          showBgPanel={showBgPanel} setShowBgPanel={setShowBgPanel}
          showLabels={showLabels}
          setDraggingNode={setDraggingNode} setDraggingShape={setDraggingShape} setResizingShape={setResizingShape}
          dispatch={dispatch} addAnnotation={addAnnotation} placeShape={placeShape} scaleLayout={scaleLayout}
          connectNodes={connectNodes} removeNode={removeNode} abrirModulos={abrirModulos}
          layerName={layerName} layerColor={layerColor} paraCanvas={paraCanvas}
        />

        {/* PAINEL DE MÓDULOS (Movimento 8) */}
        {modulosNo && (
          <PainelModulos no={modulosNo} layerName={layerName} layerColor={layerColor}
            dispatch={dispatch} onFechar={()=>setModulosNoId(null)} />
        )}

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
              <button onClick={()=>setIs3D(!is3D)}
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
                <button key={p.n} onClick={()=>{setRotX(p.x);setRotY(p.y);setRotZ(p.z);}}
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
                    onChange={e=>s.set(parseInt(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{accentColor:s.color}}/>
                </div>
              ))}
            </div>

            {/* Reset + info */}
            <button onClick={()=>{setRotX(0);setRotY(0);setRotZ(0);}}
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
                  <span style={{color:layerColor(key)}}><IconeCamada sector={sector} camada={key} size={18} /></span>
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
