# YEDAN Pixel Office

AI Agent Command Center — watch your AI agents work in a pixel art office in real-time.

Built on [pixel-agents](https://github.com/pablodelucca/pixel-agents) engine, enhanced with always-visible agent activity, role badges, and rich office layout.

## Live Demo

**https://yedan-pixel-office.pages.dev**

## Features

- 7 AI agents as animated pixel characters with unique skins
- **Always-visible activity labels** — see what every agent is doing at all times
- **Colored role badges** above each agent (Commander, Revenue Tracking, etc.)
- Rich 25×18 office with 5 themed rooms and 65 furniture items
- Full pixel-agents engine: BFS pathfinding, FSM character states, Z-sorted rendering
- Matrix-style spawn effects, typing/reading tool animations
- Realistic tool activity simulation (Write, Read, Bash, Grep, WebFetch, etc.)
- Sub-agent spawning for complex tasks
- Isometric pixel art with colorized floor tiles per room

## What Makes This Different

| Feature | Original pixel-agents | YEDAN Pixel Office |
|---------|----------------------|-------------------|
| Agent labels | Hover only | Always visible |
| Role identification | Folder name on hover | Colored role badge |
| Activity visibility | Click to see tools | All agents shown |
| Office size | 21×21 | 25×18 with 5 rooms |
| Furniture | Requires VS Code extension | Works standalone |
| Deployment | VS Code only | Any browser |

## Customize Your Agents

Edit `src/standaloneBoot.ts`:

```typescript
const YEDAN_AGENTS = [
  { id: 1, name: 'my-agent', folderName: 'My Agent Role' },
  { id: 2, name: 'another', folderName: 'Another Role' },
];
```

## Build from Source

```bash
git clone https://github.com/pablodelucca/pixel-agents
cd pixel-agents/webview-ui
npm install
npm run build -- --outDir ../standalone-dist --emptyOutDir
cp -r public/assets/characters ../standalone-dist/assets/
cp public/assets/walls.png ../standalone-dist/assets/
cp public/assets/default-layout.json ../standalone-dist/assets/
```

## Deploy

```bash
npx wrangler pages deploy standalone-dist --project-name your-project
```

## Credits

Engine: [pixel-agents](https://github.com/pablodelucca/pixel-agents) by Pablo de Lucca (MIT License)

## License

MIT
