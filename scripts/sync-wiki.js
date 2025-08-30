#!/usr/bin/env node

/**
 * 同步 wiki 文档到 GitHub Wiki
 * 
 * 使用方法:
 * 1. 确保已经克隆了项目的 wiki 仓库
 * 2. 运行: node scripts/sync-wiki.js
 */

const fs = require('fs');
const path = require('path');

const WIKI_DIR = path.join(__dirname, '../wiki');
const TARGET_DIR = process.argv[2] || '../weeklyReportGPT.wiki';

console.log('🚀 开始同步 Wiki 文档...');

// 检查源目录
if (!fs.existsSync(WIKI_DIR)) {
  console.error('❌ Wiki 源目录不存在:', WIKI_DIR);
  process.exit(1);
}

// 检查目标目录
if (!fs.existsSync(TARGET_DIR)) {
  console.error('❌ Wiki 目标目录不存在:', TARGET_DIR);
  console.log('💡 请先克隆 Wiki 仓库:');
  console.log('   git clone https://github.com/laochenfei233/weeklyReportGPT.wiki.git');
  process.exit(1);
}

// 读取所有 wiki 文件
const wikiFiles = fs.readdirSync(WIKI_DIR).filter(file => file.endsWith('.md'));

console.log(`📁 找到 ${wikiFiles.length} 个文档文件`);

// 复制文件
let copiedCount = 0;
wikiFiles.forEach(file => {
  const sourcePath = path.join(WIKI_DIR, file);
  const targetPath = path.join(TARGET_DIR, file);
  
  try {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ 已复制: ${file}`);
    copiedCount++;
  } catch (error) {
    console.error(`❌ 复制失败: ${file}`, error.message);
  }
});

console.log(`\n🎉 同步完成! 共复制 ${copiedCount} 个文件`);
console.log('\n📝 接下来的步骤:');
console.log('1. cd ' + TARGET_DIR);
console.log('2. git add .');
console.log('3. git commit -m "更新文档"');
console.log('4. git push origin master');