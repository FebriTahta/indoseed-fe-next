import React, { useMemo } from 'react';

interface Top5ChartProps {
  data: any[];
  title: string;
  nameExtractor: (item: any) => string;
  valueExtractor: (item: any) => number;
  valueFormatter?: (val: number) => string;
}

export default function Top5Chart({ 
  data, 
  title, 
  nameExtractor, 
  valueExtractor,
  valueFormatter = (val) => val.toFixed(2).replace('.', ',') + '%'
}: Top5ChartProps) {
  const top5 = useMemo(() => {
    const map: Record<string, { total: number, count: number }> = {};
    
    data.forEach(item => {
      const name = nameExtractor(item);
      const val = valueExtractor(item);
      
      if (name && typeof val === 'number') {
        if (!map[name]) {
          map[name] = { total: 0, count: 0 };
        }
        map[name].total += val;
        map[name].count += 1;
      }
    });

    const averages = Object.keys(map).map(name => {
      return {
        name,
        average: map[name].total / map[name].count
      };
    });

    averages.sort((a, b) => b.average - a.average);
    
    return averages.slice(0, 5);
  }, [data, nameExtractor, valueExtractor]);

  const maxVal = top5.length > 0 ? Math.max(...top5.map(t => t.average)) : 100;
  const safeMax = maxVal > 0 ? maxVal : 1;

  return (
    <div className="box shadow-sm">
      <div className="box-header border-b border-gray-100 flex justify-between items-center">
        <h5 className="box-title text-base font-semibold">{title}</h5>
      </div>
      <div className="box-body p-4">
        <div className="space-y-4">
          {top5.length > 0 ? (
            top5.map((item, idx) => {
              const percentage = Math.min((item.average / safeMax) * 100, 100);
              return (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-600">{item.name}</span>
                    <span className="font-bold">{valueFormatter(item.average)}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-success h-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-sm text-gray-500 py-2">
              Tidak ada data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
