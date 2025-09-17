import type { Plugin } from "vue";
import { AuthType } from "./_constant";
import { showAuthTip, showManualAuth } from "./_utils";

const makePhoneCall: UniNamespace.InterceptorOptions = {
  async invoke(args) {
    // #ifdef APP-PLUS
    const result = await showAuthTip(AuthType.PHONE);
    // 用户拒绝授权
    if (!result)
      return false;
    // #endif

    // #ifdef MP || WEB
    // 小程序平台通常会在调用时自动申请权限，但可以添加提示
    console.log("即将拨打电话:", args.phoneNumber);
    // #endif
  },
  success() {
    // 空实现，保持接口完整性
  },
  fail(error) {
    // #ifdef APP-PLUS
    showManualAuth(AuthType.PHONE);
    // #endif

    // #ifdef MP || WEB
    // 小程序平台处理
    console.error("拨打电话失败:", error);
    // #endif
  },
};

export const makePhoneCallInterceptor: Plugin = {
  install() {
    uni.addInterceptor("makePhoneCall", makePhoneCall);
  },
};

export function applyMakePhoneCallInterceptor(): void {
  makePhoneCallInterceptor.install?.(null as any);
}
