# getSingleNodeInfo

`getSingleNodeInfo` 把 `createSelectorQuery` 的节点查询结果统一成单个节点。

## 功能描述

各端 `boundingClientRect` 回调的返回值形态不一致：有的给单个对象，有的给数组，查询失败时还可能给空值。
每个调用点都写一遍 `Array.isArray(...) ? ...[0] : ...` 既啰嗦又容易漏，这里统一归一化。

## 函数签名

```typescript
function getSingleNodeInfo(
  data: UniNamespace.NodeInfo | UniNamespace.NodeInfo[] | null | undefined,
): UniNamespace.NodeInfo | null | undefined;
```

### 参数

| 参数 | 类型                                                                    | 必填 | 说明         |
| ---- | ----------------------------------------------------------------------- | ---- | ------------ |
| data | `UniNamespace.NodeInfo \| UniNamespace.NodeInfo[] \| null \| undefined` | 是   | 节点查询结果 |

### 返回值

第一个节点信息；传入空值时原样返回空值。

## 使用方法

```typescript
import { getSingleNodeInfo } from "uni-toolkit/tools";

function getHeaderHeight(): Promise<number> {
  return new Promise((resolve) => {
    uni.createSelectorQuery()
      .select("#header")
      .boundingClientRect((data) => {
        const node = getSingleNodeInfo(data);
        resolve(node?.height ?? 0);
      })
      .exec();
  });
}
```

在组件内查询需要带上组件实例：

```typescript
import { getSingleNodeInfo, useInstance } from "uni-toolkit";

const instance = useInstance();

uni.createSelectorQuery()
  .in(instance)
  .select(".card")
  .boundingClientRect((data) => {
    const node = getSingleNodeInfo(data);
    console.log(node?.top);
  })
  .exec();
```

## 注意事项

返回值可能为空，务必用可选链取属性。查询失败的常见原因是节点未渲染完成——
在 `onReady` 之后或 `nextTick` 里再查。
