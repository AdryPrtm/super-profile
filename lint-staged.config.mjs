const codeFiles = "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,astro,svelte}";

export default {
  [codeFiles]: () => "bun run check-types",
};
