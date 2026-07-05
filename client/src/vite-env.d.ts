// Injected by Vite's `define` from package.json (see vite.config.ts).
declare const __APP_VERSION__: string;

// Cloudflare Turnstile, loaded from the CF script when a site key is configured.
interface Window {
  turnstile?: {
    render: (
      el: HTMLElement,
      opts: {
        sitekey: string;
        callback: (token: string) => void;
        "error-callback"?: () => void;
        "expired-callback"?: () => void;
        theme?: "dark" | "light" | "auto";
      },
    ) => string;
    reset: (id?: string) => void;
  };
}
