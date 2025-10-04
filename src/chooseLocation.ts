import type { Plugin } from "vue";
import {
  AuthType,
  checkAndRequestLocationAuth,
  showAuthTip,
} from "./tools";

const chooseLocation: UniNamespace.InterceptorOptions = {
  invoke(args) {
    // #ifdef APP-PLUS
    return new Promise((resolve, reject) => {
      showAuthTip(AuthType.LOCATION).then((result) => {
        if (result) {
          console.log(`位置权限授权结果:${result}`);
          resolve(args);
        } else {
          console.log(`位置权限授权结果:${result}`);
          // 用户拒绝授权
          reject(new Error("用户拒绝位置权限授权"));
        }
      });
    });
    // #endif

    // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ || MP-JD || MP-KUAISHOU
    return new Promise((resolve, reject) => {
      // 使用封装的工具函数处理微信、百度、头条、QQ小程序位置权限
      checkAndRequestLocationAuth("mp-weixin").then((granted) => {
        if (granted) {
          console.log(`位置权限授权结果:${granted}`);
          resolve(args);
        } else {
          console.log(`位置权限授权结果:${granted}`);
          reject(new Error("用户拒绝位置权限授权"));
        }
      });
    });
    // #endif

    // #ifdef MP-ALIPAY
    return new Promise((resolve, reject) => {
      // 使用封装的工具函数处理支付宝小程序位置权限
      checkAndRequestLocationAuth("mp-alipay").then((granted) => {
        if (granted) {
          console.log(`位置权限授权结果:${granted}`);
          resolve(args);
        } else {
          console.log(`位置权限授权结果:${granted}`);
          reject(new Error("用户拒绝位置权限授权"));
        }
      });
    });
    // #endif

    // #ifdef H5
    // H5端通常由浏览器处理位置权限，这里可以添加一些提示
    console.log("即将选择位置");
    return true;
    // #endif
  },
  success() {
    // #ifdef APP-PLUS
    console.log("chooseLocation success:");
    // #endif

    // #ifdef MP || H5
    console.log("chooseLocation success:");
    // MP/H5 无需本地权限检查
    // #endif
  },
  fail(error) {
    console.log(`chooseLocation error:${error}`);
  },
};

export const chooseLocationInterceptor: Plugin = {
  install() {
    uni.addInterceptor("chooseLocation", chooseLocation);
    uni.addInterceptor("getLocation", chooseLocation);
  },
};

export function applyChooseLocationInterceptor(): void {
  chooseLocationInterceptor.install?.(null as any);
}
