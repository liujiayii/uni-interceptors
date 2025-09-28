export enum AuthType {
  /** 获取位置信息 */
  LOCATION = "android.permission.ACCESS_FINE_LOCATION",
  /** 获取相册信息 */
  PHOTO = "android.permission.READ_EXTERNAL_STORAGE",
  /** 获取相机信息 */
  CAMERA = "android.permission.CAMERA",
  /** 获取电话信息 */
  PHONE = "android.permission.CALL_PHONE",
}

export const authTips = {
  [AuthType.LOCATION]: {
    title: "位置权限使用说明",
    describe: "为您提供附近的服务点、车辆定位等基于位置的便捷服务",
    failTips: "位置权限获取失败，请前往设置开启或检查系统定位服务",
  },
  [AuthType.PHOTO]: {
    title: "相册权限使用说明",
    describe: "用于图片上传、头像设置、二维码识别等功能，让您的操作更便捷",
    failTips: "相册权限获取失败，请前往设置中开启存储权限",
  },
  [AuthType.CAMERA]: {
    title: "相机权限使用说明",
    describe: "用于拍照、扫描二维码等功能，提升您的使用体验",
    failTips: "相机权限获取失败，请前往设置中开启相机权限",
  },
  [AuthType.PHONE]: {
    title: "电话权限使用说明",
    describe: "用于快速联系客服，为您提供更及时的服务支持",
    failTips: "电话权限获取失败，请前往设置中开启通话权限",
  },
};
