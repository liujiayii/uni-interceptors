import { vi } from "vitest";

const uniMock = {
  getSystemInfoSync: vi.fn(() => ({
    environment: "",
    platform: "h5",
  })),
};

vi.stubGlobal("uni", uniMock);
