# 📝 Markdown 渲染系统

本项目已集成并优化了marked.js引擎用于markdown内容的渲染。

## 🚀 主要特性

### 渲染引擎特性
- ✅ **GitHub风格的Markdown (GFM)** - 支持表格、任务列表等扩展语法
- ✅ **自动换行支持** - 单个换行符自动转换为`<br>`标签
- ✅ **智能列表处理** - 优化的列表渲染逻辑
- ✅ **智能标点符号转换** - 自动转换引号、破折号等
- ✅ **标题ID生成** - 自动为标题生成锚点ID
- ✅ **自定义渲染器** - 针对项目需求定制的HTML输出

### 样式特性
- 🎨 **Tailwind CSS集成** - 使用Tailwind类名的响应式设计
- 🎨 **Typora风格** - 类似Typora编辑器的清爽样式
- 🎨 **代码高亮支持** - 优化的代码块显示
- 🎨 **表格美化** - 带边框和斑马纹的表格样式
- 🎨 **移动端适配** - 完全响应式的设计

## 📁 文件结构

```
utils/
├── markdownRenderer.ts     # 核心渲染引擎
components/
├── MarkdownRenderer.tsx    # React渲染组件
styles/
├── markdown.css           # Markdown专用样式
├── globals.css           # 全局样式（已引入markdown.css）
pages/
├── markdown-test.tsx     # 测试页面
```

## 🔧 使用方法

### 1. 基础使用

```typescript
import { renderMarkdownSync } from '../utils/markdownRenderer';

const htmlContent = renderMarkdownSync(markdownText);
```

### 2. React组件使用

```tsx
import MarkdownRenderer from '../components/MarkdownRenderer';

function MyComponent() {
  return (
    <MarkdownRenderer
      content={markdownText}
      loading={isLoading}
      className="custom-class"
    />
  );
}
```

### 3. 异步渲染

```typescript
import { renderMarkdown } from '../utils/markdownRenderer';

const htmlContent = await renderMarkdown(markdownText);
```

## ⚙️ 配置选项

渲染引擎已预配置以下选项：

```typescript
{
  gfm: true,           // GitHub风格的Markdown
  breaks: true,        // 支持换行符转换
  headerIds: true,     // 为标题生成ID
  mangle: false,       // 不混淆邮箱地址
  sanitize: false,     // 不清理HTML
  smartLists: true,    // 智能列表处理
  smartypants: true,   // 智能标点符号转换
  xhtml: false,        // 不使用XHTML格式
  pedantic: false,     // 不使用严格模式
  silent: false        // 不静默错误
}
```

## 🎨 自定义样式

### CSS类名结构

```css
.markdown-content {
  /* 主容器样式 */
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3 {
  /* 标题样式 */
}

.markdown-content p {
  /* 段落样式 */
}

.markdown-content code {
  /* 行内代码样式 */
}

.markdown-content pre {
  /* 代码块样式 */
}

.markdown-content table {
  /* 表格样式 */
}
```

### 自定义渲染器

如需修改HTML输出，可以在`utils/markdownRenderer.ts`中调整渲染器配置：

```typescript
// 自定义代码块渲染
renderer.code = (code: string, language: string | undefined) => {
  const lang = language || '';
  return `<pre class="custom-code-block"><code class="language-${lang}">${code}</code></pre>`;
};
```

## 🧪 测试

访问 `/markdown-test` 页面查看渲染效果和测试各种markdown语法。

## 📝 支持的Markdown语法

### 基础语法
- 标题 (H1-H6)
- 段落和换行
- 强调 (**粗体**, *斜体*)
- 链接和图片
- 列表 (有序/无序)
- 引用块
- 代码 (行内和代码块)
- 分割线

### 扩展语法 (GFM)
- 表格
- 任务列表
- 删除线
- 自动链接识别

### 示例

```markdown
# 标题示例

## 表格示例
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |

## 任务列表
- [x] 已完成任务
- [ ] 待完成任务

## 代码示例
\`\`\`typescript
const example = "Hello World";
console.log(example);
\`\`\`
```

## 🔍 性能优化

1. **防抖渲染** - 使用50ms防抖避免频繁重渲染
2. **useMemo优化** - React组件使用useMemo缓存渲染结果
3. **requestAnimationFrame** - 使用RAF优化渲染时机
4. **错误处理** - 渲染失败时优雅降级到原始文本

## 🛠️ 故障排除

### 常见问题

1. **样式不生效**
   - 确保`styles/globals.css`中已引入`@import './markdown.css'`
   - 检查Tailwind CSS配置

2. **渲染错误**
   - 查看浏览器控制台错误信息
   - 确保markdown语法正确

3. **性能问题**
   - 检查是否有过长的markdown内容
   - 考虑使用分页或懒加载

### 调试模式

在开发环境中，渲染错误会输出到控制台，便于调试。

## 📚 相关资源

- [marked.js官方文档](https://marked.js.org/)
- [GitHub Flavored Markdown规范](https://github.github.com/gfm/)
- [Tailwind CSS文档](https://tailwindcss.com/docs)

---

*本指南涵盖了项目中markdown渲染系统的完整使用方法。*