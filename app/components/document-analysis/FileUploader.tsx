import { ChangeEvent } from "react";

interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  convertToMarkdown: () => void;
  massConvertToMarkdown: () => void;
  isConverting: boolean;
  error: string | null;
}

export default function FileUploader({
  file,
  setFile,
  files,
  setFiles,
  convertToMarkdown,
  massConvertToMarkdown,
  isConverting,
  error
}: FileUploaderProps) {
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleMultipleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = () => {
    setFile(null);
  };
  
  const removeFiles = () => {
    setFiles([]);
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
      
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Single File Upload</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOCX, PPTX, TXT (Max 10MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.docx,.pptx,.txt"
              />
            </label>
          </div>
          
          {file && (
            <div className="flex-1">
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="font-medium truncate">{file.name}</span>
                  </div>
                  <button 
                    onClick={removeFile}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="mt-3">
                  <button
                    onClick={convertToMarkdown}
                    disabled={isConverting}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                  >
                    {isConverting ? "Converting..." : "Convert to Markdown"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Multiple Files Upload</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload multiple files</span>
                </p>
                <p className="text-xs text-gray-500">PDF, DOCX, PPTX, TXT (Max 10MB each)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleMultipleFileChange}
                accept=".pdf,.docx,.pptx,.txt"
                multiple
              />
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="flex-1">
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Selected {files.length} files</span>
                  <button 
                    onClick={removeFiles}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="max-h-24 overflow-y-auto mb-3">
                  {files.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600 truncate">
                      {file.name}
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <button
                    onClick={massConvertToMarkdown}
                    disabled={isConverting}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 transition-colors"
                  >
                    {isConverting ? "Converting..." : "Mass Convert to Markdown"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mt-4">
          {error}
        </div>
      )}
    </div>
  );
} 