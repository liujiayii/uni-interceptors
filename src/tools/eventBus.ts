type EventHandler = (...args: any[]) => void;

type EventHistoryItem = {
  args: any[];
  timestamp: number;
};

class EventBus {
  private events: Record<string, EventHandler[]> = {};
  private eventHistory: Record<string, EventHistoryItem[]> = {};
  private maxHistoryAge = 1000; // 事件历史记录的最大保存时间（毫秒）

  on(event: string, handler: EventHandler, triggerHistory = true): void {
    console.log(`EventBus: Registering listener for event '${event}' with triggerHistory: ${triggerHistory}`);

    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);

    // 检查是否有历史事件需要触发
    if (triggerHistory) {
      console.log(`EventBus: Checking for recent history events for '${event}'`);
      this.checkAndTriggerHistory(event, handler);
    }
  }

  off(event: string, handler: EventHandler): void {
    console.log(`EventBus: Removing listener for event '${event}'`);

    if (!this.events[event])
      return;

    const index = this.events[event].indexOf(handler);
    if (index !== -1) {
      this.events[event].splice(index, 1);
    }
  }

  emit(event: string, ...args: any[]): void {
    console.log(`EventBus: Emitting event '${event}' with args:`, args);

    // 先保存历史，再通知监听器（即使当前无监听器也记录，供后续回放）
    this.saveToHistory(event, args);

    const handlers = this.events[event];
    if (!handlers || handlers.length === 0)
      return;

    handlers.forEach((handler) => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  // 保存事件到历史记录
  private saveToHistory(event: string, args: any[]): void {
    console.log(`EventBus: Saving event '${event}' to history`);

    if (!this.eventHistory[event]) {
      this.eventHistory[event] = [];
    }

    // 清理过期的事件历史
    this.cleanExpiredHistory(event);

    // 添加新事件到历史记录
    this.eventHistory[event].push({
      args,
      timestamp: Date.now(),
    });
  }

  // 清理过期的事件历史
  private cleanExpiredHistory(event: string): void {
    if (!this.eventHistory[event])
      return;

    const now = Date.now();
    this.eventHistory[event] = this.eventHistory[event].filter(
      (item) => now - item.timestamp <= this.maxHistoryAge,
    );
  }

  // 检查并触发历史事件
  private checkAndTriggerHistory(event: string, handler: EventHandler): void {
    console.log(`EventBus: Checking history for event '${event}'`);

    if (!this.eventHistory[event] || this.eventHistory[event].length === 0) {
      console.log(`EventBus: No recent history found for event '${event}'`);
      return;
    }

    // 获取最新的历史事件
    const latestEvent = this.eventHistory[event][this.eventHistory[event].length - 1];
    const now = Date.now();
    const age = now - latestEvent.timestamp;

    console.log(`EventBus: Found recent event for '${event}' emitted ${age}ms ago, triggering callback`);

    // 如果事件未过期，则触发
    if (age <= this.maxHistoryAge) {
      try {
        handler(...latestEvent.args);
      } catch (error) {
        console.error(`Error in history event handler for ${event}:`, error);
      }
    }
  }

  // 清除特定事件的历史记录
  clearHistory(event?: string): void {
    console.log(`EventBus: Clearing ${event ? `history for event '${event}'` : "all event history"}`);

    if (event) {
      delete this.eventHistory[event];
    } else {
      this.eventHistory = {};
    }
  }
}

export const eventBus = new EventBus();
