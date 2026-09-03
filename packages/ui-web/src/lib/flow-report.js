/**
 * RELATÓRIO DE FLUXO — descrição automática do diagrama.
 * Função pura. Ver teste-flow-report.mjs (inclui os casos de fronteira da Lição 3:
 * diagrama vazio, ciclos, ramificações).
 */
import { isValidLink } from "./core-bridge.js";

export function computeFlowReport(nodes, connections) {
  if (!nodes.length) return null;
  const sorted = [...nodes].sort((a, b) => a.createdAt - b.createdAt);
  const lc = {}, labels = {};
  sorted.forEach(n => { lc[n.layer] = (lc[n.layer] || 0) + 1; labels[n.id] = `${n.layer}${lc[n.layer] > 1 ? String.fromCharCode(64 + lc[n.layer]) : ""}`; });

  const out = {}, inc = {};
  connections.forEach(c => { (out[c.sourceId] = out[c.sourceId] || []).push(c.targetId); (inc[c.targetId] = inc[c.targetId] || []).push(c.sourceId); });

  function trace(id, visited = new Set(), depth = 0) {
    if (depth > 30) return labels[id] + "…";
    if (visited.has(id)) return labels[id] + "(↻)";
    const v = new Set(visited); v.add(id);
    const nexts = out[id] || [];
    const lbl = labels[id] || id;
    if (!nexts.length) return lbl;
    if (nexts.length === 1) return lbl + " → " + trace(nexts[0], v, depth + 1);
    return lbl + " ⊕ [ " + nexts.map(nid => trace(nid, new Set(v), depth + 1)).join(" | ") + " ]";
  }

  const entries = nodes.filter(n => !inc[n.id]?.length);
  const starts = entries.length ? entries : nodes.filter(n => n.layer === "L1");
  const paths = (starts.length ? starts : [nodes[0]]).map(n => trace(n.id));

  const inv = {};
  sorted.forEach(n => { (inv[n.layer] = inv[n.layer] || []).push(labels[n.id]); });

  const valid = connections.filter(c => { const s = nodes.find(n => n.id === c.sourceId), t = nodes.find(n => n.id === c.targetId); return s && t && isValidLink(s.layer, t.layer); }).length;
  const cycles = connections.filter(c => { const s = nodes.find(n => n.id === c.sourceId), t = nodes.find(n => n.id === c.targetId); return s?.layer === "L5" && t?.layer === "L2"; }).length;

  return { paths, inventory: inv, labels, stats: { total: connections.length, valid, invalid: connections.length - valid, cycles } };
}
