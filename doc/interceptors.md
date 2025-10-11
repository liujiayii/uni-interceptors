# 拦截器文档

本文档详细介绍了 uni-toolkit 中提供的所有拦截器。

## 目录

- [API 拦截器](#api-拦截器)
  - [chooseImage 拦截器](#chooseimage-拦截器) - 图片选择增强，自动处理权限和兼容性
  - [chooseLocation 拦截器](#chooselocation-拦截器) - 位置选择增强，自动处理权限和错误
  - [makePhoneCall 拦截器](#makephonecall-拦截器) - 拨打电话增强，提供参数校验和权限处理
  - [route 拦截器](#route-拦截器) - 路由增强，支持路由白名单和参数处理
  - [setClipboardData 拦截器](#setclipboarddata-拦截器) - 剪贴板增强，提供兼容性处理
  - [setStorage 拦截器](#setstorage-拦截器) - 存储增强，支持数据加密和过期时间

## API 拦截器

### chooseImage 拦截器

### 功能描述

拦截 uni.chooseImage API 调用，提供增强功能

### 平台支持

| 平台           | 支持情况 | 说明     |
| -------------- | -------- | -------- |
| H5             | ✅       | 支持拦截 |
| 微信小程序     | ✅       | 支持拦截 |
| 支付宝小程序   | ✅       | 支持拦截 |
| 百度小程序     | ✅       | 支持拦截 |
| 字节跳动小程序 | ✅       | 支持拦截 |
| QQ小程序       | ✅       | 支持拦截 |
| 快手小程序     | ✅       | 支持拦截 |
| 京东小程序     | ✅       | 支持拦截 |
| App            | ✅       | 支持拦截 |

### 使用示例

```javascript
// 直接使用 uni.chooseImage，拦截器会自动处理
uni.chooseImage({
  count: 1, // 默认9
  sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
  sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
  success(res) {
    console.log("选择图片成功", res.tempFilePaths);
    // 处理选择的图片
    const tempFilePaths = res.tempFilePaths;
    // 可以进行上传或预览等操作
  },
  fail(err) {
    console.log("选择图片失败", err);
  },
  complete() {
    console.log("选择图片操作完成");
  }
});
```

### 增强功能

该拦截器拦截 uni.chooseImage API 调用，提供以下增强功能：

1. **权限检查**：在 App 端自动检查相机和相册权限，根据 sourceType 参数动态请求相应权限
2. **权限提示**：在请求权限前，向用户展示权限使用说明，提高授权成功率
3. **错误处理增强**：对权限拒绝等错误进行统一处理，提供更友好的错误提示
4. **兼容性处理**：处理不同平台间的差异，确保一致的调用体验

拦截器会在调用原始 API 之前和之后执行相应的处理逻辑，开发者无需修改现有代码，只需引入 uni-toolkit 即可自动获得这些增强功能。

### chooseLocation 拦截器

### 功能描述

拦截 uni.chooseLocation API 调用，提供增强功能

### 平台支持

| 平台           | 支持情况 | 说明     |
| -------------- | -------- | -------- |
| H5             | ✅       | 支持拦截 |
| 微信小程序     | ✅       | 支持拦截 |
| 支付宝小程序   | ✅       | 支持拦截 |
| 百度小程序     | ✅       | 支持拦截 |
| 字节跳动小程序 | ✅       | 支持拦截 |
| QQ小程序       | ✅       | 支持拦截 |
| 快手小程序     | ✅       | 支持拦截 |
| 京东小程序     | ✅       | 支持拦截 |
| App            | ✅       | 支持拦截 |

### 使用示例

```javascript
// 直接使用 uni.chooseLocation，拦截器会自动处理
uni.chooseLocation({
  success(res) {
    console.log(`位置名称：${res.name}`);
    console.log(`详细地址：${res.address}`);
    console.log(`纬度：${res.latitude}`);
    console.log(`经度：${res.longitude}`);

    // 可以进一步处理位置信息
    const locationInfo = {
      name: res.name,
      address: res.address,
      latitude: res.latitude,
      longitude: res.longitude
    };
    // 存储或使用位置信息
  },
  fail(err) {
    console.log("选择位置失败", err);
  },
  complete() {
    console.log("选择位置操作完成");
  }
});
```

### 增强功能

该拦截器拦截 uni.chooseLocation API 调用，提供以下增强功能：

1. **错误处理增强**：对平台特定的错误进行统一处理，提供更友好的错误提示
2. **参数校验**：对传入参数进行校验，确保参数的正确性
3. **结果格式化**：对返回结果进行格式化，确保在不同平台上返回的数据结构一致

拦截器会在调用原始 API 之前和之后执行相应的处理逻辑，开发者无需修改现有代码，只需引入 uni-toolkit 即可自动获得这些增强功能。

### makePhoneCall 拦截器

### 功能描述

拦截 uni.makePhoneCall API 调用，提供增强功能

### 平台支持

| 平台           | 支持情况 | 说明     |
| -------------- | -------- | -------- |
| H5             | ✅       | 支持拦截 |
| 微信小程序     | ✅       | 支持拦截 |
| 支付宝小程序   | ✅       | 支持拦截 |
| 百度小程序     | ✅       | 支持拦截 |
| 字节跳动小程序 | ✅       | 支持拦截 |
| QQ小程序       | ✅       | 支持拦截 |
| 快手小程序     | ✅       | 支持拦截 |
| 京东小程序     | ✅       | 支持拦截 |
| App            | ✅       | 支持拦截 |

### 使用示例

```javascript
// 直接使用 uni.makePhoneCall，拦截器会自动处理
uni.makePhoneCall({
  phoneNumber: "10086", // 需要拨打的电话号码
  success() {
    console.log("拨打电话成功");
  },
  fail(err) {
    console.log("拨打电话失败", err);
  },
  complete() {
    console.log("拨打电话操作完成");
  }
});
```

### 增强功能

该拦截器拦截 uni.makePhoneCall API 调用，提供以下增强功能：

1. **参数校验**：对电话号码格式进行校验，确保号码的有效性
2. **权限检查**：在调用 API 前检查是否有拨打电话的权限
3. **错误处理增强**：对平台特定的错误进行统一处理，提供更友好的错误提示
4. **兼容性处理**：处理不同平台间的差异，确保一致的调用体验

拦截器会在调用原始 API 之前和之后执行相应的处理逻辑，开发者无需修改现有代码，只需引入 uni-toolkit 即可自动获得这些增强功能。

### route 拦截器

### 功能描述

拦截路由相关 API 调用，提供增强功能

### 平台支持

| 平台           | 支持情况 | 说明     |
| -------------- | -------- | -------- |
| H5             | ✅       | 支持拦截 |
| 微信小程序     | ✅       | 支持拦截 |
| 支付宝小程序   | ✅       | 支持拦截 |
| 百度小程序     | ✅       | 支持拦截 |
| 字节跳动小程序 | ✅       | 支持拦截 |
| QQ小程序       | ✅       | 支持拦截 |
| 快手小程序     | ✅       | 支持拦截 |
| 京东小程序     | ✅       | 支持拦截 |
| App            | ✅       | 支持拦截 |

### 使用示例

```javascript
// 直接使用路由 API，拦截器会自动处理
uni.navigateTo({
  url: "/pages/detail/detail?id=1",
  success() {
    console.log("页面跳转成功");
  },
  fail(err) {
    console.log("页面跳转失败", err);
  },
  complete() {
    console.log("页面跳转操作完成");
  }
});
```

### 增强功能

该拦截器拦截路由相关 API 调用（如 uni.navigateTo、uni.redirectTo、uni.reLaunch 等），提供以下增强功能：

1. **路由白名单**：支持配置路由白名单，只允许跳转到白名单中的页面
2. **参数处理**：对路由参数进行处理，支持复杂对象的传递
3. **路由日志**：记录路由跳转日志，方便调试和分析
4. **页面栈管理**：管理页面栈，避免页面栈溢出
5. **错误处理增强**：对平台特定的错误进行统一处理，提供更友好的错误提示

拦截器会在调用原始 API 之前和之后执行相应的处理逻辑，开发者无需修改现有代码，只需引入 uni-toolkit 即可自动获得这些增强功能。

### setClipboardData 拦截器

### 功能描述

拦截 uni.setClipboardData API 调用，提供增强功能

### 平台支持

| 平台           | 支持情况 | 说明     |
| -------------- | -------- | -------- |
| H5             | ✅       | 支持拦截 |
| 微信小程序     | ✅       | 支持拦截 |
| 支付宝小程序   | ✅       | 支持拦截 |
| 百度小程序     | ✅       | 支持拦截 |
| 字节跳动小程序 | ✅       | 支持拦截 |
| QQ小程序       | ✅       | 支持拦截 |
| 快手小程序     | ✅       | 支持拦截 |
| 京东小程序     | ✅       | 支持拦截 |
| App            | ✅       | 支持拦截 |

### 使用示例

```javascript
// 直接使用 uni.setClipboardData，拦截器会自动处理
uni.setClipboardData({
  data: "这是要复制到剪贴板的内容",
  success() {
    console.log("复制成功");
  },
  fail(err) {
    console.log("复制失败", err);
  },
  complete() {
    console.log("复制操作完成");
  }
});
```

### 增强功能

该拦截器拦截 uni.setClipboardData API 调用，提供以下增强功能：

1. **抖音小程序剪贴板授权拦截**：在抖音小程序中，自动处理剪贴板授权逻辑
2. **数据格式化**：对要复制的数据进行格式化，确保在不同平台上的兼容性
3. **错误处理增强**：对剪贴板操作错误进行统一处理，提供更友好的错误提示
4. **成功提示**：在复制成功后提供统一的成功提示

拦截器会在调用原始 API 之前和之后执行相应的处理逻辑，开发者无需修改现有代码，只需引入 uni-toolkit 即可自动获得这些增强功能。

### setStorage 拦截器

### 功能描述

拦截存储相关 API 调用，提供增强功能

### 平台支持

| 平台           | 支持情况 | 说明     |
| -------------- | -------- | -------- |
| H5             | ✅       | 支持拦截 |
| 微信小程序     | ✅       | 支持拦截 |
| 支付宝小程序   | ✅       | 支持拦截 |
| 百度小程序     | ✅       | 支持拦截 |
| 字节跳动小程序 | ✅       | 支持拦截 |
| QQ小程序       | ✅       | 支持拦截 |
| 快手小程序     | ✅       | 支持拦截 |
| 京东小程序     | ✅       | 支持拦截 |
| App            | ✅       | 支持拦截 |

### 使用示例

```javascript
// 直接使用存储 API，拦截器会自动处理
uni.setStorage({
  key: "userInfo",
  data: {
    name: "张三",
    age: 18,
    gender: "男"
  },
  success() {
    console.log("存储成功");
  },
  fail(err) {
    console.log("存储失败", err);
  },
  complete() {
    console.log("存储操作完成");
  }
});

// 使用同步方法
try {
  uni.setStorageSync("token", "abcdef123456");
  console.log("同步存储成功");
} catch (e) {
  console.error("同步存储失败", e);
}
```

### 增强功能

该拦截器拦截存储相关 API 调用（如 uni.setStorage、uni.getStorage、uni.removeStorage 等及其同步版本），提供以下增强功能：

1. **数据加密**：对敏感数据进行加密存储，提高数据安全性
2. **数据压缩**：对大型数据进行压缩，减少存储空间占用
3. **过期时间**：支持设置数据过期时间，自动清理过期数据
4. **存储限制处理**：处理存储空间不足等异常情况，提供更友好的错误提示
5. **数据格式化**：对存储的数据进行格式化，确保在不同平台上的兼容性

拦截器会在调用原始 API 之前和之后执行相应的处理逻辑，开发者无需修改现有代码，只需引入 uni-toolkit 即可自动获得这些增强功能。

```javascript
// 直接使用存储 API，拦截器会自动处理
uni.setStorage({
  key: "userInfo",
  data: {
    name: "张三",
    age: 30
  },
  success() {
    console.log("存储成功");
  },
  fail(err) {
    console.log("存储失败", err);
  }
});
```

#### 说明

该拦截器拦截存储相关 API 调用（如 uni.setStorage、uni.getStorage、uni.removeStorage 等），提供以下增强功能：

1. **数据序列化**：自动处理复杂数据类型的序列化和反序列化
2. **存储空间管理**：监控存储空间使用情况，在空间不足时提供警告
3. **数据加密**：支持对敏感数据进行加密存储
4. **错误处理增强**：对存储操作错误进行统一处理，提供更友好的错误提示
5. **存储日志**：记录存储操作日志，便于调试和分析

拦截器会在调用原始存储 API 之前和之后执行相应的处理逻辑，开发者无需修改现有代码，只需引入 uni-toolkit 即可自动获得这些增强功能。
