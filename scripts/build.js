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
 * 复制样式文件到dist目录
 */
function copyStyles() {
  const srcDir = path.join(process.cwd(), "src/style");
  const distDir = path.join(process.cwd(), "dist/style");

  // 确保目标目录存在
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // 获取源目录中的所有文件
  const files = fs.readdirSync(srcDir);

  // 复制所有样式文件
  files.forEach((file) => {
    const srcPath = path.join(srcDir, file);
    const distPath = path.join(distDir, file);

    // 只复制文件，跳过子目录
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, distPath);
      console.log(`📄 复制样式文件: ${file}`);
    }
  });

  console.log(`🎨 样式文件已复制到 ${distDir}`);
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

  // 3. 复制样式文件
  copyStyles();

  console.log("\n🎉 构建完成！");
}

// 执行构建
build();
