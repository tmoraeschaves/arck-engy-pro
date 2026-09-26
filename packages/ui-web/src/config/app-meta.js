// Metadados da aplicação e constantes de layout.
import raiz from "../../../../package.json";
import core from "../../../core/package.json";

// Versão mostrada no cabeçalho = a do package.json da raiz (a mesma das tags git);
// o "kernel" é o pacote @arck/core. Fonte única — não escrever números à mão aqui.
export const METRICS = { version: raiz.version, kernel: `ARCK core v${core.version}` };
export const GRID_SIZE = 50;

// Amplitude máxima de inclinação da vista 3D (graus por eixo).
// Acima disto a folha do desenho aproxima-se de edge-on e deixa de ser legível.
export const LIMITE_3D = 68;
