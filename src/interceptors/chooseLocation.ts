import type { Plugin } from "vue";
import { AuthType, checkAndRequestLocationAuth, checkSelfPermission, shouldShowRequestPermissionRationale, showAuthTip, showManualAuth } from "../tools";

const failResult = {
  errMsg: "[getLocation]:fail permission not granted",
  errCode: -1,
  authDenied: true,
};

const chooseLocation: UniNamespace.InterceptorOptions = {
  invoke(args) {
    // #ifdef APP-PLUS
    return new Promise((resolve, reject) => {
      try {
        showAuthTip(AuthType.LOCATION).then((result) => {
          if (result) {
            console.log(`位置权限授权结果:${result}`);
            resolve(args);
          } else {
            console.log(`用户未同意位置权限授权:${result}`);
            // 对拦截器拦截执行时进行fail\complete调用，确保调用链完整
            args.fail?.(failResult);
            args.complete?.(failResult);
            resolve(false);
          }
        }).catch((error) => {
          console.error(`请求位置权限时出错:${JSON.stringify(error)}`);
          reject(error);
        });
      } catch (error) {
        console.error(`处理位置权限请求时发生异常:${JSON.stringify(error)}`);
        reject(error);
      }
    });
    // #endif

    // #ifdef MP
    return new Promise((resolve, reject) => {
      try {
        // 使用封装的工具函数处理小程序位置权限
        checkAndRequestLocationAuth().then((granted) => {
          if (granted) {
            console.log(`位置权限授权结果:${granted}`);
            resolve(args);
          } else {
            console.log(`用户未同意位置权限授权:${granted}`);
            // 对拦截器拦截执行时进行fail\complete调用，确保调用链完整
            args.fail?.(failResult);
            args.complete?.(failResult);
            resolve(false);
          }
        }).catch((error) => {
          console.error("请求位置权限时出错:", error);
          reject(error);
        });
      } catch (error) {
        console.error("处理位置权限请求时发生异常:", error);
        reject(error);
      }
    });
    // #endif

    // #ifdef H5
    // H5端通常由浏览器处理位置权限，保持与其他平台一致返回Promise
    return new Promise((resolve) => {
      try {
        console.log("即将选择位置");
        resolve(args);
      } catch (error) {
        console.error("H5处理位置选择时出错:", error);
        // H5环境下通常不会因为权限问题失败，所以这里仍然resolve
        resolve(args);
      }
    });
    // #endif
  },
  success(res) {
    // #ifdef APP-PLUS
    console.log(`chooseLocation success:${JSON.stringify(res)}`);
    // #endif

    // #ifdef MP || H5
    console.log(`chooseLocation success:${JSON.stringify(res)}`);
    // MP/H5 无需本地权限检查
    // #endif
  },
  fail(error) {
    // #ifdef APP-PLUS
    console.log(`chooseLocation error:${JSON.stringify(error)}`);
    const granted = checkSelfPermission(AuthType.LOCATION);
    if (!granted) {
      const showRationale = shouldShowRequestPermissionRationale(AuthType.LOCATION);
      console.log(`shouldShowRequestPermissionRationale:${showRationale}`);
      if (!showRationale) {
        showManualAuth(AuthType.LOCATION);
      }
    }
    // #endif
    // #ifdef MP
    console.log(`chooseLocation error:${JSON.stringify(error)}`);
    // #endif
  },
  complete(res) {
    console.log(`chooseLocation complete:${JSON.stringify(res)}`);
    // 可以在这里添加通用的完成处理逻辑
  },
};

export const chooseLocationInterceptor: Plugin = {
  install() {
    uni.addInterceptor("chooseLocation", chooseLocation);
    uni.addInterceptor("getLocation", chooseLocation);
  },
};
