"use client";

import { ReactNode } from 'react';

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: string | number;
    positive: boolean;
  };
  className?: string;
};

export default function MetricCard({ title, value, icon, change, className = '' }: MetricCardProps) {
  return (
    <div className={`card ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-text-secondary text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          
          {change && (
            <div className="flex items-center mt-1 text-xs">
              <span className={change.positive ? 'text-accent-secondary' : 'text-accent-error'}>
                {change.positive ? '↑' : '↓'} {change.value}
              </span>
              <span className="text-text-secondary ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
} 