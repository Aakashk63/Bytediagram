// SVG Icon repository for ByteDiagram tech icons and UI glyphs
export const TECH_ICONS = {
  react: {
    name: 'React',
    category: 'Frameworks',
    color: '#00d8ff',
    svg: `<svg viewBox="0 0 115.3 100" fill="none">
      <ellipse cx="57.65" cy="50" rx="10" ry="24" stroke="#00d8ff" stroke-width="4.5" transform="rotate(30 57.65 50)"/>
      <ellipse cx="57.65" cy="50" rx="10" ry="24" stroke="#00d8ff" stroke-width="4.5" transform="rotate(90 57.65 50)"/>
      <ellipse cx="57.65" cy="50" rx="10" ry="24" stroke="#00d8ff" stroke-width="4.5" transform="rotate(150 57.65 50)"/>
      <circle cx="57.65" cy="50" r="5" fill="#00d8ff"/>
    </svg>`
  },
  nodejs: {
    name: 'Node.js',
    category: 'Frameworks',
    color: '#539e43',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <path d="M16 2L3 9.5V24.5L16 32L29 24.5V9.5L16 2Z" fill="#539e43"/>
      <path d="M16 5L26 11V23L16 29L6 23V11L16 5Z" fill="#333333"/>
      <path d="M12 11H15V19C15 20.5 13.5 21 12 21H10V18.5H11.5C12 18.5 12.5 18.2 12.5 17.5V11H12Z" fill="#ffffff"/>
      <path d="M21 15C21 13 19.5 12.5 18 12.5C16.5 12.5 15.5 13.2 15.5 14.5C15.5 17 21 16 21 19C21 21 19.5 21.5 18 21.5C16 21.5 15 20.5 15 19H17.5C17.5 19.5 18 19.8 18.5 19.8C19 19.8 19.5 19.5 19.5 19C19.5 17 14 17.8 14 14.5C14 12.5 15.5 11 18 11C20.5 11 21.5 12.5 21.5 14H19" fill="#ffffff"/>
    </svg>`
  },
  mongodb: {
    name: 'MongoDB',
    category: 'Databases',
    color: '#13aa52',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <path d="M16 2C15.5 6 11 12 11 18C11 23 13.5 27.5 16 30C18.5 27.5 21 23 21 18C21 12 16.5 6 16 2Z" fill="#13aa52"/>
      <path d="M16 2V30C18.5 27.5 21 23 21 18C21 12 16.5 6 16 2Z" fill="#116149"/>
      <path d="M16 29.5C15.5 29.5 15 28 15 26H17C17 28 16.5 29.5 16 29.5Z" fill="#a6a495"/>
    </svg>`
  },
  postgresql: {
    name: 'PostgreSQL',
    category: 'Databases',
    color: '#336791',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <path d="M16 3C10.5 3 6.5 6.5 6 12C5.5 17 8 21.5 11 24V29H14V25C14.7 25.2 15.3 25.3 16 25.3C16.7 25.3 17.3 25.2 18 25V29H21V24C24 21.5 26.5 17 26 12C25.5 6.5 21.5 3 16 3Z" fill="#336791"/>
      <ellipse cx="12" cy="11" rx="2" ry="3" fill="#ffffff"/>
      <ellipse cx="20" cy="11" rx="2" ry="3" fill="#ffffff"/>
      <circle cx="12" cy="11" r="1.2" fill="#1e293b"/>
      <circle cx="20" cy="11" r="1.2" fill="#1e293b"/>
      <path d="M14 17C14.5 18 15.2 18.5 16 18.5C16.8 18.5 17.5 18 18 17" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
  },
  redis: {
    name: 'Redis',
    category: 'Databases',
    color: '#dc382d',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <path d="M16 2L2 9L16 16L30 9L16 2Z" fill="#d82c20"/>
      <path d="M2 9V17L16 24V16L2 9Z" fill="#a32219"/>
      <path d="M30 9V17L16 24V16L30 9Z" fill="#b9271d"/>
      <path d="M2 17V23L16 30V24L2 17Z" fill="#7a1913"/>
      <path d="M30 17V23L16 30V24L30 17Z" fill="#8f1e16"/>
    </svg>`
  },
  kafka: {
    name: 'Kafka',
    category: 'Messaging & Streaming',
    color: '#231f20',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <circle cx="8" cy="8" r="4" fill="#231f20"/>
      <circle cx="24" cy="8" r="4" fill="#231f20"/>
      <circle cx="16" cy="16" r="4" fill="#231f20"/>
      <circle cx="8" cy="24" r="4" fill="#231f20"/>
      <circle cx="24" cy="24" r="4" fill="#231f20"/>
      <line x1="8" y1="8" x2="16" y2="16" stroke="#231f20" stroke-width="2.5"/>
      <line x1="24" y1="8" x2="16" y2="16" stroke="#231f20" stroke-width="2.5"/>
      <line x1="8" y1="24" x2="16" y2="16" stroke="#231f20" stroke-width="2.5"/>
      <line x1="24" y1="24" x2="16" y2="16" stroke="#231f20" stroke-width="2.5"/>
      <circle cx="16" cy="16" r="2" fill="#ffffff"/>
    </svg>`
  },
  nginx: {
    name: 'Nginx',
    category: 'Cloud & Infrastructure',
    color: '#009639',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#009639"/>
      <path d="M8 8V24L18 8V24" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="24" y1="8" x2="24" y2="24" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`
  },
  docker: {
    name: 'Docker',
    category: 'DevOps & Monitoring',
    color: '#2496ed',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <path d="M30 18C29 14 26 13 24 13C23 13 22 13.5 21 14C19.5 13.5 18 14 17 15H3C2 15 1 16 1 18C1 24 6 28 15 28C24 28 29.5 22 30 18Z" fill="#2496ed"/>
      <rect x="5" y="11" width="3" height="3" fill="#2496ed"/>
      <rect x="9" y="11" width="3" height="3" fill="#2496ed"/>
      <rect x="13" y="11" width="3" height="3" fill="#2496ed"/>
      <rect x="9" y="7" width="3" height="3" fill="#2496ed"/>
      <rect x="13" y="7" width="3" height="3" fill="#2496ed"/>
      <circle cx="24" cy="18" r="1.5" fill="#ffffff"/>
    </svg>`
  },
  kubernetes: {
    name: 'Kubernetes',
    category: 'DevOps & Monitoring',
    color: '#326ce5',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 9V23L16 30L28 23V9L16 2Z" fill="#326ce5"/>
      <circle cx="16" cy="16" r="4.5" fill="#ffffff"/>
      <line x1="16" y1="6" x2="16" y2="11.5" stroke="#ffffff" stroke-width="2"/>
      <line x1="16" y1="20.5" x2="16" y2="26" stroke="#ffffff" stroke-width="2"/>
      <line x1="7" y1="11" x2="12" y2="13.5" stroke="#ffffff" stroke-width="2"/>
      <line x1="20" y1="18.5" x2="25" y2="21" stroke="#ffffff" stroke-width="2"/>
      <line x1="7" y1="21" x2="12" y2="18.5" stroke="#ffffff" stroke-width="2"/>
      <line x1="20" y1="13.5" x2="25" y2="11" stroke="#ffffff" stroke-width="2"/>
    </svg>`
  },
  aws: {
    name: 'AWS',
    category: 'Cloud & Infrastructure',
    color: '#ff9900',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#232f3e"/>
      <path d="M7 15L10 8H12L15 15H13L12.2 13H9.8L9 15H7ZM10.2 11.5H11.8L11 9.5L10.2 11.5Z" fill="#ffffff"/>
      <path d="M16 8H18L19.5 13L21 8H23L24.5 13L26 8H28L25.5 15H23.5L22 10.5L20.5 15H18.5L16 8Z" fill="#ffffff"/>
      <path d="M8 21C14 25 20 25 25 21" stroke="#ff9900" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M23 19L26 21L24 23" fill="#ff9900"/>
    </svg>`
  },
  python: {
    name: 'Python',
    category: 'Frameworks',
    color: '#3776ab',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <path d="M15.5 2C10 2 10.5 4.5 10.5 4.5V7.5H16V8.5H8C8 8.5 4 8 4 13.5C4 19 7.5 18.5 7.5 18.5H9.5V16C9.5 13 12 13 12 13H17.5C20.5 13 20.5 10.5 20.5 10.5V4.5C20.5 4.5 21 2 15.5 2Z" fill="#3776ab"/>
      <circle cx="13" cy="5" r="1" fill="#ffffff"/>
      <path d="M16.5 30C22 30 21.5 27.5 21.5 27.5V24.5H16V23.5H24C24 23.5 28 24 28 18.5C28 13 24.5 13.5 24.5 13.5H22.5V16C22.5 19 20 19 20 19H14.5C11.5 19 11.5 21.5 11.5 21.5V27.5C11.5 27.5 11 30 16.5 30Z" fill="#ffd43b"/>
      <circle cx="19" cy="27" r="1" fill="#ffffff"/>
    </svg>`
  },
  golang: {
    name: 'Go',
    category: 'Frameworks',
    color: '#00add8',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#00add8"/>
      <circle cx="11" cy="15" r="4" fill="#ffffff"/>
      <circle cx="21" cy="15" r="4" fill="#ffffff"/>
      <circle cx="12" cy="15" r="2" fill="#000000"/>
      <circle cx="22" cy="15" r="2" fill="#000000"/>
      <circle cx="13" cy="14" r="0.8" fill="#ffffff"/>
      <circle cx="23" cy="14" r="0.8" fill="#ffffff"/>
    </svg>`
  },
  typescript: {
    name: 'TypeScript',
    category: 'Frameworks',
    color: '#3178c6',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#3178c6"/>
      <path d="M7 12H17M12 12V24" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M25 14C24 13 22 13 20 14C18 15 18 17 20 18C22 19 24 19 24 21C24 23 22 24 20 24C18 24 17 23 16 22" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`
  },
  graphql: {
    name: 'GraphQL',
    category: 'Messaging & Streaming',
    color: '#e10098',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="4" r="3" fill="#e10098"/>
      <circle cx="26" cy="10" r="3" fill="#e10098"/>
      <circle cx="26" cy="22" r="3" fill="#e10098"/>
      <circle cx="16" cy="28" r="3" fill="#e10098"/>
      <circle cx="6" cy="22" r="3" fill="#e10098"/>
      <circle cx="6" cy="10" r="3" fill="#e10098"/>
      <polygon points="16,4 26,10 26,22 16,28 6,22 6,10" stroke="#e10098" stroke-width="2" fill="none"/>
      <polygon points="16,4 26,22 6,22" stroke="#e10098" stroke-width="2" fill="none"/>
      <polygon points="26,10 16,28 6,10" stroke="#e10098" stroke-width="2" fill="none"/>
    </svg>`
  },
  vector_db: {
    name: 'Vector DB',
    category: 'AI & Data Science',
    color: '#8b5cf6',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <rect x="4" y="6" width="24" height="20" rx="4" fill="#ede9fe" stroke="#8b5cf6" stroke-width="2"/>
      <circle cx="10" cy="12" r="2.5" fill="#8b5cf6"/>
      <circle cx="22" cy="12" r="2.5" fill="#8b5cf6"/>
      <circle cx="16" cy="20" r="2.5" fill="#8b5cf6"/>
      <line x1="10" y1="12" x2="16" y2="20" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="2 2"/>
      <line x1="22" y1="12" x2="16" y2="20" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="2 2"/>
      <line x1="10" y1="12" x2="22" y2="12" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="2 2"/>
    </svg>`
  },
  llm: {
    name: 'LLM / AI Model',
    category: 'AI & Data Science',
    color: '#6366f1',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" fill="#e0e7ff" stroke="#6366f1" stroke-width="2"/>
      <path d="M16 7L18.5 13.5L25 16L18.5 18.5L16 25L13.5 18.5L7 16L13.5 13.5L16 7Z" fill="#6366f1"/>
      <circle cx="24" cy="8" r="2" fill="#a5b4fc"/>
      <circle cx="8" cy="24" r="2" fill="#a5b4fc"/>
    </svg>`
  },
  client: {
    name: 'Client / Web',
    category: 'Cloud & Infrastructure',
    color: '#0284c7',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <rect x="3" y="5" width="26" height="18" rx="2" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <line x1="12" y1="23" x2="10" y2="27" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
      <line x1="20" y1="23" x2="22" y2="27" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="27" x2="24" y2="27" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
      <circle cx="7" cy="9" r="1" fill="#0284c7"/>
      <circle cx="10" cy="9" r="1" fill="#0284c7"/>
      <circle cx="13" cy="9" r="1" fill="#0284c7"/>
    </svg>`
  },
  api_gateway: {
    name: 'API Gateway',
    category: 'Cloud & Infrastructure',
    color: '#10b981',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <rect x="4" y="5" width="24" height="22" rx="4" fill="#d1fae5" stroke="#10b981" stroke-width="2"/>
      <path d="M10 11H22M10 16H22M10 21H16" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
      <circle cx="21" cy="21" r="2" fill="#10b981"/>
    </svg>`
  },
  microservice: {
    name: 'Microservice',
    category: 'Frameworks',
    color: '#f59e0b',
    svg: `<svg viewBox="0 0 32 32" fill="none">
      <rect x="5" y="7" width="22" height="18" rx="4" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="11" cy="16" r="3" fill="#f59e0b"/>
      <circle cx="21" cy="16" r="3" fill="#f59e0b"/>
      <line x1="14" y1="16" x2="18" y2="16" stroke="#f59e0b" stroke-width="2"/>
    </svg>`
  }
};

export const SHAPES_LIBRARY = [
  { id: 'heading', name: 'Your Heading', type: 'text_heading', category: 'Text', preview: 'Heading' },
  { id: 'title', name: 'Your Title', type: 'text_title', category: 'Text', preview: 'Title' },
  { id: 'paragraph', name: 'Your paragraph text...', type: 'text_p', category: 'Text', preview: 'Paragraph' },
  { id: 'section_dashed', name: 'Section', subtitle: 'Dashed zone for grouping', type: 'section', style: 'dashed', category: 'Sections' },
  { id: 'section_frosted', name: 'Frosted Section', subtitle: 'Glass blur behind group', type: 'section', style: 'frosted', category: 'Sections' },
  { id: 'section_card', name: 'Card Section', subtitle: 'Elevated card zone', type: 'section', style: 'card', category: 'Sections' },
  { id: 'rect', name: 'Rectangle', type: 'node_rect', category: 'Architecture' },
  { id: 'circle', name: 'Circle', type: 'node_circle', category: 'Architecture' },
  { id: 'diamond', name: 'Diamond', type: 'node_diamond', category: 'Architecture' },
  { id: 'database', name: 'Database', type: 'node_db', category: 'Architecture' },
  { id: 'apigw', name: 'API Gateway', type: 'node_apigw', category: 'Architecture' },
  { id: 'service', name: 'Microservice', type: 'node_service', category: 'Architecture' }
];
