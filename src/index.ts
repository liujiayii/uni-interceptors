export { isMpWeiXinWork } from "./env";

export {
  createEventChannelActions,
  createScrollState,
  scrollHandler,
  triggerScroll,
  useChooseImage,
  useDesignSize,
  useDraggable,
  useDragState,
  useEventChannel,
  useInstance,
  useOnShow,
  useScrollState,
} from "./hooks";

export {
  type DraggableTouch,
  type DraggableTouchEvent,
  type ScrollState,
  type ScrollStateOptions,
  type UseDraggableOptions,
  type UseDraggableReturn,
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
  convertHtmlToText,
  getCurrentPageRoute,
  getSafeAreaTop,
  getSingleNodeInfo,
  isPageLevelComponent,
  openDocumentByUrl,
  requestPermissions,
  shouldShowRequestPermissionRationale,
  showAuthTip,
  showManualAuth,
} from "./tools";

export {
  type GetSafeAreaTopOptions,
  type OpenDocumentMessages,
  type OpenDocumentOptions,
} from "./tools";

export type { MiniProgramPlatform } from "./typings";
