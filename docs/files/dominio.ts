/**
 * ARCK & ENGY — NÚCLEO DE DOMÍNIO (L3 · O CORAÇÃO)
 * ------------------------------------------------------------
 * Este arquivo é o coração soberano do ARCK.
 * REGRA RL-02 / RL-03 do Manual: este módulo NÃO importa nada de fora.
 * Não conhece React, não conhece tela, não conhece banco.
 * Só conhece as regras de ligação entre camadas.
 *
 * Se você deletar toda a UI e toda a infraestrutura,
 * este arquivo continua compilando e os testes continuam passando.
 * Isso é o EV-01 e EV-02 do Manual.
 */

/** As cinco camadas do ARCK, na ordem canônica. */
export enum Camada {
  L1_IGNICAO = "L1",   // INPUT  · a fagulha, dispara uma vez
  L2_HUB = "L2",       // MONITOR/HUB · o coração que pulsa, recebe e distribui
  L3_LOGICA = "L3",    // PROCESSO · a lógica
  L4_POTENCIA = "L4",  // MEMÓRIA/POTÊNCIA · a força
  L5_SENSORIA = "L5",  // OUTPUT/SENSÓRIA · a saída, rebate ao Hub
}

/** O tipo de uma ligação, segundo o vocabulário do ARCK. */
export enum TipoLigacao {
  GATILHO_UNICO = "GATILHO_UNICO",     // L1 → L2 (linha sólida)
  CISAO_AXIAL = "CISAO_AXIAL",         // L2 → L3 (linha sólida)
  FLUXO = "FLUXO",                     // L3 → L4, L4 → L5 (linha sólida)
  REBATE_SINCRONO = "REBATE_SINCRONO", // L5 → L2 (linha tracejada)
}

/** Um nó no diagrama. O id distingue nós da mesma camada (pode haver vários L1). */
export interface No {
  id: string;
  camada: Camada;
}

/** Uma ligação proposta entre dois nós. */
export interface Ligacao {
  origem: No;
  destino: No;
}

/** O veredito de uma validação: válida, ou inválida com o motivo. */
export interface Veredito {
  valida: boolean;
  tipo?: TipoLigacao;     // preenchido quando válida
  motivo?: string;        // preenchido quando inválida
  regra?: string;         // qual regra do ARCK foi violada
}
