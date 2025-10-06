# 使用指南

本文档详细介绍了 uni-toolkit 的使用方法和注意事项。

## 目录

- [基本使用](#基本使用)
- [权限处理](#权限处理)
- [工具函数使用](#工具函数使用)
- [兼容性](#兼容性)

## 基本使用

### 拦截器注册时机

拦截器应在应用初始化时尽早注册，以确保能正确拦截相应操作。推荐在应用入口文件（如 main.ts）中注册拦截器：

```typescript
import { chooseLocationInterceptor } from "uni-toolkit";
import { createApp } from "vue";

const app = createApp(App);

// 注册拦截器
app.use(chooseLocationInterceptor);
```

### 路由拦截注意事项

使用路由拦截器时，注意避免循环重定向问题。例如，在登录验证时，确保未登录用户重定向到登录页后，登录页不会被拦截器再次拦截。

### 平台特定拦截器

在使用特定平台的拦截器时，请确保只在对应平台引入，避免不必要的代码体积增加。可以通过环境判断来按需引入：

```javascript
// 只在微信小程序中引入特定拦截器
// #ifdef MP-WEIXIN
import { weixinSpecificInterceptor } from "uni-toolkit";

app.use(weixinSpecificInterceptor);
// #endif
```

## 权限处理

### 权限申请时机

位置权限拦截器会在调用 `uni.chooseLocation` 前自动申请权限，请确保在用户明确需要选择位置时才调用该 API。避免在应用启动时就申请权限，这样可能会引起用户的反感。

### 平台差异

不同平台的位置权限处理方式不同，请仔细阅读各平台的权限说明：

- **微信小程序**：使用 `scope.userLocation` 权限键
- **支付宝小程序**：使用 `location` 权限键
- **百度、头条、QQ小程序**：使用 `scope.userLocation` 权限键
- **App**：需要在 manifest.json 中配置相关权限

### App配置

在 App 端使用位置权限前，请确保已在 manifest.json 中正确配置相关权限：

```json
{
  "app-plus": {
    "android": {
      "permissions": [
        "<uses-permission android:name=\"android.permission.ACCESS_FINE_LOCATION\"/>",
        "<uses-permission android:name=\"android.permission.ACCESS_COARSE_LOCATION\"/>"
      ]
    },
    "ios": {
      "permissions": {
        "location": {
          "desc": "您的位置信息将用于小程序位置接口的效果展示"
        }
      }
    }
  }
}
```

### iOS配置

iOS 端需要在 Info.plist 中添加位置权限描述，否则应用会崩溃：

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>需要访问您的位置信息，以便为您提供更好的服务</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>需要访问您的位置信息，以便为您提供更好的服务</string>
```

## 工具函数使用

### 平台参数

`checkAndRequestLocationAuth` 函数需要传入正确的平台参数，使用字符串字面量，如 `'mp-weixin'`。确保传入的平台参数与实际运行平台一致，否则可能导致权限检查失败。

### 平台类型

MiniProgramPlatform 包含以下平台类型：

- `'mp-alipay'` - 支付宝小程序
- `'mp-weixin'` - 微信小程序
- `'mp-baidu'` - 百度小程序
- `'mp-qq'` - QQ小程序
- `'mp-toutiao'` - 字节跳动小程序
- `'mp-kuaishou'` - 快手小程序
- `'mp-jd'` - 京东小程序
- `'app'` - App
- `'h5'` - H5

### 按模块导入

使用 `import { xxx } from "uni-toolkit/xxx"` 的方式可以只导入特定模块，减少包体积：

```javascript
// 按需导入环境检测功能
import { isMpWeiXinWork } from "uni-toolkit/env";

// 按需导入hooks
import { useChooseImage } from "uni-toolkit/hooks";

// 按需导入拦截器
import { applyChooseLocationInterceptor } from "uni-toolkit/interceptors";

// 按需导入工具函数
import { checkSelfPermission } from "uni-toolkit/tools";
```

## 兼容性

### 平台兼容性

本工具库已处理各平台兼容性问题，但建议在目标设备上进行充分测试。特别是：

- 不同品牌和型号的 Android 设备可能存在差异
- iOS 版本更新可能会影响某些 API 的行为
- 各小程序平台的 API 可能在不同版本中有变化

### 测试建议

1. 在所有目标平台上进行完整测试
2. 特别关注权限申请和处理的流程
3. 测试边界情况和错误处理
4. 在低版本系统上测试兼容性

### 版本兼容

确保您的项目依赖的 uni-app 版本与 uni-toolkit 兼容。如果遇到兼容性问题，请检查：

1. uni-app 版本是否过低
2. 各小程序平台的基线版本是否满足要求
3. 是否有其他库与 uni-toolkit 产生冲突
