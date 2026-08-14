import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * 执行命令并输出结果
 */
function runCommand(command, description) {
  console.log(`\n🔨 ${description}...`);
  try {
    const output = execSync(command, { encoding: "utf8", stdio: "inherit" });
    console.log(`✅ ${description} 完成`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} 失败:`, error.message);
    process.exit(1);
  }
}

/**
 * 递归复制源目录下的所有文件到目标目录（跳过子目录）
 * @param {string} srcDir - 源目录相对路径
 * @param {string} distDir - 目标目录相对路径
 * @param {string} label - 复制时的日志标签，用于区分不同类型文件
 */
function copyDirectoryFiles(srcDir, distDir, label) {
  const src = path.join(process.cwd(), srcDir);
  const dist = path.join(process.cwd(), distDir);

  // 源目录不存在则无需复制
  if (!fs.existsSync(src)) {
    console.log(`⚠️ 源目录不存在，跳过 ${label}: ${srcDir}`);
    return;
  }

  // 确保目标目录存在
  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist, { recursive: true });
  }

  // 复制所有文件，跳过子目录
  let count = 0;
  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, path.join(dist, file));
      console.log(`📄 复制${label}: ${file}`);
      count++;
    }
  });

  console.log(`✅ 已复制 ${count} 个${label}到 ${distDir}`);
}

/**
 * 完整的构建流程
 */
function build() {
  console.log("🚀 开始构建流程...\n");

  // 1. 清理dist目录
  runCommand("npm run clean", "清理构建目录");

  // 2. 执行TypeScript编译
  runCommand("tsc", "TypeScript编译");

  // 3. 复制全局类型声明文件（纯 declare global 的 .d.ts，
  //    tsc declaration:true 不会为其 emit 产物，需物理复制，
  //    供消费端 tsconfig 的 "types" 数组以 "uni-toolkit/types" 引入）
  copyDirectoryFiles("src/typings", "dist/types", "类型声明文件");

  // 4. 复制样式文件
  copyDirectoryFiles("src/style", "dist/style", "样式文件");

  console.log("\n🎉 构建完成！");
}

// 执行构建
build();
