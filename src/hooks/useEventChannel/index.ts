import { getCurrentInstance, onUnmounted } from "vue";

/**
 * EventChannel 数据类型映射接口
 * 用于定义不同事件名称对应的数据类型
 */
export type IEventChannelMap = Record<string, unknown>;

/**
 * EventChannel 监听回调函数类型
 * @template T - 接收的数据类型
 */
export type IEventChannelCallback<T = unknown> = (data: T) => void;

/**
 * useEventChannel 返回的类型安全的便捷方法对象
 */
export type IEventChannelActions<T extends IEventChannelMap = IEventChannelMap> = {
  /** 类型安全的事件监听 */
  on: <K extends keyof T>(event: K, callback: IEventChannelCallback<T[K]>) => void;
  /** 类型安全的事件发送 */
  emit: <K extends keyof T>(event: K, data: T[K]) => void;
  /** 类型安全的事件移除 */
  off: <K extends keyof T>(event: K, callback?: IEventChannelCallback<T[K]>) => void;
};

/**
 * 为任意 EventChannel 实例创建类型安全的 on/emit/off 方法
 * 纯函数，不依赖 Vue 生命周期，可在任何上下文中使用
 *
 * @template T - 事件数据类型映射，需继承 IEventChannelMap
 * @param eventChannel - 原始 EventChannel 实例
 * @returns 返回包含 on/emit/off 的类型安全对象
 *
 * @example
 * ```typescript
 * // 定义事件数据类型映射
 * interface IMyEventMap {
 *   acceptDataFromOpenerPage: { id: number; name: string };
 *   someOtherEvent: { message: string };
 * }
 *
 * uni.navigateTo({
 *   url: "/pages/detail/index",
 *   success(res) {
 *     // 使用 createEventChannelActions 包装，获得类型安全的 emit
 *     const channel = createEventChannelActions<IMyEventMap>(res.eventChannel);
 *     // emit 具有类型约束，事件名和数据类型都会被检查
 *     channel.emit("acceptDataFromOpenerPage", { id: 1, name: "测试" });
 *   }
 * });
 * ```
 */
export function createEventChannelActions<T extends IEventChannelMap = IEventChannelMap>(
  eventChannel: UniApp.EventChannel,
): IEventChannelActions<T> {
  // 类型安全的事件监听
  function on<K extends keyof T>(event: K, callback: IEventChannelCallback<T[K]>): void {
    eventChannel.on(event as string, callback as IEventChannelCallback);
  }

  // 类型安全的事件发送
  function emit<K extends keyof T>(event: K, data: T[K]): void {
    eventChannel.emit(event as string, data);
  }

  // 类型安全的事件移除
  function off<K extends keyof T>(event: K, callback?: IEventChannelCallback<T[K]>): void {
    eventChannel.off(event as string, callback as IEventChannelCallback);
  }

  return { on, emit, off };
}

/**
 * 封装获取 EventChannel 并提供类型安全的 on/emit/off 便捷方法
 *
 * @description
 * 用于页面间通信，监听上一个页面通过 EventChannel 传递的数据。
 * 需要在页面的 setup 中使用，且页面由 navigateTo 打开。
 * 组件卸载时会自动清理通过 on 注册的所有监听器。
 *
 * @template T - 事件数据类型映射，默认为 IEventChannelMap
 * @returns 返回包含 on/emit/off 的类型安全对象，获取 EventChannel 失败时返回 undefined
 *
 * @example
 * ```typescript
 * // 定义事件数据类型映射
 * interface IMyEventMap {
 *   acceptDataFromOpenerPage: { id: number; name: string };
 *   someOtherEvent: { message: string };
 * }
 *
 * // 使用 hook 监听事件（带类型约束）
 * const channel = useEventChannel<IMyEventMap>();
 *
 * // on — 类型安全，data 自动推导为 { id: number; name: string }
 * channel?.on("acceptDataFromOpenerPage", (data) => {
 *   console.log("收到数据:", data.id, data.name);
 * });
 *
 * // emit — 类型安全，data 必须匹配对应事件的数据类型
 * channel?.emit("someOtherEvent", { message: "hello" });
 *
 * // off — 类型安全移除监听
 * const handler = (data: { id: number; name: string }) => { /* ... *\/ };
 * channel?.off("acceptDataFromOpenerPage", handler);
 *
 * // 组件卸载时自动清理，无需手动 off
 * ```
 */
export function useEventChannel<T extends IEventChannelMap = IEventChannelMap>(): IEventChannelActions<T> | undefined {
  // 获取当前组件实例（使用 as any 因为 getOpenerEventChannel 是 uni-app 扩展属性）
  const instance = getCurrentInstance()?.proxy as any;

  // 获取打开当前页面的 EventChannel
  const eventChannel = instance?.getOpenerEventChannel?.() as UniApp.EventChannel | undefined;

  // 获取失败时在开发环境输出警告
  if (!eventChannel) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[uni-toolkit] useEventChannel 获取 EventChannel 失败，请确保在页面 setup 中调用且页面由 navigateTo 打开");
    }
    return undefined;
  }

  // 使用 createEventChannelActions 创建基础类型安全方法
  const actions = createEventChannelActions<T>(eventChannel);

  // 监听器映射表，用于跟踪所有通过 on 注册的回调，以便卸载时自动清理
  const listenerMap = new Map<keyof T, Set<IEventChannelCallback>>();

  // 包装 on，增加 listenerMap 记录
  function on<K extends keyof T>(event: K, callback: IEventChannelCallback<T[K]>): void {
    actions.on(event, callback);

    // 将回调记录到映射表中，便于后续自动清理
    if (!listenerMap.has(event)) {
      listenerMap.set(event, new Set());
    }
    listenerMap.get(event)!.add(callback as IEventChannelCallback);
  }

  // 包装 off，增加 listenerMap 清理
  function off<K extends keyof T>(event: K, callback?: IEventChannelCallback<T[K]>): void {
    actions.off(event, callback);

    // 同步清理映射表中的记录
    if (callback) {
      listenerMap.get(event)?.delete(callback as IEventChannelCallback);
    } else {
      listenerMap.delete(event);
    }
  }

  // 组件卸载时自动清理所有通过 on 注册的监听器
  onUnmounted(() => {
    listenerMap.forEach((callbacks, event) => {
      callbacks.forEach((cb) => {
        eventChannel.off(event as string, cb);
      });
    });
    listenerMap.clear();
  });

  return { on, emit: actions.emit, off };
}
