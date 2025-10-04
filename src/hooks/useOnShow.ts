import type { TryOnShowOptions } from "@uni-helper/uni-use";
import { onShow } from "@dcloudio/uni-app";
import { delay } from "es-toolkit";
import { getCurrentInstance } from "vue";

type OnShowParameters = Parameters<typeof onShow>;

/**
 * 尝试获取组件生命周期，并调用 onShow
 *
 * 超过重试次数，根据 runFinally 直接执行或抛出异常
 *
 * 复制自@uni-helper/uni-use的tryOnShow，由于在支付宝小程序第一次不执行的问题，所以复制出来了一份，相关issue：https://github.com/uni-helper/uni-use/issues/57
 */
export async function useOnShow(
  hook: OnShowParameters[0],
  target?: OnShowParameters[1],
  options: TryOnShowOptions = {},
): Promise<void> {
  const {
    retry = 3,
    interval = 500,
    runFinally = true,
  } = options;

  function tryBind(): boolean {
    const instance = (target || getCurrentInstance()) as OnShowParameters[1] | undefined;
    if (instance) {
      // #ifdef MP-ALIPAY
      try {
        hook?.();
      } catch {
        // ignore
      }
      // #endif
      onShow(hook, instance);
      return true;
    }

    return false;
  }
  for (let circle = 1; circle <= retry; circle++) {
    if (tryBind()) {
      return;
    }
    await delay(interval);
  }

  if (runFinally) {
    return onShow(hook);
  }

  throw new Error("Binding onShow failed, maximum number of attempts exceeded.");
}
