# 工具函数文档

本文档详细介绍了 uni-toolkit 中提供的所有工具函数。

## 目录

- [权限检查与请求](#权限检查与请求)
  - [checkAndRequestLocationAuth](#checkandrequestlocationauth)
  - [checkSelfPermission](#checkselfpermission)
  - [shouldShowRequestPermissionRationale](#shouldshowrequestpermissionrationale)
- [用户引导与提示](#用户引导与提示)
  - [showAuthTip](#showauthtip)
  - [showManualAuth](#showmanualauth)
- [通用工具](#通用工具)
  - [cloneDeep](#clonedeep)
  - [getCurrentPageRoute](#getcurrentroute)
  - [isPageLevelComponent](#ispagelevelcomponent)
- [类型定义与常量](#类型定义与常量)
  - [MiniProgramPlatform](#miniprogramplatform)
  - [AuthType](#authtype)
  - [authTips](#authtips)

## 权限检查与请求

### checkAndRequestPermissions

**功能：** 通用的权限检查与请求函数，支持检查和请求多种类型的权限，包括位置、相机和相册权限。

#### 参数

| 参数名          | 类型                | 必填 | 说明                                             |
| --------------- | ------------------- | ---- | ------------------------------------------------ |
| platform        | MiniProgramPlatform | 是   | 小程序平台类型                                   |
| permissionTypes | string[]            | 是   | 权限类型数组，支持 'location'、'camera'、'album' |

#### 返回值

`Promise<boolean>` - 是否获得授权

#### 使用示例

```typescript
import { checkAndRequestPermissions } from "uni-toolkit";

// 检查位置权限
const hasLocationPermission = await checkAndRequestPermissions("mp-weixin", ["location"]);

// 检查相机权限
const hasCameraPermission = await checkAndRequestPermissions("mp-weixin", ["camera"]);

// 检查相册权限
const hasAlbumPermission = await checkAndRequestPermissions("mp-weixin", ["album"]);

// 同时检查相机和相册权限
const hasImagePermissions = await checkAndRequestPermissions("mp-weixin", ["camera", "album"]);
```

#### 说明

该函数是一个通用的权限检查与请求函数，支持多种权限类型。它会根据传入的权限类型数组，检查并请求相应的权限。函数返回一个Promise，解析为一个布尔值，表示是否获得了所有请求的权限。

### checkAndRequestLocationAuth

**功能：** 检查并请求小程序位置权限（支持所有小程序平台），是 checkAndRequestPermissions 的封装函数。

#### 参数

无参数

#### 返回值

`Promise<boolean>` - 是否获得授权

#### 使用示例

```typescript
import { checkAndRequestLocationAuth } from "uni-toolkit";

// 检查位置权限
const hasPermission = await checkAndRequestLocationAuth("mp-weixin");
```

#### 说明

该函数用于检查并请求小程序平台的位置权限。它是 checkAndRequestPermissions 函数的封装，专门用于处理位置权限。函数返回一个Promise，解析为一个布尔值，表示是否获得了权限。

### checkAndRequestImageAuth

**功能：** 检查并请求小程序图片选择权限（支持所有小程序平台），是 checkAndRequestPermissions 的封装函数。

#### 参数

| 参数       | 类型     | 必填 | 说明                                     |
| ---------- | -------- | ---- | ---------------------------------------- |
| sourceType | string[] | 否   | 图片来源类型，默认为 ['album', 'camera'] |

#### 返回值

`Promise<boolean>` - 是否获得授权

#### 使用示例

```typescript
import { checkAndRequestImageAuth } from "uni-toolkit";

// 检查相册和相机权限
const hasPermission = await checkAndRequestImageAuth("mp-weixin");

// 仅检查相册权限
const hasAlbumPermission = await checkAndRequestImageAuth("mp-weixin", ["album"]);

// 仅检查相机权限
const hasCameraPermission = await checkAndRequestImageAuth("mp-weixin", ["camera"]);
```

#### 说明

该函数用于检查并请求小程序平台的图片选择权限。它是 checkAndRequestPermissions 函数的封装，专门用于处理图片选择相关的权限。根据 sourceType 参数，它会检查并请求相机权限和/或相册权限。函数返回一个Promise，解析为一个布尔值，表示是否获得了所需权限。

sourceType 参数说明：

- 'album' - 相册权限，用于从相册选择图片
- 'camera' - 相机权限，用于拍照获取图片

### checkSelfPermission

**功能：** 检查App端是否拥有指定权限

#### 参数

| 参数       | 类型   | 必填 | 说明                                                   |
| ---------- | ------ | ---- | ------------------------------------------------------ |
| permission | string | 是   | 权限名称，如 'android.permission.ACCESS_FINE_LOCATION' |

#### 返回值

`boolean` - 是否拥有权限

#### 使用示例

```javascript
import { checkSelfPermission } from "uni-toolkit";

const hasLocationPermission = checkSelfPermission("android.permission.ACCESS_FINE_LOCATION");
if (hasLocationPermission) {
  // 已拥有位置权限
  console.log("已拥有位置权限");
} else {
  // 需要请求权限
  console.log("需要请求位置权限");
}
```

#### 说明

该函数用于检查App端是否已经拥有指定的权限。它接受一个权限名称作为参数，返回一个布尔值，表示是否拥有该权限。这个函数主要用于Android平台，因为Android系统需要显式请求权限。

### shouldShowRequestPermissionRationale

**功能：** 判断是否应该显示权限请求说明

#### 参数

| 参数       | 类型   | 必填 | 说明     |
| ---------- | ------ | ---- | -------- |
| permission | string | 是   | 权限名称 |

#### 返回值

`boolean` - 是否应该显示权限请求说明

#### 使用示例

```javascript
import { shouldShowRequestPermissionRationale, showAuthTip } from "uni-toolkit";

if (shouldShowRequestPermissionRationale("android.permission.ACCESS_FINE_LOCATION")) {
  // 应该显示权限请求说明
  showAuthTip("位置权限", "需要位置权限以提供更好的服务");
}
```

#### 说明

该函数用于判断是否应该向用户显示权限请求的说明。在Android系统中，当用户之前拒绝过某个权限请求时，系统可能会建议应用在再次请求权限之前，向用户解释为什么需要这个权限。这个函数可以帮助我们判断是否需要显示这样的说明。

## 用户引导与提示

### showAuthTip

**功能：** 显示权限提示弹窗

#### 参数

| 参数    | 类型   | 必填 | 说明     |
| ------- | ------ | ---- | -------- |
| title   | string | 是   | 弹窗标题 |
| content | string | 是   | 弹窗内容 |

#### 使用示例

```javascript
import { showAuthTip } from "uni-toolkit";

showAuthTip("位置权限", "需要位置权限以提供更好的服务");
```

#### 说明

该函数用于显示一个权限提示弹窗，向用户解释为什么需要某个权限。这个弹窗通常在请求权限之前显示，帮助用户理解权限的用途，提高用户授权的意愿。

### showManualAuth

**功能：** 引导用户手动开启权限

#### 参数

| 参数       | 类型   | 必填 | 说明     |
| ---------- | ------ | ---- | -------- |
| permission | string | 是   | 权限名称 |
| title      | string | 是   | 弹窗标题 |
| content    | string | 是   | 弹窗内容 |

#### 使用示例

```javascript
import { showManualAuth } from "uni-toolkit";

showManualAuth("android.permission.ACCESS_FINE_LOCATION", "位置权限", "请在设置中开启位置权限");
```

#### 说明

该函数用于引导用户手动开启权限。当用户拒绝了权限请求，并且选择了"不再询问"选项时，应用无法再次弹出权限请求对话框。这时，我们需要引导用户到系统设置中手动开启权限。这个函数会显示一个弹窗，告诉用户如何手动开启权限。

## 通用工具

### cloneDeep

**功能：** 深度克隆对象

#### 参数

| 参数  | 类型 | 必填 | 说明           |
| ----- | ---- | ---- | -------------- |
| value | any  | 是   | 需要克隆的对象 |

#### 返回值

`any` - 克隆后的对象

#### 使用示例

```javascript
import { cloneDeep } from "uni-toolkit";

const original = { a: 1, b: { c: 2 } };
const cloned = cloneDeep(original);

console.log(cloned); // { a: 1, b: { c: 2 } }
console.log(cloned === original); // false
console.log(cloned.b === original.b); // false
```

#### 说明

该函数用于深度克隆一个对象，返回一个与原对象完全相同但独立的新对象。深度克隆意味着不仅对象本身被复制，对象的所有嵌套属性也会被递归复制。这在需要修改对象但又不想影响原对象的场景中非常有用。

### getCurrentPageRoute

**功能：** 获取当前页面的路由路径

#### 参数

无参数

#### 返回值

`string` - 当前页面的路由路径，如果获取失败则返回空字符串

#### 使用示例

```javascript
import { getCurrentPageRoute } from "uni-toolkit";

const route = getCurrentPageRoute();
console.log(route); // "pages/index/index"
```

#### 说明

该函数用于获取当前页面的路由路径。它通过 `getCurrentPages()` API 获取页面栈，然后从栈顶的页面实例中提取路由信息。这个函数在需要根据当前页面路径执行不同逻辑的场景中非常有用。

### isPageLevelComponent

**功能：** 判断当前组件是否是页面级别

#### 参数

无参数

#### 返回值

`boolean` - 是否是页面级别

#### 使用示例

```javascript
import { isPageLevelComponent } from "uni-toolkit";

const isPage = isPageLevelComponent();
console.log(isPage); // true 或 false
```

#### 说明

该函数用于判断当前组件是否是页面级别。在 uni-app 中，页面和组件都是 .vue 文件，但它们的生命周期和使用方式有所不同。页面级别的组件会直接响应页面的生命周期事件（如 onShow），而普通组件则需要通过事件总线来监听这些事件。

该函数通过检查组件实例的 `renderer` 属性是否为 "page" 来判断当前组件是否是页面级别。这个判断结果可以用于决定如何处理组件的生命周期事件。

## 类型定义与常量

### MiniProgramPlatform

**功能：** 小程序平台类型

#### 类型定义

```typescript
type MiniProgramPlatform = "mp-alipay" | "mp-weixin" | "mp-baidu" | "mp-qq" | "mp-toutiao" | "mp-kuaishou" | "mp-jd" | "app" | "h5";
```

#### 使用示例

```typescript
import { MiniProgramPlatform } from "uni-toolkit";

const platform: MiniProgramPlatform = "mp-weixin";
console.log(platform); // "mp-weixin"
```

#### 说明

该类型定义了所有支持的小程序平台类型。在需要针对不同平台进行特殊处理时，可以使用这个类型来确保平台参数的正确性。

### AuthType

**功能：** 权限类型枚举

#### 使用示例

```typescript
import { AuthType } from "uni-toolkit";

// 使用权限类型枚举
const authType: AuthType = AuthType.LOCATION;
```

#### 说明

该枚举定义了各种权限类型，用于统一权限管理。通过使用枚举，可以避免在代码中直接使用字符串，提高代码的可维护性和可读性。

### authTips

**功能：** 权限提示信息集合

#### 使用示例

```javascript
import { authTips } from "uni-toolkit";

// 使用权限提示信息
const locationTip = authTips.LOCATION;
console.log(locationTip.title); // "位置权限"
console.log(locationTip.content); // "需要位置权限以提供更好的服务"
```

#### 说明

该对象包含了各种权限的提示信息，包括标题和内容。在需要显示权限提示时，可以直接使用这些预定义的提示信息，保持应用中权限提示的一致性。
