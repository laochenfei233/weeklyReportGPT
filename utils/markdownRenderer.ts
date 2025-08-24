import { marked } from 'marked';

// 配置marked.js的全局选项
export const configureMarked = () => {
  marked.setOptions({
    gfm: true,           // 启用GitHub风格的Markdown
    breaks: true,        // 支持换行符转换为<br>
    pedantic: false,     // 不使用严格模式
    silent: false        // 不静默错误
  });
};

// 后处理HTML，添加Tailwind CSS类
const postProcessHtml = (html: string): string => {
  return html
    // 为标题添加样式
    .replace(/<h1>/g, '<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b-2 border-gray-200 pb-2">')
    .replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900 border-b border-gray-200 pb-1">')
    .replace(/<h3>/g, '<h3 class="text-xl font-semibold mt-4 mb-2 text-gray-900">')
    .replace(/<h4>/g, '<h4 class="text-lg font-semibold mt-3 mb-2 text-gray-900">')
    .replace(/<h5>/g, '<h5 class="text-base font-semibold mt-2 mb-1 text-gray-900">')
    .replace(/<h6>/g, '<h6 class="text-sm font-semibold mt-2 mb-1 text-gray-900">')
    
    // 为段落添加样式
    .replace(/<p>/g, '<p class="mb-4 leading-relaxed text-gray-700">')
    
    // 为链接添加样式
    .replace(/<a href/g, '<a class="text-blue-600 hover:text-blue-800 underline transition-colors" target="_blank" rel="noopener noreferrer" href')
    
    // 为列表添加样式
    .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-1 my-4 ml-4 text-gray-700">')
    .replace(/<ol>/g, '<ol class="list-decimal list-inside space-y-1 my-4 ml-4 text-gray-700">')
    
    // 为代码添加样式
    .replace(/<code>/g, '<code class="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">')
    .replace(/<pre><code/g, '<pre class="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4 border border-gray-200"><code class="text-gray-800 text-sm font-mono"')
    
    // 为引用添加样式
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-blue-400 pl-4 py-2 my-4 bg-blue-50 italic text-gray-600">')
    
    // 为表格添加样式
    .replace(/<table>/g, '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300">')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<thead>/g, '<thead class="bg-gray-50">')
    .replace(/<th>/g, '<th class="px-4 py-2 font-semibold text-left border border-gray-300 text-gray-900">')
    .replace(/<td>/g, '<td class="px-4 py-2 border border-gray-300 text-gray-700">')
    .replace(/<tr>/g, '<tr class="border-b border-gray-200">')
    
    // 为强调添加样式
    .replace(/<strong>/g, '<strong class="font-semibold text-gray-900">')
    .replace(/<em>/g, '<em class="italic text-gray-600">')
    
    // 为分割线添加样式
    .replace(/<hr>/g, '<hr class="border-t-2 border-gray-200 my-8">');
};

// 渲染markdown文本的主函数
export const renderMarkdown = async (markdownText: string): Promise<string> => {
  try {
    // 确保marked已配置
    configureMarked();
    
    // 渲染markdown
    const htmlContent = await marked(markdownText);
    const processedHtml = typeof htmlContent === 'string' ? postProcessHtml(htmlContent) : markdownText;
    
    return processedHtml;
  } catch (error) {
    console.error('Markdown rendering error:', error);
    return markdownText; // 出错时返回原始文本
  }
};

// 同步版本的渲染函数（用于兼容现有代码）
export const renderMarkdownSync = (markdownText: string): string => {
  try {
    configureMarked();
    const htmlContent = marked(markdownText);
    const processedHtml = typeof htmlContent === 'string' ? postProcessHtml(htmlContent) : markdownText;
    
    return processedHtml;
  } catch (error) {
    console.error('Markdown rendering error:', error);
    return markdownText;
  }
};