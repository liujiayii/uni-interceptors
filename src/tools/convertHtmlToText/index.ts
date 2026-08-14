/**
 * 将 HTML 片段转换为纯文本，`</p>` 转为换行，其余标签直接剥离。
 *
 * 常见于富文本字段需要降级展示为纯文本的场景（如小程序不支持完整富文本渲染）。
 */
export function convertHtmlToText(htmlString: string): string {
  if (!htmlString)
    return "";

  return htmlString
    // 段落开标签直接去掉，闭标签转为换行
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/p>/gi, "\n")
    // 剥离其余所有标签
    .replace(/<[^>]+>/g, "")
    // 合并连续换行
    .replace(/\n+/g, "\n")
    .trim();
}
