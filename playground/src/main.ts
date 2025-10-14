import type { RouteInterceptorOptions } from "uni-toolkit";
import {
  chooseImageInterceptor,
  makePhoneCallInterceptor,
  RouteInterceptor,
  setClipboardDataInterceptor,
  setStorageInterceptor,
} from "uni-toolkit";
import { createSSRApp } from "vue";
import { isLogged, loginRoute, needLoginPages } from "@/interceptor/route";
import App from "./App.vue";
import "./nvue.css";
import "virtual:uno.css";

export function createApp(): any {
  const app = createSSRApp(App);
  app.use<RouteInterceptorOptions>(RouteInterceptor, { loginRoute, isLogged, needLoginPages });
  app.use(makePhoneCallInterceptor);
  app.use(chooseImageInterceptor);
  // #ifdef MP-KUAISHOU
  app.use(setStorageInterceptor);
  // #endif
  // #ifdef MP-TOUTIAO
  app.use(setClipboardDataInterceptor);
  // #endif
  return {
    app,
  };
}
