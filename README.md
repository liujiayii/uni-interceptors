# uni-interceptors

uniapp 拦截器工具箱

## 安装

```bash
pnpm install uni-interceptors
```

## 使用

### 作为 Vue 插件使用

```javascript
import { prototypeInterceptor } from "uni-interceptors";
import { createApp } from "vue";

const app = createApp(App);

// 注册拦截器
app.use(prototypeInterceptor);
```

### 直接调用函数使用

```javascript
import { applyPrototypeInterceptor } from "uni-interceptors";

// 应用拦截器
applyPrototypeInterceptor();
```

## 拦截器列表

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
