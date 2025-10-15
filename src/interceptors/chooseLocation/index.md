# chooseLocation 拦截器

`chooseLocation` 拦截器用于处理位置选择前的权限检查和授权流程，确保用户在使用位置相关功能前已获得相应权限。

## 功能描述

该拦截器会自动检查用户是否已授予位置权限，并在未授权时引导用户完成授权流程。支持以下功能：

- 自动检查位置权限状态
- 引导用户完成位置权限授权
- 处理权限被拒绝的情况
- 提供手动授权引导

## 平台支持

| 平台     | 支持情况 | 备注                   |
| -------- | -------- | ---------------------- |
| APP-PLUS | ✅ 支持  | 需要位置权限           |
| MP       | ✅ 支持  | 小程序环境下的位置权限 |
| H5       | ✅ 支持  | 浏览器环境下的位置权限 |

## 使用方法

```typescript
import { chooseLocationInterceptor } from "@uni-toolkit/interceptors";

// 在应用入口处安装拦截器
app.use(chooseLocationInterceptor);

// 正常调用uni.chooseLocation，拦截器会自动处理权限
uni.chooseLocation({
  success: (res) => {
    console.log("选择位置成功", res);
  },
  fail: (err) => {
    console.error("选择位置失败", err);
  }
});
```

## 权限处理流程

1. **权限检查**：使用 `showAuthTip` 或 `checkAndRequestLocationAuth` 检查位置权限
2. **权限请求**：引导用户完成位置权限授权
3. **结果处理**：
   - 授权成功：继续执行原始 API 调用
   - 授权失败：调用 `fail` 和 `complete` 回调，并返回错误信息

## 特殊处理

### APP端

- 使用 `showAuthTip` 请求位置权限
- 在失败回调中检查权限状态，并根据 `shouldShowRequestPermissionRationale` 决定是否显示手动授权引导

### 小程序端

- 使用 `checkAndRequestLocationAuth` 统一处理位置权限
- 遵循小程序平台的权限申请流程

### H5端

- 通常由浏览器处理位置权限
- 保持与其他平台一致的 Promise 返回

## 注意事项

- 拦截器会确保调用链完整，即使在权限被拒绝时也会调用 `fail` 和 `complete` 回调
- 错误信息包含 `authDenied: true` 标志，便于区分权限拒绝和其他错误
- 同时支持 `chooseLocation` 和 `getLocation` API 的拦截
- APP端在权限被拒绝时会尝试显示手动授权引导
