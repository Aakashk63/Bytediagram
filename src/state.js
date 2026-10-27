import { TEMPLATES } from './templates.js';

class DiagramState {
  constructor() {
    this.view = 'landing'; // 'landing' | 'editor'
    this.history = [];
    this.historyIndex = -1;
    this.listeners = new Set();
    
    // Core diagram model
    this.diagram = {
      id: 'diagram-default',
      title: 'Untitled diagram',
      type: 'Architecture',
      background: '#fafafa',
      showGrid: true,
      snapToGrid: false,
      nodes: [],
      edges: [],
      sections: [],
      timeline: {
        duration: 4.0,
        currentTime: 0.0,
        isPlaying: false,
        loop: true,
        steps: []
      }
    };

    // UI state
    this.selected = {
      type: 'none', // 'none' | 'node' | 'edge' | 'section'
      id: null
    };

    this.viewport = {
      zoom: 1.0,
      panX: 0,
      panY: 0,
      isPanning: false
    };

    this.activeLeftTab = 'templates';
    this.activeRightTab = 'properties';
    this.isTimelineOpen = false;
    this.isPresentationOpen = false;
    this.presentationStep = 0;
    this.isAiModalOpen = false;
    this.isDarkTheme = false;

    // Load initial default template
    this.loadTemplate('webapp', false);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, data) {
    for (const listener of this.listeners) {
      listener(event, data, this);
    }
  }

  saveSnapshot() {
    // Trim forward history if we mutated after an undo
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    const snapshot = JSON.stringify(this.diagram);
    this.history.push(snapshot);
    if (this.history.length > 50) this.history.shift();
    this.historyIndex = this.history.length - 1;
    this.notify('history_change');
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.diagram = JSON.parse(this.history[this.historyIndex]);
      this.notify('diagram_change');
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.diagram = JSON.parse(this.history[this.historyIndex]);
      this.notify('diagram_change');
    }
  }

  loadTemplate(templateId, recordHistory = true) {
    const tpl = TEMPLATES[templateId] || TEMPLATES.webapp;
    this.diagram = JSON.parse(JSON.stringify({
      id: 'diagram-' + Date.now(),
      title: tpl.title,
      type: tpl.category || 'Architecture',
      background: '#fafafa',
      showGrid: true,
      snapToGrid: false,
      nodes: tpl.nodes || [],
      edges: tpl.edges || [],
      sections: tpl.sections || [],
      timeline: {
        duration: tpl.timeline?.duration || 4.0,
        currentTime: 0.0,
        isPlaying: false,
        loop: true,
        steps: tpl.timeline?.steps || []
      }
    }));

    this.selected = { type: 'none', id: null };
    this.centerViewport();
    if (recordHistory) this.saveSnapshot();
    this.notify('template_loaded');
  }

  centerViewport() {
    this.viewport.zoom = 1.0;
    this.viewport.panX = 0;
    this.viewport.panY = 0;
    this.notify('viewport_change');
  }

  select(type, id) {
    this.selected = { type, id };
    this.notify('selection_change', this.selected);
  }

  clearSelection() {
    this.selected = { type: 'none', id: null };
    this.notify('selection_change', this.selected);
  }

  addNode(nodeData) {
    const id = nodeData.id || `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newNode = {
      id,
      label: nodeData.label || 'Service',
      subtitle: nodeData.subtitle || '',
      icon: nodeData.icon || 'nodejs',
      x: nodeData.x || 300,
      y: nodeData.y || 250,
      width: nodeData.width || 70,
      height: nodeData.height || 70,
      fill: nodeData.fill || '#ffffff',
      border: nodeData.border || '#cbd5e1',
      animation: nodeData.animation || 'static',
      sectionId: nodeData.sectionId || null
    };
    this.diagram.nodes.push(newNode);
    this.saveSnapshot();
    this.select('node', id);
    this.notify('diagram_change');
    return newNode;
  }

  updateNode(id, patch) {
    const node = this.diagram.nodes.find(n => n.id === id);
    if (!node) return;
    Object.assign(node, patch);
    this.saveSnapshot();
    this.notify('diagram_change');
  }

  deleteNode(id) {
    this.diagram.nodes = this.diagram.nodes.filter(n => n.id !== id);
    this.diagram.edges = this.diagram.edges.filter(e => e.from !== id && e.to !== id);
    if (this.selected.id === id) this.clearSelection();
    this.saveSnapshot();
    this.notify('diagram_change');
  }

  addSection(sectionData) {
    const id = sectionData.id || `sec-${Date.now()}`;
    const newSec = {
      id,
      title: sectionData.title || 'Zone',
      subtitle: sectionData.subtitle || '',
      x: sectionData.x || 200,
      y: sectionData.y || 150,
      width: sectionData.width || 220,
      height: sectionData.height || 200,
      fill: sectionData.fill || '#f8fafc',
      border: sectionData.border || '#94a3b8',
      borderStyle: sectionData.borderStyle || 'dashed',
      transparent: false,
      blur: 0,
      shadow: 0
    };
    this.diagram.sections.push(newSec);
    this.saveSnapshot();
    this.select('section', id);
    this.notify('diagram_change');
    return newSec;
  }

  updateSection(id, patch) {
    const sec = this.diagram.sections.find(s => s.id === id);
    if (!sec) return;
    Object.assign(sec, patch);
    this.saveSnapshot();
    this.notify('diagram_change');
  }

  deleteSection(id) {
    this.diagram.sections = this.diagram.sections.filter(s => s.id !== id);
    // Unparent nodes in this section
    this.diagram.nodes.forEach(n => {
      if (n.sectionId === id) n.sectionId = null;
    });
    if (this.selected.id === id) this.clearSelection();
    this.saveSnapshot();
    this.notify('diagram_change');
  }

  addEdge(fromId, toId, label = 'Data Flow') {
    if (fromId === toId) return null;
    const exists = this.diagram.edges.some(e => e.from === fromId && e.to === toId);
    if (exists) return null;
    const id = `edge-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newEdge = {
      id,
      from: fromId,
      to: toId,
      label,
      style: 'bezier',
      stroke: '#475569',
      step: this.diagram.edges.length + 1
    };
    this.diagram.edges.push(newEdge);
    this.saveSnapshot();
    this.select('edge', id);
    this.notify('diagram_change');
    return newEdge;
  }

  updateEdge(id, patch) {
    const edge = this.diagram.edges.find(e => e.id === id);
    if (!edge) return;
    Object.assign(edge, patch);
    this.saveSnapshot();
    this.notify('diagram_change');
  }

  deleteEdge(id) {
    this.diagram.edges = this.diagram.edges.filter(e => e.id !== id);
    if (this.selected.id === id) this.clearSelection();
    this.saveSnapshot();
    this.notify('diagram_change');
  }

  getSelectedObject() {
    if (this.selected.type === 'node') {
      return this.diagram.nodes.find(n => n.id === this.selected.id);
    }
    if (this.selected.type === 'edge') {
      return this.diagram.edges.find(e => e.id === this.selected.id);
    }
    if (this.selected.type === 'section') {
      return this.diagram.sections.find(s => s.id === this.selected.id);
    }
    return null;
  }
}

export const state = new DiagramState();
