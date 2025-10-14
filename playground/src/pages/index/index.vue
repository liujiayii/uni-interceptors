<script setup lang="ts">
import { ref } from "vue";

const data = ref({
  data: "Hello World",
});

const selectedImages = ref<string[]>([]);

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
</style>
