# chooseImage 拦截器

`chooseImage` 拦截器用于处理图片选择前的权限检查和授权流程，确保用户在使用相机或相册功能前已获得相应权限。

## 功能描述

该拦截器会自动检查用户是否已授予相机或相册权限，并在未授权时引导用户完成授权流程。支持以下场景：

- 仅需要相机权限
- 仅需要相册权限
- 同时需要相机和相册权限

## 平台支持

| 平台     | 支持情况 | 备注                       |
| -------- | -------- | -------------------------- |
| APP-PLUS | ✅ 支持  | 需要相机和相册权限         |
| MP       | ✅ 支持  | 小程序环境下的图片选择权限 |
| H5       | ✅ 支持  | 浏览器环境下的文件选择     |

## 使用方法

```typescript
import { chooseImageInterceptor } from "@uni-toolkit/interceptors";

// 在应用入口处安装拦截器
app.use(chooseImageInterceptor);

// 正常调用uni.chooseImage，拦截器会自动处理权限
uni.chooseImage({
  count: 1,
  sourceType: ["album", "camera"],
  success: (res) => {
    console.log("选择成功", res.tempFilePaths);
  },
  fail: (err) => {
    console.error("选择失败", err);
  }
});
```

## 权限处理流程

1. **权限检查**：根据 `sourceType` 参数判断需要检查的权限类型
2. **权限请求**：调用 `showAuthTip` 或 `checkAndRequestImageAuth` 请求权限
3. **结果处理**：
   - 授权成功：继续执行原始 API 调用
   - 授权失败：调用 `fail` 和 `complete` 回调，并返回错误信息

## 特殊处理

- **APP端**：根据 `sourceType` 分别处理相机和相册权限
- **小程序端**：使用 `checkAndRequestImageAuth` 统一处理
- **H5端**：通常由浏览器处理文件选择权限，保持与其他平台一致的 Promise 返回

## 注意事项

- 拦截器会确保调用链完整，即使在权限被拒绝时也会调用 `fail` 和 `complete` 回调
- 错误信息包含 `authDenied: true` 标志，便于区分权限拒绝和其他错误
- 同时支持 `chooseImage` 和 `chooseMedia` API 的拦截
