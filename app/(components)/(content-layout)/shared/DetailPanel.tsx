import React, { useState, useEffect } from 'react';

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
  isLoading?: boolean;
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
  actions,
  isLoading = false
}: DetailPanelProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset image loaded state when image URL changes
  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

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
        {isLoading ? (
          // Premium Skeleton Screen for loading state
          <div className="space-y-4">
            {/* Image Skeleton */}
            <div className="h-44 w-full rounded-md bg-gray-200 animate-pulse flex items-center justify-center relative">
              <i className="ri-image-line text-4xl text-gray-300"></i>
            </div>
            
            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Tab Links Skeleton */}
            <div className="flex border-b border-defaultborder pb-2 gap-3">
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Content List Skeleton */}
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <div className="col-span-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="col-span-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Optional Image */}
            {imageUrl && (
              <div className="relative h-44 w-full rounded-md overflow-hidden mb-4 bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center">
                {/* Heavy Image Loading Skeleton */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                      <span className="text-[10px] text-gray-400">Memuat gambar...</span>
                    </div>
                  </div>
                )}
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {statusLabel && imageLoaded && (
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
          </>
        )}
      </div>

      {/* Actions Footer */}
      {!isLoading && actions.length > 0 && (
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

