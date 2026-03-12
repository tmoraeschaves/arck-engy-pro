export class ValidatorEngine {
  constructor(bus, manifesto = null) {
    this.bus = bus;
    this.manifesto = manifesto || this.defaultManifesto();
    this.violations = [];
    
    this.bus.on('connection:added', (conn) => this.validateConnection(conn));
  }

  defaultManifesto() {
    return {
      layers: {
        L1: { name: 'SENSÓRIA', next: 'L2' },
        L2: { name: 'LÓGICA', next: 'L3' },
        L3: { name: 'POTÊNCIA', next: 'L4' },
        L4: { name: 'ATUAÇÃO', next: 'L5' },
        L5: { name: 'FEEDBACK', next: 'L2' }
      }
    };
  }

  validateConnection(conn) {
    // Por enquanto, validação simples
    return true;
  }

  validateAll(graph) {
    this.violations = [];
    
    if (!graph || !graph.connections) return this.violations;
    
    graph.connections.forEach(conn => {
      const source = graph.nodes?.get ? graph.nodes.get(conn.sourceId) : null;
      const target = graph.nodes?.get ? graph.nodes.get(conn.targetId) : null;
      
      if (!source || !target) return;
      
      const sourceLayer = this.manifesto.layers[source.layer];
      const targetLayer = this.manifesto.layers[target.layer];
      
      if (!sourceLayer || !targetLayer) return;
      
      if (sourceLayer.next !== target.layer && source.layer !== 'L5') {
        const violation = {
          type: 'invalid-connection',
          source,
          target,
          conn,
          timestamp: Date.now(),
          severity: 'critical'
        };
        this.violations.push(violation);
        this.bus.emit('violation:detected', violation);
      }
    });
    
    this.bus.emit('validation:complete', { 
      violations: this.violations,
      count: this.violations.length
    });
    
    return this.violations;
  }

  getViolations() {
    return this.violations;
  }
} 
