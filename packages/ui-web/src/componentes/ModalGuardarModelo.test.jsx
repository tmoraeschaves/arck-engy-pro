import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalGuardarModelo } from "./ModalGuardarModelo.jsx";

describe("ModalGuardarModelo", () => {
  it("GUARDAR fica desactivado com nome vazio ou só espaços", () => {
    render(<ModalGuardarModelo resumo="" onGuardar={() => {}} onFechar={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Microsserviços/), { target: { value: "   " } });
    expect(screen.getByText("GUARDAR")).toBeDisabled();
  });

  it("Enter guarda com o nome aparado", () => {
    const onGuardar = vi.fn();
    render(<ModalGuardarModelo resumo="" onGuardar={onGuardar} onFechar={() => {}} />);
    const input = screen.getByPlaceholderText(/Microsserviços/);
    fireEvent.change(input, { target: { value: "  Loja  " } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onGuardar).toHaveBeenCalledWith("Loja");
  });
});
