import { EventBus } from './events/eventBus.js';
import { GraphEngine } from './graph/graphEngine.js';
import { ValidatorEngine } from './validation/validatorEngine.js';
import { MentorEngine } from './mentor/mentorEngine.js';

export class ArckCore {
  constructor(config = {}) {
    this.bus = new EventBus();
    this.graph = new GraphEngine(this.bus);
    this.validator = new ValidatorEngine(this.bus, config.manifesto);
    this.mentor = new MentorEngine(this.bus, this.validator);
    
    if (typeof window !== 'undefined') {
      window.arckBus = this.bus;
    }
    
    this.setupCoreListeners();
  }

  setupCoreListeners() {
    this.bus.on('graph:get', (callback) => {
      callback(this.graph);
    });
  }
} 
