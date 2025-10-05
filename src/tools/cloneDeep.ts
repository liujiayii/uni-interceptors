/**
 * 深拷贝
 * @param obj 待克隆的对象
 * @returns 克隆后的对象
 * @description es-toolkit 中的 cloneDeep 对 Blob 做了克隆，但Blob在小程序中无法使用，所以这里自己实现了一份
 * @description 使用 JSON 序列化进行深拷贝，适用于简单对象
 * @warning 不支持函数、undefined、Symbol、循环引用、Date、RegExp、Map、Set 等类型
 * @throws 当遇到无法序列化的对象时抛出错误
 */
export function cloneDeep<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error("cloneDeep error: 无法克隆对象", error);
    throw new Error(`Failed to clone object: ${(error as Error).message}`);
  }
}
