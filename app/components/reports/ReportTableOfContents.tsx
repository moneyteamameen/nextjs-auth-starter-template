"use client";

import { useState } from 'react';

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}

interface ReportTableOfContentsProps {
  items: TableOfContentsItem[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

export default function ReportTableOfContents({ 
  items, 
  activeSection, 
  onSectionClick 
}: ReportTableOfContentsProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    // By default expand all sections
    items.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderItems = (items: TableOfContentsItem[], level = 0) => {
    return items.map(item => (
      <div key={item.id} className="mb-1">
        <div
          className={`flex items-center py-1 px-2 rounded-md text-sm ${
            activeSection === item.id 
              ? 'bg-accent-primary text-white font-medium' 
              : 'hover:bg-gray-100 cursor-pointer'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            onSectionClick(item.id);
            if (item.children?.length) toggleSection(item.id);
          }}
        >
          {item.children && item.children.length > 0 && (
            <span className="mr-1 transform transition-transform duration-200" style={{
              transform: expandedSections[item.id] ? 'rotate(90deg)' : 'rotate(0deg)'
            }}>
              ▶
            </span>
          )}
          <span>{item.title}</span>
        </div>
        
        {item.children && item.children.length > 0 && expandedSections[item.id] && (
          <div className="ml-2 border-l border-gray-200">
            {renderItems(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 max-h-[calc(100vh-200px)] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
      <div>{renderItems(items)}</div>
    </div>
  );
} 