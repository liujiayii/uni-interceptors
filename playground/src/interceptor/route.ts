import useUserInfo from "@/hooks/useUserInfo";

export const loginRoute = "/pages/login/index";

export function isLogged(): boolean {
  const userInfo = useUserInfo();
  return userInfo.value.isLogin;
}

export const needLoginPages: string[] = [
  "/pages/need-login/index",
];
