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
});
