import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVistaCanvas } from "./useVistaCanvas.js";

describe("useVistaCanvas", () => {
  it("arranca em 2D, zoom 1, sem desvio", () => {
    const { result } = renderHook(() => useVistaCanvas([]));
    expect(result.current.zoom).toBe(1);
    expect(result.current.is3D).toBe(false);
    expect(result.current.centro3D).toBe("center center");
  });

  it("centro3D é o centro do desenho, escalado por zoom+offset", () => {
    const nodes = [{ x: 0, y: 0 }, { x: 100, y: 0 }];
    const { result } = renderHook(() => useVistaCanvas(nodes));
    // centro geométrico (50,0); zoom=1, offset=(0,0)
    expect(result.current.centro3D).toBe("50px 0px");
  });

  it("centro3D acompanha zoom e offset", () => {
    const nodes = [{ x: 0, y: 0 }, { x: 100, y: 100 }];
    const { result } = renderHook(() => useVistaCanvas(nodes));
    act(() => { result.current.setZoom(2); result.current.setOffset({ x: 10, y: 20 }); });
    // centro (50,50) * 2 + (10,20) = (110,120)
    expect(result.current.centro3D).toBe("110px 120px");
  });

  it("is3D é derivado da inclinação — setIs3D(true) inclina, setIs3D(false) volta a plano", () => {
    const { result } = renderHook(() => useVistaCanvas([]));
    expect(result.current.is3D).toBe(false);

    act(() => result.current.setIs3D(true));
    expect(result.current.is3D).toBe(true);
    expect(Math.abs(result.current.rotX) + Math.abs(result.current.rotY)).toBeGreaterThan(0);

    act(() => result.current.setIs3D(false));
    expect(result.current.is3D).toBe(false);
    expect(result.current.rotX).toBe(0);
    expect(result.current.rotY).toBe(0);
  });

  it("rodar um eixo de volta a ~0 sai do 3D sozinho (sem estado invisível)", () => {
    const { result } = renderHook(() => useVistaCanvas([]));
    act(() => result.current.setRotY(40));
    expect(result.current.is3D).toBe(true);
    act(() => result.current.setRotY(0));
    expect(result.current.is3D).toBe(false);
  });
});
