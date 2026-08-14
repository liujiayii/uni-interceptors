/**
 * 统一取单个节点信息
 *
 * 各端 createSelectorQuery 的 boundingClientRect 回调返回值形态不一致，
 * 有的给数组、有的给单个对象、失败时还可能给空值，这里统一归一化。
 * @param data 节点信息数组、单个节点信息或空值
 * @returns 第一个节点信息，无有效值时返回空
 */
export function getSingleNodeInfo(
  data: UniNamespace.NodeInfo | UniNamespace.NodeInfo[] | null | undefined,
): UniNamespace.NodeInfo | null | undefined {
  return Array.isArray(data) ? data[0] : data;
}
