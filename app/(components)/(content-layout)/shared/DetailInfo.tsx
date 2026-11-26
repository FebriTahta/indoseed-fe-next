import React from 'react';

export interface DetailItem {
  label: string;
  value: React.ReactNode;
}

interface DetailInfoProps {
  items: DetailItem[];
  layout?: 'stack' | 'grid';
}

const DetailInfo: React.FC<DetailInfoProps> = ({ items, layout = 'stack' }) => {
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-12 gap-y-3 text-xs mt-2 text-gray-700 divide-y divide-gray-50">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">{item.label}</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{item.value}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 py-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col mb-3">
          <span className="text-xs text-textmuted mb-1 font-semibold">{item.label}</span>
          <span className="text-sm font-bold text-gray-800">{item.value || '-'}</span>
        </div>
      ))}
    </div>
  );
};

export default DetailInfo;
