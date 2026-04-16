<script setup lang="ts">
import { useInstance } from "uni-toolkit";
import { ref } from "vue";

// 基础用法：获取组件实例
const instance = useInstance();

// 检测实例是否存在
const hasInstance = ref(!!instance);

// 检测 $props 是否存在
const hasProps = ref(!!instance?.$props);

// 检测 $el 是否存在
const hasEl = ref(!!instance?.$el);

// 使用 template ref 配合 useInstance 访问 DOM 元素
const boxRef = ref<HTMLElement | null>(null);

// 获取 ref 元素信息的响应式变量
const refInfo = ref("点击下方按钮获取信息");

// 通过 $refs 访问 DOM 元素
function getRefInfo() {
  if (instance && instance.$refs) {
    const box = instance.$refs.boxRef as HTMLElement | undefined;
    if (box) {
      refInfo.value = `元素标签: ${box.tagName}, 宽度: ${box.clientWidth}px, 高度: ${box.clientHeight}px`;
    } else {
      refInfo.value = "未找到 ref 元素";
    }
  } else {
    refInfo.value = "实例或 $refs 不存在";
  }
}

// 泛型用法演示：定义自定义组件实例类型
type MyComponentInstance = {
  customMethod: () => string;
  customData: number;
};

// 使用泛型获取实例（类型推断更精确）
const typedInstance = useInstance<MyComponentInstance>();

// 泛型实例信息
const typedInfo = ref("点击下方按钮查看泛型实例信息");

function checkTypedInstance() {
  if (typedInstance) {
    typedInfo.value = `泛型实例存在，可访问自定义属性：customMethod 类型=${typeof typedInstance.customMethod}, customData 类型=${typeof typedInstance.customData}`;
  } else {
    typedInfo.value = "泛型实例为 null";
  }
}
</script>

<template>
  <view class="container">
    <view class="header">
      useInstance 示例
    </view>

    <!-- 基础用法：获取组件实例 -->
    <view class="section">
      <view class="section-title">
        基础用法
      </view>
      <view>实例是否存在: {{ hasInstance ? '✅ 是' : '❌ 否' }}</view>
      <view>$props 是否存在: {{ hasProps ? '✅ 是' : '❌ 否' }}</view>
      <view>$el 是否存在: {{ hasEl ? '✅ 是' : '❌ 否' }}</view>
    </view>

    <!-- template ref 配合 $refs 访问 DOM -->
    <view class="section">
      <view class="section-title">
        template ref + $refs 访问 DOM
      </view>
      <view
        ref="boxRef"
        class="demo-box"
      >
        我是一个可被 ref 引用的元素
      </view>
      <view class="info-text">
        {{ refInfo }}
      </view>
      <button @click="getRefInfo">
        获取 ref 元素信息
      </button>
    </view>

    <!-- 泛型用法演示 -->
    <view class="section">
      <view class="section-title">
        泛型用法
      </view>
      <view class="info-text">
        {{ typedInfo }}
      </view>
      <button @click="checkTypedInstance">
        检查泛型实例
      </button>
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

.demo-box {
  width: 200px;
  height: 80px;
  background-color: #e8f4fd;
  border: 2px solid #4fc3f7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  color: #0277bd;
  font-size: 14px;
}

.info-text {
  margin: 10px 0;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
}
</style>
