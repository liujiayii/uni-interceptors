# permissionAuth

`permissionAuth` 是一个用于处理小程序权限检查和请求的工具模块，提供了跨平台的权限管理功能。

## 功能描述

该模块封装了小程序平台的权限检查和请求逻辑，支持位置、相机和相册权限的管理。它能够检查当前权限状态，并在需要时引导用户开启权限。

## 支持的权限类型

| 权限类型 | 说明     | 微信小程序         | 支付宝小程序 |
| -------- | -------- | ------------------ | ------------ |
| location | 位置权限 | scope.userLocation | location     |
| camera   | 相机权限 | scope.camera       | camera       |
| album    | 相册权限 | scope.album (可选) | album        |

## API 参考

### checkPermissions(permissionTypes)

检查小程序权限状态（不触发权限请求）。

**参数:**

- `permissionTypes: string[]` - 权限类型数组

**返回值:**

- `Promise<{[key: string]: boolean}>` - 返回各权限的授权状态对象

**示例:**

```typescript
import { checkPermissions } from "uni-toolkit/tools";

// 检查位置和相机权限
checkPermissions(["location", "camera"]).then((results) => {
  console.log("位置权限:", results.location); // true 或 false
  console.log("相机权限:", results.camera); // true 或 false
});
```

### requestPermissions(permissionTypes)

请求小程序权限。

**参数:**

- `permissionTypes: string[]` - 权限类型数组

**返回值:**

- `Promise<boolean>` - 是否获得所有请求的权限

**示例:**

```typescript
import { requestPermissions } from "uni-toolkit/tools";

// 请求位置和相机权限
requestPermissions(["location", "camera"]).then((granted) => {
  if (granted) {
    console.log("所有权限已获取");
    // 执行需要这些权限的操作
  } else {
    console.log("权限获取失败");
    // 处理权限被拒绝的情况
  }
});
```

### checkAndRequestLocationAuth()

检查并请求小程序位置权限的便捷方法。

**返回值:**

- `Promise<boolean>` - 是否获得位置权限

**示例:**

```typescript
import { checkAndRequestLocationAuth } from "uni-toolkit/tools";

// 获取用户位置
checkAndRequestLocationAuth().then((granted) => {
  if (granted) {
    uni.getLocation({
      success: (res) => {
        console.log("当前位置:", res.latitude, res.longitude);
      }
    });
  } else {
    uni.showToast({
      title: "位置权限获取失败",
      icon: "none"
    });
  }
});
```

### checkAndRequestImageAuth(sourceType?)

检查并请求小程序图片选择权限的便捷方法。

**参数:**

- `sourceType?: string[]` - 图片来源类型数组，可选值: 'album'(相册), 'camera'(相机)，默认为 ['album', 'camera']

**返回值:**

- `Promise<boolean>` - 是否获得图片选择权限

**示例:**

```typescript
import { checkAndRequestImageAuth } from "uni-toolkit/tools";

// 请求相册和相机权限（默认）
checkAndRequestImageAuth().then((granted) => {
  if (granted) {
    // 选择图片
    uni.chooseImage({
      count: 1,
      success: (res) => {
        console.log("选择的图片:", res.tempFilePaths);
      }
    });
  }
});

// 只请求相机权限
checkAndRequestImageAuth(["camera"]).then((granted) => {
  if (granted) {
    // 拍照
    uni.chooseImage({
      count: 1,
      sourceType: ["camera"],
      success: (res) => {
        console.log("拍照结果:", res.tempFilePaths);
      }
    });
  }
});
```

## 实际应用场景

### 1. 扫码功能

### 2. 用户位置获取

```typescript
import { checkAndRequestLocationAuth } from "uni-toolkit/tools";

export default {
  data() {
    return {
      userLocation: null
    };
  },

  methods: {
    async getUserLocation() {
      uni.showLoading({ title: "获取位置中..." });

      try {
        // 请求位置权限
        const hasPermission = await checkAndRequestLocationAuth();
        if (!hasPermission) {
          uni.hideLoading();
          uni.showToast({
            title: "需要位置权限才能获取当前位置",
            icon: "none"
          });
          return;
        }

        // 获取位置
        const location = await this.getCurrentLocation();
        this.userLocation = location;

        uni.hideLoading();
        uni.showToast({
          title: "位置获取成功",
          icon: "success"
        });
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: "位置获取失败",
          icon: "none"
        });
        console.error("获取位置失败:", error);
      }
    },

    getCurrentLocation() {
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: "gcj02",
          success: resolve,
          fail: reject
        });
      });
    }
  }
};
```

### 3. 图片上传功能

```typescript
import { checkAndRequestImageAuth } from "uni-toolkit/tools";

export default {
  methods: {
    async selectAndUploadImage() {
      // 请求图片选择权限
      const hasPermission = await checkAndRequestImageAuth(["album", "camera"]);
      if (!hasPermission) {
        uni.showToast({
          title: "需要相册或相机权限才能选择图片",
          icon: "none"
        });
        return;
      }

      // 显示选择方式
      uni.showActionSheet({
        itemList: ["从相册选择", "拍照"],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.chooseFromAlbum();
          } else if (res.tapIndex === 1) {
            this.takePhoto();
          }
        }
      });
    },

    chooseFromAlbum() {
      uni.chooseImage({
        count: 1,
        sourceType: ["album"],
        success: (res) => {
          this.uploadImage(res.tempFilePaths[0]);
        }
      });
    },

    takePhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ["camera"],
        success: (res) => {
          this.uploadImage(res.tempFilePaths[0]);
        }
      });
    },

    uploadImage(filePath) {
      uni.showLoading({ title: "上传中..." });

      uni.uploadFile({
        url: "https://example.com/upload",
        filePath,
        name: "file",
        success: (res) => {
          uni.hideLoading();
          const data = JSON.parse(res.data);
          this.imageId = data.id;
          uni.showToast({
            title: "上传成功",
            icon: "success"
          });
        },
        fail: (err) => {
          uni.hideLoading();
          uni.showToast({
            title: "上传失败",
            icon: "none"
          });
          console.error("上传失败:", err);
        }
      });
    }
  }
};
```

## 平台差异处理

### 微信小程序

- 相册权限在某些情况下不需要（选择图片时）
- 权限键以 "scope." 开头

### 支付宝小程序

- 权限键不包含 "scope." 前缀
- 所有权限都需要明确请求

## 注意事项

1. **权限状态缓存**: 小程序平台会缓存权限状态，即使用户在系统设置中修改了权限，也需要在应用中重新检查
2. **首次授权**: 首次请求权限时，小程序会显示系统授权弹窗
3. **拒绝后处理**: 用户拒绝权限后，需要引导用户到设置页面手动开启
4. **平台差异**: 不同小程序平台的权限键和权限行为可能不同，本模块已处理这些差异

## 最佳实践

1. **提前检查**: 在需要权限的功能执行前，先检查权限状态
2. **友好提示**: 向用户解释为什么需要该权限，提高授权成功率
3. **优雅降级**: 权限被拒绝时，提供替代方案或功能限制
4. **批量请求**: 需要多个权限时，一次性请求，减少用户操作次数

```typescript
// 最佳实践示例
async function performLocationBasedAction() {
  // 1. 提前检查并请求权限
  const hasPermission = await checkAndRequestLocationAuth();

  if (!hasPermission) {
    // 2. 友好提示并提供替代方案
    uni.showModal({
      title: "需要位置权限",
      content: "为了提供更好的服务，我们需要获取您的位置信息。您也可以手动输入地址。",
      confirmText: "重新授权",
      cancelText: "手动输入",
      success: (res) => {
        if (res.confirm) {
          // 重新尝试获取权限
          this.performLocationBasedAction();
        } else {
          // 提供手动输入选项
          this.showManualAddressInput();
        }
      }
    });
    return;
  }

  // 3. 执行需要权限的操作
  try {
    const location = await this.getCurrentLocation();
    this.searchNearbyPlaces(location);
  } catch (error) {
    console.error("获取位置失败:", error);
    uni.showToast({
      title: "获取位置失败，请重试",
      icon: "none"
    });
  }
}
```
