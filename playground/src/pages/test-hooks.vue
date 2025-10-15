<script setup lang="ts">
import { ref } from "vue";
import { useChooseImage, useDesignSize, useOnShow } from "../../src/index";

// 测试 useDesignSize
const designSize = useDesignSize();

// 测试 useOnShow
const showCount = ref(0);
function resetCount() {
  showCount.value = 0;
}

useOnShow(() => {
  showCount.value++;
});

// 测试 useChooseImage
const imagePath = ref("");
async function chooseImage() {
  try {
    const res = await useChooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
    });
    imagePath.value = res.tempFilePaths[0];
  } catch (error) {
    console.error("选择图片失败:", error);
    uni.showToast({
      title: "选择图片失败",
      icon: "none",
    });
  }
}
</script>

<template>
  <view class="container">
    <view class="header">
      uni-toolkit Hooks 测试
    </view>

    <view class="section">
      <view class="section-title">
        useDesignSize 测试
      </view>
      <view>屏幕宽度: {{ designSize.width }}</view>
      <view>屏幕高度: {{ designSize.height }}</view>
      <view>rpx转换比率: {{ designSize.rate }}</view>
    </view>

    <view class="section">
      <view class="section-title">
        useOnShow 测试
      </view>
      <view>页面显示次数: {{ showCount }}</view>
      <button @click="resetCount">
        重置计数
      </button>
    </view>

    <view class="section">
      <view class="section-title">
        useChooseImage 测试
      </view>
      <button @click="chooseImage">
        选择图片
      </button>
      <view v-if="imagePath" class="image-preview">
        <image :src="imagePath" mode="aspectFit" />
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

.image-preview {
  margin-top: 10px;
  width: 100%;
  height: 200px;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-preview image {
  max-width: 100%;
  max-height: 100%;
}
</style>
