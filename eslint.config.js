import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import refreshPlugin from "eslint-plugin-react-refresh";
import js from "@eslint/js";

// This is the configuration for the React application source code
const reactAppConfig = {
  files: ["src/**/*.{ts,tsx}"],
  plugins: {
    react: pluginReact,
    "react-hooks": hooksPlugin,
    "react-refresh": refreshPlugin,
  },
  languageOptions: {
    globals: {
      ...globals.browser,
    },
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: { jsx: true },
      project: "./tsconfig.json",
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    ...js.configs.recommended.rules,
    ...tseslint.configs.recommended.rules,
    ...pluginReact.configs.recommended.rules,
    "react/react-in-jsx-scope": "off",
    ...hooksPlugin.configs.recommended.rules,
    "react-refresh/only-export-components": "warn",
  },
};

export default [
  {
    // Global ignores for all configurations
    ignores: [
      "dist",
      "node_modules",
      "supabase",
      "android",
      "ios",
      ".capacitor",
      "*.config.js",
      "*.config.ts",
      "components.json",
    ],
  },
  // Apply the detailed React app configuration
  reactAppConfig,
];