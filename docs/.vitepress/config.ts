import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "uni-toolkit",
  description: "uni tools,uni app 工具库",
  base: "/uni-toolkit/",

  // 暂时禁用死链检查
  ignoreDeadLinks: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "快速开始", link: "/guide/getting-started" },
      { text: "功能", link: "/guide/overview" },
    ],

    sidebar: [
      {
        text: "指南",
        items: [
          { text: "快速开始", link: "/guide/getting-started" },
          { text: "使用指南", link: "/guide/usage" },
        ],
      },
      {
        text: "功能模块",
        items: [
          { text: "核心功能概览", link: "/guide/overview" },
          { text: "拦截器", link: "/guide/interceptors" },
          { text: "Hooks", link: "/guide/hooks" },
          { text: "工具函数", link: "/guide/tools" },
          { text: "环境检测", link: "/guide/env" },
        ],
      },
      {
        text: "开发",
        items: [
          { text: "贡献指南", link: "/guide/contributing" },
          { text: "开发指南", link: "/guide/develop" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/liujiayii/uni-toolkit" },
    ],

    footer: {
      message: "基于 MIT 许可发布",
      copyright: `版权所有 © 2024-${new Date().getFullYear()} liujiayii`,
    },
  },
});
