/**
 * ENGY — O MEDIDOR DE TENSÃO (Observabilidade)
 * ------------------------------------------------------------
 * O ENGY é SEPARADO do ARCK. O ARCK decide o que é certo; o ENGY MEDE o estado.
 * Separação de responsabilidades (Manual): a regra (ARCK) não se mistura com a medição (ENGY).
 *
 * A lógica dos três estados, conforme decisão pedagógica de Tiago:
 *   - Modo GUIADO  + tudo correto  → 99.8%  (de propósito, para o medidor parecer VIVO, não enfeite)
 *   - Modo LIVRE   + tudo correto  → 100%
 *   - Modo LIVRE   + qualquer erro → 0%     (não existe meio-certo: ou está certo, ou está errado)
 */

import { Ligacao } from "./dominio";
import { validarLigacao } from "./arck-validador";

export enum Modo {
  GUIADO = "GUIADO", // o ARCK impede erros; o diagrama está sempre correto
  LIVRE = "LIVRE",   // o usuário pode errar; a tensão revela a verdade binária
}

/** O valor da tensão, sempre um destes três no domínio do ARCK. */
export const TENSAO_GUIADO = 99.8;
export const TENSAO_LIVRE_CORRETO = 100;
export const TENSAO_ERRO = 0;

/**
 * Mede a tensão de um diagrama inteiro.
 * No Guiado, assume-se que o ARCK já impediu erros → 99.8%.
 * No Livre, verifica TODAS as ligações: uma errada → 0%; todas certas → 100%.
 */
export function medirTensao(ligacoes: Ligacao[], modo: Modo): number {
  if (modo === Modo.GUIADO) {
    // No Guiado o erro é impossível por construção. A tensão é a constante pedagógica.
    return TENSAO_GUIADO;
  }

  // Modo LIVRE: a verdade é binária. Basta UMA ligação errada para zerar.
  const todasValidas = ligacoes.every((l) => validarLigacao(l).valida);
  return todasValidas ? TENSAO_LIVRE_CORRETO : TENSAO_ERRO;
}
