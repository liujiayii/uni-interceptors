import antfu from "@antfu/eslint-config";

export default antfu(
  {
    globals: {
      uni: "readonly",
    },
    unocss: true,
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
    rules: {
      "node/prefer-global/process": "off",
    },
    ignores: ["dist", "*/*.html"],
  },
  {
    // markdown 中的 vue 代码块经 @eslint/markdown 提取后，
    // 会以「xxx.md/0_0.vue」这样的虚拟文件路径交给 vue 处理器，
    // unocss 规则会回溯加载原始 .md 文件触发 ERR_UNKNOWN_FILE_EXTENSION 崩溃。
    // 对 markdown 及其派生的虚拟 vue 路径关闭 unocss 相关规则
    files: ["**/*.md", "**/*.md/*.vue"],
    rules: {
      "unocss/order": "off",
      "unocss/order-attributify": "off",
    },
  },
);
