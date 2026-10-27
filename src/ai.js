import { state } from './state.js';
import { TEMPLATES } from './templates.js';

export class DiagramAIEngine {
  constructor() {}

  generateFromPrompt(promptText, diagramType = 'Architecture') {
    const p = promptText.toLowerCase();

    // Check for RAG / AI
    if (p.includes('rag') || p.includes('vector') || p.includes('embedding') || p.includes('retriev')) {
      state.loadTemplate('rag');
      return { success: true, message: 'Generated RAG Pipeline with Document Ingestion, pgvector & LLM Retriever.' };
    }

    // Check for Microservices / E-commerce / Kafka
    if (p.includes('microservice') || p.includes('kafka') || p.includes('commerce') || p.includes('event')) {
      state.loadTemplate('microservices');
      return { success: true, message: 'Generated Microservices Architecture with API Gateway, Go/TS Services, Redis & Kafka.' };
    }

    // Check for Agent / Autonomous
    if (p.includes('agent') || p.includes('react') && p.includes('loop') || p.includes('tool') || p.includes('planner')) {
      state.loadTemplate('aiagent');
      return { success: true, message: 'Generated AI Agent Loop with Planner, Tool Calling & Vector Memory.' };
    }

    // Custom generative synthesis based on keywords!
    const nodes = [];
    const edges = [];
    const sections = [];

    // Always start with client
    nodes.push({
      id: 'gen-client',
      label: 'Client App',
      subtitle: 'React / Web',
      icon: 'react',
      x: 140,
      y: 240,
      width: 70,
      height: 70
    });

    // Check if API Gateway is needed
    let gatewayId = 'gen-gw';
    nodes.push({
      id: gatewayId,
      label: 'API Gateway',
      subtitle: 'Nginx / Kong',
      icon: 'nginx',
      x: 320,
      y: 240,
      width: 70,
      height: 70
    });
    edges.push({
      id: 'ge-1',
      from: 'gen-client',
      to: gatewayId,
      label: 'HTTPS / JSON',
      style: 'bezier',
      stroke: '#3b82f6',
      step: 1
    });

    // Service tier
    let serviceId = 'gen-service';
    nodes.push({
      id: serviceId,
      label: 'Core Service',
      subtitle: 'Node.js / Express',
      icon: 'nodejs',
      x: 520,
      y: 240,
      width: 70,
      height: 70
    });
    edges.push({
      id: 'ge-2',
      from: gatewayId,
      to: serviceId,
      label: 'gRPC',
      style: 'bezier',
      stroke: '#10b981',
      step: 2
    });

    // Cache if mentioned
    if (p.includes('cache') || p.includes('redis') || p.includes('fast') || p.includes('scale')) {
      nodes.push({
        id: 'gen-cache',
        label: 'Redis Cache',
        subtitle: 'Sub-millisecond hit',
        icon: 'redis',
        x: 700,
        y: 170,
        width: 70,
        height: 70
      });
      edges.push({
        id: 'ge-cache',
        from: serviceId,
        to: 'gen-cache',
        label: 'Cache Hit',
        style: 'bezier',
        stroke: '#ef4444',
        step: 3
      });
    }

    // Database tier
    const dbIcon = p.includes('mongo') ? 'mongodb' : 'postgresql';
    const dbName = p.includes('mongo') ? 'MongoDB' : 'PostgreSQL';
    nodes.push({
      id: 'gen-db',
      label: dbName,
      subtitle: 'Relational Store',
      icon: dbIcon,
      x: 700,
      y: 310,
      width: 70,
      height: 70
    });
    edges.push({
      id: 'ge-db',
      from: serviceId,
      to: 'gen-db',
      label: 'SQL Query',
      style: 'bezier',
      stroke: '#0284c7',
      step: 4
    });

    // Background section
    sections.push({
      id: 'sec-backend-zone',
      title: 'Backend Services',
      subtitle: 'Cloud VPC',
      x: 280,
      y: 120,
      width: 530,
      height: 300,
      fill: '#f8fafc',
      border: '#64748b',
      borderStyle: 'dashed'
    });

    state.diagram.title = promptText.slice(0, 32) + (promptText.length > 32 ? '...' : '');
    state.diagram.nodes = nodes;
    state.diagram.edges = edges;
    state.diagram.sections = sections;
    state.diagram.timeline = {
      duration: 4.0,
      currentTime: 0.0,
      isPlaying: false,
      loop: true,
      steps: edges.map((e, idx) => ({
        id: idx + 1,
        name: `${idx + 1}. ${e.label}`,
        time: idx * 1.0,
        edgeId: e.id,
        description: `Payload transferred along ${e.label}`
      }))
    };

    state.saveSnapshot();
    state.notify('diagram_change');

    return {
      success: true,
      message: `Generated custom ${diagramType} with ${nodes.length} nodes & ${edges.length} connections.`
    };
  }

  processByteyChat(message) {
    const m = message.toLowerCase();
    
    if (m.includes('cache') || m.includes('redis')) {
      const redis = state.addNode({
        label: 'Redis Cache',
        subtitle: 'In-Memory Store',
        icon: 'redis',
        x: 620,
        y: 160
      });
      // Auto connect to first node
      if (state.diagram.nodes.length > 1) {
        state.addEdge(state.diagram.nodes[0].id, redis.id, 'Cache Read/Write');
      }
      return 'Added Redis Cache to your architecture and connected it!';
    }

    if (m.includes('kafka') || m.includes('queue') || m.includes('event')) {
      const kafka = state.addNode({
        label: 'Kafka Bus',
        subtitle: 'Pub/Sub Broker',
        icon: 'kafka',
        x: 620,
        y: 320
      });
      return 'Added Apache Kafka Event Stream with 3 partitions.';
    }

    if (m.includes('clean') || m.includes('reset') || m.includes('clear')) {
      state.diagram.nodes = [];
      state.diagram.edges = [];
      state.diagram.sections = [];
      state.saveSnapshot();
      state.notify('diagram_change');
      return 'Cleared canvas. Ready for a new design!';
    }

    if (m.includes('animate') || m.includes('timeline') || m.includes('flow')) {
      state.isTimelineOpen = true;
      state.notify('timeline_toggle');
      return 'Opened Timeline Studio! Hit Space or Play to preview animated packet flow.';
    }

    return `I can help you build and refine your architecture! Try asking to:
- "Add a Redis cache"
- "Add a Kafka event stream"
- "Create a RAG AI pipeline"
- "Animate the diagram"`;
  }
}

export const aiEngine = new DiagramAIEngine();
