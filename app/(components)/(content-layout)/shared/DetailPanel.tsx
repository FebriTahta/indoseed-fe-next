import React from 'react';

export interface TabConfig {
  id: string;
  label: string;
}

export interface DetailAction {
  label: string;
  onClick: () => void;
  icon?: string;
  className?: string;
}

interface DetailPanelProps {
  title?: string;
  onClose: () => void;
  imageUrl?: string;
  imageAlt?: string;
  statusLabel?: string;
  statusBgClass?: string;
  primaryTitle: string;
  secondaryTitle: string;
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: any) => void;
  renderTabContent: (tabId: any) => React.ReactNode;
  actions: DetailAction[];
}

export default function DetailPanel({
  title = 'Detail',
  onClose,
  imageUrl,
  imageAlt = 'Detail Image',
  statusLabel,
  statusBgClass = 'bg-success',
  primaryTitle,
  secondaryTitle,
  tabs,
  activeTab,
  onTabChange,
  renderTabContent,
  actions
}: DetailPanelProps) {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-md rounded-md overflow-hidden sticky top-24">
      {/* Header */}
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h5 className="box-title font-semibold text-gray-800 mb-0">{title}</h5>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-800 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>

      {/* Body */}
      <div className="box-body p-4">
        {/* Optional Image */}
        {imageUrl && (
          <div className="relative h-44 w-full rounded-md overflow-hidden mb-4 bg-gray-100 border border-gray-200 shadow-sm">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
            {statusLabel && (
              <span className={`absolute top-3 right-3 badge px-2.5 py-1 text-xs font-semibold rounded text-white ${statusBgClass}`}>
                {statusLabel}
              </span>
            )}
          </div>
        )}

        {/* Titles */}
        <div className="mb-4">
          <h4 className="text-xl font-bold text-gray-800 mb-0.5">{primaryTitle}</h4>
          <p className="text-xs text-textmuted font-mono">{secondaryTitle}</p>
        </div>

        {/* Tab Links */}
        {tabs.length > 0 && (
          <div className="flex border-b border-defaultborder mb-4 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`pb-2 px-3 text-xs font-semibold uppercase border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Render Active Tab Content */}
        <div className="mt-2">
          {renderTabContent(activeTab)}
        </div>
      </div>

      {/* Actions Footer */}
      {actions.length > 0 && (
        <div className="box-footer p-4 border-t border-defaultborder bg-gray-50 flex gap-3">
          {actions.map((act, i) => (
            <button
              key={i}
              onClick={act.onClick}
              className={`flex-1 py-2 px-4 rounded text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                act.className || 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              {act.icon && <i className={act.icon}></i>}
              {act.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
