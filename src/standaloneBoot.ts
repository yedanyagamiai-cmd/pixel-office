/**
 * YEDAN Pixel Office — Standalone Boot Script v3
 * Dynamic agent simulation: characters move around, interact, do real tasks
 * NOT just sitting at desks typing — agents walk, meet, collaborate, go on errands
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

// ── Activity Definitions ─────────────────────────────────────────
// Each agent has DESK activities (typing) and ERRAND activities (walking around)

interface Activity {
  status: string;
  type: 'desk' | 'errand' | 'meeting' | 'dialogue';
  duration: [number, number]; // [min, max] ms
  meetWith?: number; // agent ID to meet with
}

const AGENT_ACTIVITIES: Record<number, Activity[]> = {
  1: [ // Revenue Tracking
    { status: 'Analyzing revenue data', type: 'desk', duration: [6000, 12000] },
    { status: 'Fetching Stripe metrics', type: 'desk', duration: [4000, 8000] },
    { status: 'Writing revenue report', type: 'desk', duration: [8000, 15000] },
    { status: 'Checking x402 payments', type: 'desk', duration: [5000, 10000] },
    { status: 'Checking server room', type: 'errand', duration: [6000, 10000] },
    { status: 'Getting coffee ☕', type: 'errand', duration: [5000, 8000] },
    { status: '→ Commander: Revenue +23%', type: 'dialogue', duration: [4000, 6000], meetWith: 4 },
    { status: '→ Intel: Need pricing data', type: 'dialogue', duration: [3000, 5000], meetWith: 5 },
    { status: 'Reviewing at whiteboard', type: 'errand', duration: [5000, 9000] },
  ],
  2: [ // System Health
    { status: 'Running diagnostics', type: 'desk', duration: [5000, 10000] },
    { status: 'Monitoring CPU load', type: 'desk', duration: [4000, 8000] },
    { status: 'Deploying hotfix v3.2.2', type: 'desk', duration: [8000, 14000] },
    { status: 'Patching security vuln', type: 'desk', duration: [6000, 12000] },
    { status: 'Inspecting server rack', type: 'errand', duration: [6000, 10000] },
    { status: 'Checking network cables', type: 'errand', duration: [4000, 7000] },
    { status: '→ Commander: All green ✓', type: 'dialogue', duration: [3000, 5000], meetWith: 4 },
    { status: '→ GitHub: CI fixed', type: 'dialogue', duration: [3000, 5000], meetWith: 3 },
    { status: 'Rebooting node 3', type: 'errand', duration: [5000, 8000] },
  ],
  3: [ // OSS Marketing
    { status: 'Reviewing pull requests', type: 'desk', duration: [6000, 12000] },
    { status: 'Writing release notes', type: 'desk', duration: [8000, 15000] },
    { status: 'Checking CI pipeline', type: 'desk', duration: [4000, 8000] },
    { status: 'Updating documentation', type: 'desk', duration: [7000, 12000] },
    { status: 'Brainstorming at board', type: 'errand', duration: [6000, 10000] },
    { status: 'Grabbing a snack 🍪', type: 'errand', duration: [4000, 7000] },
    { status: '→ MoltBook: Share update', type: 'dialogue', duration: [3000, 5000], meetWith: 6 },
    { status: '→ Content: Blog material', type: 'dialogue', duration: [3000, 5000], meetWith: 7 },
    { status: 'Reading in library', type: 'errand', duration: [5000, 9000] },
  ],
  4: [ // Commander
    { status: 'Planning daily strategy', type: 'desk', duration: [6000, 12000] },
    { status: 'Reviewing team KPIs', type: 'desk', duration: [5000, 10000] },
    { status: 'Coordinating pipeline', type: 'desk', duration: [7000, 13000] },
    { status: 'Setting sprint goals', type: 'desk', duration: [6000, 11000] },
    { status: 'Walking the floor', type: 'errand', duration: [6000, 10000] },
    { status: 'Meeting in conf room', type: 'errand', duration: [5000, 9000] },
    { status: '→ Revenue: Status?', type: 'dialogue', duration: [3000, 5000], meetWith: 1 },
    { status: '→ ClawOps: Deploy ok?', type: 'dialogue', duration: [3000, 5000], meetWith: 2 },
    { status: '→ Intel: Brief needed', type: 'dialogue', duration: [3000, 5000], meetWith: 5 },
    { status: 'Checking all rooms', type: 'errand', duration: [7000, 12000] },
  ],
  5: [ // Competitive Intel
    { status: 'Scanning competitor sites', type: 'desk', duration: [6000, 12000] },
    { status: 'Analyzing market trends', type: 'desk', duration: [7000, 13000] },
    { status: 'Writing intel report', type: 'desk', duration: [8000, 14000] },
    { status: 'Monitoring new launches', type: 'desk', duration: [5000, 10000] },
    { status: 'Researching in library', type: 'errand', duration: [6000, 10000] },
    { status: 'Stretching legs', type: 'errand', duration: [4000, 7000] },
    { status: '→ Commander: Threat alert', type: 'dialogue', duration: [3000, 5000], meetWith: 4 },
    { status: '→ GitHub: Keyword data', type: 'dialogue', duration: [3000, 5000], meetWith: 3 },
    { status: 'Reviewing at whiteboard', type: 'errand', duration: [5000, 9000] },
  ],
  6: [ // Social Engagement
    { status: 'Crafting social post', type: 'desk', duration: [5000, 10000] },
    { status: 'Checking engagement', type: 'desk', duration: [4000, 8000] },
    { status: 'Scheduling campaign', type: 'desk', duration: [6000, 11000] },
    { status: 'Building audience list', type: 'desk', duration: [7000, 12000] },
    { status: 'Photo shoot prep', type: 'errand', duration: [5000, 8000] },
    { status: 'Coffee break ☕', type: 'errand', duration: [4000, 7000] },
    { status: '→ Content: Post ready', type: 'dialogue', duration: [3000, 5000], meetWith: 7 },
    { status: '→ Revenue: Lead report', type: 'dialogue', duration: [3000, 5000], meetWith: 1 },
    { status: 'Brainstorming ideas', type: 'errand', duration: [5000, 9000] },
  ],
  7: [ // Content Publishing
    { status: 'Writing blog article', type: 'desk', duration: [8000, 15000] },
    { status: 'Editing draft v2', type: 'desk', duration: [6000, 12000] },
    { status: 'SEO optimization', type: 'desk', duration: [5000, 10000] },
    { status: 'Uploading media files', type: 'desk', duration: [4000, 8000] },
    { status: 'Taking photos 📸', type: 'errand', duration: [5000, 9000] },
    { status: 'Reviewing print queue', type: 'errand', duration: [4000, 7000] },
    { status: '→ MoltBook: Publish now?', type: 'dialogue', duration: [3000, 5000], meetWith: 6 },
    { status: '→ GitHub: Docs update', type: 'dialogue', duration: [3000, 5000], meetWith: 3 },
    { status: 'Reading reference books', type: 'errand', duration: [5000, 9000] },
  ],
};

// Tool names for animation type detection (typing vs reading)
const ERRAND_TOOLS = ['WebFetch', 'Read', 'Grep', 'Glob', 'WebSearch'];
const DESK_TOOLS = ['Write', 'Edit', 'Bash', 'Task'];

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
    return dirs.flat();
  } catch {
    return null;
  }
}

async function loadFloorSprites(): Promise<string[][][] | null> {
  try {
    const img = await loadImage('./assets/floors.png');
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    const patterns: string[][][] = [];
    const patternCount = Math.floor(img.width / 16);
    for (let p = 0; p < patternCount; p++) {
      const data = ctx.getImageData(p * 16, 0, 16, 16);
      const sprite: string[][] = [];
      for (let r = 0; r < 16; r++) {
        const row: string[] = [];
        for (let c = 0; c < 16; c++) {
          const i = (r * 16 + c) * 4;
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
      patterns.push(sprite);
    }
    return patterns;
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

// ── Dynamic Agent Simulation ────────────────────────────────────
// Agents cycle through: desk work → errands → meetings → breaks
// Creating constant movement and purposeful interaction

function simulateActivity(): void {
  // Agent state tracking
  const agentState = new Map<number, 'desk' | 'away'>();
  const agentToolId = new Map<number, string>();

  // Stagger initial activities so not all agents start the same way
  YEDAN_AGENTS.forEach((agent, idx) => {
    const delay = idx * 800 + Math.random() * 500;
    setTimeout(() => scheduleNextActivity(agent.id), delay);
  });

  function pickActivity(agentId: number): Activity {
    const activities = AGENT_ACTIVITIES[agentId];
    const currentState = agentState.get(agentId) || 'desk';

    // Weighted selection: 40% desk, 30% errand, 30% dialogue/meeting
    // But if been at desk too long, prefer errand/meeting
    const rand = Math.random();
    let candidates: Activity[];

    if (currentState === 'desk' && rand < 0.45) {
      // After desk work, often go on errand or meeting
      candidates = activities.filter(a => a.type !== 'desk');
    } else if (currentState === 'away') {
      // After being away, go back to desk (but sometimes chain errands)
      candidates = rand < 0.7
        ? activities.filter(a => a.type === 'desk')
        : activities.filter(a => a.type !== 'desk');
    } else {
      candidates = activities;
    }

    if (candidates.length === 0) candidates = activities;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function scheduleNextActivity(agentId: number): void {
    const activity = pickActivity(agentId);
    const duration = activity.duration[0] + Math.random() * (activity.duration[1] - activity.duration[0]);
    const toolId = `t_${Date.now()}_${agentId}_${Math.random().toString(36).slice(2, 6)}`;

    // Clear previous tool
    const prevToolId = agentToolId.get(agentId);
    if (prevToolId) {
      send({ type: 'agentToolDone', id: agentId, toolId: prevToolId, status: 'done' });
    }

    if (activity.type === 'desk') {
      // DESK WORK: Agent goes to seat and types
      agentState.set(agentId, 'desk');
      send({ type: 'agentStatus', id: agentId, status: 'active' });
      // Set a desk tool for correct animation (typing)
      const deskTool = DESK_TOOLS[Math.floor(Math.random() * DESK_TOOLS.length)];
      send({ type: 'agentToolStart', id: agentId, toolId, status: activity.status });
      agentToolId.set(agentId, toolId);
    } else {
      // ERRAND / MEETING / DIALOGUE: Agent gets up and walks around
      agentState.set(agentId, 'away');

      // First show the activity text
      send({ type: 'agentToolStart', id: agentId, toolId, status: activity.status });
      agentToolId.set(agentId, toolId);

      // Then make them leave their seat (slight delay so text appears first)
      setTimeout(() => {
        send({ type: 'agentStatus', id: agentId, status: 'waiting' });
      }, 200);

      // If it's a dialogue, also briefly affect the target agent
      if (activity.type === 'dialogue' && activity.meetWith) {
        const targetId = activity.meetWith;
        const targetToolId = `reply_${Date.now()}_${targetId}`;

        // Target acknowledges after a moment
        setTimeout(() => {
          const targetAgent = YEDAN_AGENTS.find(a => a.id === agentId);
          const fromName = targetAgent?.folderName || 'Agent';
          send({
            type: 'agentToolStart',
            id: targetId,
            toolId: targetToolId,
            status: `← ${fromName}: Received`,
          });

          // Brief acknowledgment then back to their work
          setTimeout(() => {
            send({ type: 'agentToolDone', id: targetId, toolId: targetToolId, status: 'done' });
          }, 2500 + Math.random() * 2000);
        }, 1500 + Math.random() * 1000);
      }
    }

    // Schedule next activity
    setTimeout(() => {
      // Clean up current tool
      send({ type: 'agentToolDone', id: agentId, toolId, status: 'done' });
      agentToolId.set(agentId, '');

      // Brief transition gap
      const gap = 400 + Math.random() * 800;
      setTimeout(() => scheduleNextActivity(agentId), gap);
    }, duration);
  }

  // Periodic team meetings: Commander gathers 2-3 agents
  setInterval(() => {
    if (Math.random() < 0.3) {
      const meetingAgents = [4]; // Commander always leads
      const others = [1, 2, 3, 5, 6, 7].sort(() => Math.random() - 0.5).slice(0, 2);
      meetingAgents.push(...others);

      const topics = [
        'Sprint planning session',
        'Revenue review meeting',
        'Strategy alignment',
        'Weekly sync-up',
        'Pipeline review',
      ];
      const topic = topics[Math.floor(Math.random() * topics.length)];

      for (const agentId of meetingAgents) {
        const toolId = `meet_${Date.now()}_${agentId}`;
        const prevToolId = agentToolId.get(agentId);
        if (prevToolId) {
          send({ type: 'agentToolDone', id: agentId, toolId: prevToolId, status: 'done' });
        }

        send({ type: 'agentToolStart', id: agentId, toolId, status: `📋 ${topic}` });
        agentToolId.set(agentId, toolId);
        agentState.set(agentId, 'away');

        setTimeout(() => {
          send({ type: 'agentStatus', id: agentId, status: 'waiting' });
        }, 300);

        // Meeting ends, agents return to work
        const meetDuration = 8000 + Math.random() * 7000;
        setTimeout(() => {
          send({ type: 'agentToolDone', id: agentId, toolId, status: 'done' });
          agentToolId.set(agentId, '');
          send({ type: 'agentStatus', id: agentId, status: 'active' });
          agentState.set(agentId, 'desk');

          // Resume normal activity after brief pause
          setTimeout(() => scheduleNextActivity(agentId), 1000 + Math.random() * 2000);
        }, meetDuration);
      }
    }
  }, 30000);

  // Occasional sub-agent spawn for complex tasks
  setInterval(() => {
    const a = YEDAN_AGENTS[Math.floor(Math.random() * YEDAN_AGENTS.length)];
    if (Math.random() < 0.06) {
      const subtasks = [
        'Deep Analysis', 'Code Review', 'Integration Test',
        'Security Audit', 'Performance Scan', 'Data Migration',
      ];
      const task = subtasks[Math.floor(Math.random() * subtasks.length)];
      const toolId = `sub_${Date.now()}`;
      send({ type: 'agentToolStart', id: a.id, toolId, status: `Subtask: ${task}` });
      setTimeout(() => {
        send({ type: 'subagentClear', id: a.id, parentToolId: toolId });
        send({ type: 'agentToolsClear', id: a.id });
      }, 10000 + Math.random() * 15000);
    }
  }, 25000);
}

// ── Boot Sequence ────────────────────────────────────────────────

export async function boot(): Promise<void> {
  console.log('[YEDAN] Pixel Office v3 booting...');

  // Wait for React to mount
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
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        window.removeEventListener('vscode-outgoing', handler);
        resolve();
      }
    }, 1500);
  });

  console.log('[YEDAN] Loading assets...');

  // 1. Character sprites
  const chars = await loadCharacterSprites();
  if (chars.length > 0) {
    send({ type: 'characterSpritesLoaded', characters: chars });
    console.log(`[YEDAN] ${chars.length} character sprite sets loaded`);
  }

  // 2. Floor tile patterns
  const floors = await loadFloorSprites();
  if (floors) {
    send({ type: 'floorTilesLoaded', sprites: floors });
    console.log(`[YEDAN] ${floors.length} floor tile patterns loaded`);
  }

  // 3. Wall sprites
  const walls = await loadWallSprites();
  if (walls) {
    send({ type: 'wallTilesLoaded', sprites: walls });
    console.log('[YEDAN] Wall sprites loaded');
  }

  // 4. Furniture assets
  try {
    const furRes = await fetch('./assets/furniture-data.json');
    if (furRes.ok) {
      const furData = await furRes.json();
      send({ type: 'furnitureAssetsLoaded', catalog: furData.catalog, sprites: furData.sprites });
      console.log(`[YEDAN] ${furData.catalog.length} furniture assets loaded`);
    }
  } catch { console.warn('[Boot] furniture-data.json not found'); }

  // 5. Settings
  send({ type: 'settingsLoaded', soundEnabled: false });

  // 6. Pre-register agents
  const agentMeta: Record<number, { palette: number; hueShift: number }> = {};
  const folderNames: Record<number, string> = {};
  for (let i = 0; i < YEDAN_AGENTS.length; i++) {
    agentMeta[YEDAN_AGENTS[i].id] = { palette: i % 6, hueShift: i >= 6 ? 60 : 0 };
    folderNames[YEDAN_AGENTS[i].id] = YEDAN_AGENTS[i].folderName;
  }
  send({
    type: 'existingAgents',
    agents: YEDAN_AGENTS.map((a) => a.id),
    agentMeta,
    folderNames,
  });

  // 7. Load and send layout
  const layout = await loadLayout();
  send({ type: 'layoutLoaded', layout });
  console.log('[YEDAN] Layout loaded, agents spawning...');

  // 8. Start dynamic simulation after agents settle
  setTimeout(() => {
    for (const a of YEDAN_AGENTS) {
      send({ type: 'agentStatus', id: a.id, status: 'active' });
    }
    // Brief desk phase, then start the full dynamic simulation
    setTimeout(() => {
      simulateActivity();
      console.log('[YEDAN] Dynamic agent simulation active');
    }, 3000);
  }, 2000);
}
