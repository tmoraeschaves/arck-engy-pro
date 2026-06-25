/**
 * CONTRATOS PÚBLICOS — A PORTA DO CORAÇÃO (RL-03)
 * ------------------------------------------------------------
 * Único ficheiro que a UI importa do core.
 * A UI fala com a PORTA (interface). O core implementa a porta.
 * Trocar o interior do core não toca na UI — desde que a porta seja respeitada.
 *
 * RL-03: comunicação entre módulos só via contrato/interface.
 * RL-05: implementações são injectadas de fora; nunca instanciadas dentro.
 *
 * Os três pilares:
 *   IArck   — valida ligações, impede erros
 *   IEngy   — mede o estado do diagrama (quatro estados)
 *   IMentor — interpreta o estado e fala com o utilizador
 */

export { Camada, TipoLigacao } from "./dominio";
export type { No, Ligacao, Veredito } from "./dominio";

export {
  Modo,
  TENSAO_INERCIA,
  TENSAO_GUIADO,
  TENSAO_LIVRE_CORRETO,
  TENSAO_ERRO,
  interpretarTensao,
} from "./engy-tensao";
export type { EstadoTensao } from "./engy-tensao";

export type { MensagemMentor } from "./mentor";

import type { No, Ligacao, Veredito } from "./dominio";
import type { Modo }                  from "./engy-tensao";
import type { EstadoTensao }          from "./engy-tensao";
import type { MensagemMentor }        from "./mentor";

/** IArck — "Posso criar esta ligação?" */
export interface IArck {
  validarNovaLigacao(
    origem: No,
    destino: No,
    ligacoesExistentes: Ligacao[]
  ): Veredito;
}

/** IEngy — "Qual é o estado do diagrama?" → número interpretável por interpretarTensao() */
export interface IEngy {
  medirTensao(ligacoes: Ligacao[], modo: Modo): number;
}

/** IMentor — "O que significa este estado? O que deve o utilizador fazer?" */
export interface IMentor {
  analisarEstado(estado: EstadoTensao, modo: Modo): MensagemMentor;
  analisarVeredito(veredito: Veredito, origem: No, destino: No): MensagemMentor | null;
}
