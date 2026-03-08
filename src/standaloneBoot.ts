/**
 * YEDAN Pixel Office — Standalone Boot Script
 * Simulates VS Code extension messages to spawn 7 YEDAN agents
 * with the full pixel-agents engine (sprites, animations, pathfinding)
 */

// YEDAN Agent Definitions — edit these to customize your agents
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

function send(msg: unknown): void {
  window.postMessage(msg, '*');
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed: ${src}`));
    img.src = src;
  });
}

function imageToSprites(
  img: HTMLImageElement,
  frameW: number,
  frameH: number,
  framesPerRow: number,
  dirCount: number,
): string[][][][] {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const dirs: string[][][][] = [];
  for (let d = 0; d < dirCount; d++) {
    const frames: string[][][] = [];
    for (let f = 0; f < framesPerRow; f++) {
      const data = ctx.getImageData(f * frameW, d * frameH, frameW, frameH);
      const sprite: string[][] = [];
      for (let r = 0; r < frameH; r++) {
        const row: string[] = [];
        for (let c = 0; c < frameW; c++) {
          const i = (r * frameW + c) * 4;
          if (data.data[i + 3] >= 128) {
            row.push(
              '#' +
                data.data[i].toString(16).padStart(2, '0') +
                data.data[i + 1].toString(16).padStart(2, '0') +
                data.data[i + 2].toString(16).padStart(2, '0'),
            );
          } else {
            row.push('');
          }
        }
        sprite.push(row);
      }
      frames.push(sprite);
    }
    dirs.push(frames);
  }
  return dirs;
}

async function loadCharacterSprites(): Promise<
  Array<{ down: string[][][]; up: string[][][]; right: string[][][] }>
> {
  const results: Array<{ down: string[][][]; up: string[][][]; right: string[][][] }> = [];
  for (let i = 0; i < 6; i++) {
    try {
      const img = await loadImage(`./assets/characters/char_${i}.png`);
      const dirs = imageToSprites(img, 16, 32, 7, 3);
      results.push({ down: dirs[0], up: dirs[1], right: dirs[2] });
    } catch {
      console.warn(`[Boot] char_${i}.png not found, using fallback`);
    }
  }
  return results;
}

async function loadWallSprites(): Promise<string[][][] | null> {
  try {
    const img = await loadImage('./assets/walls.png');
    const dirs = imageToSprites(img, 16, 32, 4, 4);
    // Flatten 4×4 grid → 16 sprites
    return dirs.flat();
  } catch {
    return null;
  }
}

async function loadLayout(): Promise<unknown> {
  try {
    const r = await fetch('./assets/default-layout.json');
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

// Simulate realistic agent activity
function simulateActivity(): void {
  // Tool activity cycle
  setInterval(() => {
    for (const agent of YEDAN_AGENTS) {
      if (Math.random() < 0.12) {
        const tool = TOOLS[Math.floor(Math.random() * TOOLS.length)];
        const toolId = `t_${Date.now()}_${agent.id}_${Math.random().toString(36).slice(2, 6)}`;
        send({ type: 'agentToolStart', id: agent.id, toolId, status: tool });

        const dur = 3000 + Math.random() * 10000;
        setTimeout(() => {
          send({ type: 'agentToolDone', id: agent.id, toolId, status: 'done' });
          setTimeout(() => send({ type: 'agentToolsClear', id: agent.id }), 400);
        }, dur);
      }
    }
  }, 2500);

  // Occasional waiting status
  setInterval(() => {
    const a = YEDAN_AGENTS[Math.floor(Math.random() * YEDAN_AGENTS.length)];
    if (Math.random() < 0.2) {
      send({ type: 'agentStatus', id: a.id, status: 'waiting' });
      setTimeout(() => send({ type: 'agentStatus', id: a.id, status: 'active' }), 2500 + Math.random() * 3000);
    }
  }, 15000);

  // Occasional sub-agent spawn
  setInterval(() => {
    const a = YEDAN_AGENTS[Math.floor(Math.random() * YEDAN_AGENTS.length)];
    if (Math.random() < 0.08) {
      const toolId = `sub_${Date.now()}`;
      send({ type: 'agentToolStart', id: a.id, toolId, status: 'Subtask: Research' });
      setTimeout(() => {
        send({ type: 'subagentClear', id: a.id, parentToolId: toolId });
        send({ type: 'agentToolsClear', id: a.id });
      }, 8000 + Math.random() * 12000);
    }
  }, 20000);
}

export async function boot(): Promise<void> {
  console.log('[YEDAN] Pixel Office booting...');

  // Wait for React to mount and useExtensionMessages to listen
  // The hook calls vscode.postMessage({type:'webviewReady'}) on mount
  await new Promise<void>((resolve) => {
    let resolved = false;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.type === 'webviewReady' && !resolved) {
        resolved = true;
        window.removeEventListener('vscode-outgoing', handler);
        resolve();
      }
    };
    window.addEventListener('vscode-outgoing', handler);
    // Safety timeout — if webviewReady already fired before we started listening
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        window.removeEventListener('vscode-outgoing', handler);
        resolve();
      }
    }, 1500);
  });

  console.log('[YEDAN] Loading sprites...');

  // 1. Character sprites
  const chars = await loadCharacterSprites();
  if (chars.length > 0) {
    send({ type: 'characterSpritesLoaded', characters: chars });
    console.log(`[YEDAN] ${chars.length} character sprite sets loaded`);
  }

  // 2. Wall sprites
  const walls = await loadWallSprites();
  if (walls) {
    send({ type: 'wallTilesLoaded', sprites: walls });
    console.log('[YEDAN] Wall sprites loaded');
  }

  // 3. Settings
  send({ type: 'settingsLoaded', soundEnabled: false });

  // 4. Pre-register agents (buffered until layout loads)
  const agentMeta: Record<number, { palette: number; hueShift: number }> = {};
  const folderNames: Record<number, string> = {};
  for (let i = 0; i < YEDAN_AGENTS.length; i++) {
    agentMeta[YEDAN_AGENTS[i].id] = { palette: i % 6, hueShift: 0 };
    folderNames[YEDAN_AGENTS[i].id] = YEDAN_AGENTS[i].folderName;
  }
  send({
    type: 'existingAgents',
    agents: YEDAN_AGENTS.map((a) => a.id),
    agentMeta,
    folderNames,
  });

  // 5. Load and send layout — this triggers agent spawn
  const layout = await loadLayout();
  send({ type: 'layoutLoaded', layout });
  console.log('[YEDAN] Layout loaded, agents spawning...');

  // 6. Start activity simulation after agents settle
  setTimeout(() => {
    simulateActivity();
    console.log('[YEDAN] Activity simulation running');
  }, 3000);
}
