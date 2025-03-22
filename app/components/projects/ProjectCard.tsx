"use client";

import { useState } from 'react';
import Link from 'next/link';
import { MoreHorizontal, BarChart2, FileText, Calendar, Clock } from 'lucide-react';

export type ProjectStatus = 'active' | 'completed' | 'on_hold';

export type Project = {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  progress: number;
  lastUpdated: Date;
  documentsCount: number;
  reportsCount: number;
  clientName?: string;
};

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const getStatusClass = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'completed':
        return 'status-completed';
      case 'on_hold':
        return 'status-hold';
      default:
        return '';
    }
  };
  
  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'on_hold':
        return 'On Hold';
      default:
        return 'Unknown';
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{project.name}</h3>
          {project.clientName && (
            <p className="text-text-secondary text-sm">Client: {project.clientName}</p>
          )}
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <MoreHorizontal size={18} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border border-gray-100">
              <Link 
                href={`/projects/${project.id}`}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                View Details
              </Link>
              <Link 
                href={`/projects/${project.id}/edit`}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Edit Project
              </Link>
              <Link 
                href={`/projects/${project.id}/documents`}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Manage Documents
              </Link>
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-accent-error hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle archive functionality
                  setShowMenu(false);
                }}
              >
                Archive Project
              </button>
            </div>
          )}
        </div>
      </div>
      
      {project.description && (
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">{project.description}</p>
      )}
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-accent-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FileText size={16} className="text-text-secondary mr-1" />
          <span className="text-sm text-text-secondary">{project.documentsCount} Documents</span>
        </div>
        <div className="flex items-center">
          <BarChart2 size={16} className="text-text-secondary mr-1" />
          <span className="text-sm text-text-secondary">{project.reportsCount} Reports</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center">
          <Clock size={16} className="text-text-secondary mr-1" />
          <span className="text-sm text-text-secondary">Updated {formatDate(project.lastUpdated)}</span>
        </div>
        <span className={`status-badge ${getStatusClass(project.status)}`}>
          {getStatusLabel(project.status)}
        </span>
      </div>
    </div>
  );
} 