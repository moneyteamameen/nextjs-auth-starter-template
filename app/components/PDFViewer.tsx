import { useState } from 'react';

interface PDFViewerProps {
  url: string;
  height?: string;
}

const PDFViewer = ({ url, height = '100%' }: PDFViewerProps) => {
  return (
    <div style={{ height }} className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded">
      <div className="text-center p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">PDF Viewer Unavailable</h3>
        <p className="text-gray-600">PDF viewing functionality has been removed from this application.</p>
      </div>
    </div>
  );
};

export default PDFViewer; 