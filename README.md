# Pixel Office — AI Agent Command Center

A standalone pixel-art office dashboard that visualizes your AI agent fleet as animated characters walking, typing, and collaborating in a virtual workspace.

Built on the [pixel-agents](https://github.com/pablodelucca/pixel-agents) engine by Pablo De Lucca, extended for standalone web deployment with real-time cloud monitoring.

![Pixel Office](https://yedan-pixel-office.pages.dev)

## Features

**Beyond the Original:**
- **Standalone web app** — no VS Code required, runs in any browser
- **Real-time cloud monitoring** — 24 Cloudflare Workers health check panel
- **Agent fleet HUD** — live status, KPI scores, tool activity tracking
- **Ambient particle effects** — floating data visualization particles
- **Custom agent definitions** — configure your own agents via `standaloneBoot.ts`
- **One-click deploy** — Cloudflare Pages, Vercel, Netlify, or any static host

**From the Original Engine:**
- 6 diverse pixel art character sprites (16×24, 7 animation frames × 3 directions)
- BFS pathfinding with collision avoidance
- Z-sorted isometric rendering
- Matrix digital rain spawn/despawn effects
- Auto-tiling wall system (16 bitmask variants)
- Office layout with desks, chairs, monitors, plants
- Speech bubbles (permission wait / task complete)
- FS Pixel Sans font

## Quick Start

```bash
git clone https://github.com/yedanyagamiai-cmd/pixel-office.git
cd pixel-office
# Just open index.html or serve with any static server
npx serve .
```

## Customization

Edit `standaloneBoot.ts` (in source) to define your own agents:

```typescript
const MY_AGENTS = [
  { id: 1, name: 'my-agent', folderName: 'My Project' },
  { id: 2, name: 'code-reviewer', folderName: 'Reviews' },
  // Add up to 6 agents with unique character sprites
];
```

## Deploy to Cloudflare Pages

```bash
npx wrangler pages deploy . --project-name my-pixel-office
```

## Build from Source

```bash
cd webview-ui
npm install
npm run build
cp -r public/assets ../standalone-dist/assets/
```

## Architecture

```
pixel-agents engine (React 19 + Canvas 2D + TypeScript)
  ↓
standaloneBoot.ts (mock VS Code API, load sprites, spawn agents)
  ↓
YedanHud.tsx (real-time HUD overlay, cloud health, agent panel)
  ↓
ambientEffects.ts (floating particle effects)
  ↓
Cloudflare Pages (global CDN, <50ms latency)
```

## Tech Stack

- **Engine**: React 19, TypeScript, Vite, Canvas 2D
- **Rendering**: Pixel-perfect integer zoom, BFS pathfinding, Z-sort
- **Sprites**: 6 pre-colored character sets, auto-tile walls, furniture catalog
- **Deployment**: Cloudflare Pages (14 static files, ~95KB gzipped)
- **Monitoring**: Real-time HEAD requests to cloud endpoints

## Credits

- Engine: [pixel-agents](https://github.com/pablodelucca/pixel-agents) by Pablo De Lucca (MIT License)
- Characters: [Metro City pack](https://jik-a-4.itch.io/metrocity-free-topdown-character-pack) by JIK-A-4
- Font: FS Pixel Sans Unicode

## License

MIT — See [LICENSE](LICENSE)
