const setStorageInterceptor: UniNamespace.InterceptorOptions = {
  invoke(args: { data: any }) {
    // console.log(args, "========args=======");
    // #ifdef MP-KUAISHOU
    args.data = JSON.parse(JSON.stringify(args.data));
    // #endif
  },
  success() {
    // console.log(args, "========success=======");
  },
  fail() {
    // console.log(err, "========fail=======");
  },
};
/**
 * 解决快手小程序setStorage不支持proxy对象的问题
 * - 相关链接 https://github.com/dcloudio/uni-app/issues/4182
 */
export const KuaiShouSetStorageProxyFixInterceptor = {
  install() {
    // 拦截 setStorage
    uni.addInterceptor("setStorage", setStorageInterceptor);
  },
};
