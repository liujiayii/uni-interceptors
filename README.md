# uni-interceptors 🛠️

> uniapp 拦截器工具箱

这个仓库提供了一套用于 uniapp 开发的通用拦截器，帮助解决平台兼容性问题和实现权限申请功能，让你的 uniapp 应用更加稳定和易维护。

## 🎯 适用场景

- 需要兼容低版本浏览器或手机系统
- 需要处理不同平台（微信小程序、抖音小程序等）的特殊问题
- 需要实现全局功能如路由守卫、数据存储优化等
- 希望简化常见业务逻辑的处理
- 需要处理 App、小程序权限申请问题

## 🚀 安装

```bash
pnpm install uni-interceptors
```

## 📖 使用方式

<details>
<summary>✅ 作为 Vue 插件使用</summary>

```javascript
import { prototypeInterceptor } from "uni-interceptors";
import { createApp } from "vue";

const app = createApp(App);

// 注册拦截器
app.use(prototypeInterceptor);
```

</details>

<details>
<summary>✅ 直接调用函数使用</summary>

```javascript
import { applyPrototypeInterceptor } from "uni-interceptors";

// 应用拦截器
applyPrototypeInterceptor();
```

</details>

## 🧰 拦截器列表

<details>
<summary>✅ Array.prototype.at 兼容拦截器</summary>

**名称：** prototypeInterceptor / applyPrototypeInterceptor

**功能：** 解决低版本手机不识别 array.at() 导致运行报错的问题。

**平台：** 全平台

</details>

<details>
<summary>✅ 抖音小程序剪贴板授权拦截器(uni.setClipboardData)</summary>

**名称：** SetClipboardDataAuthInterceptor / applySetClipboardDataAuthInterceptor

**功能：** 处理抖音小程序剪贴板授权问题，当用户拒绝授权时，引导用户去设置页面授权。

**平台：** 抖音小程序 (MP-TOUTIAO)

</details>

<details>
<summary>✅ 快手小程序 Storage 代理修复拦截器(uni.setStorage)</summary>

**名称：** KuaiShouSetStorageProxyFixInterceptor / applyKuaiShouSetStorageProxyFixInterceptor

**功能：** 解决快手小程序 setStorage 不支持 proxy 对象的问题。

**平台：** 快手小程序 (MP-KUAISHOU)

</details>

<details>
<summary>✅ 路由拦截器</summary>

**名称：** RouteInterceptor / applyRouteInterceptor

**功能：** 路由导航守卫，可用于登录状态验证和页面访问控制。

**平台：** 全平台

**配置参数：**

- `loginRoute`: string - 登录页面路径
- `needLoginPages`: string[] - 需要登录验证的页面路径列表
- `isLogged`: () => boolean - 判断用户是否已登录的函数

</details>

## ✨ 特性

- 🔄 **多平台兼容** - 解决不同平台的兼容性问题
- 🔧 **易于使用** - 支持 Vue 插件方式和直接调用两种使用方式
- 📦 **按需引入** - 可以只引入需要的拦截器，减少包体积
- 🛡️ **类型安全** - 完整的 TypeScript 类型支持
- 🎯 **功能聚焦** - 每个拦截器只解决特定问题，保持代码简洁

## ⚠️ 注意事项

- 拦截器应在应用初始化时尽早注册，以确保能正确拦截相应操作
- 使用路由拦截器时，注意避免循环重定向问题
- 在使用特定平台的拦截器时，请确保只在对应平台引入，避免不必要的代码体积增加

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 📄 许可证

MIT