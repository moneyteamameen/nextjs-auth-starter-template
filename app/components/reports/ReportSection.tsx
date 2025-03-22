"use client";

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ReportSectionProps {
  id: string;
  title: string;
  level: number;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export default function ReportSection({ 
  id, 
  title, 
  level, 
  children, 
  defaultExpanded = true 
}: ReportSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Apply appropriate heading size based on level
  const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;
  
  const headingSizes = {
    1: 'text-2xl font-bold',
    2: 'text-xl font-bold',
    3: 'text-lg font-semibold',
    4: 'text-base font-semibold',
    5: 'text-sm font-medium',
    6: 'text-sm font-medium'
  };

  return (
    <section id={id} className="mb-8 scroll-mt-16">
      <div 
        className="flex items-center py-2 cursor-pointer" 
        onClick={toggleExpanded}
      >
        {level > 1 && (
          <button className="mr-2 text-accent-primary">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        )}
        <HeadingTag className={headingSizes[level as keyof typeof headingSizes]}>
          {title}
        </HeadingTag>
      </div>
      
      {(isExpanded || level === 1) && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </section>
  );
} 