import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, Wifi, Cpu, Battery, Wrench, Repeat,
  Download, Upload, RotateCcw, BookOpen, Activity
} from 'lucide-react';

import { MentorPanel } from './components/MentorPanel';
import { useArckCore } from './hooks/useArckCore';

function App() {
  const {
    nodes,
    connections,
    telemetry,
    lessons,
    setMode,
    addNode,
    removeNode,
    connectNodes,
    exportProject,
    importProject,
    resetSystem
  } = useArckCore();

  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [showMentor, setShowMentor] = useState(true);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const layerColors = {
    L1: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
    L2: 'text-green-400 border-green-400/30 bg-green-400/10',
    L3: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    L4: 'text-orange-600 border-orange-600/30 bg-orange-600/10',
    L5: 'text-slate-200 border-slate-200/30 bg-slate-200/10'
  };

  const layerIcons = {
    L1: <Wifi className="w-5 h-5" />,
    L2: <Cpu className="w-5 h-5" />,
    L3: <Battery className="w-5 h-5" />,
    L4: <Wrench className="w-5 h-5" />,
    L5: <Repeat className="w-5 h-5" />
  };

  const handleMouseDown = (e, node) => {
    e.preventDefault();
    setDraggingNode(node);
  };

  const handleMouseMove = (e) => {
    if (draggingNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      draggingNode.x = x;
      draggingNode.y = y;
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const handleNodeClick = (node) => {
    if (selectedNode) {
      connectNodes(selectedNode.id, node.id);
      setSelectedNode(null);
    } else {
      setSelectedNode(node);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 font-mono"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ShieldCheck className="text-cyan-400 w-8 h-8" />
            <div>
              <h1 className="text-2xl font-black tracking-tighter">
                ARCK <span className="text-slate-600">&</span> ENGY
                <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full ml-2">
                  v2.0.0
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              onChange={(e) => setMode(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs"
            >
              <option value="sketch">✏️ Sketch</option>
              <option value="professional">🔷 Professional</option>
              <option value="mentor">🤖 Mentor</option>
            </select>

            <button onClick={exportProject} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={() => fileInputRef.current.click()} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
              <Upload className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={importProject} className="hidden" />
            <button onClick={resetSystem} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowMentor(!showMentor)}
              className={`p-2 rounded-lg transition ${
                showMentor ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-4 gap-6 h-[800px]">
          
          {/* Canvas */}
          <div className={`${showMentor ? 'col-span-3' : 'col-span-4'} transition-all`}>
            <div 
              ref={canvasRef}
              className="h-full bg-slate-900/50 rounded-2xl border border-slate-800 relative overflow-hidden"
            >
              {/* Palette */}
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-slate-900/95 rounded-xl border border-slate-700 p-2 flex gap-1">
                  {Object.entries(layerIcons).map(([layer, icon]) => (
                    <button
                      key={layer}
                      onClick={() => addNode(layer)}
                      className={`p-2 rounded-lg border ${layerColors[layer]} hover:scale-105 transition`}
                      title={`Adicionar ${layer}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* SVG Canvas */}
              <svg className="w-full h-full">
                {/* Grid */}
                <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Connections */}
                {connections.map((conn) => {
                  const source = nodes.find(n => n.id === conn.sourceId);
                  const target = nodes.find(n => n.id === conn.targetId);
                  if (!source || !target) return null;
                  
                  return (
                    <g key={conn.id}>
                      <path
                        d={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                        stroke="#4ecdc4"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <circle cx={target.x} cy={target.y} r="4" fill="#4ecdc4" />
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map(node => (
                  <g
                    key={node.id}
                    transform={`translate(${node.x},${node.y})`}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, node);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNodeClick(node);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeNode(node.id);
                    }}
                    className="cursor-grab"
                  >
                    {selectedNode?.id === node.id && (
                      <circle r="32" className="fill-none stroke-cyan-400/50" strokeWidth="2" strokeDasharray="4,4" />
                    )}
                    
                    <circle
                      r="24"
                      className={`${layerColors[node.layer].split(' ')[2]} stroke-2 ${layerColors[node.layer].split(' ')[1]}`}
                      strokeWidth={selectedNode?.id === node.id ? "4" : "2"}
                    />
                    
                    <foreignObject x="-12" y="-12" width="24" height="24">
                      <div className={`flex items-center justify-center ${layerColors[node.layer].split(' ')[0]}`}>
                        {layerIcons[node.layer]}
                      </div>
                    </foreignObject>
                    
                    <text
                      y="35"
                      textAnchor="middle"
                      className={`text-[8px] font-bold fill-current opacity-70 ${layerColors[node.layer].split(' ')[0]}`}
                    >
                      {node.layer}
                    </text>
                  </g>
                ))}
              </svg>

              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-slate-600">Clique nos ícones acima para adicionar componentes</p>
                </div>
              )}
            </div>
          </div>

          {/* Mentor Panel */}
          {showMentor && (
            <div className="col-span-1">
              <MentorPanel lessons={lessons} />
              
              {/* Telemetry */}
              <div className="mt-4 bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <h3 className="text-xs text-slate-500 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Telemetria
                </h3>
                <div className="h-24 flex items-end gap-[2px] overflow-hidden">
                  {telemetry.map((value, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 opacity-50"
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 p-3 text-center text-[10px] text-slate-600">
        <span>Clique: selecionar/conectar | Botão direito: remover | Arraste: reposicionar</span>
      </footer>
    </div>
  );
}

export default App;