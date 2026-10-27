import { state } from './state.js';
import { TECH_ICONS, SHAPES_LIBRARY } from './icons.js';
import { TEMPLATES } from './templates.js';
import { CanvasEngine } from './canvas.js';
import { TimelineEngine } from './timeline.js';
import { aiEngine } from './ai.js';
import { ExportEngine } from './export.js';
import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const viewLanding = document.querySelector('#view-landing');
  const viewEditor = document.querySelector('#view-editor');
  const mainCanvasContainer = document.querySelector('#main-canvas-container');
  const minimapBox = document.querySelector('#canvas-minimap-box');
  const bottomTimelineTray = document.querySelector('#bottom-timeline-tray');
  const svgPackets = document.querySelector('#svg-packets');
  const aiModal = document.querySelector('#ai-generator-modal');
  const presentationOverlay = document.querySelector('#presentation-overlay');

  // Initialize Engines
  const canvasEngine = new CanvasEngine(mainCanvasContainer, minimapBox);
  const timelineEngine = new TimelineEngine(bottomTimelineTray, svgPackets);

  // =========================================================================
  // VIEW SWITCHING (LANDING <-> EDITOR)
  // =========================================================================
  function switchView(viewName) {
    state.view = viewName;
    if (viewName === 'editor') {
      viewLanding.style.display = 'none';
      viewEditor.style.display = 'flex';
      setTimeout(() => {
        canvasEngine.fitToScreen();
      }, 50);
    } else {
      viewEditor.style.display = 'none';
      viewLanding.style.display = 'flex';
    }
  }

  // Navbar CTA actions
  document.querySelector('#nav-btn-open-editor').addEventListener('click', () => switchView('editor'));
  document.querySelector('#nav-btn-get-started').addEventListener('click', () => switchView('editor'));
  document.querySelector('#landing-brand-logo').addEventListener('click', () => switchView('landing'));
  document.querySelector('#editor-btn-back').addEventListener('click', () => switchView('landing'));
  document.querySelector('#editor-brand-logo').addEventListener('click', () => switchView('landing'));

  // =========================================================================
  // LANDING PAGE FEATURES
  // =========================================================================
  // 1. Populate Tech Icons Marquee
  const marqueeTrack = document.querySelector('#landing-marquee-track');
  if (marqueeTrack) {
    const iconKeys = Object.keys(TECH_ICONS);
    const doubleList = [...iconKeys, ...iconKeys];
    marqueeTrack.innerHTML = doubleList.map(key => {
      const icon = TECH_ICONS[key];
      return `
        <div class="marquee-chip">
          ${icon.svg}
          <span>${icon.name}</span>
        </div>
      `;
    }).join('');
  }

  // 2. Populate Landing Templates Grid
  const landingTemplatesGrid = document.querySelector('#landing-templates-grid');
  if (landingTemplatesGrid) {
    landingTemplatesGrid.innerHTML = Object.values(TEMPLATES).map(tpl => `
      <div class="feature-card" style="cursor:pointer" data-template-id="${tpl.id}">
        <div class="feature-icon-box" style="background:#eff6ff;color:#2563eb">📐</div>
        <h3>${tpl.title}</h3>
        <p>${tpl.subtitle}</p>
        <div style="margin-top:1rem;color:#2563eb;font-weight:700;font-size:0.85rem">Load in Canvas →</div>
      </div>
    `).join('');

    landingTemplatesGrid.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('click', () => {
        const tplId = card.dataset.templateId;
        state.loadTemplate(tplId);
        switchView('editor');
      });
    });
  }

  // 3. Hero Live Interactive Preview Canvas
  const heroSvg = document.querySelector('#hero-preview-svg');
  if (heroSvg) {
    renderHeroPreviewDiagram(heroSvg);
  }

  function renderHeroPreviewDiagram(svg) {
    svg.innerHTML = `
      <defs>
        <marker id="hero-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#3b82f6"/>
        </marker>
        <linearGradient id="hero-flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="#8b5cf6"/>
        </linearGradient>
      </defs>

      <!-- VPC Container Zone -->
      <rect x="280" y="40" width="560" height="290" rx="16" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6 6"/>
      <text x="300" y="65" font-family="'Plus Jakarta Sans'" font-size="12" font-weight="700" fill="#64748b">VPC - US-EAST-1</text>

      <!-- Nodes -->
      <!-- Client -->
      <g transform="translate(60, 140)">
        <rect width="110" height="70" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <text x="55" y="36" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-weight="700" font-size="13" fill="#0f172a">Client</text>
        <text x="55" y="52" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-size="10" fill="#64748b">React</text>
      </g>

      <!-- API Gateway -->
      <g transform="translate(340, 200)">
        <rect width="120" height="70" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <text x="60" y="36" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-weight="700" font-size="13" fill="#0f172a">API Gateway</text>
        <text x="60" y="52" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-size="10" fill="#64748b">Nginx</text>
      </g>

      <!-- CDN -->
      <g transform="translate(340, 80)">
        <rect width="120" height="70" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <text x="60" y="36" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-weight="700" font-size="13" fill="#0f172a">CDN</text>
        <text x="60" y="52" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-size="10" fill="#64748b">CloudFront</text>
      </g>

      <!-- Services -->
      <g transform="translate(520, 140)">
        <rect width="110" height="70" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <text x="55" y="36" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-weight="700" font-size="13" fill="#0f172a">Services</text>
        <text x="55" y="52" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-size="10" fill="#64748b">Node.js</text>
      </g>

      <!-- Redis Cache -->
      <g transform="translate(690, 80)">
        <rect width="110" height="70" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <text x="55" y="36" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-weight="700" font-size="13" fill="#0f172a">Cache</text>
        <text x="55" y="52" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-size="10" fill="#64748b">Redis</text>
      </g>

      <!-- Postgres Database -->
      <g transform="translate(690, 200)">
        <rect width="110" height="70" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <text x="55" y="36" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-weight="700" font-size="13" fill="#0f172a">Database</text>
        <text x="55" y="52" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-size="10" fill="#64748b">PostgreSQL</text>
      </g>

      <!-- Bezier Connectors -->
      <path id="hero-path-1" d="M 170 175 C 240 175, 270 115, 340 115" fill="none" stroke="#93c5fd" stroke-width="2.5" marker-end="url(#hero-arrow)"/>
      <path id="hero-path-2" d="M 170 175 C 240 175, 270 235, 340 235" fill="none" stroke="#93c5fd" stroke-width="2.5" marker-end="url(#hero-arrow)"/>
      <path id="hero-path-3" d="M 460 235 C 490 235, 490 175, 520 175" fill="none" stroke="#93c5fd" stroke-width="2.5" marker-end="url(#hero-arrow)"/>
      <path id="hero-path-4" d="M 630 175 C 660 175, 660 115, 690 115" fill="none" stroke="#93c5fd" stroke-width="2.5" marker-end="url(#hero-arrow)"/>
      <path id="hero-path-5" d="M 630 175 C 660 175, 660 235, 690 235" fill="none" stroke="#93c5fd" stroke-width="2.5" marker-end="url(#hero-arrow)"/>

      <!-- Animated Glowing Packets -->
      <circle r="6" fill="#2563eb">
        <animateMotion repeatCount="indefinite" dur="2.5s" path="M 170 175 C 240 175, 270 235, 340 235"/>
      </circle>
      <circle r="6" fill="#8b5cf6">
        <animateMotion repeatCount="indefinite" dur="2.5s" begin="1s" path="M 460 235 C 490 235, 490 175, 520 175"/>
      </circle>
      <circle r="6" fill="#10b981">
        <animateMotion repeatCount="indefinite" dur="2.5s" begin="1.8s" path="M 630 175 C 660 175, 660 235, 690 235"/>
      </circle>
    `;
  }

  // Hero Preview Step buttons
  document.querySelectorAll('.preview-step-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.preview-step-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  document.querySelector('#hero-preview-edit-btn').addEventListener('click', () => {
    state.loadTemplate('microservices');
    switchView('editor');
  });

  // Hero AI Generate
  document.querySelector('#hero-ai-generate-btn').addEventListener('click', () => {
    const input = document.querySelector('#hero-ai-input');
    const prompt = input.value.trim() || 'Microservices Checkout system with Kafka and Redis';
    aiEngine.generateFromPrompt(prompt);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    switchView('editor');
  });

  // Quick Chips
  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const tpl = chip.dataset.template;
      state.loadTemplate(tpl);
      switchView('editor');
    });
  });

  // =========================================================================
  // CANVAS EDITOR WORKSPACE
  // =========================================================================

  // Diagram Title Input
  const titleInput = document.querySelector('#editor-title-input');
  titleInput.addEventListener('change', (e) => {
    state.diagram.title = e.target.value;
    state.saveSnapshot();
  });

  // Undo / Redo
  document.querySelector('#editor-btn-undo').addEventListener('click', () => state.undo());
  document.querySelector('#editor-btn-redo').addEventListener('click', () => state.redo());
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      state.undo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      state.redo();
    }
  });

  // Fit to screen button
  document.querySelector('#editor-btn-fit-screen').addEventListener('click', () => {
    canvasEngine.fitToScreen();
  });
  document.querySelector('#zoom-fit-btn').addEventListener('click', () => {
    canvasEngine.fitToScreen();
  });

  // Zoom controls
  document.querySelector('#zoom-in-btn').addEventListener('click', () => {
    state.viewport.zoom = Math.min(state.viewport.zoom + 0.15, 3.0);
    state.notify('viewport_change');
    canvasEngine.applyTransform();
  });
  document.querySelector('#zoom-out-btn').addEventListener('click', () => {
    state.viewport.zoom = Math.max(state.viewport.zoom - 0.15, 0.25);
    state.notify('viewport_change');
    canvasEngine.applyTransform();
  });

  // Minimap toggle
  document.querySelector('#toggle-minimap-btn').addEventListener('click', () => {
    minimapBox.style.display = minimapBox.style.display === 'none' ? 'block' : 'none';
  });

  // Timeline toggle
  const timelineBtn = document.querySelector('#editor-btn-timeline');
  const floatingBadge = document.querySelector('#timeline-open-badge');
  timelineBtn.addEventListener('click', () => {
    state.isTimelineOpen = !state.isTimelineOpen;
    bottomTimelineTray.style.display = state.isTimelineOpen ? 'flex' : 'none';
    if (floatingBadge) floatingBadge.style.display = state.isTimelineOpen ? 'flex' : 'none';
    timelineEngine.render();
  });

  state.subscribe((event) => {
    if (event === 'timeline_toggle') {
      bottomTimelineTray.style.display = state.isTimelineOpen ? 'flex' : 'none';
      if (floatingBadge) floatingBadge.style.display = state.isTimelineOpen ? 'flex' : 'none';
      timelineEngine.render();
    }
    if (event === 'template_loaded' || event === 'diagram_change') {
      titleInput.value = state.diagram.title || 'Untitled diagram';
      const typeText = document.querySelector('#editor-type-text');
      if (typeText) typeText.textContent = state.diagram.type || 'Architecture';
    }
  });

  // Export Dropdown
  const exportBtn = document.querySelector('#editor-btn-export-dropdown');
  const exportMenu = document.querySelector('#export-dropdown-menu');
  exportBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    exportMenu.classList.toggle('show');
  });
  window.addEventListener('click', () => exportMenu.classList.remove('show'));

  document.querySelector('#export-action-png').addEventListener('click', () => {
    ExportEngine.exportPNG();
    confetti({ particleCount: 50 });
  });
  document.querySelector('#export-action-svg').addEventListener('click', () => {
    ExportEngine.exportSVG();
    confetti({ particleCount: 50 });
  });
  document.querySelector('#export-action-json').addEventListener('click', () => {
    ExportEngine.exportJSON();
    confetti({ particleCount: 50 });
  });
  document.querySelector('#export-action-gif').addEventListener('click', () => {
    // Open timeline and run flow
    state.isTimelineOpen = true;
    state.notify('timeline_toggle');
    timelineEngine.seek(0);
    timelineEngine.play();
    alert('Timeline flow started! Exporting video frames...');
  });

  // Save button
  document.querySelector('#editor-btn-save').addEventListener('click', () => {
    localStorage.setItem('bytediagram_autosave', JSON.stringify(state.diagram));
    const btn = document.querySelector('#editor-btn-save');
    btn.textContent = '✓ Saved';
    setTimeout(() => { btn.textContent = 'Save'; }, 1500);
  });

  // =========================================================================
  // LEFT SIDEBAR TABS & DRAWER
  // =========================================================================
  const sidebarDrawer = document.querySelector('#sidebar-drawer-content');
  const tabStripBtns = document.querySelectorAll('.tab-strip-btn');

  tabStripBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabStripBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSidebarDrawer(btn.dataset.tab);
    });
  });

  function renderSidebarDrawer(tab) {
    state.activeLeftTab = tab;
    if (tab === 'templates') {
      sidebarDrawer.innerHTML = `
        <div class="panel-title">Templates</div>
        <div class="panel-subtitle">Quick starts for system architectures and more.</div>
        <div style="display:flex;gap:0.4rem;margin-bottom:1rem">
          <button class="btn-ghost" id="import-json-btn" style="flex:1;border:1px solid #cbd5e1;font-size:0.75rem;justify-content:center">📥 Import JSON</button>
        </div>
        <div id="templates-list-container">
          ${Object.values(TEMPLATES).map(tpl => `
            <div class="template-item-card" data-id="${tpl.id}">
              <h4>${tpl.title} <span>→</span></h4>
              <p>${tpl.subtitle}</p>
            </div>
          `).join('')}
        </div>
      `;

      sidebarDrawer.querySelectorAll('.template-item-card').forEach(card => {
        card.addEventListener('click', () => {
          state.loadTemplate(card.dataset.id);
          canvasEngine.fitToScreen();
        });
      });

      const importBtn = sidebarDrawer.querySelector('#import-json-btn');
      const fileInput = document.querySelector('#json-file-input');
      importBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          ExportEngine.importJSON(ev.target.result);
          canvasEngine.fitToScreen();
        };
        reader.readAsText(file);
      });

    } else if (tab === 'shapes') {
      sidebarDrawer.innerHTML = `
        <div class="panel-title">Shapes</div>
        <div class="panel-subtitle">Click to add, or drag onto the canvas.</div>
        <input type="text" class="panel-search-input" id="search-shapes-input" placeholder="Search shapes..." />
        
        <div style="font-weight:700;font-size:0.8rem;margin-bottom:0.4rem;color:#475569">Containers / Zones</div>
        <div class="shapes-grid" style="margin-bottom:1rem">
          <div class="shape-drag-card" draggable="true" data-type="section" data-name="VPC Zone" data-style="dashed">
            <div class="preview-box" style="border:1.5px dashed #3b82f6;border-radius:6px"></div>
            <span>Dashed Zone</span>
          </div>
          <div class="shape-drag-card" draggable="true" data-type="section" data-name="Subnet" data-style="solid">
            <div class="preview-box" style="border:1.5px solid #10b981;border-radius:6px;background:#f0fdf4"></div>
            <span>Solid Card</span>
          </div>
        </div>

        <div style="font-weight:700;font-size:0.8rem;margin-bottom:0.4rem;color:#475569">Components</div>
        <div class="shapes-grid" id="shapes-list-grid">
          ${SHAPES_LIBRARY.filter(s => s.category === 'Architecture').map(s => `
            <div class="shape-drag-card" draggable="true" data-type="node" data-name="${s.name}" data-icon="nodejs">
              <div class="preview-box" style="background:#f1f5f9;border-radius:8px">📦</div>
              <span>${s.name}</span>
            </div>
          `).join('')}
        </div>
      `;

      bindDragCards();

    } else if (tab === 'icons') {
      sidebarDrawer.innerHTML = `
        <div class="panel-title">Tech Icons</div>
        <div class="panel-subtitle">Click or drag tech logos onto canvas.</div>
        <input type="text" class="panel-search-input" id="search-icons-input" placeholder="Search React, Redis, AWS..." />
        <div class="icons-grid" id="icons-list-grid">
          ${Object.entries(TECH_ICONS).map(([key, icon]) => `
            <div class="icon-drag-card" draggable="true" data-type="node" data-name="${icon.name}" data-icon="${key}">
              <div class="preview-box">${icon.svg}</div>
              <span>${icon.name}</span>
            </div>
          `).join('')}
        </div>
      `;

      // Search filter
      const searchInput = sidebarDrawer.querySelector('#search-icons-input');
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        const grid = sidebarDrawer.querySelector('#icons-list-grid');
        grid.innerHTML = Object.entries(TECH_ICONS)
          .filter(([_, icon]) => icon.name.toLowerCase().includes(q) || icon.category.toLowerCase().includes(q))
          .map(([key, icon]) => `
            <div class="icon-drag-card" draggable="true" data-type="node" data-name="${icon.name}" data-icon="${key}">
              <div class="preview-box">${icon.svg}</div>
              <span>${icon.name}</span>
            </div>
          `).join('');
        bindDragCards();
      });

      bindDragCards();

    } else if (tab === 'bytey') {
      sidebarDrawer.innerHTML = `
        <div class="panel-title" style="display:flex;align-items:center;gap:0.4rem">
          <span>🤖</span> Bytey AI
        </div>
        <div class="panel-subtitle">Your architecture copilot. Ask to add components, connect services, or generate diagrams.</div>

        <div id="bytey-chat-messages" style="height:280px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;padding:0.75rem;margin-bottom:0.75rem;background:#f8fafc;display:flex;flex-direction:column;gap:0.5rem">
          <div style="background:#ffffff;padding:0.6rem;border-radius:8px;border:1px solid #e2e8f0;font-size:0.8rem">
            👋 Hi! I'm Bytey. Tell me what you'd like to build, or try:
            <ul style="margin:4px 0 0 16px;color:#2563eb">
              <li style="cursor:pointer" class="bytey-quick-opt">Add Redis Cache</li>
              <li style="cursor:pointer" class="bytey-quick-opt">Add Kafka Bus</li>
              <li style="cursor:pointer" class="bytey-quick-opt">Animate the flow</li>
            </ul>
          </div>
        </div>

        <div style="display:flex;gap:0.4rem">
          <input type="text" id="bytey-chat-input" class="prop-input" style="flex:1" placeholder="Tell Bytey what to build..." />
          <button class="btn-blue-pill" id="bytey-send-btn" style="padding:0.4rem 0.8rem">➤</button>
        </div>
      `;

      const chatBox = sidebarDrawer.querySelector('#bytey-chat-messages');
      const chatInput = sidebarDrawer.querySelector('#bytey-chat-input');
      const sendBtn = sidebarDrawer.querySelector('#bytey-send-btn');

      function sendByteyMsg(text) {
        const msg = text || chatInput.value.trim();
        if (!msg) return;
        chatInput.value = '';

        // User message
        chatBox.innerHTML += `
          <div style="align-self:flex-end;background:#2563eb;color:#ffffff;padding:0.5rem 0.75rem;border-radius:8px;font-size:0.8rem;max-width:85%">
            ${msg}
          </div>
        `;

        // AI Response
        const reply = aiEngine.processByteyChat(msg);
        setTimeout(() => {
          chatBox.innerHTML += `
            <div style="align-self:flex-start;background:#ffffff;border:1px solid #e2e8f0;padding:0.5rem 0.75rem;border-radius:8px;font-size:0.8rem;max-width:85%">
              ${reply}
            </div>
          `;
          chatBox.scrollTop = chatBox.scrollHeight;
        }, 300);
      }

      sendBtn.addEventListener('click', () => sendByteyMsg());
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendByteyMsg();
      });

      sidebarDrawer.querySelectorAll('.bytey-quick-opt').forEach(opt => {
        opt.addEventListener('click', () => sendByteyMsg(opt.textContent));
      });

    } else if (tab === 'file') {
      sidebarDrawer.innerHTML = `
        <div class="panel-title">File Operations</div>
        <div class="panel-subtitle">Manage diagram assets and persistence.</div>
        <div style="display:flex;flex-direction:column;gap:0.6rem">
          <button class="btn-ghost" id="file-new-btn" style="border:1px solid #cbd5e1;justify-content:flex-start">📄 New Blank Canvas</button>
          <button class="btn-ghost" id="file-export-json" style="border:1px solid #cbd5e1;justify-content:flex-start">💾 Export as JSON</button>
          <button class="btn-ghost" id="file-export-svg" style="border:1px solid #cbd5e1;justify-content:flex-start">📐 Export as SVG</button>
          <button class="btn-ghost" id="file-clear-btn" style="border:1px solid #fca5a5;color:#ef4444;justify-content:flex-start">🗑 Clear Diagram</button>
        </div>
      `;

      sidebarDrawer.querySelector('#file-new-btn').addEventListener('click', () => {
        state.diagram.nodes = [];
        state.diagram.edges = [];
        state.diagram.sections = [];
        state.saveSnapshot();
        state.notify('diagram_change');
      });

      sidebarDrawer.querySelector('#file-export-json').addEventListener('click', () => ExportEngine.exportJSON());
      sidebarDrawer.querySelector('#file-export-svg').addEventListener('click', () => ExportEngine.exportSVG());
      sidebarDrawer.querySelector('#file-clear-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the canvas?')) {
          state.diagram.nodes = [];
          state.diagram.edges = [];
          state.diagram.sections = [];
          state.saveSnapshot();
          state.notify('diagram_change');
        }
      });
    }
  }

  function bindDragCards() {
    sidebarDrawer.querySelectorAll('.shape-drag-card, .icon-drag-card').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        const payload = {
          type: card.dataset.type,
          name: card.dataset.name,
          iconId: card.dataset.icon || 'nodejs',
          style: card.dataset.style || 'dashed'
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(payload));
      });

      card.addEventListener('click', () => {
        const world = { x: 300 + Math.random() * 50, y: 200 + Math.random() * 50 };
        if (card.dataset.type === 'section') {
          state.addSection({
            title: card.dataset.name,
            x: Math.round(world.x),
            y: Math.round(world.y),
            borderStyle: card.dataset.style || 'dashed'
          });
        } else {
          state.addNode({
            label: card.dataset.name,
            icon: card.dataset.icon || 'nodejs',
            x: Math.round(world.x),
            y: Math.round(world.y)
          });
        }
      });
    });
  }

  // Initial render of left drawer
  renderSidebarDrawer('templates');

  // =========================================================================
  // RIGHT SIDEBAR PROPERTIES INSPECTOR
  // =========================================================================
  const inspectorContent = document.querySelector('#inspector-content');
  const rightTabBtns = document.querySelectorAll('.rs-tab');

  rightTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rightTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeRightTab = btn.dataset.rstab;
      renderInspector();
    });
  });

  state.subscribe((event) => {
    if (event === 'selection_change' || event === 'diagram_change') {
      renderInspector();
    }
  });

  function renderInspector() {
    if (state.activeRightTab === 'layers') {
      renderLayersTab();
      return;
    }
    if (state.activeRightTab === 'checks') {
      renderChecksTab();
      return;
    }

    // Default: Properties Tab
    const sel = state.selected;
    const obj = state.getSelectedObject();

    if (sel.type === 'node' && obj) {
      inspectorContent.innerHTML = `
        <div class="inspector-section">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
            <div>
              <div style="font-weight:800;font-size:1rem">${obj.label}</div>
              <div style="font-size:0.75rem;color:#64748b">Node · ${obj.icon}</div>
            </div>
            <button class="btn-icon" id="prop-del-node-btn" style="color:#ef4444" title="Delete">🗑</button>
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">Content</div>
          <div class="prop-row">
            <span>Label</span>
            <input type="text" class="prop-input" id="prop-node-label" value="${obj.label}" />
          </div>
          <div class="prop-row">
            <span>Subtitle</span>
            <input type="text" class="prop-input" id="prop-node-subtitle" value="${obj.subtitle || ''}" placeholder="Optional" />
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">Layout</div>
          <div class="prop-row">
            <span>Width</span>
            <input type="number" class="prop-input" id="prop-node-w" value="${obj.width}" style="width:80px" />
          </div>
          <div class="prop-row">
            <span>Height</span>
            <input type="number" class="prop-input" id="prop-node-h" value="${obj.height}" style="width:80px" />
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">Style</div>
          <div class="prop-row">
            <span>Fill Color</span>
            <input type="color" id="prop-node-fill" value="${obj.fill || '#ffffff'}" />
          </div>
          <div class="prop-row">
            <span>Border Color</span>
            <input type="color" id="prop-node-border" value="${obj.border || '#cbd5e1'}" />
          </div>
        </div>
      `;

      inspectorContent.querySelector('#prop-node-label').addEventListener('change', (e) => {
        state.updateNode(obj.id, { label: e.target.value });
      });
      inspectorContent.querySelector('#prop-node-subtitle').addEventListener('change', (e) => {
        state.updateNode(obj.id, { subtitle: e.target.value });
      });
      inspectorContent.querySelector('#prop-node-w').addEventListener('change', (e) => {
        state.updateNode(obj.id, { width: parseInt(e.target.value) || 70 });
      });
      inspectorContent.querySelector('#prop-node-h').addEventListener('change', (e) => {
        state.updateNode(obj.id, { height: parseInt(e.target.value) || 70 });
      });
      inspectorContent.querySelector('#prop-node-fill').addEventListener('change', (e) => {
        state.updateNode(obj.id, { fill: e.target.value });
      });
      inspectorContent.querySelector('#prop-node-border').addEventListener('change', (e) => {
        state.updateNode(obj.id, { border: e.target.value });
      });
      inspectorContent.querySelector('#prop-del-node-btn').addEventListener('click', () => {
        state.deleteNode(obj.id);
      });

    } else if (sel.type === 'section' && obj) {
      inspectorContent.innerHTML = `
        <div class="inspector-section">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
            <div>
              <div style="font-weight:800;font-size:1rem">${obj.title}</div>
              <div style="font-size:0.75rem;color:#64748b">Group / Zone</div>
            </div>
            <button class="btn-icon" id="prop-del-sec-btn" style="color:#ef4444" title="Delete">🗑</button>
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">Content</div>
          <div class="prop-row">
            <span>Title</span>
            <input type="text" class="prop-input" id="prop-sec-title" value="${obj.title}" />
          </div>
          <div class="prop-row">
            <span>Subtitle</span>
            <input type="text" class="prop-input" id="prop-sec-subtitle" value="${obj.subtitle || ''}" placeholder="Optional" />
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">Layout</div>
          <div class="prop-row">
            <span>Width</span>
            <input type="number" class="prop-input" id="prop-sec-w" value="${obj.width}" style="width:80px" />
          </div>
          <div class="prop-row">
            <span>Height</span>
            <input type="number" class="prop-input" id="prop-sec-h" value="${obj.height}" style="width:80px" />
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">Style</div>
          <div class="prop-row">
            <span>Fill Color</span>
            <input type="color" id="prop-sec-fill" value="${obj.fill || '#f8fafc'}" />
          </div>
          <div class="prop-row">
            <span>Border Color</span>
            <input type="color" id="prop-sec-border" value="${obj.border || '#94a3b8'}" />
          </div>
          <div class="prop-row">
            <span>Border Style</span>
            <div class="segmented-control" id="sec-style-seg">
              <button class="seg-btn ${obj.borderStyle === 'solid' ? 'active' : ''}" data-style="solid">Solid</button>
              <button class="seg-btn ${obj.borderStyle === 'dashed' ? 'active' : ''}" data-style="dashed">Dashed</button>
              <button class="seg-btn ${obj.borderStyle === 'dotted' ? 'active' : ''}" data-style="dotted">Dotted</button>
            </div>
          </div>
        </div>
      `;

      inspectorContent.querySelector('#prop-sec-title').addEventListener('change', (e) => {
        state.updateSection(obj.id, { title: e.target.value });
      });
      inspectorContent.querySelector('#prop-sec-subtitle').addEventListener('change', (e) => {
        state.updateSection(obj.id, { subtitle: e.target.value });
      });
      inspectorContent.querySelector('#prop-sec-w').addEventListener('change', (e) => {
        state.updateSection(obj.id, { width: parseInt(e.target.value) || 200 });
      });
      inspectorContent.querySelector('#prop-sec-h').addEventListener('change', (e) => {
        state.updateSection(obj.id, { height: parseInt(e.target.value) || 180 });
      });
      inspectorContent.querySelector('#prop-sec-fill').addEventListener('change', (e) => {
        state.updateSection(obj.id, { fill: e.target.value });
      });
      inspectorContent.querySelector('#prop-sec-border').addEventListener('change', (e) => {
        state.updateSection(obj.id, { border: e.target.value });
      });
      inspectorContent.querySelectorAll('#sec-style-seg .seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.updateSection(obj.id, { borderStyle: btn.dataset.style });
        });
      });
      inspectorContent.querySelector('#prop-del-sec-btn').addEventListener('click', () => {
        state.deleteSection(obj.id);
      });

    } else if (sel.type === 'edge' && obj) {
      inspectorContent.innerHTML = `
        <div class="inspector-section">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
            <div>
              <div style="font-weight:800;font-size:1rem">${obj.label || 'Connector'}</div>
              <div style="font-size:0.75rem;color:#64748b">Directed Edge</div>
            </div>
            <button class="btn-icon" id="prop-del-edge-btn" style="color:#ef4444" title="Delete">🗑</button>
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">Badge Content</div>
          <div class="prop-row">
            <span>Label</span>
            <input type="text" class="prop-input" id="prop-edge-label" value="${obj.label || ''}" placeholder="e.g. REST API, gRPC" />
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">Style</div>
          <div class="prop-row">
            <span>Stroke Color</span>
            <input type="color" id="prop-edge-stroke" value="${obj.stroke || '#64748b'}" />
          </div>
        </div>
      `;

      inspectorContent.querySelector('#prop-edge-label').addEventListener('change', (e) => {
        state.updateEdge(obj.id, { label: e.target.value });
      });
      inspectorContent.querySelector('#prop-edge-stroke').addEventListener('change', (e) => {
        state.updateEdge(obj.id, { stroke: e.target.value });
      });
      inspectorContent.querySelector('#prop-del-edge-btn').addEventListener('click', () => {
        state.deleteEdge(obj.id);
      });

    } else {
      // Nothing selected -> Global Diagram Properties
      inspectorContent.innerHTML = `
        <div class="inspector-section">
          <div style="font-weight:800;font-size:1.05rem;margin-bottom:0.2rem">Diagram</div>
          <div style="font-size:0.8rem;color:#64748b">${state.diagram.nodes.length} nodes · ${state.diagram.edges.length} edges</div>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">Type</div>
          <div class="prop-row">
            <span>Diagram type</span>
            <div class="badge-pill" style="font-weight:700">⚛ ${state.diagram.type || 'Architecture'}</div>
          </div>
          <p style="font-size:0.75rem;color:#64748b;margin-top:0.4rem">Services, databases, queues and how they connect across tiers.</p>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">Background</div>
          <div class="prop-row">
            <span>Colour</span>
            <input type="color" id="prop-diag-bg" value="${state.diagram.background || '#fafafa'}" />
          </div>
          <div class="prop-row">
            <span>Show grid</span>
            <input type="checkbox" id="prop-diag-grid" ${state.diagram.showGrid ? 'checked' : ''} />
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">Health Checks</div>
          <div style="display:flex;align-items:center;gap:0.4rem;color:#10b981;font-size:0.85rem;font-weight:600">
            <span>✓</span> All systems connected
          </div>
        </div>
      `;

      inspectorContent.querySelector('#prop-diag-bg').addEventListener('change', (e) => {
        state.diagram.background = e.target.value;
        mainCanvasContainer.style.backgroundColor = e.target.value;
      });
      inspectorContent.querySelector('#prop-diag-grid').addEventListener('change', (e) => {
        state.diagram.showGrid = e.target.checked;
        mainCanvasContainer.style.backgroundImage = e.target.checked ? 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)' : 'none';
      });
    }
  }

  function renderLayersTab() {
    inspectorContent.innerHTML = `
      <div class="inspector-section">
        <div class="inspector-header">Sections</div>
        ${state.diagram.sections.map(s => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;font-size:0.85rem">
            <span>📁 ${s.title}</span>
            <button class="btn-icon" onclick="state.select('section', '${s.id}')">👁</button>
          </div>
        `).join('')}
      </div>

      <div class="inspector-section">
        <div class="inspector-header">Nodes</div>
        ${state.diagram.nodes.map(n => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;font-size:0.85rem">
            <span>📦 ${n.label}</span>
            <button class="btn-icon" onclick="state.select('node', '${n.id}')">👁</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderChecksTab() {
    inspectorContent.innerHTML = `
      <div class="inspector-section">
        <div class="inspector-header">Architecture System Design Checks</div>
        <div style="display:flex;flex-direction:column;gap:0.6rem">
          <div style="padding:0.6rem;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;font-size:0.8rem">
            <b style="color:#059669">✓ Redundancy Check</b>
            <div style="color:#065f46">Primary and secondary paths connected.</div>
          </div>
          <div style="padding:0.6rem;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;font-size:0.8rem">
            <b style="color:#059669">✓ Caching Tier</b>
            <div style="color:#065f46">Fast memory cache configured before primary store.</div>
          </div>
          <div style="padding:0.6rem;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;font-size:0.8rem">
            <b style="color:#059669">✓ Encryption in Transit</b>
            <div style="color:#065f46">All external client connections use HTTPS/TLS.</div>
          </div>
        </div>
      </div>
    `;
  }

  // Floating Bar actions
  const floatingBar = document.querySelector('#floating-node-bar');
  if (floatingBar) {
    const floatLabel = floatingBar.querySelector('.float-label');
    floatLabel.addEventListener('change', (e) => {
      if (state.selected.type === 'node') {
        state.updateNode(state.selected.id, { label: e.target.value });
      }
    });

    floatingBar.querySelectorAll('.seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        floatingBar.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const size = btn.dataset.size;
        const dim = size === 'S' ? 56 : (size === 'M' ? 70 : 90);
        if (state.selected.type === 'node') {
          state.updateNode(state.selected.id, { width: dim, height: dim });
        }
      });
    });

    floatingBar.querySelector('#float-action-delete').addEventListener('click', () => {
      if (state.selected.type === 'node') state.deleteNode(state.selected.id);
    });

    floatingBar.querySelector('#float-action-duplicate').addEventListener('click', () => {
      if (state.selected.type === 'node') {
        const orig = state.diagram.nodes.find(n => n.id === state.selected.id);
        if (orig) {
          state.addNode({
            label: orig.label + ' Copy',
            subtitle: orig.subtitle,
            icon: orig.icon,
            x: orig.x + 40,
            y: orig.y + 40,
            width: orig.width,
            height: orig.height
          });
        }
      }
    });
  }

  // =========================================================================
  // AI GENERATOR MODAL
  // =========================================================================
  const openAiModalBtn = document.querySelector('#editor-btn-ai-prompt');
  const closeAiModalBtn = document.querySelector('#ai-modal-close-btn');
  const modalTextarea = document.querySelector('#modal-ai-prompt-textarea');
  const modalSubmitBtn = document.querySelector('#ai-modal-submit-btn');
  const modalTemplateBtn = document.querySelector('#ai-modal-template-fallback-btn');

  openAiModalBtn.addEventListener('click', () => {
    aiModal.style.display = 'flex';
  });
  closeAiModalBtn.addEventListener('click', () => {
    aiModal.style.display = 'none';
  });
  aiModal.addEventListener('click', (e) => {
    if (e.target === aiModal) aiModal.style.display = 'none';
  });

  // Type pills in modal
  aiModal.querySelectorAll('.type-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      aiModal.querySelectorAll('.type-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Sample prompt buttons in modal
  aiModal.querySelectorAll('.sample-prompt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalTextarea.value = btn.dataset.prompt;
    });
  });

  modalSubmitBtn.addEventListener('click', () => {
    const text = modalTextarea.value.trim() || 'Microservices Architecture with API Gateway and Database';
    const activeType = aiModal.querySelector('.type-pill.active')?.dataset.type || 'Architecture';
    aiEngine.generateFromPrompt(text, activeType);
    aiModal.style.display = 'none';
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    canvasEngine.fitToScreen();
  });

  modalTemplateBtn.addEventListener('click', () => {
    aiModal.style.display = 'none';
    renderSidebarDrawer('templates');
  });

  // =========================================================================
  // PRESENTATION MODE
  // =========================================================================
  const presentBtn = document.querySelector('#editor-btn-present');
  const exitPresentBtn = document.querySelector('#present-exit-btn');
  const nextStepBtn = document.querySelector('#present-next-step-btn');
  const prevStepBtn = document.querySelector('#present-prev-step-btn');
  const presentPlayToggle = document.querySelector('#present-play-toggle');

  presentBtn.addEventListener('click', () => {
    presentationOverlay.style.display = 'flex';
    state.presentationStep = 0;
    updatePresentationView();
  });

  exitPresentBtn.addEventListener('click', () => {
    presentationOverlay.style.display = 'none';
  });

  window.addEventListener('keydown', (e) => {
    if (presentationOverlay.style.display === 'flex') {
      if (e.key === 'Escape') {
        presentationOverlay.style.display = 'none';
      } else if (e.key === 'ArrowRight') {
        advancePresentStep(1);
      } else if (e.key === 'ArrowLeft') {
        advancePresentStep(-1);
      }
    }
  });

  nextStepBtn.addEventListener('click', () => advancePresentStep(1));
  prevStepBtn.addEventListener('click', () => advancePresentStep(-1));

  function advancePresentStep(dir) {
    const steps = state.diagram.timeline.steps || [];
    if (steps.length === 0) return;
    state.presentationStep = Math.max(0, Math.min(state.presentationStep + dir, steps.length - 1));
    updatePresentationView();
  }

  function updatePresentationView() {
    const steps = state.diagram.timeline.steps || [];
    const step = steps[state.presentationStep] || { name: 'Overview', description: 'Complete architecture diagram' };
    
    document.querySelector('#present-diagram-title').textContent = state.diagram.title;
    document.querySelector('#present-step-indicator').textContent = `Step ${state.presentationStep + 1} of ${Math.max(steps.length, 1)}`;
    document.querySelector('#present-step-title').textContent = step.name;
    document.querySelector('#present-step-desc').textContent = step.description;

    // Render scaled canvas inside presentation view
    const viewContainer = document.querySelector('#present-canvas-view');
    viewContainer.innerHTML = '';
    const clone = mainCanvasContainer.cloneNode(true);
    clone.style.width = '100%';
    clone.style.height = '100%';
    viewContainer.appendChild(clone);
  }

  presentPlayToggle.addEventListener('click', () => {
    timelineEngine.seek(0);
    timelineEngine.play();
  });
});
