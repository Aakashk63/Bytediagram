# ByteDiagram Rebuild

A high-fidelity rebuild of [ByteDiagram](https://bytediagram.com/) created through reverse engineering and deep analysis with the REA (Reverse Engineer Anything) workflow.

## Overview & Architecture

ByteDiagram is a tool for creating ByteByteGo-style architecture diagrams with multi-step animated packet flows, AI generation, and multi-format exports.

### Key Components Reconstructed

1. **Landing Page Experience**:
   - Modern brand header with logo, navigation links, and "Open Editor" CTA.
   - Hero section featuring gradient typography (`Create Animated Sequence Diagrams in Minutes`), trust badges, and floating architectural cards.
   - Interactive hero window with a live SVG simulation of animated packet transfers across client, gateway, service, cache, and database tiers.
   - Built-in tech stack marquee showcasing SVGs for PostgreSQL, Redis, Kafka, React, Node.js, Python, Go, TypeScript, Docker, Kubernetes, AWS, Nginx, and more.
   - Curated template cards enabling 1-click loading into the canvas editor.

2. **Full-Featured Canvas Editor**:
   - **Infinite Canvas with Pan & Zoom**: Dot-grid canvas with smooth zooming (25% to 300%), mouse wheel zoom, pan tool, and fit-to-screen (`⤢`).
   - **Section / Container Zones**: Customizable dashed/solid zones (e.g. `VPC`, `Frontend`, `Backend`, `Database`) with nested children management.
   - **Interactive Node Primitives**: Crisp cards with authentic SVG tech logos, titles, subtitles, resize handles, and 4-way connection ports.
   - **Curved Bezier & Orthogonal Connectors**: Interactive connection dragging with live preview, automatic curve generation, arrowhead markers, and protocol badges (`REST API`, `Query`, `gRPC`, `Pub/Sub`).
   - **Floating Node Quick Toolbar**: Label renaming, size presets (`S | M | L`), duplication, and deletion.
   - **Interactive Minimap**: Real-time canvas overview thumbnail with viewport rectangle.

3. **Bottom Timeline Studio (Animation Sequencer)**:
   - Video-editor style dark tray with `|< Start`, `▶ Play / ⏸ Pause`, `■ Stop`, `🔁 Loop`, and reset controls.
   - Real-time timestamp counter (`00:00.0 / 00:04.0`) and draggable scrubber slider.
   - Multi-track timeline lanes (Camera, Motion, Steps/Nodes).
   - Real-time animated packet flow simulation: glowing particles travel along connector curves in sequenced steps at 60 FPS.
   - `✨ Rebuild AI` auto-sequencing for any custom diagram.

4. **AI Diagram Generator & "Bytey" Assistant**:
   - Natural language prompt synthesis (RAG pipelines, E-commerce microservices, Autonomous AI Agent loops, etc.).
   - Interactive sidebar assistant ("Bytey") that mutates diagrams on demand (e.g., adding caches, event streams, or clearing the canvas).

5. **Export & Persistence Engine**:
   - **PNG Export**: 2x Retina high-resolution rasterization.
   - **SVG Export**: Scalable vector format with embedded styles and markers.
   - **JSON Export / Import**: Diagram serialization and re-importing.
   - **Presentation Mode**: Fullscreen presentation view with keyboard step navigation (`←`/`→`, `Space`).

## Running the Application

```bash
cd bytediagram
npm install
npm run dev
```

Visit `http://localhost:5173/` in your browser.
