const nextConfig = require("@next/eslint-plugin-next");
const securityPlugin = require("eslint-plugin-security");
const noUnsanitizedPlugin = require("eslint-plugin-no-unsanitized");

module.exports = [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/.git/**",
      "**/public/**",
    ],
    files: ["./src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextConfig,
      security: securityPlugin,
      "no-unsanitized": noUnsanitizedPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      parser: require.resolve("@typescript-eslint/parser"),
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Security rules with error level
      "security/detect-object-injection": "error",
      "security/detect-non-literal-require": "error",
      "security/detect-possible-timing-attacks": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-no-csrf-before-method-override": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-unsafe-regex": "error",
      "security/detect-new-buffer": "error",
      "security/detect-dangerous-regex": "error",

      // DOM sanitization
      "no-unsanitized/method": "error",
      "no-unsanitized/property": "error",

      // General security best practices
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
    },
  },
];
