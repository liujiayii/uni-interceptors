import type { Plugin } from "vue";

const storageInterceptor: UniNamespace.InterceptorOptions = {
  invoke(args: { data: any }) {
    // #ifdef MP-KUAISHOU
    args.data = JSON.parse(JSON.stringify(args.data));
    // #endif
  },
  success() {
    // 空实现，保持接口完整性
  },
  fail() {
    // 空实现，保持接口完整性
  },
};

/**
 * 快手小程序setStorage代理修复拦截器
 * 解决快手小程序setStorage不支持proxy对象的问题
 * - 相关链接: https://github.com/dcloudio/uni-app/issues/4182
 */
export const setStorageInterceptor: Plugin = {
  install() {
    uni.addInterceptor("setStorage", storageInterceptor);
  },
};
