<script setup lang="ts">
import { isH5 } from "uni-interceptors/env";

console.log(isH5);
function makePhoneCall() {
  uni.makePhoneCall({
    phoneNumber: "10086",
  });
}
</script>

<template>
  <view class="items-center pt-20">
    <button class="w-80%" @click="makePhoneCall">
      打电话
    </button>
  </view>
</template>

<style>

</style>
