<script setup lang="ts">
import { ref } from "vue";

const data = ref({
  data: "Hello World",
});

const selectedImages = ref<string[]>([]);

// EventChannel 引用，用于后续再次发送数据
const eventChannelRef = ref<WechatMiniprogram.EventChannel | null>(null);

// 从接收页面收到的数据日志列表
const eventChannelReceivedLogs = ref<string[]>([]);

function makePhoneCall() {
  uni.makePhoneCall({
    phoneNumber: "10086",
  });
}

function navigateTo() {
  uni.navigateTo({
    url: "/pages/need-login/index",
  });
}

function setClipboardData() {
  uni.setClipboardData({
    data: data.value.data,
  });
}

function setStorage() {
  uni.setStorage({
    key: "name",
    data: data.value,
  });
}

function chooseImage() {
  uni.chooseImage({
    count: 3,
    sizeType: ["original", "compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      console.log("选择图片成功", res);
      selectedImages.value = res.tempFilePaths as string[];
      uni.showToast({
        title: `成功选择${res.tempFilePaths.length}张图片`,
        icon: "success",
      });
    },
    fail: (err) => {
      console.error("选择图片失败", err);
      uni.showToast({
        title: "选择图片失败",
        icon: "none",
      });
    },
  });
}

function chooseMedia() {
  //  uni.chooseMedia 在某些平台上可能不存在
  uni.chooseMedia({
    count: 3,
    mediaType: ["image", "video"],
    sourceType: ["album", "camera"],
    maxDuration: 30,
    camera: "back",
    success: (res) => {
      console.log("选择媒体成功", res);
      //  tempFiles 在某些平台上可能不存在
      selectedImages.value = res.tempFiles.map((file: any) => file.tempFilePath);
      uni.showToast({
        title: `成功选择${res.tempFiles.length}个文件`,
        icon: "success",
      });
    },
    fail: (err) => {
      console.error("选择媒体失败", err);
      uni.showToast({
        title: "选择媒体失败",
        icon: "none",
      });
    },
  });
}

function navigateToChooseImageDemo() {
  uni.navigateTo({
    url: "/pages/choose-image/index",
  });
}

function navigateToTestHooks() {
  uni.navigateTo({
    url: "/pages/test-hooks",
  });
}

// 跳转到 EventChannel 示例页面
function navigateToEventChannelDemo() {
  uni.navigateTo({
    url: "/pages/use-event-channel/index",
    // 监听接收页面发来的事件
    events: {
      sendDataToOpenerPage: (data: { reply: string; timestamp: number }) => {
        const time = new Date().toLocaleTimeString();
        eventChannelReceivedLogs.value.unshift(
          `[${time}] 收到回传: reply=${data.reply}, timestamp=${data.timestamp}`,
        );
        uni.showToast({
          title: `收到回传: ${data.reply}`,
          icon: "none",
        });
      },
    },
    success: (res) => {
      // 保存 eventChannel 引用，用于后续再次发送
      eventChannelRef.value = res.eventChannel;
      // 通过 eventChannel 向接收页面发送初始数据
      res.eventChannel.emit("acceptDataFromOpenerPage", {
        id: 1,
        name: "首页",
        message: "来自首页的问候",
      });
    },
  });
}

// 通过保存的 eventChannel 再次发送数据
function sendDataToReceiver() {
  if (!eventChannelRef.value) {
    uni.showToast({
      title: "EventChannel 不可用（请先跳转到示例页面）",
      icon: "none",
    });
    return;
  }
  eventChannelRef.value.emit("acceptDataFromOpenerPage", {
    id: Date.now(),
    name: "首页(再次发送)",
    message: `再次发送的数据 - ${new Date().toLocaleTimeString()}`,
  });
  uni.showToast({
    title: "已再次发送数据",
    icon: "success",
  });
}
</script>

<template>
  <view class="pt-20 gap-20">
    <button @click="makePhoneCall">
      uni.makePhoneCall
    </button>
    <button @click="setClipboardData">
      uni.setClipboardData
    </button>
    <button @click="setStorage">
      uni.setStorage
    </button>
    <view class="flex-row">
      <button @click="navigateTo">
        uni.navigateTo
      </button>
      <navigator url="/pages/login/index">
        <button>
          登录页
        </button>
      </navigator>
    </view>
    <button @click="setStorage">
      uni.getLocation(计划中)
    </button>
    <button @click="setStorage">
      uni.chooseLocation(计划中)
    </button>
    <button @click="chooseImage">
      uni.chooseImage
    </button>
    <button @click="chooseMedia">
      uni.chooseMedia
    </button>
    <button @click="navigateToChooseImageDemo">
      图片选择示例页面
    </button>
    <button @click="navigateToTestHooks">
      Hooks测试页面
    </button>
    <button @click="navigateToEventChannelDemo">
      EventChannel 示例
    </button>
    <button @click="sendDataToReceiver">
      再次发送数据（EventChannel）
    </button>

    <!-- 显示从接收页面收到的回传数据 -->
    <view v-if="eventChannelReceivedLogs.length > 0" class="mt-20">
      <text class="block mb-10">
        EventChannel 收到的回传数据：
      </text>
      <view class="log-list">
        <view v-for="(log, index) in eventChannelReceivedLogs" :key="index" class="log-item">
          {{ log }}
        </view>
      </view>
    </view>

    <!-- 显示选择的图片 -->
    <view v-if="selectedImages.length > 0" class="mt-20">
      <text class="block mb-10">
        已选择的图片：
      </text>
      <view class="flex-row flex-wrap gap-10">
        <image
          v-for="(img, index) in selectedImages"
          :key="index"
          :src="img"
          mode="aspectFill"
          class="w-100 h-100"
        />
      </view>
    </view>
  </view>
</template>

<style>
.flex-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.flex-wrap {
  flex-wrap: wrap;
}
.gap-10 {
  gap: 10px;
}
.gap-20 {
  gap: 20px;
}
.mt-20 {
  margin-top: 20px;
}
.mb-10 {
  margin-bottom: 10px;
}
.block {
  display: block;
}
.w-100 {
  width: 100px;
}
.h-100 {
  height: 100px;
}
.pt-20 {
  padding-top: 20px;
}
.log-list {
  margin-top: 10px;
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 6px;
}
.log-item {
  padding: 4px 0;
  font-size: 12px;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
}
</style>
