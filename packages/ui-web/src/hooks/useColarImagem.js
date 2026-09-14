import { useEffect } from "react";
import { lerImagemComoDataURL } from "../infra/persistencia.js";

/**
 * Colar uma imagem da área de transferência (Ctrl+V) define-a como fundo do
 * canvas. Ouve a `window` — funciona em qualquer sítio da app, não só com o
 * painel de Fundo aberto.
 */
export function useColarImagem(dispatch) {
  useEffect(() => {
    const aoColar = async (e) => {
      const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith("image/"));
      if (!item) return;
      const ficheiro = item.getAsFile();
      if (!ficheiro) return;
      e.preventDefault();
      const url = await lerImagemComoDataURL(ficheiro);
      dispatch({ tipo: "DEFINIR_FUNDO", img: url });
    };
    window.addEventListener("paste", aoColar);
    return () => window.removeEventListener("paste", aoColar);
  }, [dispatch]);
}
