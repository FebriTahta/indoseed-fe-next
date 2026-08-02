import React from 'react';
import { TraceabilityStep } from '@/app/types/traceability';

interface Props {
  steps: TraceabilityStep[];
}

export default function AlurTraceabilityFlow({ steps }: Props) {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6 p-5">
      <h3 className="text-sm font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
        Alur Traceability (From Farm To Customer)
      </h3>

      {/* 9-Stage Horizontal Process Flow */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-start min-w-[950px] justify-between relative px-4">
          {steps.map((step, idx) => (
            <React.Fragment key={step.stage}>
              {/* Process Node */}
              <div className="flex flex-col items-center text-center w-28 group relative z-10">
                {/* Circle Icon */}
                <div className="w-10 h-10 rounded-full bg-emerald-100/90 text-emerald-700 border-2 border-emerald-600 flex items-center justify-center font-bold text-lg mb-2 shadow-sm group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <i className={step.icon}></i>
                </div>

                {/* Stage Title */}
                <h5 className="text-[11px] font-bold text-gray-800 mb-1 leading-snug">{step.name}</h5>

                {/* Stage Code / Ref */}
                <span className="text-[10px] font-bold text-emerald-700 block mb-1">{step.code}</span>

                {/* Details */}
                <div className="text-[9px] text-gray-500 space-y-0.5">
                  <p className="mb-0">{step.detail2 || 'Tanggal'}</p>
                  <p className="font-semibold text-gray-700 mb-0">{step.date}</p>
                  {step.detail1 && (
                    <p className="font-medium text-emerald-800 bg-emerald-50 rounded px-1 py-0.5 inline-block mt-0.5">
                      {step.detail1}
                    </p>
                  )}
                </div>
              </div>

              {/* Connecting Arrow */}
              {idx < steps.length - 1 && (
                <div className="flex-1 flex items-center justify-center mt-4 text-emerald-500 z-0">
                  <i className="ri-arrow-right-line text-lg font-bold"></i>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
