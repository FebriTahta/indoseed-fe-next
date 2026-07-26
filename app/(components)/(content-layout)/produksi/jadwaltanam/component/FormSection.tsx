'use client';

import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

export default function FormSection({
  title,
  children,
}: FormSectionProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white mb-5">

      <div className="border-b px-5 py-4">

        <h2 className="text-base font-semibold text-slate-800">
          {title}
        </h2>

      </div>

      <div className="p-5">

        {children}

      </div>

    </div>
  );
}