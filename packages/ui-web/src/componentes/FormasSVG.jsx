// Renderização de formas geométricas wireframe em SVG.
// `ShapeElements` desenha uma forma numa caixa (x,y,w,h); `ShapePreview` mostra
// a miniatura usada no picker.

export function ShapeElements({ shape, x, y, w, h, color = "#64748B", opacity = 0.7, selected }) {
  const sx = p => x + (p / 100) * w, sy = p => y + (p / 100) * h;
  const stroke = selected ? "#60A5FA" : color;
  const scX = w / 100, scY = h / 100;
  return shape.els.map((el, i) => {
    const sw = el.d ? 1 : 1.4, da = el.d ? "5,4" : "none";
    if (el.t === "poly") { const pts = el.pts.map(([px,py]) => `${sx(px)},${sy(py)}`).join(" "); return <polygon key={i} points={pts} fill="none" stroke={stroke} strokeWidth={sw} strokeDasharray={da} opacity={opacity}/>; }
    if (el.t === "ln")   return <line key={i} x1={sx(el.x1)} y1={sy(el.y1)} x2={sx(el.x2)} y2={sy(el.y2)} stroke={stroke} strokeWidth={sw} strokeDasharray={da} opacity={opacity}/>;
    if (el.t === "el")   return <ellipse key={i} cx={sx(el.cx)} cy={sy(el.cy)} rx={el.rx/100*w} ry={el.ry/100*h} fill="none" stroke={stroke} strokeWidth={sw} strokeDasharray={da} opacity={opacity}/>;
    if (el.t === "ci")   { const r = Math.min(el.r/100*w, el.r/100*h); return <circle key={i} cx={sx(el.cx)} cy={sy(el.cy)} r={r} fill="none" stroke={stroke} strokeWidth={sw} strokeDasharray={da} opacity={opacity}/>; }
    // SVG path — coordenadas em espaço 0-100, escaladas por transform
    if (el.t === "pt")   return <g key={i} transform={`translate(${x},${y}) scale(${scX},${scY})`}><path d={el.p} fill="none" stroke={stroke} strokeWidth={sw/Math.min(scX,scY)} strokeDasharray={el.d?"5,4":"none"} opacity={opacity}/></g>;
    return null;
  });
}

export function ShapePreview({ shape, size = 52 }) {
  return <svg width={size} height={size} viewBox="0 0 100 100"><ShapeElements shape={shape} x={5} y={5} w={90} h={90} color="#94A3B8" opacity={0.9} selected={false}/></svg>;
}
