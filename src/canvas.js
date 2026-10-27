import { state } from './state.js';
import { TECH_ICONS } from './icons.js';

export class CanvasEngine {
  constructor(containerEl, minimapEl) {
    this.container = containerEl;
    this.minimap = minimapEl;
    this.wrapper = containerEl.querySelector('.canvas-viewport-wrapper');
    this.svgEdges = containerEl.querySelector('#svg-edges');
    this.svgPackets = containerEl.querySelector('#svg-packets');
    this.svgPreview = containerEl.querySelector('#svg-preview');
    this.sectionsContainer = containerEl.querySelector('#canvas-sections');
    this.nodesContainer = containerEl.querySelector('#canvas-nodes');
    this.floatingBar = containerEl.querySelector('#floating-node-bar');

    this.dragTarget = null;
    this.dragType = null; // 'node' | 'section' | 'pan' | 'connect'
    this.dragOffset = { x: 0, y: 0 };
    this.connectStartNode = null;
    this.mouseWorldPos = { x: 0, y: 0 };

    this.initEvents();
    this.render();

    // Subscribe to state updates
    state.subscribe((event) => {
      this.render();
      this.updateMinimap();
    });
  }

  screenToWorld(clientX, clientY) {
    const rect = this.container.getBoundingClientRect();
    const x = (clientX - rect.left - state.viewport.panX) / state.viewport.zoom;
    const y = (clientY - rect.top - state.viewport.panY) / state.viewport.zoom;
    return { x, y };
  }

  initEvents() {
    // Zoom with wheel
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const newZoom = Math.min(Math.max(state.viewport.zoom * zoomFactor, 0.25), 3.0);
      
      const mouse = this.screenToWorld(e.clientX, e.clientY);
      const rect = this.container.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      state.viewport.panX = screenX - mouse.x * newZoom;
      state.viewport.panY = screenY - mouse.y * newZoom;
      state.viewport.zoom = newZoom;
      state.notify('viewport_change');
      this.applyTransform();
    }, { passive: false });

    // Pointer Down (Pan / Select)
    this.container.addEventListener('pointerdown', (e) => {
      if (e.target.closest('#floating-node-bar') || e.target.closest('.canvas-floating-controls')) return;

      const world = this.screenToWorld(e.clientX, e.clientY);
      this.mouseWorldPos = world;

      // Check port handle click
      const port = e.target.closest('.node-port');
      if (port) {
        e.stopPropagation();
        const nodeId = port.dataset.nodeId;
        this.dragType = 'connect';
        this.connectStartNode = nodeId;
        return;
      }

      // Check node click
      const nodeEl = e.target.closest('.canvas-node');
      if (nodeEl) {
        e.stopPropagation();
        const nodeId = nodeEl.dataset.id;
        state.select('node', nodeId);
        const node = state.diagram.nodes.find(n => n.id === nodeId);
        this.dragTarget = node;
        this.dragType = 'node';
        this.dragOffset = { x: world.x - node.x, y: world.y - node.y };
        return;
      }

      // Check section click
      const secEl = e.target.closest('.canvas-section-header');
      if (secEl) {
        e.stopPropagation();
        const secId = secEl.parentElement.dataset.id;
        state.select('section', secId);
        const sec = state.diagram.sections.find(s => s.id === secId);
        this.dragTarget = sec;
        this.dragType = 'section';
        this.dragOffset = { x: world.x - sec.x, y: world.y - sec.y };
        return;
      }

      // Check edge click
      const edgeEl = e.target.closest('.canvas-edge-group');
      if (edgeEl) {
        e.stopPropagation();
        state.select('edge', edgeEl.dataset.id);
        return;
      }

      // Clicked on empty canvas -> pan
      state.clearSelection();
      this.dragType = 'pan';
      this.dragOffset = { x: e.clientX - state.viewport.panX, y: e.clientY - state.viewport.panY };
    });

    // Pointer Move
    window.addEventListener('pointermove', (e) => {
      const world = this.screenToWorld(e.clientX, e.clientY);
      this.mouseWorldPos = world;

      if (this.dragType === 'node' && this.dragTarget) {
        this.dragTarget.x = Math.round(world.x - this.dragOffset.x);
        this.dragTarget.y = Math.round(world.y - this.dragOffset.y);
        this.render();
      } else if (this.dragType === 'section' && this.dragTarget) {
        const dx = Math.round(world.x - this.dragOffset.x) - this.dragTarget.x;
        const dy = Math.round(world.y - this.dragOffset.y) - this.dragTarget.y;
        this.dragTarget.x += dx;
        this.dragTarget.y += dy;
        // Also move child nodes inside this section
        state.diagram.nodes.forEach(n => {
          if (n.sectionId === this.dragTarget.id) {
            n.x += dx;
            n.y += dy;
          }
        });
        this.render();
      } else if (this.dragType === 'pan') {
        state.viewport.panX = e.clientX - this.dragOffset.x;
        state.viewport.panY = e.clientY - this.dragOffset.y;
        this.applyTransform();
        this.updateMinimap();
      } else if (this.dragType === 'connect' && this.connectStartNode) {
        this.renderConnectionPreview(this.connectStartNode, world);
      }
    });

    // Pointer Up
    window.addEventListener('pointerup', (e) => {
      if (this.dragType === 'connect' && this.connectStartNode) {
        const nodeEl = e.target.closest('.canvas-node');
        if (nodeEl) {
          const targetNodeId = nodeEl.dataset.id;
          if (targetNodeId !== this.connectStartNode) {
            state.addEdge(this.connectStartNode, targetNodeId, 'Flow');
          }
        }
        this.svgPreview.innerHTML = '';
      }

      if (this.dragType === 'node' || this.dragType === 'section') {
        state.saveSnapshot();
      }

      this.dragType = null;
      this.dragTarget = null;
      this.connectStartNode = null;
    });

    // Handle drag-and-drop from sidebar into canvas
    this.container.addEventListener('dragover', (e) => e.preventDefault());
    this.container.addEventListener('drop', (e) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData('text/plain');
      if (!raw) return;
      try {
        const data = JSON.parse(raw);
        const world = this.screenToWorld(e.clientX, e.clientY);
        if (data.type === 'section') {
          state.addSection({
            title: data.name || 'New Section',
            x: Math.round(world.x - 110),
            y: Math.round(world.y - 100),
            borderStyle: data.style || 'dashed'
          });
        } else {
          state.addNode({
            label: data.name || 'Service',
            icon: data.iconId || 'nodejs',
            x: Math.round(world.x - 35),
            y: Math.round(world.y - 35)
          });
        }
      } catch (err) {
        console.error('Drop error:', err);
      }
    });
  }

  applyTransform() {
    this.wrapper.style.transform = `translate(${state.viewport.panX}px, ${state.viewport.panY}px) scale(${state.viewport.zoom})`;
    const zoomText = document.querySelector('#canvas-zoom-label');
    if (zoomText) zoomText.textContent = `${Math.round(state.viewport.zoom * 100)}%`;
  }

  renderConnectionPreview(fromNodeId, toWorld) {
    const fromNode = state.diagram.nodes.find(n => n.id === fromNodeId);
    if (!fromNode) return;
    const startX = fromNode.x + fromNode.width;
    const startY = fromNode.y + fromNode.height / 2;
    const d = this.calculateBezier(startX, startY, toWorld.x, toWorld.y);
    this.svgPreview.innerHTML = `
      <path d="${d}" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="4 4" marker-end="url(#arrowhead-preview)"/>
    `;
  }

  calculateBezier(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1);
    const offset = Math.max(dx * 0.5, 40);
    return `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;
  }

  render() {
    this.applyTransform();
    this.renderSections();
    this.renderEdges();
    this.renderNodes();
    this.renderFloatingBar();
  }

  renderSections() {
    this.sectionsContainer.innerHTML = '';
    state.diagram.sections.forEach(sec => {
      const isSelected = state.selected.type === 'section' && state.selected.id === sec.id;
      const el = document.createElement('div');
      el.className = `canvas-section ${isSelected ? 'selected' : ''}`;
      el.dataset.id = sec.id;
      el.style.left = `${sec.x}px`;
      el.style.top = `${sec.y}px`;
      el.style.width = `${sec.width}px`;
      el.style.height = `${sec.height}px`;
      el.style.borderColor = sec.border || '#94a3b8';
      el.style.borderStyle = sec.borderStyle || 'dashed';
      el.style.backgroundColor = sec.transparent ? 'transparent' : (sec.fill || '#f8fafc');

      el.innerHTML = `
        <div class="canvas-section-header">
          <span class="sec-title">${sec.title}</span>
          ${sec.subtitle ? `<span class="sec-subtitle">${sec.subtitle}</span>` : ''}
        </div>
      `;
      this.sectionsContainer.appendChild(el);
    });
  }

  renderEdges() {
    this.svgEdges.innerHTML = `
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#64748b"/>
        </marker>
        <marker id="arrowhead-selected" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#2563eb"/>
        </marker>
        <marker id="arrowhead-preview" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#3b82f6"/>
        </marker>
      </defs>
    `;

    state.diagram.edges.forEach(edge => {
      const fromNode = state.diagram.nodes.find(n => n.id === edge.from);
      const toNode = state.diagram.nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const isSelected = state.selected.type === 'edge' && state.selected.id === edge.id;
      const x1 = fromNode.x + fromNode.width;
      const y1 = fromNode.y + fromNode.height / 2;
      const x2 = toNode.x;
      const y2 = toNode.y + toNode.height / 2;

      const d = this.calculateBezier(x1, y1, x2, y2);
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', `canvas-edge-group ${isSelected ? 'selected' : ''}`);
      g.setAttribute('data-id', edge.id);

      g.innerHTML = `
        <path d="${d}" class="edge-hitbox" stroke="transparent" stroke-width="16" fill="none"/>
        <path d="${d}" class="edge-line" stroke="${isSelected ? '#2563eb' : (edge.stroke || '#64748b')}" 
          stroke-width="${isSelected ? 3 : 2}" fill="none" 
          marker-end="${isSelected ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'}"/>
        ${edge.label ? `
          <g class="edge-badge-group" transform="translate(${midX}, ${midY})">
            <rect x="-35" y="-12" width="70" height="24" rx="12" fill="#ffffff" stroke="${isSelected ? '#2563eb' : '#cbd5e1'}" stroke-width="1.5"/>
            <text x="0" y="4" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="#334155">${edge.label}</text>
          </g>
        ` : ''}
      `;
      this.svgEdges.appendChild(g);
    });
  }

  renderNodes() {
    this.nodesContainer.innerHTML = '';
    state.diagram.nodes.forEach(node => {
      const isSelected = state.selected.type === 'node' && state.selected.id === node.id;
      const iconDef = TECH_ICONS[node.icon] || TECH_ICONS.nodejs;
      const el = document.createElement('div');
      el.className = `canvas-node ${isSelected ? 'selected' : ''} ${node.animation || ''}`;
      el.dataset.id = node.id;
      el.style.left = `${node.x}px`;
      el.style.top = `${node.y}px`;
      el.style.width = `${node.width}px`;
      el.style.height = `${node.height}px`;

      el.innerHTML = `
        <div class="node-inner" style="background:${node.fill || '#ffffff'}; border-color:${node.border || '#e2e8f0'};">
          <div class="node-icon">${iconDef.svg}</div>
          <div class="node-label">${node.label}</div>
          ${node.subtitle ? `<div class="node-subtitle">${node.subtitle}</div>` : ''}
        </div>
        <!-- Connection Ports -->
        <div class="node-port port-right" data-node-id="${node.id}" title="Drag to connect"></div>
        <div class="node-port port-left" data-node-id="${node.id}" title="Drag to connect"></div>
        <div class="node-port port-top" data-node-id="${node.id}" title="Drag to connect"></div>
        <div class="node-port port-bottom" data-node-id="${node.id}" title="Drag to connect"></div>
      `;
      this.nodesContainer.appendChild(el);
    });
  }

  renderFloatingBar() {
    if (!this.floatingBar) return;
    if (state.selected.type === 'node') {
      const node = state.diagram.nodes.find(n => n.id === state.selected.id);
      if (node) {
        this.floatingBar.style.display = 'flex';
        this.floatingBar.style.left = `${node.x * state.viewport.zoom + state.viewport.panX}px`;
        this.floatingBar.style.top = `${(node.y - 44) * state.viewport.zoom + state.viewport.panY}px`;
        
        const labelInput = this.floatingBar.querySelector('.float-label');
        if (labelInput && document.activeElement !== labelInput) {
          labelInput.value = node.label;
        }
        return;
      }
    }
    this.floatingBar.style.display = 'none';
  }

  updateMinimap() {
    if (!this.minimap) return;
    const canvas = this.minimap.querySelector('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Bounding calculation
    const scale = 0.08;
    ctx.fillStyle = '#e2e8f0';
    state.diagram.sections.forEach(s => {
      ctx.fillRect(s.x * scale + 10, s.y * scale + 10, s.width * scale, s.height * scale);
    });

    ctx.fillStyle = '#3b82f6';
    state.diagram.nodes.forEach(n => {
      ctx.fillRect(n.x * scale + 10, n.y * scale + 10, n.width * scale, n.height * scale);
    });
  }

  fitToScreen() {
    if (state.diagram.nodes.length === 0) {
      state.centerViewport();
      return;
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    state.diagram.nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + n.width);
      maxY = Math.max(maxY, n.y + n.height);
    });
    state.diagram.sections.forEach(s => {
      minX = Math.min(minX, s.x);
      minY = Math.min(minY, s.y);
      maxX = Math.max(maxX, s.x + s.width);
      maxY = Math.max(maxY, s.y + s.height);
    });

    const padding = 100;
    const rect = this.container.getBoundingClientRect();
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
    const zoomX = rect.width / width;
    const zoomY = rect.height / height;
    const zoom = Math.min(Math.max(Math.min(zoomX, zoomY), 0.5), 1.4);

    state.viewport.zoom = zoom;
    state.viewport.panX = (rect.width - (maxX + minX) * zoom) / 2;
    state.viewport.panY = (rect.height - (maxY + minY) * zoom) / 2;
    state.notify('viewport_change');
    this.render();
  }
}
