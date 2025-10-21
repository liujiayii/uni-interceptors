/// <reference types="@dcloudio/types" />

/**
 * 小程序平台类型
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
    | "h5";

/* eslint-disable ts/consistent-type-definitions */
declare global {

  namespace NodeJS {
    interface ProcessEnv {
      UNI_PLATFORM: MiniProgramPlatform;
    }
  }
  // 更明确地扩展 uni 的命名空间类型
  namespace UniNamespace {
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

export {};
