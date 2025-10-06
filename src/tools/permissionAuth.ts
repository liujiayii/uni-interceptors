/**
 * 权限键映射配置
 */
type PermissionKeyMapping = {
  [key: string]: {
    authKey: string | (() => string);
    title: string;
    content: string;
  };
};

/**
 * 权限键映射
 */
const permissionKeyMapping: PermissionKeyMapping = {
  // 位置权限
  location: {
    authKey: () => {
      // #ifdef MP-ALIPAY
      return "location";
      // #endif
      // #ifndef MP-ALIPAY
      return "scope.userLocation";
      // #endif
    },
    title: "位置权限获取失败",
    content: "请在设置中开启位置权限，以便使用位置相关功能",
  },
  // 相机权限
  camera: {
    authKey: "scope.camera",
    title: "相机权限获取失败",
    content: "请在设置中开启相机权限，以便使用拍照功能",
  },
  // 相册权限
  album: {
    authKey: "scope.writePhotosAlbum",
    title: "相册权限获取失败",
    content: "请在设置中开启相册权限，以便使用图片选择功能",
  },
};

/**
 * 检查并请求小程序权限（支持所有小程序平台）
 * @param permissionTypes 权限类型数组
 * @returns Promise<boolean> 是否获得授权
 */
export function checkAndRequestPermissions(permissionTypes: string[]): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    // 如果没有指定权限类型，直接通过
    if (!permissionTypes || permissionTypes.length === 0) {
      resolve(true);
      return;
    }

    uni.getSetting({
      success: (res) => {
        const authSetting = res.authSetting;

        // 检查各权限状态
        const permissionResults: { [key: string]: boolean } = {};
        const deniedPermissions: string[] = [];

        for (const permissionType of permissionTypes) {
          const permissionConfig = permissionKeyMapping[permissionType];
          if (!permissionConfig) {
            // 如果没有找到权限配置，默认通过
            permissionResults[permissionType] = true;
            continue;
          }

          // 获取权限键，对于位置权限需要根据平台判断
          const authKey = typeof permissionConfig.authKey === "function"
            ? permissionConfig.authKey()
            : permissionConfig.authKey;

          // 检查权限状态
          if (authSetting && authSetting[authKey as keyof UniApp.AuthSetting] === true) {
            // 已授权
            permissionResults[permissionType] = true;
          } else if (authSetting && authSetting[authKey as keyof UniApp.AuthSetting] === false) {
            // 已明确拒绝授权
            permissionResults[permissionType] = false;
            deniedPermissions.push(permissionType);
          } else {
            // 未授权且未明确拒绝，暂时设为true，后续会调用API
            permissionResults[permissionType] = true;
          }
        }

        // 如果所有权限都已授权，直接执行
        if (deniedPermissions.length === 0) {
          resolve(true);
          return;
        }

        // 如果有权限被拒绝，显示提示并引导用户手动开启
        const deniedPermissionNames = deniedPermissions.map((permission) => {
          switch (permission) {
            case "location": return "位置";
            case "camera": return "相机";
            case "album": return "相册";
            default: return permission;
          }
        });

        // 使用第一个被拒绝权限的配置来显示提示
        const firstDeniedPermission = deniedPermissions[0];
        const permissionConfig = permissionKeyMapping[firstDeniedPermission];

        uni.showModal({
          title: permissionConfig.title,
          content: `请在设置中开启${deniedPermissionNames.join("和")}权限，以便使用相关功能`,
          confirmText: "去设置",
          cancelText: "暂不开启",
          success: (settingRes) => {
            if (settingRes.confirm) {
              uni.openSetting({
                success: (openSettingRes) => {
                  // 检查用户是否在设置中开启了权限
                  const newAuthSetting = openSettingRes.authSetting;

                  // 重新检查所有权限状态
                  let allGranted = true;
                  for (const permissionType of permissionTypes) {
                    const permissionConfig = permissionKeyMapping[permissionType];
                    if (!permissionConfig)
                      continue;

                    const authKey = typeof permissionConfig.authKey === "function"
                      ? permissionConfig.authKey()
                      : permissionConfig.authKey;

                    const granted = newAuthSetting && newAuthSetting[authKey] === true;
                    if (!granted) {
                      allGranted = false;
                    }
                  }

                  // 返回权限检查结果
                  resolve(allGranted);
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
      },
      fail: () => {
        resolve(false);
      },
    });
  });
}

/**
 * 检查并请求小程序位置权限（支持所有小程序平台）
 * @returns Promise<boolean> 是否获得授权
 */
export function checkAndRequestLocationAuth(): Promise<boolean> {
  return checkAndRequestPermissions(["location"]);
}

/**
 * 检查并请求小程序图片选择权限（支持所有小程序平台）
 * @param sourceType 图片来源类型，'album'表示相册，'camera'表示相机
 * @returns Promise<boolean> 是否获得授权
 */
export function checkAndRequestImageAuth(
  sourceType: string[] = ["album", "camera"],
): Promise<boolean> {
  // 将 sourceType 转换为权限类型
  const permissionTypes: string[] = [];

  if (sourceType.includes("camera")) {
    permissionTypes.push("camera");
  }

  if (sourceType.includes("album")) {
    permissionTypes.push("album");
  }

  return checkAndRequestPermissions(permissionTypes);
}
