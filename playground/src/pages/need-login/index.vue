<script setup lang="ts">
import useUserInfo from "@/hooks/useUserInfo";

const userInfo = useUserInfo();
</script>

<template>
  <view>
    <view>我需要登录才能进来</view>
    <view>登录状态：{{ userInfo.isLogin }}</view>
  </view>
</template>
