import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  progressValue?: number;
  progressColor?: string;
  tag?: {
    text: string;
    bgColor: string;
    textColor: string;
  };
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function KpiCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  progressValue,
  progressColor = 'bg-primary-500',
  tag,
  trend,
  className
}: KpiCardProps) {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-6 border border-neutral-200", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-neutral-800 mt-1">{value}</h3>
          {tag && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium px-2 py-1 ${tag.bgColor} ${tag.textColor} rounded`}>
                {tag.text}
              </span>
            </div>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs ${trend.isPositive ? 'text-success-600' : 'text-destructive'}`}>
                <span className="material-icons-outlined text-xs">
                  {trend.isPositive ? 'arrow_upward' : 'arrow_downward'}
                </span>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-full ${iconBgColor} ${iconColor} flex items-center justify-center`}>
          <span className="material-icons-outlined">{icon}</span>
        </div>
      </div>
      
      {progressValue !== undefined && (
        <div className="mt-4">
          <Progress value={progressValue} className={`h-2 ${progressColor}`} />
        </div>
      )}
    </div>
  );
}
