# isPageLevelComponent

`isPageLevelComponent` 是一个用于判断当前组件是否为页面级别组件的工具函数。

## 功能描述

该函数通过检查当前组件实例的 `renderer` 属性来判断组件是否为页面级别组件。在 uni-app 中，页面级别的组件具有特殊的渲染上下文，与普通组件有所区别。

## 函数签名

```typescript
function isPageLevelComponent(): boolean;
```

### 返回值

返回一个布尔值，表示当前组件是否是页面级别组件：

- `true`: 当前组件是页面级别组件
- `false`: 当前组件不是页面级别组件或判断失败

## 使用方法

```typescript
import { isPageLevelComponent } from "uni-toolkit/tools";

// 在组件中使用
export default {
  created() {
    if (isPageLevelComponent()) {
      console.log("这是一个页面级别组件");
      // 执行页面级别组件特有的逻辑
    } else {
      console.log("这是一个普通组件");
      // 执行普通组件的逻辑
    }
  }
};
```

## 实际应用场景

### 1. 条件性生命周期处理

```typescript
// 根据组件类型执行不同的初始化逻辑
export default {
  created() {
    // 通用初始化逻辑
    this.initCommonFeatures();

    // 页面级别组件特有的初始化
    if (isPageLevelComponent()) {
      this.initPageFeatures();
      this.setupPageNavigation();
      this.loadPageData();
    }
  },

  methods: {
    initPageFeatures() {
      // 设置页面标题
      uni.setNavigationBarTitle({
        title: this.pageTitle || "默认标题"
      });

      // 设置页面背景色
      uni.setBackgroundColor({
        backgroundColor: this.pageBackgroundColor || "#ffffff"
      });
    },

    setupPageNavigation() {
      // 页面级别的导航设置
      if (this.hideBackButton) {
        uni.hideHomeButton();
      }
    },

    loadPageData() {
      // 加载页面数据
      this.fetchPageData().then((data) => {
        this.pageData = data;
      });
    }
  }
};
```

### 2. 条件性权限检查

```typescript
// 根据组件类型应用不同的权限策略
export default {
  beforeMount() {
    if (isPageLevelComponent()) {
      // 页面级别的权限检查
      this.checkPagePermissions();
    } else {
      // 组件级别的权限检查
      this.checkComponentPermissions();
    }
  },

  methods: {
    checkPagePermissions() {
      // 检查用户是否有访问此页面的权限
      const requiredPermissions = this.requiredPagePermissions;
      if (requiredPermissions && requiredPermissions.length > 0) {
        if (!this.hasPermissions(requiredPermissions)) {
          // 无权限时重定向到错误页面或登录页
          uni.redirectTo({
            url: "/pages/error/403"
          });
        }
      }
    },

    checkComponentPermissions() {
      // 检查组件级别的权限，可能只是隐藏某些功能
      if (!this.hasPermissions(this.requiredComponentPermissions)) {
        this.hideRestrictedFeatures();
      }
    }
  }
};
```

### 3. 动态样式和布局

```typescript
// 根据组件类型应用不同的样式
export default {
  computed: {
    containerClass() {
      return {
        "page-container": isPageLevelComponent(),
        "component-container": !isPageLevelComponent(),
        [this.customClass]: true
      };
    },

    containerStyle() {
      if (isPageLevelComponent()) {
        return {
          minHeight: "100vh",
          backgroundColor: this.pageBackgroundColor || "#f5f5f5"
        };
      }

      return {
        backgroundColor: this.componentBackgroundColor || "transparent"
      };
    }
  }
};
```

### 4. 全局事件监听

```typescript
// 只在页面级别组件中监听全局事件
export default {
  mounted() {
    if (isPageLevelComponent()) {
      // 监听全局事件，如网络状态变化、应用前后台切换等
      uni.onNetworkStatusChange(this.handleNetworkChange);
      uni.onAppShow(this.handleAppShow);
      uni.onAppHide(this.handleAppHide);
    }
  },

  beforeUnmount() {
    if (isPageLevelComponent()) {
      // 页面卸载时移除全局事件监听
      uni.offNetworkStatusChange(this.handleNetworkChange);
      uni.offAppShow(this.handleAppShow);
      uni.offAppHide(this.handleAppHide);
    }
  },

  methods: {
    handleNetworkChange(res) {
      this.networkStatus = res.isConnected;
      if (!res.isConnected) {
        this.showNetworkError();
      }
    },

    handleAppShow() {
      // 应用从后台回到前台时刷新数据
      this.refreshData();
    },

    handleAppHide() {
      // 应用进入后台时保存状态
      this.saveState();
    }
  }
};
```

### 5. 分享功能配置

```typescript
// 只在页面级别组件中配置分享功能
export default {
  onShareAppMessage() {
    if (isPageLevelComponent()) {
      return {
        title: this.shareTitle || "默认分享标题",
        path: this.getCurrentPagePath(),
        imageUrl: this.shareImageUrl || ""
      };
    }
    return null;
  },

  methods: {
    getCurrentPagePath() {
      // 获取当前页面路径用于分享
      const pages = getCurrentPages();
      if (pages && pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        return `/${currentPage.route}`;
      }
      return "";
    }
  }
};
```

## 平台兼容性

| 平台           | 支持情况    | 说明                 |
| -------------- | ----------- | -------------------- |
| H5             | ⚠️ 部分支持 | 可能不稳定，建议测试 |
| App            | ⚠️ 部分支持 | 可能不稳定，建议测试 |
| 微信小程序     | ✅ 支持     | 正常工作             |
| 支付宝小程序   | ✅ 支持     | 正常工作             |
| 百度小程序     | ✅ 支持     | 正常工作             |
| 字节跳动小程序 | ✅ 支持     | 正常工作             |

## 注意事项

1. **APP环境警告**: 在APP环境中此函数可能不稳定，官方文档特别标注"在APP环境不确定是否正常，慎用！！！"
2. **调用时机**: 确保在组件实例创建后调用（如在 `created` 或之后的生命周期钩子中）
3. **错误处理**: 函数内部已包含错误处理，异常情况下会返回 `false`
4. **Vue版本兼容性**: 依赖于 Vue 3 的 `getCurrentInstance` API

## 替代方案

由于在APP环境中可能不稳定，可以考虑以下替代方案：

### 1. 使用页面路径判断

```typescript
import { getCurrentPageRoute } from "uni-toolkit/tools";

function isPageByRoute() {
  const route = getCurrentPageRoute();
  // 页面路径通常以 "pages/" 开头
  return route && route.startsWith("pages/");
}
```

### 2. 通过组件props传递

```vue
// 在页面组件中明确标识
export default {
  props: {
    isPage: {
      type: Boolean,
      default: false
    }
  }
};

// 使用时
// 页面组件
<template>
  <child-component is-page />
</template>
```

### 3. 使用provide/inject

```typescript
// 在页面组件中provide
export default {
  provide() {
    return {
      isPageLevel: true
    };
  }
};

// 在子组件中inject
export default {
  inject: ["isPageLevel"],

  created() {
    if (this.isPageLevel) {
      // 页面级别逻辑
    }
  }
};
```

## 最佳实践

1. **谨慎使用**: 特别是在APP环境中，考虑使用替代方案
2. **组合使用**: 可以与其他判断方式结合使用，提高准确性
3. **测试验证**: 在目标平台上充分测试，确保行为符合预期
4. **降级处理**: 提供降级方案，当判断失败时仍能正常工作

```typescript
// 示例：组合使用多种判断方式
function isPageLevelComponentReliable() {
  // 首先尝试使用isPageLevelComponent
  if (isPageLevelComponent()) {
    return true;
  }

  // 降级方案：使用路由判断
  const route = getCurrentPageRoute();
  return route && route.startsWith("pages/");
}

// 在组件中使用
export default {
  created() {
    if (isPageLevelComponentReliable()) {
      this.initPageFeatures();
    }
  }
};
```
