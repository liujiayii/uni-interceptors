# shouldShowRequestPermissionRationale

`shouldShowRequestPermissionRationale` 是一个用于判断是否需要显示权限请求说明的工具函数，主要针对 Android 平台。

## 功能描述

该函数用于判断在请求权限前是否需要向用户显示权限请求说明。根据 Android 权限最佳实践，如果用户之前拒绝过某项权限，再次请求时应该先解释为什么需要该权限，然后再请求权限。

## 函数签名

```typescript
function shouldShowRequestPermissionRationale(authorize: AuthType): boolean;
```

### 参数

| 参数      | 类型     | 必填 | 说明                                   |
| --------- | -------- | ---- | -------------------------------------- |
| authorize | AuthType | 是   | 权限类型，来自 authTips 中定义的枚举值 |

### 返回值

返回一个布尔值：

- `true`: 应该显示权限请求说明
- `false`: 不需要显示权限请求说明

## 平台差异

| 平台                  | 返回值           | 说明                                                       |
| --------------------- | ---------------- | ---------------------------------------------------------- |
| 非 App 端 (H5/小程序) | `false`          | 这些平台不需要原生权限管理                                 |
| iOS App               | `false`          | iOS 平台不使用此机制                                       |
| Android App           | 根据系统状态返回 | 使用 Android 的 `shouldShowRequestPermissionRationale` API |

## 使用方法

```typescript
import { AuthType, shouldShowRequestPermissionRationale } from "uni-toolkit/tools";

// 检查是否需要显示相机权限说明
const shouldShowCameraRationale = shouldShowRequestPermissionRationale(AuthType.CAMERA);

if (shouldShowCameraRationale) {
  // 显示权限说明
  uni.showModal({
    title: "需要相机权限",
    content: "应用需要使用相机来扫描二维码，请允许相机权限",
    confirmText: "我知道了",
    success: () => {
      // 然后再请求权限
      this.requestCameraPermission();
    }
  });
} else {
  // 直接请求权限
  this.requestCameraPermission();
}
```

## 实际应用场景

### 1. 权限请求流程优化

```typescript
import { AuthType, checkSelfPermission, shouldShowRequestPermissionRationale } from "uni-toolkit/tools";

export default {
  methods: {
    async requestCameraPermissionWithRationale() {
      // 检查是否已有权限
      if (checkSelfPermission(AuthType.CAMERA)) {
        // 已有权限，直接执行操作
        this.openCamera();
        return;
      }

      // 检查是否需要显示权限说明
      if (shouldShowRequestPermissionRationale(AuthType.CAMERA)) {
        // 显示权限说明
        const confirmed = await this.showPermissionRationale(
          "需要相机权限",
          "应用需要使用相机来扫描二维码和拍摄照片，请在接下来的弹窗中允许相机权限"
        );

        if (!confirmed) {
          return; // 用户取消
        }
      }

      // 请求权限
      this.requestCameraPermission();
    },

    showPermissionRationale(title, content) {
      return new Promise((resolve) => {
        uni.showModal({
          title,
          content,
          confirmText: "我知道了",
          cancelText: "取消",
          success: (res) => {
            resolve(res.confirm);
          }
        });
      });
    },

    requestCameraPermission() {
      // 实际请求相机权限的逻辑
      // ...
    },

    openCamera() {
      // 使用相机的逻辑
      // ...
    }
  }
};
```

### 2. 多权限请求处理

```typescript
import { AuthType, shouldShowRequestPermissionRationale } from "uni-toolkit/tools";

export default {
  methods: {
    async requestMultiplePermissions() {
      const permissions = [
        { type: AuthType.CAMERA, name: "相机", reason: "用于扫描二维码和拍摄照片" },
        { type: AuthType.LOCATION, name: "位置", reason: "用于获取当前位置提供附近服务" }
      ];

      // 检查哪些权限需要显示说明
      const permissionsNeedingRationale = permissions.filter(
        (perm) => shouldShowRequestPermissionRationale(perm.type)
      );

      if (permissionsNeedingRationale.length > 0) {
        // 构建权限说明内容
        const rationaleContent = permissionsNeedingRationale
          .map((perm) => `${perm.name}：${perm.reason}`)
          .join("\n");

        // 显示权限说明
        const confirmed = await this.showPermissionRationale(
          "需要以下权限",
          rationaleContent
        );

        if (!confirmed) {
          return; // 用户取消
        }
      }

      // 请求所有权限
      this.requestPermissions(permissions.map((p) => p.type));
    },

    requestPermissions(permissionTypes) {
      // 实际请求权限的逻辑
      // ...
    }
  }
};
```

### 3. 权限请求状态跟踪

```typescript
import { AuthType, checkSelfPermission, shouldShowRequestPermissionRationale } from "uni-toolkit/tools";

export default {
  data() {
    return {
      permissionStates: {
        [AuthType.CAMERA]: {
          granted: false,
          rationaleShown: false,
          deniedPermanently: false
        },
        [AuthType.LOCATION]: {
          granted: false,
          rationaleShown: false,
          deniedPermanently: false
        }
      }
    };
  },

  methods: {
    async checkAndUpdatePermissionState(authType) {
      // 检查权限状态
      const granted = checkSelfPermission(authType);
      this.permissionStates[authType].granted = granted;

      if (!granted) {
        // 检查是否需要显示说明
        const shouldShowRationale = shouldShowRequestPermissionRationale(authType);

        // 如果不需要显示说明，说明用户可能已经永久拒绝了权限
        if (!shouldShowRationale) {
          this.permissionStates[authType].deniedPermanently = true;
        }
      }
    },

    async handlePermissionRequest(authType) {
      // 更新权限状态
      await this.checkAndUpdatePermissionState(authType);

      const state = this.permissionStates[authType];

      if (state.granted) {
        // 已有权限，直接执行操作
        this.executePermissionRequiredAction(authType);
        return;
      }

      if (state.deniedPermanently) {
        // 用户已永久拒绝权限，引导到设置
        this.showGoToSettingDialog(authType);
        return;
      }

      if (!state.rationaleShown && shouldShowRequestPermissionRationale(authType)) {
        // 显示权限说明
        this.showPermissionRationale(authType);
        this.permissionStates[authType].rationaleShown = true;
        return;
      }

      // 请求权限
      this.requestPermission(authType);
    },

    showGoToSettingDialog(authType) {
      const permissionNames = {
        [AuthType.CAMERA]: "相机",
        [AuthType.LOCATION]: "位置",
        [AuthType.PHOTO]: "相册"
      };

      uni.showModal({
        title: "权限被拒绝",
        content: `您已拒绝${permissionNames[authType]}权限，请在设置中手动开启`,
        confirmText: "去设置",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            uni.openAppAuthorizeSetting();
          }
        }
      });
    }
  }
};
```

## 注意事项

1. **平台限制**: 此函数仅在 Android App 平台上有实际意义，其他平台始终返回 `false`
2. **权限状态变化**: 权限状态可能会在应用运行期间发生变化，建议在请求权限前再次检查
3. **用户体验**: 合理使用权限说明可以提高用户授权意愿，但过度使用可能导致用户反感
4. **权限说明内容**: 说明内容应该简洁明了，清楚解释为什么需要该权限

## 最佳实践

1. **按需请求**: 只在真正需要权限时才请求，不要在应用启动时就请求所有权限
2. **解释原因**: 向用户清楚地解释为什么需要该权限，以及权限将如何使用
3. **优雅降级**: 提供权限被拒绝时的替代方案，而不是强制要求权限
4. **状态跟踪**: 跟踪权限请求状态，避免重复显示权限说明

```typescript
// 最佳实践示例
async function requestPermissionWithBestPractice(authType) {
  // 1. 检查是否已有权限
  if (checkSelfPermission(authType)) {
    return true;
  }

  // 2. 检查是否需要显示说明
  if (shouldShowRequestPermissionRationale(authType)) {
    // 3. 显示权限说明，解释为什么需要权限
    const rationale = getPermissionRationale(authType);
    const userConfirmed = await showRationaleDialog(rationale);

    if (!userConfirmed) {
      return false; // 用户取消
    }
  }

  // 4. 请求权限
  const granted = await requestPermission(authType);

  // 5. 处理权限请求结果
  if (!granted) {
    // 提供替代方案或引导用户到设置
    handlePermissionDenied(authType);
  }

  return granted;
}

function getPermissionRationale(authType) {
  const rationales = {
    [AuthType.CAMERA]: {
      title: "需要相机权限",
      content: "应用需要使用相机来扫描二维码和拍摄照片，以便完成相关功能"
    },
    [AuthType.LOCATION]: {
      title: "需要位置权限",
      content: "应用需要获取您的位置信息，以便提供附近的商店和服务推荐"
    }
  };

  return rationales[authType] || {
    title: "需要权限",
    content: "应用需要此权限以提供完整功能"
  };
}
```
