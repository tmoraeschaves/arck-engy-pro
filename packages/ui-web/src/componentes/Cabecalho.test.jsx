import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Cabecalho } from "./Cabecalho.jsx";
import { SECTORS } from "../config/sectores.js";
import raiz from "../../../../package.json";
import core from "../../../core/package.json";

const integridade = { health: -1, inercia: true, cor: "#64748B", texto: "INÉRCIA", pulso: 0 };
const nada = () => {};
const montar = (props = {}) => render(
  <Cabecalho sector="engenharia" sectorActivo={SECTORS.engenharia} modoLivre={false} modoSilencioso={false}
    temNos={false} integridade={integridade} onEscolherSector={nada} onAlternarModo={nada}
    onImportar={nada} onExportarJSON={nada} onExportarSVG={nada} onExportarPNG={nada} onResetar={nada} {...props} />,
);

describe("Cabecalho", () => {
  it("importar: escolher um ficheiro entrega-o ao App e limpa o input (permite reimportar o mesmo)", () => {
    const onImportar = vi.fn();
    const { container } = montar({ onImportar });
    const input = container.querySelector('input[type="file"]');
    const ficheiro = new File(["{}"], "p.json", { type: "application/json" });
    fireEvent.change(input, { target: { files: [ficheiro] } });
    expect(onImportar).toHaveBeenCalledWith(ficheiro);
    expect(input.value).toBe("");
  });

  it("sem nós não mostra as barras de integridade; com nós mostra 12", () => {
    const { container, rerender } = montar();
    expect(container.querySelector('[title^="Integridade:"]')).toBeNull();
    rerender(
      <Cabecalho sector="engenharia" sectorActivo={SECTORS.engenharia} modoLivre={false} modoSilencioso={false}
        temNos integridade={integridade} onEscolherSector={nada} onAlternarModo={nada}
        onImportar={nada} onExportarJSON={nada} onExportarSVG={nada} onExportarPNG={nada} onResetar={nada} />,
    );
    const barras = container.querySelector('[title^="Integridade:"]');
    expect(barras.querySelectorAll(".rounded-sm")).toHaveLength(12);
  });

  it("o botão de modo chama onAlternarModo e mostra o modo actual", () => {
    const onAlternarModo = vi.fn();
    montar({ onAlternarModo, modoLivre: true });
    fireEvent.click(screen.getAllByText("🔓 LIVRE").at(-1));
    expect(onAlternarModo).toHaveBeenCalled();
  });

  it("a versão mostrada é a do package.json da raiz e do @arck/core (fonte única)", () => {
    montar();
    expect(screen.getByText(`v${raiz.version}`)).toBeInTheDocument();
    expect(screen.getByText(`ARCK core v${core.version}`)).toBeInTheDocument();
  });

  it("sectores (DEC-018): só o activo à vista; o botão abre os 12, escolher fecha e avisa o App", () => {
    const onEscolherSector = vi.fn();
    montar({ onEscolherSector });
    expect(screen.queryByRole("listbox")).toBeNull();
    fireEvent.click(screen.getByTitle("Mudar de sector"));
    const opcoes = screen.getAllByRole("option");
    expect(opcoes).toHaveLength(Object.keys(SECTORS).length);
    expect(opcoes.find(o => o.getAttribute("aria-selected") === "true").textContent).toMatch(/Engenharia/);
    // cada opção mostra o vocabulário das camadas desse sector
    expect(screen.getByRole("option", { name: /Nuvem/ }).textContent).toMatch(/GATEWAY/);
    fireEvent.click(screen.getByRole("option", { name: /Nuvem/ }));
    expect(onEscolherSector).toHaveBeenCalledWith("nuvem");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("sectores: Esc e clique fora fecham a lista sem escolher", () => {
    const onEscolherSector = vi.fn();
    montar({ onEscolherSector });
    fireEvent.click(screen.getByTitle("Mudar de sector"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
    fireEvent.click(screen.getByTitle("Mudar de sector"));
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onEscolherSector).not.toHaveBeenCalled();
  });
});
