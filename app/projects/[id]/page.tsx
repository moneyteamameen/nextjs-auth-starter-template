"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/auth-context";
import { FileText, ArrowLeft, Download } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  created_at: string;
}

interface Document {
  id: string;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  category: string | null;
  created_at: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    async function fetchProjectData() {
      try {
        setIsLoading(true);
        
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
          
        if (projectError) throw projectError;
        setProject(projectData);
        
        // Fetch project documents
        const { data: documentsData, error: documentsError } = await supabase
          .from('documents')
          .select('*')
          .eq('project_id', id)
          .order('created_at', { ascending: false });
          
        if (documentsError) throw documentsError;
        setDocuments(documentsData || []);
        
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Failed to load project data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjectData();
  }, [id, user]);

  const downloadDocument = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);
        
      if (error) throw error;
      
      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err) {
      console.error('Error downloading document:', err);
      alert('Failed to download document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  if (isLoading) {
    return (
      <div className="max-w-[75rem] w-full mx-auto pt-8 px-4 md:px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-[75rem] w-full mx-auto pt-8 px-4 md:px-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Project</h2>
          <p className="text-gray-600 mb-6">{error || "Project not found"}</p>
          <button 
            onClick={() => router.push('/projects')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-[75rem] w-full mx-auto pt-8 px-4 md:px-6 pb-16">
      <button 
        onClick={() => router.push('/projects')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Projects
      </button>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              project.status === 'active' ? 'bg-green-100 text-green-800' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-600">
          <div>
            Created on {new Date(project.created_at).toLocaleDateString()}
          </div>
          <div className="mt-2 md:mt-0">
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-4">Project Documents</h2>
      
      {documents.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <FileText size={40} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-1">No documents yet</h3>
          <p className="text-gray-500">Upload documents to this project to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <div key={doc.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <FileText size={18} className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1 break-all line-clamp-2">{doc.name}</h3>
                      <p className="text-xs text-gray-500">{formatFileSize(doc.file_size)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                {doc.category ? (
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                    {doc.category}
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">No category</span>
                )}
                <button 
                  onClick={() => downloadDocument(doc)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 