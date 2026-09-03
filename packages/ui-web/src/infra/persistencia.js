/**
 * PERSISTÊNCIA (L4 · infra) — localStorage e ficheiros.
 * Isola os efeitos colaterais de armazenamento. Não conhece React.
 */
const CHAVE_PROJETO = "ae_project";
const CHAVE_MODELOS = "ae_models";
const CHAVE_SECTOR  = "ae_sector";

/** Grava o projecto no localStorage e devolve o JSON gravado. */
export function guardarProjetoLocal(projeto) {
  const json = JSON.stringify(projeto, null, 2);
  localStorage.setItem(CHAVE_PROJETO, json);
  return json;
}

export function apagarProjetoLocal() {
  localStorage.removeItem(CHAVE_PROJETO);
}

/** Descarrega o projecto como ficheiro .json para o disco do utilizador. */
export function descarregarProjeto(projeto) {
  const json = JSON.stringify(projeto, null, 2);
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([json], { type: "application/json" })),
    download: `ae_project_${Date.now()}.json`,
  });
  a.click();
}

/** Lê um ficheiro JSON escolhido pelo utilizador. Rejeita se não for JSON válido. */
export function lerFicheiroJSON(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = (ev) => {
      try { resolve(JSON.parse(ev.target.result)); }
      catch (e) { reject(e); }
    };
    r.onerror = () => reject(new Error("erro ao ler o ficheiro"));
    r.readAsText(file);
  });
}

/** Modelos pessoais do utilizador (lista). Nunca rebenta — devolve [] se corrompido. */
export function lerModelos() {
  try { return JSON.parse(localStorage.getItem(CHAVE_MODELOS) || "[]"); }
  catch { return []; }
}

export function guardarModelos(lista) {
  localStorage.setItem(CHAVE_MODELOS, JSON.stringify(lista));
}

export function guardarSectorLocal(key) {
  localStorage.setItem(CHAVE_SECTOR, key);
}
