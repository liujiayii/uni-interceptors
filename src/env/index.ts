export const platform = process.env.UNI_PLATFORM;

const systemInfo = uni.getSystemInfoSync();
const { environment = "", platform: sysPlatform } = systemInfo || {};

const userAgent = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";

/** H5环境 */
export const isH5 = platform === "h5" || platform === "web";

/** H5微信环境 */
export const isH5Weixin = isH5 && /micromessenger/i.test(userAgent);

/** H5微博环境 */
export const isH5Weibo = isH5 && /weibo/i.test(userAgent);

/** H5支付宝环境 */
export const isH5Alipay = isH5 && /alipayclient/i.test(userAgent);

/** Web环境 */
export const isWeb = platform === "web" || platform === "h5";

/** App环境 */
export const isApp = platform === "app";

/** App-plus环境 */
export const isAppPlus = platform === "app-plus";

/** App鸿蒙环境 */
export const isAppHarmony = platform === "app-harmony";

/** Android App */
export const isAppAndroid = isApp && sysPlatform === "android";

/** iOS App */
export const isAppIOS = isApp && sysPlatform === "ios";

/** 小程序环境 */
export const isMp = /^mp-/i.test(platform);

/** 微信小程序 */
export const isMpWeixin = platform === "mp-weixin";

/** 微信小程序企业版 */
export const isMpWeiXinWork = isMpWeixin && environment === "wxwork";

/** 支付宝小程序 */
export const isMpAlipay = platform === "mp-alipay";

/** 百度小程序 */
export const isMpBaidu = platform === "mp-baidu";

/** 京东小程序 */
export const isMpJd = platform === "mp-jd";

/** 快手小程序 */
export const isMpKuaishou = platform === "mp-kuaishou";

/** QQ小程序 */
export const isMpQQ = platform === "mp-qq";

/** 字节跳动小程序 */
export const isMpToutiao = platform === "mp-toutiao";

/** 快应用环境 */
export const isQuickapp = /^quickapp-webview/i.test(platform);

/** 快应用联盟 */
export const isQuickappUnion = platform === "quickapp-webview-union";

/** 华为快应用 */
export const isQuickappHuawei = platform === "quickapp-webview-huawei";
