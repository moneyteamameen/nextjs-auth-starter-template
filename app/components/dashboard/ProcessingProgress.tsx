"use client";

import { Clock } from 'lucide-react';

type ProcessItem = {
  id: string;
  name: string;
  progress: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  estimatedCompletion?: Date;
};

type ProcessingProgressProps = {
  items: ProcessItem[];
};

export default function ProcessingProgress({ items }: ProcessingProgressProps) {
  const getStatusColor = (status: ProcessItem['status']) => {
    switch (status) {
      case 'queued':
        return 'bg-gray-200';
      case 'processing':
        return 'bg-accent-primary';
      case 'completed':
        return 'bg-accent-secondary';
      case 'failed':
        return 'bg-accent-error';
      default:
        return 'bg-gray-200';
    }
  };
  
  const getStatusLabel = (status: ProcessItem['status']) => {
    switch (status) {
      case 'queued':
        return 'Queued';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };
  
  const formatEstimatedTime = (date?: Date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diffInMinutes = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Less than a minute';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? `, ${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`;
    }
  };
  
  // Calculate overall progress
  const overallProgress = items.length > 0
    ? Math.round(items.reduce((sum, item) => sum + item.progress, 0) / items.length)
    : 0;
  
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Processing Progress</h2>
      
      {items.length === 0 ? (
        <p className="text-text-secondary">No documents are currently being processed.</p>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-accent-primary h-2.5 rounded-full"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{item.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'completed' ? 'bg-green-100 text-green-800' :
                    item.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    item.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`${getStatusColor(item.status)} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                
                {item.status === 'processing' && item.estimatedCompletion && (
                  <div className="flex items-center text-text-secondary text-xs mt-1">
                    <Clock size={12} className="mr-1" />
                    <span>Estimated time remaining: {formatEstimatedTime(item.estimatedCompletion)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 