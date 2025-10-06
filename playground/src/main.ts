import type { RouteInterceptorOptions } from "uni-toolkit";
import {
  makePhoneCallInterceptor,
  RouteInterceptor,
  SetClipboardDataInterceptor,
  StorageInterceptor,
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
  // #ifdef MP-KUAISHOU
  app.use(StorageInterceptor);
  // #endif
  // #ifdef MP-TOUTIAO
  app.use(SetClipboardDataInterceptor);
  // #endif
  return {
    app,
  };
}
