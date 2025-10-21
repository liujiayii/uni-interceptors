export { isMpWeiXinWork } from "./env";

export {
  useChooseImage,
  useDesignSize,
  useOnShow,
} from "./hooks";

export {
  checkLoginAndRedirect,
  chooseImageInterceptor,
  chooseLocationInterceptor,
  makePhoneCallInterceptor,
  routeInterceptor,
  setClipboardDataInterceptor,
  setStorageInterceptor,
} from "./interceptors";

export { type RouteInterceptorOptions } from "./interceptors";

export {
  authTips,
  AuthType,
  checkAndRequestImageAuth,
  checkAndRequestLocationAuth,
  checkPermissions,
  checkSelfPermission,
  cloneDeep,
  getCurrentPageRoute,
  isPageLevelComponent,
  requestPermissions,
  shouldShowRequestPermissionRationale,
  showAuthTip,
  showManualAuth,
} from "./tools";

export type { MiniProgramPlatform } from "./typings";
