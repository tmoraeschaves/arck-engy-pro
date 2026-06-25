/**
 * TESTES DE FRONTEIRA — induzir falha para provar robustez.
 * Casos que o teste-coracao.ts não cobre: entradas vazias, IDs duplicados,
 * comportamentos implícitos que podem surpreender numa revisão.
 */

import { Camada, No, Ligacao } from "./src/dominio";
import { validarLigacao, validarCisaoAxial } from "./src/arck-validador";
import { medirTensao, Modo, TENSAO_INERCIA, TENSAO_ERRO } from "./src/engy-tensao";
import { criarArck } from "./src/servico";

let passou = 0;
let falhou = 0;

function ok(condicao: boolean, descricao: string) {
  if (condicao) { passou++; console.log(`  ✓ ${descricao}`); }
  else          { falhou++; console.log(`  ✗ FALHOU: ${descricao}`); }
}

const no  = (id: string, camada: Camada): No      => ({ id, camada });
const lig = (origem: No, destino: No): Ligacao     => ({ origem, destino });

const L1 = no("ig1",  Camada.L1_IGNICAO);
const L2 = no("hub1", Camada.L2_HUB);
const L3 = no("lx1",  Camada.L3_LOGICA);
const L4 = no("pt1",  Camada.L4_POTENCIA);
const L5 = no("sx1",  Camada.L5_SENSORIA);

// ── ENGY: os quatro estados nos casos de fronteira ────────────────────────────

console.log("\n=== ENGY — Casos de fronteira ===");

// Diagrama vazio → INÉRCIA (não 100%, não 99.8%)
ok(medirTensao([], Modo.LIVRE)  === TENSAO_INERCIA,
   "Diagrama vazio em LIVRE → Inércia (não confundir com 100%)");

ok(medirTensao([], Modo.GUIADO) === TENSAO_INERCIA,
   "Diagrama vazio em GUIADO → Inércia (repouso precede o modo)");

// Uma ligação válida + uma inválida em LIVRE → 0% (não existe meio-certo)
const mistura: Ligacao[] = [lig(L1, L2), lig(L2, L4)];
ok(medirTensao(mistura, Modo.LIVRE) === TENSAO_ERRO,
   "Uma ligação errada entre válidas em LIVRE → 0% (meio-certo não existe)");

// ── ARCK: dados inconsistentes vindos da UI ───────────────────────────────────

console.log("\n=== ARCK — Dados inconsistentes (mesmo ID, camadas diferentes) ===");

const arck = criarArck();

// Dois nós com o mesmo ID — bloqueados como auto-ligação
const dup_l1 = no("dup", Camada.L1_IGNICAO);
const dup_l2 = no("dup", Camada.L2_HUB);
ok(!validarLigacao(lig(dup_l1, dup_l2)).valida,
   "Nós com mesmo ID são tratados como auto-ligação (mesmo ID = mesmo nó)");

// ── GATILHO ÚNICO: L1 tenta segunda saída para L2 diferente ──────────────────

console.log("\n=== GATILHO ÚNICO — Segunda saída para destinos diferentes ===");

const hub_a = no("hub-a", Camada.L2_HUB);
const hub_b = no("hub-b", Camada.L2_HUB);
const existentes: Ligacao[] = [lig(L1, hub_a)];

ok(!arck.validarNovaLigacao(L1, hub_b, existentes).valida,
   "L1 que já disparou não pode disparar para um L2 diferente");

ok(arck.validarNovaLigacao(L2, no("lx2", Camada.L3_LOGICA), [lig(L2, L3)]).valida,
   "L2 pode ter segunda saída para L3 diferente (Cisão Axial)");

// ── CISÃO AXIAL: casos limite ─────────────────────────────────────────────────

console.log("\n=== CISÃO AXIAL — Casos limite ===");

ok(validarCisaoAxial([]).valida,
   "Cisão Axial com array vazio → válido (sem ligações, nada a violar)");

ok(!validarCisaoAxial([lig(L2, L3), lig(L2, L4)]).valida,
   "Ramo inválido dentro da Cisão Axial contamina todo o conjunto");

ok(validarCisaoAxial([lig(L3, L4)]).valida,
   "Ligações que não partem de L2 são ignoradas na Cisão Axial");

// ── REBATE SÍNCRONO: só L5 → L2 ──────────────────────────────────────────────

console.log("\n=== REBATE SÍNCRONO — O único retorno ===");

ok(!arck.validarNovaLigacao(L5, L1, []).valida,
   "L5 → L1 proibido (rebate vai ao Hub, nunca à Ignição)");

ok(!arck.validarNovaLigacao(L5, L3, []).valida,
   "L5 → L3 proibido (rebate só para L2, nunca para outras camadas)");

// ── RESULTADO ─────────────────────────────────────────────────────────────────

console.log("\n=== RESULTADO DOS TESTES DE FRONTEIRA ===");
console.log(`  ${passou} passaram, ${falhou} falharam.`);
if (falhou === 0) {
  console.log("  ✅ Sistema robusto nos casos de fronteira.\n");
  process.exit(0);
} else {
  console.log("  ❌ Há casos de fronteira não tratados. Corrigir antes de produção.\n");
  process.exit(1);
}
