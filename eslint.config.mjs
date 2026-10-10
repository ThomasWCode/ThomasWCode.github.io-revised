const browserGlobals = {
  document: "readonly",
  fetch: "readonly",
  FormData: "readonly",
  window: "readonly",
};

const nodeGlobals = {
  AbortSignal: "readonly",
  Buffer: "readonly",
  console: "readonly",
  fetch: "readonly",
  process: "readonly",
  setTimeout: "readonly",
  URL: "readonly",
};

export default [
  {
    ignores: [
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      ".lighthouseci/**",
    ],
  },
  {
    files: ["JS/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: browserGlobals,
    },
    rules: {
      eqeqeq: "error",
      "no-redeclare": "error",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-unused-vars": [
        "error",
        { "argsIgnorePattern": "^_", "caughtErrors": "none" },
      ],
    },
  },
  {
    files: ["**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: nodeGlobals,
    },
    rules: {
      eqeqeq: "error",
      "no-redeclare": "error",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-unused-vars": [
        "error",
        { "argsIgnorePattern": "^_", "caughtErrors": "none" },
      ],
    },
  },
  {
    files: ["tests/e2e/**/*.mjs", "tests/visual/**/*.mjs"],
    languageOptions: {
      globals: {
        CustomEvent: "readonly",
        document: "readonly",
        Event: "readonly",
        getComputedStyle: "readonly",
        initialiseInfoToggles: "readonly",
        initialiseTrackAudio: "readonly",
        matchMedia: "readonly",
        Promise: "readonly",
        requestAnimationFrame: "readonly",
        window: "readonly",
      },
    },
  },
];
