import { SECTORS } from "../config/sectores.js";
import { LAYER_ICONS } from "../config/camadas.js";

/** Ícone de uma camada, tendo em conta o sector activo (SECTORS[sector].icons) com
 * fallback para o ícone genérico. `color` explícito (não `currentColor`) porque o
 * nó do diagrama vive dentro do mundo 3D, onde `currentColor` falha (Chromium). */
export function IconeCamada({ sector, camada, size = 18, color }) {
  const Comp = SECTORS[sector]?.icons?.[camada] || LAYER_ICONS[camada];
  return <Comp size={size} color={color} />;
}
