import React from 'react';

interface UsageRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

const UsageRulesModal: React.FC<UsageRulesModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">使用规则</h2>
        
        <div className="space-y-3 text-gray-700">
          <p>1. <strong>每日Token限制</strong>：非管理员用户每天最多使用10,000个token（包括输入和输出）</p>
          <p>2. <strong>使用规则</strong>：请勿生成违法或不当内容</p>
          <p>3. <strong>数据隐私</strong>：您的使用数据将仅用于服务优化</p>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              // 记录用户已接受使用规则
              localStorage.setItem('usage_rules_accepted', 'true');
              if (onAccept) {
                onAccept();
              }
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            同意并继续
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsageRulesModal;