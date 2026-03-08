import { useCallback, useEffect, useRef, useState } from 'react';

// ── Agent Definitions ──────────────────────────────────────
const AGENT_INFO: Record<number, { name: string; role: string; score: number; color: string }> = {
  1: { name: 'revenue-tracker', role: 'Financial Tracking', score: 85, color: '#3fb950' },
  2: { name: 'clawops', role: 'System Health', score: 55, color: '#58a6ff' },
  3: { name: 'github', role: 'OSS Marketing', score: 50, color: '#bc8cff' },
  4: { name: 'main', role: 'Commander', score: 45, color: '#f0883e' },
  5: { name: 'intel-collector', role: 'Competitive Intel', score: 40, color: '#d29922' },
  6: { name: 'moltbook', role: 'Social Engagement', score: 30, color: '#f778ba' },
  7: { name: 'browser-agent', role: 'Content Publishing', score: 25, color: '#da3633' },
};

// ── Cloud Services ──────────────────────────────────────────
const CLOUD_SERVICES = [
  { name: 'JSON Toolkit', url: 'https://json-toolkit-mcp.yagami8095.workers.dev/mcp', cat: 'mcp' },
  { name: 'Regex Engine', url: 'https://regex-engine-mcp.yagami8095.workers.dev/mcp', cat: 'mcp' },
  { name: 'Color Palette', url: 'https://color-palette-mcp.yagami8095.workers.dev/mcp', cat: 'mcp' },
  { name: 'Timestamp', url: 'https://timestamp-converter-mcp.yagami8095.workers.dev/mcp', cat: 'mcp' },
  { name: 'Prompt Enhancer', url: 'https://prompt-enhancer-mcp.yagami8095.workers.dev/mcp', cat: 'mcp' },
  { name: 'Intel MCP', url: 'https://openclaw-intel-mcp.yagami8095.workers.dev/mcp', cat: 'mcp' },
  { name: 'Fortune MCP', url: 'https://openclaw-fortune-mcp.yagami8095.workers.dev/mcp', cat: 'mcp' },
  { name: 'Publisher', url: 'https://moltbook-publisher-mcp.yagami8095.workers.dev/mcp', cat: 'mcp' },
  { name: 'AgentForge', url: 'https://agentforge-compare-mcp.yagami8095.workers.dev/mcp', cat: 'mcp' },
  { name: 'Product Store', url: 'https://product-store.yagami8095.workers.dev', cat: 'infra' },
  { name: 'Auto Agent', url: 'https://yedan-auto-agent.yagami8095.workers.dev/health', cat: 'infra' },
  { name: 'x402 Gateway', url: 'https://openclaw-x402-gateway.yagami8095.workers.dev', cat: 'infra' },
  { name: 'Orchestrator', url: 'https://yedan-orchestrator.yagami8095.workers.dev', cat: 'fleet' },
  { name: 'Health Cmd', url: 'https://yedan-health-commander.yagami8095.workers.dev', cat: 'fleet' },
  { name: 'Revenue Snt', url: 'https://yedan-revenue-sentinel.yagami8095.workers.dev', cat: 'fleet' },
  { name: 'Cloud Exec', url: 'https://yedan-cloud-executor.yagami8095.workers.dev', cat: 'fleet' },
  { name: 'Content Eng', url: 'https://yedan-content-engine.yagami8095.workers.dev', cat: 'fleet' },
  { name: 'Intel Ops', url: 'https://yedan-intel-ops.yagami8095.workers.dev', cat: 'fleet' },
  { name: 'Intel API', url: 'https://openclaw-intel-api.yagami8095.workers.dev', cat: 'support' },
  { name: 'Fortune API', url: 'https://fortune-api.yagami8095.workers.dev', cat: 'support' },
  { name: 'KPI Dash', url: 'https://kpi-dashboard.yagami8095.workers.dev', cat: 'support' },
  { name: 'Analytics', url: 'https://openclaw-analytics.yagami8095.workers.dev', cat: 'support' },
  { name: 'Quality', url: 'https://quality-scorer-mcp.yagami8095.workers.dev', cat: 'support' },
  { name: 'Status Dash', url: 'https://yedan-status-dashboard.yagami8095.workers.dev', cat: 'support' },
];

interface CloudResult {
  ok: boolean;
  ms: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const S: Record<string, any> = {
  hud: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 60,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 14px',
    background: 'rgba(10,10,20,0.88)',
    borderBottom: '2px solid #1a1a2e',
    fontFamily: "'FS Pixel Sans', 'Courier New', monospace",
    fontSize: '11px',
    pointerEvents: 'auto',
  },
  title: {
    fontSize: '13px',
    color: '#58a6ff',
    letterSpacing: '1px',
    fontWeight: 'bold',
  },
  titleAccent: { color: '#3fb950' },
  stats: { display: 'flex', gap: '14px', alignItems: 'center', fontSize: '10px' },
  stat: { display: 'flex', alignItems: 'center', gap: '4px' },
  dot: (color: string): React.CSSProperties => ({
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 4px ${color}88`,
    display: 'inline-block',
  }),
  panel: {
    position: 'fixed',
    top: 32,
    right: 0,
    zIndex: 60,
    background: 'rgba(10,10,20,0.9)',
    borderLeft: '2px solid #1a1a2e',
    borderBottom: '2px solid #1a1a2e',
    padding: '6px 8px',
    width: 170,
    maxHeight: 'calc(100vh - 80px)',
    overflowY: 'auto',
    fontFamily: "'FS Pixel Sans', 'Courier New', monospace",
    fontSize: '9px',
    pointerEvents: 'auto',
  },
  panelTitle: { color: '#58a6ff', fontSize: '10px', marginBottom: 4, letterSpacing: '1px', fontWeight: 'bold' },
  section: {
    color: '#bc8cff',
    fontSize: '8px',
    marginTop: 5,
    marginBottom: 2,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    borderTop: '1px solid #1a1a2e',
    paddingTop: 3,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '1px 0',
    borderBottom: '1px solid rgba(26,26,46,0.5)',
  },
  svcName: { color: '#8b949e', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  agentBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 60,
    background: 'rgba(10,10,20,0.9)',
    borderTop: '2px solid #1a1a2e',
    padding: '6px 10px',
    display: 'flex',
    gap: 6,
    overflowX: 'auto' as const,
    fontFamily: "'FS Pixel Sans', 'Courier New', monospace",
    pointerEvents: 'auto',
  },
  agentCard: (selected: boolean): React.CSSProperties => ({
    background: selected ? '#0d1f0d' : '#161b22',
    border: `2px solid ${selected ? '#3fb950' : '#30363d'}`,
    padding: '5px 8px',
    minWidth: 110,
    fontSize: '9px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  }),
};

export function YedanHud({
  agents,
  agentTools,
}: {
  agents: number[];
  agentTools: Record<number, Array<{ toolId: string; status: string; done: boolean }>>;
}) {
  const [cloudResults, setCloudResults] = useState<Record<string, CloudResult>>({});
  const [clock, setClock] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const checkRunning = useRef(false);

  // Clock
  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Cloud health check
  const checkCloud = useCallback(async () => {
    if (checkRunning.current) return;
    checkRunning.current = true;
    const results: Record<string, CloudResult> = {};
    await Promise.all(
      CLOUD_SERVICES.map(async (svc) => {
        const t = performance.now();
        try {
          const ac = new AbortController();
          const tid = setTimeout(() => ac.abort(), 8000);
          await fetch(svc.url, { method: 'HEAD', mode: 'no-cors', signal: ac.signal });
          clearTimeout(tid);
          results[svc.name] = { ok: true, ms: Math.round(performance.now() - t) };
        } catch {
          results[svc.name] = { ok: false, ms: Math.round(performance.now() - t) };
        }
      }),
    );
    setCloudResults(results);
    checkRunning.current = false;
  }, []);

  useEffect(() => {
    checkCloud();
    const id = setInterval(checkCloud, 60000);
    return () => clearInterval(id);
  }, [checkCloud]);

  const upCount = Object.values(cloudResults).filter((r) => r.ok).length;
  const totalChecked = Object.keys(cloudResults).length;

  return (
    <>
      {/* ── Top HUD ────────────────────────────────────── */}
      <div style={S.hud}>
        <div style={S.title}>
          YEDAN <span style={S.titleAccent}>Pixel Office</span>
        </div>
        <div style={S.stats}>
          <div style={S.stat}>
            <span style={S.dot('#3fb950')} />
            <span style={{ color: '#3fb950' }}>{agents.length}</span>
            <span style={{ color: '#8b949e' }}>Agents</span>
          </div>
          <div style={S.stat}>
            <span style={S.dot(upCount === totalChecked && totalChecked > 0 ? '#3fb950' : '#d29922')} />
            <span style={{ color: upCount === totalChecked ? '#3fb950' : '#d29922' }}>
              {upCount}/{CLOUD_SERVICES.length}
            </span>
            <span style={{ color: '#8b949e' }}>Workers</span>
          </div>
          <div style={S.stat}>
            <span style={{ color: '#3fb950', fontWeight: 'bold' }}>$172</span>
            <span style={{ color: '#8b949e' }}>revenue</span>
          </div>
          <div style={S.stat}>
            <span style={{ color: '#d29922' }}>49</span>
            <span style={{ color: '#8b949e' }}>tools</span>
          </div>
          <div style={S.stat}>
            <span style={{ color: '#8b949e' }}>{clock}</span>
          </div>
          <div style={S.stat}>
            <span style={{ color: '#484f58', fontSize: '8px' }}>Survival Mode: Cycle 1</span>
          </div>
        </div>
      </div>

      {/* ── Right Cloud Panel ──────────────────────────── */}
      <div style={S.panel}>
        <div
          style={{ ...S.panelTitle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
          onClick={() => setPanelCollapsed(!panelCollapsed)}
        >
          <span>BUNSIN Cloud Brain</span>
          <span style={{ color: '#484f58' }}>{panelCollapsed ? '▸' : '▾'}</span>
        </div>
        {!panelCollapsed && (
          <>
            {(['mcp', 'infra', 'fleet', 'support'] as const).map((cat) => (
              <div key={cat}>
                <div style={S.section}>
                  {cat === 'mcp'
                    ? 'MCP Servers'
                    : cat === 'infra'
                      ? 'Infrastructure'
                      : cat === 'fleet'
                        ? 'Fleet Workers'
                        : 'Support'}
                </div>
                {CLOUD_SERVICES.filter((s) => s.cat === cat).map((svc) => {
                  const r = cloudResults[svc.name];
                  return (
                    <div key={svc.name} style={S.row}>
                      <span style={S.dot(r ? (r.ok ? '#3fb950' : '#f85149') : '#8b949e')} />
                      <span style={S.svcName}>{svc.name}</span>
                      <span
                        style={{
                          color: r ? (r.ms > 2000 ? '#f85149' : r.ms > 500 ? '#d29922' : '#3fb950') : '#484f58',
                          fontSize: '8px',
                          minWidth: 30,
                          textAlign: 'right',
                        }}
                      >
                        {r ? r.ms + 'ms' : '--'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── Bottom Agent Bar ───────────────────────────── */}
      <div style={S.agentBar}>
        {agents.map((id) => {
          const info = AGENT_INFO[id];
          if (!info) return null;
          const tools = agentTools[id] || [];
          const activeTool = tools.find((t) => !t.done);
          return (
            <div
              key={id}
              style={S.agentCard(selectedAgent === id)}
              onClick={() => setSelectedAgent(selectedAgent === id ? null : id)}
            >
              <div style={{ fontWeight: 'bold', color: info.color, fontSize: '10px', marginBottom: 1 }}>
                {info.name}
              </div>
              <div style={{ color: '#8b949e', fontSize: '8px' }}>{info.role}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <span style={{ color: info.score >= 50 ? '#3fb950' : '#d29922', fontWeight: 'bold' }}>
                  {info.score}pts
                </span>
                <span style={{ color: activeTool ? '#d29922' : '#484f58', fontSize: '8px' }}>
                  {activeTool ? activeTool.status : 'idle'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
