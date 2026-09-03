/**
 * PONTE PARA O CORAÇÃO (RL-PONTE-01)
 * ------------------------------------------------------------
 * Único ponto da UI que fala com @arck/core. Encapsula os singletons
 * e traduz entre a forma da UI ({id, layer}) e a do domínio ({id, camada}).
 *
 * Adaptadores de fronteira: código crítico. Ver teste-core-bridge.mjs.
 */
import { criarArck, criarEngy, Modo, interpretarTensao } from "@arck/core";

const _arck = criarArck();
const _engy = criarEngy();

/** Nó da UI ({id, layer}) → No do domínio ({id, camada}). */
export function toNo(node) {
  return { id: node.id, camada: node.layer };
}

/** Ligações + nós da UI → Ligacao[] do domínio. Ignora ligações com pontas em falta. */
export function toLigacoes(conns, nodos) {
  return conns.flatMap(c => {
    const src = nodos.find(n => n.id === c.sourceId);
    const tgt = nodos.find(n => n.id === c.targetId);
    if (!src || !tgt) return [];
    return [{ origem: toNo(src), destino: toNo(tgt) }];
  });
}

/** Flag da UI (freeMode) → Modo do domínio. */
export function toModo(freeMode) {
  return freeMode ? Modo.LIVRE : Modo.GUIADO;
}

/** Uma ligação isolada entre duas camadas é válida? (sem contexto de ligações existentes) */
export function isValidLink(srcLayer, tgtLayer) {
  return _arck.validarNovaLigacao(
    { id: "_s", camada: srcLayer },
    { id: "_t", camada: tgtLayer },
    [],
  ).valida;
}

/** Veredito completo do ARCK para uma nova ligação, dado o contexto actual. */
export function validarNovaLigacao(origem, destino, ligacoesExistentes) {
  return _arck.validarNovaLigacao(origem, destino, ligacoesExistentes);
}

/** Tensão medida pelo ENGY (número interpretável por interpretarTensao). */
export function medirTensao(ligacoes, modo) {
  return _engy.medirTensao(ligacoes, modo);
}

/** Texto a mostrar para a integridade: "INÉRCIA" quando em repouso, senão "N%". */
export function displayTensao(valor, estado) {
  if (estado === "INERCIA") return "INÉRCIA";
  return `${valor}%`;
}

export { interpretarTensao };
