/**
 * YEDAN Pixel Office — Standalone Boot Script
 * Simulates VS Code extension messages to spawn 7 YEDAN agents
 * with the full pixel-agents engine (sprites, animations, pathfinding)
 */

// YEDAN Agent Definitions
const YEDAN_AGENTS = [
  { id: 1, name: 'revenue-tracker', folderName: 'Revenue Tracking' },
  { id: 2, name: 'clawops', folderName: 'System Health' },
  { id: 3, name: 'github', folderName: 'OSS Marketing' },
  { id: 4, name: 'main', folderName: 'Commander' },
  { id: 5, name: 'intel-collector', folderName: 'Competitive Intel' },
  { id: 6, name: 'moltbook', folderName: 'Social Engagement' },
  { id: 7, name: 'browser-agent', folderName: 'Content Publishing' },
];

const TOOLS = ['Write', 'Edit', 'Read', 'Bash', 'Grep', 'Glob', 'WebFetch', 'Task'];

function sendToWebview(msg: unknown): void {
  window.postMessage(msg, '*');
}

// Load character sprites from PNGs
async function loadCharacterSprites(): Promise<
  Array<{ down: string[][][]; up: string[][][]; right: string[][][] }>
> {
  const characters: Array<{ down: string[][][]; up: string[][][]; right: string[][][] }> = [];

  for (let i = 0; i < 6; i++) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load char_${i}.png`));
        img.src = `./assets/characters/char_${i}.png`;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const FRAME_W = 16;
      const FRAME_H = 32; // 24px sprite + 8px padding
      const FRAMES_PER_ROW = 7;
      // Row 0 = down, Row 1 = up, Row 2 = right
      const dirNames: Array<'down' | 'up' | 'right'> = ['down', 'up', 'right'];
      const charData: { down: string[][][]; up: string[][][]; right: string[][][] } = {
        down: [],
        up: [],
        right: [],
      };

      for (let dirIdx = 0; dirIdx < 3; dirIdx++) {
        const dir = dirNames[dirIdx];
        for (let frame = 0; frame < FRAMES_PER_ROW; frame++) {
          const sx = frame * FRAME_W;
          const sy = dirIdx * FRAME_H;
          const imageData = ctx.getImageData(sx, sy, FRAME_W, FRAME_H);
          const sprite: string[][] = [];

          for (let row = 0; row < FRAME_H; row++) {
            const rowData: string[] = [];
            for (let col = 0; col < FRAME_W; col++) {
              const idx = (row * FRAME_W + col) * 4;
              const r = imageData.data[idx];
              const g = imageData.data[idx + 1];
              const b = imageData.data[idx + 2];
              const a = imageData.data[idx + 3];
              if (a >= 128) {
                rowData.push(
                  '#' +
                    r.toString(16).padStart(2, '0') +
                    g.toString(16).padStart(2, '0') +
                    b.toString(16).padStart(2, '0'),
                );
              } else {
                rowData.push('');
              }
            }
            sprite.push(rowData);
          }
          charData[dir].push(sprite);
        }
      }

      characters.push(charData);
    } catch {
      console.warn(`Could not load char_${i}.png, using fallback`);
    }
  }

  return characters;
}

// Load floor tiles from floors.png (if available) — skip since no floors.png in assets
// The engine has fallback floor rendering

// Load wall sprites from walls.png
async function loadWallSprites(): Promise<string[][][] | null> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = './assets/walls.png';
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    const TILE_W = 16;
    const TILE_H = 32;
    const COLS = 4;
    const ROWS = 4;
    const sprites: string[][][] = [];

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const sx = col * TILE_W;
        const sy = row * TILE_H;
        const imageData = ctx.getImageData(sx, sy, TILE_W, TILE_H);
        const sprite: string[][] = [];

        for (let r = 0; r < TILE_H; r++) {
          const rowData: string[] = [];
          for (let c = 0; c < TILE_W; c++) {
            const idx = (r * TILE_W + c) * 4;
            const red = imageData.data[idx];
            const green = imageData.data[idx + 1];
            const blue = imageData.data[idx + 2];
            const alpha = imageData.data[idx + 3];
            if (alpha >= 128) {
              rowData.push(
                '#' +
                  red.toString(16).padStart(2, '0') +
                  green.toString(16).padStart(2, '0') +
                  blue.toString(16).padStart(2, '0'),
              );
            } else {
              rowData.push('');
            }
          }
          sprite.push(rowData);
        }
        sprites.push(sprite);
      }
    }
    return sprites;
  } catch {
    console.warn('Could not load walls.png');
    return null;
  }
}

// Load default layout
async function loadDefaultLayout(): Promise<unknown> {
  try {
    const resp = await fetch('./assets/default-layout.json');
    return await resp.json();
  } catch {
    console.warn('Could not load default-layout.json');
    return null;
  }
}

// Simulate agent tool activity
function simulateAgentActivity(): void {
  setInterval(() => {
    for (const agent of YEDAN_AGENTS) {
      if (Math.random() < 0.15) {
        // Start a tool
        const tool = TOOLS[Math.floor(Math.random() * TOOLS.length)];
        const toolId = `tool_${Date.now()}_${agent.id}`;
        sendToWebview({
          type: 'agentToolStart',
          id: agent.id,
          toolId,
          status: tool,
        });

        // End tool after random delay
        const duration = 2000 + Math.random() * 8000;
        setTimeout(() => {
          sendToWebview({
            type: 'agentToolDone',
            id: agent.id,
            toolId,
            status: 'done',
          });

          // Clear tools after brief pause
          setTimeout(() => {
            sendToWebview({ type: 'agentToolsClear', id: agent.id });
          }, 500);
        }, duration);
      }
    }
  }, 3000);

  // Occasionally show waiting/permission bubbles
  setInterval(() => {
    const agent = YEDAN_AGENTS[Math.floor(Math.random() * YEDAN_AGENTS.length)];
    if (Math.random() < 0.3) {
      sendToWebview({ type: 'agentStatus', id: agent.id, status: 'waiting' });
      setTimeout(() => {
        sendToWebview({ type: 'agentStatus', id: agent.id, status: 'active' });
      }, 3000);
    }
  }, 12000);
}

// Main boot sequence
export async function boot(): Promise<void> {
  console.log('[YEDAN Boot] Starting Pixel Office standalone mode...');

  // Wait for webviewReady message from App
  await new Promise<void>((resolve) => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.type === 'webviewReady') {
        window.removeEventListener('vscode-outgoing', handler);
        resolve();
      }
    };
    window.addEventListener('vscode-outgoing', handler);

    // Also resolve after timeout in case webviewReady already fired
    setTimeout(resolve, 500);
  });

  console.log('[YEDAN Boot] Loading assets...');

  // 1. Load character sprites
  const characters = await loadCharacterSprites();
  if (characters.length > 0) {
    sendToWebview({ type: 'characterSpritesLoaded', characters });
    console.log(`[YEDAN Boot] Loaded ${characters.length} character sprites`);
  }

  // 2. Load wall sprites
  const wallSprites = await loadWallSprites();
  if (wallSprites) {
    sendToWebview({ type: 'wallTilesLoaded', sprites: wallSprites });
    console.log('[YEDAN Boot] Loaded wall sprites');
  }

  // 3. Send settings
  sendToWebview({ type: 'settingsLoaded', soundEnabled: true });

  // 4. Send existing agents (buffered until layout loads)
  const agentMeta: Record<number, { palette: number; hueShift: number; seatId?: string }> = {};
  const folderNames: Record<number, string> = {};
  for (let i = 0; i < YEDAN_AGENTS.length; i++) {
    const a = YEDAN_AGENTS[i];
    agentMeta[a.id] = { palette: i % 6, hueShift: 0 };
    folderNames[a.id] = a.folderName;
  }
  sendToWebview({
    type: 'existingAgents',
    agents: YEDAN_AGENTS.map((a) => a.id),
    agentMeta,
    folderNames,
  });

  // 5. Load and send layout
  const layout = await loadDefaultLayout();
  sendToWebview({ type: 'layoutLoaded', layout });
  console.log('[YEDAN Boot] Layout loaded, agents spawned');

  // 6. Start activity simulation
  setTimeout(() => {
    simulateAgentActivity();
    console.log('[YEDAN Boot] Agent activity simulation started');
  }, 2000);
}
