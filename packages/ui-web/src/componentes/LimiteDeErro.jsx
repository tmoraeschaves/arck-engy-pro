import { Component } from "react";

/**
 * Rede de segurança: se a árvore React rebentar (ex.: o Google Translate a mexer
 * nos nós de texto do DOM), em vez de uma página em branco sem saída, mostra um
 * aviso com "Recarregar". O autosave garante que não se perde o diagrama.
 */
export class LimiteDeErro extends Component {
  constructor(props) {
    super(props);
    this.state = { erro: null };
  }

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  componentDidCatch(erro, info) {
    console.error("A app rebentou:", erro, info?.componentStack);
  }

  render() {
    if (!this.state.erro) return this.props.children;
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#0F172A", color: "#E2E8F0",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 16, fontFamily: "system-ui, sans-serif", textAlign: "center", padding: 24,
      }}>
        <div style={{ fontSize: 40, opacity: 0.3 }}>⬡</div>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Algo interrompeu a aplicação</div>
        <div style={{ fontSize: 12, color: "#94A3B8", maxWidth: 420, lineHeight: 1.5 }}>
          O diagrama está guardado automaticamente — recarregar não o perde.
          Se o navegador estiver a traduzir a página, desliga a tradução para este site.
        </div>
        <button onClick={() => window.location.reload()} style={{
          background: "#059669", color: "white", border: "none", borderRadius: 8,
          padding: "8px 20px", fontWeight: 700, fontSize: 12, cursor: "pointer",
        }}>Recarregar</button>
        <pre style={{
          fontSize: 10, color: "#64748B", maxWidth: 480, maxHeight: 120, overflow: "auto",
          whiteSpace: "pre-wrap", marginTop: 8,
        }}>{String(this.state.erro?.message || this.state.erro)}</pre>
      </div>
    );
  }
}
