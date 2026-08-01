'use client';

import { ReactNode } from 'react';

interface InfoSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function InfoSection({
  title,
  icon,
  children,
}: InfoSectionProps) {

  return (

    <div className="rounded-xl border border-defaultborder bg-white mb-5">

      <div className="flex items-center gap-2 px-5 pt-5">

        {icon}

        <h2 className="text-sm font-semibold text-defaulttextcolor">
          {title}
        </h2>

      </div>

      <div className="px-5 pb-5 pt-4">

        {children}

      </div>

    </div>

  );

}