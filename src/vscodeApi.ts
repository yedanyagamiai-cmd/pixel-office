// Standalone mode: mock VS Code API when not running inside VS Code extension
let api: { postMessage(msg: unknown): void };

if (typeof acquireVsCodeApi === 'function') {
  api = acquireVsCodeApi();
} else {
  // Standalone mock — messages are handled by our boot script
  api = {
    postMessage(msg: unknown) {
      // Dispatch to standalone handler
      window.dispatchEvent(new CustomEvent('vscode-outgoing', { detail: msg }));
    },
  };
}

export const vscode = api;

declare function acquireVsCodeApi(): { postMessage(msg: unknown): void };
