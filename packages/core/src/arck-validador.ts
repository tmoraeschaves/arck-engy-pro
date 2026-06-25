/**
 * ARCK — O ARQUITETO (Validador de Ligações)
 * ------------------------------------------------------------
 * ÚNICA fonte de verdade da validação de ligações.
 * Não duplicar esta lógica em App.jsx ou noutros ficheiros.
 */

import { Camada, TipoLigacao, Ligacao, No, Veredito } from "./dominio";

const LIGACOES_PERMITIDAS: Record<Camada, { destino: Camada; tipo: TipoLigacao }[]> = {
  [Camada.L1_IGNICAO]:  [{ destino: Camada.L2_HUB,      tipo: TipoLigacao.GATILHO_UNICO  }],
  [Camada.L2_HUB]:      [{ destino: Camada.L3_LOGICA,   tipo: TipoLigacao.CISAO_AXIAL    }],
  [Camada.L3_LOGICA]:   [{ destino: Camada.L4_POTENCIA, tipo: TipoLigacao.FLUXO          }],
  [Camada.L4_POTENCIA]: [{ destino: Camada.L5_SENSORIA, tipo: TipoLigacao.FLUXO          }],
  [Camada.L5_SENSORIA]: [{ destino: Camada.L2_HUB,      tipo: TipoLigacao.REBATE_SINCRONO}],
};

export function validarLigacao(ligacao: Ligacao): Veredito {
  const { origem, destino } = ligacao;

  if (origem.id === destino.id) {
    return { valida: false, motivo: "Um nó não pode ligar a si mesmo.", regra: "AUTO_LIGACAO_PROIBIDA" };
  }

  const saidas = LIGACOES_PERMITIDAS[origem.camada];
  const match  = saidas.find((s) => s.destino === destino.camada);

  if (!match) {
    return {
      valida: false,
      motivo: `${origem.camada} não pode ligar a ${destino.camada}. Destinos válidos: ${saidas.map((s) => s.destino).join(", ")}.`,
      regra: "DIRECAO_INVALIDA",
    };
  }

  return { valida: true, tipo: match.tipo };
}

/**
 * CISÃO AXIAL — L2 distribui em RAMOS (1 ou mais, simetria natural/não obrigatória).
 * Cada ramo L2→L3 é validado individualmente. Assimetria é permitida.
 */
export function validarCisaoAxial(ligacoesDoHub: Ligacao[]): Veredito {
  for (const ligacao of ligacoesDoHub) {
    if (ligacao.origem.camada !== Camada.L2_HUB) continue;
    const v = validarLigacao(ligacao);
    if (!v.valida || v.tipo !== TipoLigacao.CISAO_AXIAL) {
      return {
        valida: false,
        motivo: `Cisão Axial inválida: ramo ${ligacao.origem.id}→${ligacao.destino.id} não é L2→L3.`,
        regra: "CISAO_AXIAL_INVALIDA",
      };
    }
  }
  return { valida: true, tipo: TipoLigacao.CISAO_AXIAL };
}

/**
 * GATILHO ÚNICO — L1 só pode disparar uma ligação. Segunda saída é proibida.
 */
export function validarGatilhoUnico(origem: No, ligacoesExistentes: Ligacao[]): Veredito {
  if (origem.camada !== Camada.L1_IGNICAO) return { valida: true };
  const jaDisparou = ligacoesExistentes.some((l) => l.origem.id === origem.id);
  if (jaDisparou) {
    return { valida: false, motivo: "L1 (Ignição) só pode disparar uma ligação.", regra: "GATILHO_UNICO_VIOLADO" };
  }
  return { valida: true };
}
