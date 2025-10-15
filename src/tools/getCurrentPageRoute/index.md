# getCurrentPageRoute

`getCurrentPageRoute` 是一个获取当前页面路由路径的工具函数，适用于 uni-app 应用。

## 功能描述

该函数通过 uni-app 的 `getCurrentPages()` API 获取当前页面栈，并返回顶部页面的路由路径。如果获取失败，则返回空字符串。

## 函数签名

```typescript
function getCurrentPageRoute(): string;
```

### 返回值

返回当前页面的路由路径字符串，如果获取失败则返回空字符串。

## 使用方法

```typescript
import { getCurrentPageRoute } from "@uni-toolkit/tools";

// 获取当前页面路由
const route = getCurrentPageRoute();
console.log("当前页面路由:", route);

// 示例输出: "pages/index/index" 或 "pages/user/profile"
```

## 实际应用场景

### 1. 页面访问统计

```typescript
// 在页面 onShow 生命周期中记录页面访问
export default {
  onShow() {
    const route = getCurrentPageRoute();
    if (route) {
      // 上报页面访问统计
      analytics.track("page_view", { page: route });
    }
  }
};
```

### 2. 动态权限控制

```typescript
// 根据当前路由判断是否需要特殊权限
function checkPagePermission() {
  const route = getCurrentPageRoute();

  // 需要登录的页面列表
  const authRequiredPages = [
    "pages/user/profile",
    "pages/order/list",
    "pages/wallet/index"
  ];

  if (authRequiredPages.includes(route)) {
    // 检查用户是否已登录
    if (!isLoggedIn()) {
      uni.redirectTo({
        url: "/pages/login/index"
      });
      return false;
    }
  }

  return true;
}
```

### 3. 条件性功能展示

```typescript
// 根据当前页面显示不同的功能按钮
export default {
  computed: {
    showShareButton() {
      const route = getCurrentPageRoute();
      // 只有详情页显示分享按钮
      return route && route.includes("/detail/");
    },

    isHomePage() {
      const route = getCurrentPageRoute();
      return route === "pages/index/index";
    }
  }
};
```

### 4. 面包屑导航

```typescript
// 生成面包屑导航
function generateBreadcrumb() {
  const route = getCurrentPageRoute();
  if (!route)
    return [];

  const routeMap = {
    "pages/index/index": { title: "首页", url: "/pages/index/index" },
    "pages/category/list": { title: "分类", url: "/pages/category/list" },
    "pages/product/detail": { title: "商品详情", url: "" },
    "pages/cart/index": { title: "购物车", url: "/pages/cart/index" },
    "pages/user/profile": { title: "个人中心", url: "/pages/user/profile" }
  };

  const breadcrumb = [];
  const routeParts = route.split("/");

  // 构建面包屑路径
  let currentPath = "";
  for (const part of routeParts) {
    if (part) {
      currentPath += `/${part}`;
      const pageKey = currentPath.substring(1); // 去掉开头的 '/'
      if (routeMap[pageKey]) {
        breadcrumb.push(routeMap[pageKey]);
      }
    }
  }

  return breadcrumb;
}
```

### 5. 页面切换动画

```typescript
// 根据页面路径应用不同的切换动画
function getPageTransition() {
  const route = getCurrentPageRoute();

  // 特殊页面使用特殊动画
  if (route && route.includes("popup")) {
    return "slide-bottom";
  }

  // 默认动画
  return "slide-right";
}

// 在页面配置中使用
export default {
  onShow() {
    const animation = getPageTransition();
    // 应用动画效果
    this.applyAnimation(animation);
  }
};
```

## 平台兼容性

| 平台           | 支持情况 | 说明             |
| -------------- | -------- | ---------------- |
| H5             | ✅ 支持  | 正常获取页面路由 |
| App            | ✅ 支持  | 正常获取页面路由 |
| 微信小程序     | ✅ 支持  | 正常获取页面路由 |
| 支付宝小程序   | ✅ 支持  | 正常获取页面路由 |
| 百度小程序     | ✅ 支持  | 正常获取页面路由 |
| 字节跳动小程序 | ✅ 支持  | 正常获取页面路由 |

## 注意事项

1. **错误处理**: 函数内部已包含错误处理，异常情况下会返回空字符串
2. **页面栈**: 依赖于 uni-app 的 `getCurrentPages()` API，确保在正确的上下文中调用
3. **路由格式**: 返回的路由格式不包含前导斜杠，如 "pages/index/index" 而非 "/pages/index/index"
4. **TabBar页面**: 对于 TabBar 页面，同样可以正常获取路由

## 与其他路由相关工具的区别

| 工具函数            | 用途                 | 返回值                     |
| ------------------- | -------------------- | -------------------------- |
| getCurrentPageRoute | 获取当前页面路由路径 | 字符串                     |
| getCurrentPages     | uni-app 原生 API     | 页面实例数组               |
| $route              | Vue Router 路由对象  | 包含路径、参数等信息的对象 |

## 最佳实践

1. **空值检查**: 使用返回值前先检查是否为空字符串
2. **路由比较**: 比较路由时注意格式一致性（是否包含前导斜杠）
3. **性能考虑**: 避免在频繁调用的地方（如滚动事件）中使用此函数

```typescript
// 推荐用法
const route = getCurrentPageRoute();
if (route) {
  // 处理路由逻辑
}

// 避免在性能敏感场景中频繁调用
function onScroll() {
  // 不推荐：每次滚动都获取路由
  // const route = getCurrentPageRoute();

  // 推荐：在组件初始化时获取一次并缓存
  if (!this.cachedRoute) {
    this.cachedRoute = getCurrentPageRoute();
  }
}
```
