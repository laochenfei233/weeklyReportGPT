import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MarkdownRenderer from '../components/MarkdownRenderer';

const testMarkdown = `# 周报测试 - Markdown渲染

## 本周工作总结

### 主要完成的任务

1. **项目开发**
   - 完成了用户认证模块的开发
   - 优化了数据库查询性能
   - 修复了3个关键bug

2. **技术优化**
   - 集成了marked.js引擎用于markdown渲染
   - 添加了自定义渲染器配置
   - 优化了前端性能

### 代码示例

\`\`\`typescript
// 使用marked.js渲染markdown
import { renderMarkdownSync } from '../utils/markdownRenderer';

const htmlContent = renderMarkdownSync(markdownText);
\`\`\`

### 数据统计

| 指标 | 本周 | 上周 | 变化 |
|------|------|------|------|
| 用户注册 | 150 | 120 | +25% |
| 活跃用户 | 1200 | 1100 | +9% |
| 页面访问 | 5000 | 4500 | +11% |

### 重要提醒

> **注意**: 下周需要重点关注性能优化和用户体验改进。

### 下周计划

- [ ] 完成API文档编写
- [ ] 进行性能测试
- [ ] 用户反馈收集
- [x] Markdown渲染优化 ✅

### 技术亮点

使用了以下技术栈：

- **前端**: React + Next.js + TypeScript
- **样式**: Tailwind CSS
- **渲染**: marked.js引擎
- **状态管理**: React Hooks

---

*本周报由 Weekly Report GPT 生成，使用了优化的marked.js渲染引擎。*

### 链接参考

- [项目仓库](https://github.com/example/project)
- [文档地址](https://docs.example.com)
- [演示地址](https://demo.example.com)
`;

export default function MarkdownTest() {
  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Markdown渲染测试 - Weekly Report GPT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <div className="max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Markdown渲染测试</h1>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* 工具栏 */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex justify-between items-center">
              <div className="text-sm text-gray-600 font-medium">测试内容 - marked.js引擎</div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(testMarkdown);
                  alert('测试内容已复制到剪贴板');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                复制源码
              </button>
            </div>
            
            {/* 渲染区域 */}
            <div className="p-8">
              <MarkdownRenderer
                content={testMarkdown}
                className="text-left"
              />
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">渲染引擎特性</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>✅ GitHub风格的Markdown (GFM)</li>
              <li>✅ 自动换行支持</li>
              <li>✅ 表格渲染优化</li>
              <li>✅ 代码高亮支持</li>
              <li>✅ 任务列表支持</li>
              <li>✅ 智能标点符号转换</li>
              <li>✅ 自定义样式和类名</li>
              <li>✅ 响应式设计</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}