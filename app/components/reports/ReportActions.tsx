"use client";

import { Download, Printer, Share2, FileSpreadsheet } from 'lucide-react';

interface ReportActionsProps {
  reportId: string;
  reportName: string;
  onDownload?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
  onExport?: () => void;
}

export default function ReportActions({
  reportId,
  reportName,
  onDownload = () => {},
  onPrint = () => window.print(),
  onShare = () => {},
  onExport = () => {}
}: ReportActionsProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4">Report Actions</h2>
      
      <div className="space-y-2">
        <button 
          className="w-full flex items-center space-x-2 p-2 text-left hover:bg-blue-50 rounded-md transition-colors"
          onClick={onDownload}
        >
          <Download size={18} className="text-accent-primary" />
          <span>Download PDF</span>
        </button>
        
        <button 
          className="w-full flex items-center space-x-2 p-2 text-left hover:bg-blue-50 rounded-md transition-colors"
          onClick={onPrint}
        >
          <Printer size={18} className="text-accent-primary" />
          <span>Print Report</span>
        </button>
        
        <button 
          className="w-full flex items-center space-x-2 p-2 text-left hover:bg-blue-50 rounded-md transition-colors"
          onClick={onShare}
        >
          <Share2 size={18} className="text-accent-primary" />
          <span>Share Report</span>
        </button>
        
        <button 
          className="w-full flex items-center space-x-2 p-2 text-left hover:bg-blue-50 rounded-md transition-colors"
          onClick={onExport}
        >
          <FileSpreadsheet size={18} className="text-accent-primary" />
          <span>Export Data</span>
        </button>
      </div>
    </div>
  );
} 