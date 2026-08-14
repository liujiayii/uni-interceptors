import type { ComputedRef, Ref } from "vue";
import { computed, onMounted, ref } from "vue";

/** 触点坐标 */
export type DraggableTouch = {
  clientX: number;
  clientY: number;
};

/**
 * 拖拽所需的触摸事件形状
 *
 * 用 ArrayLike 而不是数组或 DOM 的 TouchEvent：
 * 一是包内 lib 不含 DOM，二是小程序端给的 touches / changedTouches 是普通数组、
 * H5 端给的是 TouchList，按 ArrayLike 声明才能同时接住两者。
 */
export type DraggableTouchEvent = {
  touches: ArrayLike<DraggableTouch>;
  changedTouches: ArrayLike<DraggableTouch>;
};

/** 拖拽配置 */
export type UseDraggableOptions = {
  /** 初始横坐标（px），默认贴右边缘 */
  initialX?: number;
  /** 初始纵坐标（px），默认距底部 bottomOffset */
  initialY?: number;
  /** 元素宽度（px），用于边界约束与吸附计算 */
  elementWidth?: number;
  /** 元素高度（px），用于边界约束 */
  elementHeight?: number;
  /**
   * 松手后是否吸附到最近的水平边缘
   * @default true
   */
  edgeSnap?: boolean;
  /** 位置持久化的缓存 key，留空则不持久化 */
  storageKey?: string;
  /**
   * 位移小于该值（px）视为点击而非拖拽
   * @default 10
   */
  threshold?: number;
  /**
   * 默认初始位置距屏幕底部的偏移（rpx）
   * @default 204
   */
  bottomOffset?: number;
};

/** 拖拽返回值 */
export type UseDraggableReturn = {
  /** 当前位置（px） */
  position: Ref<{ x: number; y: number }>;
  /** 当前实例是否正在拖拽 */
  isDragging: Ref<boolean>;
  /** 本次手势是否被判定为点击 */
  isTap: Ref<boolean>;
  onTouchStart: (e: DraggableTouchEvent) => void;
  onTouchMove: (e: DraggableTouchEvent) => void;
  onTouchEnd: (e: DraggableTouchEvent) => void;
  /** 手动吸附到最近的水平边缘 */
  snapToEdge: () => void;
};

// 模块级共享状态：当前正在拖拽的实例数。
// 用计数而非布尔量，避免多个可拖拽元素并存时，后一个 touchend 把前一个的状态冲掉。
const draggingCount = ref(0);
const globalDragging = computed(() => draggingCount.value > 0);

/**
 * 读取全局拖拽状态
 *
 * 典型用途是在页面 onPullDownRefresh 中判断当前是否有元素正在被拖拽，避免误触发下拉刷新。
 */
export function useDragState(): { dragging: ComputedRef<boolean> } {
  return { dragging: globalDragging };
}

/**
 * 可拖拽悬浮元素
 *
 * 提供边界约束、边缘吸附、点击与拖拽区分、位置持久化。
 * @param options 配置项
 */
export function useDraggable(options: UseDraggableOptions = {}): UseDraggableReturn {
  const {
    elementWidth = 0,
    elementHeight = 0,
    edgeSnap = true,
    storageKey = "",
    threshold = 10,
    bottomOffset = 204,
  } = options;

  // 屏幕尺寸在初始化时取一次，用于边界约束与吸附计算
  const { windowWidth: screenWidth, windowHeight: screenHeight } = uni.getSystemInfoSync();

  // 默认位置：贴右边缘，距底部 bottomOffset
  const defaultX = screenWidth - elementWidth;
  const defaultY = screenHeight - uni.upx2px(bottomOffset) - elementHeight;

  // 尝试从缓存恢复上次的位置
  let savedPosition: { x: number; y: number } | null = null;
  if (storageKey) {
    try {
      const stored = uni.getStorageSync(storageKey);
      if (stored && typeof stored === "object" && "x" in stored && "y" in stored) {
        savedPosition = stored as { x: number; y: number };
      }
    } catch {
      // 缓存不可用时退回默认位置
    }
  }

  const position = ref<{ x: number; y: number }>(
    savedPosition ?? {
      x: options.initialX ?? defaultX,
      y: options.initialY ?? defaultY,
    },
  );
  const isDragging = ref(false);
  const isTap = ref(false);

  // 拖拽过程中的临时量
  let startTouchX = 0;
  let startTouchY = 0;
  let startElementX = 0;
  let startElementY = 0;

  /** 把位置约束在屏幕内 */
  function clampPosition(x: number, y: number): { x: number; y: number } {
    return {
      x: Math.max(0, Math.min(x, screenWidth - elementWidth)),
      y: Math.max(0, Math.min(y, screenHeight - elementHeight)),
    };
  }

  /** 持久化当前位置 */
  function savePosition(): void {
    if (!storageKey) {
      return;
    }
    try {
      uni.setStorageSync(storageKey, { x: position.value.x, y: position.value.y });
    } catch {
      // 写缓存失败不影响拖拽本身
    }
  }

  function snapToEdge(): void {
    if (elementWidth <= 0) {
      return;
    }
    // 以元素中心判断更靠近左边缘还是右边缘
    const isNearLeft = position.value.x + elementWidth / 2 <= screenWidth / 2;
    const snappedX = isNearLeft ? 0 : screenWidth - elementWidth;
    position.value = { ...clampPosition(snappedX, position.value.y) };
    savePosition();
  }

  function onTouchStart(e: DraggableTouchEvent): void {
    const touch = e.touches[0];
    if (!touch) {
      return;
    }
    startTouchX = touch.clientX;
    startTouchY = touch.clientY;
    startElementX = position.value.x;
    startElementY = position.value.y;
    isDragging.value = true;
    isTap.value = false;
    draggingCount.value++;
  }

  function onTouchMove(e: DraggableTouchEvent): void {
    const touch = e.touches[0];
    if (!isDragging.value || !touch) {
      return;
    }
    position.value = clampPosition(
      startElementX + (touch.clientX - startTouchX),
      startElementY + (touch.clientY - startTouchY),
    );
  }

  function onTouchEnd(e: DraggableTouchEvent): void {
    if (!isDragging.value) {
      return;
    }

    // 总位移小于阈值判定为点击
    const touch = e.changedTouches[0];
    if (touch) {
      const distance = Math.sqrt(
        (touch.clientX - startTouchX) ** 2 + (touch.clientY - startTouchY) ** 2,
      );
      if (distance < threshold) {
        isTap.value = true;
      }
    }

    if (edgeSnap) {
      snapToEdge();
    } else {
      savePosition();
    }

    isDragging.value = false;
    draggingCount.value = Math.max(0, draggingCount.value - 1);
  }

  // 挂载时重新约束一次，覆盖屏幕旋转等场景
  onMounted(() => {
    position.value = { ...clampPosition(position.value.x, position.value.y) };
  });

  return {
    position,
    isDragging,
    isTap,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    snapToEdge,
  };
}
