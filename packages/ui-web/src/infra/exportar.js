/**
 * EXPORTAÇÃO (L4 · infra) — gera SVG/PNG do diagrama e descarrega.
 * `construirSVG` é puro (dado `corDaCamada`); `exportar*` fazem o download.
 */
import { isValidLink } from "../lib/core-bridge.js";
import { METRICS } from "../config/app-meta.js";
import { aparaNaBorda } from "../lib/geometria.js";
import { porAreaDecrescente } from "../lib/contentores.js";
import { ESTILOS_CONTENTOR, OPACIDADE_FUNDO_CONTENTOR, ROTULO_CONTENTOR } from "../config/contentores.js";

const escapar = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Constrói o SVG do diagrama como string. Devolve null se não há nada para exportar.
 * @param corDaCamada (key) => string  — resolve a cor de cada camada
 * @param modoLivre boolean            — em modo livre todas as ligações contam como válidas
 */
export function construirSVG({ nodes, connections, shapes, containers = [], corDaCamada, modoLivre }) {
  if (!nodes.length && !shapes.length && !containers.length) return null;
  // os contentores contam com os dois cantos — a caixa inteira tem de caber na imagem
  const allX = [...nodes.map(n => n.x), ...shapes.map(s => s.x), ...containers.flatMap(c => [c.x, c.x + c.w]), 0];
  const allY = [...nodes.map(n => n.y), ...shapes.map(s => s.y), ...containers.flatMap(c => [c.y, c.y + c.h]), 0];
  const mx = Math.min(...allX) - 70, my = Math.min(...allY) - 70;
  const w = Math.max(400, Math.max(...allX) - mx + 70);
  const h = Math.max(300, Math.max(...allY) - my + 70);

  const gs = porAreaDecrescente(containers).map(c => {
    const dash = ESTILOS_CONTENTOR[c.estilo]?.dash;
    const x = c.x - mx, y = c.y - my;
    return `<g><rect x="${x}" y="${y}" width="${c.w}" height="${c.h}" rx="6" fill="${c.cor}" fill-opacity="${OPACIDADE_FUNDO_CONTENTOR}" stroke="${c.cor}" stroke-width="1.5"${dash ? ` stroke-dasharray="${dash}"` : ""}/><text x="${x + 10}" y="${y + 16}" font-size="12" font-weight="bold" fill="${c.cor}" font-family="system-ui">${escapar(c.label || ROTULO_CONTENTOR)}</text></g>`;
  }).join("");

  const cs = connections.map(c => {
    const s = nodes.find(n => n.id === c.sourceId), t = nodes.find(n => n.id === c.targetId);
    if (!s || !t) return "";
    const ok = modoLivre || isValidLink(s.layer, t.layer);
    const l = aparaNaBorda({ x: s.x - mx, y: s.y - my }, { x: t.x - mx, y: t.y - my }); // seta à vista, fora do nó
    return `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="${ok ? "#10B981" : "#EF4444"}" stroke-width="2" marker-end="url(#arr)"/>`;
  }).join("");

  const ns = nodes.map(n => {
    const c = corDaCamada(n.layer);
    return `<g transform="translate(${n.x - mx - 20},${n.y - my - 20})"><rect width="40" height="40" fill="${c}" rx="6" opacity=".9"/><text x="20" y="26" text-anchor="middle" font-size="8" fill="white" font-weight="bold" font-family="system-ui">${n.layer}</text></g>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker></defs><rect width="${w}" height="${h}" fill="white"/>${gs}${cs}${ns}<text x="${w - 8}" y="${h - 5}" text-anchor="end" font-size="7" fill="#94a3b8" font-family="system-ui">Architect &amp; Engineer v${METRICS.version}</text></svg>`;
}

function descarregar(href, download) {
  const a = Object.assign(document.createElement("a"), { href, download });
  a.click();
}

export function exportarSVG(svg) {
  if (!svg) return;
  descarregar(URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })), `ae_${Date.now()}.svg`);
}

/** Largura e altura declaradas no SVG gerado por `construirSVG`. */
export function dimensoesSVG(svg) {
  const w = Number(/<svg[^>]*\swidth="([\d.]+)"/.exec(svg)?.[1]);
  const h = Number(/<svg[^>]*\sheight="([\d.]+)"/.exec(svg)?.[1]);
  return { w, h };
}

// O tamanho vem do próprio SVG — antes era recalculado só pelos nós e, com formas ou
// contentores fora desse rectângulo, a imagem saía esticada/cortada.
export function exportarPNG(svg) {
  if (!svg) return;
  const { w, h } = dimensoesSVG(svg);
  const img = new window.Image();
  img.onload = () => {
    const cv = document.createElement("canvas");
    cv.width = w * 2; cv.height = h * 2;
    const ctx = cv.getContext("2d");
    ctx.scale(2, 2);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    cv.toBlob(b => descarregar(URL.createObjectURL(b), `ae_${Date.now()}.png`), "image/png");
  };
  img.src = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
}
