"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import DashboardLayout from '../../components/DashboardLayout';
import Link from 'next/link';
import { BarChart4, FileText, CheckCircle2 } from 'lucide-react';
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
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg mb-4">Please sign in to generate reports</p>
          <Link href="/sign-in" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }
  
  if (isSuccess) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto">
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-accent-secondary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Report Generated Successfully!</h1>
            <p className="text-text-secondary mb-8">
              Your report has been generated and is now available to view.
            </p>
            <Link href="/reports" className="btn-primary">
              View Reports
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Generate Report</h1>
          <Link 
            href="/reports"
            className="text-accent-primary hover:underline flex items-center"
          >
            Back to Reports
          </Link>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Project Selection */}
            <div className="mb-6">
              <label className="block text-text-primary font-medium mb-2">
                Select Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>
            
            {/* Report Types */}
            <div className="mb-6">
              <label className="block text-text-primary font-medium mb-2">
                Report Types
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportTypes.map(type => (
                  <div 
                    key={type.id}
                    className={`p-3 border rounded-lg flex items-start cursor-pointer ${
                      selectedReportTypes.includes(type.id)
                        ? 'border-accent-primary bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleReportType(type.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedReportTypes.includes(type.id)}
                      onChange={() => {}}
                      className="mt-1 mr-3 h-4 w-4 text-accent-primary rounded focus:ring-accent-primary"
                    />
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-sm text-text-secondary">
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
            <div className="mb-8">
              <label className="block text-text-primary font-medium mb-2">
                Date Range (Optional)
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-text-secondary mb-1">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-text-secondary mb-1">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className={`btn-primary w-full flex items-center justify-center ${
                isGenerating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Report...
                </>
              ) : (
                <>
                  <BarChart4 size={20} className="mr-2" />
                  Generate Report
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
} 