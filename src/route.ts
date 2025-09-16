/**
 * 路由拦截，通常也是登录拦截
 * 可以设置路由白名单，或者黑名单，看业务需要选哪一个
 * 我这里应为大部分都可以随便进入，所以使用黑名单
 */

import type { Plugin } from "vue";

export type RouteInterceptorOptions = {
  /**
   * 登录页面路径
   */
  loginRoute: string;

  /**
   * 需要登录的页面路径列表
   */
  needLoginPages: string[];

  /**
   * 判断是否已登录的函数
   */
  isLogged: () => boolean;
};

// 默认配置
const defaultOptions: RouteInterceptorOptions = {
  loginRoute: "/pages/login/login",
  needLoginPages: [],
  isLogged: () => false,
};

let currentOptions: RouteInterceptorOptions = { ...defaultOptions };

function goLogin(redirect: string = ""): void {
  // 确保 URL 格式正确
  const separator = currentOptions.loginRoute.includes("?") ? "&" : "?";
  const url = redirect
    ? `${currentOptions.loginRoute}${separator}redirect=${encodeURIComponent(redirect)}`
    : currentOptions.loginRoute;

  uni.navigateTo({ url });
}

// 黑名单登录拦截器 - （适用于大部分页面不需要登录，少部分页面需要登录）
const navigateToInterceptor: UniNamespace.InterceptorOptions = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  invoke({ url }: { url: string }) {
    // console.log(url) // /pages/route-interceptor/index?name=feige&age=30
    const path = url.split("?")[0];
    // 放行登录页自身
    const loginPath = currentOptions.loginRoute.split("?")[0];
    if (path === loginPath)
      return true;
    const isNeedLogin = currentOptions.needLoginPages.includes(path);
    if (!isNeedLogin) {
      return true;
    }
    const hasLogin = currentOptions.isLogged();
    if (hasLogin) {
      return true;
    }
    goLogin(url);
    return false;
  },
};

export const RouteInterceptor: Plugin = {
  install(_app, options: RouteInterceptorOptions) {
    // 合并配置
    currentOptions = { ...defaultOptions, ...options };

    uni.addInterceptor("navigateTo", navigateToInterceptor);
    uni.addInterceptor("reLaunch", navigateToInterceptor);
    uni.addInterceptor("redirectTo", navigateToInterceptor);
    uni.addInterceptor("switchTab", navigateToInterceptor);
  },
};

/**
 * 直接应用路由拦截器
 * 可以作为 Vue 插件使用: Vue.use(RouteInterceptor, options)
 * 也可以直接调用: applyRouteInterceptor(options)
 */
export function applyRouteInterceptor(options: RouteInterceptorOptions): void {
  RouteInterceptor.install?.(null as any, options);
}
