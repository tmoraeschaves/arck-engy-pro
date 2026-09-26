import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BarraEstado } from "./BarraEstado.jsx";
import { SECTORS } from "../config/sectores.js";

const base = { formas: 0, modoLivre: false, modoSilencioso: false, corIntegridade: "#fff", sector: SECTORS.engenharia, zoom: 1 };
const analise = (o = {}) => ({ nodeCount: 2, connCount: 1, conflicts: 0, cycles: 0, ...o });

describe("BarraEstado", () => {
  it("STANDBY sem nós, NOMINAL sem conflitos, ALERTA com conflitos", () => {
    const { rerender } = render(<BarraEstado {...base} analise={analise({ nodeCount: 0 })} />);
    expect(screen.getByText(/STANDBY/)).toBeInTheDocument();
    rerender(<BarraEstado {...base} analise={analise()} />);
    expect(screen.getByText(/NOMINAL/)).toBeInTheDocument();
    rerender(<BarraEstado {...base} analise={analise({ conflicts: 2 })} />);
    expect(screen.getByText(/ALERTA/)).toBeInTheDocument();
    expect(screen.getByText("⚠ 2 conflitos")).toBeInTheDocument();
  });

  it("em modo livre não acusa conflitos", () => {
    render(<BarraEstado {...base} modoLivre analise={analise({ conflicts: 2 })} />);
    expect(screen.getByText(/LIVRE/)).toBeInTheDocument();
    expect(screen.queryByText(/conflito/)).toBeNull();
  });
});
