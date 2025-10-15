# setStorage 拦截器

`setStorage` 拦截器用于处理快手小程序的存储数据兼容性问题，解决快手小程序不支持 proxy 对象的问题。

## 功能描述

该拦截器主要用于解决快手小程序 `setStorage` API 不支持 proxy 对象的问题。通过深拷贝数据，确保数据能够正确存储。支持以下功能：

- 自动检测并转换 proxy 对象
- 确保数据在快手小程序中正确存储
- 保持与其他平台的兼容性

## 平台支持

| 平台        | 支持情况 | 备注                   |
| ----------- | -------- | ---------------------- |
| APP-PLUS    | ✅ 支持  | 全平台支持             |
| MP-KUAISHOU | ✅ 支持  | 快手小程序特殊处理     |
| MP          | ✅ 支持  | 其他小程序平台         |
| H5          | ✅ 支持  | 浏览器环境下的存储操作 |

## 使用方法

```typescript
import { setStorageInterceptor } from "@uni-toolkit/interceptors";

// 在应用入口处安装拦截器
app.use(setStorageInterceptor);

// 正常调用uni.setStorage，拦截器会自动处理数据转换
uni.setStorage({
  key: "userInfo",
  data: {
    name: "张三",
    age: 25
  },
  success: () => {
    console.log("存储成功");
  },
  fail: (err) => {
    console.error("存储失败", err);
  }
});
```

## 特殊处理

### 快手小程序

在快手小程序中，拦截器会对存储的数据进行以下处理：

1. 使用 `JSON.parse(JSON.stringify(args.data))` 对数据进行深拷贝
2. 移除 proxy 对象的特性，转换为普通对象
3. 确保数据能够正确存储到本地存储中

### 其他平台

在其他平台中，拦截器会保持原有行为，不做特殊处理。

## 注意事项

- 拦截器仅在快手小程序中进行特殊处理
- 深拷贝操作可能会影响性能，对于大型数据对象需要谨慎使用
- 该拦截器解决了 [uni-app issue #4182](https://github.com/dcloudio/uni-app/issues/4182) 中提到的问题
- 拦截器会自动处理数据转换，开发者无需额外编写代码
- 如果数据中包含不支持 JSON 序列化的内容（如函数、Symbol 等），可能会导致转换失败
