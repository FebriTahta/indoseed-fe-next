'use client';

import React from 'react';

export interface StepItem {
  id: number;
  title: string;
  description: string;
}

interface StepperProps {
  items: StepItem[];
  current: number;
  onChange?: (step: number) => void;
}

export default function Stepper({
  items,
  current,
  onChange,
}: StepperProps) {
  return (
    <div className="w-full rounded-lg border border-defaultborder/60 bg-white p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between overflow-x-auto">
        {items.map((item, index) => {
          const active = item.id === current;
          const completed = item.id < current;

          return (
            <React.Fragment key={item.id}>
              <div
                className={`flex items-center gap-3 min-w-max ${onChange ? 'cursor-pointer' : ''}`}
                onClick={() => onChange?.(item.id)}
              >
                {/* Circle Icon / Number */}
                <div
                  className={`
                    flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all
                    ${active
                      ? 'bg-[#078836] text-white ring-2 ring-[#078836]/20'
                      : completed
                        ? 'bg-[#078836] text-white'
                        : 'bg-white border-2 border-gray-300 text-gray-500'
                    }
                  `}
                >
                  {completed ? (
                    <i className="ri-check-line text-sm font-bold"></i>
                  ) : (
                    item.id
                  )}
                </div>

                {/* Text Content */}
                <div>
                  <div className={`text-xs font-bold ${active || completed ? 'text-gray-800' : 'text-gray-600'}`}>
                    {item.title}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium">
                    {completed ? 'Selesai' : active ? 'Sedang diisi' : 'Belum diisi'}
                  </div>
                </div>
              </div>

              {/* Connecting Line */}
              {index !== items.length - 1 && (
                <div className="mx-3 flex-1 min-w-[20px] hidden sm:block">
                  <div
                    className={`h-[2px] w-full transition-all ${
                      completed ? 'bg-[#078836]' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}