import { describe, expect, it } from "vitest";
import { SetClipboardDataInterceptor, StorageInterceptor } from "../src/interceptors";

describe("interceptors", () => {
  it("should export SetClipboardDataInterceptor", () => {
    expect(SetClipboardDataInterceptor).toBeDefined();
    expect(SetClipboardDataInterceptor.install).toBeTypeOf("function");
  });

  it("should export StorageInterceptor", () => {
    expect(StorageInterceptor).toBeDefined();
    expect(StorageInterceptor.install).toBeTypeOf("function");
  });
});
