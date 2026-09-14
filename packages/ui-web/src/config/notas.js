/**
 * CORES DAS NOTAS (config · Movimento 7)
 * ------------------------------------------------------------
 * Paleta fixa para as anotações do canvas. Cada cor traz o fundo, a borda, a
 * barra do cabeçalho e a cor do texto — para o texto nunca ficar branco sobre
 * claro (foi o bug: `text-amber-900` do Tailwind podia não sair e o texto
 * herdava o branco do tema escuro).
 *
 * `key` é o que fica guardado em `anotacao.cor`; ausente = "amber" (o padrão).
 */
export const NOTA_CORES = [
  { key: "amber",  nome: "Âmbar",   bg: "#FEF3C7", borda: "#FCD34D", cabecalho: "#FDE68A", texto: "#78350F" },
  { key: "rose",   nome: "Rosa",    bg: "#FFE4E6", borda: "#FDA4AF", cabecalho: "#FECDD3", texto: "#881337" },
  { key: "sky",    nome: "Azul",    bg: "#E0F2FE", borda: "#7DD3FC", cabecalho: "#BAE6FD", texto: "#0C4A6E" },
  { key: "emerald",nome: "Verde",   bg: "#D1FAE5", borda: "#6EE7B7", cabecalho: "#A7F3D0", texto: "#064E3B" },
  { key: "violet", nome: "Violeta", bg: "#EDE9FE", borda: "#C4B5FD", cabecalho: "#DDD6FE", texto: "#4C1D95" },
  { key: "slate",  nome: "Cinza",   bg: "#F1F5F9", borda: "#CBD5E1", cabecalho: "#E2E8F0", texto: "#1E293B" },
];

export const NOTA_COR_PADRAO = "amber";

/** Entrada da paleta para uma `key` (cai no padrão se for desconhecida ou ausente). */
export function notaCor(key) {
  return NOTA_CORES.find(c => c.key === key) || NOTA_CORES[0];
}
