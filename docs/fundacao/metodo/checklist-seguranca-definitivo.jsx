import { useState } from "react";

const sections = [
  {
    id: "foundation",
    icon: "⬡",
    phase: "FASE 01",
    title: "Fundação & Requisitos",
    color: "#00D4FF",
    sec: "Threat Modeling · Compliance",
    items: [
      { id: "f1", text: "Documento de visão: problema + solução + público-alvo + restrições", critical: true },
      { id: "f2", text: "NFRs quantificados: latência p99, throughput, disponibilidade (ex: 99.9%)", critical: true },
      { id: "f3", text: "Trade-offs documentados explicitamente (consistência vs disponibilidade)", critical: true },
      { id: "f4", text: "SLIs / SLOs / SLAs definidos e aceitos pela organização", critical: true },
      { id: "f5", text: "Análise de conformidade: LGPD, GDPR, PCI-DSS, HIPAA, SOX (o que se aplica)", critical: true, security: true },
      { id: "f6", text: "Threat Modeling (STRIDE/PASTA) — EXECUTADO, não apenas planejado", critical: true, security: true },
      { id: "f7", text: "Classificação de dados: público / interno / confidencial / regulado", critical: true, security: true },
      { id: "f8", text: "Superfície de ataque mapeada: todos os pontos de entrada do sistema", critical: true, security: true },
      { id: "f9", text: "Controle de mutabilidade de NFRs: quem altera e por qual processo", critical: false },
      { id: "f10", text: "Estimativa de custo operacional mensal (nuvem/on-prem)", critical: false },
    ]
  },
  {
    id: "architecture",
    icon: "◈",
    phase: "FASE 02",
    title: "Arquitetura & Design",
    color: "#7B61FF",
    sec: "Security by Design · Zero Trust",
    items: [
      { id: "a1", text: "Diagrama C4 (nível 1 e 2 obrigatórios) versionado junto ao código", critical: true },
      { id: "a2", text: "ADRs — Architecture Decision Records (inclusive decisões REJEITADAS)", critical: true },
      { id: "a3", text: "Fronteiras explícitas entre domínios/bounded contexts", critical: true },
      { id: "a4", text: "Security by Design: segurança modelada na arquitetura, não acoplada depois", critical: true, security: true },
      { id: "a5", text: "Modelo Zero Trust: nenhum componente confia em outro por padrão", critical: true, security: true },
      { id: "a6", text: "Estratégia de escalabilidade (horizontal preferida, stateless onde possível)", critical: true },
      { id: "a7", text: "Resiliência: timeouts, retries com backoff, circuit breakers, bulkheads", critical: true },
      { id: "a8", text: "Fallback definido para cada dependência crítica", critical: true },
      { id: "a9", text: "Segmentação de rede: VPC, sub-redes, DMZ, isolamento de tiers", critical: true, security: true },
      { id: "a10", text: "Análise de SPOF — pontos únicos de falha identificados e mitigados", critical: true },
      { id: "a11", text: "Defense in Depth: múltiplas camadas independentes de proteção", critical: true, security: true },
      { id: "a12", text: "Fail-secure: em caso de falha, sistema nega acesso (não libera)", critical: true, security: true },
      { id: "a13", text: "Chaos Engineering planejado para validar resiliência", critical: false },
    ]
  },
  {
    id: "code",
    icon: "◎",
    phase: "FASE 03",
    title: "Engenharia de Código",
    color: "#00FF88",
    sec: "Input Validation · Secrets Hygiene",
    items: [
      { id: "c1", text: "Guia de estilo + linter + formatador automático (gate na CI)", critical: true },
      { id: "c2", text: "Conventional Commits + versionamento semântico", critical: true },
      { id: "c3", text: "Validação de entrada em TODA fronteira (nunca confiar em input externo)", critical: true, security: true },
      { id: "c4", text: "Sanitização de output com escape contextual (HTML, SQL, shell, LDAP)", critical: true, security: true },
      { id: "c5", text: "Queries parametrizadas/prepared statements — nunca concatenar SQL", critical: true, security: true },
      { id: "c6", text: "Tratamento consistente de erros — nunca engolir exceção silenciosamente", critical: true },
      { id: "c7", text: "Erros não vazam stack trace / dados internos para o usuário final", critical: true, security: true },
      { id: "c8", text: "ZERO secrets no código ou histórico git — vault/secrets manager", critical: true, security: true },
      { id: "c9", text: "Limites explícitos: timeout, tamanho de payload, nº de itens, profundidade", critical: true, security: true },
      { id: "c10", text: "Princípios SOLID aplicados na camada de domínio", critical: true },
      { id: "c11", text: "Complexidade ciclomática controlada (máx ~10 por função)", critical: false },
      { id: "c12", text: "Tipagem estática onde a linguagem suporta (TS, mypy, etc.)", critical: false },
    ]
  },
  {
    id: "authsec",
    icon: "◉",
    phase: "FASE 04",
    title: "Segurança — Acesso & Identidade",
    color: "#FF4444",
    sec: "IAM · AuthN · AuthZ",
    items: [
      { id: "s1", text: "Autenticação forte: MFA obrigatório para contas administrativas", critical: true, security: true },
      { id: "s2", text: "Tokens com expiração curta + rotação + revogação (JWT/OAuth2/OIDC)", critical: true, security: true },
      { id: "s3", text: "Autorização por Menor Privilégio (RBAC/ABAC) — negar por padrão", critical: true, security: true },
      { id: "s4", text: "Verificação de autorização em CADA recurso (prevenir IDOR/BOLA)", critical: true, security: true },
      { id: "s5", text: "Política de senha forte + zero credenciais default", critical: true, security: true },
      { id: "s6", text: "Rate limiting por IP/usuário/endpoint (anti brute-force e DoS)", critical: true, security: true },
      { id: "s7", text: "Acesso administrativo com break-glass + justificativa + log imutável", critical: true, security: true },
      { id: "s8", text: "Gestão de sessão segura: invalidação no logout, fixação prevenida", critical: true, security: true },
      { id: "s9", text: "Proteção de contas: lockout, detecção de credential stuffing", critical: false, security: true },
    ]
  },
  {
    id: "datasec",
    icon: "◉",
    phase: "FASE 05",
    title: "Segurança — Dados & Vulnerabilidades",
    color: "#FF4444",
    sec: "Crypto · OWASP · SCA · SBOM",
    items: [
      { id: "v1", text: "Criptografia em trânsito: TLS 1.3 (1.2 mínimo), HSTS forçado", critical: true, security: true },
      { id: "v2", text: "Criptografia em repouso: AES-256 ou equivalente, com gestão de chaves (KMS)", critical: true, security: true },
      { id: "v3", text: "Rotação de chaves criptográficas com ciclo definido", critical: true, security: true },
      { id: "v4", text: "OWASP Top 10 mitigado: SQLi, XSS, CSRF, SSRF, IDOR, deserialization", critical: true, security: true },
      { id: "v5", text: "Headers de segurança: CSP, HSTS, X-Frame-Options, X-Content-Type", critical: true, security: true },
      { id: "v6", text: "CORS configurado restritivamente (sem wildcard em produção)", critical: true, security: true },
      { id: "v7", text: "SCA — scan de dependências por CVEs (Snyk, Dependabot, Trivy)", critical: true, security: true },
      { id: "v8", text: "SBOM — Software Bill of Materials gerado e mantido", critical: true, security: true },
      { id: "v9", text: "Supply chain: dependências pinadas, verificação de integridade (lockfiles, hashes)", critical: true, security: true },
      { id: "v10", text: "PII identificado, minimizado, anonimizado/pseudonimizado", critical: true, security: true },
      { id: "v11", text: "Pentest por terceiros antes de exposição pública", critical: false, security: true },
      { id: "v12", text: "Bug bounty / programa de divulgação responsável (se exposto publicamente)", critical: false, security: true },
    ]
  },
  {
    id: "data",
    icon: "⬡",
    phase: "FASE 06",
    title: "Dados & Persistência",
    color: "#FFB800",
    sec: "Audit Trail · Backup · DR",
    items: [
      { id: "d1", text: "Migrações como código: versionadas, idempotentes, com rollback testado", critical: true },
      { id: "d2", text: "Backup automatizado com RPO/RTO documentados", critical: true },
      { id: "d3", text: "Restauração TESTADA periodicamente (backup só existe se restaura)", critical: true },
      { id: "d4", text: "Ambiente de Disaster Recovery provisionado e testado (não só documentado)", critical: true, security: true },
      { id: "d5", text: "Audit trail IMUTÁVEL: quem, o quê, quando, de onde, justificativa", critical: true, security: true },
      { id: "d6", text: "Campos de auditoria padrão: created_at/by, updated_at/by", critical: true },
      { id: "d7", text: "Política de retenção + purga automatizada (dados não crescem para sempre)", critical: true },
      { id: "d8", text: "Soft delete preferido (flag, não remoção física imediata)", critical: false },
      { id: "d9", text: "Transações ACID onde a consistência é crítica", critical: true },
      { id: "d10", text: "Controle de concorrência definido (otimista/pessimista)", critical: false },
      { id: "d11", text: "Índices planejados e justificados (não criados aleatoriamente)", critical: false },
    ]
  },
  {
    id: "testing",
    icon: "◈",
    phase: "FASE 07",
    title: "Testes & Qualidade",
    color: "#00D4FF",
    sec: "SAST · DAST · Pentest Automation",
    items: [
      { id: "t1", text: "Pirâmide de testes: Unit (>70% crítico) > Integration > E2E", critical: true },
      { id: "t2", text: "Cobertura reportada e visível no PR, como gate na CI", critical: true },
      { id: "t3", text: "Testes de contrato (consumidor/provedor)", critical: true },
      { id: "t4", text: "Testes E2E das jornadas críticas do usuário", critical: true },
      { id: "t5", text: "SAST — análise estática de segurança na pipeline", critical: true, security: true },
      { id: "t6", text: "DAST — análise dinâmica de segurança em ambiente de teste", critical: true, security: true },
      { id: "t7", text: "Testes de regressão automáticos antes de cada merge", critical: true },
      { id: "t8", text: "Testes de carga e stress — limite do sistema conhecido", critical: true },
      { id: "t9", text: "Testes de abuso: o que acontece com input malicioso/malformado", critical: false, security: true },
      { id: "t10", text: "Mutation testing para validar a qualidade dos testes", critical: false },
    ]
  },
  {
    id: "cicd",
    icon: "◎",
    phase: "FASE 08",
    title: "CI/CD & Entrega Segura",
    color: "#7B61FF",
    sec: "Pipeline Hardening · IaC Security",
    items: [
      { id: "ci1", text: "Pipeline: build → test → SAST → SCA → DAST → deploy (gates obrigatórios)", critical: true, security: true },
      { id: "ci2", text: "Artefato imutável: mesmo binário/imagem em todos os ambientes", critical: true },
      { id: "ci3", text: "Assinatura de artefatos + verificação na entrega (Sigstore/cosign)", critical: true, security: true },
      { id: "ci4", text: "Infrastructure as Code (Terraform/Pulumi) — nada manual em produção", critical: true },
      { id: "ci5", text: "IaC security scan (Checkov, tfsec) — config insegura barrada", critical: true, security: true },
      { id: "ci6", text: "Branch protection: sem merge sem CI verde + review aprovado", critical: true },
      { id: "ci7", text: "Deploy automatizado com rollback automático testado", critical: true },
      { id: "ci8", text: "Canary / Blue-Green / feature flags para mudanças grandes", critical: false },
      { id: "ci9", text: "Permissões de pipeline com menor privilégio (CI não é root)", critical: true, security: true },
      { id: "ci10", text: "Rollback automático disparado por SLO quebrado (erro > limiar)", critical: false },
    ]
  },
  {
    id: "observability",
    icon: "◉",
    phase: "FASE 09",
    title: "Observabilidade & Detecção",
    color: "#00FF88",
    sec: "SIEM · Intrusion Detection",
    items: [
      { id: "o1", text: "Logs estruturados (JSON) centralizados com correlation ID end-to-end", critical: true },
      { id: "o2", text: "Métricas RED/USE: latência, erro, saturação, tráfego + infra", critical: true },
      { id: "o3", text: "Distributed tracing (OpenTelemetry, Jaeger, Tempo)", critical: false },
      { id: "o4", text: "Logs de segurança enviados a SIEM (eventos de auth, acesso, falha)", critical: true, security: true },
      { id: "o5", text: "Detecção de intrusão / comportamento anômalo (tentativas de exploit)", critical: true, security: true },
      { id: "o6", text: "Alertas com limiar baseado em SLO (não em 'sentimento')", critical: true },
      { id: "o7", text: "Playbook por alerta — o que fazer quando cada um dispara", critical: true },
      { id: "o8", text: "Health checks: /health, /ready, /live", critical: true },
      { id: "o9", text: "Logs NÃO contêm secrets, PII ou tokens (sanitização de log)", critical: true, security: true },
      { id: "o10", text: "Retenção de logs conforme compliance + proteção contra adulteração", critical: true, security: true },
    ]
  },
  {
    id: "governance",
    icon: "◈",
    phase: "FASE 10",
    title: "Governança, Docs & Resposta",
    color: "#FFB800",
    sec: "Incident Response · Compliance",
    items: [
      { id: "g1", text: "README + docs de API (OpenAPI/Swagger) sempre atualizados", critical: true },
      { id: "g2", text: "Runbook de incidentes: passo a passo por tipo de evento", critical: true },
      { id: "g3", text: "Plano de Resposta a Incidentes de Segurança (detecção→contenção→pós)", critical: true, security: true },
      { id: "g4", text: "Onboarding: do git clone ao primeiro PR em < 2h", critical: false },
      { id: "g5", text: "Code review obrigatório com checklist (mín. 1 aprovação)", critical: true },
      { id: "g6", text: "main sempre deployável (verde) — trunk-based ou git flow curto", critical: true },
      { id: "g7", text: "Definition of Done objetiva, incluindo critérios de segurança", critical: true },
      { id: "g8", text: "Compliance monitorado continuamente (não só na Fase 01)", critical: true, security: true },
      { id: "g9", text: "Registro de dívida técnica com dono e priorização", critical: false },
      { id: "g10", text: "Postmortems blameless documentados e acessíveis", critical: false },
      { id: "g11", text: "Análise de impacto obrigatória antes de breaking changes", critical: true },
    ]
  }
];

const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0);
const criticalItems = sections.reduce((acc, s) => acc + s.items.filter(i => i.critical).length, 0);
const securityItems = sections.reduce((acc, s) => acc + s.items.filter(i => i.security).length, 0);

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
  const securityChecked = sections.reduce((acc, s) =>
    acc + s.items.filter(i => i.security && checked[i.id]).length, 0);

  const progress = Math.round((totalChecked / totalItems) * 100);
  const criticalProgress = Math.round((criticalChecked / criticalItems) * 100);
  const securityProgress = Math.round((securityChecked / securityItems) * 100);

  const getFilteredItems = (items) => {
    if (filter === "critical") return items.filter(i => i.critical);
    if (filter === "security") return items.filter(i => i.security);
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
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1A2030",
        padding: "28px 40px 22px",
        background: "linear-gradient(180deg, #0D1117 0%, #080B0F 100%)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "#4A6080", marginBottom: 6, textTransform: "uppercase" }}>
                Production Software // Security-Hardened Master Checklist
              </div>
              <h1 style={{
                fontSize: "clamp(17px, 3vw, 24px)",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}>
                Arquitetura · Engenharia · Segurança · Vulnerabilidade
              </h1>
              <div style={{ fontSize: 11, color: "#3A5070", marginTop: 6 }}>
                {totalItems} itens · {criticalItems} críticos · {securityItems} de segurança · Agnóstico de linguagem
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#00D4FF", lineHeight: 1 }}>{progress}%</div>
                <div style={{ fontSize: 9, color: "#4A6080", marginTop: 3, letterSpacing: "0.1em" }}>TOTAL</div>
              </div>
              <div style={{ width: 1, height: 36, background: "#1A2030" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: criticalProgress === 100 ? "#00FF88" : "#FFB800", lineHeight: 1 }}>
                  {criticalProgress}%
                </div>
                <div style={{ fontSize: 9, color: "#4A6080", marginTop: 3, letterSpacing: "0.1em" }}>CRÍTICOS</div>
              </div>
              <div style={{ width: 1, height: 36, background: "#1A2030" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: securityProgress === 100 ? "#00FF88" : "#FF4444", lineHeight: 1 }}>
                  {securityProgress}%
                </div>
                <div style={{ fontSize: 9, color: "#4A6080", marginTop: 3, letterSpacing: "0.1em" }}>SEGURANÇA</div>
              </div>
            </div>
          </div>

          {/* Progress bars */}
          <div style={{ marginTop: 18, display: "flex", gap: 6, flexDirection: "column" }}>
            <div style={{ height: 3, background: "#1A2030", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #00D4FF, #7B61FF)", transition: "width 0.4s ease" }} />
            </div>
            <div style={{ height: 2, background: "#1A2030", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${securityProgress}%`, background: securityProgress === 100 ? "#00FF88" : "#FF4444", transition: "width 0.4s ease" }} />
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 4, marginTop: 14, flexWrap: "wrap" }}>
            {[
              { key: "all", label: "Todos" },
              { key: "critical", label: "⚠ Críticos (MUST)" },
              { key: "security", label: "🔒 Segurança" },
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
                  padding: "5px 13px",
                  borderRadius: 4,
                  fontSize: 11,
                  cursor: "pointer",
                  letterSpacing: "0.06em",
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
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 40px" }}>
        {sections.map((section) => {
          const filtered = getFilteredItems(section.items);
          if (filtered.length === 0) return null;
          const sectionChecked = section.items.filter(i => checked[i.id]).length;
          const isExpanded = expandedSections[section.id];
          const isSecPhase = section.color === "#FF4444";

          return (
            <div key={section.id} style={{ marginBottom: 8 }}>
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 20px",
                  background: isSecPhase ? "#140A0D" : "#0D1117",
                  border: `1px solid #1A2030`,
                  borderLeft: `3px solid ${section.color}`,
                  borderRadius: isExpanded ? "6px 6px 0 0" : "6px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: 15, color: section.color }}>{section.icon}</span>
                <span style={{ fontSize: 10, color: "#4A6080", letterSpacing: "0.18em", minWidth: 58 }}>{section.phase}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#E8EDF2" }}>{section.title}</div>
                  <div style={{ fontSize: 9.5, color: section.color, opacity: 0.7, letterSpacing: "0.08em", marginTop: 2 }}>{section.sec}</div>
                </div>
                <span style={{ fontSize: 11, color: sectionChecked === section.items.length ? "#00FF88" : section.color }}>
                  {sectionChecked}/{section.items.length}
                </span>
                <span style={{ fontSize: 10, color: "#4A6080", marginLeft: 6 }}>{isExpanded ? "▲" : "▼"}</span>
              </button>

              {isExpanded && (
                <div style={{ border: "1px solid #1A2030", borderTop: "none", borderRadius: "0 0 6px 6px", overflow: "hidden" }}>
                  {filtered.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "11px 20px",
                        background: checked[item.id] ? "#0A1A12" : idx % 2 === 0 ? "#080B0F" : "#0A0D12",
                        borderTop: idx > 0 ? "1px solid #12181F" : "none",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{
                        width: 16, height: 16,
                        border: `1.5px solid ${checked[item.id] ? "#00FF88" : "#2A3A50"}`,
                        borderRadius: 3,
                        background: checked[item.id] ? "#00FF88" : "transparent",
                        flexShrink: 0, marginTop: 1,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {checked[item.id] && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#080B0F" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 6, flexShrink: 0, marginTop: 1 }}>
                        {item.critical && (
                          <div style={{ fontSize: 9, color: "#FF4444", border: "1px solid #FF444433", borderRadius: 3, padding: "1px 5px", letterSpacing: "0.08em", background: "#FF444408" }}>
                            MUST
                          </div>
                        )}
                        {item.security && (
                          <div style={{ fontSize: 9, color: "#00D4FF", border: "1px solid #00D4FF33", borderRadius: 3, padding: "1px 4px", background: "#00D4FF08" }}>
                            🔒
                          </div>
                        )}
                      </div>

                      <span style={{
                        fontSize: 12.5, lineHeight: 1.5,
                        color: checked[item.id] ? "#3A5040" : "#9AAABB",
                        textDecoration: checked[item.id] ? "line-through" : "none",
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
        <div style={{ marginTop: 36, padding: "20px", background: "#0D1117", border: "1px solid #1A2030", borderRadius: 6, fontSize: 11, color: "#3A5070", lineHeight: 1.8 }}>
          <div style={{ color: "#4A6080", marginBottom: 8, letterSpacing: "0.1em" }}>// FILOSOFIA DE SEGURANÇA</div>
          <div><span style={{ color: "#FF4444" }}>MUST</span> = não-negociável. <span style={{ color: "#00D4FF" }}>🔒</span> = item de segurança (transversal a todas as fases).</div>
          <div style={{ marginTop: 6 }}>Segurança não é a Fase 04 — é uma <span style={{ color: "#00D4FF" }}>camada transversal</span> presente da Fase 01 à 10.</div>
          <div>Defense in Depth: nenhuma camada única deve ser o ponto de falha. Assuma que cada camada será violada.</div>
          <div>Fail-secure: na dúvida, o sistema NEGA. Descobrir vulnerabilidade em produção custa 100x descobri-la no design.</div>
        </div>
      </div>
    </div>
  );
}
