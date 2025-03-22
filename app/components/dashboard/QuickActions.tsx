"use client";

import { FolderPlus, Upload, BarChart4 } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/projects/new" 
          className="p-4 flex flex-col items-center justify-center bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <FolderPlus size={24} className="text-accent-primary mb-2" />
          <span className="font-medium">New Project</span>
        </Link>
        
        <Link 
          href="/document-management/upload" 
          className="p-4 flex flex-col items-center justify-center bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
        >
          <Upload size={24} className="text-accent-secondary mb-2" />
          <span className="font-medium">Upload Documents</span>
        </Link>
        
        <Link 
          href="/reports/generate" 
          className="p-4 flex flex-col items-center justify-center bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
        >
          <BarChart4 size={24} className="text-accent-warning mb-2" />
          <span className="font-medium">Generate Report</span>
        </Link>
      </div>
    </div>
  );
} 