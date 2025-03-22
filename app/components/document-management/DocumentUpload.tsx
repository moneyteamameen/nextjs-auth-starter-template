"use client";

import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';

type FileWithPreview = File & {
  id: string;
  preview?: string;
  uploadProgress?: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
};

type DocumentUploadProps = {
  onUploadComplete?: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxFileSizeMB?: number;
};

export default function DocumentUpload({
  onUploadComplete,
  maxFiles = 10,
  acceptedFileTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.dwg', '.jpg', '.jpeg', '.png'],
  maxFileSizeMB = 50
}: DocumentUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      return { 
        valid: false, 
        error: `File size exceeds ${maxFileSizeMB}MB limit` 
      };
    }
    
    // Check file type
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedFileTypes.includes(fileExtension) && !acceptedFileTypes.includes('*')) {
      return {
        valid: false,
        error: `File type not supported. Accepted types: ${acceptedFileTypes.join(', ')}`
      };
    }
    
    return { valid: true };
  };
  
  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    
    // Convert FileList to array and limit to max files
    const newFiles: FileWithPreview[] = Array.from(fileList)
      .slice(0, maxFiles - files.length)
      .map(file => {
        const validation = validateFile(file);
        return {
          ...file,
          id: Math.random().toString(36).substring(2, 11),
          status: validation.valid ? 'pending' : 'error',
          errorMessage: validation.error,
          uploadProgress: 0
        };
      });
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Start upload simulation for valid files
    newFiles.forEach(file => {
      if (file.status === 'pending') {
        simulateUpload(file.id);
      }
    });
  };
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    processFiles(e.dataTransfer.files);
  }, [files.length]);
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };
  
  const simulateUpload = (fileId: string) => {
    // Set initial status to uploading
    setFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, status: 'uploading' as const, uploadProgress: 0 } 
          : file
      )
    );
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      
      if (progress >= 100) {
        clearInterval(interval);
        progress = 100;
        
        // Set status to success
        setFiles(prev => 
          prev.map(file => 
            file.id === fileId 
              ? { ...file, status: 'success' as const, uploadProgress: 100 } 
              : file
          )
        );
        
        // Check if all files are uploaded
        setTimeout(() => {
          const allFilesUploaded = files.every(
            file => file.status === 'success' || file.status === 'error'
          );
          
          if (allFilesUploaded && onUploadComplete) {
            const successFiles = files
              .filter(file => file.status === 'success')
              .map(({ id, preview, uploadProgress, status, errorMessage, ...fileData }) => 
                fileData as unknown as File
              );
            
            onUploadComplete(successFiles);
          }
        }, 500);
      } else {
        // Update progress
        setFiles(prev => 
          prev.map(file => 
            file.id === fileId 
              ? { ...file, uploadProgress: progress } 
              : file
          )
        );
      }
    }, 300);
  };
  
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
      
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors
          ${isDragging ? 'border-accent-primary bg-blue-50' : 'border-gray-200 hover:border-accent-primary'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileInputChange}
          accept={acceptedFileTypes.join(',')}
        />
        
        <Upload size={40} className={`mx-auto mb-4 ${isDragging ? 'text-accent-primary' : 'text-gray-400'}`} />
        
        <h3 className="text-lg font-medium mb-2">
          {isDragging ? 'Drop files here' : 'Drag and drop files here'}
        </h3>
        
        <p className="text-text-secondary mb-4">
          or <span className="text-accent-primary font-medium">browse files</span>
        </p>
        
        <p className="text-sm text-text-secondary">
          Supported file types: {acceptedFileTypes.join(', ')} (Max {maxFileSizeMB}MB)
        </p>
      </div>
      
      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Uploaded Files ({files.length})</h3>
          
          <div className="space-y-3">
            {files.map((file) => (
              <div 
                key={file.id} 
                className={`flex items-center p-3 rounded-lg border
                  ${file.status === 'error' ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'}
                `}
              >
                <div className="flex-shrink-0 mr-3">
                  <FileText size={24} className="text-accent-primary" />
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium truncate">
                      {file.name}
                    </p>
                    <span className="text-xs text-text-secondary">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  
                  {file.status === 'error' ? (
                    <p className="text-xs text-accent-error">{file.errorMessage}</p>
                  ) : (
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          file.status === 'success' ? 'bg-accent-secondary' : 'bg-accent-primary'
                        }`}
                        style={{ width: `${file.uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                
                <div className="flex-shrink-0 ml-3 flex items-center">
                  {file.status === 'success' && (
                    <CheckCircle size={16} className="text-accent-secondary mr-2" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle size={16} className="text-accent-error mr-2" />
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file.id);
                    }}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <X size={16} className="text-text-secondary" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 