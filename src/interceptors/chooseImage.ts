import type { Plugin } from "vue";
import { AuthType, checkAndRequestImageAuth, showAuthTip } from "../tools";

const chooseImage: UniNamespace.InterceptorOptions = {
  invoke(args) {
    // #ifdef APP-PLUS
    return new Promise((resolve, reject) => {
      // 检查是否需要相机权限或相册权限
      const sourceType = args.sourceType || ["album", "camera"];
      const needCameraAuth = sourceType.includes("camera");
      const needPhotoAuth = sourceType.includes("album");

      // 如果只需要相机权限
      if (needCameraAuth && !needPhotoAuth) {
        showAuthTip(AuthType.CAMERA).then((result) => {
          if (result) {
            console.log(`相机权限授权结果:${result}`);
            resolve(args);
          } else {
            console.log(`相机权限授权结果:${result}`);
            // 用户拒绝授权
            reject(new Error("用户拒绝相机权限授权"));
          }
        });
      } else if (!needCameraAuth && needPhotoAuth) {
      // 如果只需要相册权限
        showAuthTip(AuthType.PHOTO).then((result) => {
          if (result) {
            console.log(`相册权限授权结果:${result}`);
            resolve(args);
          } else {
            console.log(`相册权限授权结果:${result}`);
            // 用户拒绝授权
            reject(new Error("用户拒绝相册权限授权"));
          }
        });
      } else if (needCameraAuth && needPhotoAuth) {
      // 如果同时需要相机和相册权限，优先请求相机权限
        showAuthTip(AuthType.CAMERA).then((cameraResult) => {
          if (cameraResult) {
            showAuthTip(AuthType.PHOTO).then((photoResult) => {
              if (photoResult) {
                console.log(`相机和相册权限授权结果:${photoResult}`);
                resolve(args);
              } else {
                console.log(`相册权限授权结果:${photoResult}`);
                reject(new Error("用户拒绝相册权限授权"));
              }
            });
          } else {
            console.log(`相机权限授权结果:${cameraResult}`);
            reject(new Error("用户拒绝相机权限授权"));
          }
        });
      } else {
        // 如果没有指定 sourceType，默认通过
        resolve(args);
      }
    });
    // #endif

    // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ || MP-JD || MP-KUAISHOU
    return new Promise((resolve, reject) => {
      // 使用封装的工具函数处理微信、百度、头条、QQ小程序图片选择权限
      const sourceType = args.sourceType || ["album", "camera"];
      checkAndRequestImageAuth(sourceType).then((granted) => {
        if (granted) {
          console.log(`图片选择权限授权结果:${granted}`);
          resolve(args);
        } else {
          console.log(`图片选择权限授权结果:${granted}`);
          reject(new Error("用户拒绝图片选择权限授权"));
        }
      });
    });
    // #endif

    // #ifdef MP-ALIPAY
    return new Promise((resolve, reject) => {
      // 使用封装的工具函数处理支付宝小程序图片选择权限
      const sourceType = args.sourceType || ["album", "camera"];
      checkAndRequestImageAuth(sourceType).then((granted) => {
        if (granted) {
          console.log(`图片选择权限授权结果:${granted}`);
          resolve(args);
        } else {
          console.log(`图片选择权限授权结果:${granted}`);
          reject(new Error("用户拒绝图片选择权限授权"));
        }
      });
    });
    // #endif

    // #ifdef H5
    // H5端通常由浏览器处理文件选择权限，这里可以添加一些提示
    console.log("即将选择图片");
    return true;
    // #endif
  },
  success() {
    // #ifdef APP-PLUS
    console.log("chooseImage success:");
    // #endif

    // #ifdef MP || H5
    console.log("chooseImage success:");
    // MP/H5 无需本地权限检查
    // #endif
  },
  fail(error) {
    console.log(`chooseImage error:${error}`);
  },
};

export const chooseImageInterceptor: Plugin = {
  install() {
    uni.addInterceptor("chooseImage", chooseImage);
    uni.addInterceptor("chooseMedia", chooseImage);
  },
};

export function applyChooseImageInterceptor(): void {
  chooseImageInterceptor.install?.(null as any);
}
