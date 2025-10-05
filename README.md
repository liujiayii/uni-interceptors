# uni-tools 🛠️

> uniapp 工具库

这个仓库提供了一套用于 uniapp 开发的通用工具库，包含拦截器、hooks、工具函数和环境检测等功能，帮助解决平台兼容性问题和实现权限申请功能，让你的 uniapp 应用更加稳定和易维护。

## 🎯 适用场景

- 需要兼容低版本浏览器或手机系统
- 需要处理不同平台（微信小程序、抖音小程序等）的特殊问题
- 需要实现全局功能如路由守卫、数据存储优化等
- 希望简化常见业务逻辑的处理
- 需要处理 App、小程序权限申请问题
- 需要使用封装好的 hooks 简化开发流程
- 需要环境检测功能，针对不同环境进行特殊处理

## 🚀 安装

```bash
pnpm install uni-tools
```

## 📖 使用方式

<details>
<summary>✅ 作为 Vue 插件使用</summary>

```javascript
import { prototypeInterceptor } from "uni-tools";
import { createApp } from "vue";

const app = createApp(App);

// 注册拦截器
app.use(prototypeInterceptor);
```

</details>

<details>
<summary>✅ 直接调用函数使用</summary>

```javascript
import { applyPrototypeInterceptor } from "uni-tools";

// 应用拦截器
applyPrototypeInterceptor();
```

</details>

<details>
<summary>✅ 使用 Hooks</summary>

```javascript
import { useChooseImage, useOnShow, useWindowSize } from "uni-tools";

// 在组件中使用
export default {
  setup() {
    // 使用图片选择 hook
    const chooseImage = async () => {
      try {
        const res = await useChooseImage({
          count: 1,
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"]
        });
        console.log("选择的图片：", res);
      } catch (error) {
        console.error("选择图片失败：", error);
      }
    };

    // 使用页面显示 hook
    useOnShow(() => {
      console.log("页面显示");
    });

    // 使用窗口大小 hook
    const { windowWidth, windowHeight } = useWindowSize();

    return {
      chooseImage,
      windowWidth,
      windowHeight
    };
  }
};
```

</details>

<details>
<summary>✅ 按模块导入</summary>

```javascript
// 按需导入环境检测功能
import { isMpWeiXinWork } from "uni-tools/env";

// 按需导入hooks
import { useChooseImage } from "uni-tools/hooks";

// 按需导入拦截器
import { applyChooseLocationInterceptor } from "uni-tools/interceptors";

// 按需导入工具函数
import { checkSelfPermission } from "uni-tools/tools";
```

</details>

## 🧰 拦截器列表

<details>
<summary>✅ Array.prototype.at 兼容拦截器</summary>

**名称：** prototypeInterceptor / applyPrototypeInterceptor

**功能：** 解决低版本手机不识别 array.at() 导致运行报错的问题。

**平台：** 全平台

</details>

<details>
<summary>✅ 抖音小程序剪贴板授权拦截器(uni.setClipboardData)</summary>

**名称：** SetClipboardDataAuthInterceptor / applySetClipboardDataAuthInterceptor

**功能：** 处理抖音小程序剪贴板授权问题，当用户拒绝授权时，引导用户去设置页面授权。

**平台：** 抖音小程序 (MP-TOUTIAO)

</details>

<details>
<summary>✅ 快手小程序 Storage 代理修复拦截器(uni.setStorage)</summary>

**名称：** KuaiShouSetStorageProxyFixInterceptor / applyKuaiShouSetStorageProxyFixInterceptor

**功能：** 解决快手小程序 setStorage 不支持 proxy 对象的问题。

**平台：** 快手小程序 (MP-KUAISHOU)

</details>

<details>
<summary>✅ 拨打电话权限拦截器(uni.makePhoneCall)</summary>

**名称：** makePhoneCallInterceptor / applyMakePhoneCallInterceptor

**功能：** 在调用拨打电话前申请权限，并告知用户申请权限的目的；在调用失败后引导用户手动开启权限。

**平台：** App（Android / iOS）

**权限说明：**

- Android：`android.permission.CALL_PHONE`（直接拨打电话需要；仅拉起拨号盘通常不需要）
- iOS：无需额外电话相关权限或 Usage Description；系统会弹出拨号确认框，无法静默拨出

**工作流程：**

1. 调用 `uni.makePhoneCall` 前，先检查是否已获得拨打电话权限
2. 如果未获得权限，弹窗告知用户权限使用目的并请求授权
3. 用户确认后系统请求权限，用户拒绝则取消拨打电话
4. 如果调用拨打电话失败，引导用户手动开启权限

</details>

<details>
<summary>✅ 位置权限拦截器(uni.chooseLocation) 🔥</summary>

**名称：** chooseLocationInterceptor / applyChooseLocationInterceptor

**功能：** 在调用选择位置前申请位置权限，并告知用户申请权限的目的；在调用失败后引导用户手动开启权限。

**平台：** App（Android / iOS）、小程序（微信、百度、头条、QQ、支付宝）、H5

**权限说明：**

- Android：`android.permission.ACCESS_FINE_LOCATION`（精确位置权限）
- iOS：需要在 Info.plist 中添加 `NSLocationWhenInUseUsageDescription` 和 `NSLocationAlwaysAndWhenInUseUsageDescription` 描述
- 小程序：需要用户授权 `scope.userLocation`（微信、百度、头条、QQ）或 `location`（支付宝）
- H5：由浏览器处理位置权限

**工作流程：**

1. **App端：**
   - 调用 `uni.chooseLocation` 前，先检查是否已获得位置权限
   - 如果未获得权限，弹窗告知用户权限使用目的并请求授权
   - 用户确认后系统请求权限，用户拒绝则取消选择位置
   - 如果调用选择位置失败，引导用户手动开启权限

2. **小程序端：**
   - 调用 `uni.chooseLocation` 前，检查用户位置权限状态
   - 如果用户已明确拒绝授权，显示提示并引导用户手动开启权限
   - 如果用户未明确拒绝授权，直接调用API（避免不必要的权限询问弹窗）
   - 如果调用选择位置失败，引导用户手动开启权限

3. **H5端：**
   - 由浏览器处理位置权限，仅添加日志记录

**工具函数：**

项目提供了以下工具函数，可在其他位置复用：

- `checkAndRequestLocationAuth(platform: MiniProgramPlatform)`：检查并请求小程序位置权限
- `authTips`：权限提示信息集合
- `AuthType`：权限类型枚举
- `checkSelfPermission(permission: string)`：检查App端是否拥有指定权限
- `shouldShowRequestPermissionRationale(permission: string)`：判断是否应该显示权限请求说明
- `showAuthTip(title: string, content: string)`：显示权限提示弹窗
- `showManualAuth(permission: string, title: string, content: string)`：引导用户手动开启权限
- `MiniProgramPlatform`：小程序平台类型（'mp-alipay' | 'mp-weixin' | 'mp-baidu' | 'mp-qq' | 'mp-toutiao' | 'mp-kuaishou' | 'mp-jd' | 'app' | 'h5'）

**使用示例：**

```typescript
import {
  // 直接调用函数使用
  applyChooseLocationInterceptor,
  // 在其他地方使用工具函数
  checkAndRequestLocationAuth,
  // 检查App端权限
  checkSelfPermission,
  // 作为 Vue 插件使用
  chooseLocationInterceptor,
  // 显示权限提示
  showAuthTip,
  // 引导用户手动开启权限
  showManualAuth
} from "uni-tools";

import { createApp } from "vue";

const app = createApp(App);
app.use(chooseLocationInterceptor);
applyChooseLocationInterceptor();

// 检查微信小程序位置权限
checkAndRequestLocationAuth("mp-weixin").then((granted) => {
  if (granted) {
    // 已获得权限，可以调用位置相关API
  } else {
    // 未获得权限，需要处理
  }
});
const hasPermission = checkSelfPermission("android.permission.ACCESS_FINE_LOCATION");
showAuthTip("位置权限", "需要位置权限以提供更好的服务");
showManualAuth("android.permission.ACCESS_FINE_LOCATION", "位置权限", "请在设置中开启位置权限");
```

</details>

<details>
<summary>✅ 路由拦截器</summary>

**名称：** RouteInterceptor / applyRouteInterceptor

**功能：** 路由导航守卫，可用于登录状态验证和页面访问控制。

**平台：** 全平台

**配置参数：**

- `loginRoute`: string - 登录页面路径
- `needLoginPages`: string[] - 需要登录验证的页面路径列表
- `isLogged`: () => boolean - 判断用户是否已登录的函数

</details>

## 🪝 Hooks 列表

<details>
<summary>✅ useChooseImage Hook</summary>

**功能：** 封装图片选择功能，处理不同平台的兼容性问题。

**平台：** 全平台

**参数：**

- `count`: number - 最多可以选择的图片张数
- `sizeType`: string[] - 所选的图片的尺寸，可选值：'original'（原图）、'compressed'（压缩图）
- `sourceType`: string[] - 选择图片的来源，可选值：'album'（从相册选图）、'camera'（使用相机）
- `extension`: string[] - 文件扩展名过滤

**返回值：** `Promise<UniApp.ChooseImageSuccessCallbackResult>` - 图片选择结果

**使用示例：**

```typescript
import { useChooseImage } from "uni-tools";

// 在组件中使用
export default {
  async setup() {
    const chooseImage = async () => {
      try {
        const res = await useChooseImage({
          count: 1,
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"]
        });
        console.log("选择的图片：", res.tempFilePaths);
      } catch (error) {
        console.error("选择图片失败：", error);
      }
    };

    return { chooseImage };
  }
};
```

**特性：**

- 自动处理微信小程序的兼容性问题，在微信小程序中使用 `chooseMedia` 接口
- 统一不同平台的返回结果格式
- 支持文件扩展名过滤

</details>

<details>
<summary>✅ useOnShow Hook</summary>

**功能：** 监听页面显示事件，方便在页面显示时执行特定逻辑。

**平台：** 全平台

**参数：**

- `callback`: () => void - 页面显示时的回调函数

**使用示例：**

```typescript
import { useOnShow } from "uni-tools";

// 在组件中使用
export default {
  setup() {
    // 监听页面显示事件
    useOnShow(() => {
      console.log("页面显示");
      // 可以在这里执行页面显示时的逻辑，如数据刷新等
    });

    return {};
  }
};
```

**特性：**

- 自动处理页面生命周期
- 支持在组件中使用，无需手动管理事件监听和移除

</details>

<details>
<summary>✅ useWindowSize Hook</summary>

**功能：** 获取窗口尺寸信息，方便响应式布局。

**平台：** 全平台

**返回值：** `{ windowWidth: number, windowHeight: number }` - 窗口尺寸信息

**使用示例：**

```typescript
import { useWindowSize } from "uni-tools";

// 在组件中使用
export default {
  setup() {
    // 获取窗口尺寸
    const { windowWidth, windowHeight } = useWindowSize();

    return {
      windowWidth,
      windowHeight
    };
  }
};
```

**特性：**

- 自动响应窗口尺寸变化
- 返回格式化的尺寸信息，方便直接使用

</details>

## 🛠️ 工具函数

项目提供了一系列可复用的工具函数，用于处理权限检查、请求和用户引导等功能。

### 环境检测

<details>
<summary>isMpWeiXinWork</summary>

**功能：** 检测当前环境是否为微信小程序企业版

**类型：** `boolean`

**使用示例：**

```javascript
import { isMpWeiXinWork } from "uni-tools";

if (isMpWeiXinWork) {
  // 在微信小程序企业版中的特殊处理
  console.log("当前运行在微信小程序企业版");
}
```

</details>

### 权限检查与请求

<details>
<summary>checkAndRequestLocationAuth(platform: MiniProgramPlatform)</summary>

**功能：** 检查并请求小程序位置权限

**参数：**

- `platform`: MiniProgramPlatform - 小程序平台类型

**返回值：** `Promise<boolean>` - 是否获得授权

**使用示例：**

```typescript
import { checkAndRequestLocationAuth } from "uni-tools";

// 检查微信小程序位置权限
checkAndRequestLocationAuth("mp-weixin").then((granted) => {
  if (granted) {
    // 已获得权限，可以调用位置相关API
  } else {
    // 未获得权限，需要处理
  }
});
```

</details>

<details>
<summary>checkSelfPermission(permission: string)</summary>

**功能：** 检查App端是否拥有指定权限

**参数：**

- `permission`: string - 权限名称，如 'android.permission.ACCESS_FINE_LOCATION'

**返回值：** `boolean` - 是否拥有权限

**使用示例：**

```javascript
import { checkSelfPermission } from "uni-tools";

const hasLocationPermission = checkSelfPermission("android.permission.ACCESS_FINE_LOCATION");
if (hasLocationPermission) {
  // 已拥有位置权限
} else {
  // 需要请求权限
}
```

</details>

<details>
<summary>shouldShowRequestPermissionRationale(permission: string)</summary>

**功能：** 判断是否应该显示权限请求说明

**参数：**

- `permission`: string - 权限名称

**返回值：** `boolean` - 是否应该显示权限请求说明

**使用示例：**

```javascript
import { shouldShowRequestPermissionRationale } from "uni-tools";

if (shouldShowRequestPermissionRationale("android.permission.ACCESS_FINE_LOCATION")) {
  // 应该显示权限请求说明
  showAuthTip("位置权限", "需要位置权限以提供更好的服务");
}
```

</details>

### 用户引导与提示

<details>
<summary>showAuthTip(title: string, content: string)</summary>

**功能：** 显示权限提示弹窗

**参数：**

- `title`: string - 弹窗标题
- `content`: string - 弹窗内容

**使用示例：**

```javascript
import { showAuthTip } from "uni-tools";

showAuthTip("位置权限", "需要位置权限以提供更好的服务");
```

</details>

<details>
<summary>showManualAuth(permission: string, title: string, content: string)</summary>

**功能：** 引导用户手动开启权限

**参数：**

- `permission`: string - 权限名称
- `title`: string - 弹窗标题
- `content`: string - 弹窗内容

**使用示例：**

```javascript
import { showManualAuth } from "uni-tools";

showManualAuth("android.permission.ACCESS_FINE_LOCATION", "位置权限", "请在设置中开启位置权限");
```

</details>

### 通用工具

<details>
<summary>cloneDeep(value: any)</summary>

**功能：** 深度克隆对象

**参数：**

- `value`: any - 需要克隆的对象

**返回值：** `any` - 克隆后的对象

**使用示例：**

```javascript
import { cloneDeep } from "uni-tools";

const original = { a: 1, b: { c: 2 } };
const cloned = cloneDeep(original);
```

</details>

### 类型定义与常量

<details>
<summary>MiniProgramPlatform</summary>

**功能：** 小程序平台类型

**类型定义：**

```typescript
type MiniProgramPlatform = "mp-alipay" | "mp-weixin" | "mp-baidu" | "mp-qq" | "mp-toutiao" | "mp-kuaishou" | "mp-jd" | "app" | "h5";
```

**使用示例：**

```typescript
import { MiniProgramPlatform } from "uni-tools";

const platform: MiniProgramPlatform = "mp-weixin";
```

</details>

<details>
<summary>AuthType</summary>

**功能：** 权限类型枚举

**使用示例：**

```javascript
import { AuthType } from "uni-tools";

// 使用权限类型枚举
```

</details>

<details>
<summary>authTips</summary>

**功能：** 权限提示信息集合

**使用示例：**

```javascript
import { authTips } from "uni-tools";

// 使用权限提示信息
```

</details>

## ✨ 特性

- 🔄 **多平台兼容** - 解决不同平台的兼容性问题
- 🔧 **易于使用** - 支持 Vue 插件方式和直接调用两种使用方式
- 📦 **按需引入** - 可以只引入需要的模块，减少包体积
- 🛡️ **类型安全** - 完整的 TypeScript 类型支持
- 🎯 **功能聚焦** - 每个模块只解决特定问题，保持代码简洁
- 🔥 **位置权限处理**：全面处理 App 和小程序端的位置权限申请和引导
- 🧩 **工具函数**：提供可复用的权限检查和请求工具函数
- 🛠️ **丰富的工具集**：提供权限检查、请求、用户引导等全方位工具函数
- 🪝 **实用 Hooks**：提供封装好的 hooks，简化常见功能的开发流程
- 🌍 **环境检测**：提供环境检测功能，方便针对不同环境进行特殊处理
- 📦 **模块化设计**：支持按模块导入，减少不必要的代码引入

## ⚠️ 注意事项

- 拦截器应在应用初始化时尽早注册，以确保能正确拦截相应操作
- 使用路由拦截器时，注意避免循环重定向问题
- 在使用特定平台的拦截器时，请确保只在对应平台引入，避免不必要的代码体积增加
- **权限申请时机**：位置权限拦截器会在调用 `uni.chooseLocation` 前自动申请权限，请确保在用户明确需要选择位置时才调用该 API
- **平台差异**：不同平台的位置权限处理方式不同，请仔细阅读各平台的权限说明
- **小程序权限键**：微信、百度、头条、QQ小程序使用 `scope.userLocation`，支付宝小程序使用 `location`
- **App配置**：在 App 端使用位置权限前，请确保已在 manifest.json 中正确配置相关权限
- **iOS配置**：iOS 端需要在 Info.plist 中添加位置权限描述，否则应用会崩溃
- **工具函数使用**：`checkAndRequestLocationAuth` 函数需要传入正确的平台参数，使用字符串字面量，如 `'mp-weixin'`
- **平台类型**：MiniProgramPlatform 包含以下平台类型：'mp-alipay' | 'mp-weixin' | 'mp-toutiao' | 'mp-kuaishou' | 'mp-jd' | 'app' | 'h5'
- **兼容性**：本拦截器已处理各平台兼容性问题，但建议在目标设备上进行充分测试
- **按模块导入**：使用 `import { xxx } from "uni-tools/xxx"` 的方式可以只导入特定模块，减少包体积

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

### 添加新的拦截器

1. 在 `src/interceptors` 目录下创建新的拦截器文件
2. 实现拦截器逻辑，确保支持多平台
3. 在 `src/interceptors/index.ts` 中导出您的拦截器
4. 在 `src/index.ts` 中添加导出
5. 添加相应的测试用例
6. 在 README.md 中添加拦截器文档

### 添加新的 Hooks

1. 在 `src/hooks` 目录下创建新的 hook 文件
2. 实现 hook 逻辑，确保类型安全
3. 在 `src/hooks/index.ts` 中导出您的 hook
4. 在 `src/index.ts` 中添加导出
5. 添加相应的测试用例
6. 在 README.md 的"Hooks 列表"章节中添加 hook 文档

### 添加新的工具函数

1. 在 `src/tools` 目录下创建新的工具函数文件
2. 实现工具函数逻辑，确保类型安全
3. 在 `src/tools/index.ts` 中导出您的工具函数
4. 在 `src/index.ts` 中添加导出
5. 添加相应的测试用例
6. 在 README.md 的"工具函数"章节中添加函数文档

### 添加新的环境检测功能

1. 在 `src/env` 目录下创建新的环境检测文件
2. 实现环境检测逻辑，确保类型安全
3. 在 `src/env/index.ts` 中导出您的环境检测功能
4. 在 `src/index.ts` 中添加导出
5. 添加相应的测试用例
6. 在 README.md 的"环境检测"章节中添加功能文档

### 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 配置
- 添加适当的注释和文档
- 确保代码在所有目标平台上都能正常工作

## 📄 许可证

MIT
