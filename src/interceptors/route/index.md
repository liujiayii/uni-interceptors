# route 拦截器

`route` 拦截器用于处理路由导航和登录拦截，可以设置路由白名单或黑名单，控制页面访问权限。

## 功能描述

该拦截器主要用于实现登录拦截功能，当用户访问需要登录的页面时，会自动跳转到登录页面。支持以下功能：

- 设置需要登录的页面列表
- 自定义登录页面路径
- 自定义登录状态检查函数
- 支持重定向到原页面

## 平台支持

| 平台     | 支持情况 | 备注                   |
| -------- | -------- | ---------------------- |
| APP-PLUS | ✅ 支持  | 全平台支持             |
| MP       | ✅ 支持  | 小程序环境下的路由拦截 |
| H5       | ✅ 支持  | 浏览器环境下的路由拦截 |

## 使用方法

```typescript
import { routeInterceptor } from "uni-toolkit/interceptors";

// 在应用入口处安装拦截器
app.use(routeInterceptor, {
  loginRoute: "/pages/login/login", // 登录页面路径
  needLoginPages: [ // 需要登录的页面列表
    "/pages/user/profile",
    "/pages/order/list",
    "/pages/settings/index"
  ],
  isLogged: () => { // 判断是否已登录的函数
    return !!uni.getStorageSync("token");
  }
});
```

## 配置选项

### RouteInterceptorOptions

| 参数           | 类型          | 必填 | 默认值               | 说明                   |
| -------------- | ------------- | ---- | -------------------- | ---------------------- |
| loginRoute     | string        | 否   | "/pages/login/login" | 登录页面路径           |
| needLoginPages | string[]      | 否   | []                   | 需要登录的页面路径列表 |
| isLogged       | () => boolean | 否   | () => false          | 判断是否已登录的函数   |

## 工具函数

### checkLoginAndRedirect

手动检查登录状态并跳转到登录页的函数。

```typescript
import { checkLoginAndRedirect } from "uni-toolkit/interceptors";

// 检查登录状态，如果未登录则跳转到登录页
const isLoggedIn = checkLoginAndRedirect("/pages/user/profile");
if (!isLoggedIn) {
  console.log("用户未登录，已跳转到登录页");
}
```

#### 参数

| 参数     | 类型   | 必填 | 默认值 | 说明                                 |
| -------- | ------ | ---- | ------ | ------------------------------------ |
| redirect | string | 否   | ""     | 重定向地址，登录成功后会跳转到此页面 |

#### 返回值

- `true`: 已登录
- `false`: 未登录，已跳转到登录页

## 拦截的API

该拦截器会拦截以下路由API：

- `navigateTo`
- `reLaunch`
- `redirectTo`
- `switchTab`

## 注意事项

- 路由路径是以 '/' 开头的，如 '/pages/index/index'，与 pages.json 里面的 path 不同
- 登录页面自身不会被拦截
- 重定向地址会自动编码，确保URL参数正确传递
- 支持在登录页面获取 redirect 参数，登录成功后跳转到原页面
