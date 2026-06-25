import { useState, useEffect, useMemo } from 'react';
import { criarArck, criarEngy, Modo, interpretarTensao } from '@arck/core';

// Singletons — criados uma vez por módulo, não por render
const arck = criarArck();
const engy = criarEngy();

// Converte nó UI {id, layer} para No do core {id, camada}
// Os valores do enum Camada ("L1"…"L5") coincidem com as strings layer da UI
function toNo(node) {
  return { id: node.id, camada: node.layer };
}

// Constrói Ligacao[] do core a partir das ligações e nós da UI
function toLigacoes(conns, nodos) {
  return conns.flatMap(c => {
    const src = nodos.find(n => n.id === c.sourceId);
    const tgt = nodos.find(n => n.id === c.targetId);
    if (!src || !tgt) return [];
    return [{ origem: toNo(src), destino: toNo(tgt) }];
  });
}

// Mapeia modo UI ('mentor' | 'free') para Modo do core (GUIADO | LIVRE)
function toModo(mode) {
  return mode === 'free' ? Modo.LIVRE : Modo.GUIADO;
}

export const useArckCore = () => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [telemetry, setTelemetry] = useState(Array(30).fill(0));
  const [lessons, setLessons] = useState([]);
  const [mode, setMode] = useState('mentor');

  // Tensão real via ENGY — 99.8% guiado, 100% livre+correcto, 0% livre+erro
  const tensao = useMemo(() => {
    return engy.medirTensao(toLigacoes(connections, nodes), toModo(mode));
  }, [connections, nodes, mode]);

  const estadoTensao = useMemo(() => interpretarTensao(tensao), [tensao]);

  useEffect(() => {
    const saved = localStorage.getItem('arck-project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setNodes(data.nodes || []);
        setConnections(data.connections || []);
      } catch (e) {
        console.error('Erro ao carregar projecto guardado', e);
      }
    }

    const interval = setInterval(() => {
      setTelemetry(prev => {
        const v = Math.sin(Date.now() / 500) * 30 + 30 + Math.random() * 10;
        return [...prev.slice(-29), v];
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
    setNodes(prev => [...prev, {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      layer,
      x: 200 + Math.random() * 300,
      y: 150 + Math.random() * 200,
    }]);
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

    const veredito = arck.validarNovaLigacao(
      toNo(source),
      toNo(target),
      toLigacoes(connections, nodes),
    );

    if (veredito.valida) {
      setConnections(prev => [...prev, { id: `conn_${Date.now()}`, sourceId, targetId }]);
      setLessons([]);
    } else {
      setLessons([{
        lesson: {
          id: 'invalid-connection',
          title: 'Conexão inválida',
          severity: 'warning',
          explanation: veredito.motivo || `Não é permitido conectar ${source.layer} a ${target.layer}.`,
          whyItMatters: 'Cada camada tem um propósito específico na arquitectura.',
          consequences: ['Arquitectura inválida', 'Comportamento inesperado'],
          recommendation: {
            description: veredito.regra || 'Verifique as ligações permitidas.',
            steps: [],
          },
        },
      }]);
    }
  };

  const exportProject = () => {
    const blob = new Blob(
      [JSON.stringify({ nodes, connections }, null, 2)],
      { type: 'application/json' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arck-project-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
        console.error('Erro ao importar projecto', err);
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
    tensao,
    estadoTensao,
    lessons,
    mode,
    setMode,
    addNode,
    removeNode,
    connectNodes,
    exportProject,
    importProject,
    resetSystem,
  };
};
