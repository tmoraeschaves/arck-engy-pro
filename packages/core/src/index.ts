/**
 * PONTO DE ENTRADA PÚBLICO DO @arck/core
 * ---------------------------------------
 * Único ficheiro que consumidores externos importam.
 * Isola a estrutura interna do core — mover ficheiros não quebra contratos.
 *
 * Uso correcto:
 *   import { criarArck, criarEngy, criarMentor, Modo, interpretarTensao } from '@arck/core'
 *
 * Nunca importar directamente de arck-validador.ts, engy-tensao.ts, etc.
 */

// Tipos do domínio
export { Camada, TipoLigacao }            from "./dominio";
export type { No, Ligacao, Veredito }     from "./dominio";

// Contratos públicos (interfaces dos três pilares)
export type { IArck, IEngy, IMentor }     from "./contratos";
export type { MensagemMentor }            from "./mentor";

// Estado do ENGY — os quatro estados
export {
  Modo,
  TENSAO_INERCIA,
  TENSAO_GUIADO,
  TENSAO_LIVRE_CORRETO,
  TENSAO_ERRO,
  interpretarTensao,
}                                         from "./engy-tensao";
export type { EstadoTensao }              from "./engy-tensao";

// Fábrica — os três pontos de instanciação
export { criarArck, criarEngy, criarMentor } from "./servico";
