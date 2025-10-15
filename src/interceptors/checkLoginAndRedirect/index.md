# checkLoginAndRedirect 拦截器

`checkLoginAndRedirect` 是route拦截器中提供的一个工具函数，用于检查用户登录状态并在未登录时跳转到登录页面。

## 功能描述

该函数主要用于手动检查用户登录状态，当用户未登录时，自动跳转到登录页面，并支持登录后重定向到原页面。支持以下功能：

- 检查当前登录状态
- 未登录时自动跳转到登录页面
- 支持重定向到原页面
- 返回检查结果

## 平台支持

| 平台     | 支持情况 | 备注                   |
| -------- | -------- | ---------------------- |
| APP-PLUS | ✅ 支持  | 全平台支持             |
| MP       | ✅ 支持  | 小程序环境下的路由跳转 |
| H5       | ✅ 支持  | 浏览器环境下的路由跳转 |

## 使用方法

```typescript
import { checkLoginAndRedirect, routeInterceptor } from "@uni-toolkit/interceptors";

// 首先安装route拦截器
app.use(routeInterceptor, {
  loginRoute: "/pages/login/login",
  needLoginPages: ["/pages/user/profile"],
  isLogged: () => !!uni.getStorageSync("token")
});

// 在需要手动检查登录的地方使用
const isLoggedIn = checkLoginAndRedirect("/pages/user/profile");
if (!isLoggedIn) {
  console.log("用户未登录，已跳转到登录页");
}
```

## 函数签名

```typescript
function checkLoginAndRedirect(redirect: string = ""): boolean;
```

### 参数

| 参数     | 类型   | 必填 | 默认值 | 说明                                 |
| -------- | ------ | ---- | ------ | ------------------------------------ |
| redirect | string | 否   | ""     | 重定向地址，登录成功后会跳转到此页面 |

### 返回值

- `true`: 已登录
- `false`: 未登录，已跳转到登录页

## 工作原理

1. 调用 `isLogged` 函数检查当前登录状态
2. 如果已登录，直接返回 `true`
3. 如果未登录，调用 `goLogin` 函数跳转到登录页面
4. 在登录页面URL中添加 `redirect` 参数，用于登录后重定向

## 注意事项

- 使用该函数前必须先安装 `routeInterceptor` 并配置相关参数
- 重定向地址会自动编码，确保URL参数正确传递
- 登录页面需要自行处理 `redirect` 参数，在登录成功后跳转到指定页面
- 如果不提供 `redirect` 参数，登录后不会自动跳转，需要自行处理
