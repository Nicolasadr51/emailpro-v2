import React from 'react';
import { Card } from '../ui/Card';
import { GeoDataPoint } from '../../types/analytics';

interface GeoChartProps {
  title: string;
  data: GeoDataPoint[];
}

export const GeoChart: React.FC<GeoChartProps> = ({ title, data }) => {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.slice(0, 10).map((item, index) => {
          const percentage = (item.count / maxCount) * 100;
          
          return (
            <div key={item.country} className="flex items-center space-x-3">
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm font-medium">{item.country}</span>
                <span className="text-sm text-muted-foreground">{item.count}</span>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {data.length > 10 && (
        <p className="text-sm text-muted-foreground mt-4">
          Et {data.length - 10} autres pays...
        </p>
      )}
    </Card>
  );
};
