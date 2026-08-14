/**
 * 各端 JS-SDK 注入的全局对象
 * - tt：抖音小程序 requirePlugin 能力（下单/支付/退款）
 * - wx：微信/企业微信（企业微信客服）
 * - jd：京东小程序（支付）
 * - jWeixin：微信 JS-SDK（jWeixin）
 *
 * ⚠️ 本文件是 script（无 top-level export），`declare const` 顶层即全局。
 * 不可套 `declare global`——它仅对 module 文件生效，script 里是 no-op（会报 Cannot find name）。
 */

/**
 * 抖音小程序 requirePlugin 能力（下单/支付/退款）
 */
declare const tt: {
  requirePlugin: (pluginId: string) => {
    /** 创建订单 */
    createOrder: (options: Record<string, any> & {
      success?: (res: any) => void;
      fail?: (e: any) => void;
    }) => Promise<any>;
    /** 继续支付 */
    continueToPay: (options: Record<string, any> & {
      success?: (res: any) => void;
      fail?: (e: any) => void;
    }) => Promise<any>;
    /** 申请退款 */
    applyRefund: (options: Record<string, any> & {
      success?: (res: any) => void;
      fail?: (e: any) => void;
    }) => Promise<any>;
  };
};

/**
 * 微信/企业微信全局对象
 */
declare const wx: {
  /**
   * 企业微信客服
   * https://work.weixin.qq.com/nl/act/p/a733314375294bdd
   */
  openCustomerServiceChat: (options: {
    extInfo: {
      url: string;
    };
    corpId: string;
    success?: (result: any) => void;
    fail?: (result: any) => void;
  }) => void;
};

/**
 * 京东小程序全局对象
 */
declare const jd: {
  /** 京东小程序支付能力 */
  miniPay: (options: Record<string, any> & {
    success?: (res: any) => void;
    fail?: (e: any) => void;
  }) => void;
};

/**
 * 微信 JS-SDK（jWeixin）全局对象
 */
declare const jWeixin: {
  /** 微信 JS-SDK 初始化 */
  config: (options: Record<string, any>) => void;
  /** 微信 JS-SDK ready 回调 */
  ready: (callback: () => void) => void;
  /** 微信 JS-SDK error 回调 */
  error: (callback: (error: any) => void) => void;
  [key: string]: any;
};
