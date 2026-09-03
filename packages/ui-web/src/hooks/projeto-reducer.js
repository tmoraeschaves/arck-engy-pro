/**
 * REDUCER DO PROJECTO (L2 · aplicação)
 * ------------------------------------------------------------
 * Máquina de estados do documento — tudo o que é guardado/carregado:
 * nós, ligações, formas, anotações, cores, fundo, sector, modo.
 *
 * Estado de interacção efémero (selecção, arrasto, zoom, painéis, tutorial)
 * NÃO vive aqui — fica no App / hooks de vista.
 *
 * As acções que criam entidades recebem a entidade já formada (com id) —
 * o reducer mantém-se puro e determinístico (ver testes/projeto-reducer.test.mjs).
 * O `id`/`createdAt` são gerados por quem despacha.
 */
import { toNo, toLigacoes, validarNovaLigacao } from "../lib/core-bridge.js";

export const estadoInicial = {
  nodes: [],
  connections: [],
  shapes: [],
  annotations: [],
  customColors: {},
  bgImage: null,
  bgOpacity: 0.3,
  sector: null,
  freeMode: false,
};

/** Snapshot serializável do projecto (o que vai para JSON / localStorage / modelo). */
export function snapshot(estado) {
  return {
    nodes: estado.nodes,
    connections: estado.connections,
    shapes: estado.shapes,
    annotations: estado.annotations,
    customColors: estado.customColors,
    bgImage: estado.bgImage,
    bgOpacity: estado.bgOpacity,
    sector: estado.sector,
    freeMode: estado.freeMode,
  };
}

/** Uma ligação sourceId→targetId é permitida no estado actual? (modo + regra + duplicados) */
export function podeLigar(estado, sourceId, targetId) {
  if (sourceId === targetId) return false;
  const src = estado.nodes.find(n => n.id === sourceId);
  const tgt = estado.nodes.find(n => n.id === targetId);
  if (!src || !tgt) return false;
  const dup = estado.connections.find(c =>
    (c.sourceId === sourceId && c.targetId === targetId) ||
    (c.sourceId === targetId && c.targetId === sourceId));
  if (dup) return false;
  if (estado.freeMode) return true;
  return validarNovaLigacao(toNo(src), toNo(tgt), toLigacoes(estado.connections, estado.nodes)).valida;
}

export function projetoReducer(estado, accao) {
  switch (accao.tipo) {

    // ── projecto inteiro ────────────────────────────────────────────────────
    case "CARREGAR_PROJETO": {
      const p = accao.projeto || {};
      return {
        ...estado,
        nodes: p.nodes || [],
        connections: p.connections || [],
        shapes: p.shapes || [],
        annotations: p.annotations || [],
        customColors: p.customColors || {},
        bgImage: p.bgImage || estado.bgImage,
        bgOpacity: p.bgOpacity ?? estado.bgOpacity,
        sector: p.sector || estado.sector,
        freeMode: p.freeMode ?? estado.freeMode,
      };
    }

    case "RESETAR":
      // limpa o diagrama e o fundo; mantém sector, modo, cores, opacidade
      return { ...estado, nodes: [], connections: [], shapes: [], annotations: [], bgImage: null };

    // ── nós ─────────────────────────────────────────────────────────────────
    case "ADICIONAR_NO":
      return { ...estado, nodes: [...estado.nodes, accao.no] };

    case "REMOVER_NO":
      return {
        ...estado,
        nodes: estado.nodes.filter(n => n.id !== accao.id),
        connections: estado.connections.filter(c => c.sourceId !== accao.id && c.targetId !== accao.id),
      };

    case "MOVER_NO":
      return {
        ...estado,
        nodes: estado.nodes.map(n => n.id === accao.id ? { ...n, x: accao.x, y: accao.y } : n),
      };

    case "ESCALAR_LAYOUT": {
      if (!estado.nodes.length) return estado;
      const cx = estado.nodes.reduce((s, n) => s + n.x, 0) / estado.nodes.length;
      const cy = estado.nodes.reduce((s, n) => s + n.y, 0) / estado.nodes.length;
      return {
        ...estado,
        nodes: estado.nodes.map(n => ({ ...n, x: cx + (n.x - cx) * accao.fator, y: cy + (n.y - cy) * accao.fator })),
      };
    }

    case "INSERIR_TEMPLATE":
      return {
        ...estado,
        nodes: [...estado.nodes, ...accao.nodes],
        connections: [...estado.connections, ...accao.connections],
      };

    // ── ligações ────────────────────────────────────────────────────────────
    case "LIGAR": {
      const { id, sourceId, targetId } = accao.ligacao;
      if (!podeLigar(estado, sourceId, targetId)) return estado;
      return { ...estado, connections: [...estado.connections, { id, sourceId, targetId }] };
    }

    case "DESLIGAR":
      return { ...estado, connections: estado.connections.filter(c => c.id !== accao.id) };

    case "CORTAR_LIGACOES": {
      const remover = new Set(accao.ids);
      if (!remover.size) return estado;
      return { ...estado, connections: estado.connections.filter(c => !remover.has(c.id)) };
    }

    // ── formas ──────────────────────────────────────────────────────────────
    case "ADICIONAR_FORMA":
      return { ...estado, shapes: [...estado.shapes, accao.forma] };

    case "MOVER_FORMA":
      return { ...estado, shapes: estado.shapes.map(s => s.id === accao.id ? { ...s, x: accao.x, y: accao.y } : s) };

    case "REDIMENSIONAR_FORMA":
      return {
        ...estado,
        shapes: estado.shapes.map(s => s.id === accao.id ? { ...s, x: accao.x, y: accao.y, w: accao.w, h: accao.h } : s),
      };

    case "REMOVER_FORMA":
      return { ...estado, shapes: estado.shapes.filter(s => s.id !== accao.id) };

    // ── anotações ───────────────────────────────────────────────────────────
    case "ADICIONAR_ANOTACAO":
      return { ...estado, annotations: [...estado.annotations, accao.anotacao] };

    case "EDITAR_ANOTACAO":
      return { ...estado, annotations: estado.annotations.map(a => a.id === accao.id ? { ...a, text: accao.text } : a) };

    case "ALTERNAR_ANOTACAO":
      return { ...estado, annotations: estado.annotations.map(a => a.id === accao.id ? { ...a, expanded: !a.expanded } : a) };

    case "REMOVER_ANOTACAO":
      return { ...estado, annotations: estado.annotations.filter(a => a.id !== accao.id) };

    // ── aparência ───────────────────────────────────────────────────────────
    case "DEFINIR_COR":
      return { ...estado, customColors: { ...estado.customColors, [accao.camada]: accao.cor } };

    case "LIMPAR_COR": {
      const cc = { ...estado.customColors };
      delete cc[accao.camada];
      return { ...estado, customColors: cc };
    }

    case "REPOR_CORES":
      return { ...estado, customColors: {} };

    case "DEFINIR_FUNDO":
      return { ...estado, bgImage: accao.img };

    case "DEFINIR_OPACIDADE_FUNDO":
      return { ...estado, bgOpacity: accao.opacidade };

    // ── sector + modo ───────────────────────────────────────────────────────
    case "DEFINIR_SECTOR":
      return { ...estado, sector: accao.sector };

    case "ALTERNAR_MODO_LIVRE":
      return { ...estado, freeMode: !estado.freeMode };

    case "DEFINIR_MODO_LIVRE":
      return { ...estado, freeMode: accao.valor };

    default:
      return estado;
  }
}
