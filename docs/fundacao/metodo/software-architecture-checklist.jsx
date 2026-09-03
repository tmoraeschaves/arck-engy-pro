import { useState } from "react";

const sections = [
  {
    id: "foundation",
    icon: "⬡",
    phase: "FASE 01",
    title: "Fundação & Requisitos",
    color: "#00D4FF",
    items: [
      { id: "f1", text: "Documento de Requisitos (BRD/PRD) versionado e assinado", critical: true },
      { id: "f2", text: "Definição de Domínio e Linguagem Ubíqua (Ubiquitous Language)", critical: true },
      { id: "f3", text: "Casos de Uso e User Stories com critérios de aceitação", critical: true },
      { id: "f4", text: "Mapeamento de Stakeholders e ownership de decisão", critical: false },
      { id: "f5", text: "Definição de NFRs: performance, disponibilidade, escalabilidade, compliance", critical: true },
      { id: "f6", text: "Threat Modeling inicial (quais dados, quais riscos, quais atores)", critical: true },
      { id: "f7", text: "Matriz de rastreabilidade: requisito → código → teste", critical: false },
    ]
  },
  {
    id: "architecture",
    icon: "◈",
    phase: "FASE 02",
    title: "Arquitetura & Design",
    color: "#7B61FF",
    items: [
      { id: "a1", text: "Escolha e documentação do padrão arquitetural (MVC, Clean, Hexagonal, etc.)", critical: true },
      { id: "a2", text: "ADRs — Architecture Decision Records para cada decisão relevante", critical: true },
      { id: "a3", text: "Diagrama C4 (Context, Container, Component, Code)", critical: true },
      { id: "a4", text: "Separação clara de camadas: Apresentação / Domínio / Infraestrutura", critical: true },
      { id: "a5", text: "Definição de interfaces e contratos entre módulos (APIs internas)", critical: true },
      { id: "a6", text: "Princípios SOLID aplicados e revisados por par", critical: false },
      { id: "a7", text: "Gestão de dependências: inversão de dependência, sem acoplamento circular", critical: true },
      { id: "a8", text: "Estratégia de estado: onde vive, quem pode alterar, como propaga", critical: false },
      { id: "a9", text: "Design de APIs: REST/GraphQL/gRPC com contrato OpenAPI/Protobuf", critical: true },
    ]
  },
  {
    id: "code",
    icon: "◎",
    phase: "FASE 03",
    title: "Engenharia de Código",
    color: "#00FF88",
    items: [
      { id: "c1", text: "Coding Standards documentados e aplicados via linter/formatter (ESLint, Prettier, Black)", critical: true },
      { id: "c2", text: "Convenções de nomenclatura consistentes (variáveis, funções, arquivos, tabelas)", critical: true },
      { id: "c3", text: "DRY / KISS / YAGNI — sem duplicação, sem complexidade desnecessária", critical: false },
      { id: "c4", text: "Funções pequenas, com responsabilidade única e retorno previsível", critical: true },
      { id: "c5", text: "Comentários explicam o PORQUÊ, não o quê — código auto-documentado", critical: false },
      { id: "c6", text: "Zero magic numbers/strings: tudo em constantes nomeadas ou configuração", critical: true },
      { id: "c7", text: "Tratamento explícito de erros: nenhum catch vazio, sem swallow silencioso", critical: true },
      { id: "c8", text: "Imutabilidade preferida onde aplicável", critical: false },
      { id: "c9", text: "Validação de entrada em toda fronteira do sistema (não confiar em nenhum input)", critical: true },
    ]
  },
  {
    id: "security",
    icon: "◉",
    phase: "FASE 04",
    title: "Segurança",
    color: "#FF4444",
    items: [
      { id: "s1", text: "OWASP Top 10 verificado e mitigado (Injection, XSS, IDOR, etc.)", critical: true },
      { id: "s2", text: "Autenticação robusta: MFA, tokens com expiração, rotação de secrets", critical: true },
      { id: "s3", text: "Autorização baseada em papel/permissão (RBAC/ABAC) — Princípio do Menor Privilégio", critical: true },
      { id: "s4", text: "Secrets NUNCA no código ou repositório: usar vault/env/secrets manager", critical: true },
      { id: "s5", text: "Criptografia em trânsito (TLS 1.3+) e em repouso (AES-256 ou equivalente)", critical: true },
      { id: "s6", text: "Rate limiting, CORS configurado corretamente, headers de segurança (CSP, HSTS)", critical: true },
      { id: "s7", text: "Sanitização de output: HTML encoding, SQL parameterized queries", critical: true },
      { id: "s8", text: "Dependency scanning automático (Dependabot, Snyk, OWASP Dependency-Check)", critical: true },
      { id: "s9", text: "SAST/DAST integrado na pipeline CI/CD", critical: false },
      { id: "s10", text: "Plano de resposta a incidentes documentado", critical: false },
    ]
  },
  {
    id: "data",
    icon: "⬡",
    phase: "FASE 05",
    title: "Dados & Persistência",
    color: "#FFB800",
    items: [
      { id: "d1", text: "Schema versionado com migrations auditáveis (Flyway, Alembic, Liquibase)", critical: true },
      { id: "d2", text: "Modelo de dados documentado (ERD) com glossário de campos", critical: true },
      { id: "d3", text: "Soft delete preferido sobre hard delete para auditabilidade", critical: false },
      { id: "d4", text: "Campos de auditoria padrão: created_at, updated_at, created_by, updated_by", critical: true },
      { id: "d5", text: "Backup automatizado, testado e com RTO/RPO definidos", critical: true },
      { id: "d6", text: "Índices analisados e justificados — sem índice desnecessário", critical: false },
      { id: "d7", text: "Estratégia clara de cache: o quê, por quanto tempo, invalidação", critical: false },
      { id: "d8", text: "PII identificado, minimizado e com ciclo de vida definido (LGPD/GDPR)", critical: true },
      { id: "d9", text: "Transações com isolamento correto, sem deadlock arquitetural", critical: true },
    ]
  },
  {
    id: "testing",
    icon: "◈",
    phase: "FASE 06",
    title: "Testes & Qualidade",
    color: "#00D4FF",
    items: [
      { id: "t1", text: "Pirâmide de testes: Unit > Integration > E2E", critical: true },
      { id: "t2", text: "Cobertura mínima definida e aplicada como gate na CI (ex: 80%)", critical: true },
      { id: "t3", text: "Testes escritos ANTES ou JUNTO ao código (TDD ou TBD)", critical: false },
      { id: "t4", text: "Mocks/stubs para dependências externas — testes determinísticos", critical: true },
      { id: "t5", text: "Testes de contrato para APIs (Pact, OpenAPI validation)", critical: false },
      { id: "t6", text: "Testes de carga e stress (k6, Locust, JMeter)", critical: false },
      { id: "t7", text: "Testes de regressão automatizados rodando a cada PR", critical: true },
      { id: "t8", text: "Chaos Engineering básico: o que acontece se X falhar?", critical: false },
      { id: "t9", text: "Mutation testing para validar qualidade dos testes em si", critical: false },
    ]
  },
  {
    id: "cicd",
    icon: "◎",
    phase: "FASE 07",
    title: "CI/CD & Entrega",
    color: "#7B61FF",
    items: [
      { id: "ci1", text: "Pipeline CI: lint → test → build → security scan em todo PR", critical: true },
      { id: "ci2", text: "Nenhum merge sem pipeline verde e review aprovado (Branch Protection)", critical: true },
      { id: "ci3", text: "Ambientes separados: dev / staging / production com paridade máxima", critical: true },
      { id: "ci4", text: "Deploy automatizado e reproduzível: sem deploy manual em produção", critical: true },
      { id: "ci5", text: "Feature flags para rollout gradual e rollback instantâneo", critical: false },
      { id: "ci6", text: "Artefatos de build imutáveis e versionados (Docker image tags, checksums)", critical: true },
      { id: "ci7", text: "Infrastructure as Code (Terraform, Pulumi, Ansible) — nada provisionado manualmente", critical: true },
      { id: "ci8", text: "Estratégia de deploy: Blue/Green ou Canary para zero downtime", critical: false },
    ]
  },
  {
    id: "observability",
    icon: "◉",
    phase: "FASE 08",
    title: "Observabilidade & Auditoria",
    color: "#00FF88",
    items: [
      { id: "o1", text: "Logs estruturados (JSON) com correlation ID em toda request", critical: true },
      { id: "o2", text: "Níveis de log corretos: ERROR só para erros reais, não para fluxo normal", critical: true },
      { id: "o3", text: "Métricas: latência, throughput, error rate, saturation (RED + USE)", critical: true },
      { id: "o4", text: "Distributed tracing: rastrear uma request por todo o sistema (OpenTelemetry)", critical: false },
      { id: "o5", text: "Alertas definidos com threshold claro e runbook de resposta", critical: true },
      { id: "o6", text: "Dashboard operacional: saúde do sistema visível em tempo real", critical: false },
      { id: "o7", text: "Audit trail imutável: quem fez o quê, quando, de onde (não deletável)", critical: true },
      { id: "o8", text: "Health check endpoints: /health, /ready, /live", critical: true },
      { id: "o9", text: "Retenção de logs definida e em conformidade com compliance", critical: true },
    ]
  },
  {
    id: "documentation",
    icon: "⬡",
    phase: "FASE 09",
    title: "Documentação",
    color: "#FF4444",
    items: [
      { id: "doc1", text: "README.md: como rodar, configurar, contribuir e fazer deploy", critical: true },
      { id: "doc2", text: "Documentação de API gerada automaticamente e sempre atualizada", critical: true },
      { id: "doc3", text: "Runbook operacional: como lidar com cada tipo de incidente", critical: true },
      { id: "doc4", text: "Diagrama de arquitetura versionado junto ao código", critical: true },
      { id: "doc5", text: "CHANGELOG.md mantido com semantic versioning (semver)", critical: true },
      { id: "doc6", text: "Onboarding guide: novo dev rodando o projeto em < 30 minutos", critical: false },
      { id: "doc7", text: "Decisões de design documentadas (ADR) — inclusive decisões REJEITADAS", critical: false },
      { id: "doc8", text: "Glossário de domínio acessível a toda equipe (tech e não-tech)", critical: false },
    ]
  },
  {
    id: "governance",
    icon: "◈",
    phase: "FASE 10",
    title: "Governança & Processos",
    color: "#FFB800",
    items: [
      { id: "g1", text: "Git flow definido: convenção de branches, commits (Conventional Commits)", critical: true },
      { id: "g2", text: "Code review obrigatório com checklist definido", critical: true },
      { id: "g3", text: "Nenhum secret, dado pessoal ou credencial no histórico git", critical: true },
      { id: "g4", text: "Política de dependências: versões pinadas, atualizações auditadas", critical: true },
      { id: "g5", text: "Licenças de dependências verificadas e compatíveis com o produto", critical: true },
      { id: "g6", text: "Processo de deprecação documentado: nada some sem aviso e prazo", critical: false },
      { id: "g7", text: "Análise de impacto obrigatória antes de breaking changes", critical: true },
      { id: "g8", text: "Retrospectivas e postmortems documentados e acessíveis", critical: false },
    ]
  }
];

const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0);
const criticalItems = sections.reduce((acc, s) => acc + s.items.filter(i => i.critical).length, 0);

export default function App() {
  const [checked, setChecked] = useState({});
  const [filter, setFilter] = useState("all");
  const [expandedSections, setExpandedSections] = useState(
    Object.fromEntries(sections.map(s => [s.id, true]))
  );

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleSection = (id) => setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));

  const totalChecked = Object.values(checked).filter(Boolean).length;
  const criticalChecked = sections.reduce((acc, s) =>
    acc + s.items.filter(i => i.critical && checked[i.id]).length, 0);

  const progress = Math.round((totalChecked / totalItems) * 100);
  const criticalProgress = Math.round((criticalChecked / criticalItems) * 100);

  const getFilteredItems = (items) => {
    if (filter === "critical") return items.filter(i => i.critical);
    if (filter === "pending") return items.filter(i => !checked[i.id]);
    if (filter === "done") return items.filter(i => checked[i.id]);
    return items;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080B0F",
      color: "#E8EDF2",
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1A2030",
        padding: "32px 40px 24px",
        background: "linear-gradient(180deg, #0D1117 0%, #080B0F 100%)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "#4A6080", marginBottom: 6, textTransform: "uppercase" }}>
                Software Engineering // Master Checklist
              </div>
              <h1 style={{
                fontSize: "clamp(18px, 3vw, 26px)",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.02em",
                color: "#E8EDF2",
                lineHeight: 1.2,
              }}>
                Arquitetura · Engenharia · Programação
              </h1>
              <div style={{ fontSize: 11, color: "#3A5070", marginTop: 6 }}>
                {totalItems} itens · {criticalItems} críticos · Agnóstico de linguagem
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#00D4FF", lineHeight: 1 }}>{progress}%</div>
                <div style={{ fontSize: 10, color: "#4A6080", marginTop: 2, letterSpacing: "0.1em" }}>TOTAL</div>
              </div>
              <div style={{ width: 1, height: 40, background: "#1A2030" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: criticalProgress === 100 ? "#00FF88" : "#FF4444", lineHeight: 1 }}>
                  {criticalProgress}%
                </div>
                <div style={{ fontSize: 10, color: "#4A6080", marginTop: 2, letterSpacing: "0.1em" }}>CRÍTICOS</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 20, display: "flex", gap: 8, flexDirection: "column" }}>
            <div style={{ height: 3, background: "#1A2030", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #00D4FF, #7B61FF)",
                transition: "width 0.4s ease",
                borderRadius: 2,
              }} />
            </div>
            <div style={{ height: 2, background: "#1A2030", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${criticalProgress}%`,
                background: criticalProgress === 100 ? "#00FF88" : "#FF4444",
                transition: "width 0.4s ease",
                borderRadius: 2,
              }} />
            </div>
          </div>

          {/* Filter */}
          <div style={{ display: "flex", gap: 4, marginTop: 16, flexWrap: "wrap" }}>
            {[
              { key: "all", label: "Todos" },
              { key: "critical", label: "⚠ Críticos" },
              { key: "pending", label: "Pendentes" },
              { key: "done", label: "Concluídos" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  background: filter === f.key ? "#1A2A40" : "transparent",
                  border: `1px solid ${filter === f.key ? "#00D4FF44" : "#1A2030"}`,
                  color: filter === f.key ? "#00D4FF" : "#4A6080",
                  padding: "5px 14px",
                  borderRadius: 4,
                  fontSize: 11,
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 40px" }}>
        {sections.map((section, si) => {
          const filtered = getFilteredItems(section.items);
          if (filtered.length === 0) return null;
          const sectionChecked = section.items.filter(i => checked[i.id]).length;
          const isExpanded = expandedSections[section.id];

          return (
            <div key={section.id} style={{ marginBottom: 8 }}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 20px",
                  background: "#0D1117",
                  border: `1px solid #1A2030`,
                  borderLeft: `3px solid ${section.color}`,
                  borderRadius: isExpanded ? "6px 6px 0 0" : "6px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: 16, color: section.color }}>{section.icon}</span>
                <span style={{ fontSize: 10, color: "#4A6080", letterSpacing: "0.2em", minWidth: 60 }}>{section.phase}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#E8EDF2", flex: 1 }}>{section.title}</span>
                <span style={{
                  fontSize: 11,
                  color: sectionChecked === section.items.length ? "#00FF88" : section.color,
                  letterSpacing: "0.05em",
                }}>
                  {sectionChecked}/{section.items.length}
                </span>
                <span style={{ fontSize: 10, color: "#4A6080", marginLeft: 8 }}>
                  {isExpanded ? "▲" : "▼"}
                </span>
              </button>

              {/* Items */}
              {isExpanded && (
                <div style={{
                  border: "1px solid #1A2030",
                  borderTop: "none",
                  borderRadius: "0 0 6px 6px",
                  overflow: "hidden",
                }}>
                  {filtered.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                        padding: "12px 20px",
                        background: checked[item.id] ? "#0A1A12" : idx % 2 === 0 ? "#080B0F" : "#0A0D12",
                        borderTop: idx > 0 ? "1px solid #12181F" : "none",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{
                        width: 16,
                        height: 16,
                        border: `1.5px solid ${checked[item.id] ? "#00FF88" : "#2A3A50"}`,
                        borderRadius: 3,
                        background: checked[item.id] ? "#00FF88" : "transparent",
                        flexShrink: 0,
                        marginTop: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s",
                      }}>
                        {checked[item.id] && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#080B0F" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        )}
                      </div>

                      {/* Critical badge */}
                      {item.critical && (
                        <div style={{
                          fontSize: 9,
                          color: "#FF4444",
                          border: "1px solid #FF444433",
                          borderRadius: 3,
                          padding: "1px 5px",
                          letterSpacing: "0.1em",
                          flexShrink: 0,
                          marginTop: 2,
                          background: "#FF444408",
                        }}>
                          MUST
                        </div>
                      )}

                      <span style={{
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: checked[item.id] ? "#3A5040" : "#9AAABB",
                        textDecoration: checked[item.id] ? "line-through" : "none",
                        transition: "all 0.15s",
                      }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Footer */}
        <div style={{
          marginTop: 40,
          padding: "20px",
          background: "#0D1117",
          border: "1px solid #1A2030",
          borderRadius: 6,
          fontSize: 11,
          color: "#3A5070",
          lineHeight: 1.8,
        }}>
          <div style={{ color: "#4A6080", marginBottom: 8, letterSpacing: "0.1em" }}>// NOTA</div>
          <div>Items marcados como <span style={{ color: "#FF4444" }}>MUST</span> são não-negociáveis para um software auditável e seguro.</div>
          <div>Items sem marcação são altamente recomendados mas podem ser faseados conforme maturidade do projeto.</div>
          <div style={{ marginTop: 8 }}>Software limpo não é acidente — é decisão intencional repetida a cada commit.</div>
        </div>
      </div>
    </div>
  );
}
