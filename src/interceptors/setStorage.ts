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
export const StorageInterceptor: Plugin = {
  install() {
    uni.addInterceptor("setStorage", storageInterceptor);
  },
};

/**
 * 直接应用快手小程序setStorage代理修复拦截器
 * 可以作为 Vue 插件使用: Vue.use(StorageInterceptor)
 * 也可以直接调用: applyStorageInterceptor()
 */
export function applyStorageInterceptor(): void {
  StorageInterceptor.install?.(null as any);
}
