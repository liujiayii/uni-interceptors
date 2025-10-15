import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "uni-toolkit",
  description: "uni tools,uni app 工具库",
  base: "/uni-toolkit/",

  srcDir: "../",
  srcExclude: [
    "**/node_modules/**",
    "**/dist/**",
    "**/playground/**",
  ],
  cleanUrls: true,
  rewrites: {
    "docs/:page": ":page",
    "docs/guide/:page": "guide/:page",
    "src/:folder/index.md": ":folder/index.md",
    "src/:folder/:page/index.md": ":folder/:page/index.md",
  },

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
          {
            text: "拦截器",
            items: [
              { text: "拦截器概览", link: "/interceptors/index" },
              { text: "chooseImage", link: "/interceptors/chooseImage/index" },
              { text: "chooseLocation", link: "/interceptors/chooseLocation/index" },
              { text: "makePhoneCall", link: "/interceptors/makePhoneCall/index" },
              { text: "route", link: "/interceptors/route/index" },
              { text: "setClipboardData", link: "/interceptors/setClipboardData/index" },
              { text: "setStorage", link: "/interceptors/setStorage/index" },
            ],
          },
          {
            text: "Hooks",
            items: [
              { text: "Hooks 概览", link: "/hooks/index" },
              { text: "useChooseImage", link: "/hooks/useChooseImage/index" },
              { text: "useOnShow", link: "/hooks/useOnShow/index" },
              { text: "useDesignSize", link: "/hooks/useDesignSize/index" },
            ],
          },
          {
            text: "工具函数",
            items: [
              { text: "工具函数概览", link: "/tools/index" },
              { text: "authTips", link: "/tools/authTips/index" },
              { text: "checkSelfPermission", link: "/tools/checkSelfPermission/index" },
              { text: "cloneDeep", link: "/tools/cloneDeep/index" },
              { text: "getCurrentPageRoute", link: "/tools/getCurrentPageRoute/index" },
              { text: "isPageLevelComponent", link: "/tools/isPageLevelComponent/index" },
              { text: "permissionAuth", link: "/tools/permissionAuth/index" },
              { text: "shouldShowRequestPermissionRationale", link: "/tools/shouldShowRequestPermissionRationale/index" },
              { text: "showAuthTip", link: "/tools/showAuthTip/index" },
              { text: "showManualAuth", link: "/tools/showManualAuth/index" },
            ],
          },
          { text: "环境检测", link: "/env/index" },
        ],
      },
      {
        text: "开发",
        items: [
          { text: "贡献指南", link: "/guide/contributing" },
          { text: "开发指南", link: "/guide/develop" },
          { text: "部署指南", link: "/guide/deploy" },
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
