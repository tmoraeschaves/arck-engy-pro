/**
 * ARCK — O ARQUITETO (Validador de Ligações)
 * ------------------------------------------------------------
 * Esta é a ÚNICA fonte de verdade da validação de ligações.
 * Hoje a regra existe em 3 cópias (App.jsx, useArckCore.js, e este core vazio).
 * A partir daqui, ela existe AQUI e só aqui. As outras duas cópias serão apagadas.
 *
 * O ARCK é o arquiteto: ele só PERMITE as ligações corretas.
 * No Modo Guiado, uma ligação inválida é impedida (válida=false → a UI não desenha).
 * Memória muscular pela impossibilidade do erro.
 */

import { Camada, TipoLigacao, Ligacao, Veredito } from "./dominio";

/**
 * O MAPA DE LIGAÇÕES PERMITIDAS.
 * Cada chave é a camada de ORIGEM. O valor diz para onde ela PODE ir, e com que tipo.
 * Tudo que não estiver aqui é, por definição, PROIBIDO.
 *
 * Diagrama do arquiteto (Tiago):
 *   L1 ──Gatilho Único──► L2 ◄──┐
 *                          │     │
 *                    Cisão Axial │ Rebate Síncrono
 *                          ▼     │
 *                          L3    │
 *                          ▼     │
 *                          L4    │
 *                          ▼     │
 *                          L5 ───┘
 */
const LIGACOES_PERMITIDAS: Record<Camada, { destino: Camada; tipo: TipoLigacao }[]> = {
  [Camada.L1_IGNICAO]:  [{ destino: Camada.L2_HUB,      tipo: TipoLigacao.GATILHO_UNICO }],
  [Camada.L2_HUB]:      [{ destino: Camada.L3_LOGICA,   tipo: TipoLigacao.CISAO_AXIAL }],
  [Camada.L3_LOGICA]:   [{ destino: Camada.L4_POTENCIA, tipo: TipoLigacao.FLUXO }],
  [Camada.L4_POTENCIA]: [{ destino: Camada.L5_SENSORIA, tipo: TipoLigacao.FLUXO }],
  [Camada.L5_SENSORIA]: [{ destino: Camada.L2_HUB,      tipo: TipoLigacao.REBATE_SINCRONO }],
};

/**
 * Valida UMA ligação entre dois nós.
 * Esta é a função pura no coração do ARCK. Sem efeitos colaterais.
 * Mesma entrada → mesma saída, sempre. Testável em microssegundos.
 */
export function validarLigacao(ligacao: Ligacao): Veredito {
  const { origem, destino } = ligacao;

  // Um nó não pode ligar a si mesmo.
  if (origem.id === destino.id) {
    return {
      valida: false,
      motivo: "Um nó não pode ligar a si mesmo.",
      regra: "AUTO_LIGACAO_PROIBIDA",
    };
  }

  const saidasPermitidas = LIGACOES_PERMITIDAS[origem.camada];
  const correspondencia = saidasPermitidas.find((s) => s.destino === destino.camada);

  if (!correspondencia) {
    return {
      valida: false,
      motivo: `${origem.camada} não pode ligar a ${destino.camada}. ` +
              `${origem.camada} só liga a: ${saidasPermitidas.map((s) => s.destino).join(", ")}.`,
      regra: "DIRECAO_INVALIDA",
    };
  }

  return { valida: true, tipo: correspondencia.tipo };
}

/**
 * CISÃO AXIAL — L2 distribui em RAMOS.
 * Regra confirmada (3b): o L2 liga a UM OU MAIS L3. O número de ramos é LIVRE
 * (não fixo em 4, não exige simetria). Cada ramo é um ciclo completo e independente:
 *   L2 → L3a → L4a → L5a → (rebate) L2
 *   L2 → L3b → L4b → L5b → (rebate) L2
 * O cálculo de um ramo não cruza com o do outro.
 *
 * A simetria é NATURAL, não obrigatória: um diagrama com 3 atuadores e 1 sensor
 * é válido. Forçar simetria seria o motor inventar uma regra que não é da arquitetura.
 *
 * Esta função valida um conjunto de ligações que saem de um mesmo L2.
 * Cada ramo é validado individualmente pela regra de direção (validarLigacao).
 */
export function validarCisaoAxial(ligacoesDoHub: Ligacao[]): Veredito {
  // Todas as ligações que saem de um L2 devem ir para um L3 (Cisão Axial).
  for (const ligacao of ligacoesDoHub) {
    if (ligacao.origem.camada !== Camada.L2_HUB) continue; // só nos importa o que sai do Hub
    const veredito = validarLigacao(ligacao);
    if (!veredito.valida || veredito.tipo !== TipoLigacao.CISAO_AXIAL) {
      return {
        valida: false,
        motivo: `Cisão Axial inválida: o ramo ${ligacao.origem.id}→${ligacao.destino.id} ` +
                `não é uma ligação L2→L3 válida.`,
        regra: "CISAO_AXIAL_INVALIDA",
      };
    }
  }
  // Um ou mais ramos, todos válidos. Simetria não é exigida.
  return { valida: true, tipo: TipoLigacao.CISAO_AXIAL };
}

/**
 * REGRA DO GATILHO ÚNICO:
 * Um nó L1 só pode disparar UMA ligação. Se já tem uma saída, a segunda é proibida.
 * Recebe as ligações já existentes do diagrama para verificar.
 */
export function validarGatilhoUnico(origem: { id: string; camada: Camada }, ligacoesExistentes: Ligacao[]): Veredito {
  if (origem.camada !== Camada.L1_IGNICAO) {
    return { valida: true }; // a regra só se aplica a L1
  }
  const jaDisparou = ligacoesExistentes.some((l) => l.origem.id === origem.id);
  if (jaDisparou) {
    return {
      valida: false,
      motivo: "L1 (Ignição) é um Gatilho Único: só pode disparar uma ligação.",
      regra: "GATILHO_UNICO_VIOLADO",
    };
  }
  return { valida: true };
}
