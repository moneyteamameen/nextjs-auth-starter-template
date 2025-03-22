"use client";

interface ReportContentProps {
  content: string;
}

export default function ReportContent({ content }: ReportContentProps) {
  return (
    <div 
      className="prose prose-blue max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
} 