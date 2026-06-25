/**
 * FÁBRICA — A COMPOSIÇÃO (Composition Root local)
 * --------------------------------------------------------------------
 * Único ponto onde as implementações são instanciadas.
 * A UI chama criarArck(), criarEngy(), criarMentor() e recebe
 * instâncias escondidas atrás dos contratos (IArck, IEngy, IMentor).
 *
 * RL-05: nunca instanciar os *Servico directamente na UI.
 *
 * Os três pilares do ARCK:
 *   criarArck()   → valida ligações
 *   criarEngy()   → mede o estado
 *   criarMentor() → interpreta e comunica
 */

import type { No, Ligacao, Veredito } from "./dominio";
import { validarLigacao, validarGatilhoUnico } from "./arck-validador";
import { medirTensao as _medirTensao, Modo } from "./engy-tensao";
import { criarMentor as _criarMentor } from "./mentor";
import type { IArck, IEngy, IMentor } from "./contratos";

class ArckServico implements IArck {
  validarNovaLigacao(origem: No, destino: No, ligacoesExistentes: Ligacao[]): Veredito {
    const gatilho = validarGatilhoUnico(origem, ligacoesExistentes);
    if (!gatilho.valida) return gatilho;
    return validarLigacao({ origem, destino });
  }
}

class EngyServico implements IEngy {
  medirTensao(ligacoes: Ligacao[], modo: Modo): number {
    return _medirTensao(ligacoes, modo);
  }
}

export function criarArck(): IArck     { return new ArckServico(); }
export function criarEngy(): IEngy     { return new EngyServico(); }
export function criarMentor(): IMentor { return _criarMentor(); }
