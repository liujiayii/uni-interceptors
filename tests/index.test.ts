import { describe, expect, it } from "vitest";
import { SetClipboardDataAuthInterceptor } from "../src/setClipboardData";
import { KuaiShouSetStorageProxyFixInterceptor } from "../src/setStorage";

describe("interceptors", () => {
  it("should export SetClipboardDataAuthInterceptor", () => {
    expect(SetClipboardDataAuthInterceptor).toBeDefined();
    expect(SetClipboardDataAuthInterceptor.install).toBeTypeOf("function");
  });

  it("should export KuaiShouSetStorageProxyFixInterceptor", () => {
    expect(KuaiShouSetStorageProxyFixInterceptor).toBeDefined();
    expect(KuaiShouSetStorageProxyFixInterceptor.install).toBeTypeOf("function");
  });
});
