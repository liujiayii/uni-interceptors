<script setup lang="ts">
import useUserInfo from "@/hooks/useUserInfo";

const userInfo = useUserInfo();
</script>

<template>
  <view>
    <view>登录状态：{{ userInfo.isLogin }}</view>
    <button @click="userInfo.toggleLogin">
      切换登录状态
    </button>
  </view>
</template>
