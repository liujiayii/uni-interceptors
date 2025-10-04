/**
 * 检查并请求小程序位置权限（支持所有小程序平台）
 * @param platform 小程序平台类型
 * @returns Promise<boolean> 是否获得授权
 */
export function checkAndRequestLocationAuth(platform: MiniProgramPlatform): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    uni.getSetting({
      success: (res) => {
        const authSetting = res.authSetting;

        // 支付宝小程序使用location作为权限键，其他小程序使用scope.userLocation
        const locationAuthKey = platform === "mp-alipay" ? "location" : "scope.userLocation";

        // 检查权限状态
        if (authSetting && authSetting[locationAuthKey] === true) {
          // 已授权，直接执行
          resolve(true);
        } else if (authSetting && authSetting[locationAuthKey] === false) {
          // 已明确拒绝授权，显示提示并引导用户手动开启
          uni.showModal({
            title: "位置权限获取失败",
            content: "请在设置中开启位置权限，以便使用位置相关功能",
            confirmText: "去设置",
            cancelText: "暂不开启",
            success: (settingRes: any) => {
              if (settingRes.confirm) {
                uni.openSetting({
                  success: () => {
                    resolve(false);
                  },
                  fail: () => {
                    resolve(false);
                  },
                });
              } else {
                resolve(false);
              }
            },
          });
        } else {
          // 未授权且未明确拒绝，直接调用API
          resolve(true);
        }
      },
      fail: () => {
        resolve(false);
      },
    });
  });
}
