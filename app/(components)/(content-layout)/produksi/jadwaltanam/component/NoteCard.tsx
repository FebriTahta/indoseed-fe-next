import React from 'react';

interface NoteCardProps {
  title?: string;
  description: string;
}

export default function NoteCard({
  title = "Catatan",
  description,
}: NoteCardProps) {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <i className="ri-file-text-line text-gray-500 text-sm" />
        <h3 className="text-xs font-bold text-gray-800">
          {title}
        </h3>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed font-normal">
        {description}
      </p>
    </div>
  );
}