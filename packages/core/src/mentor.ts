/**
 * MENTOR — O PEDAGOGO (Observabilidade com Voz)
 * ------------------------------------------------------------
 * Separado do ARCK (que valida) e do ENGY (que mede).
 * O Mentor interpreta o estado e fala com o utilizador.
 *
 * Em modo GUIADO: impede o erro e explica porquê.
 * Em modo LIVRE:  deixa o erro acontecer — depois diz "não existe meio-certo".
 * Em INÉRCIA:     convida à ignição.
 *
 * Regra de ouro: o Mentor não toma decisões — ele comunica as do ARCK e do ENGY.
 */

import { No, Veredito } from "./dominio";
import { EstadoTensao, Modo } from "./engy-tensao";

export interface MensagemMentor {
  readonly estado: EstadoTensao;
  readonly titulo: string;
  readonly corpo:  string;
  readonly acoes?: string[];
}

export interface IMentor {
  /** Fala sobre o estado geral do diagrama. */
  analisarEstado(estado: EstadoTensao, modo: Modo): MensagemMentor;

  /**
   * Fala sobre uma ligação bloqueada pelo ARCK.
   * Retorna null se o veredito for válido (nada a dizer).
   */
  analisarVeredito(veredito: Veredito, origem: No, destino: No): MensagemMentor | null;
}

class MentorServico implements IMentor {
  analisarEstado(estado: EstadoTensao, modo: Modo): MensagemMentor {
    switch (estado) {
      case "INERCIA":
        return {
          estado,
          titulo: "Sistema em Inércia",
          corpo:  "O diagrama está em repouso. Adicione nós e crie a primeira Ignição (L1) para tirar o sistema da inércia.",
          acoes:  ["Adicionar nó L1 — Ignição"],
        };

      case "GUIADO":
        return {
          estado,
          titulo: "Modo Guiado — ARCK Activo",
          corpo:  "O ARCK está a validar cada ligação em tempo real. Só ligações correctas são aceites.",
        };

      case "LIVRE_CORRETO":
        return {
          estado,
          titulo: "Arquitectura Íntegra",
          corpo:  "Todas as ligações respeitam as 5 regras. O sistema está em plena tensão — 100%.",
        };

      case "ERRO":
        return {
          estado,
          titulo: "Sistema Comprometido",
          corpo:  "Não existe meio-certo. Uma ligação errada invalida todo o sistema. Tensão: 0%.",
          acoes:  ["Identificar e remover a ligação inválida"],
        };
    }
  }

  analisarVeredito(veredito: Veredito, origem: No, destino: No): MensagemMentor | null {
    if (veredito.valida) return null;

    switch (veredito.regra) {
      case "AUTO_LIGACAO_PROIBIDA":
        return {
          estado: "ERRO",
          titulo: "Auto-Ligação Proibida",
          corpo:  "Um nó não pode ligar a si mesmo. Selecciona um nó de destino diferente.",
        };

      case "GATILHO_UNICO_VIOLADO":
        return {
          estado: "ERRO",
          titulo: "Gatilho Único Violado",
          corpo:  `${origem.camada} (Ignição) já disparou uma ligação. Só pode existir um Gatilho Único por Ignição.`,
          acoes:  ["Remover a ligação existente de L1 antes de criar uma nova"],
        };

      case "DIRECAO_INVALIDA":
        return {
          estado: "ERRO",
          titulo: "Direcção Inválida",
          corpo:  veredito.motivo ?? `${origem.camada} → ${destino.camada} não é uma ligação permitida.`,
          acoes:  [`Ligar ${origem.camada} ao seu destino correcto`],
        };

      default:
        return {
          estado: "ERRO",
          titulo: "Ligação Inválida",
          corpo:  veredito.motivo ?? "Esta ligação não é permitida pela arquitectura.",
        };
    }
  }
}

export function criarMentor(): IMentor {
  return new MentorServico();
}
