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
    title: "位置信息权限使用说明",
    describe: "根据您的所在位置为您匹配附近的租车门店和车辆等场景",
    failTips: "获取定位权限失败，请手动打开授权或检查系统定位开关",
  },
  [AuthType.PHOTO]: {
    title: "相册权限说明",
    describe: "便于您上传更新头像、上传笔记图片、识别相册二维码等功能，请您确认授权",
    failTips: "获取相册权限失败，请手动打开授权",
  },
  [AuthType.CAMERA]: {
    title: "拍摄权限说明",
    describe: "便于您使用扫码等功能，请您确认授权",
    failTips: "获取相机权限失败，请手动打开授权",
  },
  [AuthType.PHONE]: {
    title: "拨打电话权限使用说明",
    describe: "用于联系平台客服以便更好的为您服务",
    failTips: "获取电话权限失败，请手动打开授权",
  },
};
