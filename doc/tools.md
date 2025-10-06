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
- [类型定义与常量](#类型定义与常量)
  - [MiniProgramPlatform](#miniprogramplatform)
  - [AuthType](#authtype)
  - [authTips](#authtips)

## 权限检查与请求

### checkAndRequestLocationAuth

**功能：** 检查并请求小程序位置权限

#### 参数

| 参数     | 类型                | 必填 | 说明           |
| -------- | ------------------- | ---- | -------------- |
| platform | MiniProgramPlatform | 是   | 小程序平台类型 |

#### 返回值

`Promise<boolean>` - 是否获得授权

#### 使用示例

```typescript
import { checkAndRequestLocationAuth } from "uni-toolkit";

// 检查微信小程序位置权限
checkAndRequestLocationAuth("mp-weixin").then((granted) => {
  if (granted) {
    // 已获得权限，可以调用位置相关API
    console.log("位置权限已获得");
  } else {
    // 未获得权限，需要处理
    console.log("位置权限未获得");
  }
});
```

#### 说明

该函数用于检查并请求小程序平台的位置权限。它会先检查当前是否已经获得了位置权限，如果没有，则会尝试向用户请求权限。函数返回一个Promise，解析为一个布尔值，表示是否获得了权限。

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
