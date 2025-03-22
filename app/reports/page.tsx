"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import DashboardLayout from '../components/DashboardLayout';
import Link from 'next/link';
import { BarChart4, Filter, Search, Calendar, FileText, User } from 'lucide-react';
import { mockReports } from '../data/mockReports';

export default function ReportsPage() {
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [reports, setReports] = useState(mockReports);
  
  // Get unique projects for filter
  const projects = ['all', ...Array.from(new Set(mockReports.map(report => report.project)))];
  
  // Filter and sort reports
  useEffect(() => {
    let filtered = [...mockReports];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.project.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply project filter
    if (projectFilter !== 'all') {
      filtered = filtered.filter(report => report.project === projectFilter);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    setReports(filtered);
  }, [searchQuery, projectFilter, sortBy]);
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          <p className="text-lg mb-4">Please sign in to access reports</p>
          <Link href="/sign-in" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reports</h1>
          <Link 
            href="/reports/generate"
            className="btn-primary"
          >
            Generate New Report
          </Link>
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form className="flex-grow max-w-md relative" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
            />
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
          </form>
          
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              >
                <option value="all">All Projects</option>
                {projects.filter(p => p !== 'all').map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
              <Filter 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
              className="appearance-none px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
        
        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="card p-12 text-center">
            <BarChart4 size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No reports found</h3>
            <p className="text-text-secondary mb-6">
              {searchQuery || projectFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Generate your first report to get started'}
            </p>
            <Link 
              href="/reports/generate"
              className="btn-primary inline-block"
            >
              Generate Report
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map(report => (
              <div key={report.id} className="card hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg truncate">{report.title}</h3>
                  <p className="text-text-secondary text-sm line-clamp-2">{report.description}</p>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm">
                    <FileText size={16} className="text-accent-primary mr-2" />
                    <span className="text-text-secondary">{report.project}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User size={16} className="text-accent-primary mr-2" />
                    <span className="text-text-secondary">{report.author}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar size={16} className="text-accent-primary mr-2" />
                    <span className="text-text-secondary">{formatDate(report.createdAt)}</span>
                  </div>
                </div>
                
                <Link 
                  href={`/reports/${report.id}`}
                  className="btn-primary w-full text-center"
                >
                  View Report
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 