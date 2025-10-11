# 工具函数文档

本文档详细介绍了 uni-toolkit 中提供的所有工具函数。

## 目录

- [权限检查与请求](#权限检查与请求)
  - [checkAndRequestPermissions](#checkandrequestpermissions) - 通用权限检查与请求函数
  - [checkAndRequestLocationAuth](#checkandrequestlocationauth) - 位置权限检查与请求
  - [checkSelfPermission](#checkselfpermission) - 检查应用权限状态
  - [shouldShowRequestPermissionRationale](#shouldshowrequestpermissionrationale) - 判断是否显示权限说明
- [用户引导与提示](#用户引导与提示)
  - [showAuthTip](#showauthtip) - 显示权限提示对话框
  - [showManualAuth](#showmanualauth) - 引导用户手动授权
- [通用工具](#通用工具)
  - [cloneDeep](#clonedeep) - 深拷贝对象
  - [getCurrentPageRoute](#getcurrentroute) - 获取当前页面路由
  - [isPageLevelComponent](#ispagelevelcomponent) - 判断是否为页面级组件
- [类型定义与常量](#类型定义与常量)
  - [MiniProgramPlatform](#miniprogramplatform) - 小程序平台类型
  - [AuthType](#authtype) - 权限类型
  - [authTips](#authtips) - 权限提示文本

## 权限检查与请求

### checkAndRequestPermissions

### 功能描述

通用的权限检查与请求函数，支持检查和请求多种类型的权限，包括位置、相机和相册权限。

### 参数

| 参数名          | 类型                | 必填 | 说明                                             |
| --------------- | ------------------- | ---- | ------------------------------------------------ |
| platform        | MiniProgramPlatform | 是   | 小程序平台类型                                   |
| permissionTypes | string[]            | 是   | 权限类型数组，支持 'location'、'camera'、'album' |

### 返回值

`Promise<boolean>` - 是否获得授权

### 使用示例

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

### 增强功能

该函数是一个通用的权限检查与请求函数，支持多种权限类型。它会根据传入的权限类型数组，检查并请求相应的权限。函数返回一个Promise，解析为一个布尔值，表示是否获得了所有请求的权限。

### checkAndRequestLocationAuth

### 功能描述

检查并请求位置权限，支持多个小程序平台。

### 参数

| 参数名   | 类型                | 必填 | 说明           |
| -------- | ------------------- | ---- | -------------- |
| platform | MiniProgramPlatform | 是   | 小程序平台类型 |

### 返回值

`Promise<boolean>` - 是否获得位置权限

### 使用示例

```typescript
import { checkAndRequestLocationAuth } from "uni-toolkit";

// 检查位置权限
async function checkLocationPermission() {
  try {
    const hasPermission = await checkAndRequestLocationAuth("mp-weixin");
    if (hasPermission) {
      console.log("已获得位置权限，可以使用位置相关功能");
      // 执行需要位置权限的操作
    } else {
      console.log("未获得位置权限，无法使用位置相关功能");
      // 提示用户或提供替代方案
    }
  } catch (error) {
    console.error("检查位置权限时出错:", error);
  }
}
```

### 增强功能

该函数专门用于检查和请求位置权限，是`checkAndRequestPermissions`的特化版本。它会根据不同平台采用相应的权限检查和请求策略，并在必要时向用户显示权限说明。

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
const hasPermission = await checkAndRequestImageAuth("mp-weixin", ["album", "camera"]);

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

### 功能描述

检查应用是否拥有指定权限，主要用于Android平台。

### 参数

| 参数名     | 类型   | 必填 | 说明                                                     |
| ---------- | ------ | ---- | -------------------------------------------------------- |
| permission | string | 是   | 权限名称，例如 'android.permission.ACCESS_FINE_LOCATION' |

### 返回值

`Promise<boolean>` - 是否拥有指定权限

### 使用示例

```typescript
import { checkSelfPermission } from "uni-toolkit";

async function checkLocationPermission() {
  try {
    const hasPermission = await checkSelfPermission("android.permission.ACCESS_FINE_LOCATION");
    if (hasPermission) {
      console.log("应用已获得位置权限");
      // 执行需要位置权限的操作
    } else {
      console.log("应用未获得位置权限");
      // 请求权限或提供替代方案
    }
  } catch (error) {
    console.error("检查权限时出错:", error);
  }
}
```

### 增强功能

该函数封装了Android平台的权限检查逻辑，使用了原生API进行权限状态的检查。它返回一个Promise，解析为一个布尔值，表示应用是否拥有指定的权限。

### shouldShowRequestPermissionRationale

### 功能描述

判断是否应该向用户显示权限请求的解释说明，主要用于Android平台。

### 参数

| 参数名     | 类型   | 必填 | 说明                                                     |
| ---------- | ------ | ---- | -------------------------------------------------------- |
| permission | string | 是   | 权限名称，例如 'android.permission.ACCESS_FINE_LOCATION' |

### 返回值

`Promise<boolean>` - 是否应该显示权限请求的解释说明

### 使用示例

```typescript
import { shouldShowRequestPermissionRationale } from "uni-toolkit";

async function checkPermissionRationale() {
  const shouldShow = await shouldShowRequestPermissionRationale("android.permission.ACCESS_FINE_LOCATION");
  if (shouldShow) {
    // 向用户显示权限请求的解释说明
    uni.showModal({
      title: "需要位置权限",
      content: "我们需要位置权限来提供基于位置的服务",
      success: (res) => {
        if (res.confirm) {
          // 用户确认后请求权限
          requestLocationPermission();
        }
      }
    });
  } else {
    // 直接请求权限
    requestLocationPermission();
  }
}

function requestLocationPermission() {
  // 请求位置权限的代码
}
```

### 增强功能

该函数封装了Android平台的权限解释逻辑，用于判断是否应该向用户显示权限请求的解释说明。当用户之前拒绝过权限请求，但没有选择"不再询问"时，返回`true`，表示应该向用户解释为什么需要该权限。

## 用户引导与提示

### showAuthTip

### 功能描述

显示权限提示对话框，引导用户授予权限。

### 参数

| 参数名  | 类型   | 必填 | 说明       |
| ------- | ------ | ---- | ---------- |
| title   | string | 是   | 对话框标题 |
| content | string | 是   | 对话框内容 |

### 返回值

`Promise<boolean>` - 用户是否点击了确认按钮

### 使用示例

```typescript
import { showAuthTip } from "uni-toolkit";

async function requestLocationPermission() {
  const confirmed = await showAuthTip(
    "需要位置权限",
    "为了提供基于位置的服务，我们需要获取您的位置信息"
  );

  if (confirmed) {
    // 用户点击了确认按钮，继续请求权限
    console.log("用户同意授权，继续请求权限");
    // 执行权限请求逻辑
  } else {
    // 用户点击了取消按钮
    console.log("用户拒绝授权");
  }
}
```

### 增强功能

该函数封装了显示权限提示对话框的逻辑，使用uni.showModal实现跨平台的对话框展示。它返回一个Promise，解析为一个布尔值，表示用户是否点击了确认按钮。

### showManualAuth

### 功能描述

引导用户手动授权，通常在自动授权失败后使用。

### 参数

| 参数名   | 类型                | 必填 | 说明           |
| -------- | ------------------- | ---- | -------------- |
| platform | MiniProgramPlatform | 是   | 小程序平台类型 |
| authType | AuthType            | 是   | 权限类型       |

### 返回值

`Promise<void>` - 无返回值

### 使用示例

```typescript
import { showManualAuth } from "uni-toolkit";

async function requestLocationPermission() {
  try {
    // 尝试自动请求位置权限
    const hasPermission = await checkAndRequestLocationAuth("mp-weixin");

    if (!hasPermission) {
      // 自动授权失败，引导用户手动授权
      await showManualAuth("mp-weixin", "location");
      console.log("已引导用户手动授权");
    }
  } catch (error) {
    console.error("权限请求出错:", error);
  }
}
```

### 增强功能

该函数封装了引导用户手动授权的逻辑，会根据不同平台和权限类型，显示相应的引导提示，并在用户确认后跳转到系统设置页面。

## 通用工具

### cloneDeep

### 功能描述

深拷贝对象，创建一个与原对象结构和值相同但完全独立的新对象。

### 参数

| 参数名 | 类型 | 必填 | 说明   |
| ------ | ---- | ---- | ------ |
| obj    | any  | 是   | 源对象 |

### 返回值

`any` - 深拷贝后的对象

### 使用示例

```typescript
import { cloneDeep } from "uni-toolkit";

const originalObj = {
  name: "张三",
  age: 25,
  address: {
    city: "北京",
    district: "朝阳区"
  },
  hobbies: ["读书", "游泳"]
};

// 创建深拷贝
const clonedObj = cloneDeep(originalObj);

// 修改克隆对象不会影响原对象
clonedObj.name = "李四";
clonedObj.address.city = "上海";
clonedObj.hobbies.push("旅行");

console.log(originalObj.name); // 输出: "张三"
console.log(originalObj.address.city); // 输出: "北京"
console.log(originalObj.hobbies); // 输出: ["读书", "游泳"]
```

### 增强功能

该函数实现了对象的深拷贝，可以正确处理嵌套对象、数组、日期对象等复杂数据结构，避免了使用JSON.parse(JSON.stringify())方法可能带来的问题（如无法处理循环引用、函数、undefined等）。

### getCurrentPageRoute

### 功能描述

获取当前页面的路由信息。

### 参数

无

### 返回值

`string` - 当前页面的路由路径

### 使用示例

```typescript
import { getCurrentPageRoute } from "uni-toolkit";

// 获取当前页面路由
const currentRoute = getCurrentPageRoute();
console.log("当前页面路由:", currentRoute); // 例如: "/pages/index/index"

// 根据路由执行不同逻辑
if (currentRoute === "/pages/index/index") {
  console.log("当前在首页");
} else if (currentRoute === "/pages/user/profile") {
  console.log("当前在用户资料页");
}
```

### 增强功能

该函数封装了获取当前页面路由的逻辑，适用于所有uni-app支持的平台。它可以帮助开发者根据当前页面路径执行不同的业务逻辑。

### isPageLevelComponent

### 功能描述

判断当前组件是否为页面级组件。

### 参数

无

### 返回值

`boolean` - 是否为页面级组件

### 使用示例

```typescript
import { isPageLevelComponent } from "uni-toolkit";

// 在组件内部判断是否为页面级组件
const isPage = isPageLevelComponent();
if (isPage) {
  console.log("当前组件是页面级组件");
  // 执行页面级组件特有的逻辑
} else {
  console.log("当前组件是普通组件");
  // 执行普通组件的逻辑
}
```

### 增强功能

该函数通过检查当前组件实例的特性来判断它是否为页面级组件。在uni-app中，页面级组件和普通组件有不同的生命周期和特性，使用此函数可以帮助开发者编写适应不同组件类型的代码。

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
