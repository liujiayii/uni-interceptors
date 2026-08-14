/** 打开文档时的提示文案 */
export type OpenDocumentMessages = {
  /** 地址为空时的提示 */
  emptyUrl?: string;
  /** 下载中的 loading 文案 */
  loading?: string;
  /** 下载失败的提示 */
  downloadFailed?: string;
  /** 打开失败的提示 */
  openFailed?: string;
};

/** 打开文档配置 */
export type OpenDocumentOptions = {
  /** 覆盖默认提示文案，传空字符串可关闭对应提示 */
  messages?: OpenDocumentMessages;
  /**
   * 打开后是否显示右上角菜单
   * @default true
   */
  showMenu?: boolean;
};

const defaultMessages: Required<OpenDocumentMessages> = {
  emptyUrl: "文档地址不存在",
  loading: "文档加载中...",
  downloadFailed: "文档下载失败",
  openFailed: "文档打开失败",
};

/** 有文案才提示，便于调用方传空字符串关掉某一条 */
function toast(title: string): void {
  if (title) {
    uni.showToast({ title, icon: "none" });
  }
}

/**
 * 下载并打开在线文档
 * @param url 文档地址
 * @param options 配置项
 * @returns 下载到本地的临时文件路径
 */
export function openDocumentByUrl(url: string, options: OpenDocumentOptions = {}): Promise<string> {
  const messages = { ...defaultMessages, ...options.messages };
  const { showMenu = true } = options;

  return new Promise<string>((resolve, reject) => {
    if (!url) {
      toast(messages.emptyUrl);
      reject(new Error("openDocumentByUrl: url is empty"));
      return;
    }

    if (messages.loading) {
      uni.showLoading({ title: messages.loading, mask: true });
    }

    uni.downloadFile({
      url,
      success: ({ statusCode, tempFilePath }) => {
        if (statusCode !== 200 || !tempFilePath) {
          uni.hideLoading();
          toast(messages.downloadFailed);
          reject(new Error(`openDocumentByUrl: download failed with status ${statusCode}`));
          return;
        }

        uni.openDocument({
          filePath: tempFilePath,
          showMenu,
          success: () => {
            uni.hideLoading();
            resolve(tempFilePath);
          },
          fail: (error) => {
            uni.hideLoading();
            toast(messages.openFailed);
            reject(error);
          },
        });
      },
      fail: (error) => {
        uni.hideLoading();
        toast(messages.downloadFailed);
        reject(error);
      },
    });
  });
}
