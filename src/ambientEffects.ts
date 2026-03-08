/**
 * YEDAN Ambient Effects — Floating data particles and glow
 * Renders on top of the office scene for visual enhancement
 */

const PARTICLE_COUNT = 25;
const COLORS = ['#58a6ff', '#3fb950', '#bc8cff', '#d29922', '#f778ba'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

let particles: Particle[] = [];
let initialized = false;

function initParticles(w: number, h: number): void {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle(w, h));
  }
  initialized = true;
}

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 12,
    vy: (Math.random() - 0.5) * 8,
    size: 1 + Math.random() * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 0.05 + Math.random() * 0.12,
    life: 0,
    maxLife: 8 + Math.random() * 12,
  };
}

export function renderAmbientEffects(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dt: number,
  zoom: number,
): void {
  if (!initialized || particles.length === 0) {
    initParticles(w, h);
  }

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.life += dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // Wrap around
    if (p.x < 0) p.x += w;
    if (p.x > w) p.x -= w;
    if (p.y < 0) p.y += h;
    if (p.y > h) p.y -= h;

    // Fade based on life
    const lifeFrac = p.life / p.maxLife;
    const fadeAlpha = lifeFrac < 0.1 ? lifeFrac / 0.1 : lifeFrac > 0.9 ? (1 - lifeFrac) / 0.1 : 1;
    const alpha = p.alpha * fadeAlpha;

    // Respawn if dead
    if (p.life >= p.maxLife) {
      particles[i] = createParticle(w, h);
      continue;
    }

    // Draw particle
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    const sz = p.size * Math.max(1, zoom * 0.3);
    ctx.fillRect(Math.floor(p.x), Math.floor(p.y), sz, sz);
  }

  ctx.globalAlpha = 1;
}
