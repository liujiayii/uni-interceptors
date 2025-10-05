/**
 * 深拷贝
 * @param obj 待克隆的对象
 * @returns 克隆后的对象
 * @description es-toolkit 中的 cloneDeep 对 Blob 做了克隆，但Blob在小程序中无法使用，所以这里自己实现了一份
 */
export function cloneDeep<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.log("cloneDeep error", error);
    return obj;
  }
}
