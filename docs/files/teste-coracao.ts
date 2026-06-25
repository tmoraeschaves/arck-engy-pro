/**
 * TESTE DO CORAÇÃO — prova EV-01 e EV-02 do Manual.
 * ------------------------------------------------------------
 * Este teste NÃO abre navegador, NÃO precisa de React, NÃO toca em banco.
 * Roda em milissegundos. Se ele passa, o coração do ARCK está vivo e correto.
 *
 * É a prova de que a regra de validação é testável sem UI — exatamente o que
 * faltava quando a lógica estava espalhada em 3 cópias dentro da interface.
 *
 * Escrito sem framework externo de propósito (sem Jest/Vitest), para rodar
 * com `tsx` ou `ts-node` puro. Depois pluga-se Vitest no projeto real.
 */

import { Camada, No, Ligacao, TipoLigacao } from "./src/dominio";
import { validarLigacao, validarGatilhoUnico, validarCisaoAxial } from "./src/arck-validador";
import { medirTensao, Modo, TENSAO_GUIADO, TENSAO_LIVRE_CORRETO, TENSAO_ERRO } from "./src/engy-tensao";

let passou = 0;
let falhou = 0;

function ok(condicao: boolean, descricao: string) {
  if (condicao) {
    passou++;
    console.log(`  ✓ ${descricao}`);
  } else {
    falhou++;
    console.log(`  ✗ FALHOU: ${descricao}`);
  }
}

// Helpers para montar nós
const no = (id: string, camada: Camada): No => ({ id, camada });
const lig = (origem: No, destino: No): Ligacao => ({ origem, destino });

const L1 = no("in1", Camada.L1_IGNICAO);
const L2 = no("hub1", Camada.L2_HUB);
const L3 = no("proc1", Camada.L3_LOGICA);
const L4 = no("mem1", Camada.L4_POTENCIA);
const L5 = no("out1", Camada.L5_SENSORIA);

console.log("\n=== ARCK — As 5 ligações VÁLIDAS (o caminho correto) ===");
ok(validarLigacao(lig(L1, L2)).tipo === TipoLigacao.GATILHO_UNICO, "L1 → L2 é Gatilho Único");
ok(validarLigacao(lig(L2, L3)).tipo === TipoLigacao.CISAO_AXIAL, "L2 → L3 é Cisão Axial");
ok(validarLigacao(lig(L3, L4)).tipo === TipoLigacao.FLUXO, "L3 → L4 é Fluxo");
ok(validarLigacao(lig(L4, L5)).tipo === TipoLigacao.FLUXO, "L4 → L5 é Fluxo");
ok(validarLigacao(lig(L5, L2)).tipo === TipoLigacao.REBATE_SINCRONO, "L5 → L2 é Rebate Síncrono (o ciclo fecha no Hub)");

console.log("\n=== ARCK — Ligações INVÁLIDAS (o que o arquiteto IMPEDE) ===");
ok(!validarLigacao(lig(L1, L3)).valida, "L1 → L3 é proibido (L1 só liga a L2)");
ok(!validarLigacao(lig(L1, L5)).valida, "L1 → L5 é proibido (pular para a saída)");
ok(!validarLigacao(lig(L2, L4)).valida, "L2 → L4 é proibido (pular o L3)");
ok(!validarLigacao(lig(L3, L2)).valida, "L3 → L2 é proibido (voltar fora do Rebate)");
ok(!validarLigacao(lig(L5, L1)).valida, "L5 → L1 é proibido (o rebate vai ao Hub, não à Ignição)");
ok(!validarLigacao(lig(L3, L3)).valida, "Um nó não liga a si mesmo");

console.log("\n=== ARCK — Gatilho Único (L1 só dispara uma vez) ===");
const jaLigado: Ligacao[] = [lig(L1, L2)];
ok(!validarGatilhoUnico(L1, jaLigado).valida, "L1 que já disparou não pode disparar de novo");
ok(validarGatilhoUnico(L2, jaLigado).valida, "A regra do Gatilho Único só vale para L1");

console.log("\n=== ARCK — Cisão Axial: L2 distribui em RAMOS (1 ou mais, simetria natural) ===");
// Dois ramos independentes, como o template "paralelo"
const L3b = no("proc2", Camada.L3_LOGICA);
const doisRamos: Ligacao[] = [lig(L2, L3), lig(L2, L3b)];
ok(validarCisaoAxial(doisRamos).valida, "L2 com 2 ramos (L3a e L3b) é válido");

// Três ramos (template "estrela") — assimétrico, mas válido (3b: simetria não obrigatória)
const L3c = no("proc3", Camada.L3_LOGICA);
const tresRamos: Ligacao[] = [lig(L2, L3), lig(L2, L3b), lig(L2, L3c)];
ok(validarCisaoAxial(tresRamos).valida, "L2 com 3 ramos assimétricos é válido (simetria é natural, não obrigatória)");

// Um ramo só (template "helicoidal")
ok(validarCisaoAxial([lig(L2, L3)]).valida, "L2 com 1 ramo direto é válido");

// Ramo inválido: L2 tentando ligar a L4 (pular L3)
ok(!validarCisaoAxial([lig(L2, L4)]).valida, "L2 → L4 como ramo é inválido (não é Cisão Axial)");

console.log("\n=== ENGY — Os três estados da Tensão ===");
const cicloCompleto: Ligacao[] = [
  lig(L1, L2), lig(L2, L3), lig(L3, L4), lig(L4, L5), lig(L5, L2),
];
ok(medirTensao(cicloCompleto, Modo.GUIADO) === TENSAO_GUIADO, "Modo Guiado → 99.8% (medidor vivo, não enfeite)");
ok(medirTensao(cicloCompleto, Modo.LIVRE) === TENSAO_LIVRE_CORRETO, "Modo Livre + tudo certo → 100%");

const comErro: Ligacao[] = [lig(L1, L2), lig(L2, L4)]; // L2→L4 é inválida
ok(medirTensao(comErro, Modo.LIVRE) === TENSAO_ERRO, "Modo Livre + um erro → 0% (não existe meio-certo)");

console.log("\n=== RESULTADO ===");
console.log(`  ${passou} passaram, ${falhou} falharam.`);
if (falhou === 0) {
  console.log("  ✅ O CORAÇÃO DO ARCK ESTÁ VIVO. Prova EV-01/EV-02: testável sem UI, sem banco, sem tela.\n");
  process.exit(0);
} else {
  console.log("  ❌ Há regras quebradas. O coração precisa de correção antes de seguir.\n");
  process.exit(1);
}
