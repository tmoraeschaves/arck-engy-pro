import { useEffect, useMemo, useState } from "react";
import { isValidLink, displayTensao, medirTensao, interpretarTensao, toLigacoes, toModo } from "../lib/core-bridge.js";

/**
 * INTEGRIDADE (L2 · aplicação) — o que o ENGY mede sobre o diagrama, pronto a mostrar.
 * `health` e `estado` vêm do core (via core-bridge — fonte única, nunca recalcular aqui);
 * `analise` são contagens para a barra de estado; `pulso` é só a fase da animação das
 * barras (corre enquanto há ligações para medir, pára quando não há).
 */
export function useIntegridade(nodes, connections, freeMode) {
  const health = useMemo(() =>
    medirTensao(toLigacoes(connections, nodes), toModo(freeMode)),
  [connections, nodes, freeMode]);

  const estado = useMemo(() => interpretarTensao(health), [health]);

  const analise = useMemo(() => {
    const extremos = c => [nodes.find(n=>n.id===c.sourceId), nodes.find(n=>n.id===c.targetId)];
    const conflicts = connections.filter(c => { const [s,t]=extremos(c); return s&&t&&!isValidLink(s.layer,t.layer); }).length;
    const cycles    = connections.filter(c => { const [s,t]=extremos(c); return s?.layer==="L5"&&t?.layer==="L2"; }).length;
    return { nodeCount:nodes.length, connCount:connections.length, conflicts, cycles };
  }, [nodes, connections]);

  const [pulso, setPulso] = useState(0);
  useEffect(() => {
    if (!nodes.length || !connections.length) return;
    const id = setInterval(() => setPulso(p => (p + 0.35) % (Math.PI * 2)), 130);
    return () => clearInterval(id);
  }, [nodes.length, connections.length]);

  const inercia = estado === "INERCIA";
  const cor = inercia ? "#64748B" : health >= 99 ? "#10B981" : health >= 70 ? "#F59E0B" : "#EF4444";

  return { health, estado, inercia, cor, texto: displayTensao(health, estado), analise, pulso };
}
