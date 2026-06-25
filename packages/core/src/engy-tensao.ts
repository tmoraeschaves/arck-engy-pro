/**
 * ENGY — O MEDIDOR DE TENSÃO (Observabilidade)
 * ------------------------------------------------------------
 * Separado do ARCK. O ARCK decide o que é certo; o ENGY MEDE o estado.
 *
 * Quatro estados possíveis:
 *
 *   INÉRCIA     → -1   diagrama vazio, sistema em repouso (ainda não iniciado)
 *   Modo GUIADO → 99.8% (medidor vivo, não enfeite)
 *   Modo LIVRE + tudo certo → 100%
 *   Modo LIVRE + qualquer erro → 0%  (não existe meio-certo)
 *
 * INÉRCIA é diferente de ERRO: ambos mostram "zero" no ecrã, mas têm semântica
 * oposta. O Mentor usa interpretarTensao() para distingui-los e falar o certo.
 */

import { Ligacao } from "./dominio";
import { validarLigacao } from "./arck-validador";

export enum Modo {
  GUIADO = "GUIADO",
  LIVRE  = "LIVRE",
}

export const TENSAO_INERCIA        = -1;   // diagrama em repouso — sem ligações
export const TENSAO_GUIADO        = 99.8;
export const TENSAO_LIVRE_CORRETO = 100;
export const TENSAO_ERRO          = 0;

export type EstadoTensao = "INERCIA" | "GUIADO" | "LIVRE_CORRETO" | "ERRO";

export function medirTensao(ligacoes: Ligacao[], modo: Modo): number {
  if (ligacoes.length === 0) return TENSAO_INERCIA;          // repouso, qualquer modo
  if (modo === Modo.GUIADO)  return TENSAO_GUIADO;
  const todasValidas = ligacoes.every((l) => validarLigacao(l).valida);
  return todasValidas ? TENSAO_LIVRE_CORRETO : TENSAO_ERRO;
}

/** Interpreta o valor numérico em estado nomeado — usado pelo Mentor e pela UI. */
export function interpretarTensao(tensao: number): EstadoTensao {
  if (tensao === TENSAO_INERCIA)        return "INERCIA";
  if (tensao === TENSAO_GUIADO)         return "GUIADO";
  if (tensao === TENSAO_LIVRE_CORRETO)  return "LIVRE_CORRETO";
  return "ERRO";
}
