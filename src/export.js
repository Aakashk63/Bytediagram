import { state } from './state.js';
import { TECH_ICONS } from './icons.js';

export class ExportEngine {
  static exportJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.diagram, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${(state.diagram.title || 'diagram').replace(/\s+/g, '_')}.bytediagram.json`);
    dlAnchor.click();
  }

  static importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data && data.nodes && data.edges) {
        state.diagram = data;
        state.saveSnapshot();
        state.notify('diagram_change');
        return true;
      }
    } catch (e) {
      console.error('Import error', e);
    }
    return false;
  }

  static exportSVG() {
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

    const pad = 60;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    const width = Math.max(maxX - minX + pad * 2, 800);
    const height = Math.max(maxY - minY + pad * 2, 600);

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" width="${width}" height="${height}" style="background:#fafafa; font-family:'Plus Jakarta Sans',sans-serif;">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#64748b"/>
        </marker>
        <pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#cbd5e1"/>
        </pattern>
      </defs>
      <rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="url(#dot-grid)"/>
    `;

    // Sections
    state.diagram.sections.forEach(s => {
      svgContent += `
        <rect x="${s.x}" y="${s.y}" width="${s.width}" height="${s.height}" rx="12" 
          fill="${s.fill || '#f8fafc'}" stroke="${s.border || '#94a3b8'}" stroke-width="1.5" stroke-dasharray="6 6"/>
        <text x="${s.x + 16}" y="${s.y + 24}" font-size="14" font-weight="700" fill="#334155">${s.title}</text>
      `;
    });

    // Edges
    state.diagram.edges.forEach(e => {
      const fromNode = state.diagram.nodes.find(n => n.id === e.from);
      const toNode = state.diagram.nodes.find(n => n.id === e.to);
      if (!fromNode || !toNode) return;
      const x1 = fromNode.x + fromNode.width;
      const y1 = fromNode.y + fromNode.height / 2;
      const x2 = toNode.x;
      const y2 = toNode.y + toNode.height / 2;
      const dx = Math.abs(x2 - x1);
      const offset = Math.max(dx * 0.5, 40);
      const d = `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      svgContent += `
        <path d="${d}" fill="none" stroke="${e.stroke || '#64748b'}" stroke-width="2" marker-end="url(#arrow)"/>
        ${e.label ? `
          <g transform="translate(${midX}, ${midY})">
            <rect x="-35" y="-12" width="70" height="24" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
            <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">${e.label}</text>
          </g>
        ` : ''}
      `;
    });

    // Nodes
    state.diagram.nodes.forEach(n => {
      const iconDef = TECH_ICONS[n.icon] || TECH_ICONS.nodejs;
      svgContent += `
        <g transform="translate(${n.x}, ${n.y})">
          <rect width="${n.width}" height="${n.height}" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))"/>
          <text x="${n.width / 2}" y="${n.height + 18}" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">${n.label}</text>
          <g transform="translate(${n.width / 2 - 16}, 12)">
            ${iconDef.svg}
          </g>
        </g>
      `;
    });

    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', url);
    dlAnchor.setAttribute('download', `${(state.diagram.title || 'diagram').replace(/\s+/g, '_')}.svg`);
    dlAnchor.click();
  }

  static exportPNG() {
    // Generate SVG string then draw onto offscreen canvas for crisp high-DPI PNG
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

    const pad = 60;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    const width = Math.max(maxX - minX + pad * 2, 800);
    const height = Math.max(maxY - minY + pad * 2, 600);

    const canvas = document.createElement('canvas');
    const scale = 2; // Retina 2x
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Draw background
    ctx.fillStyle = state.diagram.background || '#fafafa';
    ctx.fillRect(0, 0, width, height);

    // Draw dot grid
    ctx.fillStyle = '#cbd5e1';
    for (let x = 0; x < width; x += 24) {
      for (let y = 0; y < height; y += 24) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw sections
    state.diagram.sections.forEach(s => {
      const rx = s.x - minX;
      const ry = s.y - minY;
      ctx.fillStyle = s.fill || '#f8fafc';
      ctx.strokeStyle = s.border || '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash(s.borderStyle === 'dashed' ? [6, 6] : []);
      ctx.beginPath();
      ctx.roundRect(rx, ry, s.width, s.height, 12);
      ctx.fill();
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(s.title, rx + 16, ry + 24);
    });

    // Draw edges
    state.diagram.edges.forEach(e => {
      const fromNode = state.diagram.nodes.find(n => n.id === e.from);
      const toNode = state.diagram.nodes.find(n => n.id === e.to);
      if (!fromNode || !toNode) return;

      const x1 = fromNode.x - minX + fromNode.width;
      const y1 = fromNode.y - minY + fromNode.height / 2;
      const x2 = toNode.x - minX;
      const y2 = toNode.y - minY + toNode.height / 2;

      const dx = Math.abs(x2 - x1);
      const offset = Math.max(dx * 0.5, 40);

      ctx.strokeStyle = e.stroke || '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(x1 + offset, y1, x2 - offset, y2, x2, y2);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = e.stroke || '#64748b';
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 8, y2 - 4);
      ctx.lineTo(x2 - 8, y2 + 4);
      ctx.closePath();
      ctx.fill();

      // Label badge
      if (e.label) {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(midX - 35, midY - 12, 70, 24, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#334155';
        ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(e.label, midX, midY);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
      }
    });

    // Draw nodes
    state.diagram.nodes.forEach(n => {
      const nx = n.x - minX;
      const ny = n.y - minY;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(nx, ny, n.width, n.height, 14);
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = '#1e293b';
      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, nx + n.width / 2, ny + n.height + 18);
      ctx.textAlign = 'left';
    });

    const url = canvas.toDataURL('image/png');
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', url);
    dlAnchor.setAttribute('download', `${(state.diagram.title || 'diagram').replace(/\s+/g, '_')}.png`);
    dlAnchor.click();
  }
}
