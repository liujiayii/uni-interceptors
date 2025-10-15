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

function normalizeChooseMediaRes(res: any): UniApp.ChooseImageSuccessCallbackResult {
  // chooseMedia 返回的 tempFiles 数组中每个对象包含 tempFilePath 和 size 字段
  const tempFilePaths: string[] = res.tempFiles.map((item: any) => item.tempFilePath);
  const timestamp = Date.now();
  const tempFiles: UniApp.ChooseImageSuccessCallbackResult["tempFiles"] = res.tempFiles.map((item: any, index: number) => {
    // 从 tempFilePath 中提取文件名和扩展名
    const tempFilePath = item.tempFilePath;
    const lastSlashIndex = tempFilePath.lastIndexOf("/");
    const fileName = lastSlashIndex >= 0 ? tempFilePath.substring(lastSlashIndex + 1) : tempFilePath;
    const dotIndex = fileName.lastIndexOf(".");
    const extension = dotIndex >= 0 ? fileName.substring(dotIndex) : "";

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

  // 创建一个新的对象，避免直接修改输入参数
  const result: UniApp.ChooseImageSuccessCallbackResult = {
    tempFilePaths: res.tempFilePaths || tempFilesArray.map((file: any) => file.path),
    tempFiles: tempFilesArray.map((item: any, index: number) => {
      // 捕获一个时间戳，确保 cloudPath 的唯一性和一致性
      const timestamp = Date.now();
      const path = item.path || item.tempFilePath; // 处理可能的字段差异
      const name = item.name || path.substring(path.lastIndexOf("/") + 1);
      const lastDotIndex = name.lastIndexOf(".");
      const extension = lastDotIndex >= 0 ? name.substring(lastDotIndex) : "";

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
