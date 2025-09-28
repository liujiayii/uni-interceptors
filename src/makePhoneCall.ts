import type { Plugin } from "vue";
import { AuthType } from "./_constant";
import {
  checkSelfPermission,
  shouldShowRequestPermissionRationale,
  showAuthTip,
  showManualAuth,
} from "./_utils";

const makePhoneCall: UniNamespace.InterceptorOptions = {
  invoke(args) {
    // #ifdef APP-PLUS
    return new Promise((resolve, reject) => {
      showAuthTip(AuthType.PHONE).then((result) => {
        if (result) {
          console.log(`授权结果1:${result}`);
          resolve(args);
        } else {
          console.log(`授权结果2:${result}`);
          // 用户拒绝授权
          reject(new Error("用户拒绝授权"));
        }
      });
    });
    // #endif
    // #ifdef MP || WEB
    // 小程序平台通常会在调用时自动申请权限，但可以考虑添加提示
    console.log(`即将拨打电话:${args.phoneNumber}`);
    return true;
    // #endif
  },
  success() {
    // #ifdef APP-PLUS
    console.log("makePhoneCall success:");
    const granted = checkSelfPermission(AuthType.PHONE);
    if (!granted) {
      const showRationale = shouldShowRequestPermissionRationale(AuthType.PHONE);

      console.log(`shouldShowRequestPermissionRationale:${showRationale}`);
      if (!showRationale) {
        showManualAuth(AuthType.PHONE);
      }
    }
    // #endif

    // #ifdef MP || WEB
    console.log("makePhoneCall success:");
    // MP/WEB 无需本地权限检查
    // #endif
  },
  fail(error) {
    console.log(`makePhoneCall error:${error}`);
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
