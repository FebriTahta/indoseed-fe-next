import React, { ReactNode } from 'react';

interface QcPageHeaderProps {
  title: string;
  description: string;
  actionButtons?: ReactNode;
}

export default function QcPageHeader({ title, description, actionButtons }: QcPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      <div>
        <h4 className="font-bold text-xl text-gray-800 mb-1">{title}</h4>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      {actionButtons && (
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {actionButtons}
        </div>
      )}
    </div>
  );
}
