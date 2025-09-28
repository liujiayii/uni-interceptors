// eslint-disable-next-line node/prefer-global/process
const UNI_PLATFORM = process.env.UNI_PLATFORM;
const systemInfo = uni.getSystemInfoSync();
const { platform, environment = "" } = systemInfo;

/** h5环境 */
export const isH5 = UNI_PLATFORM === "h5";
const userAgent = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";

/** h5环境微信环境 */
export const isH5WeiXin = isH5 && /micromessenger/i.test(userAgent);
/** h5环境微博环境 */
export const isH5WeiBo = isH5 && /weibo/i.test(userAgent);
/** app环境 */
export const isApp = UNI_PLATFORM === "app";
/** ios app */
export const isAppIos = isApp && platform === "ios";
/** android app */
export const isAppAndroid = isApp && platform === "android";
/** 微信小程序 */
export const isMpWeiXin = UNI_PLATFORM === "mp-weixin";
/** 微信小程序企业版 */
export const isMpWeiXinQY = environment === "wxwork";
/** 支付宝小程序 */
export const isMpAlipay = UNI_PLATFORM === "mp-alipay";
/** 头条小程序 */
export const isMpToutiao = UNI_PLATFORM === "mp-toutiao";
/** 快手小程序 */
export const isMpKuaishou = UNI_PLATFORM === "mp-kuaishou";
/** 京东小程序 */
export const isMpJd = UNI_PLATFORM === "mp-jd";
