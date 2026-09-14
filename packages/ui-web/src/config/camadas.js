// As cinco camadas base L1–L5: cor, próxima camada válida e métricas ilustrativas.
// Os ícones vivem em componentes/IconeCamada.jsx (variam por sector — ver
// SECTORS[x].icons em sectores.js); LAYER_ICONS aqui é só o conjunto genérico
// de reserva. Ficheiro puro (sem JSX) — dados apenas.
import { Wifi, Cpu, Battery, Wrench, Repeat } from "lucide-react";

export const LAYERS = {
  L1: { color: "#3B82F6", validNext: ["L2"], metrics: { input: "0-10V", impedance: "1MΩ" } },
  L2: { color: "#10B981", validNext: ["L3"], metrics: { clock: "100MHz", memory: "256KB" } },
  L3: { color: "#F59E0B", validNext: ["L4"], metrics: { voltage: "24V", current: "10A" } },
  L4: { color: "#EF4444", validNext: ["L5"], metrics: { torque: "5Nm", speed: "3000rpm" } },
  L5: { color: "#8B5CF6", validNext: ["L2"], metrics: { resolution: "12bit", accuracy: "±0.1%" } },
};

export const LAYER_KEYS = ["L1", "L2", "L3", "L4", "L5"];

// Ícones genéricos — usados quando o sector activo não define os seus próprios.
export const LAYER_ICONS = { L1: Wifi, L2: Cpu, L3: Battery, L4: Wrench, L5: Repeat };
