import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { 
  Wifi, Cpu, Battery, Wrench, Repeat, 
  RotateCcw, Zap, Activity, BookOpen, Download, Upload,
  Database, AlertTriangle, Shield, X, Scissors,
  GitBranch, Network, Radio, Gauge, Grid, Layers,
  Eye, EyeOff, Lock, Unlock, ArrowLeftRight, ArrowUpDown,
  Copy, Trash2, Menu
} from "lucide-react";

// --- DICIONÁRIO TÉCNICO ---
const LAYERS = {
  L1: { 
    name: "SENSÓRIA", 
    icon: <Wifi size={24} />, 
    color: "#2563eb", 
    bg: "bg-blue-50",
    border: "border-blue-600",
    text: "text-blue-600",
    desc: "Input de Dados e Sensores",
    longDesc: "Captação de sinais externos, transdutores e fontes de dados brutos.",
    metrics: { input: "0-10V", impedance: "1MΩ" },
    validNext: ["L2"]
  },
  L2: { 
    name: "LÓGICA", 
    icon: <Cpu size={24} />, 
    color: "#059669", 
    bg: "bg-emerald-50",
    border: "border-emerald-600",
    text: "text-emerald-600",
    desc: "Processamento e Decisão",
    longDesc: "Unidade de processamento central, execução de algoritmos.",
    metrics: { clock: "100MHz", memory: "256KB" },
    validNext: ["L3"]
  },
  L3: { 
    name: "POTÊNCIA", 
    icon: <Battery size={24} />, 
    color: "#d97706", 
    bg: "bg-amber-50",
    border: "border-amber-600",
    text: "text-amber-600",
    desc: "Gestão Energética",
    longDesc: "Distribuição de energia e condicionamento de potência.",
    metrics: { voltage: "24V", current: "10A" },
    validNext: ["L4"]
  },
  L4: { 
    name: "ATUAÇÃO", 
    icon: <Wrench size={24} />, 
    color: "#dc2626", 
    bg: "bg-red-50",
    border: "border-red-600",
    text: "text-red-600",
    desc: "Execução de Trabalho",
    longDesc: "Atuadores, motores e elementos de execução física.",
    metrics: { torque: "5Nm", speed: "3000rpm" },
    validNext: ["L5"]
  },
  L5: { 
    name: "FEEDBACK", 
    icon: <Repeat size={24} />, 
    color: "#7c3aed", 
    bg: "bg-purple-50",
    border: "border-purple-600",
    text: "text-purple-600",
    desc: "Monitoramento/Controle",
    longDesc: "Malha de retorno e circuitos de compensação.",
    metrics: { resolution: "12bit", accuracy: "±0.1%" },
    validNext: ["L2"]
  }
};

const SYSTEM_METRICS = {
  version: "23.1.0 PRO",
  build: "2025.03.14-0115",
  kernel: "ARCK v4.1.0"
};

export default function App() {
  // --- ESTADOS ---
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [cutMode, setCutMode] = useState(false);
  const [cutStart, setCutStart] = useState(null);
  const [cutEnd, setCutEnd] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [lockNodes, setLockNodes] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [telemetry] = useState(Array(20).fill(0)); // Telemetria só ativa com nós
  const [systemLoad, setSystemLoad] = useState(0);
  const GRID_SIZE = 50;

  // --- TELEMETRIA SÓ ATIVA COM NÓS ---
  useEffect(() => {
    if (nodes.length === 0) {
      setSystemLoad(0);
      return;
    }
    
    const interval = setInterval(() => {
      const baseLoad = 30 + (nodes.length * 5) + (connections.length * 2);
      const variation = Math.sin(Date.now() / 1000) * 5;
      setSystemLoad(Math.min(100, Math.max(10, baseLoad + variation)));
    }, 200);
    
    return () => clearInterval(interval);
  }, [nodes.length, connections.length]);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- HANDLERS ---
  const handleMouseMove = useCallback((e) => {
    if (draggingNode && !lockNodes && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      let x = (e.clientX - rect.left - offset.x) / zoom;
      let y = (e.clientY - rect.top - offset.y) / zoom;
      
      if (snapToGrid) {
        x = Math.round(x / GRID_SIZE) * GRID_SIZE;
        y = Math.round(y / GRID_SIZE) * GRID_SIZE;
      }
      
      setNodes(prev => prev.map(n => 
        n.id === draggingNode.id ? { ...n, x, y } : n
      ));
    } else if (isPanning && canvasRef.current) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setPanStart({ x: e.clientX, y: e.clientY });
    } else if (cutMode && canvasRef.current && cutStart) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / zoom;
      const y = (e.clientY - rect.top - offset.y) / zoom;
      setCutEnd({ x, y });
    }
  }, [draggingNode, isPanning, cutMode, cutStart, zoom, offset, snapToGrid, lockNodes]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (cutMode && cutStart && cutEnd) {
        cutConnections(cutStart, cutEnd);
      }
      setDraggingNode(null);
      setIsPanning(false);
      setCutMode(false);
      setCutStart(null);
      setCutEnd(null);
    };
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedNode(null);
        setCutMode(false);
      }
      if (e.key === 'Delete' && selectedNode) {
        removeNode(selectedNode.id);
      }
      if (e.key === 'c' && !e.ctrlKey) {
        e.preventDefault();
        setCutMode(true);
      }
      if (e.key === 'g' && e.ctrlKey) {
        e.preventDefault();
        setShowGrid(prev => !prev);
      }
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        setSnapToGrid(prev => !prev);
      }
      if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        setLockNodes(prev => !prev);
      }
      if (e.key === '+' || e.key === '=') setZoom(prev => Math.min(prev + 0.1, 2));
      if (e.key === '-') setZoom(prev => Math.max(prev - 0.1, 0.5));
      if (e.key === '0') {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      }
    };

    const handleMouseDown = (e) => {
      if (cutMode && !cutStart && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - offset.x) / zoom;
        const y = (e.clientY - rect.top - offset.y) / zoom;
        setCutStart({ x, y });
        setCutEnd({ x, y });
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [cutMode, cutStart, cutEnd, selectedNode, zoom, offset]);

  // --- FUNÇÕES PRINCIPAIS ---
  const addNode = useCallback((layerKey) => {
    let x = 200 + Math.random() * 200;
    let y = 150 + Math.random() * 200;
    
    if (snapToGrid) {
      x = Math.round(x / GRID_SIZE) * GRID_SIZE;
      y = Math.round(y / GRID_SIZE) * GRID_SIZE;
    }
    
    const newNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      layer: layerKey,
      x, y,
      createdAt: Date.now()
    };
    setNodes(prev => [...prev, newNode]);
  }, [snapToGrid]);

  const removeNode = useCallback((id) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.sourceId !== id && c.targetId !== id));
    if (selectedNode?.id === id) setSelectedNode(null);
  }, [selectedNode]);

  const connectNodes = useCallback((targetId) => {
    if (selectedNode && selectedNode.id !== targetId) {
      const source = nodes.find(n => n.id === selectedNode.id);
      const target = nodes.find(n => n.id === targetId);
      if (!source || !target) return;
      
      const isValid = LAYERS[source.layer]?.validNext?.includes(target.layer) || false;
      
      if (isValid) {
        const exists = connections.find(c => 
          (c.sourceId === selectedNode.id && c.targetId === targetId) ||
          (c.sourceId === targetId && c.targetId === selectedNode.id)
        );
        
        if (!exists) {
          setConnections(prev => [...prev, { 
            id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, 
            sourceId: selectedNode.id, 
            targetId
          }]);
        }
      } else {
        alert(`⚠️ Conexão inválida: ${source.layer} → ${target.layer}`);
      }
    }
    setSelectedNode(null);
  }, [selectedNode, connections, nodes]);

  const cutConnections = useCallback((start, end) => {
    if (!start || !end) return;
    
    const threshold = 15 / zoom;
    
    const connectionsToRemove = connections.filter(conn => {
      const src = nodes.find(n => n.id === conn.sourceId);
      const tgt = nodes.find(n => n.id === conn.targetId);
      if (!src || !tgt) return false;
      
      // Distância do ponto ao segmento
      for (let t = 0; t <= 1; t += 0.1) {
        const px = src.x + (tgt.x - src.x) * t;
        const py = src.y + (tgt.y - src.y) * t;
        
        // Distância à linha de corte
        const d = Math.abs((end.x - start.x) * (start.y - py) - (start.x - px) * (end.y - start.y)) /
                  Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        
        if (d < threshold) return true;
      }
      return false;
    });
    
    if (connectionsToRemove.length > 0) {
      setConnections(prev => prev.filter(c => !connectionsToRemove.includes(c)));
    }
  }, [connections, nodes, zoom]);

  // --- PERSISTÊNCIA ---
  const saveProject = useCallback(() => {
    const data = JSON.stringify({ nodes, connections }, null, 2);
    localStorage.setItem("arck_project", data);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arck_project_${Date.now()}.json`;
    a.click();
  }, [nodes, connections]);

  const loadProject = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setNodes(data.nodes || []);
          setConnections(data.connections || []);
        } catch (err) {
          alert('Erro ao carregar arquivo');
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const resetSystem = useCallback(() => {
    if (window.confirm('Resetar toda a arquitetura?')) {
      setNodes([]);
      setConnections([]);
      setSelectedNode(null);
      localStorage.removeItem('arck_project');
    }
  }, []);

  // --- ANÁLISE ---
  const systemAnalysis = useMemo(() => {
    const conflicts = connections.filter(c => {
      const s = nodes.find(n => n.id === c.sourceId);
      const t = nodes.find(n => n.id === c.targetId);
      return s && t && !LAYERS[s.layer]?.validNext?.includes(t.layer);
    }).length;
    
    return {
      nodeCount: nodes.length,
      connCount: connections.length,
      conflicts,
      load: nodes.length > 0 ? Math.round(systemLoad) : 0
    };
  }, [nodes, connections, systemLoad]);

  return (
    <div className="flex flex-col h-screen bg-[#E6E6E6] text-black font-['Inter',system-ui] overflow-hidden select-none">
      
      {/* HEADER */}
      <header className="bg-[#F3F3F3] border-b border-[#D1D1D1] z-50 shadow-sm">
        <div className="h-7 flex items-center px-4 bg-[#217346] text-white text-[10px] font-bold justify-between">
          <div className="flex items-center gap-4">
            <Database size={12} /> 
            <span>ARCK_ENGY_v{SYSTEM_METRICS.version}</span>
            <span className="text-white/50">•</span>
            <span>Kernel: {SYSTEM_METRICS.kernel}</span>
          </div>
        </div>
        
        <div className="flex items-center h-20 px-4 gap-3">
          
          {/* STATUS */}
          <div className="w-40 border-r border-[#D1D1D1] pr-3">
            <div className="text-[9px] font-bold text-[#666] mb-1">STATUS</div>
            <div className="h-10 border-2 border-[#B1B1B1] bg-white flex items-center justify-center text-[9px] font-bold px-2 text-center">
              {nodes.length === 0 ? "AGUARDANDO" : 
               systemAnalysis.conflicts > 0 ? `${systemAnalysis.conflicts} CONFLITOS` : 
               "OPERACIONAL"}
            </div>
          </div>

          {/* ÍCONES DAS CAMADAS - AGORA MOSTRAM OS ÍCONES CORRETAMENTE */}
          <div className="flex gap-1">
            {Object.entries(LAYERS).map(([key, info]) => (
              <button 
                key={key} 
                onClick={() => addNode(key)}
                onMouseEnter={() => setHoveredNode(key)}
                onMouseLeave={() => setHoveredNode(null)}
                className="relative w-12 h-12 bg-white border-2 border-[#B1B1B1] flex items-center justify-center hover:bg-gray-100 transition-all"
                style={{ borderColor: info.color }}
              >
                <span style={{ color: info.color }}>{info.icon}</span>
                
                {hoveredNode === key && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 bg-black text-white text-[8px] z-50 border border-white/20">
                    <div className="font-bold mb-1" style={{ color: info.color }}>{key} • {info.name}</div>
                    <div>{info.desc}</div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* FERRAMENTAS */}
          <div className="flex gap-1 border-l border-[#D1D1D1] pl-3">
            <button onClick={() => fileInputRef.current.click()} className="p-2 bg-white border border-[#B1B1B1] rounded hover:bg-gray-100" title="Importar">
              <Upload size={16} />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={loadProject} />
            <button onClick={saveProject} className="p-2 bg-white border border-[#B1B1B1] rounded hover:bg-gray-100" title="Exportar">
              <Download size={16} />
            </button>
            <button onClick={resetSystem} className="p-2 bg-white border border-[#B1B1B1] rounded hover:bg-gray-100" title="Reset">
              <RotateCcw size={16} />
            </button>
          </div>

          {/* CONTROLES */}
          <div className="flex gap-1">
            <button onClick={() => setShowGrid(!showGrid)} className={`p-2 border rounded ${showGrid ? 'bg-[#217346] text-white' : 'bg-white border-[#B1B1B1] hover:bg-gray-100'}`} title="Grade">
              <Grid size={16} />
            </button>
            <button onClick={() => setSnapToGrid(!snapToGrid)} className={`p-2 border rounded ${snapToGrid ? 'bg-[#217346] text-white' : 'bg-white border-[#B1B1B1] hover:bg-gray-100'}`} title="Snap">
              <Layers size={16} />
            </button>
            <button onClick={() => setLockNodes(!lockNodes)} className={`p-2 border rounded ${lockNodes ? 'bg-red-600 text-white' : 'bg-white border-[#B1B1B1] hover:bg-gray-100'}`} title="Travar">
              {lockNodes ? <Lock size={16} /> : <Unlock size={16} />}
            </button>
            <button onClick={() => setCutMode(true)} className={`p-2 border rounded ${cutMode ? 'bg-red-600 text-white' : 'bg-white border-[#B1B1B1] hover:bg-gray-100'}`} title="Cortar (C)">
              <Scissors size={16} />
            </button>
            <button onClick={() => setShowLibrary(true)} className="p-2 bg-[#217346] text-white border border-black rounded hover:bg-[#1a5c38]" title="Biblioteca">
              <Menu size={16} />
            </button>
          </div>

          {/* TELEMETRIA - SÓ ATIVA COM NÓS */}
          {nodes.length > 0 && (
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-[#666]">CARGA</span>
                <span className="text-lg font-bold text-[#217346]">{systemAnalysis.load}%</span>
              </div>
              <div className="flex gap-1 h-8 items-end">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 bg-[#217346] transition-all duration-200"
                    style={{ height: `${20 + Math.sin(Date.now()/200 + i) * 10 + (i * 3)}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* BRANDING */}
          <div className="ml-auto text-right">
            <div className="text-sm font-black italic text-[#217346]">ARCK & ENGY PRO</div>
            <div className="text-[8px] font-bold text-zinc-500">TIAGO MORAES CHAVES</div>
          </div>
        </div>
      </header>

      {/* ÁREA DE TRABALHO */}
      <div className="flex flex-1 overflow-hidden relative bg-[#E6E6E6]">
        
        {/* CABEÇALHOS DA PLANILHA */}
        <div className="absolute top-0 left-12 right-0 h-8 bg-[#E6E6E6] border-b border-[#B1B1B1] flex z-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="min-w-[100px] h-full border-r border-[#B1B1B1] flex items-center justify-center text-[9px] font-bold text-[#666]">
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        
        <div className="absolute top-8 left-0 bottom-0 w-12 bg-[#E6E6E6] border-r border-[#B1B1B1] flex flex-col z-20">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="h-[50px] w-full border-b border-[#B1B1B1] flex items-center justify-center text-[9px] font-bold text-[#666]">
              {i + 1}
            </div>
          ))}
        </div>

        {/* WORKSPACE */}
        <main 
          className="flex-1 ml-12 mt-8 relative bg-white overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseDown={(e) => {
            if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
              setIsPanning(true);
              setPanStart({ x: e.clientX, y: e.clientY });
            }
          }}
          ref={canvasRef}
        >
          {/* GRADE - AGORA FUNCIONA QUANDO ATIVADA */}
          {showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{ 
                backgroundImage: `linear-gradient(#D1D1D1 1px, transparent 1px), linear-gradient(90deg, #D1D1D1 1px, transparent 1px)`,
                backgroundSize: `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`,
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                opacity: 0.3
              }}
            />
          )}

          {/* BIBLIOTECA (COM ÍCONE DE ACESSO) */}
          {showLibrary && (
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white border-l-2 border-black z-30 overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b-2 border-black p-3 flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase">BIBLIOTECA</h3>
                <button onClick={() => setShowLibrary(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-3">
                {Object.entries(LAYERS).map(([key, info]) => (
                  <div key={key} className="mb-4 border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="p-1 border rounded" style={{ color: info.color, borderColor: info.color }}>{info.icon}</span>
                      <span className="text-[10px] font-bold" style={{ color: info.color }}>{key}: {info.name}</span>
                    </div>
                    <p className="text-[9px] text-zinc-600 mb-2">{info.longDesc}</p>
                    <div className="grid grid-cols-2 gap-1 text-[8px] bg-gray-50 p-2">
                      {Object.entries(info.metrics).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-zinc-400">{k}:</span>
                          <span className="font-bold ml-1">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-[8px] text-zinc-500">
                      <span className="font-bold">Saídas:</span> {info.validNext.join(' → ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LINHA DE CORTE */}
          {cutMode && cutStart && cutEnd && (
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
            >
              <line
                x1={cutStart.x}
                y1={cutStart.y}
                x2={cutEnd.x}
                y2={cutEnd.y}
                stroke="#dc2626"
                strokeWidth="3"
                strokeDasharray="10,10"
              />
            </svg>
          )}

          {/* SVG CONEXÕES - AGORA COM LIGAÇÃO CENTRAL */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
          >
            <defs>
              <marker 
                id="arrow" 
                viewBox="0 0 10 10" 
                refX="8" 
                refY="5" 
                markerWidth="4" 
                markerHeight="4" 
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#000" />
              </marker>
            </defs>
            
            {connections.map((conn) => {
              const src = nodes.find(n => n.id === conn.sourceId);
              const tgt = nodes.find(n => n.id === conn.targetId);
              if (!src || !tgt) return null;
              
              const isValid = LAYERS[src.layer]?.validNext?.includes(tgt.layer) || false;
              
              return (
                <g key={conn.id}>
                  <line 
                    x1={src.x} 
                    y1={src.y} 
                    x2={tgt.x} 
                    y2={tgt.y} 
                    stroke={isValid ? "#217346" : "#dc2626"} 
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                  {/* PONTO CENTRAL PARA REMOVER */}
                  <circle 
                    cx={(src.x + tgt.x)/2} 
                    cy={(src.y + tgt.y)/2} 
                    r="6" 
                    fill="#dc2626" 
                    className="opacity-0 hover:opacity-60 transition-opacity cursor-pointer"
                    onClick={() => setConnections(prev => prev.filter(c => c.id !== conn.id))}
                  />
                </g>
              );
            })}
          </svg>

          {/* NÓS - AGORA MOSTRAM OS ÍCONES CORRETAMENTE */}
          <div style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
            {nodes.map(node => {
              const info = LAYERS[node.layer];
              const isSelected = selectedNode?.id === node.id;
              
              return (
                <div
                  key={node.id}
                  style={{ left: node.x - 20, top: node.y - 20, position: 'absolute' }}
                  onMouseDown={(e) => { 
                    if (!lockNodes) {
                      e.stopPropagation(); 
                      setDraggingNode(node); 
                    }
                  }}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    selectedNode ? connectNodes(node.id) : setSelectedNode(node); 
                  }}
                  onContextMenu={(e) => { 
                    e.preventDefault(); 
                    removeNode(node.id); 
                  }}
                  className={`w-10 h-10 flex items-center justify-center transition-all border-2 cursor-move
                    ${isSelected 
                      ? 'bg-white border-[#217346] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-110 z-10' 
                      : 'bg-black border-black text-white shadow-md hover:scale-105'}`}
                >
                  {isSelected ? (
                    <span style={{ color: info.color }}>{info.icon}</span>
                  ) : (
                    <span style={{ color: info.color }}>{info.icon}</span>
                  )}
                  
                  {showLabels && (
                    <div className={`absolute -bottom-5 text-[7px] font-bold px-1 whitespace-nowrap
                      ${isSelected ? 'bg-[#217346] text-white' : 'bg-white/90 border border-zinc-200 text-zinc-600'}`}>
                      {info.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="h-6 bg-[#F3F3F3] border-t border-[#D1D1D1] px-4 flex justify-between items-center text-[8px] font-bold">
        <div className="flex items-center gap-4">
          <span className="text-[#217346] flex items-center gap-1">
            <Shield size={10}/> {nodes.length === 0 ? 'STANDBY' : systemAnalysis.conflicts > 0 ? 'ALERTA' : 'NOMINAL'}
          </span>
          <span>Nós: {systemAnalysis.nodeCount}</span>
          <span>Links: {systemAnalysis.connCount}</span>
          {systemAnalysis.conflicts > 0 && <span className="text-red-600">Conflitos: {systemAnalysis.conflicts}</span>}
        </div>
        <div>TIAGO MORAES CHAVES • ARQUITETO DE SISTEMAS</div>
      </footer>
    </div>
  );
}