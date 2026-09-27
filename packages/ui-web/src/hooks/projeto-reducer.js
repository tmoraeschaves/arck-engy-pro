/**
 * REDUCER DO PROJECTO (L2 · aplicação)
 * ------------------------------------------------------------
 * Máquina de estados do documento — tudo o que é guardado/carregado:
 * nós, ligações, formas, anotações, cores, fundo, sector, modo.
 *
 * Estado de interacção efémero (selecção, arrasto, zoom, painéis, tutorial)
 * NÃO vive aqui — fica no App / hooks de vista.
 *
 * As acções que criam entidades recebem a entidade já formada (com id) —
 * o reducer mantém-se puro e determinístico (ver testes/projeto-reducer.test.mjs).
 * O `id`/`createdAt` são gerados por quem despacha.
 *
 * MÓDULOS (Movimento 8, DEC-013): um nó pode ter `modules: Modulo[]` — a lista de
 * módulos/funções que lhe cabem. Campo opcional; ausente = sem módulos.
 *   Modulo = { id, label, kind?, nota?, filho?: Diagrama | null }
 * `filho` = o módulo foi PROMOVIDO a mini-diagrama próprio (Fatia 3): `Diagrama | null`.
 *   Diagrama = { nodes, connections, shapes, containers, annotations } — herda sector,
 *   modo, cores e fundo do documento; não os repete.
 *
 * SUB-DIAGRAMAS e `caminho` (Movimento 8, Fatia 3): qualquer acção de diagrama pode levar
 * `caminho: [{ noId, moduloId }, …]` — o reducer desce até ao `filho` desse módulo, aplica lá
 * a MESMA lógica (travas, validação de ligações, contentores — nada duplicado) e volta a
 * escrever. Sem `caminho` (ou vazio) actua na raiz. Limite: 3 níveis (raiz = nível 1).
 *
 * CONTENTORES (DEC-018): `containers: Contentor[]` — caixas de agrupamento desenhadas à mão.
 *   Contentor = { id, x, y, w, h, label, cor, estilo: "continuo"|"tracejado", locked? }
 * Só visual (DEC-005): o reducer não sabe o que está dentro de cada um. Quem arrasta
 * calcula o conteúdo pela geometria (lib/contentores.js) e manda-o em `levar`.
 */
import { toNo, toLigacoes, validarNovaLigacao } from "../lib/core-bridge.js";

export const estadoInicial = {
  nodes: [],
  connections: [],
  shapes: [],
  containers: [],
  annotations: [],
  customColors: {},
  bgImage: null,
  bgOpacity: 0.3,
  bgLocked: false,
  sector: null,
  freeMode: false,
};

/** Snapshot serializável do projecto (o que vai para JSON / localStorage / modelo). */
export function snapshot(estado) {
  return {
    nodes: estado.nodes,
    connections: estado.connections,
    shapes: estado.shapes,
    containers: estado.containers,
    annotations: estado.annotations,
    customColors: estado.customColors,
    bgImage: estado.bgImage,
    bgOpacity: estado.bgOpacity,
    bgLocked: estado.bgLocked,
    sector: estado.sector,
    freeMode: estado.freeMode,
  };
}

/** Profundidade máxima: raiz (1) → sub-diagrama (2) → sub-sub-diagrama (3). DEC-013. */
export const PROFUNDIDADE_MAXIMA = 3;

/** Campos que formam um diagrama — a raiz e cada `filho` têm exactamente estes. */
const CAMPOS_DIAGRAMA = ["nodes", "connections", "shapes", "containers", "annotations"];
export const diagramaVazio = () => ({ nodes: [], connections: [], shapes: [], containers: [], annotations: [] });
const soDiagrama = e => Object.fromEntries(CAMPOS_DIAGRAMA.map(k => [k, e[k] || []]));

/** Acções que editam UM diagrama (e por isso aceitam `caminho`). As restantes são do documento. */
const ACCOES_DE_DIAGRAMA = new Set([
  "ADICIONAR_NO", "REMOVER_NO", "MOVER_NO", "ALTERNAR_TRAVA_NO",
  "ADICIONAR_MODULO", "EDITAR_MODULO", "REMOVER_MODULO", "MOVER_MODULO",
  "PROMOVER_MODULO", "DESPROMOVER_MODULO",
  "ESCALAR_LAYOUT", "INSERIR_TEMPLATE", "LIGAR", "DESLIGAR", "CORTAR_LIGACOES",
  "ADICIONAR_FORMA", "MOVER_FORMA", "REDIMENSIONAR_FORMA", "REMOVER_FORMA", "ALTERNAR_TRAVA_FORMA",
  "ADICIONAR_CONTENTOR", "MOVER_CONTENTOR", "REDIMENSIONAR_CONTENTOR", "EDITAR_CONTENTOR",
  "REMOVER_CONTENTOR", "ALTERNAR_TRAVA_CONTENTOR",
  "ADICIONAR_ANOTACAO", "EDITAR_ANOTACAO", "DEFINIR_COR_ANOTACAO", "ALTERNAR_ANOTACAO", "REMOVER_ANOTACAO",
]);

const moduloEm = (estado, { noId, moduloId }) =>
  estado.nodes.find(n => n.id === noId)?.modules?.find(m => m.id === moduloId);

/**
 * O diagrama no fim de `caminho` (a raiz se vazio), ou null se o caminho já não existe
 * (nó apagado, módulo removido ou despromovido) — a vista usa isto para voltar atrás sozinha.
 */
export function diagramaEm(estado, caminho = []) {
  let d = soDiagrama(estado);
  for (const passo of caminho) {
    const filho = moduloEm(d, passo)?.filho;
    if (!filho) return null;
    d = soDiagrama(filho);
  }
  return d;
}

/**
 * Aplica `fn` ao sub-diagrama no fim de `caminho`. `fn` recebe um estado completo (documento
 * + campos do sub-diagrama), por isso as regras do reducer valem igual em qualquer nível.
 * Um no-op em baixo devolve o MESMO estado cá em cima (referência intacta).
 */
function noSubDiagrama(estado, [passo, ...resto], fn) {
  const modulo = moduloEm(estado, passo);
  if (!modulo?.filho) return estado;
  const sub = { ...estado, ...soDiagrama(modulo.filho) };
  const novo = resto.length ? noSubDiagrama(sub, resto, fn) : fn(sub);
  if (novo === sub) return estado;
  return {
    ...estado,
    nodes: estado.nodes.map(n => n.id !== passo.noId ? n : {
      ...n, modules: n.modules.map(m => m.id !== passo.moduloId ? m : { ...m, filho: soDiagrama(novo) }),
    }),
  };
}

/** Uma ligação sourceId→targetId é permitida no estado actual? (modo + regra + duplicados) */
export function podeLigar(estado, sourceId, targetId) {
  if (sourceId === targetId) return false;
  const src = estado.nodes.find(n => n.id === sourceId);
  const tgt = estado.nodes.find(n => n.id === targetId);
  if (!src || !tgt) return false;
  const dup = estado.connections.find(c =>
    (c.sourceId === sourceId && c.targetId === targetId) ||
    (c.sourceId === targetId && c.targetId === sourceId));
  if (dup) return false;
  if (estado.freeMode) return true;
  return validarNovaLigacao(toNo(src), toNo(tgt), toLigacoes(estado.connections, estado.nodes)).valida;
}

export function projetoReducer(estado, accao) {
  if (accao.caminho?.length && ACCOES_DE_DIAGRAMA.has(accao.tipo)) {
    const { caminho, ...local } = accao;
    return noSubDiagrama(estado, caminho, sub => projetoReducer(sub, { ...local, profundidade: caminho.length + 1 }));
  }

  switch (accao.tipo) {

    // ── projecto inteiro ────────────────────────────────────────────────────
    case "CARREGAR_PROJETO": {
      const p = accao.projeto || {};
      return {
        ...estado,
        nodes: p.nodes || [],
        connections: p.connections || [],
        shapes: p.shapes || [],
        containers: p.containers || [],
        annotations: p.annotations || [],
        customColors: p.customColors || {},
        bgImage: p.bgImage || estado.bgImage,
        bgOpacity: p.bgOpacity ?? estado.bgOpacity,
        bgLocked: p.bgLocked ?? estado.bgLocked,
        sector: p.sector || estado.sector,
        freeMode: p.freeMode ?? estado.freeMode,
      };
    }

    case "RESETAR":
      // limpa o diagrama; o fundo só se limpa se não estiver trancado (RL de segurança:
      // um esboço-guia trancado sobrevive ao reset). Mantém sector, modo, cores, opacidade.
      return {
        ...estado, nodes: [], connections: [], shapes: [], containers: [], annotations: [],
        bgImage: estado.bgLocked ? estado.bgImage : null,
      };

    // ── nós ─────────────────────────────────────────────────────────────────
    case "ADICIONAR_NO":
      return { ...estado, nodes: [...estado.nodes, accao.no] };

    case "REMOVER_NO": {
      // nó trancado é intocável — a guarda vive aqui para nenhum caminho da UI
      // (botão direito, tecla Delete, futuro) o conseguir apagar por engano.
      if (estado.nodes.find(n => n.id === accao.id)?.locked) return estado;
      return {
        ...estado,
        nodes: estado.nodes.filter(n => n.id !== accao.id),
        connections: estado.connections.filter(c => c.sourceId !== accao.id && c.targetId !== accao.id),
      };
    }

    case "MOVER_NO": {
      if (estado.nodes.find(n => n.id === accao.id)?.locked) return estado;
      return {
        ...estado,
        nodes: estado.nodes.map(n => n.id === accao.id ? { ...n, x: accao.x, y: accao.y } : n),
      };
    }

    case "ALTERNAR_TRAVA_NO":
      return {
        ...estado,
        nodes: estado.nodes.map(n => n.id === accao.id ? { ...n, locked: !n.locked } : n),
      };

    // ── módulos dentro de um nó (Movimento 8) ───────────────────────────────
    case "ADICIONAR_MODULO": {
      if (!estado.nodes.some(n => n.id === accao.noId)) return estado;
      return {
        ...estado,
        nodes: estado.nodes.map(n => n.id === accao.noId
          ? { ...n, modules: [...(n.modules || []), accao.modulo] }
          : n),
      };
    }

    case "EDITAR_MODULO": {
      const { noId, moduloId, patch } = accao;
      const so = ({ label, kind, nota }) => ({ label, kind, nota }); // nunca id nem filho
      const campos = Object.fromEntries(Object.entries(so(patch)).filter(([, v]) => v !== undefined));
      return {
        ...estado,
        nodes: estado.nodes.map(n => n.id === noId
          ? { ...n, modules: (n.modules || []).map(m => m.id === moduloId ? { ...m, ...campos } : m) }
          : n),
      };
    }

    case "REMOVER_MODULO": {
      const { noId, moduloId } = accao;
      return {
        ...estado,
        nodes: estado.nodes.map(n => n.id === noId
          ? { ...n, modules: (n.modules || []).filter(m => m.id !== moduloId) }
          : n),
      };
    }

    case "MOVER_MODULO": {
      const { noId, moduloId, direccao } = accao; // direccao: -1 (cima) | +1 (baixo)
      const no = estado.nodes.find(n => n.id === noId);
      if (!no || !no.modules) return estado;
      const i = no.modules.findIndex(m => m.id === moduloId);
      const j = i + direccao;
      if (i < 0 || j < 0 || j >= no.modules.length) return estado; // nos limites: no-op
      const mods = [...no.modules];
      [mods[i], mods[j]] = [mods[j], mods[i]];
      return { ...estado, nodes: estado.nodes.map(n => n.id === noId ? { ...n, modules: mods } : n) };
    }

    case "PROMOVER_MODULO": {
      // `profundidade` = nível do diagrama onde o módulo vive (1 = raiz); vem do `caminho`.
      // O filho fica um nível abaixo — recusa se isso passar do limite (DEC-013).
      const { noId, moduloId, profundidade = 1 } = accao;
      if (profundidade + 1 > PROFUNDIDADE_MAXIMA) return estado;
      const modulo = moduloEm(estado, { noId, moduloId });
      if (!modulo || modulo.filho) return estado; // já promovido: não apagar o que lá está
      return {
        ...estado,
        nodes: estado.nodes.map(n => n.id !== noId ? n : {
          ...n, modules: n.modules.map(m => m.id === moduloId ? { ...m, filho: diagramaVazio() } : m),
        }),
      };
    }

    case "DESPROMOVER_MODULO": {
      // volta a ser só um item de lista — o sub-diagrama perde-se (a UI confirma antes)
      const { noId, moduloId } = accao;
      if (!moduloEm(estado, { noId, moduloId })?.filho) return estado;
      return {
        ...estado,
        nodes: estado.nodes.map(n => n.id !== noId ? n : {
          ...n, modules: n.modules.map(m => m.id === moduloId ? { ...m, filho: null } : m),
        }),
      };
    }

    case "ESCALAR_LAYOUT": {
      if (!estado.nodes.length) return estado;
      const cx = estado.nodes.reduce((s, n) => s + n.x, 0) / estado.nodes.length;
      const cy = estado.nodes.reduce((s, n) => s + n.y, 0) / estado.nodes.length;
      return {
        ...estado,
        nodes: estado.nodes.map(n => ({ ...n, x: cx + (n.x - cx) * accao.fator, y: cy + (n.y - cy) * accao.fator })),
      };
    }

    case "INSERIR_TEMPLATE":
      return {
        ...estado,
        nodes: [...estado.nodes, ...accao.nodes],
        connections: [...estado.connections, ...accao.connections],
      };

    // ── ligações ────────────────────────────────────────────────────────────
    case "LIGAR": {
      const { id, sourceId, targetId } = accao.ligacao;
      if (!podeLigar(estado, sourceId, targetId)) return estado;
      return { ...estado, connections: [...estado.connections, { id, sourceId, targetId }] };
    }

    case "DESLIGAR":
      return { ...estado, connections: estado.connections.filter(c => c.id !== accao.id) };

    case "CORTAR_LIGACOES": {
      const remover = new Set(accao.ids);
      if (!remover.size) return estado;
      return { ...estado, connections: estado.connections.filter(c => !remover.has(c.id)) };
    }

    // ── formas ──────────────────────────────────────────────────────────────
    case "ADICIONAR_FORMA":
      return { ...estado, shapes: [...estado.shapes, accao.forma] };

    case "MOVER_FORMA": {
      if (estado.shapes.find(s => s.id === accao.id)?.locked) return estado;
      return { ...estado, shapes: estado.shapes.map(s => s.id === accao.id ? { ...s, x: accao.x, y: accao.y } : s) };
    }

    case "REDIMENSIONAR_FORMA": {
      if (estado.shapes.find(s => s.id === accao.id)?.locked) return estado;
      return {
        ...estado,
        shapes: estado.shapes.map(s => s.id === accao.id ? { ...s, x: accao.x, y: accao.y, w: accao.w, h: accao.h } : s),
      };
    }

    case "REMOVER_FORMA": {
      if (estado.shapes.find(s => s.id === accao.id)?.locked) return estado;
      return { ...estado, shapes: estado.shapes.filter(s => s.id !== accao.id) };
    }

    case "ALTERNAR_TRAVA_FORMA":
      return {
        ...estado,
        shapes: estado.shapes.map(s => s.id === accao.id ? { ...s, locked: !s.locked } : s),
      };

    // ── contentores (DEC-018) ───────────────────────────────────────────────
    case "ADICIONAR_CONTENTOR":
      return { ...estado, containers: [...estado.containers, accao.contentor] };

    case "MOVER_CONTENTOR": {
      // `levar` = o que estava geometricamente dentro quando o arrasto começou, já nas
      // posições novas. O que estiver trancado fica onde está (trancado = não se move).
      const { id, x, y, levar = {} } = accao;
      if (estado.containers.find(c => c.id === id)?.locked) return estado;
      const aplicar = (lista, novas = []) => {
        if (!novas.length) return lista;
        const pos = new Map(novas.map(p => [p.id, p]));
        return lista.map(el => pos.has(el.id) && !el.locked ? { ...el, x: pos.get(el.id).x, y: pos.get(el.id).y } : el);
      };
      return {
        ...estado,
        containers: aplicar(estado.containers, [...(levar.containers || []), { id, x, y }]),
        nodes: aplicar(estado.nodes, levar.nodes),
        shapes: aplicar(estado.shapes, levar.shapes),
        annotations: aplicar(estado.annotations, levar.annotations),
      };
    }

    case "REDIMENSIONAR_CONTENTOR": {
      if (estado.containers.find(c => c.id === accao.id)?.locked) return estado;
      return {
        ...estado,
        containers: estado.containers.map(c => c.id === accao.id ? { ...c, x: accao.x, y: accao.y, w: accao.w, h: accao.h } : c),
      };
    }

    case "EDITAR_CONTENTOR": {
      // só a aparência — posição e tamanho têm acções próprias (e a guarda da trava)
      const { label, cor, estilo } = accao.patch || {};
      const campos = Object.fromEntries(Object.entries({ label, cor, estilo }).filter(([, v]) => v !== undefined));
      return { ...estado, containers: estado.containers.map(c => c.id === accao.id ? { ...c, ...campos } : c) };
    }

    case "REMOVER_CONTENTOR": {
      // apaga só a caixa — o que estava lá dentro fica no canvas (nada lhe pertencia)
      if (estado.containers.find(c => c.id === accao.id)?.locked) return estado;
      return { ...estado, containers: estado.containers.filter(c => c.id !== accao.id) };
    }

    case "ALTERNAR_TRAVA_CONTENTOR":
      return {
        ...estado,
        containers: estado.containers.map(c => c.id === accao.id ? { ...c, locked: !c.locked } : c),
      };

    // ── anotações ───────────────────────────────────────────────────────────
    case "ADICIONAR_ANOTACAO":
      return { ...estado, annotations: [...estado.annotations, accao.anotacao] };

    case "EDITAR_ANOTACAO":
      return { ...estado, annotations: estado.annotations.map(a => a.id === accao.id ? { ...a, text: accao.text } : a) };

    case "DEFINIR_COR_ANOTACAO":
      return { ...estado, annotations: estado.annotations.map(a => a.id === accao.id ? { ...a, cor: accao.cor } : a) };

    case "ALTERNAR_ANOTACAO":
      return { ...estado, annotations: estado.annotations.map(a => a.id === accao.id ? { ...a, expanded: !a.expanded } : a) };

    case "REMOVER_ANOTACAO":
      return { ...estado, annotations: estado.annotations.filter(a => a.id !== accao.id) };

    // ── aparência ───────────────────────────────────────────────────────────
    case "DEFINIR_COR":
      return { ...estado, customColors: { ...estado.customColors, [accao.camada]: accao.cor } };

    case "LIMPAR_COR": {
      const cc = { ...estado.customColors };
      delete cc[accao.camada];
      return { ...estado, customColors: cc };
    }

    case "REPOR_CORES":
      return { ...estado, customColors: {} };

    case "DEFINIR_FUNDO":
      // trancado: intocável até destrancar — nem remover (img=null) nem substituir
      // por outra imagem (colar/arrastar/carregar). O Arquitecto quis "trancar" = fechar.
      if (estado.bgLocked) return estado;
      return { ...estado, bgImage: accao.img };

    case "DEFINIR_OPACIDADE_FUNDO":
      return { ...estado, bgOpacity: accao.opacidade };

    case "ALTERNAR_BLOQUEIO_FUNDO":
      return { ...estado, bgLocked: !estado.bgLocked };

    // ── sector + modo ───────────────────────────────────────────────────────
    case "DEFINIR_SECTOR":
      return { ...estado, sector: accao.sector };

    case "ALTERNAR_MODO_LIVRE":
      return { ...estado, freeMode: !estado.freeMode };

    case "DEFINIR_MODO_LIVRE":
      return { ...estado, freeMode: accao.valor };

    default:
      return estado;
  }
}
