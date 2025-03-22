"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import Link from 'next/link';
import Header from "../components/Header";
import DocumentUpload from '../components/document-management/DocumentUpload';
import { Search, Filter, FileText, ArrowRight, ChevronDown, Folder, Calendar, FileCheck, AlertTriangle, MoreHorizontal, Plus } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  project: string;
  type: string;
  size: number;
  uploadedAt: Date;
  processingStatus: 'processed' | 'processing' | 'failed' | 'pending';
}

export default function DocumentManagementPage() {
  const { user, isLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  
  // Document types for filtering
  const documentTypes = ['all', 'pdf', 'dwg', 'doc', 'xls', 'jpg', 'png'];
  
  // Mock document data
  useEffect(() => {
    setTimeout(() => {
      const mockDocuments: Document[] = [
        {
          id: 'doc-001',
          name: 'Site-Plan-Q2-2023.pdf',
          project: 'Riverside Office Tower',
          type: 'pdf',
          size: 4500000, // 4.5 MB
          uploadedAt: new Date(2023, 6, 15),
          processingStatus: 'processed'
        },
        {
          id: 'doc-002',
          name: 'Electrical-Layout-Floor-1.dwg',
          project: 'Harbor View Hospital',
          type: 'dwg',
          size: 12800000, // 12.8 MB
          uploadedAt: new Date(2023, 7, 2),
          processingStatus: 'processed'
        },
        {
          id: 'doc-003',
          name: 'Structural-Analysis-Report.doc',
          project: 'Metro Station Renovation',
          type: 'doc',
          size: 2300000, // 2.3 MB
          uploadedAt: new Date(2023, 7, 10),
          processingStatus: 'processing'
        },
        {
          id: 'doc-004',
          name: 'Construction-Schedule-Updated.xls',
          project: 'Riverside Office Tower',
          type: 'xls',
          size: 1800000, // 1.8 MB
          uploadedAt: new Date(2023, 7, 5),
          processingStatus: 'failed'
        },
        {
          id: 'doc-005',
          name: 'Facade-Rendering-Final.jpg',
          project: 'Summit Corporate Headquarters',
          type: 'jpg',
          size: 8700000, // 8.7 MB
          uploadedAt: new Date(2023, 6, 28),
          processingStatus: 'processed'
        },
        {
          id: 'doc-006',
          name: 'Material-Specifications.pdf',
          project: 'Lakeside Commercial Center',
          type: 'pdf',
          size: 3200000, // 3.2 MB
          uploadedAt: new Date(2023, 7, 12),
          processingStatus: 'pending'
        }
      ];
      
      setDocuments(mockDocuments);
      setFilteredDocuments(mockDocuments);
    }, 1000);
  }, []);
  
  // Filter documents based on search and type
  useEffect(() => {
    let filtered = [...documents];
    
    if (searchQuery) {
      filtered = filtered.filter(document => 
        document.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        document.project.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(document => document.type === typeFilter);
    }
    
    setFilteredDocuments(filtered);
  }, [searchQuery, typeFilter, documents]);
  
  // Format file size in KB, MB, or GB
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }
  };
  
  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Toggle document selection
  const toggleDocumentSelection = (id: string) => {
    setSelectedDocuments(prev => 
      prev.includes(id) 
        ? prev.filter(docId => docId !== id)
        : [...prev, id]
    );
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: Document['processingStatus']): string => {
    switch (status) {
      case 'processed':
        return 'status-badge status-completed';
      case 'processing':
        return 'status-badge status-active';
      case 'failed':
        return 'status-badge status-error';
      case 'pending':
        return 'status-badge status-hold';
      default:
        return 'status-badge bg-gray-100 text-gray-700';
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
          <p className="text-lg mb-8 text-text-secondary">Please sign in to access document management</p>
          <Link href="/sign-in" className="btn-primary inline-flex items-center">
            Sign In <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-background-primary h-screen text-text-primary overflow-y-auto">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-20">
        {/* Page Header */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <div className="uppercase text-accent-secondary font-medium mb-2">••DOCUMENT MANAGEMENT••</div>
            <h1 className="heading-lg mb-1">Construction Documents</h1>
            <p className="text-text-secondary">Upload, process and manage your construction documents</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="btn-outline"
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
            {selectedDocuments.length > 0 && (
              <button className="btn-secondary">
                Process {selectedDocuments.length} Selected
              </button>
            )}
          </div>
        </div>
        
        {/* Upload Section */}
        <div className="mb-10 card">
          <h2 className="text-xl font-bold mb-4 text-accent-primary">Upload Documents</h2>
          <DocumentUpload 
            maxFiles={10}
            acceptedFileTypes={['pdf', 'doc', 'docx', 'xls', 'xlsx', 'dwg', 'jpg', 'png']}
            maxFileSizeMB={20}
            onUploadComplete={(files) => console.log('Uploaded files:', files)}
          />
        </div>
        
        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background-accent border border-border-light focus:border-accent-primary focus:outline-none text-text-primary placeholder-text-secondary rounded-btn"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowTypeFilter(!showTypeFilter)}
              className="flex items-center justify-between min-w-[180px] px-4 py-3 bg-background-accent border border-border-light hover:border-accent-primary focus:outline-none rounded-btn"
            >
              <span className="flex items-center">
                <Filter size={18} className="mr-2 text-text-secondary" />
                <span className="capitalize">
                  {typeFilter === 'all' ? 'All Types' : typeFilter}
                </span>
              </span>
              <ChevronDown size={18} />
            </button>
            
            {showTypeFilter && (
              <div className="absolute z-10 w-full mt-1 bg-background-primary border border-border-light shadow-lg rounded-btn">
                {documentTypes.map(type => (
                  <button
                    key={type}
                    className={`w-full px-4 py-2 text-left capitalize hover:bg-background-accent ${
                      typeFilter === type ? 'bg-background-accent' : ''
                    }`}
                    onClick={() => {
                      setTypeFilter(type);
                      setShowTypeFilter(false);
                    }}
                  >
                    {type === 'all' ? 'All Types' : type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Document Grid/List View */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg mb-4">No documents found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
              }}
              className="text-accent-secondary font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(document => (
              <div key={document.id} className="card group">
                <div className="flex justify-between items-start mb-4">
                  <span className={getStatusBadgeClass(document.processingStatus)}>
                    {document.processingStatus.charAt(0).toUpperCase() + document.processingStatus.slice(1)}
                  </span>
                  <div className="flex">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(document.id)}
                      onChange={() => toggleDocumentSelection(document.id)}
                      className="mr-2 rounded-btn accent-accent-secondary"
                    />
                    <button className="btn-icon">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 mb-4">
                  <div className="p-3 bg-background-accent text-accent-primary rounded-sm">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-accent-primary group-hover:text-accent-secondary transition-colors">
                      {document.name}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {formatFileSize(document.size)} • {document.type.toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <Folder size={16} className="text-accent-tertiary mr-2" />
                    <span className="text-text-secondary text-sm">{document.project}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="text-accent-secondary mr-2" />
                    <span className="text-text-secondary text-sm">{formatDate(document.uploadedAt)}</span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Link 
                    href={`/documents/${document.id}`}
                    className="text-accent-primary font-bold group-hover:text-accent-secondary hover:underline inline-flex items-center"
                  >
                    View Details <ArrowRight className="ml-2 group-hover:ml-3 transition-all" size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="text-left p-3 font-medium text-text-secondary">
                    <input
                      type="checkbox"
                      onChange={() => {
                        if (selectedDocuments.length === filteredDocuments.length) {
                          setSelectedDocuments([]);
                        } else {
                          setSelectedDocuments(filteredDocuments.map(doc => doc.id));
                        }
                      }}
                      checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                      className="mr-2 accent-accent-secondary"
                    />
                    Name
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">Project</th>
                  <th className="text-left p-3 font-medium text-text-secondary">Type</th>
                  <th className="text-left p-3 font-medium text-text-secondary">Size</th>
                  <th className="text-left p-3 font-medium text-text-secondary">Date</th>
                  <th className="text-left p-3 font-medium text-text-secondary">Status</th>
                  <th className="text-left p-3 font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map(document => (
                  <tr key={document.id} className="border-b border-border-light hover:bg-background-accent">
                    <td className="p-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(document.id)}
                          onChange={() => toggleDocumentSelection(document.id)}
                          className="mr-3 accent-accent-secondary"
                        />
                        <FileText size={18} className="text-accent-primary mr-2" />
                        <span className="font-medium text-accent-primary">{document.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-text-secondary">{document.project}</td>
                    <td className="p-3 uppercase text-text-secondary">{document.type}</td>
                    <td className="p-3 text-text-secondary">{formatFileSize(document.size)}</td>
                    <td className="p-3 text-text-secondary">{formatDate(document.uploadedAt)}</td>
                    <td className="p-3">
                      <span className={getStatusBadgeClass(document.processingStatus)}>
                        {document.processingStatus.charAt(0).toUpperCase() + document.processingStatus.slice(1)}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Link 
                          href={`/documents/${document.id}`}
                          className="btn-icon"
                          title="View Document"
                        >
                          <ArrowRight size={16} />
                        </Link>
                        <button className="btn-icon" title="More Options">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 