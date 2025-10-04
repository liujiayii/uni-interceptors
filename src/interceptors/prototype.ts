import type { Plugin } from "vue";

export const prototypeInterceptor: Plugin = {
  install() {
    // 解决低版本手机不识别 array.at() 导致运行报错的问题
    if (typeof Array.prototype.at !== "function") {
      // eslint-disable-next-line no-extend-native
      Array.prototype.at = function (this: any[], index: number) {
        if (index < 0)
          return this[this.length + index];
        if (index >= this.length)
          return undefined;
        return this[index];
      };
    }
  },
};

/**
 * 直接应用原型拦截器
 * 可以作为 Vue 插件使用: Vue.use(prototypeInterceptor)
 * 也可以直接调用: applyPrototypeInterceptor()
 */
export function applyPrototypeInterceptor(): void {
  prototypeInterceptor.install?.(null as any);
}
