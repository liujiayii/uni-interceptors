import type { Plugin } from "vue";
import { AuthType, checkAndRequestImageAuth, showAuthTip } from "../../tools";

const failResult = {
  errMsg: "[chooseImage]:fail permission not granted",
  errCode: -1,
  authDenied: true,
};

const chooseImage: UniNamespace.InterceptorOptions = {
  invoke(args) {
    // #ifdef APP-PLUS
    return new Promise((resolve, reject) => {
      try {
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
              console.log(`用户拒绝相机权限授权:${result}`);
              // 对拦截器拦截执行时进行fail\complete调用，确保调用链完整
              args.fail?.(failResult);
              args.complete?.(failResult);
              resolve(false);
            }
          }).catch((error) => {
            console.error("请求相机权限时出错:", error);
            reject(error);
          });
        } else if (!needCameraAuth && needPhotoAuth) {
        // 如果只需要相册权限
          showAuthTip(AuthType.PHOTO).then((result) => {
            if (result) {
              console.log(`相册权限授权结果:${result}`);
              resolve(args);
            } else {
              console.log(`用户拒绝相册权限授权:${result}`);
              // 对拦截器拦截执行时进行fail\complete调用，确保调用链完整
              args.fail?.(failResult);
              args.complete?.(failResult);
              resolve(false);
            }
          }).catch((error) => {
            console.error("请求相册权限时出错:", error);
            reject(error);
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
                  console.log(`用户拒绝相册权限授权:${photoResult}`);
                  // 对拦截器拦截执行时进行fail\complete调用，确保调用链完整
                  args.fail?.(failResult);
                  args.complete?.(failResult);
                  resolve(false);
                }
              }).catch((error) => {
                console.error("请求相册权限时出错:", error);
                reject(error);
              });
            } else {
              console.log(`相机权限授权结果:${cameraResult}`);
              // 对拦截器拦截执行时进行fail\complete调用，确保调用链完整
              args.fail?.(failResult);
              args.complete?.(failResult);
              resolve(false);
            }
          }).catch((error) => {
            console.error("请求相机权限时出错:", error);
            reject(error);
          });
        } else {
          // 如果没有指定 sourceType，默认通过
          resolve(args);
        }
      } catch (error) {
        console.error("处理权限请求时发生异常:", error);
        reject(error);
      }
    });
    // #endif

    // #ifdef MP
    return new Promise((resolve, reject) => {
      try {
        // 使用封装的工具函数处理小程序图片选择权限
        const sourceType = args.sourceType || ["album", "camera"];
        checkAndRequestImageAuth(sourceType).then((granted) => {
          if (granted) {
            console.log(`图片选择权限授权结果:${granted}`);
            resolve(args);
          } else {
            console.log(`用户拒绝图片选择权限授权:${granted}`);
            // 对拦截器拦截执行时进行fail\complete调用，确保调用链完整
            args.fail?.(failResult);
            args.complete?.(failResult);
            resolve(false);
          }
        }).catch((error) => {
          console.error("请求图片选择权限时出错:", error);
          reject(error);
        });
      } catch (error) {
        console.error("处理权限请求时发生异常:", error);
        reject(error);
      }
    });
    // #endif

    // #ifdef H5
    // H5端通常由浏览器处理文件选择权限，保持与其他平台一致返回Promise
    return new Promise((resolve) => {
      try {
        console.log("即将选择图片");
        resolve(args);
      } catch (error) {
        console.error("H5处理图片选择时出错:", error);
        // H5环境下通常不会因为权限问题失败，所以这里仍然resolve
        resolve(args);
      }
    });
    // #endif
  },
  success(res) {
    // #ifdef APP-PLUS
    console.log("chooseImage success:", res);
    // #endif

    // #ifdef MP || H5
    console.log("chooseImage success:", res);
    // MP/H5 无需本地权限检查
    // #endif
  },
  fail(error) {
    console.log(`chooseImage error:${error}`);
  },
  complete(res) {
    console.log("chooseImage complete:", res);
    // 可以在这里添加通用的完成处理逻辑
  },
};

export const chooseImageInterceptor: Plugin = {
  install() {
    uni.addInterceptor("chooseImage", chooseImage);
    uni.addInterceptor("chooseMedia", chooseImage);
  },
};
