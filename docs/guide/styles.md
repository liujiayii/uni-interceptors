# 样式指南

uni-toolkit 提供了一套样式解决方案，主要用于 nvue 页面的样式处理。

## 样式文件结构

样式文件位于 `src/style` 目录下，构建时会自动复制到 `dist/style` 目录：

```text
src/style/
└── nvue.scss    # nvue 页面通用样式
```

## nvue.scss 样式说明

`nvue.scss` 文件包含了一系列针对 nvue 页面的样式重置和基础设置，确保在不同平台上的一致性表现。

### 主要样式规则

1. **Flex 布局设置**
   - 为 `label`、`scroll-view`、`swiper-item`、`view` 等元素设置了统一的 flex 布局
   - 区分 H5 和非 H5 平台的 display 属性设置

2. **定位和盒模型**
   - 为常见元素设置相对定位和边框样式
   - 统一盒模型为 `border-box`

3. **平台特定处理**
   - 针对快手小程序的 `swiper-item` 元素特殊处理
   - 重置按钮的默认边距

### 使用方式

样式文件会在构建时自动复制到 `dist/style` 目录，您可以在 nvue 文件中通过以下方式引入：

```vue
<style>
@import "./nvue.scss";
/* 或者 */
@import "@/style/nvue.scss";
</style>
```

## 构建和样式复制

### 自动复制

当您使用完整构建命令时，样式文件会自动复制：

```bash
# 完整构建（包含样式复制）
pnpm run build:full

# 或者使用脚本
node scripts/build.js
```

### 单独复制样式

如果您只需要更新样式文件，可以使用单独的复制命令：

```bash
# 仅复制样式文件
pnpm run copy:styles
```

## 自定义样式

您可以在 `src/style` 目录下添加自己的样式文件，这些文件在构建时也会被自动复制到 `dist/style` 目录。

### 添加新样式文件

1. 在 `src/style` 目录下创建新的样式文件，例如 `custom.scss`
2. 在您的 nvue 文件中引入该样式文件
3. 运行构建命令，样式文件会被自动复制

### 示例

```scss
// src/style/custom.scss
.custom-container {
  flex-direction: row;
  padding: 20rpx;
}

.custom-button {
  background-color: #007aff;
  color: white;
  border-radius: 10rpx;
}
```

```vue
<!-- 在 nvue 文件中引入 -->
<style>
@import "./style/custom.scss";
</style>
```

## 注意事项

1. **nvue 样式限制**：nvue 页面的样式支持有限，请参考 [uni-app nvue 样式文档](https://uniapp.dcloud.io/tutorial/nvue-outline#样式)

2. **平台差异**：样式文件中已经处理了大部分平台差异，但在添加新样式时仍需注意不同平台的兼容性

3. **样式优先级**：引入样式文件的顺序会影响样式的优先级，后引入的样式会覆盖先引入的相同选择器样式

4. **性能考虑**：避免在样式中使用过于复杂的选择器和属性，以免影响 nvue 页面的渲染性能
