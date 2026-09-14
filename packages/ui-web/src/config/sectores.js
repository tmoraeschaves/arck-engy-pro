// Os sectores de trabalho. Cada um renomeia e descreve as camadas L1–L5.
// `icons` (opcional) — ícones de camada próprios do sector; quando um sector não
// define `icons`, ou não cobre uma camada, usam-se os ícones genéricos de
// LAYER_ICONS em camadas.js (ver componentes/IconeCamada.jsx). Referências a
// componentes, não elementos instanciados — por isso este ficheiro fica .js, sem JSX.
import {
  LogIn, LogOut, MemoryStick, Cpu, Monitor,
  Database, BarChart3, Users, Rocket, Gauge,
  Stethoscope, ClipboardList, Pill, Syringe, HeartPulse,
  MapPin, Route, Truck, PackageCheck, Radar,
  Eye, Search, ShieldAlert, Siren, RotateCcw,
  BookOpen, GraduationCap, FlaskConical, ClipboardCheck, RefreshCw,
  Router, Waypoints, Activity,
  Globe, Server, TrendingUp,
  Zap, Share2, RefreshCcw, Lightbulb,
  Droplet, Waves, SlidersHorizontal, Wrench,
  Cog, RotateCw,
} from "lucide-react";

export const SECTORS = {
  engenharia:     { name:"Engenharia",    icon:"⚙️", names:{ L1:"SENSÓRIA",   L2:"LÓGICA",      L3:"POTÊNCIA",   L4:"ATUAÇÃO",     L5:"FEEDBACK"      }, desc:{ L1:"Sensores",       L2:"Processamento",   L3:"Energia",     L4:"Atuadores",    L5:"Retorno"       }},
  computacao:     { name:"Computação",    icon:"💻", names:{ L1:"INPUT",      L2:"PROCESSO",    L3:"MEMÓRIA",    L4:"OUTPUT",      L5:"MONITOR"       }, desc:{ L1:"Entrada",        L2:"Cálculo",         L3:"Cache",       L4:"Saída",        L5:"Observabilidade"},
                    icons:{ L1:LogIn, L2:Cpu, L3:MemoryStick, L4:LogOut, L5:Monitor } },
  negocios:       { name:"Negócios",      icon:"📊", names:{ L1:"DADOS",      L2:"ANÁLISE",     L3:"RECURSOS",   L4:"EXECUÇÃO",    L5:"CONTROLO"      }, desc:{ L1:"Recolha",        L2:"Estratégia",      L3:"Alocação",    L4:"Operação",     L5:"KPIs"          },
                    icons:{ L1:Database, L2:BarChart3, L3:Users, L4:Rocket, L5:Gauge } },
  medicina:       { name:"Medicina",      icon:"🏥", names:{ L1:"DIAGNÓSTICO",L2:"PROTOCOLO",   L3:"TERAPIA",    L4:"INTERVENÇÃO", L5:"ACOMPANHAMENTO"}, desc:{ L1:"Avaliação",      L2:"Protocolo",       L3:"Terapêutica", L4:"Procedimento", L5:"Monitorização" },
                    icons:{ L1:Stethoscope, L2:ClipboardList, L3:Pill, L4:Syringe, L5:HeartPulse } },
  logistica:      { name:"Logística",     icon:"🚛", names:{ L1:"ORIGEM",     L2:"ROTEAMENTO",  L3:"TRANSPORTE", L4:"ENTREGA",     L5:"RASTREIO"      }, desc:{ L1:"Recolha",        L2:"Planeamento",     L3:"Movimento",   L4:"Distribuição", L5:"Rastreio"      },
                    icons:{ L1:MapPin, L2:Route, L3:Truck, L4:PackageCheck, L5:Radar } },
  ciberseguranca: { name:"Cibersegurança",icon:"🔒", names:{ L1:"DETECÇÃO",   L2:"ANÁLISE",     L3:"CONTENÇÃO",  L4:"RESPOSTA",    L5:"RECUPERAÇÃO"   }, desc:{ L1:"Deteção",        L2:"Forense",         L3:"Isolamento",  L4:"Mitigação",    L5:"Recuperação"   },
                    icons:{ L1:Eye, L2:Search, L3:ShieldAlert, L4:Siren, L5:RotateCcw } },
  educacao:       { name:"Educação",      icon:"📚", names:{ L1:"CONTEÚDO",   L2:"METODOLOGIA", L3:"PRÁTICA",    L4:"AVALIAÇÃO",   L5:"REVISÃO"       }, desc:{ L1:"Material",       L2:"Pedagogia",       L3:"Exercícios",  L4:"Testes",       L5:"Feedback"      },
                    icons:{ L1:BookOpen, L2:GraduationCap, L3:FlaskConical, L4:ClipboardCheck, L5:RefreshCw } },
  redes:          { name:"Redes",         icon:"🌐", names:{ L1:"ACESSO",     L2:"COMUTAÇÃO",   L3:"PROTOCOLO",  L4:"ENTREGA",     L5:"TELEMETRIA"    }, desc:{ L1:"Ponto de entrada",L2:"Routing/switching",L3:"Transporte",  L4:"Destino",      L5:"Observabilidade"},
                    icons:{ L1:LogIn, L2:Router, L3:Waypoints, L4:PackageCheck, L5:Activity } },
  nuvem:          { name:"Nuvem",         icon:"☁️", names:{ L1:"REQUISIÇÃO", L2:"GATEWAY",     L3:"SERVIÇO",    L4:"ARMAZENAMENTO",L5:"AUTOESCALA"   }, desc:{ L1:"Pedido do cliente",L2:"Balanceamento",  L3:"VM/serverless",L4:"BD/storage",  L5:"Métricas"      },
                    icons:{ L1:Globe, L2:Waypoints, L3:Server, L4:Database, L5:TrendingUp } },
  eletrica:       { name:"Eléctrica",     icon:"⚡", names:{ L1:"GERAÇÃO",    L2:"DISTRIBUIÇÃO",L3:"TRANSFORMAÇÃO",L4:"CONSUMO",    L5:"PROTECÇÃO"     }, desc:{ L1:"Fonte de energia",L2:"Rede de distribuição",L3:"Conversão",L4:"Carga final",  L5:"Disjuntores"   },
                    icons:{ L1:Zap, L2:Share2, L3:RefreshCcw, L4:Lightbulb, L5:ShieldAlert } },
  hidraulica:     { name:"Hidráulica",    icon:"💧", names:{ L1:"RESERVATÓRIO",L2:"BOMBA",      L3:"VÁLVULA",    L4:"ATUADOR",     L5:"RETORNO"       }, desc:{ L1:"Armazém do fluido",L2:"Pressurização",  L3:"Controlo de fluxo",L4:"Força mecânica",L5:"Retorno do fluido"},
                    icons:{ L1:Droplet, L2:Waves, L3:SlidersHorizontal, L4:Wrench, L5:RotateCcw } },
  mecatronica:    { name:"Mecatrónica",   icon:"🤖", names:{ L1:"SENSOR",     L2:"CONTROLO",    L3:"ACIONAMENTO",L4:"MOVIMENTO",   L5:"REALIMENTAÇÃO" }, desc:{ L1:"Percepção",      L2:"Lógica de controlo",L3:"Electrónica de potência",L4:"Mecanismo",L5:"Encoder/sensor"},
                    icons:{ L1:Radar, L2:Cpu, L3:Zap, L4:Cog, L5:RotateCw } },
};
