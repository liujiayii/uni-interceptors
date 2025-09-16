const clipboardDataAuthInterceptor: UniNamespace.InterceptorOptions = {
  fail(error: any) {
    // #ifdef MP-TOUTIAO
    // 抖音小程序用户拒绝授权剪贴板权限
    if (error.errMsg && error.errMsg.includes("auth deny")) {
      uni.showModal({
        title: "授权提醒",
        content: "您未授权访问剪贴板权限，无法完成复制操作。请在设置中按需授权。",
        showCancel: true,
        confirmText: "去设置",
        cancelText: "取消",
        success(modalResult) {
          if (modalResult.confirm) {
            // 引导用户去设置页面授权
            uni.openSetting({
              success(settingResult) {
                if (settingResult.authSetting["scope.clipboard"]) {
                  uni.showToast({
                    title: "授权成功，请重新复制",
                    icon: "none",
                  });
                }
              },
            });
          }
        },
      });
    }
    // #endif
  },
};

/**
 * 处理抖音小程序剪贴板授权拦截器
 * 当用户拒绝授权时，引导用户去设置页面授权
 */
export const SetClipboardDataAuthInterceptor = {
  install() {
    uni.addInterceptor("setClipboardData", clipboardDataAuthInterceptor);
  },
};

/**
 * 直接应用剪贴板数据授权拦截器
 * 可以作为 Vue 插件使用: Vue.use(SetClipboardDataAuthInterceptor)
 * 也可以直接调用: applySetClipboardDataAuthInterceptor()
 */
export function applySetClipboardDataAuthInterceptor(): void {
  SetClipboardDataAuthInterceptor.install();
}
