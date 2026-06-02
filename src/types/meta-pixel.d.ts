declare global {
  function fbq(command: "init" | "track" | "trackCustom", event: string, params?: Record<string, unknown>): void;
  interface Window {
    fbq: typeof fbq;
    _fbq: typeof fbq;
  }
}

export {};
