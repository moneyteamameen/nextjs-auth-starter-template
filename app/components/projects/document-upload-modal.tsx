"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText, Check, AlertCircle, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/auth-context";

interface DocumentUploadModalProps {
  onClose: () => void;
}

type UploadStage = "details" | "uploading" | "success" | "error";

interface FileData {
  name: string;
  size: number;
  type: string;
  file: File;
  category?: string;
}

export function DocumentUploadModal({ onClose }: DocumentUploadModalProps) {
  const { user } = useAuth();
  const [stage, setStage] = useState<UploadStage>("details");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [files, setFiles] = useState<FileData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        category: ""
      }));
      
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const updateFileCategory = (index: number, category: string) => {
    const updatedFiles = [...files];
    updatedFiles[index].category = category;
    setFiles(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }
    
    if (files.length === 0) {
      setError("Please upload at least one file");
      return;
    }
    
    setStage("uploading");
    setError(null);
    
    try {
      // Create project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: projectName,
          description: projectDescription,
          user_id: user?.id,
          status: 'active',
          progress: 0
        })
        .select()
        .single();
      
      if (projectError) throw projectError;
      
      // Upload files
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        const filePath = `${user?.id}/${project.id}/${fileData.name}`;
        
        setUploadProgress(Math.round((i / files.length) * 100));
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, fileData.file);
          
        if (uploadError) throw uploadError;
        
        // Create document record
        const { error: docError } = await supabase
          .from('documents')
          .insert({
            project_id: project.id,
            name: fileData.name,
            file_path: filePath,
            file_type: fileData.type,
            file_size: fileData.size,
            category: fileData.category || null
          });
          
        if (docError) throw docError;
      }
      
      setStage("success");
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error("Upload error:", err);
      setStage("error");
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Create New Project</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {stage === "details" && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name*
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Documents
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, Word, Excel, CAD files (up to 10MB each)
                  </p>
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Files to upload:</h3>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-start p-2 bg-gray-50 rounded-md">
                        <FileText className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          <select
                            value={file.category || ""}
                            onChange={(e) => updateFileCategory(index, e.target.value)}
                            className="mt-1 text-xs p-1 border border-gray-300 rounded w-full"
                          >
                            <option value="">Select category</option>
                            <option value="drawings">Drawings</option>
                            <option value="specifications">Specifications</option>
                            <option value="contracts">Contracts</option>
                            <option value="reports">Reports</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md flex items-center text-sm">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Create Project
                </button>
              </div>
            </form>
          )}
          
          {stage === "uploading" && (
            <div className="py-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-700 mb-2">Uploading files...</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{uploadProgress}% complete</p>
            </div>
          )}
          
          {stage === "success" && (
            <div className="py-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Project Created!</h3>
              <p className="text-gray-500">Your project has been created successfully.</p>
            </div>
          )}
          
          {stage === "error" && (
            <div className="py-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Failed</h3>
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => setStage("details")}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 