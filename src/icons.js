import rawIconCategories from './iconCategories.json';

// Export complete categorized tech icons
export const ICON_CATEGORIES = rawIconCategories;

// Flattened lookup map for instant icon retrieval by name or key
export const TECH_ICONS = {};

// Built-in fallback icons with crisp inline SVGs
const DEFAULT_INLINE_SVGS = {
  react: {
    name: 'React',
    color: '#00d8ff',
    svg: `<svg viewBox="0 0 115.3 100" fill="none"><ellipse cx="57.65" cy="50" rx="10" ry="24" stroke="#00d8ff" stroke-width="4.5" transform="rotate(30 57.65 50)"/><ellipse cx="57.65" cy="50" rx="10" ry="24" stroke="#00d8ff" stroke-width="4.5" transform="rotate(90 57.65 50)"/><ellipse cx="57.65" cy="50" rx="10" ry="24" stroke="#00d8ff" stroke-width="4.5" transform="rotate(150 57.65 50)"/><circle cx="57.65" cy="50" r="5" fill="#00d8ff"/></svg>`
  },
  nodejs: {
    name: 'Node.js',
    color: '#539e43',
    svg: `<svg viewBox="0 0 32 32" fill="none"><path d="M16 2L3 9.5V24.5L16 32L29 24.5V9.5L16 2Z" fill="#539e43"/><path d="M16 5L26 11V23L16 29L6 23V11L16 5Z" fill="#333333"/><path d="M12 11H15V19C15 20.5 13.5 21 12 21H10V18.5H11.5C12 18.5 12.5 18.2 12.5 17.5V11H12Z" fill="#ffffff"/><path d="M21 15C21 13 19.5 12.5 18 12.5C16.5 12.5 15.5 13.2 15.5 14.5C15.5 17 21 16 21 19C21 21 19.5 21.5 18 21.5C16 21.5 15 20.5 15 19H17.5C17.5 19.5 18 19.8 18.5 19.8C19 19.8 19.5 19.5 19.5 19C19.5 17 14 17.8 14 14.5C14 12.5 15.5 11 18 11C20.5 11 21.5 12.5 21.5 14H19" fill="#ffffff"/></svg>`
  },
  mongodb: {
    name: 'MongoDB',
    color: '#13aa52',
    svg: `<svg viewBox="0 0 32 32" fill="none"><path d="M16 2C15.5 6 11 12 11 18C11 23 13.5 27.5 16 30C18.5 27.5 21 23 21 18C21 12 16.5 6 16 2Z" fill="#13aa52"/><path d="M16 2V30C18.5 27.5 21 23 21 18C21 12 16.5 6 16 2Z" fill="#116149"/><path d="M16 29.5C15.5 29.5 15 28 15 26H17C17 28 16.5 29.5 16 29.5Z" fill="#a6a495"/></svg>`
  },
  postgresql: {
    name: 'PostgreSQL',
    color: '#336791',
    svg: `<svg viewBox="0 0 32 32" fill="none"><path d="M16 3C10.5 3 6.5 6.5 6 12C5.5 17 8 21.5 11 24V29H14V25C14.7 25.2 15.3 25.3 16 25.3C16.7 25.3 17.3 25.2 18 25V29H21V24C24 21.5 26.5 17 26 12C25.5 6.5 21.5 3 16 3Z" fill="#336791"/><ellipse cx="12" cy="11" rx="2" ry="3" fill="#ffffff"/><ellipse cx="20" cy="11" rx="2" ry="3" fill="#ffffff"/><circle cx="12" cy="11" r="1.2" fill="#1e293b"/><circle cx="20" cy="11" r="1.2" fill="#1e293b"/></svg>`
  },
  redis: {
    name: 'Redis',
    color: '#dc382d',
    svg: `<svg viewBox="0 0 32 32" fill="none"><path d="M16 2L2 9L16 16L30 9L16 2Z" fill="#d82c20"/><path d="M2 9V17L16 24V16L2 9Z" fill="#a32219"/><path d="M30 9V17L16 24V16L30 9Z" fill="#b9271d"/><path d="M2 17V23L16 30V24L2 17Z" fill="#7a1913"/><path d="M30 17V23L16 30V24L30 17Z" fill="#8f1e16"/></svg>`
  },
  kafka: {
    name: 'Kafka',
    color: '#231f20',
    svg: `<svg viewBox="0 0 32 32" fill="none"><circle cx="8" cy="8" r="4" fill="#231f20"/><circle cx="24" cy="8" r="4" fill="#231f20"/><circle cx="16" cy="16" r="4" fill="#231f20"/><circle cx="8" cy="24" r="4" fill="#231f20"/><circle cx="24" cy="24" r="4" fill="#231f20"/><line x1="8" y1="8" x2="16" y2="16" stroke="#231f20" stroke-width="2.5"/><line x1="24" y1="8" x2="16" y2="16" stroke="#231f20" stroke-width="2.5"/><line x1="8" y1="24" x2="16" y2="16" stroke="#231f20" stroke-width="2.5"/><line x1="24" y1="24" x2="16" y2="16" stroke="#231f20" stroke-width="2.5"/><circle cx="16" cy="16" r="2" fill="#ffffff"/></svg>`
  },
  nginx: {
    name: 'Nginx',
    color: '#009639',
    svg: `<svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#009639"/><path d="M8 8V24L18 8V24" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="24" y1="8" x2="24" y2="24" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/></svg>`
  },
  docker: {
    name: 'Docker',
    color: '#2496ed',
    svg: `<svg viewBox="0 0 32 32" fill="none"><path d="M30 18C29 14 26 13 24 13C23 13 22 13.5 21 14C19.5 13.5 18 14 17 15H3C2 15 1 16 1 18C1 24 6 28 15 28C24 28 29.5 22 30 18Z" fill="#2496ed"/><rect x="5" y="11" width="3" height="3" fill="#2496ed"/><rect x="9" y="11" width="3" height="3" fill="#2496ed"/><rect x="13" y="11" width="3" height="3" fill="#2496ed"/><circle cx="24" cy="18" r="1.5" fill="#ffffff"/></svg>`
  },
  kubernetes: {
    name: 'Kubernetes',
    color: '#326ce5',
    svg: `<svg viewBox="0 0 32 32" fill="none"><path d="M16 2L4 9V23L16 30L28 23V9L16 2Z" fill="#326ce5"/><circle cx="16" cy="16" r="4.5" fill="#ffffff"/><line x1="16" y1="6" x2="16" y2="11.5" stroke="#ffffff" stroke-width="2"/><line x1="16" y1="20.5" x2="16" y2="26" stroke="#ffffff" stroke-width="2"/><line x1="7" y1="11" x2="12" y2="13.5" stroke="#ffffff" stroke-width="2"/><line x1="20" y1="18.5" x2="25" y2="21" stroke="#ffffff" stroke-width="2"/></svg>`
  },
  aws: {
    name: 'AWS',
    color: '#ff9900',
    svg: `<svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#232f3e"/><path d="M7 15L10 8H12L15 15H13L12.2 13H9.8L9 15H7ZM10.2 11.5H11.8L11 9.5L10.2 11.5Z" fill="#ffffff"/><path d="M16 8H18L19.5 13L21 8H23L24.5 13L26 8H28L25.5 15H23.5L22 10.5L20.5 15H18.5L16 8Z" fill="#ffffff"/><path d="M8 21C14 25 20 25 25 21" stroke="#ff9900" stroke-width="2.5" stroke-linecap="round"/><path d="M23 19L26 21L24 23" fill="#ff9900"/></svg>`
  },
  azure: {
    name: 'Azure',
    color: '#0089d6',
    svg: `<svg viewBox="0 0 32 32" fill="none"><path d="M7 26L16 4L22 15L12 26H7Z" fill="#0089d6"/><path d="M17 17L22 8L27 26H13L17 17Z" fill="#0072c6"/></svg>`
  },
  gcp: {
    name: 'Google Cloud',
    color: '#4285f4',
    svg: `<svg viewBox="0 0 32 32" fill="none"><path d="M19.5 9.5L16.5 4.5L10 15L13 20L19.5 9.5Z" fill="#ea4335"/><path d="M22 14L19.5 9.5L13 20H19L22 14Z" fill="#4285f4"/><path d="M10 15L6.5 21H19L16 15H10Z" fill="#34a853"/><path d="M22 14L19 20H25.5L28.5 14H22Z" fill="#fbbc05"/></svg>`
  },
  s3: {
    name: 'AWS S3',
    color: '#e25946',
    svg: `<svg viewBox="0 0 32 32" fill="none"><rect x="4" y="5" width="24" height="22" rx="4" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/><ellipse cx="16" cy="11" rx="8" ry="3" fill="#ef4444"/><path d="M8 11V21C8 22.7 11.6 24 16 24C20.4 24 24 22.7 24 21V11" stroke="#ef4444" stroke-width="2"/></svg>`
  },
  queue: {
    name: 'Queue / RabbitMQ',
    color: '#ff6600',
    svg: `<svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#fff7ed"/><path d="M6 16H26M6 10H26M6 22H26" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/></svg>`
  },
  browser: {
    name: 'Browser / Client',
    color: '#0284c7',
    svg: `<svg viewBox="0 0 32 32" fill="none"><rect x="3" y="5" width="26" height="18" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/><line x1="3" y1="10" x2="29" y2="10" stroke="#0284c7" stroke-width="1.5"/><circle cx="6" cy="7.5" r="1" fill="#0284c7"/><circle cx="9" cy="7.5" r="1" fill="#0284c7"/><circle cx="12" cy="7.5" r="1" fill="#0284c7"/></svg>`
  },
  mobile_app: {
    name: 'Mobile App',
    color: '#8b5cf6',
    svg: `<svg viewBox="0 0 32 32" fill="none"><rect x="8" y="4" width="16" height="24" rx="4" fill="#ede9fe" stroke="#8b5cf6" stroke-width="2"/><circle cx="16" cy="24" r="1.5" fill="#8b5cf6"/><line x1="13" y1="7" x2="19" y2="7" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round"/></svg>`
  },
  load_balancer: {
    name: 'Load Balancer',
    color: '#0d9488',
    svg: `<svg viewBox="0 0 32 32" fill="none"><circle cx="7" cy="16" r="3" fill="#0d9488"/><circle cx="25" cy="8" r="3" fill="#0d9488"/><circle cx="25" cy="16" r="3" fill="#0d9488"/><circle cx="25" cy="24" r="3" fill="#0d9488"/><path d="M10 16L22 8M10 16H22M10 16L22 24" stroke="#0d9488" stroke-width="2"/></svg>`
  },
  api_gateway: {
    name: 'API Gateway',
    color: '#10b981',
    svg: `<svg viewBox="0 0 32 32" fill="none"><rect x="4" y="5" width="24" height="22" rx="4" fill="#d1fae5" stroke="#10b981" stroke-width="2"/><path d="M10 11H22M10 16H22M10 21H16" stroke="#10b981" stroke-width="2" stroke-linecap="round"/><circle cx="21" cy="21" r="2" fill="#10b981"/></svg>`
  },
  microservice: {
    name: 'Microservice',
    color: '#f59e0b',
    svg: `<svg viewBox="0 0 32 32" fill="none"><rect x="5" y="7" width="22" height="18" rx="4" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/><circle cx="11" cy="16" r="3" fill="#f59e0b"/><circle cx="21" cy="16" r="3" fill="#f59e0b"/><line x1="14" y1="16" x2="18" y2="16" stroke="#f59e0b" stroke-width="2"/></svg>`
  },
  // Geometric shape icons
  rect_shape: {
    name: 'Rectangle',
    color: '#64748b',
    svg: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.8"/></svg>`
  },
  circle_shape: {
    name: 'Circle',
    color: '#64748b',
    svg: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#f8fafc" stroke="#475569" stroke-width="1.8"/></svg>`
  },
  diamond_shape: {
    name: 'Diamond',
    color: '#64748b',
    svg: `<svg viewBox="0 0 24 24" fill="none"><polygon points="12,3 21,12 12,21 3,12" fill="#f8fafc" stroke="#475569" stroke-width="1.8"/></svg>`
  },
  cylinder_shape: {
    name: 'Database',
    color: '#64748b',
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 6C4 4.5 7.5 3 12 3C16.5 3 20 4.5 20 6V18C20 19.5 16.5 21 12 21C7.5 21 4 19.5 4 18V6Z" fill="#f8fafc" stroke="#475569" stroke-width="1.8"/><ellipse cx="12" cy="6" rx="8" ry="3" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/></svg>`
  }
};

// Populate TECH_ICONS lookup map
Object.assign(TECH_ICONS, DEFAULT_INLINE_SVGS);

// Also index all icons from rawIconCategories
Object.entries(rawIconCategories).forEach(([category, icons]) => {
  icons.forEach(icon => {
    const key = icon.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (!TECH_ICONS[key]) {
      TECH_ICONS[key] = {
        name: icon.name,
        category,
        url: icon.url,
        svg: `<img src="${icon.url}" alt="${icon.name}" style="width:100%;height:100%;object-fit:contain;" loading="lazy"/>`
      };
    }
  });
});

// =========================================================================
// EXACT SHAPES CATALOG (Extracted directly from ByteDiagram Production Code)
// Matches exact categories, counts, SVG previews, and node attributes
// =========================================================================

export const SHAPES_CATALOG = {
  // 1. Text Presets
  text: [
    {
      id: 'heading',
      kind: 'heading',
      name: 'Your Heading',
      label: 'HEADING',
      previewClass: 'text-sm font-bold text-slate-900',
      fontSize: 22,
      fontWeight: '800',
      defaultSize: { width: 160, height: 42 }
    },
    {
      id: 'title',
      kind: 'title',
      name: 'Your Title',
      label: 'TITLE',
      previewClass: 'text-sm font-semibold text-slate-700',
      fontSize: 16,
      fontWeight: '700',
      defaultSize: { width: 130, height: 36 }
    },
    {
      id: 'paragraph',
      kind: 'paragraph',
      name: 'Your paragraph text goes here...',
      label: 'PARAGRAPH',
      previewClass: 'text-xs text-slate-500',
      fontSize: 13,
      fontWeight: '400',
      defaultSize: { width: 200, height: 48 }
    }
  ],

  // 2. Sections / Group Containers (Exact Do from ByteDiagram)
  sections: [
    {
      id: 'standard',
      name: 'Section',
      description: 'Dashed zone for grouping nodes',
      previewBorder: '2px dashed #3b82f6',
      previewBg: '#eff6ff',
      data: {
        title: 'Section',
        subtitle: 'Dashed zone for grouping nodes',
        width: 250,
        height: 210,
        fill: '#eff6ff',
        border: '#3b82f6',
        borderStyle: 'dashed',
        blur: 0,
        shadow: 0
      }
    },
    {
      id: 'frosted',
      name: 'Frosted Section',
      description: 'Glass blur behind section',
      previewBorder: '1px solid #93c5fd',
      previewBg: 'rgba(255, 255, 255, 0.75)',
      data: {
        title: 'Frosted Section',
        subtitle: 'Glass blur background',
        width: 250,
        height: 210,
        fill: '#ffffff',
        border: '#93c5fd',
        borderStyle: 'solid',
        blur: 16,
        shadow: 12
      }
    },
    {
      id: 'card',
      name: 'Card Section',
      description: 'Elevated card with soft shadow',
      previewBorder: '1px solid #e2e8f0',
      previewBg: '#ffffff',
      data: {
        title: 'Card Section',
        subtitle: 'Elevated card container',
        width: 250,
        height: 210,
        fill: '#ffffff',
        border: '#e2e8f0',
        borderStyle: 'solid',
        blur: 0,
        shadow: 24
      }
    }
  ],

  // 3. Architecture Components (Exact 18 Components from ByteDiagram ip array)
  architecture: [
    {
      id: 'rectangle',
      name: 'Rectangle',
      shortName: 'Rec',
      category: 'shape',
      nodeType: 'shape',
      shape: 'rectangle',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" fill="#ffffff" stroke="#64748b" stroke-width="1.8"/></svg>`
    },
    {
      id: 'circle',
      name: 'Circle',
      shortName: 'Cir',
      category: 'shape',
      nodeType: 'shape',
      shape: 'circle',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#ffffff" stroke="#64748b" stroke-width="1.8"/></svg>`
    },
    {
      id: 'diamond',
      name: 'Diamond',
      shortName: 'Dia',
      category: 'shape',
      nodeType: 'shape',
      shape: 'diamond',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><polygon points="12,3 21,12 12,21 3,12" fill="#ffffff" stroke="#64748b" stroke-width="1.8"/></svg>`
    },
    {
      id: 'database',
      name: 'Database',
      shortName: 'Dat',
      category: 'data',
      nodeType: 'shape',
      shape: 'cylinder',
      icon: 'postgresql',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 6C4 4.5 7.5 3 12 3C16.5 3 20 4.5 20 6V18C20 19.5 16.5 21 12 21C7.5 21 4 19.5 4 18V6Z" fill="#ffffff" stroke="#64748b" stroke-width="1.8"/><ellipse cx="12" cy="6" rx="8" ry="3" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5"/></svg>`
    },
    {
      id: 'api_gateway',
      name: 'API Gateway',
      shortName: 'API...',
      category: 'network',
      nodeType: 'custom',
      icon: 'api_gateway',
      svgPreview: DEFAULT_INLINE_SVGS.nginx.svg
    },
    {
      id: 'microservice',
      name: 'Microservice',
      shortName: 'Microservice',
      category: 'compute',
      nodeType: 'custom',
      icon: 'microservice',
      svgPreview: DEFAULT_INLINE_SVGS.microservice.svg
    },
    {
      id: 'kubernetes',
      name: 'Kubernetes',
      shortName: 'Kubernetes',
      category: 'cloud',
      nodeType: 'custom',
      icon: 'kubernetes',
      svgPreview: DEFAULT_INLINE_SVGS.kubernetes.svg
    },
    {
      id: 'redis',
      name: 'Redis',
      shortName: 'Redis',
      category: 'data',
      nodeType: 'custom',
      icon: 'redis',
      svgPreview: DEFAULT_INLINE_SVGS.redis.svg
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      shortName: 'PostgreSQL',
      category: 'data',
      nodeType: 'custom',
      icon: 'postgresql',
      svgPreview: DEFAULT_INLINE_SVGS.postgresql.svg
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      shortName: 'MongoDB',
      category: 'data',
      nodeType: 'custom',
      icon: 'mongodb',
      svgPreview: DEFAULT_INLINE_SVGS.mongodb.svg
    },
    {
      id: 's3',
      name: 'S3',
      shortName: 'S3',
      category: 'cloud',
      nodeType: 'custom',
      icon: 's3',
      svgPreview: DEFAULT_INLINE_SVGS.s3.svg
    },
    {
      id: 'queue',
      name: 'Queue',
      shortName: 'Queue',
      category: 'data',
      nodeType: 'custom',
      icon: 'queue',
      svgPreview: DEFAULT_INLINE_SVGS.queue.svg
    },
    {
      id: 'mobile_app',
      name: 'Mobile App',
      shortName: 'Mobile...',
      category: 'client',
      nodeType: 'custom',
      icon: 'mobile_app',
      svgPreview: DEFAULT_INLINE_SVGS.mobile_app.svg
    },
    {
      id: 'browser',
      name: 'Browser',
      shortName: 'Browser',
      category: 'client',
      nodeType: 'custom',
      icon: 'browser',
      svgPreview: DEFAULT_INLINE_SVGS.browser.svg
    },
    {
      id: 'load_balancer',
      name: 'Load Balancer',
      shortName: 'Load...',
      category: 'network',
      nodeType: 'custom',
      icon: 'load_balancer',
      svgPreview: DEFAULT_INLINE_SVGS.load_balancer.svg
    },
    {
      id: 'aws',
      name: 'AWS',
      shortName: 'AWS',
      category: 'cloud',
      nodeType: 'custom',
      icon: 'aws',
      svgPreview: DEFAULT_INLINE_SVGS.aws.svg
    },
    {
      id: 'gcp',
      name: 'Google Cloud',
      shortName: 'Google...',
      category: 'cloud',
      nodeType: 'custom',
      icon: 'gcp',
      svgPreview: DEFAULT_INLINE_SVGS.gcp.svg
    },
    {
      id: 'azure',
      name: 'Azure',
      shortName: 'Azure',
      category: 'cloud',
      nodeType: 'custom',
      icon: 'azure',
      svgPreview: DEFAULT_INLINE_SVGS.azure.svg
    }
  ],

  // 4. Elements (Exact 8 geometric vector shapes from ByteDiagram rh array)
  elements: [
    {
      id: 'square',
      name: 'Square',
      shape: 'square',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" fill="#ffffff" stroke="#334155" stroke-width="1.8"/></svg>`
    },
    {
      id: 'circle',
      name: 'Circle',
      shape: 'circle',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#ffffff" stroke="#334155" stroke-width="1.8"/></svg>`
    },
    {
      id: 'rectangle',
      name: 'Pill',
      shape: 'pill',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="6" fill="#ffffff" stroke="#334155" stroke-width="1.8"/></svg>`
    },
    {
      id: 'ellipse',
      name: 'Ellipse',
      shape: 'ellipse',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="10" ry="6" fill="#ffffff" stroke="#334155" stroke-width="1.8"/></svg>`
    },
    {
      id: 'star',
      name: 'Star',
      shape: 'star',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><polygon points="12,2 15,8.5 22,9.3 17,14.2 18.2,21.1 12,17.7 5.8,21.1 7,14.2 2,9.3 9,8.5" fill="#334155"/></svg>`
    },
    {
      id: 'hexagon',
      name: 'Hexagon',
      shape: 'hexagon',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><polygon points="7,3 17,3 22,12 17,21 7,21 2,12" fill="#334155"/></svg>`
    },
    {
      id: 'octagon',
      name: 'Octagon',
      shape: 'octagon',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7" fill="#334155"/></svg>`
    },
    {
      id: 'trapezoid',
      name: 'Trapezoid',
      shape: 'trapezoid',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><polygon points="5,4 19,4 23,20 1,20" fill="#334155"/></svg>`
    }
  ],

  // 5. General Diagram Shapes (Exact 12 shapes from Za.general in ByteDiagram)
  general: [
    {
      id: 'g_cylinder',
      name: 'Database',
      shape: 'cylinder',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 6C4 4.5 7.5 3 12 3C16.5 3 20 4.5 20 6V18C20 19.5 16.5 21 12 21C7.5 21 4 19.5 4 18V6Z" fill="#f8fafc" stroke="#475569" stroke-width="1.8"/><ellipse cx="12" cy="6" rx="8" ry="3" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/></svg>`
    },
    {
      id: 'g_document',
      name: 'Document',
      shape: 'document',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 3H15L19 7V21H5V3Z" fill="#ffffff" stroke="#475569" stroke-width="1.8"/><polyline points="14 3 14 8 19 8" stroke="#475569" stroke-width="1.5"/></svg>`
    },
    {
      id: 'g_multi_doc',
      name: 'Multi-doc',
      shape: 'multi_doc',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><rect x="7" y="3" width="13" height="15" rx="1.5" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/><rect x="4" y="6" width="13" height="15" rx="1.5" fill="#ffffff" stroke="#475569" stroke-width="1.8"/></svg>`
    },
    {
      id: 'g_cloud',
      name: 'Cloud',
      shape: 'cloud',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 19A5 5 0 0 1 5 9.2A7 7 0 0 1 18.5 7A5.5 5.5 0 0 1 19 19H6Z" fill="#f8fafc" stroke="#475569" stroke-width="1.8"/></svg>`
    },
    {
      id: 'g_person',
      name: 'User / Actor',
      shape: 'person',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7" r="4" fill="#f8fafc" stroke="#475569" stroke-width="1.8"/><path d="M4 21C4 16.5 7.5 14 12 14C16.5 14 20 16.5 20 21" stroke="#475569" stroke-width="1.8"/></svg>`
    },
    {
      id: 'g_cube',
      name: 'Component',
      shape: 'cube',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><polygon points="12,2 22,7.5 12,13 2,7.5" fill="#e2e8f0" stroke="#475569" stroke-width="1.6"/><polygon points="2,7.5 12,13 12,22 2,16.5" fill="#cbd5e1" stroke="#475569" stroke-width="1.6"/><polygon points="22,7.5 12,13 12,22 22,16.5" fill="#f1f5f9" stroke="#475569" stroke-width="1.6"/></svg>`
    },
    {
      id: 'g_folder',
      name: 'Package',
      shape: 'folder',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><path d="M3 6H9L11 9H21V19H3V6Z" fill="#fef3c7" stroke="#d97706" stroke-width="1.8"/></svg>`
    },
    {
      id: 'g_note',
      name: 'Sticky Note',
      shape: 'note',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 4H20V15L15 20H4V4Z" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.8"/><polyline points="15 15 20 15 15 20" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/></svg>`
    },
    {
      id: 'g_message',
      name: 'Message',
      shape: 'message',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" fill="#ffffff" stroke="#475569" stroke-width="1.8"/><polyline points="3 7 12 13 21 7" stroke="#475569" stroke-width="1.8"/></svg>`
    },
    {
      id: 'g_server',
      name: 'Server',
      shape: 'server',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="6" rx="2" fill="#ffffff" stroke="#475569" stroke-width="1.8"/><rect x="3" y="14" width="18" height="6" rx="2" fill="#ffffff" stroke="#475569" stroke-width="1.8"/><circle cx="6" cy="7" r="1" fill="#10b981"/><circle cx="6" cy="17" r="1" fill="#10b981"/></svg>`
    },
    {
      id: 'g_disk',
      name: 'Disk Storage',
      shape: 'disk',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" fill="#ffffff" stroke="#475569" stroke-width="1.8"/><circle cx="12" cy="10" r="4" stroke="#475569" stroke-width="1.5"/><circle cx="12" cy="10" r="1" fill="#475569"/><circle cx="12" cy="18" r="1" fill="#10b981"/></svg>`
    },
    {
      id: 'g_firewall',
      name: 'Firewall',
      shape: 'firewall',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="1" fill="#fee2e2" stroke="#dc2626" stroke-width="1.8"/><line x1="3" y1="9" x2="21" y2="9" stroke="#dc2626" stroke-width="1.5"/><line x1="3" y1="15" x2="21" y2="15" stroke="#dc2626" stroke-width="1.5"/><line x1="9" y1="4" x2="9" y2="9" stroke="#dc2626" stroke-width="1.5"/><line x1="15" y1="4" x2="15" y2="15" stroke="#dc2626" stroke-width="1.5"/><line x1="9" y1="15" x2="9" y2="20" stroke="#dc2626" stroke-width="1.5"/></svg>`
    }
  ],

  // 6. Flowchart Shapes (Exact 5 shapes from Za.flowchart in ByteDiagram)
  flowchart: [
    {
      id: 'process',
      name: 'Process',
      shape: 'process',
      desc: 'Standard action step',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" fill="#ffffff" stroke="#475569" stroke-width="1.8"/></svg>`
    },
    {
      id: 'decision',
      name: 'Decision',
      shape: 'decision',
      desc: 'Conditional branch',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><polygon points="12,3 21,12 12,21 3,12" fill="#ffffff" stroke="#475569" stroke-width="1.8"/></svg>`
    },
    {
      id: 'start_end',
      name: 'Start / End',
      shape: 'start_end',
      desc: 'Flow entry or exit',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="6" fill="#ffffff" stroke="#475569" stroke-width="1.8"/></svg>`
    },
    {
      id: 'data',
      name: 'Data (I/O)',
      shape: 'data',
      desc: 'Input / Output data',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><polygon points="6,6 21,6 18,18 3,18" fill="#ffffff" stroke="#475569" stroke-width="1.8"/></svg>`
    },
    {
      id: 'predefined',
      name: 'Subroutine',
      shape: 'predefined',
      desc: 'Predefined process',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" fill="#ffffff" stroke="#475569" stroke-width="1.8"/><line x1="6.5" y1="6" x2="6.5" y2="18" stroke="#475569" stroke-width="1.5"/><line x1="17.5" y1="6" x2="17.5" y2="18" stroke="#475569" stroke-width="1.5"/></svg>`
    }
  ],

  // 7. Arrows (Exact 6 shapes from Za.arrows in ByteDiagram)
  arrows: [
    {
      id: 'arrow_right',
      name: 'Arrow Right',
      shape: 'arrow_right',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 12H19M19 12L13 6M19 12L13 18" stroke="#334155" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    {
      id: 'arrow_left',
      name: 'Arrow Left',
      shape: 'arrow_left',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><path d="M20 12H5M5 12L11 6M5 12L11 18" stroke="#334155" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    {
      id: 'arrow_up',
      name: 'Arrow Up',
      shape: 'arrow_up',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 20V5M12 5L6 11M12 5L18 11" stroke="#334155" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    {
      id: 'arrow_down',
      name: 'Arrow Down',
      shape: 'arrow_down',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 4V19M12 19L6 13M12 19L18 13" stroke="#334155" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    {
      id: 'double_arrow_h',
      name: 'Double Arrow (H)',
      shape: 'double_arrow_h',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 12H19M5 12L9 8M5 12L9 16M19 12L15 8M19 12L15 16" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    {
      id: 'double_arrow_v',
      name: 'Double Arrow (V)',
      shape: 'double_arrow_v',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 5V19M12 5L8 9M12 5L16 9M12 19L8 15M12 19L16 15" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    }
  ],

  // 8. UML Shapes (Exact 5 shapes from Za.uml in ByteDiagram)
  uml: [
    {
      id: 'uml_class',
      name: 'Class Box',
      shape: 'uml_class',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" fill="#ffffff" stroke="#475569" stroke-width="1.8"/><line x1="3" y1="9" x2="21" y2="9" stroke="#475569" stroke-width="1.5"/><line x1="3" y1="14" x2="21" y2="14" stroke="#475569" stroke-width="1.5"/></svg>`
    },
    {
      id: 'uml_interface',
      name: 'Interface',
      shape: 'uml_interface',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5" fill="#ffffff" stroke="#475569" stroke-width="1.8"/><line x1="12" y1="14" x2="12" y2="21" stroke="#475569" stroke-width="2"/></svg>`
    },
    {
      id: 'uml_actor',
      name: 'Actor',
      shape: 'uml_actor',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="6" r="3" fill="#ffffff" stroke="#475569" stroke-width="1.8"/><line x1="12" y1="9" x2="12" y2="16" stroke="#475569" stroke-width="1.8"/><line x1="6" y1="12" x2="18" y2="12" stroke="#475569" stroke-width="1.8"/><line x1="12" y1="16" x2="8" y2="22" stroke="#475569" stroke-width="1.8"/><line x1="12" y1="16" x2="16" y2="22" stroke="#475569" stroke-width="1.8"/></svg>`
    },
    {
      id: 'uml_usecase',
      name: 'Use Case',
      shape: 'uml_usecase',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="9" ry="5.5" fill="#ffffff" stroke="#475569" stroke-width="1.8"/></svg>`
    },
    {
      id: 'uml_package',
      name: 'Package',
      shape: 'uml_package',
      svgPreview: `<svg viewBox="0 0 24 24" fill="none"><path d="M3 6H10L12 9H21V19H3V6Z" fill="#ffffff" stroke="#475569" stroke-width="1.8"/></svg>`
    }
  ]
};
