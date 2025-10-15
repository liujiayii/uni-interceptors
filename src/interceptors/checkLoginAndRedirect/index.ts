/**
 * 登录检查器，如果未登录，则跳转到登录页
 */

import type { RouteInterceptorOptions } from "../route";

// 默认配置
const defaultOptions: RouteInterceptorOptions = {
  loginRoute: "/pages/login/login",
  needLoginPages: [],
  isLogged: () => false,
};

let currentOptions: RouteInterceptorOptions = { ...defaultOptions };

/**
 * 设置登录检查器的配置
 * @param options 配置选项
 */
export function setCheckLoginOptions(options: Partial<RouteInterceptorOptions>): void {
  currentOptions = { ...defaultOptions, ...options };
}

/**
 * 登录检查器，如果未登录，则跳转到登录页
 * @param redirect 重定向地址
 * @returns true 表示已登录，false 表示未登录
 */
export function checkLoginAndRedirect(redirect: string = ""): boolean {
  const hasLogin = currentOptions.isLogged();
  if (!hasLogin) {
    goLogin(redirect);
    return false;
  }
  return true;
}

function goLogin(redirect: string = ""): void {
  // 确保 URL 格式正确
  const separator = currentOptions.loginRoute.includes("?") ? "&" : "?";
  const url = redirect
    ? `${currentOptions.loginRoute}${separator}redirect=${encodeURIComponent(redirect)}`
    : currentOptions.loginRoute;

  uni.navigateTo({ url });
}
