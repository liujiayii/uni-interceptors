/**
 * 获取当前页面的路由路径
 * @returns 当前页面的路由路径，如果获取失败则返回空字符串
 */
export function getCurrentPageRoute(): string {
  try {
    const pages = getCurrentPages();
    if (pages && pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      return currentPage.route || "";
    }
  } catch (error) {
    console.warn("Error getting current page route:", error);
  }
  return "";
}
