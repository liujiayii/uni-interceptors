import type { Preset, SourceCodeTransformer } from "unocss";
import { defineConfig, transformerDirectives } from "unocss";
import { presetApplet, presetRemRpx } from "unocss-applet";

const presets: Preset[] = [];
const transformers: SourceCodeTransformer[] = [];

presets.push(presetApplet());
presets.push(presetRemRpx({ baseFontSize: 4, screenWidth: 750 }));

export default defineConfig({
  shortcuts: [
    ["flex-center", "justify-center items-center"],
  ],
  presets: [
    ...presets,
  ],
  transformers: [
    transformerDirectives(),
    ...transformers,
  ],
});
