import { state } from './state.js';
import { TECH_ICONS, SHAPES_CATALOG, ICON_CATEGORIES } from './icons.js';
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
  const diagramTypeModal = document.querySelector('#diagram-type-modal');
  const presentationOverlay = document.querySelector('#presentation-overlay');
  const imageUploadInput = document.querySelector('#image-upload-input');
  const jsonFileInput = document.querySelector('#json-file-input');

  // Custom uploaded images storage in memory
  const uploadedImages = [];

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
  document.querySelector('#nav-btn-open-editor')?.addEventListener('click', () => switchView('editor'));
  document.querySelector('#nav-btn-get-started')?.addEventListener('click', () => switchView('editor'));
  document.querySelector('#landing-brand-logo')?.addEventListener('click', () => switchView('landing'));
  document.querySelector('#editor-btn-back')?.addEventListener('click', () => switchView('landing'));
  document.querySelector('#editor-brand-logo')?.addEventListener('click', () => switchView('landing'));
  document.querySelector('#hero-preview-edit-btn')?.addEventListener('click', () => switchView('editor'));

  // =========================================================================
  // LANDING PAGE FEATURES
  // =========================================================================
  const marqueeTrack = document.querySelector('#landing-marquee-track');
  if (marqueeTrack) {
    const featured = [
      { name: 'PostgreSQL', icon: TECH_ICONS.postgresql },
      { name: 'Redis', icon: TECH_ICONS.redis },
      { name: 'Kafka', icon: TECH_ICONS.kafka },
      { name: 'React', icon: TECH_ICONS.react },
      { name: 'Node.js', icon: TECH_ICONS.nodejs },
      { name: 'Docker', icon: TECH_ICONS.docker },
      { name: 'Kubernetes', icon: TECH_ICONS.kubernetes },
      { name: 'AWS', icon: TECH_ICONS.aws },
      { name: 'Nginx', icon: TECH_ICONS.nginx },
      { name: 'MongoDB', icon: TECH_ICONS.mongodb },
      { name: 'Azure', icon: TECH_ICONS.azure },
      { name: 'Google Cloud', icon: TECH_ICONS.gcp }
    ];
    const doubleList = [...featured, ...featured];
    marqueeTrack.innerHTML = doubleList.map(item => `
      <div class="marquee-chip">
        <div style="width:20px;height:20px;display:flex;align-items:center;justify-content:center">
          ${item.icon?.svg || '📦'}
        </div>
        <span>${item.name}</span>
      </div>
    `).join('');
  }

  // Populate Landing Templates Grid
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

  // Quick Chips on Hero
  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const tpl = chip.dataset.template;
      if (tpl && TEMPLATES[tpl]) {
        state.loadTemplate(tpl);
        switchView('editor');
      }
    });
  });

  // Hero AI Input
  const heroInput = document.querySelector('#hero-ai-input');
  const heroGenBtn = document.querySelector('#hero-ai-generate-btn');
  if (heroGenBtn && heroInput) {
    heroGenBtn.addEventListener('click', () => {
      const prompt = heroInput.value.trim();
      if (!prompt) return;
      aiEngine.generateDiagramFromPrompt(prompt, 'Architecture');
      switchView('editor');
    });
    heroInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') heroGenBtn.click();
    });
  }

  // =========================================================================
  // CANVAS EDITOR WORKSPACE CONTROLS
  // =========================================================================

  // Diagram Title Input
  const titleInput = document.querySelector('#editor-title-input');
  if (titleInput) {
    titleInput.addEventListener('change', (e) => {
      state.diagram.title = e.target.value;
      state.saveSnapshot();
    });
  }

  // Undo / Redo
  document.querySelector('#editor-btn-undo')?.addEventListener('click', () => state.undo());
  document.querySelector('#editor-btn-redo')?.addEventListener('click', () => state.redo());
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      state.undo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      state.redo();
    }
  });

  // Fit to Screen
  document.querySelector('#editor-btn-fit-screen')?.addEventListener('click', () => canvasEngine.fitToScreen());
  document.querySelector('#zoom-fit-btn')?.addEventListener('click', () => canvasEngine.fitToScreen());

  // Zoom Controls
  const zoomLabel = document.querySelector('#canvas-zoom-label');
  function updateZoomDisplay() {
    if (zoomLabel) zoomLabel.textContent = `${Math.round(state.viewport.zoom * 100)}%`;
  }
  document.querySelector('#zoom-in-btn')?.addEventListener('click', () => {
    state.viewport.zoom = Math.min(state.viewport.zoom + 0.15, 3.0);
    state.notify('viewport_change');
    canvasEngine.applyTransform();
    updateZoomDisplay();
  });
  document.querySelector('#zoom-out-btn')?.addEventListener('click', () => {
    state.viewport.zoom = Math.max(state.viewport.zoom - 0.15, 0.25);
    state.notify('viewport_change');
    canvasEngine.applyTransform();
    updateZoomDisplay();
  });
  zoomLabel?.addEventListener('click', () => {
    state.viewport.zoom = 1.0;
    state.notify('viewport_change');
    canvasEngine.applyTransform();
    updateZoomDisplay();
  });

  // Auto Layout
  document.querySelector('#auto-layout-btn')?.addEventListener('click', () => {
    let currentX = 120;
    state.diagram.nodes.forEach((node, i) => {
      node.x = currentX;
      node.y = 200 + (i % 2 === 0 ? 0 : 40);
      currentX += node.width + 120;
    });
    canvasEngine.render();
    canvasEngine.fitToScreen();
    confetti({ particleCount: 30 });
  });

  // Toggle Minimap
  document.querySelector('#toggle-minimap-btn')?.addEventListener('click', () => {
    if (minimapBox) minimapBox.style.display = minimapBox.style.display === 'none' ? 'block' : 'none';
  });

  // Theme / Grid Mode Toggle Button (Palette 🎨)
  let gridStyleIndex = 0;
  const gridStyles = [
    { name: 'Dots', bg: '#fafafa', img: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)' },
    { name: 'Grid', bg: '#ffffff', img: 'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)' },
    { name: 'Blank', bg: '#ffffff', img: 'none' },
    { name: 'Dark', bg: '#0f172a', img: 'radial-gradient(#334155 1.2px, transparent 1.2px)' }
  ];
  document.querySelector('#editor-btn-theme-toggle')?.addEventListener('click', () => {
    gridStyleIndex = (gridStyleIndex + 1) % gridStyles.length;
    const mode = gridStyles[gridStyleIndex];
    state.diagram.background = mode.bg;
    mainCanvasContainer.style.backgroundColor = mode.bg;
    mainCanvasContainer.style.backgroundImage = mode.img;
    mainCanvasContainer.style.backgroundSize = mode.name === 'Grid' ? '24px 24px' : '20px 20px';
  });

  // =========================================================================
  // DIAGRAM TYPE MODAL & SWITCHING
  // =========================================================================
  const editorTypeBadge = document.querySelector('#editor-type-badge');
  const editorTypeText = document.querySelector('#editor-type-text');

  function openDiagramTypeModal() {
    if (!diagramTypeModal) return;
    diagramTypeModal.classList.add('show');
    // Highlight currently selected type
    const current = state.diagram.type || 'Architecture';
    diagramTypeModal.querySelectorAll('.type-selection-card').forEach(card => {
      const isMatch = card.dataset.type.toLowerCase() === current.toLowerCase() ||
                      (card.dataset.type === 'Architecture' && current.includes('Architecture'));
      card.classList.toggle('active', isMatch);
    });
  }

  function closeDiagramTypeModal() {
    if (diagramTypeModal) diagramTypeModal.classList.remove('show');
  }

  editorTypeBadge?.addEventListener('click', openDiagramTypeModal);
  document.querySelector('#diagram-type-modal-close-btn')?.addEventListener('click', closeDiagramTypeModal);
  document.querySelector('#diagram-type-cancel-btn')?.addEventListener('click', closeDiagramTypeModal);

  let pendingType = state.diagram.type || 'Architecture';
  diagramTypeModal?.querySelectorAll('.type-selection-card').forEach(card => {
    card.addEventListener('click', () => {
      diagramTypeModal.querySelectorAll('.type-selection-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      pendingType = card.dataset.type;
    });
  });

  document.querySelector('#diagram-type-switch-btn')?.addEventListener('click', () => {
    state.diagram.type = pendingType;
    if (editorTypeText) editorTypeText.textContent = pendingType;
    closeDiagramTypeModal();
    const autoArrange = document.querySelector('#diagram-type-auto-arrange')?.checked;
    if (autoArrange) {
      document.querySelector('#auto-layout-btn')?.click();
    }
    state.saveSnapshot();
    state.notify('diagram_change');
  });

  // =========================================================================
  // TOPBAR DROPDOWN MENUS (Timeline, Export, More)
  // =========================================================================

  // Timeline Dropdown
  const timelineBtn = document.querySelector('#editor-btn-timeline');
  const timelineMenu = document.querySelector('#timeline-dropdown-menu');
  timelineBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    timelineMenu?.classList.toggle('show');
  });

  document.querySelector('#tl-menu-bottom')?.addEventListener('click', () => {
    state.isTimelineOpen = !state.isTimelineOpen;
    state.notify('timeline_toggle');
  });
  document.querySelector('#tl-menu-sequence')?.addEventListener('click', () => {
    state.isTimelineOpen = true;
    state.notify('timeline_toggle');
    timelineEngine.rebuildAI();
  });
  document.querySelector('#tl-menu-builder')?.addEventListener('click', () => {
    state.isTimelineOpen = true;
    state.notify('timeline_toggle');
    timelineEngine.seek(0);
    timelineEngine.play();
  });

  // Export Dropdown
  const exportBtn = document.querySelector('#editor-btn-export-dropdown');
  const exportMenu = document.querySelector('#export-dropdown-menu');
  exportBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    exportMenu?.classList.toggle('show');
  });

  document.querySelector('#export-action-png')?.addEventListener('click', () => {
    ExportEngine.exportPNG();
    confetti({ particleCount: 50 });
  });
  document.querySelector('#export-action-svg')?.addEventListener('click', () => {
    ExportEngine.exportSVG();
    confetti({ particleCount: 50 });
  });
  document.querySelector('#export-action-pdf')?.addEventListener('click', () => {
    ExportEngine.exportPNG();
    alert('PDF format prepared via high-res raster print.');
  });
  document.querySelector('#export-action-gif')?.addEventListener('click', () => {
    state.isTimelineOpen = true;
    state.notify('timeline_toggle');
    timelineEngine.seek(0);
    timelineEngine.play();
  });
  document.querySelector('#export-action-tlgif')?.addEventListener('click', () => {
    state.isTimelineOpen = true;
    state.notify('timeline_toggle');
    timelineEngine.seek(0);
    timelineEngine.play();
  });
  document.querySelector('#export-action-mp4')?.addEventListener('click', () => {
    alert('MP4 Video Export requires ByteDiagram Pro. Sign in or upgrade to export video.');
  });
  document.querySelector('#export-action-json')?.addEventListener('click', () => {
    ExportEngine.exportJSON();
    confetti({ particleCount: 50 });
  });
  document.querySelector('#export-action-drawio')?.addEventListener('click', () => {
    ExportEngine.exportJSON();
    alert('Exported JSON compatible with diagram engines.');
  });

  // More Menu
  const moreBtn = document.querySelector('#editor-btn-more');
  const moreMenu = document.querySelector('#more-dropdown-menu');
  moreBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    moreMenu?.classList.toggle('show');
  });
  document.querySelector('#more-action-reset')?.addEventListener('click', () => canvasEngine.fitToScreen());
  document.querySelector('#more-action-snap')?.addEventListener('click', () => {
    state.diagram.snapToGrid = !state.diagram.snapToGrid;
    alert(`Snap to grid: ${state.diagram.snapToGrid ? 'ON' : 'OFF'}`);
  });
  document.querySelector('#more-action-layout')?.addEventListener('click', () => document.querySelector('#auto-layout-btn')?.click());
  document.querySelector('#more-action-minimap')?.addEventListener('click', () => document.querySelector('#toggle-minimap-btn')?.click());
  document.querySelector('#more-action-clear')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the entire diagram?')) {
      state.diagram.nodes = [];
      state.diagram.edges = [];
      state.diagram.sections = [];
      state.saveSnapshot();
      state.notify('diagram_change');
    }
  });

  // Save button
  document.querySelector('#editor-btn-save')?.addEventListener('click', () => {
    localStorage.setItem('bytediagram_autosave', JSON.stringify(state.diagram));
    const btn = document.querySelector('#editor-btn-save');
    if (btn) {
      btn.innerHTML = '✓ Saved ▾';
      setTimeout(() => { btn.innerHTML = '💾 Save ▾'; }, 1600);
    }
  });

  // Close menus on outside click
  window.addEventListener('click', () => {
    timelineMenu?.classList.remove('show');
    exportMenu?.classList.remove('show');
    moreMenu?.classList.remove('show');
  });

  // Presentation Mode
  const presentBtn = document.querySelector('#editor-btn-present');
  presentBtn?.addEventListener('click', () => {
    if (!presentationOverlay) return;
    presentationOverlay.style.display = 'flex';
    document.querySelector('#present-diagram-title').textContent = state.diagram.title || 'Architecture Walkthrough';
  });
  document.querySelector('#present-exit-btn')?.addEventListener('click', () => {
    if (presentationOverlay) presentationOverlay.style.display = 'none';
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && presentationOverlay?.style.display === 'flex') {
      presentationOverlay.style.display = 'none';
    }
  });

  // AI Prompt Modal
  document.querySelector('#editor-btn-ai-prompt')?.addEventListener('click', () => {
    if (aiModal) aiModal.classList.add('show');
  });
  document.querySelector('#ai-modal-close-btn')?.addEventListener('click', () => {
    if (aiModal) aiModal.classList.remove('show');
  });
  document.querySelector('#ai-modal-submit-btn')?.addEventListener('click', () => {
    const txt = document.querySelector('#modal-ai-prompt-textarea')?.value.trim();
    if (!txt) return;
    aiEngine.generateDiagramFromPrompt(txt, 'Architecture');
    aiModal?.classList.remove('show');
    canvasEngine.fitToScreen();
    confetti({ particleCount: 60 });
  });

  // Collapsible Sidebars
  const leftSidebar = document.querySelector('#app-left-sidebar');
  const rightSidebar = document.querySelector('#app-right-sidebar');
  document.querySelector('#btn-collapse-sidebar')?.addEventListener('click', () => {
    leftSidebar?.classList.toggle('collapsed');
  });
  document.querySelector('#btn-collapse-right-sidebar')?.addEventListener('click', () => {
    rightSidebar?.classList.toggle('collapsed');
  });

  // =========================================================================
  // LEFT SIDEBAR TABS: SHAPES, ICONS, TEMPLATES, FILE, UPLOADS, BYTI
  // =========================================================================
  const sidebarDrawer = document.querySelector('#sidebar-drawer-content');
  const tabStripBtns = document.querySelectorAll('.tab-strip-btn');

  tabStripBtns.forEach(btn => {
    if (btn.id === 'btn-collapse-sidebar') return;
    btn.addEventListener('click', () => {
      tabStripBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      leftSidebar?.classList.remove('collapsed');
      renderSidebarDrawer(btn.dataset.tab);
    });
  });

  function renderSidebarDrawer(tab) {
    state.activeLeftTab = tab;
    if (!sidebarDrawer) return;

    if (tab === 'shapes') {
      // Complete Shapes Catalog with Expandable Accordions matching ByteDiagram exactly
      sidebarDrawer.innerHTML = `
        <div class="panel-title">Shapes</div>
        <div class="panel-subtitle">Click to add, or drag onto the canvas.</div>
        <input type="text" class="panel-search-input" id="search-shapes-input" placeholder="Search shapes..." />

        <!-- 1. Text -->
        <div class="accordion-section" data-sec="text">
          <div class="accordion-header">
            <span>Text</span>
            <span class="chevron">▾</span>
          </div>
          <div class="accordion-body" style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px">
            ${SHAPES_CATALOG.text.map(t => `
              <div class="shape-drag-card text-preset-card" draggable="true" data-type="text" data-shape="${t.kind}" data-name="${t.name}" style="padding:8px 12px;display:flex;justify-content:space-between;align-items:center;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;cursor:grab">
                <span class="${t.previewClass}" style="font-size:0.85rem">${t.name}</span>
                <span style="font-size:0.65rem;color:#94a3b8;font-weight:700;letter-spacing:0.5px">${t.label}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 2. Sections -->
        <div class="accordion-section" data-sec="sections">
          <div class="accordion-header">
            <span>Sections</span>
            <span class="chevron">▾</span>
          </div>
          <div class="accordion-body" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px">
            ${SHAPES_CATALOG.sections.map(s => `
              <div class="shape-drag-card" draggable="true" data-type="section" data-preset="${s.id}" data-name="${s.name}" style="padding:10px 8px;border:${s.previewBorder};background:${s.previewBg};border-radius:8px;cursor:grab;text-align:center">
                <div style="font-weight:700;font-size:0.75rem">${s.name}</div>
                <div style="font-size:0.65rem;color:#64748b;line-height:1.2;margin-top:2px">${s.description}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 3. Architecture (18 primitives) -->
        <div class="accordion-section" data-sec="architecture">
          <div class="accordion-header">
            <span>Architecture <small style="color:#64748b">18</small></span>
            <span class="chevron">▾</span>
          </div>
          <div class="accordion-body" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px">
            ${SHAPES_CATALOG.architecture.map(a => `
              <div class="shape-drag-card" draggable="true" data-type="node" data-shape="${a.shape || 'custom'}" data-name="${a.name}" data-icon="${a.icon || 'nodejs'}" style="padding:8px 4px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;text-align:center;cursor:grab">
                <div class="preview-box" style="width:28px;height:28px;margin:0 auto 4px;display:flex;align-items:center;justify-content:center">
                  ${a.svgPreview || TECH_ICONS[a.icon]?.svg || '📦'}
                </div>
                <span style="font-size:0.7rem;font-weight:600;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.shortName || a.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 4. Elements (8 basic shapes) -->
        <div class="accordion-section" data-sec="elements">
          <div class="accordion-header">
            <span>Elements <small style="color:#64748b">8</small></span>
            <span class="chevron">▾</span>
          </div>
          <div class="accordion-body" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px">
            ${SHAPES_CATALOG.elements.map(b => `
              <div class="shape-drag-card" draggable="true" data-type="node" data-shape="${b.shape}" data-name="${b.name}" style="padding:8px 2px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;text-align:center;cursor:grab">
                <div class="preview-box" style="width:24px;height:24px;margin:0 auto 2px;display:flex;align-items:center;justify-content:center">
                  ${b.svgPreview}
                </div>
                <span style="font-size:0.65rem;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${b.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 5. General Shapes (12 shapes) -->
        <div class="accordion-section collapsed" data-sec="general">
          <div class="accordion-header">
            <span>General <small style="color:#64748b">12</small></span>
            <span class="chevron">▸</span>
          </div>
          <div class="accordion-body" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px">
            ${SHAPES_CATALOG.general.map(g => `
              <div class="shape-drag-card" draggable="true" data-type="node" data-shape="${g.shape}" data-name="${g.name}" style="padding:8px 4px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;text-align:center;cursor:grab">
                <div class="preview-box" style="width:26px;height:26px;margin:0 auto 4px;display:flex;align-items:center;justify-content:center">
                  ${g.svgPreview}
                </div>
                <span style="font-size:0.68rem;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${g.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 6. Flowchart (5 shapes) -->
        <div class="accordion-section collapsed" data-sec="flowchart">
          <div class="accordion-header">
            <span>Flowchart <small style="color:#64748b">5</small></span>
            <span class="chevron">▸</span>
          </div>
          <div class="accordion-body" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px">
            ${SHAPES_CATALOG.flowchart.map(f => `
              <div class="shape-drag-card" draggable="true" data-type="node" data-shape="${f.shape}" data-name="${f.name}" style="padding:8px 4px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;text-align:center;cursor:grab">
                <div class="preview-box" style="width:26px;height:26px;margin:0 auto 4px;display:flex;align-items:center;justify-content:center">
                  ${f.svgPreview}
                </div>
                <span style="font-size:0.68rem;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 7. Arrows (6 shapes) -->
        <div class="accordion-section collapsed" data-sec="arrows">
          <div class="accordion-header">
            <span>Arrows <small style="color:#64748b">6</small></span>
            <span class="chevron">▸</span>
          </div>
          <div class="accordion-body" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px">
            ${SHAPES_CATALOG.arrows.map(ar => `
              <div class="shape-drag-card" draggable="true" data-type="node" data-shape="${ar.shape}" data-name="${ar.name}" style="padding:8px 4px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;text-align:center;cursor:grab">
                <div class="preview-box" style="width:26px;height:26px;margin:0 auto 4px;display:flex;align-items:center;justify-content:center">
                  ${ar.svgPreview}
                </div>
                <span style="font-size:0.65rem;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${ar.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 8. UML (5 shapes) -->
        <div class="accordion-section collapsed" data-sec="uml">
          <div class="accordion-header">
            <span>UML <small style="color:#64748b">5</small></span>
            <span class="chevron">▸</span>
          </div>
          <div class="accordion-body" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px">
            ${SHAPES_CATALOG.uml.map(u => `
              <div class="shape-drag-card" draggable="true" data-type="node" data-shape="${u.shape}" data-name="${u.name}" style="padding:8px 4px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;text-align:center;cursor:grab">
                <div class="preview-box" style="width:26px;height:26px;margin:0 auto 4px;display:flex;align-items:center;justify-content:center">
                  ${u.svgPreview}
                </div>
                <span style="font-size:0.68rem;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${u.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <button class="btn-ghost" style="width:100%;border:1px dashed #cbd5e1;padding:8px;font-size:0.8rem;margin-top:12px;justify-content:center" id="btn-more-shapes">
          More shapes ▾
        </button>
      `;

      // Accordion click handlers
      sidebarDrawer.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
          const sec = header.parentElement;
          sec.classList.toggle('collapsed');
          const chevron = header.querySelector('.chevron');
          chevron.textContent = sec.classList.contains('collapsed') ? '▸' : '▾';
        });
      });

      // More shapes toggle expands all collapsed sections
      sidebarDrawer.querySelector('#btn-more-shapes')?.addEventListener('click', () => {
        sidebarDrawer.querySelectorAll('.accordion-section').forEach(s => {
          s.classList.remove('collapsed');
          const ch = s.querySelector('.chevron');
          if (ch) ch.textContent = '▾';
        });
      });

      // Search shapes
      const searchInput = sidebarDrawer.querySelector('#search-shapes-input');
      searchInput?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        sidebarDrawer.querySelectorAll('.shape-drag-card').forEach(card => {
          const name = (card.dataset.name || '').toLowerCase();
          const match = name.includes(q);
          card.style.display = match ? 'block' : 'none';
        });
        if (q) {
          sidebarDrawer.querySelectorAll('.accordion-section').forEach(s => {
            s.classList.remove('collapsed');
            const ch = s.querySelector('.chevron');
            if (ch) ch.textContent = '▾';
          });
        }
      });

      bindDragCards();

    } else if (tab === 'icons') {
      // Exhaustive Icons Library with all 38 categories from ByteDiagram
      const categories = Object.keys(ICON_CATEGORIES);

      sidebarDrawer.innerHTML = `
        <div class="panel-title">Icons</div>
        <div class="panel-subtitle">AWS, Azure, Google Cloud, and the rest of the stack. Expand a category or search.</div>
        <input type="text" class="panel-search-input" id="search-all-icons-input" placeholder="Search AWS, Azure, GCP, React..." />

        <div id="icons-accordion-container" style="display:flex;flex-direction:column;gap:8px">
          ${categories.map((cat, idx) => {
            const count = ICON_CATEGORIES[cat]?.length || 0;
            const isOpen = idx === 0;
            return `
              <div class="accordion-section icon-cat-section ${isOpen ? '' : 'collapsed'}" data-cat="${cat}">
                <div class="accordion-header" style="background:#f8fafc">
                  <span>${cat} <small style="color:#64748b">(${count})</small></span>
                  <span class="chevron">${isOpen ? '▾' : '▸'}</span>
                </div>
                <div class="accordion-body icons-cat-grid" style="display:${isOpen ? 'grid' : 'none'};grid-template-columns:repeat(3,1fr);gap:6px;padding:6px 0">
                  ${(ICON_CATEGORIES[cat] || []).slice(0, 48).map(icon => `
                    <div class="icon-drag-card" draggable="true" data-type="node" data-name="${icon.name}" data-url="${icon.url}" style="padding:6px 4px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;text-align:center;cursor:grab">
                      <div class="preview-box" style="width:28px;height:28px;margin:0 auto 2px;display:flex;align-items:center;justify-content:center">
                        <img src="${icon.url}" alt="${icon.name}" style="width:100%;height:100%;object-fit:contain" loading="lazy" />
                      </div>
                      <span style="font-size:0.65rem;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${icon.name}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      sidebarDrawer.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
          const sec = header.parentElement;
          sec.classList.toggle('collapsed');
          const body = sec.querySelector('.accordion-body');
          if (body) body.style.display = sec.classList.contains('collapsed') ? 'none' : 'grid';
          const ch = header.querySelector('.chevron');
          if (ch) ch.textContent = sec.classList.contains('collapsed') ? '▸' : '▾';
        });
      });

      const searchIconsInput = sidebarDrawer.querySelector('#search-all-icons-input');
      searchIconsInput?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        if (!q) {
          sidebarDrawer.querySelectorAll('.icon-cat-section').forEach(sec => sec.style.display = 'block');
          return;
        }
        sidebarDrawer.querySelectorAll('.icon-cat-section').forEach(sec => {
          const cat = sec.dataset.cat;
          const hasMatch = (ICON_CATEGORIES[cat] || []).some(ic => ic.name.toLowerCase().includes(q));
          sec.style.display = hasMatch ? 'block' : 'none';
          if (hasMatch) {
            sec.classList.remove('collapsed');
            const body = sec.querySelector('.accordion-body');
            if (body) body.style.display = 'grid';
            const ch = sec.querySelector('.chevron');
            if (ch) ch.textContent = '▾';
          }
        });
      });

      bindDragCards();

    } else if (tab === 'templates') {
      sidebarDrawer.innerHTML = `
        <div class="panel-title">Templates</div>
        <div class="panel-subtitle">Quick starts for system architectures and more.</div>

        <div style="font-size:0.75rem;font-weight:700;color:#94a3b8;margin:1rem 0 0.5rem;text-transform:uppercase">IMPORT A DIAGRAM</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:1.25rem">
          <button class="btn-ghost" id="tpl-import-json-btn" style="flex:1;border:1px solid #cbd5e1;font-size:0.75rem;justify-content:center;padding:8px">📄 Import JSON</button>
          <button class="btn-ghost" id="tpl-import-drawio-btn" style="flex:1;border:1px solid #cbd5e1;font-size:0.75rem;justify-content:center;padding:8px">🔗 Import draw.io</button>
        </div>

        <div id="templates-list-container" style="display:flex;flex-direction:column;gap:8px">
          ${Object.values(TEMPLATES).map(tpl => `
            <div class="template-item-card" data-id="${tpl.id}" style="padding:12px;border:1px solid #e2e8f0;border-radius:10px;background:#ffffff;cursor:pointer;transition:all 0.15s">
              <h4 style="font-weight:700;font-size:0.9rem;display:flex;justify-content:space-between;align-items:center">${tpl.title} <span style="color:#2563eb">→</span></h4>
              <p style="font-size:0.75rem;color:#64748b;margin-top:4px">${tpl.subtitle}</p>
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

      sidebarDrawer.querySelector('#tpl-import-json-btn')?.addEventListener('click', () => jsonFileInput?.click());
      sidebarDrawer.querySelector('#tpl-import-drawio-btn')?.addEventListener('click', () => jsonFileInput?.click());

    } else if (tab === 'file') {
      sidebarDrawer.innerHTML = `
        <div class="panel-title">File</div>
        <div class="panel-subtitle">Import a diagram, or download this one.</div>

        <div style="font-size:0.75rem;font-weight:700;color:#94a3b8;margin:1rem 0 0.5rem;text-transform:uppercase">IMPORT</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div class="template-item-card" id="file-import-json-card" style="padding:12px;border:1px solid #e2e8f0;border-radius:10px;background:#ffffff;cursor:pointer;display:flex;gap:12px;align-items:center">
            <span style="font-size:1.4rem">📤</span>
            <div>
              <div style="font-weight:700;font-size:0.85rem">Import JSON</div>
              <div style="font-size:0.75rem;color:#64748b">ByteDiagram .json file</div>
            </div>
          </div>
          <div class="template-item-card" id="file-import-drawio-card" style="padding:12px;border:1px solid #e2e8f0;border-radius:10px;background:#ffffff;cursor:pointer;display:flex;gap:12px;align-items:center">
            <span style="font-size:1.4rem">🔗</span>
            <div>
              <div style="font-weight:700;font-size:0.85rem">Import draw.io</div>
              <div style="font-size:0.75rem;color:#64748b">.drawio or .xml from diagrams.net</div>
            </div>
          </div>
        </div>

        <div style="font-size:0.75rem;font-weight:700;color:#94a3b8;margin:1.5rem 0 0.5rem;text-transform:uppercase">EXPORT</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div class="template-item-card" id="file-export-json-card" style="padding:12px;border:1px solid #e2e8f0;border-radius:10px;background:#ffffff;cursor:pointer;display:flex;gap:12px;align-items:center">
            <span style="font-size:1.4rem">💾</span>
            <div>
              <div style="font-weight:700;font-size:0.85rem">Export JSON</div>
              <div style="font-size:0.75rem;color:#64748b">Open again in ByteDiagram</div>
            </div>
          </div>
          <div class="template-item-card" id="file-export-drawio-card" style="padding:12px;border:1px solid #e2e8f0;border-radius:10px;background:#ffffff;cursor:pointer;display:flex;gap:12px;align-items:center">
            <span style="font-size:1.4rem">⤓</span>
            <div>
              <div style="font-weight:700;font-size:0.85rem">Export draw.io</div>
              <div style="font-size:0.75rem;color:#64748b">Open in diagrams.net</div>
            </div>
          </div>
        </div>
      `;

      sidebarDrawer.querySelector('#file-import-json-card')?.addEventListener('click', () => jsonFileInput?.click());
      sidebarDrawer.querySelector('#file-import-drawio-card')?.addEventListener('click', () => jsonFileInput?.click());
      sidebarDrawer.querySelector('#file-export-json-card')?.addEventListener('click', () => ExportEngine.exportJSON());
      sidebarDrawer.querySelector('#file-export-drawio-card')?.addEventListener('click', () => ExportEngine.exportJSON());

    } else if (tab === 'uploads') {
      sidebarDrawer.innerHTML = `
        <div class="panel-title">Uploads</div>
        <div class="panel-subtitle">Upload custom images, icons, and diagrams to place on the canvas.</div>

        <div class="upload-dropzone" id="uploads-dropzone" style="margin:1rem 0">
          <span style="font-size:2rem;margin-bottom:6px">🖼</span>
          <div style="font-weight:700;font-size:0.85rem;color:#0f172a">Click to upload or drag images here</div>
          <div style="font-size:0.75rem;color:#64748b;margin-top:2px">PNG, SVG, JPG, WebP supported</div>
        </div>

        <div style="font-size:0.75rem;font-weight:700;color:#94a3b8;margin-bottom:8px;text-transform:uppercase">Your Uploaded Assets (${uploadedImages.length})</div>
        <div id="uploads-gallery" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
          ${uploadedImages.map((img, i) => `
            <div class="uploaded-image-card" draggable="true" data-type="upload" data-name="${img.name}" data-url="${img.url}" style="padding:6px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;text-align:center;cursor:grab">
              <div style="width:36px;height:36px;margin:0 auto 4px;display:flex;align-items:center;justify-content:center">
                <img src="${img.url}" alt="${img.name}" style="width:100%;height:100%;object-fit:contain" />
              </div>
              <span style="font-size:0.65rem;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${img.name}</span>
            </div>
          `).join('')}
        </div>
      `;

      const dropzone = sidebarDrawer.querySelector('#uploads-dropzone');
      dropzone?.addEventListener('click', () => imageUploadInput?.click());
      dropzone?.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.borderColor = '#2563eb'; });
      dropzone?.addEventListener('dragleave', () => { dropzone.style.borderColor = '#cbd5e1'; });
      dropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#cbd5e1';
        handleImageFiles(e.dataTransfer.files);
      });

      sidebarDrawer.querySelectorAll('.uploaded-image-card').forEach(card => {
        card.addEventListener('click', () => {
          const world = getViewportCenter();
          state.addNode({
            label: card.dataset.name,
            imageUrl: card.dataset.url,
            x: Math.round(world.x - 40),
            y: Math.round(world.y - 40),
            width: 80,
            height: 80
          });
        });
      });

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
        chatBox.innerHTML += `
          <div style="align-self:flex-end;background:#2563eb;color:#ffffff;padding:0.5rem 0.75rem;border-radius:8px;font-size:0.8rem;max-width:85%">
            ${msg}
          </div>
        `;
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

      sendBtn?.addEventListener('click', () => sendByteyMsg());
      chatInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendByteyMsg();
      });
      sidebarDrawer.querySelectorAll('.bytey-quick-opt').forEach(opt => {
        opt.addEventListener('click', () => sendByteyMsg(opt.textContent));
      });
    }
  }

  // Handle Image File Uploads
  function handleImageFiles(files) {
    if (!files || !files.length) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        uploadedImages.push({ name: file.name.replace(/\.[^/.]+$/, ""), url: dataUrl });
        renderSidebarDrawer('uploads');
        // Also add directly to canvas
        const world = getViewportCenter();
        state.addNode({
          label: file.name.replace(/\.[^/.]+$/, ""),
          imageUrl: dataUrl,
          x: Math.round(world.x - 40),
          y: Math.round(world.y - 40),
          width: 80,
          height: 80
        });
      };
      reader.readAsDataURL(file);
    });
  }

  imageUploadInput?.addEventListener('change', (e) => handleImageFiles(e.target.files));

  // JSON File Import Listener
  jsonFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      ExportEngine.importJSON(ev.target.result);
      canvasEngine.fitToScreen();
    };
    reader.readAsText(file);
  });

  // Calculate Viewport Center in Canvas World Coordinates
  function getViewportCenter() {
    const rect = mainCanvasContainer.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return canvasEngine.screenToWorld(cx, cy);
  }

  // Bind Drag & Drop and Click Actions on Shape/Icon Cards
  function bindDragCards() {
    sidebarDrawer.querySelectorAll('.shape-drag-card, .icon-drag-card').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        const payload = {
          type: card.dataset.type,
          shape: card.dataset.shape || null,
          name: card.dataset.name,
          iconId: card.dataset.icon || 'nodejs',
          url: card.dataset.url || null,
          preset: card.dataset.preset || null
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(payload));
      });

      card.addEventListener('click', () => {
        const world = getViewportCenter();
        // Add subtle random jitter so repeated clicks don't stack directly on top
        const jitterX = Math.round((Math.random() - 0.5) * 40);
        const jitterY = Math.round((Math.random() - 0.5) * 40);

        if (card.dataset.type === 'section') {
          const presetId = card.dataset.preset || 'standard';
          const preset = SHAPES_CATALOG.sections.find(s => s.id === presetId) || SHAPES_CATALOG.sections[0];
          state.addSection({
            title: preset.data.title,
            subtitle: preset.data.subtitle,
            x: Math.round(world.x - 125 + jitterX),
            y: Math.round(world.y - 105 + jitterY),
            width: preset.data.width,
            height: preset.data.height,
            fill: preset.data.fill,
            border: preset.data.border,
            borderStyle: preset.data.borderStyle,
            blur: preset.data.blur,
            shadow: preset.data.shadow
          });
        } else if (card.dataset.type === 'text') {
          const shapeKind = card.dataset.shape || 'heading';
          state.addNode({
            label: card.dataset.name,
            nodeType: 'text',
            shape: shapeKind,
            x: Math.round(world.x - 70 + jitterX),
            y: Math.round(world.y - 20 + jitterY),
            width: shapeKind === 'heading' ? 160 : shapeKind === 'title' ? 130 : 200,
            height: shapeKind === 'heading' ? 40 : shapeKind === 'title' ? 35 : 50,
            fill: 'transparent',
            border: 'transparent'
          });
        } else {
          // Node (Architecture, Element, Flowchart, General, Arrow, UML, or Tech Icon)
          const shapeKind = card.dataset.shape || 'custom';
          const iconKey = card.dataset.icon || 'nodejs';
          const url = card.dataset.url || null;

          state.addNode({
            label: card.dataset.name,
            shape: shapeKind,
            icon: iconKey,
            imageUrl: url,
            x: Math.round(world.x - 35 + jitterX),
            y: Math.round(world.y - 35 + jitterY),
            width: shapeKind === 'rectangle' ? 85 : 70,
            height: shapeKind === 'rectangle' ? 55 : 70
          });
        }
      });
    });
  }

  // Native Canvas HTML5 Drop Handling
  mainCanvasContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  mainCanvasContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;

    try {
      const payload = JSON.parse(raw);
      const world = canvasEngine.screenToWorld(e.clientX, e.clientY);

      if (payload.type === 'section') {
        const preset = SHAPES_CATALOG.sections.find(s => s.id === payload.preset) || SHAPES_CATALOG.sections[0];
        state.addSection({
          title: preset.data.title,
          subtitle: preset.data.subtitle,
          x: Math.round(world.x - preset.data.width / 2),
          y: Math.round(world.y - preset.data.height / 2),
          width: preset.data.width,
          height: preset.data.height,
          fill: preset.data.fill,
          border: preset.data.border,
          borderStyle: preset.data.borderStyle,
          blur: preset.data.blur,
          shadow: preset.data.shadow
        });
      } else if (payload.type === 'text') {
        const shapeKind = payload.shape || 'heading';
        state.addNode({
          label: payload.name,
          nodeType: 'text',
          shape: shapeKind,
          x: Math.round(world.x - 70),
          y: Math.round(world.y - 20),
          width: shapeKind === 'heading' ? 160 : shapeKind === 'title' ? 130 : 200,
          height: shapeKind === 'heading' ? 40 : shapeKind === 'title' ? 35 : 50,
          fill: 'transparent',
          border: 'transparent'
        });
      } else {
        const shapeKind = payload.shape || 'custom';
        state.addNode({
          label: payload.name,
          shape: shapeKind,
          icon: payload.iconId || 'nodejs',
          imageUrl: payload.url || null,
          x: Math.round(world.x - 35),
          y: Math.round(world.y - 35),
          width: shapeKind === 'rectangle' ? 85 : 70,
          height: shapeKind === 'rectangle' ? 55 : 70
        });
      }
    } catch (err) {
      console.error('Drop parse error:', err);
    }
  });

  // Initial render of left drawer (Shapes tab)
  renderSidebarDrawer('shapes');

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
    if (!inspectorContent) return;

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
              <div style="font-size:0.75rem;color:#64748b">${obj.shape || 'node'} · ${obj.nodeType || 'component'}</div>
            </div>
            <div style="display:flex;gap:4px">
              <button class="btn-icon" id="prop-dup-node-btn" title="Duplicate">📋</button>
              <button class="btn-icon" id="prop-del-node-btn" style="color:#ef4444" title="Delete">🗑</button>
            </div>
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
          <div class="inspector-header">Size & Layout</div>
          <div class="prop-row">
            <span>Preset</span>
            <div class="segmented-control" id="prop-node-size-seg">
              <button class="seg-btn ${obj.width <= 60 ? 'active' : ''}" data-size="S">S</button>
              <button class="seg-btn ${obj.width > 60 && obj.width <= 85 ? 'active' : ''}" data-size="M">M</button>
              <button class="seg-btn ${obj.width > 85 ? 'active' : ''}" data-size="L">L</button>
            </div>
          </div>
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

        <div class="inspector-section">
          <div class="inspector-header">Animation Effect</div>
          <div class="segmented-control" id="prop-node-anim-seg">
            <button class="seg-btn ${!obj.animation ? 'active' : ''}" data-anim="">None</button>
            <button class="seg-btn ${obj.animation === 'pulse' ? 'active' : ''}" data-anim="pulse">Pulse</button>
            <button class="seg-btn ${obj.animation === 'glow' ? 'active' : ''}" data-anim="glow">Glow</button>
          </div>
        </div>
      `;

      inspectorContent.querySelector('#prop-node-label')?.addEventListener('change', (e) => {
        state.updateNode(obj.id, { label: e.target.value });
      });
      inspectorContent.querySelector('#prop-node-subtitle')?.addEventListener('change', (e) => {
        state.updateNode(obj.id, { subtitle: e.target.value });
      });
      inspectorContent.querySelector('#prop-node-w')?.addEventListener('change', (e) => {
        state.updateNode(obj.id, { width: parseInt(e.target.value) || 70 });
      });
      inspectorContent.querySelector('#prop-node-h')?.addEventListener('change', (e) => {
        state.updateNode(obj.id, { height: parseInt(e.target.value) || 70 });
      });
      inspectorContent.querySelector('#prop-node-fill')?.addEventListener('change', (e) => {
        state.updateNode(obj.id, { fill: e.target.value });
      });
      inspectorContent.querySelector('#prop-node-border')?.addEventListener('change', (e) => {
        state.updateNode(obj.id, { border: e.target.value });
      });
      inspectorContent.querySelector('#prop-dup-node-btn')?.addEventListener('click', () => {
        state.addNode({ ...obj, x: obj.x + 30, y: obj.y + 30, label: `${obj.label} (copy)` });
      });
      inspectorContent.querySelector('#prop-del-node-btn')?.addEventListener('click', () => {
        state.deleteNode(obj.id);
      });
      inspectorContent.querySelectorAll('#prop-node-size-seg .seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const s = btn.dataset.size;
          const dim = s === 'S' ? 55 : s === 'M' ? 70 : 95;
          state.updateNode(obj.id, { width: dim, height: dim });
        });
      });
      inspectorContent.querySelectorAll('#prop-node-anim-seg .seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.updateNode(obj.id, { animation: btn.dataset.anim });
        });
      });

    } else if (sel.type === 'section' && obj) {
      inspectorContent.innerHTML = `
        <div class="inspector-section">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
            <div>
              <div style="font-weight:800;font-size:1rem">${obj.title}</div>
              <div style="font-size:0.75rem;color:#64748b">group</div>
            </div>
            <div style="display:flex;gap:4px">
              <button class="btn-icon" id="prop-lock-sec-btn" title="Lock">🔒</button>
              <button class="btn-icon" id="prop-del-sec-btn" style="color:#ef4444" title="Delete">🗑</button>
            </div>
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
            <span>Transparent</span>
            <input type="checkbox" id="prop-sec-transparent" ${obj.transparent ? 'checked' : ''} />
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

      inspectorContent.querySelector('#prop-sec-title')?.addEventListener('change', (e) => {
        state.updateSection(obj.id, { title: e.target.value });
      });
      inspectorContent.querySelector('#prop-sec-subtitle')?.addEventListener('change', (e) => {
        state.updateSection(obj.id, { subtitle: e.target.value });
      });
      inspectorContent.querySelector('#prop-sec-w')?.addEventListener('change', (e) => {
        state.updateSection(obj.id, { width: parseInt(e.target.value) || 200 });
      });
      inspectorContent.querySelector('#prop-sec-h')?.addEventListener('change', (e) => {
        state.updateSection(obj.id, { height: parseInt(e.target.value) || 180 });
      });
      inspectorContent.querySelector('#prop-sec-fill')?.addEventListener('change', (e) => {
        state.updateSection(obj.id, { fill: e.target.value });
      });
      inspectorContent.querySelector('#prop-sec-transparent')?.addEventListener('change', (e) => {
        state.updateSection(obj.id, { transparent: e.target.checked });
      });
      inspectorContent.querySelector('#prop-sec-border')?.addEventListener('change', (e) => {
        state.updateSection(obj.id, { border: e.target.value });
      });
      inspectorContent.querySelectorAll('#sec-style-seg .seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.updateSection(obj.id, { borderStyle: btn.dataset.style });
        });
      });
      inspectorContent.querySelector('#prop-del-sec-btn')?.addEventListener('click', () => {
        state.deleteSection(obj.id);
      });

    } else if (sel.type === 'edge' && obj) {
      inspectorContent.innerHTML = `
        <div class="inspector-section">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
            <div>
              <div style="font-weight:800;font-size:1rem">Connection</div>
              <div style="font-size:0.75rem;color:#64748b">Edge connector</div>
            </div>
            <button class="btn-icon" id="prop-del-edge-btn" style="color:#ef4444" title="Delete">🗑</button>
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">Protocol Badge</div>
          <div class="prop-row">
            <span>Label</span>
            <input type="text" class="prop-input" id="prop-edge-label" value="${obj.label || ''}" placeholder="REST API, Query, etc." />
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

      inspectorContent.querySelector('#prop-edge-label')?.addEventListener('change', (e) => {
        state.updateEdge(obj.id, { label: e.target.value });
      });
      inspectorContent.querySelector('#prop-edge-stroke')?.addEventListener('change', (e) => {
        state.updateEdge(obj.id, { stroke: e.target.value });
      });
      inspectorContent.querySelector('#prop-del-edge-btn')?.addEventListener('click', () => {
        state.deleteEdge(obj.id);
      });

    } else {
      // Nothing selected -> Global Diagram Properties Inspector (Exact match to ByteDiagram)
      inspectorContent.innerHTML = `
        <div class="inspector-section">
          <div style="font-weight:800;font-size:1.05rem;margin-bottom:0.2rem">Diagram</div>
          <div style="font-size:0.8rem;color:#64748b">${state.diagram.nodes.length} nodes · ${state.diagram.edges.length} edges</div>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">TYPE</div>
          <div class="prop-row" style="margin-top:0.4rem">
            <span>Diagram type</span>
            <button class="btn-ghost" id="inspector-diagram-type-btn" style="border:1px solid #e2e8f0;padding:4px 10px;font-weight:700">
              ⚛ ${state.diagram.type || 'Architecture'}
            </button>
          </div>
          <p style="font-size:0.75rem;color:#64748b;margin-top:0.5rem;line-height:1.4">Services, databases, queues and how they connect across tiers.</p>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">BACKGROUND</div>
          <div class="prop-row">
            <span>Colour</span>
            <input type="color" id="prop-diag-bg" value="${state.diagram.background || '#ffffff'}" />
          </div>
          <div class="prop-row">
            <span>Show grid</span>
            <input type="checkbox" id="prop-diag-grid" ${state.diagram.showGrid !== false ? 'checked' : ''} />
          </div>
          <div class="prop-row">
            <span>Snap to grid</span>
            <input type="checkbox" id="prop-diag-snap" ${state.diagram.snapToGrid ? 'checked' : ''} />
          </div>
        </div>

        <div class="inspector-section">
          <div class="inspector-header">CHECKS</div>
          <div style="display:flex;align-items:center;justify-content:space-between;color:#10b981;font-size:0.85rem;font-weight:600">
            <span>No issues found</span>
            <span style="font-size:0.8rem">✓ All good ></span>
          </div>
        </div>
      `;

      inspectorContent.querySelector('#inspector-diagram-type-btn')?.addEventListener('click', openDiagramTypeModal);
      inspectorContent.querySelector('#prop-diag-bg')?.addEventListener('change', (e) => {
        state.diagram.background = e.target.value;
        mainCanvasContainer.style.backgroundColor = e.target.value;
      });
      inspectorContent.querySelector('#prop-diag-grid')?.addEventListener('change', (e) => {
        state.diagram.showGrid = e.target.checked;
        mainCanvasContainer.style.backgroundImage = e.target.checked ? 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)' : 'none';
      });
      inspectorContent.querySelector('#prop-diag-snap')?.addEventListener('change', (e) => {
        state.diagram.snapToGrid = e.target.checked;
      });
    }
  }

  function renderLayersTab() {
    inspectorContent.innerHTML = `
      <div class="inspector-section">
        <div class="inspector-header">Sections (${state.diagram.sections.length})</div>
        ${state.diagram.sections.map(s => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;font-size:0.85rem;border-bottom:1px solid #f1f5f9">
            <span style="cursor:pointer;font-weight:600" class="layer-sec-item" data-id="${s.id}">📁 ${s.title}</span>
            <button class="btn-icon layer-del-sec" data-id="${s.id}" style="color:#ef4444">✕</button>
          </div>
        `).join('')}
      </div>

      <div class="inspector-section">
        <div class="inspector-header">Nodes (${state.diagram.nodes.length})</div>
        ${state.diagram.nodes.map(n => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;font-size:0.85rem;border-bottom:1px solid #f1f5f9">
            <span style="cursor:pointer" class="layer-node-item" data-id="${n.id}">📦 ${n.label}</span>
            <button class="btn-icon layer-del-node" data-id="${n.id}" style="color:#ef4444">✕</button>
          </div>
        `).join('')}
      </div>
    `;

    inspectorContent.querySelectorAll('.layer-sec-item').forEach(el => {
      el.addEventListener('click', () => state.select('section', el.dataset.id));
    });
    inspectorContent.querySelectorAll('.layer-node-item').forEach(el => {
      el.addEventListener('click', () => state.select('node', el.dataset.id));
    });
    inspectorContent.querySelectorAll('.layer-del-sec').forEach(el => {
      el.addEventListener('click', () => state.deleteSection(el.dataset.id));
    });
    inspectorContent.querySelectorAll('.layer-del-node').forEach(el => {
      el.addEventListener('click', () => state.deleteNode(el.dataset.id));
    });
  }

  function renderChecksTab() {
    inspectorContent.innerHTML = `
      <div class="inspector-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
          <div style="font-weight:800;font-size:1rem">Checks</div>
          <span style="color:#10b981;font-weight:700;font-size:0.85rem">✓ All good</span>
        </div>
        <p style="font-size:0.75rem;color:#64748b;line-height:1.4">
          Structural checks for system architecture diagrams. Click an issue to select it on the canvas.
        </p>
      </div>

      <div class="inspector-section" style="border:none">
        <div style="font-size:0.8rem;color:#64748b">
          No structural checks are defined for system architecture diagrams yet.
        </div>
      </div>
    `;
  }
});
