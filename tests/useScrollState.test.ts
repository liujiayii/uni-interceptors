import { afterEach, describe, expect, it, vi } from "vitest";
import { createScrollState } from "../src/hooks/useScrollState";

describe("createScrollState", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts as not scrolling", () => {
    const { isScrolling } = createScrollState();
    expect(isScrolling.value).toBe(false);
  });

  it("flips to scrolling on the leading edge and recovers after the delay", () => {
    vi.useFakeTimers();
    const { isScrolling, scrollHandler } = createScrollState({ resumeDelay: 800 });

    scrollHandler();
    expect(isScrolling.value).toBe(true);

    vi.advanceTimersByTime(799);
    expect(isScrolling.value).toBe(true);

    vi.advanceTimersByTime(1);
    expect(isScrolling.value).toBe(false);
  });

  it("keeps refreshing the recovery timer while scrolling continues", () => {
    vi.useFakeTimers();
    // 关键回归点：持续滚动期间恢复计时器必须被不断重置，
    // 否则悬浮元素会在用户还在滚动时提前弹回来
    const { isScrolling, scrollHandler } = createScrollState({
      throttleMs: 100,
      resumeDelay: 800,
    });

    // 模拟 2 秒的连续滚动，每 100ms 触发一次
    for (let elapsed = 0; elapsed < 2000; elapsed += 100) {
      scrollHandler();
      vi.advanceTimersByTime(100);
      expect(isScrolling.value).toBe(true);
    }

    // 停止滚动后才回落
    vi.advanceTimersByTime(800);
    expect(isScrolling.value).toBe(false);
  });

  it("keeps separate instances independent", () => {
    vi.useFakeTimers();
    const first = createScrollState();
    const second = createScrollState();

    first.scrollHandler();

    expect(first.isScrolling.value).toBe(true);
    expect(second.isScrolling.value).toBe(false);
  });
});
