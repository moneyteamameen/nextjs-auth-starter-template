"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Footer } from "../components/footer";
import { ClerkLogo } from "../components/clerk-logo";
import { NextLogo } from "../components/next-logo";
import { encode } from "gpt-tokenizer";
import FileUploader from "../components/document-analysis/FileUploader";
import AnalysisConfig from "../components/document-analysis/AnalysisConfig";
import DocumentPreview from "../components/document-analysis/DocumentPreview";
import AnalysisResults from "../components/document-analysis/AnalysisResults";
import CostEstimation from "../components/document-analysis/CostEstimation";
import { MODEL_PRICING, MODEL_TOKEN_LIMITS, PROMPT_TEMPLATES } from "../utils/constants";

export default function DocumentAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [markdown, setMarkdown] = useState<string>("");
  const [markdownFiles, setMarkdownFiles] = useState<{name: string, content: string}[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-3.5-turbo");
  const [promptChain, setPromptChain] = useState<Array<{role: string, content: string}>>([]);
  const [truncatedContent, setTruncatedContent] = useState<boolean>(false);
  const [currentFileName, setCurrentFileName] = useState<string>("");

  // Check and truncate content based on token limits
  const checkAndTruncateContent = (content: string) => {
    const tokens = encode(content);
    setTokenCount(tokens.length);
    
    const tokenLimit = MODEL_TOKEN_LIMITS[selectedModel as keyof typeof MODEL_TOKEN_LIMITS];
    
    if (tokens.length > tokenLimit * 0.8) {
      const truncatedTokens = tokens.slice(0, Math.floor(tokenLimit * 0.8));
      const truncatedContent = content.substring(0, Math.floor(content.length * (truncatedTokens.length / tokens.length)));
      setMarkdown(truncatedContent);
      setTruncatedContent(true);
      } else {
      setMarkdown(content);
      setTruncatedContent(false);
    }
  };

  // Update token count when model changes
  useEffect(() => {
    if (markdown) {
      checkAndTruncateContent(markdown);
    }
  }, [selectedModel, markdown]);

  // Convert file to markdown
  const convertToMarkdown = async () => {
    if (!file) return;
    
    setIsConverting(true);
    setError(null);
    setMarkdown("");
    setAnalysisResult("");
    setTruncatedContent(false);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.markdown) {
        throw new Error("No markdown content received from server");
      }
      
      setCurrentFileName(file.name);
      setMarkdown(data.markdown);
      checkAndTruncateContent(data.markdown);
    } catch (err) {
      setError(`Failed to convert file: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  // Convert multiple files to markdown
  const massConvertToMarkdown = async () => {
    if (files.length === 0) return;
    
    setIsConverting(true);
    setError(null);
    setMarkdownFiles([]);
    
    try {
      const convertedFiles = [];
      const errors = [];
      
      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/convert", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            errors.push(`Error converting ${file.name}: ${response.status}`);
            continue;
          }

          const data = await response.json();
          
          if (data.error) {
            errors.push(`Error converting ${file.name}: ${data.error}`);
            continue;
          }
          
          if (!data.markdown) {
            errors.push(`No markdown content received for ${file.name}`);
            continue;
          }
          
          convertedFiles.push({
            name: file.name,
            content: data.markdown
          });
        } catch (err) {
          errors.push(`Failed to process ${file.name}: ${err instanceof Error ? err.message : String(err)}`);
          continue;
        }
      }
      
      setMarkdownFiles(convertedFiles);
      
      // Set the first file as current if available
      if (convertedFiles.length > 0) {
        setMarkdown(convertedFiles[0].content);
        setCurrentFileName(convertedFiles[0].name);
        checkAndTruncateContent(convertedFiles[0].content);
      }
      
      // Set error message if there were any issues, but don't stop the overall process
      if (errors.length > 0) {
        setError(`Some files could not be converted: ${errors.join('; ')}`);
      }
      
    } catch (err) {
      setError(`Conversion process error: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  // Download all markdown files as a zip
  const downloadAllMarkdown = async () => {
    if (markdownFiles.length === 0) return;
    
    try {
      // We need to dynamically import JSZip since it's a client-side only library
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      markdownFiles.forEach(file => {
        const baseFileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        zip.file(`${baseFileName}.md`, file.content);
      });
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted_documents.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      setError(`Failed to download files: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    }
  };

  // Download all markdown files as a single file
  const downloadAllAsSingleMarkdown = () => {
    if (markdownFiles.length === 0) return;
    
    try {
      // Combine all markdown files with file name as header
      let combinedContent = "";
      
      markdownFiles.forEach((file, index) => {
        // Add separator between files
        if (index > 0) {
          combinedContent += "\n\n---\n\n";
        }
        
        // Add file name as header
        combinedContent += `# ${file.name}\n\n`;
        
        // Add the file content
        combinedContent += file.content;
      });
      
      // Create and download the combined file
      const blob = new Blob([combinedContent], { 
        type: 'text/markdown;charset=utf-8' 
      });
      
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'combined_documents.md';
      
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      setError(`Failed to combine files: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    }
  };

  // Build prompt for analysis
  const buildPrompt = () => {
    const template = PROMPT_TEMPLATES[selectedTemplate];
    let promptText = template.prompt;
    
    promptText = promptText.replace("{document}", markdown);
    
    if (template.name === "Question Answering") {
      promptText = promptText.replace("{question}", question);
    } else if (template.name === "Custom Analysis") {
      promptText = promptText.replace("{customPrompt}", customPrompt);
    }
    
    return promptText;
  };

  // Analyze document
  const analyzeDocument = async () => {
    if (!markdown) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const promptText = buildPrompt();
      
      const newPromptChain = [
        { role: "system", content: "You are a helpful assistant that analyzes documents. Format your response using Markdown." },
        { role: "user", content: promptText }
      ];
      
      setPromptChain(newPromptChain);
      
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: newPromptChain
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data.result);
      
      setPromptChain([...newPromptChain, { role: "assistant", content: data.result }]);
    } catch (err) {
      setError(`Failed to analyze document: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add follow-up question
  const addFollowUpQuestion = async (question: string) => {
    if (!markdown || !analysisResult) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const updatedPromptChain = [
        ...promptChain,
        { role: "user", content: question }
      ];
      
      setPromptChain(updatedPromptChain);
      
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: updatedPromptChain
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data = await response.json();
      
      setAnalysisResult(data.result);
      setPromptChain([...updatedPromptChain, { role: "assistant", content: data.result }]);
    } catch (err) {
      setError(`Failed to process follow-up: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculate cost estimation
  const calculateCost = () => {
    if (!tokenCount) return { input: 0, output: 0, total: 0, inputTokens: 0, outputTokens: 0 };
    
    const estimatedOutputTokens = Math.ceil(tokenCount * 0.2);
    
    const pricing = MODEL_PRICING[selectedModel as keyof typeof MODEL_PRICING];
    const inputCost = tokenCount * pricing.input;
    const outputCost = estimatedOutputTokens * pricing.output;
    
    return {
      input: inputCost,
      output: outputCost,
      total: inputCost + outputCost,
      inputTokens: tokenCount,
      outputTokens: estimatedOutputTokens
    };
  };

  // Clean up object URL when component unmounts or when file changes
  useEffect(() => {
    // No cleanup needed anymore
  }, []);

  const costs = calculateCost();

  // Near the top of the component after you declare markdownFiles state
  useEffect(() => {
    console.log('Markdown files count:', markdownFiles.length);
  }, [markdownFiles]);

  return (
    <div className="min-h-screen bg-[#f0f4f9]">
      <div className="max-w-[90rem] w-full mx-auto px-4 py-6">
        <header className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center space-x-2">
            <ClerkLogo />
            <NextLogo />
          </div>
          <div className="flex space-x-2">
            <Link href="/document-management">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                Document Management
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-blue-500 rounded-sm mr-3"></div>
              <h1 className="text-xl font-bold text-gray-800">Document Analysis</h1>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/2">
                <FileUploader 
                  file={file}
                  setFile={setFile}
                  files={files}
                  setFiles={setFiles}
                  convertToMarkdown={convertToMarkdown}
                  massConvertToMarkdown={massConvertToMarkdown}
                  isConverting={isConverting}
                  error={error}
                />

                {(markdown || markdownFiles.length > 0) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {markdown && (
                      <button
                        onClick={() => {
                          if (!markdown) return;
                          
                          let baseFileName = "converted_document";
                          
                          if (currentFileName) {
                            const lastDotIndex = currentFileName.lastIndexOf('.');
                            if (lastDotIndex !== -1) {
                              baseFileName = currentFileName.substring(0, lastDotIndex);
                            } else {
                              baseFileName = currentFileName;
                            }
                          }
                          
                          const blob = new Blob([markdown], { 
                            type: 'text/markdown;charset=utf-8' 
                          });
                          
                          const url = URL.createObjectURL(blob);
                          
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${baseFileName}.md`;
                          
                          document.body.appendChild(a);
                          a.click();
                          
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Download Current Markdown
                      </button>
                    )}
                    
                    {markdownFiles.length > 0 && (
                      <button
                        onClick={downloadAllMarkdown}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Download All as Zip
                      </button>
                    )}

                    {markdownFiles.length > 0 && (
                      <button
                        onClick={downloadAllAsSingleMarkdown}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                      >
                        Download All as Single MD
                      </button>
                    )}
                  </div>
                )}

                {markdown && (
                  <>
                    <AnalysisConfig 
                      selectedModel={selectedModel}
                      setSelectedModel={setSelectedModel}
                      selectedTemplate={selectedTemplate}
                      setSelectedTemplate={setSelectedTemplate}
                      question={question}
                      setQuestion={setQuestion}
                      customPrompt={customPrompt}
                      setCustomPrompt={setCustomPrompt}
                      tokenCount={tokenCount}
                      costs={costs}
                      truncatedContent={truncatedContent}
                      analyzeDocument={analyzeDocument}
                      isAnalyzing={isAnalyzing}
                    />
                    
                    <DocumentPreview 
                      markdown={markdown}
                      downloadMarkdown={() => {
                        if (!markdown) return;
                        
                        let baseFileName = "converted_document";
                        
                        if (currentFileName) {
                          const lastDotIndex = currentFileName.lastIndexOf('.');
                          if (lastDotIndex !== -1) {
                            baseFileName = currentFileName.substring(0, lastDotIndex);
                          } else {
                            baseFileName = currentFileName;
                          }
                        }
                        
                        const blob = new Blob([markdown], { 
                          type: 'text/markdown;charset=utf-8' 
                        });
                        
                        const url = URL.createObjectURL(blob);
                        
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${baseFileName}.md`;
                        
                        document.body.appendChild(a);
                        a.click();
                        
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    />
                  </>
                )}

                {markdown && (
                  <AnalysisResults 
                    analysisResult={analysisResult}
                    isAnalyzing={isAnalyzing}
                    addFollowUpQuestion={addFollowUpQuestion}
                    downloadAnalysisResult={() => {
                      if (!analysisResult) return;
                      
                      let baseFileName = "analysis_result";
                      
                      if (currentFileName) {
                        const lastDotIndex = currentFileName.lastIndexOf('.');
                        if (lastDotIndex !== -1) {
                          baseFileName = `${currentFileName.substring(0, lastDotIndex)}_analysis`;
                        } else {
                          baseFileName = `${currentFileName}_analysis`;
                        }
                      }
                      
                      const blob = new Blob([analysisResult], { 
                        type: 'text/markdown;charset=utf-8' 
                      });
                      
                      const url = URL.createObjectURL(blob);
                      
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${baseFileName}.md`;
                      
                      document.body.appendChild(a);
                      a.click();
                      
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  />
                )}
                
                {markdown && <CostEstimation selectedModel={selectedModel} costs={costs} />}
              </div>
              
              <div className="lg:w-1/2 lg:sticky lg:top-6 self-start">
                <div className="border rounded-md p-4 bg-gray-50">
                  <p className="text-gray-500">No PDF file uploaded yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}