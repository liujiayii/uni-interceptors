<script setup lang="ts">
import { ref } from "vue";

const data = ref({
  data: "Hello World",
});

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
    <button @click="setStorage">
      uni.chooseImage(计划中)
    </button>
    <button @click="setStorage">
      uni.chooseMedia(计划中)
    </button>
  </view>
</template>

<style>

</style>
