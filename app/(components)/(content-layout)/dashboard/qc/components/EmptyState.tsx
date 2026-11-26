import React from 'react';

/** Placeholder kartu tanpa data (mis. belum ada aktivitas atau fitur belum tersedia). */
export default function EmptyState({ icon = 'ri-inbox-line', title, description }: { icon?: string; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 px-4 text-gray-400">
      <span className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center mb-2">
        <i className={`${icon} text-xl`}></i>
      </span>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{title}</p>
      {description && <p className="text-[11px] text-gray-400 max-w-xs">{description}</p>}
    </div>
  );
}
