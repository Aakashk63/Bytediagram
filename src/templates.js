// Pre-built architecture diagram templates for ByteDiagram
export const TEMPLATES = {
  webapp: {
    id: 'webapp',
    title: 'Web App Stack',
    subtitle: 'React frontend, Node.js API, and MongoDB',
    category: 'Architecture',
    sections: [
      {
        id: 'sec-frontend',
        title: 'Frontend',
        subtitle: 'Client application tier',
        x: 180,
        y: 160,
        width: 200,
        height: 190,
        fill: '#f0fdf4',
        border: '#3b82f6',
        borderStyle: 'dashed'
      },
      {
        id: 'sec-backend',
        title: 'Backend',
        subtitle: 'Business logic & controllers',
        x: 440,
        y: 160,
        width: 200,
        height: 190,
        fill: '#f5f3ff',
        border: '#8b5cf6',
        borderStyle: 'dashed'
      },
      {
        id: 'sec-database',
        title: 'Database',
        subtitle: 'Document datastore tier',
        x: 700,
        y: 160,
        width: 200,
        height: 190,
        fill: '#f0fdf4',
        border: '#10b981',
        borderStyle: 'dashed'
      }
    ],
    nodes: [
      {
        id: 'node-react',
        label: 'React',
        subtitle: 'Client UI',
        icon: 'react',
        x: 245,
        y: 220,
        width: 70,
        height: 70,
        sectionId: 'sec-frontend'
      },
      {
        id: 'node-node',
        label: 'Node.js',
        subtitle: 'Express REST API',
        icon: 'nodejs',
        x: 505,
        y: 220,
        width: 70,
        height: 70,
        sectionId: 'sec-backend'
      },
      {
        id: 'node-mongo',
        label: 'MongoDB',
        subtitle: 'NoSQL Cluster',
        icon: 'mongodb',
        x: 765,
        y: 220,
        width: 70,
        height: 70,
        sectionId: 'sec-database'
      }
    ],
    edges: [
      {
        id: 'edge-1',
        from: 'node-react',
        to: 'node-node',
        label: 'REST API',
        style: 'bezier',
        stroke: '#475569',
        step: 1
      },
      {
        id: 'edge-2',
        from: 'node-node',
        to: 'node-mongo',
        label: 'Query',
        style: 'bezier',
        stroke: '#475569',
        step: 2
      }
    ],
    timeline: {
      duration: 4.0,
      steps: [
        { id: 1, name: '1. Request', time: 0.0, edgeId: 'edge-1', description: 'Browser issues HTTPS request to API' },
        { id: 2, name: '2. Route', time: 1.0, edgeId: 'edge-1', description: 'Node.js receives & parses request' },
        { id: 3, name: '3. Process & Query', time: 2.0, edgeId: 'edge-2', description: 'API executes BSON query on MongoDB' },
        { id: 4, name: '4. Response', time: 3.0, edgeId: 'edge-2', description: 'MongoDB returns documents to frontend' }
      ]
    }
  },

  microservices: {
    id: 'microservices',
    title: 'Microservices',
    subtitle: 'Gateway, services, Kafka, and databases',
    category: 'Architecture',
    sections: [
      {
        id: 'sec-vpc',
        title: 'VPC - US-EAST-1',
        subtitle: 'Kubernetes Cluster & Cloud Data',
        x: 320,
        y: 110,
        width: 680,
        height: 380,
        fill: '#f8fafc',
        border: '#94a3b8',
        borderStyle: 'dashed'
      }
    ],
    nodes: [
      {
        id: 'ms-client',
        label: 'Client App',
        subtitle: 'Mobile & Web',
        icon: 'client',
        x: 140,
        y: 260,
        width: 75,
        height: 75
      },
      {
        id: 'ms-gw',
        label: 'API Gateway',
        subtitle: 'Nginx Reverse Proxy',
        icon: 'nginx',
        x: 360,
        y: 260,
        width: 75,
        height: 75,
        sectionId: 'sec-vpc'
      },
      {
        id: 'ms-order',
        label: 'Order Service',
        subtitle: 'Go Microservice',
        icon: 'golang',
        x: 540,
        y: 180,
        width: 75,
        height: 75,
        sectionId: 'sec-vpc'
      },
      {
        id: 'ms-user',
        label: 'User Service',
        subtitle: 'TypeScript Node',
        icon: 'typescript',
        x: 540,
        y: 340,
        width: 75,
        height: 75,
        sectionId: 'sec-vpc'
      },
      {
        id: 'ms-cache',
        label: 'Redis Cache',
        subtitle: 'In-Memory 0.4ms',
        icon: 'redis',
        x: 720,
        y: 180,
        width: 75,
        height: 75,
        sectionId: 'sec-vpc'
      },
      {
        id: 'ms-kafka',
        label: 'Kafka Bus',
        subtitle: 'Event Stream',
        icon: 'kafka',
        x: 720,
        y: 340,
        width: 75,
        height: 75,
        sectionId: 'sec-vpc'
      },
      {
        id: 'ms-db',
        label: 'Postgres DB',
        subtitle: 'Primary Cluster',
        icon: 'postgresql',
        x: 880,
        y: 260,
        width: 75,
        height: 75,
        sectionId: 'sec-vpc'
      }
    ],
    edges: [
      { id: 'me-1', from: 'ms-client', to: 'ms-gw', label: 'HTTPS / JSON', style: 'bezier', stroke: '#2563eb', step: 1 },
      { id: 'me-2', from: 'ms-gw', to: 'ms-order', label: 'gRPC', style: 'bezier', stroke: '#059669', step: 2 },
      { id: 'me-3', from: 'ms-gw', to: 'ms-user', label: 'gRPC', style: 'bezier', stroke: '#059669', step: 2 },
      { id: 'me-4', from: 'ms-order', to: 'ms-cache', label: 'Cache Lookup', style: 'bezier', stroke: '#dc2626', step: 3 },
      { id: 'me-5', from: 'ms-order', to: 'ms-kafka', label: 'Emit order.created', style: 'bezier', stroke: '#7c3aed', step: 4 },
      { id: 'me-6', from: 'ms-order', to: 'ms-db', label: 'Write Transaction', style: 'bezier', stroke: '#0284c7', step: 4 }
    ],
    timeline: {
      duration: 5.0,
      steps: [
        { id: 1, name: '1. Inbound Request', time: 0.0, edgeId: 'me-1', description: 'Client submits checkout cart' },
        { id: 2, name: '2. Gateway Routing', time: 1.2, edgeId: 'me-2', description: 'API Gateway authenticates and routes to Order Service' },
        { id: 3, name: '3. Cache Hit Check', time: 2.4, edgeId: 'me-4', description: 'Order Service checks inventory in Redis' },
        { id: 4, name: '4. Stream & Persist', time: 3.6, edgeId: 'me-5', description: 'Order committed to PostgreSQL & published to Kafka' }
      ]
    }
  },

  rag: {
    id: 'rag',
    title: 'RAG Pipeline',
    subtitle: 'Ingestion, vector search and LLM generation',
    category: 'Architecture',
    sections: [
      {
        id: 'sec-rag-ingest',
        title: 'Ingestion & Indexing',
        subtitle: 'Documents to Vector Embeddings',
        x: 160,
        y: 140,
        width: 320,
        height: 280,
        fill: '#f0f9ff',
        border: '#0284c7',
        borderStyle: 'dashed'
      },
      {
        id: 'sec-rag-infer',
        title: 'Inference & Generation',
        subtitle: 'Retriever & LLM Synthesizer',
        x: 540,
        y: 140,
        width: 440,
        height: 280,
        fill: '#faf5ff',
        border: '#9333ea',
        borderStyle: 'dashed'
      }
    ],
    nodes: [
      {
        id: 'rag-docs',
        label: 'Documents',
        subtitle: 'PDF, MD, Web',
        icon: 'client',
        x: 210,
        y: 240,
        width: 70,
        height: 70,
        sectionId: 'sec-rag-ingest'
      },
      {
        id: 'rag-py',
        label: 'Python Embedder',
        subtitle: 'text-embedding-3',
        icon: 'python',
        x: 360,
        y: 240,
        width: 70,
        height: 70,
        sectionId: 'sec-rag-ingest'
      },
      {
        id: 'rag-vdb',
        label: 'pgvector / Pinecone',
        subtitle: '1536-dim HNSW',
        icon: 'vector_db',
        x: 600,
        y: 240,
        width: 75,
        height: 75,
        sectionId: 'sec-rag-infer'
      },
      {
        id: 'rag-llm',
        label: 'LLM Agent',
        subtitle: 'Gemini 1.5 Pro',
        icon: 'llm',
        x: 770,
        y: 240,
        width: 75,
        height: 75,
        sectionId: 'sec-rag-infer'
      },
      {
        id: 'rag-client',
        label: 'User Query',
        subtitle: 'Natural language',
        icon: 'react',
        x: 910,
        y: 240,
        width: 70,
        height: 70,
        sectionId: 'sec-rag-infer'
      }
    ],
    edges: [
      { id: 're-1', from: 'rag-docs', to: 'rag-py', label: 'Chunks', style: 'bezier', stroke: '#0284c7', step: 1 },
      { id: 're-2', from: 'rag-py', to: 'rag-vdb', label: 'Vectors', style: 'bezier', stroke: '#7c3aed', step: 2 },
      { id: 're-3', from: 'rag-client', to: 'rag-vdb', label: 'Top-K Retrieval', style: 'bezier', stroke: '#e11d48', step: 3 },
      { id: 're-4', from: 'rag-vdb', to: 'rag-llm', label: 'Context Injection', style: 'bezier', stroke: '#059669', step: 4 }
    ],
    timeline: {
      duration: 4.5,
      steps: [
        { id: 1, name: '1. Chunk & Embed', time: 0.0, edgeId: 're-1', description: 'Raw files processed into tokenized chunks' },
        { id: 2, name: '2. Vector Indexing', time: 1.0, edgeId: 're-2', description: 'Embeddings stored in high-speed HNSW index' },
        { id: 3, name: '3. Query Similarity Search', time: 2.2, edgeId: 're-3', description: 'Cosine similarity match retrieves top 5 snippets' },
        { id: 4, name: '4. Grounded Synthesis', time: 3.4, edgeId: 're-4', description: 'LLM answers with exact citations' }
      ]
    }
  },

  aiagent: {
    id: 'aiagent',
    title: 'AI Agent Loop',
    subtitle: 'Memory, tools, agent loop, and guardrails',
    category: 'Architecture',
    sections: [
      {
        id: 'sec-agent',
        title: 'Autonomous Agent Runtime',
        subtitle: 'ReAct reasoning & execution loop',
        x: 260,
        y: 130,
        width: 580,
        height: 340,
        fill: '#f8fafc',
        border: '#6366f1',
        borderStyle: 'dashed'
      }
    ],
    nodes: [
      { id: 'ag-user', label: 'User Intent', subtitle: 'Task prompt', icon: 'client', x: 120, y: 260, width: 70, height: 70 },
      { id: 'ag-planner', label: 'Planner LLM', subtitle: 'ReAct Agent', icon: 'llm', x: 340, y: 260, width: 80, height: 80, sectionId: 'sec-agent' },
      { id: 'ag-tools', label: 'MCP Tools', subtitle: 'Search, Code, Shell', icon: 'microservice', x: 540, y: 190, width: 75, height: 75, sectionId: 'sec-agent' },
      { id: 'ag-mem', label: 'Vector Memory', subtitle: 'Long-term context', icon: 'vector_db', x: 540, y: 330, width: 75, height: 75, sectionId: 'sec-agent' },
      { id: 'ag-out', label: 'Verified Output', subtitle: 'Solution & Artifacts', icon: 'nodejs', x: 730, y: 260, width: 75, height: 75, sectionId: 'sec-agent' }
    ],
    edges: [
      { id: 'ae-1', from: 'ag-user', to: 'ag-planner', label: 'Prompt', style: 'bezier', stroke: '#4f46e5', step: 1 },
      { id: 'ae-2', from: 'ag-planner', to: 'ag-tools', label: 'Tool Invocation', style: 'bezier', stroke: '#d97706', step: 2 },
      { id: 'ae-3', from: 'ag-planner', to: 'ag-mem', label: 'Store State', style: 'bezier', stroke: '#059669', step: 3 },
      { id: 'ae-4', from: 'ag-planner', to: 'ag-out', label: 'Final Answer', style: 'bezier', stroke: '#2563eb', step: 4 }
    ],
    timeline: {
      duration: 4.0,
      steps: [
        { id: 1, name: '1. Intent Analysis', time: 0.0, edgeId: 'ae-1', description: 'Decompose user goal into step actions' },
        { id: 2, name: '2. Tool Calling', time: 1.2, edgeId: 'ae-2', description: 'Execute environment & retrieval commands' },
        { id: 3, name: '3. Reflective Memory', time: 2.3, edgeId: 'ae-3', description: 'Update conversation and working memory' },
        { id: 4, name: '4. Deliver Results', time: 3.2, edgeId: 'ae-4', description: 'Validate output against constraints' }
      ]
    }
  }
};
