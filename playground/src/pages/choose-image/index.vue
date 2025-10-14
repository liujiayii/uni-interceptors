<script setup lang="ts">
import { useChooseImage } from "uni-toolkit";
import { ref } from "vue";

const selectedImages = ref<string[]>([]);
const logMessages = ref<Array<{ message: string; type: string }>>([]);
const sizeType = ref<string[]>(["compressed"]);
const count = ref<number>(3);

// 添加日志
function addLog(message: string, type: string = "info") {
  logMessages.value.unshift({
    message: `[${new Date().toLocaleTimeString()}] ${message}`,
    type,
  });
  // 限制日志数量
  if (logMessages.value.length > 20) {
    logMessages.value = logMessages.value.slice(0, 20);
  }
}

// 从相册选择
function chooseFromAlbum() {
  addLog("开始从相册选择图片", "info");
  uni.chooseImage({
    count: count.value,
    sizeType: sizeType.value,
    sourceType: ["album"],
    success: (res) => {
      addLog(`成功选择 ${res.tempFilePaths.length} 张图片`, "success");
      selectedImages.value = [...selectedImages.value, ...res.tempFilePaths];
    },
    fail: (err) => {
      addLog(`选择图片失败: ${err.errMsg}`, "error");
    },
  });
}

// 拍照
function takePhoto() {
  addLog("开始拍照", "info");
  uni.chooseImage({
    count: 1,
    sizeType: sizeType.value,
    sourceType: ["camera"],
    success: (res) => {
      addLog(`拍照成功`, "success");
      selectedImages.value = [...selectedImages.value, ...res.tempFilePaths];
    },
    fail: (err) => {
      addLog(`拍照失败: ${err.errMsg}`, "error");
    },
  });
}

// 相册或拍照
function chooseFromBoth() {
  addLog("开始选择图片（相册或拍照）", "info");
  uni.chooseImage({
    count: count.value,
    sizeType: sizeType.value,
    sourceType: ["album", "camera"],
    success: (res) => {
      addLog(`成功选择 ${res.tempFilePaths.length} 张图片`, "success");
      selectedImages.value = [...selectedImages.value, ...res.tempFilePaths];
    },
    fail: (err) => {
      addLog(`选择图片失败: ${err.errMsg}`, "error");
    },
  });
}

// 仅选择图片
function chooseImageOnly() {
  addLog("开始选择图片（使用chooseMedia）", "info");
  // uni.chooseMedia 在某些平台上可能不存在
  uni.chooseMedia({
    count: count.value,
    mediaType: ["image"],
    sourceType: ["album", "camera"],
    success: (res) => {
      addLog(`成功选择 ${res.tempFiles.length} 张图片`, "success");
      //  tempFiles 在某些平台上可能不存在
      const imagePaths = res.tempFiles.map((file: any) => file.tempFilePath);
      selectedImages.value = [...selectedImages.value, ...imagePaths];
    },
    fail: (err) => {
      addLog(`选择图片失败: ${err.errMsg}`, "error");
    },
  });
}

// 仅选择视频
function chooseVideoOnly() {
  addLog("开始选择视频（使用chooseMedia）", "info");
  //  uni.chooseMedia 在某些平台上可能不存在
  uni.chooseMedia({
    count: count.value,
    mediaType: ["video"],
    sourceType: ["album", "camera"],
    maxDuration: 60,
    success: (res) => {
      addLog(`成功选择 ${res.tempFiles.length} 个视频`, "success");
      //  tempFiles 在某些平台上可能不存在
      const videoPaths = res.tempFiles.map((file: any) => file.tempFilePath);
      // 这里可以添加视频显示逻辑
      console.log(videoPaths);
    },
    fail: (err) => {
      addLog(`选择视频失败: ${err.errMsg}`, "error");
    },
  });
}

// 图片或视频
function chooseBothMedia() {
  addLog("开始选择媒体（图片或视频）", "info");
  //  uni.chooseMedia 在某些平台上可能不存在
  uni.chooseMedia({
    count: count.value,
    mediaType: ["image", "video"],
    sourceType: ["album", "camera"],
    maxDuration: 60,
    success: (res) => {
      addLog(`成功选择 ${res.tempFiles.length} 个媒体文件`, "success");
      //  tempFiles 在某些平台上可能不存在
      const mediaPaths = res.tempFiles.map((file: any) => file.tempFilePath);
      selectedImages.value = [...selectedImages.value, ...mediaPaths];
    },
    fail: (err) => {
      addLog(`选择媒体失败: ${err.errMsg}`, "error");
    },
  });
}

// 使用高级选项选择
function chooseWithAdvancedOptions() {
  addLog(`使用高级选项选择图片: 数量=${count.value}, 质量=${sizeType.value.join(",")}`, "info");
  uni.chooseImage({
    count: count.value,
    sizeType: sizeType.value,
    sourceType: ["album", "camera"],
    success: (res) => {
      addLog(`成功选择 ${res.tempFilePaths.length} 张图片`, "success");
      selectedImages.value = [...selectedImages.value, ...res.tempFilePaths];
    },
    fail: (err) => {
      addLog(`选择图片失败: ${err.errMsg}`, "error");
    },
  });
}

// 使用 Hook
async function useChooseImageHook() {
  addLog("使用 useChooseImage Hook", "info");
  try {
    const res = await useChooseImage({
      count: count.value,
      sizeType: sizeType.value,
      sourceType: ["album", "camera"],
    });
    addLog(`Hook 成功选择 ${res.tempFilePaths.length} 张图片`, "success");
    selectedImages.value = [...selectedImages.value, ...res.tempFilePaths];
  } catch (err) {
    addLog(`Hook 选择图片失败: ${err}`, "error");
  }
}

// 预览图片
function previewImage(img: string) {
  uni.previewImage({
    current: img,
    urls: selectedImages.value,
  });
}

// 删除图片
function removeImage(index: number) {
  selectedImages.value.splice(index, 1);
  addLog("删除了一张图片", "info");
}

// 清空日志
function clearLogs() {
  logMessages.value = [];
}

// 图片质量变化
function onSizeTypeChange(e: any) {
  sizeType.value = e.detail.value;
}

// 数量变化
function onCountChange(e: any) {
  count.value = e.detail.value;
}
</script>

<template>
  <view class="container">
    <view class="header">
      <text class="title">
        图片选择示例
      </text>
      <text class="subtitle">
        展示 uni-toolkit 的 chooseImageInterceptor 功能
      </text>
    </view>

    <view class="section">
      <text class="section-title">
        基础图片选择
      </text>
      <view class="button-group">
        <button class="demo-button" @click="chooseFromAlbum">
          从相册选择
        </button>
        <button class="demo-button" @click="takePhoto">
          拍照
        </button>
        <button class="demo-button" @click="chooseFromBoth">
          相册或拍照
        </button>
      </view>
    </view>

    <view class="section">
      <text class="section-title">
        媒体选择 (chooseMedia)
      </text>
      <view class="button-group">
        <button class="demo-button" @click="chooseImageOnly">
          仅选择图片
        </button>
        <button class="demo-button" @click="chooseVideoOnly">
          仅选择视频
        </button>
        <button class="demo-button" @click="chooseBothMedia">
          图片或视频
        </button>
      </view>
    </view>

    <view class="section">
      <text class="section-title">
        高级选项
      </text>
      <view class="options">
        <view class="option-item">
          <text>图片质量：</text>
          <radio-group @change="onSizeTypeChange">
            <label><radio value="original" :checked="sizeType.includes('original')" />原图</label>
            <label><radio value="compressed" :checked="sizeType.includes('compressed')" />压缩</label>
          </radio-group>
        </view>
        <view class="option-item">
          <text>选择数量：</text>
          <slider :value="count" min="1" max="9" show-value @change="onCountChange" />
        </view>
      </view>
      <button class="demo-button primary" @click="chooseWithAdvancedOptions">
        使用高级选项选择
      </button>
    </view>

    <view class="section">
      <text class="section-title">
        使用 Hook
      </text>
      <view class="button-group">
        <button class="demo-button" @click="useChooseImageHook">
          useChooseImage Hook
        </button>
      </view>
    </view>

    <view v-if="selectedImages.length > 0" class="section">
      <text class="section-title">
        已选择的图片
      </text>
      <view class="image-grid">
        <view
          v-for="(img, index) in selectedImages"
          :key="index"
          class="image-item"
        >
          <image :src="img" mode="aspectFill" class="image" />
          <view class="image-actions">
            <text class="action-text" @click="previewImage(img)">
              预览
            </text>
            <text class="action-text remove" @click="removeImage(index)">
              删除
            </text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="logMessages.length > 0" class="section">
      <text class="section-title">
        操作日志
      </text>
      <view class="log-container">
        <text
          v-for="(log, index) in logMessages"
          :key="index"
          class="log-item" :class="[log.type]"
        >
          {{ log.message }}
        </text>
      </view>
      <button class="demo-button small" @click="clearLogs">
        清空日志
      </button>
    </view>
  </view>
</template>

<style>
.container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
}

.subtitle {
  font-size: 14px;
  color: #666;
  display: block;
}

.section {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  display: block;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.demo-button {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
}

.demo-button.primary {
  background-color: #ff9500;
}

.demo-button.small {
  background-color: #8e8e93;
  font-size: 12px;
  padding: 6px 12px;
}

.options {
  margin-bottom: 15px;
}

.option-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.option-item text {
  margin-right: 10px;
  min-width: 80px;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-item {
  position: relative;
  width: 100px;
  height: 100px;
}

.image {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.image-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-around;
  padding: 5px 0;
}

.action-text {
  color: white;
  font-size: 12px;
}

.action-text.remove {
  color: #ff3b30;
}

.log-container {
  max-height: 200px;
  overflow-y: auto;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.log-item {
  font-size: 12px;
  margin-bottom: 5px;
  display: block;
}

.log-item.success {
  color: #34c759;
}

.log-item.error {
  color: #ff3b30;
}

.log-item.info {
  color: #007aff;
}
</style>
