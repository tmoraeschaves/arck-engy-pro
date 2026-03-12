import { eventBus } from '../engine/eventBus.js';

export class GraphEngine {
  constructor() {
    this.nodes = [];
    this.init();
  }
  init() {
    eventBus.on('simulation:started', (data) => {
      console.log("GraphEngine: Motor de simulação detectado.", data);
    });
  }
}
export const graphEngine = new GraphEngine();