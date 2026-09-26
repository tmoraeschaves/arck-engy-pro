import { aparaNaBorda } from "../lib/geometria.js";

// Uma ligação entre dois nós — linha + marcador de seta + alvo de remoção no meio.
// A cor e o marcador são calculados por quem chama (dependem de silentMode/freeMode/validade).
// A linha é aparada à borda dos nós para a seta ficar à vista (o nó tapava-a).
export function Ligacao({ id, origem, destino, cor, marcador, retorno, onDesligar }) {
  const { x1, y1, x2, y2 } = aparaNaBorda(origem, destino);
  return (
    <g style={{ pointerEvents: "all" }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={cor} strokeWidth={retorno ? 2.5 : 1.8} strokeDasharray={retorno ? "7,4" : undefined}
        markerEnd={`url(#${marcador})`} style={{ pointerEvents: "none" }} />
      <circle cx={(origem.x + destino.x) / 2} cy={(origem.y + destino.y) / 2} r={7} fill="#EF4444"
        className="opacity-0 hover:opacity-50 transition-opacity cursor-pointer"
        onClick={() => onDesligar(id)} />
    </g>
  );
}

/** Os marcadores de seta usados por Ligacao — colocar uma vez dentro de um <svg><defs>. */
export function MarcadoresLigacao() {
  return (
    <defs>
      <marker id="arr-ok" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#10B981" /></marker>
      <marker id="arr-err" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#EF4444" /></marker>
      <marker id="arr-free" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#F59E0B" /></marker>
      <marker id="arr-mute" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#475569" /></marker>
    </defs>
  );
}
