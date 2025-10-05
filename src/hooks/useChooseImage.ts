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
    type ChooseMediaOptions = {
      count?: number;
      sizeType: string[];
      sourceType?: ("album" | "camera")[];
      mediaType: ("image" | "video" | "mix")[];
      extension?: string[];
    };
    const chooseMediaOptions: ChooseMediaOptions = {
      count,
      sizeType: Array.isArray(sizeType)
        ? sizeType
        : [sizeType].filter(Boolean) as string[],
      sourceType: sourceType as ("album" | "camera")[],
      mediaType: ["image"],
    };

    // 如果 extension 存在，则添加到选项中
    if (extension !== undefined) {
      chooseMediaOptions.extension = extension;
    }

    uni.chooseMedia({
      ...chooseMediaOptions,
      success(res) {
        const normalizedRes = normalizeChooseMediaRes(res as any);
        resolve(normalizedRes);
      },
      fail(res) {
        console.log(res);
        reject(new Error(res.errMsg));
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
        console.log(res);
        reject(new Error(res.errMsg));
      },
    });
    // #endif
  });
}

function normalizeChooseMediaRes(res: any): UniApp.ChooseImageSuccessCallbackResult {
  const tempFilePaths: string[] = res.tempFiles.map((item: any) => item.tempFilePath);
  const timestamp = Date.now();
  const tempFiles: UniApp.ChooseImageSuccessCallbackResult["tempFiles"] = res.tempFiles.map((item: any, index: number) => {
    const dotIndex = item.tempFilePath.lastIndexOf(".");
    const extension = dotIndex >= 0 ? item.tempFilePath.slice(dotIndex) : "";
    return {
      path: item.tempFilePath,
      size: item.size,
      name: item.tempFilePath.substring(item.tempFilePath.lastIndexOf("/") + 1),
      fileType: "image",
      cloudPath: `${timestamp}_${index}${extension}`,
    };
  });

  const result: UniApp.ChooseImageSuccessCallbackResult = {
    tempFilePaths,
    tempFiles,
  };
  return normalizeChooseAndUploadFileRes(result, "image");
}

function normalizeChooseAndUploadFileRes(res: UniApp.ChooseImageSuccessCallbackResult, fileType: string): UniApp.ChooseImageSuccessCallbackResult {
  // 确保 tempFiles 是数组类型
  const tempFilesArray = Array.isArray(res.tempFiles) ? res.tempFiles : [res.tempFiles];

  // 创建一个新的对象，避免直接修改输入参数
  const result: UniApp.ChooseImageSuccessCallbackResult = {
    tempFilePaths: res.tempFilePaths || tempFilesArray.map((file: any) => file.path),
    tempFiles: tempFilesArray.map((item: any, index: number) => {
      const name = item.name || item.path.substring(item.path.lastIndexOf("/") + 1);
      return {
        path: item.path,
        size: item.size,
        name,
        fileType: fileType || item.fileType,
        cloudPath: item.cloudPath || `${Date.now()}_${index}${name.substring(name.lastIndexOf("."))}`,
      };
    }),
  };
  return result;
}
