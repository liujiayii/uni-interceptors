import { describe, expect, it } from "vitest";
import { setClipboardDataInterceptor, setStorageInterceptor } from "../src/interceptors";

describe("interceptors", () => {
  it("should export setClipboardDataInterceptor", () => {
    expect(setClipboardDataInterceptor).toBeDefined();
    expect(setClipboardDataInterceptor.install).toBeTypeOf("function");
  });

  it("should export setStorageInterceptor", () => {
    expect(setStorageInterceptor).toBeDefined();
    expect(setStorageInterceptor.install).toBeTypeOf("function");
  });
});
