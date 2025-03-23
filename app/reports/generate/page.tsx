"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import Link from 'next/link';
import Header from '../../components/Header';
import { BarChart4, FileText, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { mockReports } from '../../data/mockReports';

// Get unique projects from mock reports
const projects = Array.from(new Set(mockReports.map(report => report.project)));

// Available report types
const reportTypes = [
  { id: 'structural', name: 'Structural Analysis Report' },
  { id: 'foundation', name: 'Foundation Analysis Report' },
  { id: 'material', name: 'Material Compliance Report' },
  { id: 'environmental', name: 'Environmental Impact Assessment' },
  { id: 'cost', name: 'Cost Analysis Report' },
  { id: 'schedule', name: 'Schedule Performance Report' }
];

export default function GenerateReportPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedReportTypes, setSelectedReportTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const toggleReportType = (reportTypeId: string) => {
    setSelectedReportTypes(prev => 
      prev.includes(reportTypeId)
        ? prev.filter(id => id !== reportTypeId)
        : [...prev, reportTypeId]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject || selectedReportTypes.length === 0) {
      alert('Please select a project and at least one report type');
      return;
    }
    
    // Simulate report generation
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      setIsSuccess(true);
      
      // Redirect to reports page after success
      setTimeout(() => {
        router.push('/reports');
      }, 2000);
    }, 3000);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-primary">
        <div className="animate-pulse flex items-center">
          <div className="h-12 w-12 bg-accent-secondary"></div>
          <div className="h-2 w-24 bg-text-secondary ml-4"></div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-primary">
        <div className="text-center max-w-md">
          <div className="bg-accent-primary p-4 inline-block mb-6">
            <h2 className="text-text-light font-bold text-xl">SIGN IN REQUIRED</h2>
          </div>
          <p className="text-lg mb-8 text-text-secondary">Please sign in to generate reports</p>
          <Link href="/sign-in" className="btn-primary inline-flex items-center gap-2">
            Sign In <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }
  
  if (isSuccess) {
    return (
      <div className="bg-background-primary gridline-background h-screen text-text-primary overflow-y-auto">
        <Header />
        <div className="max-w-3xl mx-auto px-4 pt-12 pb-20">
          <div className="card p-16 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-7">
              <CheckCircle2 size={28} className="text-accent-secondary" />
            </div>
            <h1 className="text-2xl font-medium mb-3">Report Generated Successfully!</h1>
            <p className="text-text-secondary text-base font-light mb-10 max-w-md mx-auto">
              Your report has been generated and is now available to view.
            </p>
            <Link href="/reports" className="btn-primary inline-flex items-center gap-2 text-sm font-medium">
              View Reports <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-background-primary gridline-background h-screen text-text-primary overflow-y-auto">
      <Header />
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-medium tracking-tight mb-2">Generate Report</h1>
            <p className="text-text-secondary text-base font-light">Create detailed reports for your construction projects</p>
          </div>
          <Link 
            href="/reports"
            className="text-accent-primary hover:underline flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Reports
          </Link>
        </div>
        
        <div className="card p-7">
          <form onSubmit={handleSubmit}>
            {/* Project Selection */}
            <div className="mb-7">
              <label className="block text-text-primary font-medium text-sm mb-2.5">
                Select Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-3 rounded-btn border border-border-light bg-background-accent focus:outline-none focus:border-accent-primary text-sm font-light"
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>
            
            {/* Report Types */}
            <div className="mb-7">
              <label className="block text-text-primary font-medium text-sm mb-2.5">
                Report Types
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map(type => (
                  <div 
                    key={type.id}
                    className={`p-4 border rounded-btn flex items-start cursor-pointer transition-colors ${
                      selectedReportTypes.includes(type.id)
                        ? 'border-accent-primary bg-accent-primary bg-opacity-5'
                        : 'border-border-light hover:bg-background-accent'
                    }`}
                    onClick={() => toggleReportType(type.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedReportTypes.includes(type.id)}
                      onChange={() => {}}
                      className="mt-1 mr-3.5 h-4 w-4 text-accent-primary rounded accent-accent-primary"
                    />
                    <div>
                      <div className="font-medium text-sm">{type.name}</div>
                      <div className="text-xs text-text-secondary font-light mt-1">
                        {type.id === 'structural' ? 'Analysis of building structure integrity' :
                         type.id === 'foundation' ? 'Evaluation of foundation design' :
                         type.id === 'material' ? 'Compliance with material specifications' :
                         type.id === 'environmental' ? 'Environmental impact assessment' :
                         type.id === 'cost' ? 'Cost analysis and forecasting' :
                         'Schedule performance and projections'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Date Range */}
            <div className="mb-10">
              <label className="block text-text-primary font-medium text-sm mb-2.5">
                Date Range (Optional)
              </label>
              <div className="flex gap-5">
                <div className="flex-1">
                  <label className="block text-xs text-text-secondary mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-4 py-3 rounded-btn border border-border-light bg-background-accent focus:outline-none focus:border-accent-primary text-sm font-light"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-text-secondary mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-4 py-3 rounded-btn border border-border-light bg-background-accent focus:outline-none focus:border-accent-primary text-sm font-light"
                  />
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className={`btn-primary w-full flex items-center justify-center text-sm font-medium h-11 ${
                isGenerating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Report...
                </>
              ) : (
                <>
                  <BarChart4 size={16} className="mr-2" />
                  Generate Report
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 