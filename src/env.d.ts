/// <reference path="../.astro/types.d.ts" />
interface ImportMetaEnv {
  readonly PUBLIC_API_URL?: string;
  readonly PORTFOLIO_API?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
