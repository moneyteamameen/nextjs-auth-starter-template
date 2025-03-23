"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import Link from 'next/link';
import Header from '../components/Header';
import { BarChart4, Filter, Search, Calendar, FileText, User, ArrowRight } from 'lucide-react';
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
          <p className="text-lg mb-8 text-text-secondary">Please sign in to access your reports</p>
          <Link href="/sign-in" className="btn-primary inline-flex items-center gap-2">
            Sign In <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-background-primary gridline-background h-screen text-text-primary overflow-y-auto">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-20">
        {/* Page Header */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-medium tracking-tight mb-2">Reports</h1>
            <p className="text-text-secondary text-base font-light">Generate and manage construction project reports</p>
          </div>
          <div>
            <Link href="/reports/generate" className="btn-primary inline-flex items-center gap-2 text-sm font-medium">
              Generate New Report <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-background-accent border border-border-light focus:border-accent-primary focus:outline-none text-text-primary text-sm placeholder-text-secondary rounded-btn"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="appearance-none pl-11 pr-4 py-3 rounded-btn border border-border-light focus:outline-none focus:border-accent-primary bg-background-accent text-sm font-light"
              >
                <option value="all">All Projects</option>
                {projects.filter(p => p !== 'all').map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
              <Filter 
                size={16} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" 
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
              className="appearance-none px-4 py-3 rounded-btn border border-border-light focus:outline-none focus:border-accent-primary bg-background-accent text-sm font-light"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
        
        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="card p-16 text-center">
            <BarChart4 size={40} className="text-text-secondary opacity-30 mx-auto mb-5" />
            <h3 className="text-lg font-medium mb-3">No reports found</h3>
            <p className="text-text-secondary text-sm font-light mb-7 max-w-md mx-auto">
              {searchQuery || projectFilter !== 'all'
                ? 'Try adjusting your search or filters to find what you are looking for'
                : 'Generate your first report to get started with your project documentation'}
            </p>
            <Link 
              href="/reports/generate"
              className="btn-primary inline-flex items-center gap-2 text-sm font-medium"
            >
              Generate Report <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map(report => (
              <div key={report.id} className="card hover:shadow-md transition-shadow">
                <div className="mb-5">
                  <h3 className="font-medium text-lg text-accent-primary mb-2 truncate">{report.title}</h3>
                  <p className="text-text-secondary text-sm font-light line-clamp-2 leading-relaxed">{report.description}</p>
                </div>
                
                <div className="space-y-3 mb-7">
                  <div className="flex items-center text-sm">
                    <FileText size={14} className="text-accent-primary mr-2.5 opacity-70" />
                    <span className="text-text-secondary text-xs">{report.project}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User size={14} className="text-accent-primary mr-2.5 opacity-70" />
                    <span className="text-text-secondary text-xs">{report.author}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className="text-accent-primary mr-2.5 opacity-70" />
                    <span className="text-text-secondary text-xs">{formatDate(report.createdAt)}</span>
                  </div>
                </div>
                
                <Link 
                  href={`/reports/${report.id}`}
                  className="btn-primary w-full text-center text-sm font-medium inline-flex items-center justify-center gap-2"
                >
                  View Report <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 