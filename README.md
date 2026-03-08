# YEDAN Pixel Office

**Pixel art dashboard for visualizing AI agent fleets in real-time.**

![Screenshot](Screenshot.jpg)

## What is this?

A retro pixel-art command center that visualizes your AI agent team as animated characters in an office. Each agent walks around, collaborates, works at desks, and shows real-time status — like a tiny SimCity for your AI fleet.

## Features

- 7 animated AI agents with unique roles and behaviors
- Agents walk, meet, collaborate, and go on errands (not just typing!)
- Real-time status display for each agent
- Pixel art office with server room, whiteboard, coffee area
- Works standalone or as a VS Code extension
- Connects to any agent framework via simple API

## Agents

| Agent | Role | Activities |
|-------|------|-----------|
| **Commander** | Fleet orchestration | Strategy planning, team briefings |
| **Revenue Tracker** | Revenue monitoring | Stripe metrics, x402 payments |
| **ClawOps** | System health | Health checks, incident response |
| **GitHub** | OSS marketing | Issue triage, PR reviews |
| **Intel Collector** | Competitive intel | Market scanning, reports |
| **MoltBook** | Social engagement | Community interaction |
| **Browser Agent** | Content publishing | Web automation, publishing |

## Quick Start

```bash
# Open directly in browser
open index.html

# Or serve locally
npx serve .
```

Visit `http://localhost:3000` and watch your AI team work!

## Live Demo

[yedan-pixel-office.pages.dev](https://yedan-pixel-office.pages.dev)

## Integration

Connect to your agent framework by posting status updates:

```javascript
// Update agent status
fetch("/api/status", {
  method: "POST",
  body: JSON.stringify({
    agentId: 1,
    status: "Analyzing revenue data",
    type: "desk"
  })
});
```

## Part of OpenClaw

This dashboard visualizes the [OpenClaw](https://github.com/yedanyagamiai-cmd/openclaw-mcp-servers) AI agent ecosystem — 9 MCP servers, 49 tools, running 24/7.

## License

MIT — [OpenClaw Intelligence](https://github.com/yedanyagamiai-cmd)
