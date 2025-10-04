const systemInfo = uni.getSystemInfoSync();
const { environment = "" } = systemInfo;

/** 微信小程序企业版 */
export const isMpWeiXinWork = environment === "wxwork";
