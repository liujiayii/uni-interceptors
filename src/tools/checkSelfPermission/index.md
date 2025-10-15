# checkSelfPermission

`checkSelfPermission` 是一个权限检查工具函数，用于检查应用是否已被授予指定权限。

## 功能描述

该函数用于检查应用是否已被授予指定权限，支持不同平台的权限检查逻辑：

- **非APP端**：直接返回 `true`，视为无需本地权限
- **iOS端**：直接返回 `true`，iOS权限处理方式不同
- **Android端**：使用 Android API 检查权限状态

## 函数签名

```typescript
function checkSelfPermission(authorize: AuthType): boolean;
```

### 参数

| 参数      | 类型     | 必填 | 说明             |
| --------- | -------- | ---- | ---------------- |
| authorize | AuthType | 是   | 要检查的权限类型 |

### 返回值

- `true`: 已授权或无需权限
- `false`: 未授权

## 使用方法

```typescript
import { AuthType, checkSelfPermission } from "@uni-toolkit/tools";

// 检查相机权限
const hasCameraPermission = checkSelfPermission(AuthType.CAMERA);
if (hasCameraPermission) {
  console.log("已获得相机权限");
} else {
  console.log("未获得相机权限");
}

// 检查位置权限
const hasLocationPermission = checkSelfPermission(AuthType.LOCATION);
if (hasLocationPermission) {
  // 可以使用位置相关功能
} else {
  // 需要请求位置权限
}

// 在条件判断中使用
if (checkSelfPermission(AuthType.PHOTO)) {
  // 已有相册权限，可以直接使用
  uni.chooseImage({
    count: 1,
    sourceType: ["album"],
    success: (res) => {
      console.log("选择成功", res.tempFilePaths);
    }
  });
} else {
  // 需要先请求权限
  showAuthTip(AuthType.PHOTO).then((granted) => {
    if (granted) {
      // 用户同意权限，再次尝试选择图片
    }
  });
}
```

## 平台差异

### APP-PLUS (Android)

使用 Android API `ContextCompat.checkSelfPermission` 检查权限状态，返回值为：

- `0`: 已授权 (PackageManager.PERMISSION_GRANTED)
- 其他值: 未授权

### APP-PLUS (iOS)

iOS 端直接返回 `true`，因为 iOS 权限处理方式与 Android 不同，通常在调用 API 时才会触发权限请求。

### 小程序和H5

非 APP 环境下直接返回 `true`，因为这些平台的权限由系统或浏览器管理，应用无法直接检查权限状态。

## 注意事项

- 该函数主要用于 Android 平台的权限检查
- 在 iOS 平台上，权限检查通常在调用相关 API 时进行
- 在小程序和 H5 平台上，权限由系统或浏览器管理
- 检查结果会在控制台输出，便于调试
- 该函数通常与 `showAuthTip` 等权限请求函数配合使用
