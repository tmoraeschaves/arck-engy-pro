import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LimiteDeErro } from "./LimiteDeErro.jsx";

function Rebenta() {
  throw new Error("boom de teste");
}

describe("LimiteDeErro", () => {
  beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {}));
  afterEach(() => console.error.mockRestore());

  it("deixa passar os filhos quando não há erro", () => {
    render(<LimiteDeErro><div>conteúdo normal</div></LimiteDeErro>);
    expect(screen.getByText("conteúdo normal")).toBeInTheDocument();
  });

  it("apanha o erro e mostra o aviso com 'Recarregar' em vez de página em branco", () => {
    render(<LimiteDeErro><Rebenta /></LimiteDeErro>);
    expect(screen.getByText(/interrompeu a aplicação/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Recarregar/i })).toBeInTheDocument();
    expect(screen.getByText(/boom de teste/)).toBeInTheDocument();
  });
});
