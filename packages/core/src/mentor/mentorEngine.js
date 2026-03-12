export class MentorEngine {
  constructor(bus, validator) {
    this.bus = bus;
    this.validator = validator;
    this.lessons = new Map();
    
    this.loadLessons();
    this.setupListeners();
  }

  loadLessons() {
    const lessons = [
      {
        id: 'no-direct-db-access',
        title: 'Frontend não deve acessar banco de dados',
        severity: 'critical',
        category: 'security',
        level: 'beginner',
        pattern: {
          type: 'connection',
          source: 'L1',
          target: 'L4'
        },
        explanation: 'Frontends rodam no navegador do usuário, um ambiente inseguro. Credenciais de banco expostas podem ser extraídas.',
        whyItMatters: 'Expor banco de dados diretamente ao frontend é uma das vulnerabilidades mais críticas.',
        consequences: [
          'Credenciais do banco expostas',
          'SQL Injection possível',
          'Dados podem ser extraídos'
        ],
        recommendation: {
          description: 'Adicione uma camada de API entre Frontend e Banco de Dados',
          steps: [
            'Criar uma API (REST ou GraphQL)',
            'Implementar autenticação na API',
            'Mover queries para o backend'
          ]
        },
        tags: ['security', 'web', 'database']
      },
      
      {
        id: 'missing-cache-layer',
        title: 'Alta latência detectada - Cache recomendado',
        severity: 'warning',
        category: 'performance',
        level: 'intermediate',
        pattern: {
          type: 'connection',
          source: 'L2',
          target: 'L4'
        },
        explanation: 'Quando uma API chama o banco de dados repetidamente para os mesmos dados, isso cria latência desnecessária.',
        whyItMatters: 'Cache pode reduzir latência em 90% e diminuir custos.',
        consequences: [
          'Tempo de resposta alto',
          'Banco de dados sobrecarregado',
          'Custos maiores'
        ],
        recommendation: {
          description: 'Adicione Redis entre API e Banco de Dados',
          steps: [
            'Implementar Redis ou Memcached',
            'Definir política de expiração',
            'Cachear consultas frequentes'
          ]
        },
        tags: ['performance', 'cache']
      }
    ];
    
    lessons.forEach(lesson => {
      this.lessons.set(lesson.id, lesson);
    });
  }

  setupListeners() {
    this.bus.on('violation:detected', (violation) => {
      this.analyzeViolation(violation);
    });
  }

  analyzeViolation(violation) {
    const relevantLessons = [];
    
    for (const lesson of this.lessons.values()) {
      if (this.matchesLesson(violation, lesson)) {
        relevantLessons.push({
          lesson,
          context: violation,
          severity: lesson.severity
        });
      }
    }
    
    if (relevantLessons.length > 0) {
      this.bus.emit('mentor:lessons', {
        violations: [violation],
        lessons: relevantLessons
      });
    }
  }

  matchesLesson(violation, lesson) {
    const pattern = lesson.pattern;
    
    if (pattern.type === 'connection') {
      const sourceMatch = violation.source?.layer === pattern.source;
      const targetMatch = violation.target?.layer === pattern.target;
      return sourceMatch && targetMatch;
    }
    
    return false;
  }
} 
