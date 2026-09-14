import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { Anotacao } from "./Anotacao.jsx";

const ann = { id: "a1", x: 0, y: 0, text: "", expanded: true };

describe("Anotacao", () => {
  it("expandida e sem texto, mostra o placeholder", () => {
    render(<svg><Anotacao anotacao={ann} aEditar={false} onAlternar={() => {}} onEditarTexto={() => {}} onComecarEdicao={() => {}} onRemover={() => {}} /></svg>);
    expect(screen.getByText("clique para editar")).toBeInTheDocument();
  });

  it("colapsada não mostra o corpo", () => {
    render(<svg><Anotacao anotacao={{ ...ann, expanded: false }} aEditar={false} onAlternar={() => {}} onEditarTexto={() => {}} onComecarEdicao={() => {}} onRemover={() => {}} /></svg>);
    expect(screen.queryByText("clique para editar")).not.toBeInTheDocument();
  });

  it("aEditar mostra a textarea e escrever despacha onEditarTexto", () => {
    const onEditarTexto = vi.fn();
    render(<svg><Anotacao anotacao={ann} aEditar onAlternar={() => {}} onEditarTexto={onEditarTexto} onComecarEdicao={() => {}} onRemover={() => {}} /></svg>);
    fireEvent.change(screen.getByPlaceholderText("escreve aqui…"), { target: { value: "olá" } });
    expect(onEditarTexto).toHaveBeenCalledWith("a1", "olá");
  });

  it("perder o foco (depois de focada) com texto vazio remove a anotação", () => {
    const onRemover = vi.fn();
    render(<svg><Anotacao anotacao={ann} aEditar onAlternar={() => {}} onEditarTexto={() => {}} onComecarEdicao={() => {}} onRemover={onRemover} /></svg>);
    const area = screen.getByPlaceholderText("escreve aqui…");
    fireEvent.focus(area);
    fireEvent.blur(area);
    expect(onRemover).toHaveBeenCalledWith("a1");
  });

  it("blur sem nunca ter sido focada (foco espúrio ao criar) NÃO remove a anotação", () => {
    const onRemover = vi.fn();
    const onComecarEdicao = vi.fn();
    render(<svg><Anotacao anotacao={ann} aEditar onAlternar={() => {}} onEditarTexto={() => {}} onComecarEdicao={onComecarEdicao} onRemover={onRemover} /></svg>);
    fireEvent.blur(screen.getByPlaceholderText("escreve aqui…"));
    expect(onRemover).not.toHaveBeenCalled();
    expect(onComecarEdicao).toHaveBeenCalledWith(null);
  });
});
