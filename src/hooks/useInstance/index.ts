import type { ComponentPublicInstance } from "vue";
import { getCurrentInstance } from "vue";

/**
 * 获取当前组件实例的 proxy 对象
 *
 * 该 hook 封装了 getCurrentInstance().proxy 逻辑，
 * 用于在组件内部获取组件实例的代理对象。
 *
 * 支持传入泛型参数以获得更精确的类型推断。
 * 在开发环境下，如果不在 setup 函数中调用，会输出警告信息。
 *
 * @template T - 组件实例类型，默认为 ComponentPublicInstance
 * @returns 组件实例的 proxy 对象，如果不在组件上下文中调用则返回 null
 *
 * @example
 * ```ts
 * // 基础用法
 * const instance = useInstance();
 * if (instance) {
 *   console.log(instance.$props);
 * }
 *
 * // 传入自定义组件类型，获得精确的类型推断
 * const instance = useInstance<MyComponent>();
 * if (instance) {
 *   console.log(instance.customMethod());
 * }
 * ```
 */
export function useInstance<T = ComponentPublicInstance>(): T | null {
  // 获取当前组件实例
  const instance = getCurrentInstance();

  // 如果不在组件上下文中调用，返回 null 并在开发环境下输出警告
  if (!instance) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[uni-toolkit] useInstance 必须在 setup 函数中调用");
    }
    return null;
  }

  // 返回组件实例的 proxy 对象
  return instance.proxy as T | null;
}
