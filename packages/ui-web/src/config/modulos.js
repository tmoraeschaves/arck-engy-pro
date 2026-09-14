/**
 * MÓDULOS DENTRO DE UM NÓ (config · Movimento 8)
 * ------------------------------------------------------------
 * Vocabulário de `kind` — a etiqueta visual que o utilizador escolhe para cada
 * módulo. Dados estáticos, zero lógica. Os ícones são componentes lucide-react.
 *
 * O modelo por trás é sempre o mesmo (`{id,label,kind,nota,filho}`); `kind` só
 * muda o rótulo e o ícone com que o módulo aparece na lista.
 */
import { Package, Braces, FileCode, Server, Database, LayoutGrid, Plug, ShieldCheck } from "lucide-react";

export const MODULO_KINDS = [
  { id: "modulo", label: "Módulo", Icone: Package },
  { id: "funcao", label: "Função", Icone: Braces },
  { id: "ficheiro", label: "Ficheiro", Icone: FileCode },
  { id: "servico", label: "Serviço", Icone: Server },
  { id: "dados", label: "Dados", Icone: Database },
  { id: "interface", label: "Interface", Icone: LayoutGrid },
  { id: "integracao", label: "Integração", Icone: Plug },
  { id: "seguranca", label: "Segurança", Icone: ShieldCheck },
];

export const MODULO_KIND_PADRAO = "modulo";

/** Entrada do vocabulário para um `kind` (cai no padrão se o id for desconhecido). */
export function kindInfo(id) {
  return MODULO_KINDS.find(k => k.id === id) || MODULO_KINDS[0];
}
