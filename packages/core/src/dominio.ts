/**
 * ARCK & ENGY — NÚCLEO DE DOMÍNIO (L3 · O CORAÇÃO)
 * ------------------------------------------------------------
 * REGRA RL-02 / RL-03: este módulo NÃO importa nada de fora.
 * Não conhece React, não conhece tela, não conhece banco.
 * Se deletar toda a UI e toda a infraestrutura,
 * este arquivo continua compilando e os testes continuam passando.
 */

export enum Camada {
  L1_IGNICAO  = "L1",
  L2_HUB      = "L2",
  L3_LOGICA   = "L3",
  L4_POTENCIA = "L4",
  L5_SENSORIA = "L5",
}

export enum TipoLigacao {
  GATILHO_UNICO   = "GATILHO_UNICO",
  CISAO_AXIAL     = "CISAO_AXIAL",
  FLUXO           = "FLUXO",
  REBATE_SINCRONO = "REBATE_SINCRONO",
}

export interface No {
  id: string;
  camada: Camada;
}

export interface Ligacao {
  origem: No;
  destino: No;
}

export interface Veredito {
  valida: boolean;
  tipo?: TipoLigacao;
  motivo?: string;
  regra?: string;
}
