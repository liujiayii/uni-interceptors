import { describe, expect, it } from "vitest";
import { KuaiShouSetStorageProxyFixInterceptor, SetClipboardDataAuthInterceptor } from "../src";

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
