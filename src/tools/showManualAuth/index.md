# showManualAuth

`showManualAuth` 是一个用于引导用户手动开启权限的工具函数，适用于权限被拒绝后需要用户手动设置的场景。

## 功能描述

当用户拒绝权限请求后，此函数会显示一个模态框，提示用户手动开启权限，并提供跳转到系统设置的选项。它首先检查权限状态，如果已有权限则直接返回，否则显示引导提示。

## 函数签名

```typescript
function showManualAuth(authorize: AuthType): Promise<boolean>;
```

### 参数

| 参数      | 类型     | 必填 | 说明                                   |
| --------- | -------- | ---- | -------------------------------------- |
| authorize | AuthType | 是   | 权限类型，来自 authTips 中定义的枚举值 |

### 返回值

返回一个 `Promise<boolean>：`

- `true`: 用户确认前往设置或已有权限
- `false`: 用户取消或显示模态框失败

## 使用方法

```typescript
import { AuthType, showManualAuth } from "uni-toolkit/tools";

// 引导用户手动开启相机权限
showManualAuth(AuthType.CAMERA).then((confirmed) => {
  if (confirmed) {
    console.log("用户确认前往设置或已有权限");
  } else {
    console.log("用户取消手动授权");
  }
});
```

## 实际应用场景

### 1. 权限被拒绝后的处理

```typescript
import { AuthType, checkSelfPermission, showManualAuth } from "uni-toolkit/tools";

export default {
  methods: {
    async handleCameraPermission() {
      // 首先检查权限状态
      if (checkSelfPermission(AuthType.CAMERA)) {
        // 已有权限，直接执行操作
        this.openCamera();
        return;
      }

      // 请求权限
      const granted = await this.requestCameraPermission();

      if (!granted) {
        // 权限被拒绝，引导用户手动开启
        const confirmed = await showManualAuth(AuthType.CAMERA);

        if (confirmed) {
          // 用户确认前往设置，可以监听应用前后台切换来检查权限状态
          this.setupPermissionCheckListener();
        } else {
          // 用户取消，显示提示信息
          uni.showToast({
            title: "需要相机权限才能使用此功能",
            icon: "none"
          });
        }
      }
    },

    requestCameraPermission() {
      return new Promise((resolve) => {
        // 实际请求相机权限的逻辑
        // ...
      });
    },

    openCamera() {
      // 使用相机的逻辑
      // ...
    },

    setupPermissionCheckListener() {
      // 监听应用前后台切换，检查权限状态
      uni.onAppShow(() => {
        if (checkSelfPermission(AuthType.CAMERA)) {
          // 用户已在设置中开启权限
          this.openCamera();
        }
      });
    }
  }
};
```

### 2. 多权限管理

```typescript
import { AuthType, checkSelfPermission, showManualAuth } from "uni-toolkit/tools";

export default {
  data() {
    return {
      requiredPermissions: [
        { type: AuthType.CAMERA, name: "相机" },
        { type: AuthType.LOCATION, name: "位置" }
      ]
    };
  },

  methods: {
    async checkAndRequestPermissions() {
      // 检查所有必需权限
      const missingPermissions = this.requiredPermissions.filter(
        (perm) => !checkSelfPermission(perm.type)
      );

      if (missingPermissions.length === 0) {
        // 所有权限都已获取
        this.executeAllPermissionRequiredActions();
        return;
      }

      // 请求缺失的权限
      const grantedPermissions = await this.requestPermissions(
        missingPermissions.map((p) => p.type)
      );

      if (grantedPermissions.length < missingPermissions.length) {
        // 有权限被拒绝，找出被拒绝的权限
        const deniedPermissions = missingPermissions.filter(
          (perm) => !grantedPermissions.includes(perm.type)
        );

        // 引导用户手动开启被拒绝的权限
        await this.handleDeniedPermissions(deniedPermissions);
      } else {
        // 所有权限都已获取
        this.executeAllPermissionRequiredActions();
      }
    },

    async handleDeniedPermissions(deniedPermissions) {
      if (deniedPermissions.length === 1) {
        // 单个权限被拒绝，直接引导用户手动开启
        const confirmed = await showManualAuth(deniedPermissions[0].type);

        if (confirmed) {
          this.setupPermissionCheckListener();
        }
      } else {
        // 多个权限被拒绝，显示自定义对话框
        const permissionNames = deniedPermissions.map((p) => p.name).join("、");
        const confirmed = await this.showCustomPermissionDialog(permissionNames);

        if (confirmed) {
          // 引导用户手动开启第一个被拒绝的权限
          await showManualAuth(deniedPermissions[0].type);
          this.setupPermissionCheckListener();
        }
      }
    },

    showCustomPermissionDialog(permissionNames) {
      return new Promise((resolve) => {
        uni.showModal({
          title: "需要权限",
          content: `需要${permissionNames}权限才能使用完整功能，请在设置中手动开启`,
          confirmText: "去设置",
          cancelText: "取消",
          success: (res) => {
            resolve(res.confirm);
          }
        });
      });
    },

    setupPermissionCheckListener() {
      // 监听应用前后台切换，检查权限状态
      uni.onAppShow(() => {
        this.checkAndRequestPermissions();
      });
    },

    executeAllPermissionRequiredActions() {
      // 执行需要权限的操作
      // ...
    }
  }
};
```

### 3. 权限状态持久化

```typescript
import { AuthType, checkSelfPermission, showManualAuth } from "uni-toolkit/tools";

export default {
  data() {
    return {
      permissionPrompts: {
        [AuthType.CAMERA]: false,
        [AuthType.LOCATION]: false,
        [AuthType.PHOTO]: false
      }
    };
  },

  created() {
    // 从本地存储加载权限提示状态
    this.loadPermissionPromptStates();
  },

  methods: {
    async handlePermissionWithPersistence(authType) {
      // 检查权限状态
      if (checkSelfPermission(authType)) {
        return true;
      }

      // 检查是否已提示过用户手动开启权限
      if (this.permissionPrompts[authType]) {
        // 已提示过，不再重复提示，直接返回失败
        return false;
      }

      // 显示手动授权引导
      const confirmed = await showManualAuth(authType);

      if (confirmed) {
        // 记录已提示过
        this.permissionPrompts[authType] = true;
        this.savePermissionPromptStates();

        // 设置权限检查监听器
        this.setupPermissionCheckListener(authType);
      }

      return confirmed;
    },

    setupPermissionCheckListener(authType) {
      const handleAppShow = () => {
        if (checkSelfPermission(authType)) {
          // 用户已在设置中开启权限
          uni.offAppShow(handleAppShow);
          this.onPermissionGranted(authType);
        }
      };

      uni.onAppShow(handleAppShow);
    },

    onPermissionGranted(authType) {
      // 权限已开启，执行相应操作
      switch (authType) {
        case AuthType.CAMERA:
          this.openCamera();
          break;
        case AuthType.LOCATION:
          this.getLocation();
          break;
        case AuthType.PHOTO:
          this.selectImage();
          break;
      }
    },

    loadPermissionPromptStates() {
      try {
        const saved = uni.getStorageSync("permissionPrompts");
        if (saved) {
          this.permissionPrompts = { ...this.permissionPrompts, ...saved };
        }
      } catch (error) {
        console.error("加载权限提示状态失败:", error);
      }
    },

    savePermissionPromptStates() {
      try {
        uni.setStorageSync("permissionPrompts", this.permissionPrompts);
      } catch (error) {
        console.error("保存权限提示状态失败:", error);
      }
    }
  }
};
```

## 注意事项

1. **权限检查**: 函数内部会先检查权限状态，如果已有权限则直接返回 true
2. **平台兼容性**: 使用 `uni.openAppAuthorizeSetting` API，确保在目标平台上可用
3. **用户体验**: 避免频繁调用，特别是在用户已明确拒绝的情况下
4. **状态监听**: 用户跳转到设置后，需要监听应用前后台切换来检查权限状态变化

## 最佳实践

1. **合理调用时机**: 只在权限被明确拒绝后才调用此函数
2. **状态持久化**: 记录用户是否已看过手动授权提示，避免重复打扰
3. **清晰说明**: 使用 authTips 中定义的提示文案，确保用户理解为什么需要权限
4. **优雅降级**: 提供权限被拒绝时的替代方案

```typescript
// 最佳实践示例
async function handlePermissionWithGracefulDegradation(authType) {
  // 1. 检查权限状态
  if (checkSelfPermission(authType)) {
    return executePermissionRequiredAction();
  }

  // 2. 尝试请求权限
  const granted = await requestPermission(authType);

  if (granted) {
    return executePermissionRequiredAction();
  }

  // 3. 检查是否已提示过手动授权
  if (hasShownManualAuthPrompt(authType)) {
    return provideFallbackExperience();
  }

  // 4. 显示手动授权引导
  const confirmed = await showManualAuth(authType);

  if (confirmed) {
    markManualAuthPromptShown(authType);
    setupPermissionChangeListener(authType);
    return waitForPermissionGrant();
  }

  // 5. 用户取消，提供降级体验
  return provideFallbackExperience();
}

function provideFallbackExperience() {
  // 提供不需要权限的替代方案
  switch (authType) {
    case AuthType.CAMERA:
      return showUploadOption();
    case AuthType.LOCATION:
      return showManualLocationInput();
    case AuthType.PHOTO:
      return showDefaultAvatars();
  }
}
```
