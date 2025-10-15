# cloneDeep

`cloneDeep` 是一个深拷贝工具函数，用于创建对象的深拷贝副本。

## 功能描述

该函数使用 JSON 序列化和反序列化实现对象的深拷贝，适用于简单对象的复制。特别针对小程序环境进行了优化，避免了对 Blob 对象的克隆，因为 Blob 在小程序中无法使用。

## 函数签名

```typescript
function cloneDeep<T>(obj: T): T;
```

### 参数

| 参数 | 类型 | 必填 | 说明         |
| ---- | ---- | ---- | ------------ |
| obj  | T    | 是   | 待克隆的对象 |

### 返回值

返回输入对象的深拷贝副本，类型与输入对象相同。

## 使用方法

```typescript
import { cloneDeep } from "uni-toolkit/tools";

// 简单对象深拷贝
const originalObj = {
  name: "张三",
  age: 25,
  address: {
    city: "北京",
    district: "朝阳区"
  }
};

const clonedObj = cloneDeep(originalObj);

// 修改克隆对象不会影响原对象
clonedObj.name = "李四";
clonedObj.address.city = "上海";

console.log(originalObj.name); // '张三' (原对象不受影响)
console.log(originalObj.address.city); // '北京' (原对象不受影响)
console.log(clonedObj.name); // '李四'
console.log(clonedObj.address.city); // '上海'

// 数组深拷贝
const originalArray = [1, 2, { a: 3, b: [4, 5] }];
const clonedArray = cloneDeep(originalArray);

clonedArray[2].a = 30;
clonedArray[2].b[0] = 40;

console.log(originalArray[2].a); // 3 (原数组不受影响)
console.log(originalArray[2].b[0]); // 4 (原数组不受影响)
console.log(clonedArray[2].a); // 30
console.log(clonedArray[2].b[0]); // 40
```

## 限制与注意事项

### 不支持的数据类型

由于使用 JSON 序列化实现，以下数据类型不支持：

- 函数
- undefined
- Symbol
- 循环引用
- Date 对象（会被转换为字符串）
- RegExp 对象（会被转换为空对象）
- Map 和 Set（会被转换为空对象）

### 错误处理

当遇到无法序列化的对象时，函数会抛出错误：

```typescript
try {
  const objWithFunction = { a: 1, b: () => console.log("function") };
  const cloned = cloneDeep(objWithFunction);
} catch (error) {
  console.error("克隆失败:", error.message);
  // 输出: "Failed to clone object: Converting circular structure to JSON..."
}
```

### 性能考虑

- 对于大型对象，JSON 序列化可能会有性能影响
- 频繁调用可能造成性能瓶颈
- 对于简单对象，性能表现良好

## 为什么自定义实现

uni-toolkit 没有使用第三方库（如 es-toolkit）中的 `cloneDeep`，因为：

1. 第三方库对 Blob 对象进行了克隆处理，但 Blob 在小程序环境中无法使用
2. 自定义实现更轻量，减少了不必要的依赖
3. 针对实际使用场景进行了优化

## 替代方案

如果需要克隆包含不支持类型的复杂对象，可以考虑：

1. 使用专门的深拷贝库（如 lodash 的 cloneDeep）
2. 自定义实现支持特定类型的克隆逻辑
3. 对于简单场景，使用展开运算符（浅拷贝）可能足够
