# 环境检测文档

本文档详细介绍了 uni-toolkit 中提供的环境检测功能。

## 目录

- [isMpWeiXinWork](#ismpweixinwork)

## isMpWeiXinWork

**功能：** 检测当前环境是否为微信小程序企业版

**类型：** `boolean`

### 使用示例

```javascript
import { isMpWeiXinWork } from "uni-toolkit";

if (isMpWeiXinWork) {
  // 在微信小程序企业版中的特殊处理
  console.log("当前运行在微信小程序企业版");
}
```

### 说明

该变量是一个布尔值，用于判断当前运行环境是否为微信小程序企业版。在微信小程序企业版中，可能需要一些特殊的处理逻辑，例如：

- 企业微信特有的API调用
- 企业微信特有的权限处理
- 企业微信特有的UI展示

通过使用该变量，您可以针对微信小程序企业版环境编写特定的代码逻辑，提高应用的兼容性和用户体验。
