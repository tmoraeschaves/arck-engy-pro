import { ChevronRight, CornerLeftUp, Network } from "lucide-react";

/**
 * Migalhas de pão dos sub-diagramas (Movimento 8, Fatia 4): `Sistema › SERVIÇO · Autenticação › …`.
 * Cada passo anterior é clicável e volta a esse nível; ↑ sobe um. Só aparece dentro de um
 * sub-diagrama. `migalhas` = [{ camada, rotulo, cor }], uma por nível abaixo da raiz.
 */
export function Migalhas({ migalhas, onIrPara }) {
  if (!migalhas.length) return null;
  const passo = "px-2 py-0.5 rounded-md transition-all";
  return (
    <nav aria-label="Nível do diagrama" data-testid="migalhas"
      className="absolute top-3 left-3 z-40 flex items-center gap-1 bg-[#1E293B] border border-[#334155] rounded-full shadow-xl pl-1.5 pr-3 py-1 text-[10px] font-bold text-slate-300">
      <button type="button" onClick={() => onIrPara(migalhas.length - 1)} title="Subir um nível"
        className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:bg-[#334155] hover:text-white">
        <CornerLeftUp size={13} />
      </button>
      <button type="button" onClick={() => onIrPara(0)} className={`${passo} flex items-center gap-1 hover:bg-[#334155] hover:text-white`}>
        <Network size={11} /> Sistema
      </button>
      {migalhas.map((m, i) => {
        const actual = i === migalhas.length - 1;
        const conteudo = <><span style={{ color: m.cor }}>{m.camada}</span> · {m.rotulo}</>;
        return (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight size={11} className="text-slate-500" />
            {actual
              ? <span aria-current="page" className={`${passo} text-white bg-[#0F172A]`}>{conteudo}</span>
              : <button type="button" onClick={() => onIrPara(i + 1)} className={`${passo} hover:bg-[#334155] hover:text-white`}>{conteudo}</button>}
          </span>
        );
      })}
    </nav>
  );
}
