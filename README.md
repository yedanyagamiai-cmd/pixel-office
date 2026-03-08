# YEDAN Pixel Office

AI Agent Command Center — watch your AI agents work in a pixel art office.

Built on [pixel-agents](https://github.com/pablodelucca/pixel-agents) engine with full customization for multi-agent AI operations.

## Live Demo

**https://yedan-pixel-office.pages.dev**

## Features

- 7 AI agents visualized as pixel characters with unique skins
- Full pixel-agents engine: BFS pathfinding, FSM states, Z-sorted rendering
- Matrix-style spawn effects, tool activity animations
- Isometric office with customizable layout, furniture, and floor tiles
- Real-time agent status: active tools, waiting states, sub-agent spawns
- Standalone mode — runs in any browser, no VS Code required

## Customize Your Agents

Edit `src/standaloneBoot.ts` to define your own agents:

```typescript
const YEDAN_AGENTS = [
  { id: 1, name: 'my-agent', folderName: 'My Agent Role' },
  { id: 2, name: 'another', folderName: 'Another Role' },
  // Add up to 6 agents (one per character skin)
];
```

## Build from Source

```bash
# Clone the full pixel-agents repo
git clone https://github.com/pablodelucca/pixel-agents
cd pixel-agents/webview-ui
npm install
npm run build -- --outDir ../standalone-dist --base ./

# Copy assets
cp -r public/assets/characters standalone-dist/assets/
cp public/assets/walls.png standalone-dist/assets/
cp public/assets/default-layout.json standalone-dist/assets/
```

## Deploy

Any static hosting works. For Cloudflare Pages:

```bash
npx wrangler pages deploy standalone-dist --project-name your-project
```

## Credits

Engine: [pixel-agents](https://github.com/pablodelucca/pixel-agents) by Pablo de Lucca (MIT License)

## License

MIT
