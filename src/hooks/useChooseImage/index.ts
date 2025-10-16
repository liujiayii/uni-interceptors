export function useChooseImage(opts: UniApp.ChooseImageOptions): Promise<UniApp.ChooseImageSuccessCallbackResult> {
  const {
    count,
    sizeType = ["original", "compressed"],
    sourceType,
    extension,
  } = opts;
  return new Promise((resolve, reject) => {
    // 微信由于旧接口不再维护，针对微信小程序平台改用chooseMedia接口
    // #ifdef MP-WEIXIN
    if (extension) {
      console.warn(
        "[uni-toolkit] 在微信小程序平台，chooseMedia接口不支持精确的扩展名过滤。\n"
        + "传入的extension参数将被忽略，如需过滤文件类型，请使用其他方式。\n"
        + "详情请参考：https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseMedia.html",
      );
    }

    const chooseMediaOptions: UniApp.ChooseMediaOption = {
      count,
      sizeType: Array.isArray(sizeType) && sizeType.length > 0
        ? sizeType
        : ["original", "compressed"],

      sourceType: (Array.isArray(sourceType) ? sourceType : undefined) as ("album" | "camera")[] | undefined,
      mediaType: ["image"],
    };

    uni.chooseMedia({
      ...chooseMediaOptions,
      success(res) {
        const normalizedRes = normalizeChooseMediaRes(res as any);
        resolve(normalizedRes);
      },
      fail(res) {
        console.error("chooseMedia failed:", res);
        reject(new Error(`选择图片失败: ${res.errMsg}`));
      },
    });
    // #endif
    // #ifndef MP-WEIXIN
    uni.chooseImage({
      count,
      sizeType,
      sourceType,
      extension,
      success(res) {
        resolve(normalizeChooseAndUploadFileRes(res, "image"));
      },
      fail(res) {
        console.error("chooseImage failed:", res);
        reject(new Error(`选择图片失败: ${res.errMsg}`));
      },
    });
    // #endif
  });
}

/**
 * 从文件路径中提取文件名和扩展名
 * @param filePath 文件路径
 * @returns 包含文件名和扩展名的对象
 */
function extractFileNameAndExtension(filePath: string): { fileName: string; extension: string } {
  const lastSlashIndex = filePath.lastIndexOf("/");
  const fileName = lastSlashIndex >= 0 ? filePath.substring(lastSlashIndex + 1) : filePath;
  const dotIndex = fileName.lastIndexOf(".");
  const extension = dotIndex >= 0 ? fileName.substring(dotIndex) : "";

  return { fileName, extension };
}

function normalizeChooseMediaRes(res: any): UniApp.ChooseImageSuccessCallbackResult {
  // chooseMedia 返回的 tempFiles 数组中每个对象包含 tempFilePath 和 size 字段
  const tempFilePaths: string[] = res.tempFiles.map((item: any) => item.tempFilePath);
  const timestamp = Date.now();
  const tempFiles: UniApp.ChooseImageSuccessCallbackResult["tempFiles"] = res.tempFiles.map((item: any, index: number) => {
    // 从 tempFilePath 中提取文件名和扩展名
    const tempFilePath = item.tempFilePath;
    const { fileName, extension } = extractFileNameAndExtension(tempFilePath);

    return {
      path: tempFilePath, // 注意：chooseMedia 返回的是 tempFilePath，需要转换为 path
      size: item.size,
      name: fileName,
      fileType: "image",
      cloudPath: `${timestamp}_${index}${extension}`,
    };
  });

  const result: UniApp.ChooseImageSuccessCallbackResult = {
    tempFilePaths,
    tempFiles,
  };
  return result;
}

function normalizeChooseAndUploadFileRes(res: UniApp.ChooseImageSuccessCallbackResult, fileType: string): UniApp.ChooseImageSuccessCallbackResult {
  // 确保 tempFiles 是数组类型
  const tempFilesArray = Array.isArray(res.tempFiles) ? res.tempFiles : [res.tempFiles];

  // 在map外部捕获时间戳，确保同次选择的多个文件cloudPath前缀一致
  const timestamp = Date.now();

  // 创建一个新的对象，避免直接修改输入参数
  const result: UniApp.ChooseImageSuccessCallbackResult = {
    tempFilePaths: res.tempFilePaths || tempFilesArray.map((file: any) => file.path),
    tempFiles: tempFilesArray.map((item: any, index: number) => {
      const path = item.path || item.tempFilePath; // 处理可能的字段差异
      const name = item.name || path.substring(path.lastIndexOf("/") + 1);
      const { extension } = extractFileNameAndExtension(name);

      return {
        path,
        size: item.size,
        name,
        fileType: fileType || item.fileType,
        cloudPath: item.cloudPath || `${timestamp}_${index}${extension}`,
      };
    }),
  };
  return result;
}
