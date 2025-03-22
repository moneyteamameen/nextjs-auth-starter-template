"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import DashboardLayout from '../../components/DashboardLayout';
import ReportTableOfContents from '../../components/reports/ReportTableOfContents';
import ReportSection from '../../components/reports/ReportSection';
import ReportContent from '../../components/reports/ReportContent';
import ReportActions from '../../components/reports/ReportActions';
import Link from 'next/link';
import { ChevronLeft, FileText, FileBarChart } from 'lucide-react';
import { getReportById, flattenSections, ReportSection as ReportSectionType } from '../../data/mockReports';

export default function ReportViewPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  
  // Get report data
  const report = getReportById(id);
  
  // Set up intersection observer for section tracking
  useEffect(() => {
    if (!report) return;
    
    // Initialize refs for all sections
    const allSections = flattenSections(report.sections);
    allSections.forEach(section => {
      if (section.id) {
        const element = document.getElementById(section.id);
        sectionRefs.current[section.id] = element;
      }
    });
    
    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setActiveSection(sectionId);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0
      }
    );
    
    // Observe all section elements
    Object.values(sectionRefs.current).forEach(element => {
      if (element) observer.observe(element);
    });
    
    // Set initial active section
    if (allSections.length > 0 && allSections[0].id) {
      setActiveSection(allSections[0].id);
    }
    
    return () => {
      Object.values(sectionRefs.current).forEach(element => {
        if (element) observer.unobserve(element);
      });
    };
  }, [report]);
  
  // Handle scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Handle download
  const handleDownload = () => {
    if (!report) return;
    alert(`Downloading PDF for: ${report.title}`);
    // In a real application, this would trigger a PDF generation and download
  };
  
  // Handle share
  const handleShare = () => {
    if (!report) return;
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };
  
  // Handle export data
  const handleExportData = () => {
    if (!report) return;
    alert(`Exporting data for: ${report.title}`);
    // In a real application, this would trigger a data export (e.g., CSV, Excel)
  };
  
  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Render a section and its children
  const renderSections = (sections: ReportSectionType[] = []) => {
    return sections.map(section => (
      <ReportSection 
        key={section.id} 
        id={section.id} 
        title={section.title} 
        level={section.level}
        defaultExpanded={section.level <= 2}
      >
        <ReportContent content={section.content} />
        {section.children && section.children.length > 0 && (
          <div className="ml-4">
            {renderSections(section.children)}
          </div>
        )}
      </ReportSection>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg mb-4">Please sign in to view this report</p>
          <Link href="/sign-in" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }
  
  if (!report) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="card p-12 text-center">
            <FileBarChart size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Report Not Found</h3>
            <p className="text-text-secondary mb-6">
              The report you're looking for could not be found
            </p>
            <Link 
              href="/reports"
              className="btn-primary inline-block"
            >
              Back to Reports
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Report Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/reports"
              className="text-accent-primary flex items-center hover:underline mr-4"
            >
              <ChevronLeft size={16} />
              <span>Back to Reports</span>
            </Link>
            <div className="text-text-secondary text-sm">
              Generated on {formatDate(report.createdAt)}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
          <p className="text-text-secondary mb-2">{report.description}</p>
          <div className="flex items-center text-sm">
            <FileText size={16} className="text-accent-primary mr-2" />
            <span className="text-text-secondary">{report.project}</span>
          </div>
        </div>
        
        {/* Report Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with TOC and Actions */}
          <div className="lg:w-64 flex-shrink-0 space-y-6">
            <ReportTableOfContents 
              items={report.tableOfContents}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />
            
            <ReportActions
              reportId={report.id}
              reportName={report.title}
              onDownload={handleDownload}
              onShare={handleShare}
              onExport={handleExportData}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-grow bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            {renderSections(report.sections)}
          </div>
        </div>
      </div>
      
      {/* Print Styles - Only shown when printing */}
      <style jsx global>{`
        @media print {
          .sidebar, .top-header, nav, .sidebar-layout, button {
            display: none !important;
          }
          
          .main-content, .main-content-expanded {
            margin-left: 0 !important;
            width: 100% !important;
          }
          
          body {
            background: white;
          }
          
          .max-w-7xl {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
} 