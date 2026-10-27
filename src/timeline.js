import { state } from './state.js';

export class TimelineEngine {
  constructor(trayEl, canvasSvgPackets) {
    this.tray = trayEl;
    this.svgPackets = canvasSvgPackets;
    this.animationFrameId = null;
    this.lastTimestamp = null;
    this.isTaller = false;

    this.initElements();
    this.initEvents();
    this.render();

    state.subscribe((event) => {
      if (event === 'diagram_change' || event === 'template_loaded') {
        this.render();
      }
    });
  }

  initElements() {
    this.playBtn = this.tray.querySelector('#timeline-play-btn');
    this.stopBtn = this.tray.querySelector('#timeline-stop-btn');
    this.startBtn = this.tray.querySelector('#timeline-start-btn');
    this.loopBtn = this.tray.querySelector('#timeline-loop-btn');
    this.resetBtn = this.tray.querySelector('#timeline-reset-btn');
    this.rebuildAiBtn = this.tray.querySelector('#timeline-rebuild-ai-btn');
    this.tallerBtn = this.tray.querySelector('#timeline-taller-btn');
    this.closeBtn = this.tray.querySelector('#timeline-close-btn');
    this.timeLabel = this.tray.querySelector('#timeline-time-label');
    this.scrubber = this.tray.querySelector('#timeline-scrubber');
    this.tracksContainer = this.tray.querySelector('#timeline-tracks');
    this.stepsList = this.tray.querySelector('#timeline-steps-list');
  }

  initEvents() {
    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.stopBtn.addEventListener('click', () => this.stop());
    this.startBtn.addEventListener('click', () => this.seek(0));
    this.resetBtn.addEventListener('click', () => this.seek(0));
    this.closeBtn.addEventListener('click', () => {
      state.isTimelineOpen = false;
      this.tray.style.display = 'none';
      const floatingBadge = document.querySelector('#timeline-open-badge');
      if (floatingBadge) floatingBadge.style.display = 'none';
    });

    this.tallerBtn.addEventListener('click', () => {
      this.isTaller = !this.isTaller;
      this.tray.classList.toggle('taller', this.isTaller);
      this.tallerBtn.textContent = this.isTaller ? '⤡ Shorter' : '⤢ Taller';
    });

    this.loopBtn.addEventListener('click', () => {
      state.diagram.timeline.loop = !state.diagram.timeline.loop;
      this.loopBtn.classList.toggle('active', state.diagram.timeline.loop);
    });

    this.rebuildAiBtn.addEventListener('click', () => {
      this.rebuildWithAi();
    });

    this.scrubber.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.seek(val);
    });

    // Spacebar to play/pause
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && state.view === 'editor' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        this.togglePlay();
      }
    });
  }

  togglePlay() {
    if (state.diagram.timeline.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    state.diagram.timeline.isPlaying = true;
    this.playBtn.innerHTML = '⏸ Pause';
    this.lastTimestamp = performance.now();
    this.tick();
  }

  pause() {
    state.diagram.timeline.isPlaying = false;
    this.playBtn.innerHTML = '▶ Play';
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  stop() {
    this.pause();
    this.seek(0);
    this.svgPackets.innerHTML = '';
  }

  seek(time) {
    state.diagram.timeline.currentTime = Math.max(0, Math.min(time, state.diagram.timeline.duration));
    this.scrubber.value = state.diagram.timeline.currentTime;
    this.updateTimeDisplay();
    this.updatePacketSimulation();
  }

  tick() {
    if (!state.diagram.timeline.isPlaying) return;

    const now = performance.now();
    const dt = (now - this.lastTimestamp) / 1000;
    this.lastTimestamp = now;

    let nextTime = state.diagram.timeline.currentTime + dt;
    if (nextTime >= state.diagram.timeline.duration) {
      if (state.diagram.timeline.loop) {
        nextTime = 0;
      } else {
        nextTime = state.diagram.timeline.duration;
        this.stop();
        return;
      }
    }

    this.seek(nextTime);
    this.animationFrameId = requestAnimationFrame(() => this.tick());
  }

  updateTimeDisplay() {
    const cur = state.diagram.timeline.currentTime.toFixed(1).padStart(4, '0');
    const dur = state.diagram.timeline.duration.toFixed(1).padStart(4, '0');
    this.timeLabel.textContent = `00:${cur} / 00:${dur}`;
  }

  updatePacketSimulation() {
    const steps = state.diagram.timeline.steps || [];
    const t = state.diagram.timeline.currentTime;
    this.svgPackets.innerHTML = '';

    // Find active step
    steps.forEach((step, idx) => {
      const stepStart = step.time;
      const stepEnd = (idx < steps.length - 1) ? steps[idx + 1].time : state.diagram.timeline.duration;
      
      if (t >= stepStart && t <= stepEnd) {
        const edge = state.diagram.edges.find(e => e.id === step.edgeId);
        if (edge) {
          const fromNode = state.diagram.nodes.find(n => n.id === edge.from);
          const toNode = state.diagram.nodes.find(n => n.id === edge.to);
          if (fromNode && toNode) {
            const stepDuration = Math.max(stepEnd - stepStart, 0.1);
            const progress = (t - stepStart) / stepDuration; // 0 to 1

            const x1 = fromNode.x + fromNode.width;
            const y1 = fromNode.y + fromNode.height / 2;
            const x2 = toNode.x;
            const y2 = toNode.y + toNode.height / 2;

            // Compute point along cubic bezier
            const pt = this.getCubicBezierPoint(x1, y1, x2, y2, progress);

            // Draw glowing packet
            this.svgPackets.innerHTML = `
              <!-- Aura halo -->
              <circle cx="${pt.x}" cy="${pt.y}" r="12" fill="#3b82f6" opacity="0.3">
                <animate attributeName="r" values="8;16;8" dur="0.8s" repeatCount="indefinite"/>
              </circle>
              <!-- Core packet -->
              <circle cx="${pt.x}" cy="${pt.y}" r="6" fill="#60a5fa" stroke="#ffffff" stroke-width="2"/>
            `;
          }
        }
      }
    });
  }

  getCubicBezierPoint(x1, y1, x2, y2, t) {
    const dx = Math.abs(x2 - x1);
    const offset = Math.max(dx * 0.5, 40);
    const cx1 = x1 + offset;
    const cy1 = y1;
    const cx2 = x2 - offset;
    const cy2 = y2;

    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    const x = uuu * x1 + 3 * uu * t * cx1 + 3 * u * tt * cx2 + ttt * x2;
    const y = uuu * y1 + 3 * uu * t * cy1 + 3 * u * tt * cy2 + ttt * y2;
    return { x, y };
  }

  rebuildWithAi() {
    const edges = state.diagram.edges;
    if (edges.length === 0) return;

    const stepDuration = 1.0;
    const totalDuration = edges.length * stepDuration;
    state.diagram.timeline.duration = totalDuration;
    state.diagram.timeline.steps = edges.map((edge, idx) => {
      const from = state.diagram.nodes.find(n => n.id === edge.from)?.label || 'Source';
      const to = state.diagram.nodes.find(n => n.id === edge.to)?.label || 'Target';
      return {
        id: idx + 1,
        name: `${idx + 1}. ${edge.label || 'Transfer'}`,
        time: idx * stepDuration,
        edgeId: edge.id,
        description: `${from} routes payload to ${to}`
      };
    });

    state.saveSnapshot();
    this.render();
  }

  render() {
    const tpl = state.diagram.timeline;
    this.scrubber.max = tpl.duration;
    this.scrubber.value = tpl.currentTime;
    this.updateTimeDisplay();

    // Render Steps in side list
    if (this.stepsList) {
      this.stepsList.innerHTML = '';
      (tpl.steps || []).forEach(step => {
        const item = document.createElement('div');
        item.className = 'timeline-step-item';
        item.innerHTML = `
          <div class="step-badge">${step.id}</div>
          <div class="step-meta">
            <div class="step-title">${step.name}</div>
            <div class="step-desc">${step.description}</div>
          </div>
          <div class="step-time">${step.time.toFixed(1)}s</div>
        `;
        item.addEventListener('click', () => {
          this.seek(step.time);
        });
        this.stepsList.appendChild(item);
      });
    }

    // Render Node track step blocks
    const nodeTrackRow = this.tray.querySelector('#track-nodes-row');
    if (nodeTrackRow) {
      nodeTrackRow.innerHTML = '';
      (tpl.steps || []).forEach((step, idx) => {
        const block = document.createElement('div');
        block.className = 'track-step-block';
        const leftPercent = (step.time / tpl.duration) * 100;
        const widthPercent = (1.0 / tpl.duration) * 100;
        block.style.left = `${leftPercent}%`;
        block.style.width = `${Math.min(widthPercent, 100 - leftPercent)}%`;
        block.textContent = step.name;
        block.addEventListener('click', () => this.seek(step.time));
        nodeTrackRow.appendChild(block);
      });
    }
  }
}
