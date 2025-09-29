import type { Ref } from "vue";
import { ref, watch } from "vue";

type IUserInfo = { isLogin: boolean; toggleLogin: () => void };

const STORAGE_KEY = "user_login_status";

export default function useUserInfo(): Ref<IUserInfo> {
  const storedStatus = localStorage.getItem(STORAGE_KEY);
  const initialStatus = storedStatus ? JSON.parse(storedStatus) : false;

  const userInfo = ref<IUserInfo>({
    isLogin: initialStatus,
    toggleLogin() {
      userInfo.value.isLogin = !userInfo.value.isLogin;
    },
  });

  watch(
    () => userInfo.value.isLogin,
    (newStatus) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatus));
    },
  );

  return userInfo;
}
