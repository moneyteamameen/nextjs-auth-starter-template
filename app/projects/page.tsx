"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import Link from 'next/link';
import Header from "../components/Header";
import { Search, Filter, ArrowRight, ChevronDown, Plus, CalendarDays, Files, Users } from 'lucide-react';

interface ProjectStatus {
  value: 'active' | 'completed' | 'on-hold' | 'planning';
  label: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus['value'];
  progress: number;
  lastUpdated: Date;
  documentsCount: number;
  reportsCount: number;
  clientName: string;
}

export default function ProjectsPage() {
  const { user, isLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus['value'] | 'all'>('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  
  const statusOptions: ProjectStatus[] = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'planning', label: 'Planning' }
  ];
  
  // Mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProjects: Project[] = [
        {
          id: 'proj-001',
          name: 'Riverside Office Tower',
          description: 'Construction of a 12-story office building with modern amenities and sustainable features.',
          status: 'active',
          progress: 65,
          lastUpdated: new Date(2023, 6, 15),
          documentsCount: 48,
          reportsCount: 12,
          clientName: 'Riverside Development Corp'
        },
        {
          id: 'proj-002',
          name: 'Harbor View Hospital',
          description: 'Renovation and expansion of the existing hospital facility with new medical wings.',
          status: 'active',
          progress: 32,
          lastUpdated: new Date(2023, 7, 3),
          documentsCount: 36,
          reportsCount: 8,
          clientName: 'Harbor Health Systems'
        },
        {
          id: 'proj-003',
          name: 'Metro Station Renovation',
          description: 'Modernization of the central metro station with improved accessibility and safety features.',
          status: 'on-hold',
          progress: 27,
          lastUpdated: new Date(2023, 5, 22),
          documentsCount: 25,
          reportsCount: 5,
          clientName: 'City Transit Authority'
        },
        {
          id: 'proj-004',
          name: 'Oakridge Residential Complex',
          description: 'Development of 120 residential units with community facilities and green spaces.',
          status: 'planning',
          progress: 15,
          lastUpdated: new Date(2023, 8, 1),
          documentsCount: 18,
          reportsCount: 3,
          clientName: 'Oakridge Properties LLC'
        },
        {
          id: 'proj-005',
          name: 'Summit Corporate Headquarters',
          description: 'Construction of a flagship corporate office with state-of-the-art facilities.',
          status: 'completed',
          progress: 100,
          lastUpdated: new Date(2023, 4, 10),
          documentsCount: 72,
          reportsCount: 18,
          clientName: 'Summit Enterprises'
        },
        {
          id: 'proj-006',
          name: 'Lakeside Commercial Center',
          description: 'Mixed-use development with retail spaces, restaurants, and offices on the lakefront.',
          status: 'active',
          progress: 47,
          lastUpdated: new Date(2023, 7, 19),
          documentsCount: 34,
          reportsCount: 7,
          clientName: 'Lakeside Ventures'
        }
      ];
      
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
    }, 1000);
  }, []);
  
  // Filter projects based on search and status
  useEffect(() => {
    let filtered = [...projects];
    
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    
    setFilteredProjects(filtered);
  }, [searchQuery, statusFilter, projects]);
  
  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status class
  const getStatusClass = (status: ProjectStatus['value']): string => {
    switch (status) {
      case 'active':
        return 'status-badge status-active';
      case 'completed':
        return 'status-badge status-completed';
      case 'on-hold':
        return 'status-badge status-hold';
      case 'planning':
        return 'status-badge bg-gray-100 text-gray-700 border border-gray-300';
      default:
        return 'status-badge bg-gray-100 text-gray-700 border border-gray-300';
    }
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
          <p className="text-lg mb-8 text-text-secondary">Please sign in to access your construction projects</p>
          <Link href="/sign-in" className="btn-primary inline-flex items-center">
            Sign In <ArrowRight className="ml-2" size={18} />
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
            <h1 className="text-3xl font-medium tracking-tight mb-2">Project Management</h1>
            <p className="text-text-secondary text-base font-light">Manage and track your construction projects</p>
          </div>
          <div>
            <Link href="/projects/new" className="btn-secondary inline-flex items-center gap-2">
              <Plus size={16} /> New Project
            </Link>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-10 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-background-accent border border-border-light focus:border-accent-primary focus:outline-none text-text-primary placeholder-text-secondary rounded-btn text-sm"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              className="flex items-center justify-between min-w-[200px] px-4 py-3 bg-background-accent border border-border-light hover:border-accent-primary focus:outline-none rounded-btn text-sm"
            >
              <span className="flex items-center">
                <Filter size={16} className="mr-2.5 text-text-secondary" />
                <span className="font-light">
                  {statusFilter === 'all' ? 'All Statuses' : 
                   statusOptions.find(s => s.value === statusFilter)?.label}
                </span>
              </span>
              <ChevronDown size={14} />
            </button>
            
            {showStatusFilter && (
              <div className="absolute z-10 w-full mt-1 bg-background-primary border border-border-light shadow-lg rounded-btn">
                <button
                  className={`w-full px-4 py-2.5 text-left hover:bg-background-accent text-sm font-light ${
                    statusFilter === 'all' ? 'bg-background-accent' : ''
                  }`}
                  onClick={() => {
                    setStatusFilter('all');
                    setShowStatusFilter(false);
                  }}
                >
                  All Statuses
                </button>
                {statusOptions.map(status => (
                  <button
                    key={status.value}
                    className={`w-full px-4 py-2.5 text-left hover:bg-background-accent text-sm font-light ${
                      statusFilter === status.value ? 'bg-background-accent' : ''
                    }`}
                    onClick={() => {
                      setStatusFilter(status.value);
                      setShowStatusFilter(false);
                    }}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-text-secondary text-lg font-light">No projects found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-5 text-accent-secondary font-medium text-sm hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredProjects.map(project => (
              <Link 
                href={`/projects/${project.id}`} 
                key={project.id} 
                className="card group hover:shadow-card-hover transition-all duration-300"
              >
                <div className="mb-5 flex justify-between items-start">
                  <span className={getStatusClass(project.status)}>
                    {statusOptions.find(s => s.value === project.status)?.label}
                  </span>
                  <div className="bg-background-accent h-7 w-7 flex items-center justify-center rounded-full">
                    <span className="text-text-secondary text-xs font-medium">{project.progress}%</span>
                  </div>
                </div>
                
                <h2 className="text-lg font-medium mb-2 text-accent-primary group-hover:text-accent-secondary transition-colors">
                  {project.name}
                </h2>
                
                <p className="text-text-secondary text-sm font-light mb-5 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="text-xs mb-5 text-text-secondary">
                  Client: <span className="font-medium text-text-primary">{project.clientName}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-background-accent p-2.5 flex flex-col items-center justify-center">
                    <CalendarDays size={14} className="text-accent-primary mb-1.5" />
                    <span className="text-[10px] text-text-secondary">Updated</span>
                    <span className="text-xs font-medium">{formatDate(project.lastUpdated)}</span>
                  </div>
                  
                  <div className="bg-background-accent p-2.5 flex flex-col items-center justify-center">
                    <Files size={14} className="text-accent-secondary mb-1.5" />
                    <span className="text-[10px] text-text-secondary">Documents</span>
                    <span className="text-xs font-medium">{project.documentsCount}</span>
                  </div>
                  
                  <div className="bg-background-accent p-2.5 flex flex-col items-center justify-center">
                    <Users size={14} className="text-accent-tertiary mb-1.5" />
                    <span className="text-[10px] text-text-secondary">Reports</span>
                    <span className="text-xs font-medium">{project.reportsCount}</span>
                  </div>
                </div>
                
                <div className="group-hover:pl-2 transition-all duration-300 flex items-center text-accent-primary group-hover:text-accent-secondary">
                  <span className="font-medium text-sm">View Details</span>
                  <ArrowRight className="ml-2 group-hover:ml-3 transition-all" size={14} />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 