"use client";

import { Clock, File, FileText, BarChart, Upload, Check, AlertCircle } from 'lucide-react';

type Activity = {
  id: string;
  type: 'document_upload' | 'document_processed' | 'report_generated' | 'processing_complete' | 'processing_error';
  title: string;
  description: string;
  timestamp: Date;
  project?: string;
};

type ActivityFeedProps = {
  activities: Activity[];
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'document_upload':
        return <Upload size={16} className="text-accent-primary" />;
      case 'document_processed':
        return <FileText size={16} className="text-accent-primary" />;
      case 'report_generated':
        return <BarChart size={16} className="text-accent-primary" />;
      case 'processing_complete':
        return <Check size={16} className="text-accent-secondary" />;
      case 'processing_error':
        return <AlertCircle size={16} className="text-accent-error" />;
      default:
        return <File size={16} className="text-accent-primary" />;
    }
  };
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };
  
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-text-secondary">No recent activity to display.</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="p-2 bg-gray-100 rounded-full mr-3">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-grow">
                <p className="font-medium">{activity.title}</p>
                <p className="text-text-secondary text-sm">{activity.description}</p>
                
                {activity.project && (
                  <p className="text-xs text-text-secondary mt-1">
                    Project: {activity.project}
                  </p>
                )}
              </div>
              
              <div className="flex items-center text-text-secondary text-xs">
                <Clock size={12} className="mr-1" />
                <span>{formatTimestamp(activity.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 