# showAuthTip

`showAuthTip` 是一个权限提示工具函数，用于在请求权限前向用户说明权限用途，提高用户授权意愿。

## 功能描述

该函数会在请求权限前显示一个模态框，向用户说明为什么需要该权限以及该权限将用于什么功能。主要流程：

1. 检查权限是否已授予
2. 如果已授权，直接返回 `true`
3. 如果未授权，显示权限说明模态框
4. 根据用户选择返回结果

## 函数签名

```typescript
function showAuthTip(authorize: AuthType): Promise<boolean>;
```

### 参数

| 参数      | 类型     | 必填 | 说明             |
| --------- | -------- | ---- | ---------------- |
| authorize | AuthType | 是   | 要请求的权限类型 |

### 返回值

返回一个 Promise，解析为布尔值：

- `true`: 用户同意授权或已授权
- `false`: 用户拒绝授权或出现错误

## 使用方法

```typescript
import { AuthType, showAuthTip } from "uni-toolkit/tools";

// 请求相机权限
showAuthTip(AuthType.CAMERA).then((granted) => {
  if (granted) {
    console.log("用户同意授权，可以继续使用相机功能");
    // 在这里调用相机相关API
    uni.chooseImage({
      count: 1,
      sourceType: ["camera"],
      success: (res) => {
        console.log("拍照成功", res.tempFilePaths);
      }
    });
  } else {
    console.log("用户拒绝授权");
    uni.showToast({
      title: "需要相机权限才能使用此功能",
      icon: "none"
    });
  }
});

// 使用 async/await
async function requestLocationPermission() {
  try {
    const granted = await showAuthTip(AuthType.LOCATION);
    if (granted) {
      // 用户同意，获取位置信息
      uni.getLocation({
        type: "gcj02",
        success: (res) => {
          console.log("获取位置成功", res);
        }
      });
    } else {
      console.log("用户拒绝位置权限");
    }
  } catch (error) {
    console.error("权限请求出错", error);
  }
}
```

## 平台差异

### APP-PLUS

在 APP 环境下，会先检查权限状态，如果未授权则显示权限说明模态框。

### 小程序和H5

在小程序和 H5 环境下，由于权限管理方式不同，该函数仍然会显示权限说明模态框，但实际权限授权由系统或浏览器处理。

## 提示内容

提示内容来自 `authTips` 配置对象，每种权限类型都有对应的标题和说明：

- **位置权限**: 说明位置服务将用于提供附近的服务点、车辆定位等
- **相册权限**: 说明相册访问将用于图片上传、头像设置等
- **相机权限**: 说明相机将用于拍照、扫描二维码等
- **电话权限**: 说明电话权限将用于快速联系客服等

## 注意事项

- 该函数只负责显示权限说明，不实际请求权限
- 实际的权限请求需要在用户同意后调用相应的 API
- 如果权限类型未在 `authTips` 中配置，会在控制台输出警告并返回 `false`
- 模态框显示失败时也会返回 `false`
- 建议在实际请求权限前调用此函数，提高用户授权意愿
