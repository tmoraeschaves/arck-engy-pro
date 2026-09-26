import { useState, useReducer, useRef, useEffect, useMemo, useCallback } from "react";

import { uid } from "./lib/uid.js";
import { LAYERS } from "./config/camadas.js";
import { SECTORS } from "./config/sectores.js";
import { GRID_SIZE } from "./config/app-meta.js";
import { toNo, toLigacoes, validarNovaLigacao } from "./lib/core-bridge.js";
import { computeFlowReport } from "./lib/flow-report.js";
import {
  guardarProjetoLocal, autoguardarProjetoLocal, lerProjetoLocal, apagarProjetoLocal,
  descarregarProjeto, lerFicheiroJSON, lerModelos, guardarModelos, guardarSectorLocal,
} from "./infra/persistencia.js";
import { construirSVG, exportarSVG, exportarPNG } from "./infra/exportar.js";
import { projetoReducer, estadoInicial, snapshot } from "./hooks/projeto-reducer.js";
import { useVistaCanvas } from "./hooks/useVistaCanvas.js";
import { useArrastos } from "./hooks/useArrastos.js";
import { useIntegridade } from "./hooks/useIntegridade.js";
import { useAtalhos } from "./hooks/useAtalhos.js";
import { useColarImagem } from "./hooks/useColarImagem.js";
import { ModalSector } from "./componentes/ModalSector.jsx";
import { Cabecalho } from "./componentes/Cabecalho.jsx";
import { BarraLateral } from "./componentes/BarraLateral.jsx";
import { Canvas } from "./componentes/Canvas.jsx";
import { PainelModulos } from "./componentes/PainelModulos.jsx";
import { PainelFluxo } from "./componentes/PainelFluxo.jsx";
import { BarraEstado } from "./componentes/BarraEstado.jsx";
import { Painel3D } from "./componentes/Painel3D.jsx";
import { Biblioteca } from "./componentes/Biblioteca.jsx";
import { Tutorial } from "./componentes/Tutorial.jsx";
import { ModalGuardarModelo } from "./componentes/ModalGuardarModelo.jsx";

// ══════════════════════════════════════════════════════════════════════════════
// App = composição. O documento vive no reducer (hooks/projeto-reducer.js); a vista,
// os arrastos e a integridade vivem nos seus hooks; os componentes só apresentam.
export default function App() {
  // ── documento (nós, ligações, formas, anotações, cores, fundo, sector, modo) ──
  // Arranca do autosave (recupera onde o utilizador parou); se não houver, começa
  // vazio com o último sector escolhido.
  const [projeto, dispatch] = useReducer(projetoReducer, undefined, () => {
    const guardado = lerProjetoLocal();
    if (guardado) return { ...estadoInicial, ...guardado };
    return { ...estadoInicial, sector: localStorage.getItem("ae_sector") || null };
  });
  const { nodes, connections, shapes, annotations, customColors, bgImage, bgOpacity, bgLocked, sector, freeMode } = projeto;

  const canvasRef = useRef(null);
  const bgInputRef = useRef(null);

  // ── vista (zoom, pan, 3D) e selecção ──────────────────────────────────────
  const vista = useVistaCanvas(nodes);
  const { zoom, setZoom, offset, setOffset, setIsPanning, setPanStart, is3D, setIs3D,
    rotX, setRotX, rotY, setRotY, rotZ, setRotZ, draggingRot, setDraggingRot,
    show3DPanel, setShow3DPanel, panel3DPos, setDragging3DPanel, centro3D } = vista;

  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [allSelected, setAllSelected] = useState(false);
  const [modulosNoId, setModulosNoId] = useState(null);

  // ── ferramentas ───────────────────────────────────────────────────────────
  const [cutMode, setCutMode] = useState(false);
  const [cutStart, setCutStart] = useState(null);
  const [cutEnd, setCutEnd] = useState(null);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [editingAnnotId, setEditingAnnotId] = useState(null);
  const [placingShapeType, setPlacingShapeType] = useState(null);
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [showBgPanel, setShowBgPanel] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const showLabels = true; // sempre visível por agora — sem toggle na UI

  const { onMouseMove, setDraggingNode, setDraggingShape, setResizingShape, libPos, setDraggingLib } =
    useArrastos({ vista, corte: { cutMode, cutStart, setCutEnd }, snapToGrid, canvasRef, dispatch });

  // ── painéis e modais ──────────────────────────────────────────────────────
  // Se o projecto foi recuperado do autosave já tem sector — não voltar a pedir.
  const [showSectorModal, setShowSectorModal] = useState(() => !projeto.sector);
  const [showTutorial, setShowTutorial] = useState(() => !localStorage.getItem("ae_tutorial") && !!projeto.sector);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showFlowReport, setShowFlowReport] = useState(false);
  const [showSaveModel, setShowSaveModel] = useState(false);
  const [userModels, setUserModels] = useState(lerModelos);

  // ── derivados ─────────────────────────────────────────────────────────────
  const activeSector = useMemo(() => sector ? SECTORS[sector] : SECTORS.engenharia, [sector]);
  const layerName  = useCallback(k => activeSector.names[k] || k, [activeSector]);
  const layerColor = useCallback(k => customColors[k] || LAYERS[k]?.color || "#666", [customColors]);
  const modulosNo = useMemo(() => nodes.find(n => n.id === modulosNoId) || null, [nodes, modulosNoId]);
  const integridade = useIntegridade(nodes, connections, freeMode);
  const flowReport = useMemo(() => computeFlowReport(nodes, connections), [nodes, connections]);

  // ── autosave — grava o documento 500ms depois da última mudança ───────────
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

  // ── nós e ligações ────────────────────────────────────────────────────────
  // Nasce à direita do centro da área visível (não amontoado no canto superior esquerdo).
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

  const abrirModulos = useCallback((node) => { setSelectedNode(null); setModulosNoId(node.id); }, []);

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

  // ── atalhos globais (teclado + fim de arrasto) e colar imagem ─────────────
  useAtalhos({
    cutMode, cutStart, cutEnd, selectedNode, selectedShapeId, zoom, offset, canvasRef,
    cutConnections, removeNode, dispatch,
    setDraggingNode, setIsPanning, setDraggingShape, setResizingShape, setDraggingLib,
    setDraggingRot, setDragging3DPanel, setCutMode, setCutStart, setCutEnd,
    setSelectedNode, setSelectedShapeId, setAnnotationMode, setEditingAnnotId,
    setPlacingShapeType, setShowShapePicker, setAllSelected, setIs3D, setZoom, setOffset,
  });
  useColarImagem(dispatch);

  // ── formas, anotações, escala ─────────────────────────────────────────────
  const scaleLayout = useCallback((factor) => dispatch({ tipo: "ESCALAR_LAYOUT", fator: factor }), []);

  const placeShape = useCallback((cx,cy) => {
    if (!placingShapeType) return;
    dispatch({ tipo: "ADICIONAR_FORMA", forma: { id:`shape_${uid()}`, type:placingShapeType, x:cx-70, y:cy-70, w:140, h:140 } });
    setPlacingShapeType(null);
  }, [placingShapeType]);

  const addAnnotation = useCallback((x,y) => {
    const id=`ann_${uid()}`;
    dispatch({ tipo: "ADICIONAR_ANOTACAO", anotacao: { id, x, y, text:"", expanded:true } });
    setEditingAnnotId(id);
  }, []);

  // ── sector, modelos e persistência ────────────────────────────────────────
  const escolherSector = useCallback((key) => { dispatch({ tipo: "DEFINIR_SECTOR", sector: key }); guardarSectorLocal(key); }, []);

  const selectSector = useCallback((key) => {
    escolherSector(key); setShowSectorModal(false);
    if (!localStorage.getItem("ae_tutorial")) { setTutorialStep(0); setShowTutorial(true); }
  }, [escolherSector]);

  const fecharTutorial = useCallback(() => { setShowTutorial(false); localStorage.setItem("ae_tutorial","1"); }, []);

  const saveModel = useCallback((nome) => {
    const m = { id:uid(), name:nome, ...snapshot(projeto), createdAt:Date.now() };
    const upd=[m,...userModels]; setUserModels(upd); guardarModelos(upd);
    setShowSaveModel(false);
  }, [projeto, userModels]);

  const deleteModel = useCallback((id) => {
    const upd = userModels.filter(x => x.id !== id); setUserModels(upd); guardarModelos(upd);
  }, [userModels]);

  const loadModel = useCallback((m) => {
    dispatch({ tipo: "CARREGAR_PROJETO", projeto: m });
    if (m.sector) guardarSectorLocal(m.sector);
    setShowLibrary(false);
  }, []);

  const insertTemplate = useCallback((t) => {
    const { nodes: tn, connections: tc } = t.gen();
    dispatch({ tipo: "INSERIR_TEMPLATE", nodes: tn, connections: tc });
    setShowLibrary(false);
  }, []);

  const saveProject = useCallback(() => {
    const projetoSnap = snapshot(projeto);
    guardarProjetoLocal(projetoSnap);
    descarregarProjeto(projetoSnap);
  }, [projeto]);

  const loadProject = useCallback(async (file) => {
    try {
      const d = await lerFicheiroJSON(file);
      dispatch({ tipo: "CARREGAR_PROJETO", projeto: d });
      if (d.sector) guardarSectorLocal(d.sector);
    } catch { if (!silentMode) alert("Erro ao carregar ficheiro"); }
  }, [silentMode]);

  const resetSystem = useCallback(() => {
    if (window.confirm("Resetar toda a arquitectura?")) {
      dispatch({ tipo: "RESETAR" });
      setSelectedNode(null); setSelectedShapeId(null);
      apagarProjetoLocal();
    }
  }, []);

  // ── exportação ────────────────────────────────────────────────────────────
  const buildSVG = useCallback(
    () => construirSVG({ nodes, connections, shapes, corDaCamada: layerColor, modoLivre: freeMode }),
    [nodes, connections, shapes, layerColor, freeMode],
  );
  const exportSVG = useCallback(() => exportarSVG(buildSVG()), [buildSVG]);
  const exportPNG = useCallback(() => exportarPNG(buildSVG(), nodes), [buildSVG, nodes]);

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col h-screen overflow-hidden select-none" style={{fontFamily:"'Inter',system-ui,sans-serif",background:"#0F172A"}}>

      {showSectorModal && (
        <ModalSector onEscolher={selectSector}
          onUsarPadrao={()=>{ dispatch({tipo:"DEFINIR_SECTOR",sector:"engenharia"}); setShowSectorModal(false); }} />
      )}

      <Cabecalho
        sector={sector} sectorActivo={activeSector} modoLivre={freeMode} modoSilencioso={silentMode}
        temNos={nodes.length > 0} integridade={integridade}
        onEscolherSector={escolherSector} onAlternarModo={()=>dispatch({tipo:"ALTERNAR_MODO_LIVRE"})}
        onImportar={loadProject} onExportarJSON={saveProject} onExportarSVG={exportSVG} onExportarPNG={exportPNG}
        onResetar={resetSystem}
      />

      <div className="flex flex-1 overflow-hidden" onMouseMove={onMouseMove}>
        <BarraLateral
          sector={sector} sectorActivo={activeSector} layerName={layerName} layerColor={layerColor} onAdicionarNo={addNode}
          ferramentas={{
            corte:  { fn:()=>setCutMode(p=>!p), active:cutMode },
            nota:   { fn:()=>{setAnnotationMode(p=>!p);setSelectedNode(null);}, active:annotationMode },
            formas: { fn:()=>setShowShapePicker(p=>!p), active:showShapePicker||!!placingShapeType },
            fundo:  { fn:()=>setShowBgPanel(p=>!p), active:!!bgImage||showBgPanel },
          }}
          opcoes={{
            grelha:   { fn:()=>setShowGrid(p=>!p), active:showGrid },
            snap:     { fn:()=>setSnapToGrid(p=>!p), active:snapToGrid },
            silencio: { fn:()=>setSilentMode(p=>!p), active:silentMode },
          }}
          vista3DActiva={is3D} painel3DAberto={show3DPanel} onAlternarPainel3D={()=>setShow3DPanel(p=>!p)}
          onZoomMais={()=>setZoom(p=>Math.min(p+0.15,3))} onZoomMenos={()=>setZoom(p=>Math.max(p-0.15,0.2))}
          onReporVista={()=>{setZoom(1);setOffset({x:0,y:0});}}
          relatorioAberto={showFlowReport} onAlternarRelatorio={()=>setShowFlowReport(p=>!p)}
          onGuardarModelo={()=>setShowSaveModel(true)}
          bibliotecaAberta={showLibrary} onAlternarBiblioteca={()=>setShowLibrary(p=>!p)}
        />

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

        {modulosNo && (
          <PainelModulos no={modulosNo} layerName={layerName} layerColor={layerColor}
            dispatch={dispatch} onFechar={()=>setModulosNoId(null)} />
        )}

        {showFlowReport && (
          <PainelFluxo relatorio={flowReport} layerName={layerName} layerColor={layerColor}
            corIntegridade={integridade.cor} textoIntegridade={integridade.texto}
            sector={activeSector} modoLivre={freeMode} onFechar={()=>setShowFlowReport(false)} />
        )}
      </div>

      <BarraEstado analise={integridade.analise} formas={shapes.length} modoLivre={freeMode} modoSilencioso={silentMode}
        corIntegridade={integridade.cor} sector={activeSector} zoom={zoom} />

      {show3DPanel && (
        <Painel3D pos={panel3DPos} is3D={is3D} setIs3D={setIs3D}
          rotX={rotX} setRotX={setRotX} rotY={rotY} setRotY={setRotY} rotZ={rotZ} setRotZ={setRotZ}
          onIniciarArrasto={setDragging3DPanel} onFechar={()=>setShow3DPanel(false)} />
      )}

      {showLibrary && (
        <Biblioteca pos={libPos} sector={sector} sectorActivo={activeSector}
          layerName={layerName} layerColor={layerColor} customColors={customColors}
          modelos={userModels} onInserirTemplate={insertTemplate} onCarregarModelo={loadModel} onApagarModelo={deleteModel}
          dispatch={dispatch} onIniciarArrasto={setDraggingLib} onFechar={()=>setShowLibrary(false)} />
      )}

      {showTutorial && <Tutorial passo={tutorialStep} onPasso={setTutorialStep} onFechar={fecharTutorial} />}

      {showSaveModel && (
        <ModalGuardarModelo onGuardar={saveModel} onFechar={()=>setShowSaveModel(false)}
          resumo={`${nodes.length} nós · ${connections.length} links · ${shapes.length} formas · ${activeSector.icon} ${activeSector.name}`} />
      )}

      <button onClick={()=>{setTutorialStep(0);setShowTutorial(true);}}
        className="fixed bottom-9 right-4 w-6 h-6 rounded-full bg-emerald-700 text-white text-[10px] font-black flex items-center justify-center hover:bg-emerald-600 z-40 shadow-lg" title="Tutorial">?</button>
    </div>
  );
}
