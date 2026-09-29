// Type setup for tests under `tsc --noEmit` (TypeScript 6 no longer auto-includes @types/*).
/// <reference types="jest" />

// jsdom ships without bundled types and @types/jsdom is not installed.
declare module 'jsdom' {
  export class JSDOM {
    constructor(html?: string, options?: Record<string, any>);
    readonly window: any;
  }
}
