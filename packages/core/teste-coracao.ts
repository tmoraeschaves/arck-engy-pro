/**
 * TESTE DO CORAÇÃO — prova EV-01 e EV-02 do Manual.
 * Roda sem navegador, sem React, sem banco. Milissegundos.
 * Se passa: o coração do ARCK está vivo e correto.
 */

import { Camada, No, Ligacao, TipoLigacao } from "./src/dominio";
import { validarLigacao, validarGatilhoUnico, validarCisaoAxial } from "./src/arck-validador";
import {
  medirTensao, interpretarTensao, Modo,
  TENSAO_INERCIA, TENSAO_GUIADO, TENSAO_LIVRE_CORRETO, TENSAO_ERRO,
} from "./src/engy-tensao";
import { criarArck, criarEngy, criarMentor } from "./src/servico";

let passou = 0;
let falhou = 0;

function ok(condicao: boolean, descricao: string) {
  if (condicao) { passou++; console.log(`  ✓ ${descricao}`); }
  else          { falhou++; console.log(`  ✗ FALHOU: ${descricao}`); }
}

const no  = (id: string, camada: Camada): No       => ({ id, camada });
const lig = (origem: No, destino: No): Ligacao      => ({ origem, destino });

const L1 = no("in1",   Camada.L1_IGNICAO);
const L2 = no("hub1",  Camada.L2_HUB);
const L3 = no("proc1", Camada.L3_LOGICA);
const L4 = no("mem1",  Camada.L4_POTENCIA);
const L5 = no("out1",  Camada.L5_SENSORIA);

// ── ARCK: ligações válidas ────────────────────────────────────────────────────
console.log("\n=== ARCK — As 5 ligações VÁLIDAS ===");
ok(validarLigacao(lig(L1, L2)).tipo === TipoLigacao.GATILHO_UNICO,   "L1 → L2 é Gatilho Único");
ok(validarLigacao(lig(L2, L3)).tipo === TipoLigacao.CISAO_AXIAL,     "L2 → L3 é Cisão Axial");
ok(validarLigacao(lig(L3, L4)).tipo === TipoLigacao.FLUXO,           "L3 → L4 é Fluxo");
ok(validarLigacao(lig(L4, L5)).tipo === TipoLigacao.FLUXO,           "L4 → L5 é Fluxo");
ok(validarLigacao(lig(L5, L2)).tipo === TipoLigacao.REBATE_SINCRONO, "L5 → L2 é Rebate Síncrono");

// ── ARCK: ligações inválidas ──────────────────────────────────────────────────
console.log("\n=== ARCK — Ligações INVÁLIDAS ===");
ok(!validarLigacao(lig(L1, L3)).valida, "L1 → L3 proibido");
ok(!validarLigacao(lig(L1, L5)).valida, "L1 → L5 proibido");
ok(!validarLigacao(lig(L2, L4)).valida, "L2 → L4 proibido (saltar L3)");
ok(!validarLigacao(lig(L3, L2)).valida, "L3 → L2 proibido (retorno fora do Rebate)");
ok(!validarLigacao(lig(L5, L1)).valida, "L5 → L1 proibido (rebate vai ao Hub, não à Ignição)");
ok(!validarLigacao(lig(L3, L3)).valida, "Auto-ligação proibida");

// ── ARCK: Gatilho Único ───────────────────────────────────────────────────────
console.log("\n=== ARCK — Gatilho Único ===");
const jaLigado: Ligacao[] = [lig(L1, L2)];
ok(!validarGatilhoUnico(L1, jaLigado).valida, "L1 que já disparou não pode disparar de novo");
ok( validarGatilhoUnico(L2, jaLigado).valida, "Regra do Gatilho Único só vale para L1");

// ── ARCK: Cisão Axial ─────────────────────────────────────────────────────────
console.log("\n=== ARCK — Cisão Axial: L2 distribui em ramos (simetria natural, não obrigatória) ===");
const L3b = no("proc2", Camada.L3_LOGICA);
const L3c = no("proc3", Camada.L3_LOGICA);
ok( validarCisaoAxial([lig(L2, L3)]).valida,                             "L2 com 1 ramo é válido");
ok( validarCisaoAxial([lig(L2, L3), lig(L2, L3b)]).valida,               "L2 com 2 ramos é válido");
ok( validarCisaoAxial([lig(L2, L3), lig(L2, L3b), lig(L2, L3c)]).valida, "L2 com 3 ramos assimétricos é válido");
ok(!validarCisaoAxial([lig(L2, L4)]).valida,                             "L2 → L4 como ramo é inválido");

// ── ENGY: os quatro estados ───────────────────────────────────────────────────
console.log("\n=== ENGY — Os quatro estados da Tensão ===");
const cicloCompleto: Ligacao[] = [lig(L1,L2), lig(L2,L3), lig(L3,L4), lig(L4,L5), lig(L5,L2)];
const comErro:       Ligacao[] = [lig(L1,L2), lig(L2,L4)];

ok(medirTensao([],            Modo.LIVRE)   === TENSAO_INERCIA,        "Diagrama vazio em LIVRE → Inércia (-1)");
ok(medirTensao([],            Modo.GUIADO)  === TENSAO_INERCIA,        "Diagrama vazio em GUIADO → Inércia (repouso precede o modo)");
ok(medirTensao(cicloCompleto, Modo.GUIADO)  === TENSAO_GUIADO,         "Modo Guiado com ligações → 99.8%");
ok(medirTensao(cicloCompleto, Modo.LIVRE)   === TENSAO_LIVRE_CORRETO,  "Modo Livre + correto → 100%");
ok(medirTensao(comErro,       Modo.LIVRE)   === TENSAO_ERRO,           "Modo Livre + erro → 0%");

ok(interpretarTensao(TENSAO_INERCIA)        === "INERCIA",       "interpretarTensao: -1 → INERCIA");
ok(interpretarTensao(TENSAO_GUIADO)         === "GUIADO",        "interpretarTensao: 99.8 → GUIADO");
ok(interpretarTensao(TENSAO_LIVRE_CORRETO)  === "LIVRE_CORRETO", "interpretarTensao: 100 → LIVRE_CORRETO");
ok(interpretarTensao(TENSAO_ERRO)           === "ERRO",          "interpretarTensao: 0 → ERRO");

// ── MENTOR: o pedagogo ────────────────────────────────────────────────────────
console.log("\n=== MENTOR — O Pedagogo (terceiro pilar) ===");
const mentor = criarMentor();

ok(mentor.analisarEstado("INERCIA",       Modo.LIVRE).estado   === "INERCIA",       "Mentor: estado INÉRCIA identificado");
ok(mentor.analisarEstado("GUIADO",        Modo.GUIADO).estado  === "GUIADO",        "Mentor: estado GUIADO identificado");
ok(mentor.analisarEstado("LIVRE_CORRETO", Modo.LIVRE).estado   === "LIVRE_CORRETO", "Mentor: estado LIVRE_CORRETO identificado");
ok(mentor.analisarEstado("ERRO",          Modo.LIVRE).estado   === "ERRO",          "Mentor: estado ERRO identificado");

// Mentor analisa veredito válido → silêncio (null)
const arck = criarArck();
const veredito_ok  = arck.validarNovaLigacao(L1, L2, []);
const veredito_nok = arck.validarNovaLigacao(L1, L3, []);
ok(mentor.analisarVeredito(veredito_ok,  L1, L2) === null, "Mentor: ligação válida → silêncio (null)");
ok(mentor.analisarVeredito(veredito_nok, L1, L3) !== null, "Mentor: ligação inválida → mensagem de explicação");

// Mentor distingue INÉRCIA de ERRO (mesmo número, semântica oposta)
const msg_inercia = mentor.analisarEstado("INERCIA", Modo.LIVRE);
const msg_erro    = mentor.analisarEstado("ERRO",    Modo.LIVRE);
ok(msg_inercia.titulo !== msg_erro.titulo, "Mentor: INÉRCIA e ERRO têm títulos distintos (mesmo 0, semântica diferente)");

// ── CONTRATO completo (RL-03) ─────────────────────────────────────────────────
console.log("\n=== CONTRATO (RL-03) — Os três pilares via fábrica ===");
const engy = criarEngy();

ok( arck.validarNovaLigacao(L1, L2, []).valida,                   "Contrato ARCK: L1→L2 válida");
ok(!arck.validarNovaLigacao(L1, L3, []).valida,                   "Contrato ARCK: L1→L3 inválida");
ok(!arck.validarNovaLigacao(L1, L2, [lig(L1, L2)]).valida,        "Contrato ARCK: Gatilho Único bloqueado");
ok( arck.validarNovaLigacao(L2, L3, []).valida,                   "Contrato ARCK: L2→L3 válida");
ok(!arck.validarNovaLigacao(L3, L3, []).valida,                   "Contrato ARCK: auto-ligação bloqueada");
ok(engy.medirTensao([],            Modo.LIVRE)  === TENSAO_INERCIA,       "Contrato ENGY: vazio → Inércia");
ok(engy.medirTensao(cicloCompleto, Modo.GUIADO) === TENSAO_GUIADO,        "Contrato ENGY: 99.8% no guiado");
ok(engy.medirTensao(cicloCompleto, Modo.LIVRE)  === TENSAO_LIVRE_CORRETO, "Contrato ENGY: 100% no livre correcto");
ok(engy.medirTensao(comErro,       Modo.LIVRE)  === TENSAO_ERRO,          "Contrato ENGY: 0% com erro");

// ── RESULTADO ─────────────────────────────────────────────────────────────────
console.log("\n=== RESULTADO ===");
console.log(`  ${passou} passaram, ${falhou} falharam.`);
if (falhou === 0) {
  console.log("  ✅ O CORAÇÃO DO ARCK ESTÁ VIVO. EV-01/EV-02: testável sem UI, sem banco, sem tela.\n");
  process.exit(0);
} else {
  console.log("  ❌ Há regras quebradas. Corrigir antes de seguir.\n");
  process.exit(1);
}
