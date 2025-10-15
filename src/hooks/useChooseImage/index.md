# useChooseImage

封装图片选择功能，处理不同平台的兼容性问题。

## 平台支持

全平台

## 参数

| 参数       | 类型     | 必填 | 默认值                     | 说明                   |
| ---------- | -------- | ---- | -------------------------- | ---------------------- |
| count      | number   | 否   | 9                          | 最多可以选择的图片张数 |
| sizeType   | string[] | 否   | ['original', 'compressed'] | 所选的图片的尺寸       |
| sourceType | string[] | 否   | ['album', 'camera']        | 选择图片的来源         |
| extension  | string[] | 否   | []                         | 文件扩展名过滤         |

## 返回值

`Promise<UniApp.ChooseImageSuccessCallbackResult>` - 图片选择结果

## 使用示例

```typescript
import { useChooseImage } from "uni-toolkit";
import { ref } from "vue";

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

        // 实际应用示例 - 显示选择的图片
        const imgSrc = ref(res.tempFilePaths[0]);
      } catch (error) {
        console.error("选择图片失败：", error);
      }
    };

    return { chooseImage };
  }
};
```

## 特性

- 自动处理微信小程序的兼容性问题，在微信小程序中使用 `chooseMedia` 接口
- 统一不同平台的返回结果格式
- 支持文件扩展名过滤
