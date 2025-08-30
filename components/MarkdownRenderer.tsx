import React, { useMemo } from 'react';
import { renderMarkdownSync } from '../utils/markdownRenderer';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  loading?: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '', 
  loading = false 
}) => {
  // 使用useMemo优化性能，只在content变化时重新渲染
  const renderedHtml = useMemo(() => {
    if (!content) return '';
    
    try {
      return renderMarkdownSync(content);
    } catch (error) {
      console.error('Markdown rendering failed:', error);
      return content; // 渲染失败时返回原始内容
    }
  }, [content]);

  if (loading && !content) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-gray-500 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>正在生成内容...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {renderedHtml && (
        <div
          className="markdown-content prose prose-gray max-w-none text-left"
          style={{ textAlign: 'left' }}
          dangerouslySetInnerHTML={{
            __html: renderedHtml,
          }}
        />
      )}
      
      {loading && content && (
        <div className="absolute bottom-4 right-4">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            <span>生成中...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownRenderer;