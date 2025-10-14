# uni-toolkit Playground

这是一个完整的示例项目，展示了 uni-toolkit 的各种功能在实际项目中的应用。通过这个项目，您可以直观地了解和体验 uni-toolkit 的各个功能模块。

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 运行项目

```bash
# 开发模式
pnpm dev

# 构建项目
pnpm build
```

### 在不同平台运行

- **H5**: 在浏览器中运行
- **微信小程序**: 使用微信开发者工具导入项目
- **App**: 使用 HBuilderX 运行到手机或模拟器

## 📱 示例页面

### 1. 主页 (pages/index/index)

主页展示了各种基础功能的快速入口，包括：

- 拨打电话功能 (makePhoneCall 拦截器)
- 剪贴板功能 (setClipboardData 拦截器)
- 存储功能 (setStorage 拦截器)
- 路由功能 (route 拦截器)
- 图片选择功能 (chooseImage 拦截器)
- 媒体选择功能 (chooseMedia 拦截器)

### 2. 图片选择示例页 (pages/choose-image/index)

这是一个专门的图片选择功能演示页面，展示了 chooseImageInterceptor 的各种使用场景：

#### 基础图片选择

- 从相册选择
- 拍照
- 相册或拍照

#### 媒体选择 (chooseMedia)

- 仅选择图片
- 仅选择视频
- 图片或视频

#### 高级选项

- 图片质量选择 (原图/压缩)
- 选择数量设置
- 使用高级选项选择

#### Hook 使用

- useChooseImage Hook 的使用示例

#### 其他功能

- 图片预览
- 图片删除
- 操作日志显示

## 🔧 技术实现

### 拦截器注册

在 `src/main.ts` 中注册了以下拦截器：

```typescript
import {
  chooseImageInterceptor,
  makePhoneCallInterceptor,
  RouteInterceptor,
  SetClipboardDataInterceptor,
  StorageInterceptor,
} from "uni-toolkit";

// 注册拦截器
app.use(RouteInterceptor, { loginRoute, isLogged, needLoginPages });
app.use(makePhoneCallInterceptor);
app.use(chooseImageInterceptor);
// 条件注册其他拦截器
// #ifdef MP-KUAISHOU
app.use(StorageInterceptor);
// #endif
// #ifdef MP-TOUTIAO
app.use(SetClipboardDataInterceptor);
// #endif
```

### 权限处理

chooseImageInterceptor 自动处理了不同平台的权限申请：

- **App 平台**: 自动申请相机和相册权限
- **小程序平台**: 处理微信小程序的权限申请
- **H5 平台**: 无需特殊权限处理

### Hook 使用

在示例页面中展示了如何使用 useChooseImage Hook：

```typescript
import { useChooseImage } from "uni-toolkit";

async function useChooseImageHook() {
  try {
    const res = await useChooseImage({
      count: count.value,
      sizeType: sizeType.value,
      sourceType: ["album", "camera"]
    });
    // 处理选择结果
    selectedImages.value = [...selectedImages.value, ...res.tempFilePaths];
  } catch (err) {
    // 处理错误
    console.error("选择图片失败", err);
  }
}
```

## 🎯 学习要点

通过这个示例项目，您可以学习到：

1. **拦截器的使用方式**：如何注册和使用各种拦截器
2. **权限处理**：如何自动处理不同平台的权限申请
3. **Hook 的应用**：如何在实际项目中使用 Hooks 简化开发
4. **平台兼容性**：如何处理不同平台的差异
5. **错误处理**：如何优雅地处理各种错误情况

## 📝 注意事项

1. 在真机上测试时，确保应用有相应的权限
2. 不同平台可能会有不同的表现，请在目标平台上充分测试
3. 某些功能（如 chooseMedia）可能不支持所有平台
4. 在生产环境中，请根据实际需求调整相关配置

## 🔗 相关文档

- [uni-toolkit 主文档](../README.md)
- [快速开始指南](../doc/getting-started.md)
- [拦截器文档](../doc/interceptors.md)
- [Hooks 文档](../doc/hooks.md)
- [工具函数文档](../doc/tools.md)
