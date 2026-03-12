import { useState, useEffect } from 'react';

export const useArckCore = () => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [telemetry, setTelemetry] = useState(Array(30).fill(0));
  const [lessons, setLessons] = useState([]);
  const [mode, setMode] = useState('mentor');

  useEffect(() => {
    const saved = localStorage.getItem('arck-project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setNodes(data.nodes || []);
        setConnections(data.connections || []);
      } catch (e) {
        console.error('Erro ao carregar', e);
      }
    }

    const interval = setInterval(() => {
      setTelemetry(prev => {
        const newVal = Math.sin(Date.now() / 500) * 30 + 30 + Math.random() * 10;
        return [...prev.slice(-29), newVal];
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('arck-project', JSON.stringify({ nodes, connections }));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [nodes, connections]);

  const addNode = (layer) => {
    const newNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      layer,
      x: 200 + Math.random() * 300,
      y: 150 + Math.random() * 200
    };
    setNodes(prev => [...prev, newNode]);
  };

  const removeNode = (id) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.sourceId !== id && c.targetId !== id));
  };

  const connectNodes = (sourceId, targetId) => {
    if (sourceId === targetId) return;
    
    const source = nodes.find(n => n.id === sourceId);
    const target = nodes.find(n => n.id === targetId);
    
    if (!source || !target) return;
    
    if (connections.some(c => c.sourceId === sourceId && c.targetId === targetId)) return;
    
    const validMap = { L1: 'L2', L2: 'L3', L3: 'L4', L4: 'L5', L5: 'L2' };
    const valid = validMap[source.layer] === target.layer;
    
    if (valid) {
      const newConn = {
        id: `conn_${Date.now()}`,
        sourceId,
        targetId
      };
      setConnections(prev => [...prev, newConn]);
    } else {
      setLessons([{
        lesson: {
          id: 'invalid-connection',
          title: 'Conexão inválida',
          severity: 'warning',
          explanation: `Não é permitido conectar ${source.layer} diretamente a ${target.layer}.`,
          whyItMatters: 'Cada camada tem um propósito específico.',
          consequences: ['Arquitetura quebrada', 'Comportamento inesperado'],
          recommendation: {
            description: `Conecte ${source.layer} a ${validMap[source.layer]} primeiro.`,
            steps: [`Adicionar ${validMap[source.layer]}`]
          }
        }
      }]);
    }
  };

  const exportProject = () => {
    const data = { nodes, connections };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arck-project-${Date.now()}.json`;
    a.click();
  };

  const importProject = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setNodes(data.nodes || []);
        setConnections(data.connections || []);
      } catch (err) {
        console.error('Erro ao importar', err);
      }
    };
    reader.readAsText(file);
  };

  const resetSystem = () => {
    setNodes([]);
    setConnections([]);
    setLessons([]);
    localStorage.removeItem('arck-project');
  };

  return {
    nodes,
    connections,
    telemetry,
    lessons,
    mode,
    setMode,
    addNode,
    removeNode,
    connectNodes,
    exportProject,
    importProject,
    resetSystem
  };
}; 
