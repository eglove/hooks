import config from "@ethang/eslint-config/eslint.config.js";
import configReact from "@ethang/eslint-config/config.react.js";
import tseslint from "typescript-eslint";

export default tseslint.config(...config, ...configReact, {
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: "./tsconfig.json",
    },
  },
  rules: {
    complexity: "off",
    "max-depth": "off",
    "max-lines": "off",
    "max-lines-per-function": "off",
    "max-statements": "off",
    "no-magic-numbers": "off",
    "prefer-named-capture-group": "off",
    "require-unicode-regexp": "off",
    "sort-vars": "off",
  },
});
