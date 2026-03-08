// Standalone mode: mock VS Code API when not running inside VS Code extension

interface VsCodeApi {
  postMessage(msg: unknown): void;
}

function createApi(): VsCodeApi {
  // Check if we're inside VS Code webview
  if (typeof globalThis.acquireVsCodeApi === 'function') {
    (window as unknown as Record<string, unknown>).__vscodeApi = true;
    return globalThis.acquireVsCodeApi();
  }

  // Standalone mock
  return {
    postMessage(msg: unknown) {
      window.dispatchEvent(new CustomEvent('vscode-outgoing', { detail: msg }));
    },
  };
}

export const vscode = createApi();

declare namespace globalThis {
  // eslint-disable-next-line no-var
  var acquireVsCodeApi: (() => VsCodeApi) | undefined;
}
