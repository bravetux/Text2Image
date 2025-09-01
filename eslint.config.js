import globals from "globals";
import tseslint from "typescript-eslint";
import js from "@eslint/js";
import hooksPlugin from "eslint-plugin-react-hooks";
import refreshPlugin from "eslint-plugin-react-refresh";

export default [
  // Global ignores for directories not part of the React app
  {
    ignores: ["dist/", "node_modules/", "supabase/"],
  },
  
  // Base JS config
  js.configs.recommended,
  
  // TypeScript configs
  ...tseslint.configs.recommended,

  // Config for React files in `src`
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-hooks": hooksPlugin,
      "react-refresh": refreshPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];