// Formas geométricas wireframe disponíveis no canvas.
// Cada forma é uma lista de elementos (`els`) em espaço 0–100, escalados no render.
export const GEO_SHAPES = [
  { id:"cube",       name:"Cubo",             group:"Sólidos",  els:[{t:"poly",pts:[[50,8],[88,28],[88,68],[50,88],[12,68],[12,28]]},{t:"ln",x1:50,y1:8,x2:50,y2:48},{t:"ln",x1:88,y1:68,x2:50,y2:48},{t:"ln",x1:12,y1:68,x2:50,y2:48},{t:"ln",x1:88,y1:28,x2:50,y2:48,d:1},{t:"ln",x1:12,y1:28,x2:50,y2:48,d:1},{t:"ln",x1:50,y1:88,x2:50,y2:48,d:1}]},
  { id:"cuboide",    name:"Cuboide",           group:"Sólidos",  els:[{t:"poly",pts:[[15,30],[55,10],[95,30],[95,75],[55,55],[15,75]]},{t:"ln",x1:15,y1:30,x2:55,y2:55},{t:"ln",x1:55,y1:10,x2:55,y2:55},{t:"ln",x1:95,y1:30,x2:95,y2:75},{t:"ln",x1:15,y1:30,x2:15,y2:75},{t:"ln",x1:15,y1:75,x2:55,y2:55},{t:"ln",x1:55,y1:55,x2:95,y2:75},{t:"ln",x1:15,y1:75,x2:55,y2:95,d:1},{t:"ln",x1:55,y1:95,x2:95,y2:75,d:1},{t:"ln",x1:55,y1:55,x2:55,y2:95,d:1}]},
  { id:"tetrahedron",name:"Tetraedro",         group:"Poliedros",els:[{t:"poly",pts:[[50,5],[95,85],[5,85]]},{t:"ln",x1:50,y1:5,x2:50,y2:55,d:1},{t:"ln",x1:95,y1:85,x2:50,y2:55,d:1},{t:"ln",x1:5,y1:85,x2:50,y2:55,d:1}]},
  { id:"octahedron", name:"Octaedro",          group:"Poliedros",els:[{t:"poly",pts:[[50,5],[95,50],[50,95],[5,50]]},{t:"ln",x1:5,y1:50,x2:95,y2:50},{t:"ln",x1:50,y1:5,x2:50,y2:95},{t:"ln",x1:50,y1:5,x2:72,y2:65},{t:"ln",x1:50,y1:95,x2:72,y2:65},{t:"ln",x1:50,y1:5,x2:28,y2:35,d:1},{t:"ln",x1:50,y1:95,x2:28,y2:35,d:1},{t:"ln",x1:5,y1:50,x2:28,y2:35,d:1},{t:"ln",x1:95,y1:50,x2:28,y2:35,d:1}]},
  { id:"pyramid",    name:"Pirâmide",          group:"Poliedros",els:[{t:"ln",x1:50,y1:5,x2:12,y2:78},{t:"ln",x1:50,y1:5,x2:88,y2:78},{t:"ln",x1:12,y1:78,x2:88,y2:78},{t:"ln",x1:12,y1:78,x2:50,y2:95},{t:"ln",x1:88,y1:78,x2:50,y2:95},{t:"ln",x1:50,y1:5,x2:30,y2:62,d:1},{t:"ln",x1:12,y1:78,x2:30,y2:62,d:1},{t:"ln",x1:88,y1:78,x2:30,y2:62,d:1},{t:"ln",x1:50,y1:95,x2:30,y2:62,d:1},{t:"ln",x1:30,y1:62,x2:70,y2:62,d:1}]},
  { id:"triprism",   name:"Prisma Triângular", group:"Prismas",  els:[{t:"poly",pts:[[20,75],[80,75],[50,15]]},{t:"ln",x1:20,y1:75,x2:35,y2:85,d:1},{t:"ln",x1:80,y1:75,x2:65,y2:85,d:1},{t:"ln",x1:50,y1:15,x2:50,y2:25,d:1},{t:"ln",x1:35,y1:85,x2:65,y2:85,d:1},{t:"ln",x1:35,y1:85,x2:50,y2:25,d:1},{t:"ln",x1:65,y1:85,x2:50,y2:25,d:1}]},
  { id:"hexprism",   name:"Prisma Hexagonal",  group:"Prismas",  els:[{t:"poly",pts:[[50,5],[80,20],[80,47],[50,62],[20,47],[20,20]]},{t:"ln",x1:50,y1:62,x2:50,y2:92},{t:"ln",x1:80,y1:47,x2:80,y2:77},{t:"ln",x1:20,y1:47,x2:20,y2:77},{t:"ln",x1:50,y1:92,x2:80,y2:77},{t:"ln",x1:80,y1:77,x2:80,y2:47},{t:"ln",x1:50,y1:92,x2:20,y2:77},{t:"ln",x1:20,y1:77,x2:20,y2:47},{t:"ln",x1:20,y1:20,x2:20,y2:47,d:1},{t:"ln",x1:50,y1:5,x2:50,y2:35,d:1}]},
  { id:"cylinder",   name:"Cilindro",          group:"Curvos",   els:[{t:"el",cx:50,cy:18,rx:42,ry:14},{t:"el",cx:50,cy:82,rx:42,ry:14},{t:"ln",x1:8,y1:18,x2:8,y2:82},{t:"ln",x1:92,y1:18,x2:92,y2:82}]},
  { id:"cone",       name:"Cone",              group:"Curvos",   els:[{t:"el",cx:50,cy:80,rx:45,ry:14},{t:"ln",x1:5,y1:80,x2:50,y2:5},{t:"ln",x1:95,y1:80,x2:50,y2:5},{t:"ln",x1:50,y1:5,x2:50,y2:80,d:1}]},
  { id:"sphere",     name:"Esfera",            group:"Curvos",   els:[{t:"ci",cx:50,cy:50,r:46},{t:"el",cx:50,cy:50,rx:46,ry:16},{t:"el",cx:50,cy:50,rx:16,ry:46,d:1}]},
  { id:"torus",      name:"Torus",             group:"Curvos",   els:[{t:"el",cx:50,cy:50,rx:46,ry:22},{t:"el",cx:50,cy:50,rx:26,ry:11},{t:"el",cx:50,cy:50,rx:36,ry:46,d:1}]},
  { id:"ellipsoid",  name:"Elipsoide",         group:"Curvos",   els:[{t:"el",cx:50,cy:50,rx:46,ry:30},{t:"el",cx:50,cy:50,rx:46,ry:12},{t:"el",cx:50,cy:50,rx:15,ry:30,d:1}]},
  { id:"icosahedron",name:"Icosaedro",         group:"Poliedros",els:[{t:"ci",cx:50,cy:50,r:46},{t:"poly",pts:[[50,4],[88,28],[77,75],[23,75],[12,28]]},{t:"ln",x1:88,y1:28,x2:77,y2:75},{t:"ln",x1:77,y1:75,x2:50,y2:45},{t:"ln",x1:50,y1:45,x2:23,y2:75},{t:"ln",x1:23,y1:75,x2:12,y2:28},{t:"ln",x1:12,y1:28,x2:50,y2:45},{t:"ln",x1:50,y1:45,x2:88,y2:28}]},

  // ── Especiais ──────────────────────────────────────────────────────────────
  {
    id:"mobius", name:"Fita de Möbius", group:"Especiais",
    els:[
      // Oval exterior — contorno da fita
      {t:"el", cx:50, cy:50, rx:46, ry:22},
      // Curva superior — frente da fita (S-curve atravessando o centro)
      {t:"pt", p:"M8,44 C14,28 36,26 50,50 C64,74 86,72 92,56"},
      // Curva inferior — verso da fita (tracejada onde fica oculta)
      {t:"pt", p:"M8,56 C14,72 36,74 50,50 C64,26 86,28 92,44", d:1},
      // Linhas de secção transversal (largura da fita)
      {t:"ln", x1:8,y1:44, x2:8,y2:56},
      {t:"ln", x1:92,y1:44, x2:92,y2:56},
      {t:"ln", x1:24,y1:35, x2:24,y2:63},
      {t:"ln", x1:76,y1:35, x2:76,y2:63},
      // Meia-volta — cruzamento central (símbolo da torção)
      {t:"ln", x1:43,y1:45, x2:57,y2:55},
      {t:"ln", x1:43,y1:55, x2:57,y2:45, d:1},
    ]
  },

  {
    id:"penrose", name:"Escada de Penrose", group:"Especiais",
    els:[
      // ─── VÔO SUPERIOR: 4 degraus ascendentes (esq→dir, y decresce) ───
      {t:"ln",x1:8,y1:49,x2:8,y2:40},
      {t:"ln",x1:8,y1:40,x2:20,y2:40},
      {t:"ln",x1:20,y1:40,x2:20,y2:31},
      {t:"ln",x1:20,y1:31,x2:32,y2:31},
      {t:"ln",x1:32,y1:31,x2:32,y2:22},
      {t:"ln",x1:32,y1:22,x2:44,y2:22},
      {t:"ln",x1:44,y1:22,x2:44,y2:13},
      {t:"ln",x1:44,y1:13,x2:88,y2:13},
      // ─── VÔO DIREITO: 4 degraus ───────────────────────────────────────
      {t:"ln",x1:88,y1:13,x2:88,y2:25},
      {t:"ln",x1:88,y1:25,x2:76,y2:25},
      {t:"ln",x1:76,y1:25,x2:76,y2:37},
      {t:"ln",x1:76,y1:37,x2:64,y2:37},
      {t:"ln",x1:64,y1:37,x2:64,y2:49},
      {t:"ln",x1:64,y1:49,x2:52,y2:49},
      {t:"ln",x1:52,y1:49,x2:52,y2:85},
      // ─── VÔO INFERIOR: 4 degraus (dir→esq) ───────────────────────────
      {t:"ln",x1:52,y1:85,x2:52,y2:94},
      {t:"ln",x1:52,y1:94,x2:40,y2:94},
      {t:"ln",x1:40,y1:94,x2:40,y2:85},
      {t:"ln",x1:40,y1:85,x2:28,y2:85},
      {t:"ln",x1:28,y1:85,x2:28,y2:76},
      {t:"ln",x1:28,y1:76,x2:16,y2:76},
      {t:"ln",x1:16,y1:76,x2:16,y2:67},
      {t:"ln",x1:16,y1:67,x2:8,y2:67},
      // ─── LADO ESQUERDO: fecha o loop impossível ────────────────────────
      {t:"ln",x1:8,y1:67,x2:8,y2:49},
      // ─── PROFUNDIDADE interior (dashed) ───────────────────────────────
      {t:"ln",x1:20,y1:49,x2:20,y2:40,d:1},
      {t:"ln",x1:32,y1:49,x2:32,y2:31,d:1},
      {t:"ln",x1:44,y1:31,x2:44,y2:13,d:1},
      {t:"ln",x1:56,y1:13,x2:56,y2:25,d:1},
      {t:"ln",x1:76,y1:13,x2:76,y2:25,d:1},
      {t:"ln",x1:64,y1:25,x2:64,y2:37,d:1},
      {t:"ln",x1:52,y1:37,x2:52,y2:49,d:1},
      {t:"ln",x1:40,y1:76,x2:40,y2:67,d:1},
      {t:"ln",x1:28,y1:67,x2:28,y2:58,d:1},
      {t:"ln",x1:16,y1:58,x2:16,y2:49,d:1},
      // Cornijas interiores
      {t:"ln",x1:20,y1:40,x2:32,y2:40,d:1},
      {t:"ln",x1:32,y1:31,x2:44,y2:31,d:1},
      {t:"ln",x1:56,y1:25,x2:76,y2:25,d:1},
      {t:"ln",x1:52,y1:37,x2:64,y2:37,d:1},
      {t:"ln",x1:40,y1:85,x2:52,y2:85,d:1},
      {t:"ln",x1:28,y1:76,x2:40,y2:76,d:1},
      {t:"ln",x1:16,y1:67,x2:28,y2:67,d:1},
    ]
  },
];
