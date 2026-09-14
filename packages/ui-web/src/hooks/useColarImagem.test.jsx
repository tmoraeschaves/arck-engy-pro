import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useColarImagem } from "./useColarImagem.js";

function ficheiroImagemFalso(tipo = "image/png") {
  return { type: tipo, getAsFile: () => new File(["conteudo"], "x.png", { type: tipo }) };
}

function dispararColar(items) {
  const evento = new Event("paste");
  evento.clipboardData = { items };
  window.dispatchEvent(evento);
  return evento;
}

describe("useColarImagem", () => {
  it("colar uma imagem despacha DEFINIR_FUNDO com o data URL", async () => {
    const dispatch = vi.fn();
    renderHook(() => useColarImagem(dispatch));

    dispararColar([ficheiroImagemFalso()]);
    // a leitura do ficheiro é assíncrona (FileReader) — espera o próximo tick
    await vi.waitFor(() => expect(dispatch).toHaveBeenCalledTimes(1));

    const [{ tipo, img }] = dispatch.mock.calls[0];
    expect(tipo).toBe("DEFINIR_FUNDO");
    expect(img).toMatch(/^data:/);
  });

  it("colar texto (sem imagem) não despacha nada", async () => {
    const dispatch = vi.fn();
    renderHook(() => useColarImagem(dispatch));

    dispararColar([{ type: "text/plain", getAsFile: () => null }]);
    await new Promise(r => setTimeout(r, 10));

    expect(dispatch).not.toHaveBeenCalled();
  });
});
