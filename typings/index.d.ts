/// <reference types="@dcloudio/types" />

/* eslint-disable ts/consistent-type-definitions */
declare global {
  namespace NodeJs {
    interface ProcessEnv {
      UNI_PLATFORM: "mp-alipay" | "mp-weixin" | "mp-toutiao" | "mp-kuaishou" | "mp-jd" | "app" | "h5";
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
    }

  }
}

export {};
