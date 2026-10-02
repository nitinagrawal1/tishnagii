import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}) => (
  <div className={`w-full text-center ${compact ? 'py-8 p-5' : 'py-20 p-8'} bg-[#F4EFEA] border border-[#EADBCE] rounded-xs space-y-4 max-w-lg mx-auto`}>
    <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#C49A45]/40 flex items-center justify-center text-[#C49A45] mx-auto">
      {icon}
    </div>
    <div>
      <h3 className="font-serif text-2xl font-medium text-[#2A0814]">{title}</h3>
      <p className="text-xs text-[#4A1525]/70 mt-1.5 max-w-sm mx-auto font-light leading-relaxed">
        {description}
      </p>
    </div>
    <button
      onClick={onAction}
      className="py-3 px-8 bg-[#2A0814] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#380E1C] transition-colors cursor-pointer touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
    >
      {actionLabel}
    </button>
  </div>
);