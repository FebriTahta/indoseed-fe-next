import React from 'react';

export interface QcTabItem<K extends string = string> {
  key: K;
  label: string;
  icon?: string;
  badge?: number | string;
}

interface QcTabsProps<K extends string> {
  tabs: QcTabItem<K>[];
  active: K;
  onChange: (key: K) => void;
}

export default function QcTabs<K extends string>({ tabs, active, onChange }: QcTabsProps<K>) {
  return (
    <div className="mb-4 bg-white rounded-xl px-4 shadow-sm border border-gray-100">
      <nav className="flex gap-2 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`whitespace-nowrap py-3.5 px-4 border-b-[3px] text-sm transition-colors flex items-center gap-2 ${
              active === tab.key
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-gray-600 font-medium hover:text-gray-800 hover:border-gray-200'
            }`}
          >
            {tab.icon && <i className={`${tab.icon} text-base`}></i>}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800 font-semibold">{tab.badge}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
