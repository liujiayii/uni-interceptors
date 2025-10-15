# 拦截器

拦截器是 uni-toolkit 的核心功能，通过拦截 uni-app 的原生 API，自动处理权限申请、错误处理和平台兼容性问题。

## 目录

- [chooseImage](./chooseImage) - 图片选择增强，自动处理权限和兼容性
- [chooseLocation](./chooseLocation) - 位置选择增强，自动处理权限和错误
- [makePhoneCall](./makePhoneCall) - 拨打电话增强，提供参数校验和权限处理
- [route](./route) - 路由增强，支持路由白名单和参数处理
- [setClipboardData](./setClipboardData) - 剪贴板增强，提供兼容性处理
- [setStorage](./setStorage) - 存储增强，支持数据加密和过期时间

## 概述

uni-toolkit 提供了一系列实用的拦截器，用于增强 uni-app 的原生 API 功能。这些拦截器可以自动处理权限申请、平台兼容性、错误处理等常见问题，让开发者无需修改现有代码即可获得增强功能。

### 主要拦截器

| 拦截器             | 功能描述                     | 适用场景               |
| ------------------ | ---------------------------- | ---------------------- |
| `chooseImage`      | 自动处理图片选择权限         | 需要选择图片的场景     |
| `chooseLocation`   | 增强位置选择功能             | 需要获取用户位置的场景 |
| `makePhoneCall`    | 增强拨打电话功能             | 需要拨打电话的场景     |
| `route`            | 路由增强，支持白名单         | 需要路由守卫的场景     |
| `setClipboardData` | 剪贴板增强，提供兼容性处理   | 需要复制到剪贴板的场景 |
| `setStorage`       | 存储增强，支持加密和过期时间 | 需要安全存储的场景     |

### 使用方式

```typescript
import { chooseImageInterceptor } from "uni-toolkit/interceptors";

// 注册拦截器
uni.addInterceptor("chooseImage", chooseImageInterceptor);
```

### 按模块导入

使用 `import { xxx } from "uni-toolkit/interceptors"` 的方式可以只导入特定模块，减少包体积：

```javascript
// 按需导入拦截器
import { chooseImageInterceptor, routeInterceptor, setStorageInterceptor } from "uni-toolkit/interceptors";
```

每个拦截器都有详细的文档和使用示例，您可以通过上方的链接查看具体信息。
| H5 | ✅ | 支持拦截 |
| 微信小程序 | ✅ | 支持拦截 |
| 支付宝小程序 | ✅ | 支持拦截 |
| 百度小程序 | ✅ | 支持拦截 |
| 字节跳动小程序 | ✅ | 支持拦截 |
| QQ小程序 | ✅ | 支持拦截 |
| 快手小程序 | ✅ | 支持拦截 |
| 京东小程序 | ✅ | 支持拦截 |
| App | ✅ | 支持拦截 |

#### 使用示例

```javascript
// 直接使用 uni.makePhoneCall，拦截器会自动处理
uni.makePhoneCall({
  phoneNumber: "10086", // 需要拨打的电话号码
  success() {
    console.log("拨打电话成功");
  },
  fail(err) {
    console.log("拨打电话失败", err);
  },
  complete() {
    console.log("拨打电话操作完成");
  }
});
```

#### 增强功能

该拦截器拦截 uni.makePhoneCall API 调用，提供以下增强功能：

1. **参数校验**：对电话号码格式进行校验，确保传入有效的电话号码
2. **错误处理增强**：对平台特定的错误进行统一处理，提供更友好的错误提示
3. **权限处理**：在需要权限的平台上自动处理权限申请

### route 拦截器

#### 功能描述

拦截 uni.navigateTo、uni.redirectTo、uni.reLaunch、uni.switchTab 等路由 API 调用，提供增强功能

#### 平台支持

| 平台           | 支持情况 | 说明     |
| -------------- | -------- | -------- |
| H5             | ✅       | 支持拦截 |
| 微信小程序     | ✅       | 支持拦截 |
| 支付宝小程序   | ✅       | 支持拦截 |
| 百度小程序     | ✅       | 支持拦截 |
| 字节跳动小程序 | ✅       | 支持拦截 |
| QQ小程序       | ✅       | 支持拦截 |
| 快手小程序     | ✅       | 支持拦截 |
| 京东小程序     | ✅       | 支持拦截 |
| App            | ✅       | 支持拦截 |

#### 使用示例

```javascript
// 直接使用路由API，拦截器会自动处理
uni.navigateTo({
  url: "/pages/detail/detail?id=123",
  success() {
    console.log("导航成功");
  },
  fail(err) {
    console.log("导航失败", err);
  }
});
```

#### 增强功能

该拦截器拦截路由相关 API 调用，提供以下增强功能：

1. **路由白名单**：支持配置路由白名单，白名单内的路由不受拦截器影响
2. **参数处理**：对路由参数进行统一处理，确保参数格式正确
3. **错误处理增强**：对路由错误进行统一处理，提供更友好的错误提示

### setClipboardData 拦截器

#### 功能描述

拦截 uni.setClipboardData API 调用，提供增强功能

#### 平台支持

| 平台           | 支持情况 | 说明     |
| -------------- | -------- | -------- |
| H5             | ✅       | 支持拦截 |
| 微信小程序     | ✅       | 支持拦截 |
| 支付宝小程序   | ✅       | 支持拦截 |
| 百度小程序     | ✅       | 支持拦截 |
| 字节跳动小程序 | ✅       | 支持拦截 |
| QQ小程序       | ✅       | 支持拦截 |
| 快手小程序     | ✅       | 支持拦截 |
| 京东小程序     | ✅       | 支持拦截 |
| App            | ✅       | 支持拦截 |

#### 使用示例

```javascript
// 直接使用 uni.setClipboardData，拦截器会自动处理
uni.setClipboardData({
  data: "要复制的内容",
  success() {
    console.log("复制成功");
  },
  fail(err) {
    console.log("复制失败", err);
  }
});
```

#### 增强功能

该拦截器拦截 uni.setClipboardData API 调用，提供以下增强功能：

1. **兼容性处理**：处理不同平台的兼容性问题
2. **错误处理增强**：对复制错误进行统一处理，提供更友好的错误提示
3. **数据格式化**：对复制内容进行格式化，确保在不同平台上都能正常复制

### setStorage 拦截器

#### 功能描述

拦截 uni.setStorage 和 uni.setStorageSync API 调用，提供增强功能

#### 平台支持

| 平台           | 支持情况 | 说明     |
| -------------- | -------- | -------- |
| H5             | ✅       | 支持拦截 |
| 微信小程序     | ✅       | 支持拦截 |
| 支付宝小程序   | ✅       | 支持拦截 |
| 百度小程序     | ✅       | 支持拦截 |
| 字节跳动小程序 | ✅       | 支持拦截 |
| QQ小程序       | ✅       | 支持拦截 |
| 快手小程序     | ✅       | 支持拦截 |
| 京东小程序     | ✅       | 支持拦截 |
| App            | ✅       | 支持拦截 |

#### 使用示例

```javascript
// 直接使用 uni.setStorage，拦截器会自动处理
uni.setStorage({
  key: "userInfo",
  data: {
    name: "张三",
    age: 25
  },
  success() {
    console.log("存储成功");
  },
  fail(err) {
    console.log("存储失败", err);
  }
});
```

#### 增强功能

该拦截器拦截存储相关 API 调用，提供以下增强功能：

1. **数据加密**：支持对存储数据进行加密，提高数据安全性
2. **过期时间**：支持设置数据过期时间，自动清理过期数据
3. **数据压缩**：对大数据进行压缩，减少存储空间占用
4. **错误处理增强**：对存储错误进行统一处理，提供更友好的错误提示

## 安装和使用

### 安装

```bash
pnpm install uni-toolkit
```

### 使用

```javascript
// 导入需要的拦截器
import {
  chooseImageInterceptor,
  chooseLocationInterceptor,
  makePhoneCallInterceptor,
  routeInterceptor,
  setClipboardDataInterceptor,
  setStorageInterceptor
} from "uni-toolkit/interceptors";

// 在 main.js 或入口文件中
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

// 安装拦截器
app.use(chooseImageInterceptor);
app.use(chooseLocationInterceptor);
app.use(makePhoneCallInterceptor);
app.use(routeInterceptor);
app.use(setClipboardDataInterceptor);
app.use(setStorageInterceptor);

app.mount("#app");
```

## 注意事项

1. 拦截器应在应用初始化时尽早注册，以确保能正确拦截相应操作
2. 使用路由拦截器时，注意避免循环重定向问题
3. 在使用特定平台的拦截器时，请确保只在对应平台引入，避免不必要的代码体积增加
4. 权限相关的拦截器（如 chooseImageInterceptor）会在需要时自动申请权限，请确保在用户明确需要相关功能时才调用对应 API

每个拦截器都有详细的文档和使用示例，您可以通过上方的链接查看具体信息。
