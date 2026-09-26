/**
 * TESTE DE INTEGRAÇÃO DO App — o fluxo real através do reducer do projecto.
 * Prova que a UI e a máquina de estados estão ligadas (Movimento 7, Fatia 4).
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";

async function arrancar() {
  const user = userEvent.setup();
  render(<App />);
  // dispensa o modal de sector inicial
  await user.click(screen.getByText(/USAR ENGENHARIA POR PADRÃO/i));
  return user;
}

const contaNos = () =>
  Number(screen.getByText("Nós:").querySelector("span").textContent);

describe("App + reducer do projecto", () => {
  beforeEach(() => localStorage.clear());

  it("arranca com o diagrama vazio (INÉRCIA)", async () => {
    await arrancar();
    expect(screen.getByText("INÉRCIA")).toBeInTheDocument();
    expect(contaNos()).toBe(0);
  });

  it("adicionar nós pela sidebar despacha ADICIONAR_NO", async () => {
    const user = await arrancar();
    const botaoL1 = screen.getByTitle("Adicionar SENSÓRIA");
    await user.click(botaoL1);
    await user.click(botaoL1);
    expect(contaNos()).toBe(2);
  });

  it("RESETAR limpa o diagrama", async () => {
    const user = await arrancar();
    await user.click(screen.getByTitle("Adicionar SENSÓRIA"));
    expect(contaNos()).toBe(1);

    // resetSystem usa window.confirm — forçamos true
    const confirmOrig = window.confirm;
    window.confirm = () => true;
    await user.click(screen.getByTitle("Reset"));
    window.confirm = confirmOrig;

    expect(contaNos()).toBe(0);
    expect(screen.getByText("INÉRCIA")).toBeInTheDocument();
  });

  it("alternar para Modo Livre muda o rótulo no header", async () => {
    const user = await arrancar();
    expect(screen.getByRole("button", { name: /GUIADO/ })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /GUIADO/ }));
    expect(screen.getByRole("button", { name: /LIVRE/ })).toBeInTheDocument();
  });

  it("mudar de sector renomeia as camadas na sidebar", async () => {
    const user = await arrancar();
    expect(screen.getByTitle("Adicionar SENSÓRIA")).toBeInTheDocument();
    // barra de tabs do header — botão do sector Medicina
    const tabMedicina = screen.getAllByRole("button", { name: /Medicina/ })[0];
    await user.click(tabMedicina);
    expect(screen.getByTitle("Adicionar DIAGNÓSTICO")).toBeInTheDocument();
  });

  it("autosave: fechar e reabrir recupera o diagrama (não começa do zero)", async () => {
    const user = await arrancar();
    await user.click(screen.getByTitle("Adicionar SENSÓRIA"));
    await user.click(screen.getByTitle("Adicionar LÓGICA"));
    expect(contaNos()).toBe(2);

    // o autosave tem 500ms de atraso
    await new Promise(r => setTimeout(r, 700));

    // "fechar e reabrir" = desmontar e montar de novo o App
    cleanup();
    render(<App />);
    // já não pede o sector nem o tutorial — e os 2 nós estão lá
    expect(screen.queryByText(/USAR ENGENHARIA POR PADRÃO/i)).not.toBeInTheDocument();
    expect(contaNos()).toBe(2);
  });

  it("cabeçalho sem texto solto de JSX (regressão do ')}' junto às barras de integridade)", async () => {
    const user = await arrancar();
    await user.click(screen.getByTitle("Adicionar SENSÓRIA"));
    expect(document.body.textContent).not.toContain(")}");
  });
});
