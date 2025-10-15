# authTips

`authTips` 是一个权限提示配置对象，为不同类型的权限提供了标准化的提示文案，包括权限使用说明、功能描述和失败提示。

## 功能描述

该对象为每种权限类型提供了三部分内容：

- `title`: 权限标题
- `describe`: 权限使用说明，解释为什么需要该权限
- `failTips`: 权限获取失败时的提示信息

## 支持的权限类型

| 权限类型 | 说明     | Android权限                              |
| -------- | -------- | ---------------------------------------- |
| LOCATION | 位置权限 | android.permission.ACCESS_FINE_LOCATION  |
| PHOTO    | 相册权限 | android.permission.READ_EXTERNAL_STORAGE |
| CAMERA   | 相机权限 | android.permission.CAMERA                |
| PHONE    | 电话权限 | android.permission.CALL_PHONE            |

## 使用方法

```typescript
import { authTips, AuthType } from "uni-toolkit/tools";

// 获取位置权限的提示信息
const locationTip = authTips[AuthType.LOCATION];
console.log(locationTip.title); // "位置权限使用说明"
console.log(locationTip.describe); // "为您提供附近的服务点、车辆定位等基于位置的便捷服务"
console.log(locationTip.failTips); // "位置权限获取失败，请前往设置开启或检查系统定位服务"

// 在权限请求中使用
uni.showModal({
  title: authTips[AuthType.CAMERA].title,
  content: authTips[AuthType.CAMERA].describe,
  success: (res) => {
    if (res.confirm) {
      // 用户同意，请求权限
    }
  }
});
```

## 权限提示内容

### 位置权限 (LOCATION)

- **标题**: "位置权限使用说明"
- **描述**: "为您提供附近的服务点、车辆定位等基于位置的便捷服务"
- **失败提示**: "位置权限获取失败，请前往设置开启或检查系统定位服务"

### 相册权限 (PHOTO)

- **标题**: "相册权限使用说明"
- **描述**: "用于图片上传、头像设置、二维码识别等功能，让您的操作更便捷"
- **失败提示**: "相册权限获取失败，请前往设置中开启存储权限"

### 相机权限 (CAMERA)

- **标题**: "相机权限使用说明"
- **描述**: "用于拍照、扫描二维码等功能，提升您的使用体验"
- **失败提示**: "相机权限获取失败，请前往设置中开启相机权限"

### 电话权限 (PHONE)

- **标题**: "电话权限使用说明"
- **描述**: "用于快速联系客服，为您提供更及时的服务支持"
- **失败提示**: "电话权限获取失败，请前往设置中开启通话权限"

## 注意事项

- 该对象通常与其他权限工具函数（如 `showAuthTip`）配合使用
- 提示文案可以根据实际应用需求进行修改
- 确保提示文案准确描述权限用途，提高用户授权意愿
