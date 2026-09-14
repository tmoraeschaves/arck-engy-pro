import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PainelModulos } from "./PainelModulos.jsx";

const noBase = { id: "n1", layer: "L3", modules: [] };
const props = (over = {}) => ({
  no: noBase,
  layerName: () => "LÓGICA",
  layerColor: () => "#8B5CF6",
  dispatch: vi.fn(),
  onFechar: vi.fn(),
  ...over,
});

describe("PainelModulos", () => {
  it("sem módulos, mostra o convite e o cabeçalho da camada", () => {
    render(<PainelModulos {...props()} />);
    expect(screen.getByText("LÓGICA")).toBeInTheDocument();
    expect(screen.getByText(/O que é que vive dentro desta camada/)).toBeInTheDocument();
  });

  it("'Adicionar módulo' despacha ADICIONAR_MODULO com um kind padrão", () => {
    const dispatch = vi.fn();
    render(<PainelModulos {...props({ dispatch })} />);
    fireEvent.click(screen.getByText("Adicionar módulo"));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      tipo: "ADICIONAR_MODULO", noId: "n1",
      modulo: expect.objectContaining({ label: "Novo módulo", kind: "modulo" }),
    }));
  });

  it("editar o nome despacha EDITAR_MODULO", () => {
    const dispatch = vi.fn();
    const no = { id: "n1", layer: "L3", modules: [{ id: "m1", label: "A", kind: "modulo" }] };
    render(<PainelModulos {...props({ no, dispatch })} />);
    fireEvent.change(screen.getByLabelText("Nome do módulo"), { target: { value: "Autenticação" } });
    expect(dispatch).toHaveBeenCalledWith({ tipo: "EDITAR_MODULO", noId: "n1", moduloId: "m1", patch: { label: "Autenticação" } });
  });

  it("mudar o tipo despacha EDITAR_MODULO com o novo kind", () => {
    const dispatch = vi.fn();
    const no = { id: "n1", layer: "L3", modules: [{ id: "m1", label: "A", kind: "modulo" }] };
    render(<PainelModulos {...props({ no, dispatch })} />);
    fireEvent.change(screen.getByLabelText("Tipo do módulo"), { target: { value: "funcao" } });
    expect(dispatch).toHaveBeenCalledWith({ tipo: "EDITAR_MODULO", noId: "n1", moduloId: "m1", patch: { kind: "funcao" } });
  });

  it("as setas de ordem despacham MOVER_MODULO e ficam desactivadas nos limites", () => {
    const dispatch = vi.fn();
    const no = { id: "n1", layer: "L3", modules: [
      { id: "m1", label: "A" }, { id: "m2", label: "B" }, { id: "m3", label: "C" },
    ] };
    render(<PainelModulos {...props({ no, dispatch })} />);
    const subir = screen.getAllByRole("button").filter(b => b.querySelector(".lucide-chevron-up"));
    // o primeiro "subir" (do módulo A) está desactivado
    expect(subir[0]).toBeDisabled();
    // o segundo "subir" (do módulo B) move-o para cima
    fireEvent.click(subir[1]);
    expect(dispatch).toHaveBeenCalledWith({ tipo: "MOVER_MODULO", noId: "n1", moduloId: "m2", direccao: -1 });
  });

  it("o X do cabeçalho fecha o painel", () => {
    const onFechar = vi.fn();
    render(<PainelModulos {...props({ onFechar })} />);
    const fechar = screen.getAllByRole("button").find(b => b.querySelector(".lucide-x"));
    fireEvent.click(fechar);
    expect(onFechar).toHaveBeenCalled();
  });
});
