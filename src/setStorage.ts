const storageInvokeInterceptor: UniNamespace.InterceptorOptions = {
  invoke(args: { data: any }) {
    // #ifdef MP-KUAISHOU
    // 解决快手小程序setStorage不支持proxy对象的问题
    // 相关链接: https://github.com/dcloudio/uni-app/issues/4182
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
export const KuaiShouSetStorageProxyFixInterceptor = {
  install() {
    uni.addInterceptor("setStorage", storageInvokeInterceptor);
  },
};

/**
 * 直接应用快手小程序setStorage代理修复拦截器
 * 可以作为 Vue 插件使用: Vue.use(KuaiShouSetStorageProxyFixInterceptor)
 * 也可以直接调用: applyKuaiShouSetStorageProxyFixInterceptor()
 */
export function applyKuaiShouSetStorageProxyFixInterceptor(): void {
  KuaiShouSetStorageProxyFixInterceptor.install();
}