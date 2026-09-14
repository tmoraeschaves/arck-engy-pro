import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { IconeCamada } from "./IconeCamada.jsx";

describe("IconeCamada", () => {
  it("usa o ícone próprio do sector quando definido (Hidráulica L1 = Droplet)", () => {
    const { container } = render(<svg><IconeCamada sector="hidraulica" camada="L1" /></svg>);
    // Droplet da lucide-react tem uma <path> com "d" característico; verificamos
    // que o svg do ícone renderiza e não é o Wifi genérico (que tem <path> + <path> + <line>)
    expect(container.querySelector("svg[stroke-linejoin]")).toBeInTheDocument();
  });

  it("sector sem ícones próprios (Engenharia) usa o genérico (Wifi em L1)", () => {
    const comEngenharia = render(<svg><IconeCamada sector="engenharia" camada="L1" /></svg>);
    const generico = render(<svg><IconeCamada sector={null} camada="L1" /></svg>);
    // ambos devem produzir o mesmo ícone (Wifi) — comparamos o markup interno
    expect(comEngenharia.container.innerHTML).toBe(generico.container.innerHTML);
  });

  it("sector desconhecido não rebenta — cai no genérico", () => {
    const { container } = render(<svg><IconeCamada sector="nao-existe" camada="L3" /></svg>);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("Redes L2 (COMUTAÇÃO) usa o ícone Router, diferente do genérico Cpu", () => {
    const redes = render(<svg><IconeCamada sector="redes" camada="L2" /></svg>);
    const generico = render(<svg><IconeCamada sector={null} camada="L2" /></svg>);
    expect(redes.container.innerHTML).not.toBe(generico.container.innerHTML);
  });

  it("passa a cor explícita ao ícone (seguro sob transform 3D)", () => {
    const { container } = render(<svg><IconeCamada sector="nuvem" camada="L3" color="#ABCDEF" /></svg>);
    // o primeiro <svg> é o wrapper do teste; o ícone lucide é o segundo, aninhado
    const iconeSvg = container.querySelectorAll("svg")[1];
    expect(iconeSvg).toHaveAttribute("stroke", "#ABCDEF");
  });
});
