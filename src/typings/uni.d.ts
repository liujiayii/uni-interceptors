/**
 * uni 平台类型补充
 * - MiniProgramPlatform：小程序平台联合类型
 * - NodeJS.ProcessEnv.UNI_PLATFORM：构建期平台变量
 * - UniNamespace：对 @dcloudio/types 官方命名空间的缺口补齐（支付/系统信息/页面路由/授权码）
 * - interface Uni.getAuthCode：支付宝/抖音/快手等平台授权码能力
 *
 * ⚠️ 项目私有的 uni 挂载（如友盟 $report / aegis $aegis）不在此，由各消费端自行声明。
 */
export type MiniProgramPlatform
  = | "mp-alipay"
    | "mp-weixin"
    | "mp-baidu"
    | "mp-qq"
    | "mp-toutiao"
    | "mp-kuaishou"
    | "mp-jd"
    | "app"
    | "h5"
    | "web"
    | "app-plus"
    | "app-harmony"
    | "quickapp-webview-union"
    | "quickapp-webview-huawei";

/* eslint-disable ts/consistent-type-definitions */
declare global {

  namespace NodeJS {
    interface ProcessEnv {
      UNI_PLATFORM: MiniProgramPlatform;
    }
  }

  interface Uni {
    /** 支付宝/抖音/快手等平台授权码能力，官方类型未完整覆盖 */
    getAuthCode: (options?: Record<string, any>) => Promise<any>;
  }

  // 更明确地扩展 uni 的命名空间类型
  namespace UniNamespace {
    interface Uni {
      /** 支付宝/抖音/快手等平台授权码能力，官方类型未完整覆盖 */
      getAuthCode: (options?: Record<string, any>) => Promise<any>;
    }

    interface RequestPaymentOptions {
      /** 快手小程序支付服务 id */
      serviceId?: string;
      /** 支付宝 App 支付参数 */
      orderStr?: string;
      /**
       * 支付服务提供商，通过 uni.getProvider 获取
       * - alipay: 支付宝支付
       * - wxpay: 微信支付
       * - baidu: 百度收银台
       * - appleiap: 苹果应用内支付
       */
      provider?: "alipay" | "wxpay" | "baidu" | "appleiap";
    }

    interface RequestPaymentSuccess {
      /** App 支付原始返回 */
      rawdata?: string;
    }

    /** 事实上这个参数可以不传，uni.hideShareMenu() 支持无参调用 */
    interface HideShareMenuOptions {
      /** 是否隐藏分享菜单 */
      hideShareItems?: any[];
    }

    interface PageInstance {
      /** H5/小程序页面运行时注入的页面路由信息 */
      $page?: Record<string, any>;
    }

    interface GetSystemInfoSyncResult {
      /** 环境变量，如在企业微信中为 'wxwork' */
      environment?: string;
    }

    interface GetSystemInfoResult {
      /** 环境变量，如在企业微信中为 'wxwork' */
      environment?: string;
    }

    interface AuthSetting {
      /** 支付宝小程序位置权限 */
      location?: boolean;
    }
  }
}
