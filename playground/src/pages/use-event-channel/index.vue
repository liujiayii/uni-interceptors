<script setup lang="ts">
import { useEventChannel } from "uni-toolkit";
import { onMounted, onUnmounted, ref } from "vue";

// 定义事件数据类型映射（使用 type 而非 interface，符合 eslint 规则）
type IMyEventMap = {
  // 从上一个页面接收的数据事件
  acceptDataFromOpenerPage: { id: number; name: string; message: string };
  // 向上一个页面发送的数据事件
  sendDataToOpenerPage: { reply: string; timestamp: number };
};

// 使用 useEventChannel 获取类型安全的 EventChannel
const channel = useEventChannel<IMyEventMap>();

// 是否成功获取 EventChannel
const hasChannel = ref(false);

// 是否已手动移除监听
const isListenerOff = ref(false);

// 从上一个页面接收到的数据
const receivedData = ref<{ id: number; name: string; message: string } | null>(null);

// 日志列表
const logList = ref<string[]>([]);

// 要发送的回复内容
const replyContent = ref("收到啦～");

// 添加日志
function addLog(msg: string) {
  const time = new Date().toLocaleTimeString();
  logList.value.unshift(`[${time}] ${msg}`);
}

onMounted(() => {
  if (channel) {
    hasChannel.value = true;

    // 使用 on 方法监听来自上一个页面的数据
    channel.on("acceptDataFromOpenerPage", (data) => {
      receivedData.value = data;
      addLog(`[on] 收到数据: id=${data.id}, name=${data.name}, message=${data.message}`);
    });

    addLog("[on] 已注册 acceptDataFromOpenerPage 监听");
  } else {
    hasChannel.value = false;
    addLog("EventChannel 获取失败（请通过 navigateTo 打开此页面）");
  }
});

// 组件卸载时记录日志，验证自动清理监听器
onUnmounted(() => {
  console.log("[useEventChannel demo] 组件卸载，自动清理监听器");
  addLog("[unmounted] 组件卸载，自动清理监听器");
});

// 向上一个页面发送数据（emit 演示）
function emitToOpener() {
  if (!channel) {
    uni.showToast({ title: "EventChannel 不可用", icon: "none" });
    return;
  }

  const data = {
    reply: replyContent.value,
    timestamp: Date.now(),
  };

  // 使用 emit 方法向上一个页面发送数据
  channel.emit("sendDataToOpenerPage", data);
  addLog(`[emit] 已发送数据: reply=${data.reply}, timestamp=${data.timestamp}`);

  uni.showToast({ title: "发送成功", icon: "success" });
}

// 手动移除监听（off 演示）
function offListener() {
  if (!channel) {
    uni.showToast({ title: "EventChannel 不可用", icon: "none" });
    return;
  }

  if (isListenerOff.value) {
    uni.showToast({ title: "监听已被移除，无需重复操作", icon: "none" });
    return;
  }

  // 使用 off 方法手动移除 acceptDataFromOpenerPage 的所有监听
  channel.off("acceptDataFromOpenerPage");
  isListenerOff.value = true;
  addLog("[off] 已手动移除 acceptDataFromOpenerPage 监听");

  uni.showToast({ title: "监听已移除", icon: "none" });
}

// 返回上一页，触发组件卸载（自动卸载验证）
function goBack() {
  addLog("[navigateBack] 即将返回上一页，触发组件卸载...");
  uni.navigateBack();
}

// 清空日志
function clearLogs() {
  logList.value = [];
  receivedData.value = null;
}

// 从首页跳转到此页面（带 EventChannel 数据，用于演示）
function navigateWithChannel() {
  uni.navigateTo({
    url: "/pages/use-event-channel/index",
    success: (res) => {
      // 通过 EventChannel 向新页面发送数据
      res.eventChannel.emit("acceptDataFromOpenerPage", {
        id: 1,
        name: "主人",
        message: "这是从上一个页面传来的数据哦～",
      });
    },
  });
}
</script>

<template>
  <view class="container">
    <view class="header">
      useEventChannel 示例
    </view>

    <!-- EventChannel 状态提示 -->
    <view class="section">
      <view class="section-title">
        EventChannel 状态
      </view>
      <view v-if="hasChannel" class="status-success">
        ✅ EventChannel 获取成功
      </view>
      <view v-else class="status-fail">
        ❌ EventChannel 获取失败
      </view>
      <view v-if="!hasChannel" class="tip">
        💡 提示：此页面需要通过 uni.navigateTo 打开才能获取 EventChannel
      </view>
      <button v-if="!hasChannel" class="mt-10" @click="navigateWithChannel">
        重新通过 navigateTo 打开此页面
      </button>
    </view>

    <!-- on 监听演示 -->
    <view class="section">
      <view class="section-title">
        接收数据（on 监听）
      </view>
      <view v-if="isListenerOff" class="status-fail">
        ⚠️ 监听已被手动移除（off），不会再收到数据
      </view>
      <view v-if="receivedData" class="data-card">
        <view>ID: {{ receivedData.id }}</view>
        <view>姓名: {{ receivedData.name }}</view>
        <view>消息: {{ receivedData.message }}</view>
      </view>
      <view v-else class="no-data">
        暂无数据，等待上一个页面 emit...
      </view>
    </view>

    <!-- emit 发送演示 -->
    <view class="section">
      <view class="section-title">
        发送数据（emit）
      </view>
      <input
        v-model="replyContent"
        class="input"
        placeholder="输入要回复的内容"
      >
      <button class="mt-10" @click="emitToOpener">
        发送数据（emit）
      </button>
    </view>

    <!-- off 手动移除演示 -->
    <view class="section">
      <view class="section-title">
        手动移除监听（off）
      </view>
      <view class="desc">
        点击后调用 channel.off("acceptDataFromOpenerPage")，移除后再发送数据将不再触发回调
      </view>
      <button
        class="mt-10" :class="[isListenerOff ? 'btn-disabled' : '']"
        :disabled="isListenerOff"
        @click="offListener"
      >
        {{ isListenerOff ? "已移除监听" : "移除监听（off）" }}
      </button>
    </view>

    <!-- 自动卸载验证 -->
    <view class="section">
      <view class="section-title">
        自动卸载验证
      </view>
      <view class="desc">
        点击返回上一页，组件卸载时 useEventChannel 会自动清理所有通过 on 注册的监听器，可在控制台和日志面板查看
      </view>
      <button class="btn-warning mt-10" @click="goBack">
        返回上一页（触发卸载）
      </button>
    </view>

    <!-- 日志面板 -->
    <view class="section">
      <view class="section-title">
        事件日志
      </view>
      <button size="mini" @click="clearLogs">
        清空日志
      </button>
      <view v-if="logList.length > 0" class="log-list">
        <view v-for="(log, index) in logList" :key="index" class="log-item">
          {{ log }}
        </view>
      </view>
      <view v-else class="no-data">
        暂无日志
      </view>
    </view>
  </view>
</template>

<style>
.container {
  padding: 20px;
}

.header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.status-success {
  color: #07c160;
  font-weight: bold;
}

.status-fail {
  color: #fa5151;
  font-weight: bold;
}

.tip {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #fff7e6;
  border-radius: 4px;
  font-size: 13px;
  color: #ed6a0c;
}

.data-card {
  padding: 10px;
  background-color: #f0f9eb;
  border-radius: 6px;
  border: 1px solid #e1f3d8;
}

.data-card view {
  margin-bottom: 4px;
  font-size: 14px;
}

.no-data {
  color: #999;
  font-size: 14px;
}

.input {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
}

.mt-10 {
  margin-top: 10px;
}

.btn-disabled {
  opacity: 0.5;
}

.btn-warning {
  background-color: #fa5151;
  color: #fff;
}

.log-list {
  margin-top: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  padding: 4px 0;
  font-size: 12px;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
}
</style>
