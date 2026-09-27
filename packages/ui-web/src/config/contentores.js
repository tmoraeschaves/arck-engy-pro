// Contentores de agrupamento (DEC-018) — caixas translúcidas com rótulo, desenhadas à mão.
// Só visual: nenhum nó "pertence" a um contentor no modelo (DEC-005). Cor e contorno
// distinguem o tipo de fronteira — ex. AWS: VPC contínua, Zona de Disponibilidade tracejada.

export const CORES_CONTENTOR = [
  { id: "verde",    cor: "#16A34A", nome: "Verde" },
  { id: "azul",     cor: "#0284C7", nome: "Azul" },
  { id: "roxo",     cor: "#7C3AED", nome: "Roxo" },
  { id: "laranja",  cor: "#EA580C", nome: "Laranja" },
  { id: "vermelho", cor: "#DC2626", nome: "Vermelho" },
  { id: "cinza",    cor: "#475569", nome: "Cinza" },
];

export const ESTILOS_CONTENTOR = {
  continuo:  { nome: "Contínuo",  dash: undefined },
  tracejado: { nome: "Tracejado", dash: "8,5" },
};

export const ROTULO_CONTENTOR = "Grupo";
export const TAMANHO_MINIMO_CONTENTOR = 60;
// um clique sem arrastar (ou um arrasto minúsculo) cria uma caixa com este tamanho
export const TAMANHO_PADRAO_CONTENTOR = { w: 320, h: 200 };
export const OPACIDADE_FUNDO_CONTENTOR = 0.07;
