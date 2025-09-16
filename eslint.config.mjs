import antfu from "@antfu/eslint-config";

export default antfu({
  globals: {
    uni: "readonly",
  },
  type: "lib",
  stylistic: {
    semi: true,
    indent: 2,
    quotes: "double",
    overrides: {
      "style/arrow-parens": ["error", "always"],
      "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "ts/consistent-type-definitions": ["error", "type"],
      "no-console": ["off"],
    },
  },
  formatters: true,
  rules: {},
  ignores: ["dist"],
});
