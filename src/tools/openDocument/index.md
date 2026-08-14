# openDocument

`openDocumentByUrl` 下载并打开在线文档，全程带 loading 与失败提示。

## 功能描述

把「下载 → 打开」两步 uni API 串成一个 Promise，并统一处理三类失败：地址为空、下载失败、打开失败。
提示文案可覆盖，传空字符串即关闭对应提示。

## 函数签名

```typescript
function openDocumentByUrl(
  url: string,
  options?: OpenDocumentOptions,
): Promise<string>;
```

### 参数

| 参数    | 类型                  | 必填 | 说明     |
| ------- | --------------------- | ---- | -------- |
| url     | string                | 是   | 文档地址 |
| options | `OpenDocumentOptions` | 否   | 配置项   |

### OpenDocumentOptions

| 参数     | 类型                   | 必填 | 默认值 | 说明                     |
| -------- | ---------------------- | ---- | ------ | ------------------------ |
| messages | `OpenDocumentMessages` | 否   | 见下   | 覆盖提示文案             |
| showMenu | boolean                | 否   | true   | 打开后是否显示右上角菜单 |

### OpenDocumentMessages

| 字段           | 默认值         | 说明                  |
| -------------- | -------------- | --------------------- |
| emptyUrl       | 文档地址不存在 | 地址为空时的提示      |
| loading        | 文档加载中...  | 下载中的 loading 文案 |
| downloadFailed | 文档下载失败   | 下载失败的提示        |
| openFailed     | 文档打开失败   | 打开失败的提示        |

### 返回值

`Promise<string>`，成功时 resolve 下载到本地的临时文件路径；上述三类失败均 reject。

## 使用方法

```typescript
import { openDocumentByUrl } from "uni-toolkit/tools";

try {
  const filePath = await openDocumentByUrl("https://example.com/contract.pdf");
  console.log("已打开", filePath);
} catch (error) {
  console.warn("打开文档失败", error);
}
```

自定义文案（例如做多语言）：

```typescript
await openDocumentByUrl(url, {
  messages: {
    loading: "Loading...",
    downloadFailed: "Download failed",
    openFailed: "Cannot open this file",
  },
});
```

关掉 loading 只保留失败提示：

```typescript
await openDocumentByUrl(url, { messages: { loading: "" } });
```

## 注意事项

- 各端对可打开的文档格式支持不同，PDF 兼容性最好；doc / xls 等在部分端会打开失败
- 下载走的是 `uni.downloadFile`，小程序端需要把域名加入下载白名单
- 失败时内部已 `hideLoading` 并提示，调用方只需处理业务分支，但仍建议 catch 以免未处理拒绝
