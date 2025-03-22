"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Footer } from "../components/footer";
import { ClerkLogo } from "../components/clerk-logo";
import { NextLogo } from "../components/next-logo";

// Add this type declaration for the global callback
declare global {
  interface Window {
    sectionCompleteCallback?: () => void;
  }
}

// Fixed StreamingText component with maximum speed
const StreamingText = ({ text, speed = 1, onComplete }: { text: string; speed?: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentCharInLine, setCurrentCharInLine] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Split text into lines when it changes
  useEffect(() => {
    // Reset everything when text changes
    setDisplayedText("");
    setCurrentLine(0);
    setCurrentCharInLine(0);
    setIsComplete(false);
    
    // Split the text into lines
    const textLines = text.split(/\n/).filter(line => line.trim() !== "");
    setLines(textLines);
  }, [text]);
  
  // Handle completion
  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);
  
  // Stream text line by line
  useEffect(() => {
    if (lines.length === 0) return;
    
    // If we've completed all lines, mark as complete
    if (currentLine >= lines.length) {
      if (!isComplete) {
        setIsComplete(true);
      }
      return;
    }
    
    const currentLineText = lines[currentLine];
    
    // If we've completed the current line
    if (currentCharInLine >= currentLineText.length) {
      // Move to the next line after a slightly longer delay
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + (currentLine < lines.length - 1 ? "\n" : ""));
        setCurrentLine(prev => prev + 1);
        setCurrentCharInLine(0);
      }, speed * 5); // Reduced pause between lines (was 10)
      
      return () => clearTimeout(timer);
    }
    
    // Add the next character of the current line
    const timer = setTimeout(() => {
      setDisplayedText(prev => prev + currentLineText[currentCharInLine]);
      setCurrentCharInLine(prev => prev + 1);
    }, speed); // Already at minimum speed
    
    return () => clearTimeout(timer);
  }, [lines, currentLine, currentCharInLine, speed, isComplete]);
  
  return <p className="text-sm whitespace-pre-line">{displayedText}</p>;
};

export default function ConstructionAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markdownResponse, setMarkdownResponse] = useState<string>("");
  const [jsonAnalysis, setJsonAnalysis] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  
  // Track streaming state for visual effects
  const [isStreamingAnalysis, setIsStreamingAnalysis] = useState(false);
  
  // Store analysis sections separately to animate them individually
  const [analysisSections, setAnalysisSections] = useState({
    comprehensive_summary: "",
    risk_and_compliance_analysis: "",
    impact_on_scheduling_and_programming: "",
    forecasting_and_recommendations: "",
    contextual_understanding: ""
  });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setPdfUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setMarkdownResponse("");
      setJsonAnalysis(null);
      setAnalysisSections({
        comprehensive_summary: "",
        risk_and_compliance_analysis: "",
        impact_on_scheduling_and_programming: "",
        forecasting_and_recommendations: "",
        contextual_understanding: ""
      });
    } else {
      setError("Please upload a valid PDF file");
      setFile(null);
      setPdfUrl(null);
    }
  };

  // Analyze document with streaming response
  const analyzeDocument = async () => {
    if (!file) {
      setError("Please upload a PDF file first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setMarkdownResponse("");
    setJsonAnalysis(null);
    setAnalysisSections({
      comprehensive_summary: "",
      risk_and_compliance_analysis: "",
      impact_on_scheduling_and_programming: "",
      forecasting_and_recommendations: "",
      contextual_understanding: ""
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Stream markdown response from FastAPI
      const response = await fetch("/api/construction/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is not readable");

      const decoder = new TextDecoder();
      let partialResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        partialResponse += chunk;
        setMarkdownResponse(partialResponse);
      }

      // After streaming is complete, send to Gemini for JSON analysis
      if (partialResponse) {
        await processWithGemini(partialResponse);
      }
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Process markdown with Gemini API
  const processWithGemini = async (markdown: string) => {
    try {
      setIsStreamingAnalysis(true);
      
      const response = await fetch("/api/construction/gemini-analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: markdown,
          systemPrompt: `You are an AI assistant specializing in construction management. Please analyze the attached document according to the following areas and return your output in **valid JSON** with the specified structure:

1. **comprehensive_summary**  
   - Provide a thorough summary of the document's main points, ensuring no critical information is missed.

2. **risk_and_compliance_analysis**  
   - Identify any potential risks, safety considerations, regulatory obligations, or legal concerns mentioned or implied.

3. **impact_on_scheduling_and_programming**  
   - Discuss how the document's content might affect project timelines, resources, and milestones.

4. **forecasting_and_recommendations**  
   - Suggest proactive measures to address or mitigate any identified risks and leverage potential opportunities.

5. **contextual_understanding**  
   - Relate the document's information to the broader project context, ensuring the analysis remains relevant and actionable.

**Your final response must be in the following JSON format**:

\`\`\`json
{
  "analysis": {
    "comprehensive_summary": "",
    "risk_and_compliance_analysis": "",
    "impact_on_scheduling_and_programming": "",
    "forecasting_and_recommendations": "",
    "contextual_understanding": ""
  }
}
\`\`\``
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Handle streaming JSON response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is not readable");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        try {
          // Try to parse the current buffer as JSON
          const jsonData = JSON.parse(buffer);
          
          // Update the full analysis object
          setJsonAnalysis(jsonData);
          
          // Update individual sections with a sequential streaming effect
          if (jsonData.analysis) {
            // Create a function to update sections sequentially
            const updateSectionsSequentially = async () => {
              const sections = [
                'comprehensive_summary',
                'risk_and_compliance_analysis',
                'impact_on_scheduling_and_programming',
                'forecasting_and_recommendations',
                'contextual_understanding'
              ];
              
              // Process each section one at a time
              for (const section of sections) {
                if (jsonData.analysis[section]) {
                  // Set the current section's full text
                  setAnalysisSections(prev => ({
                    ...prev,
                    [section]: jsonData.analysis[section]
                  }));
                  
                  // Wait for this section to complete streaming before moving to the next
                  await new Promise<void>(resolve => {
                    // Create a new callback for each section
                    window.sectionCompleteCallback = () => {
                      // Add a delay before starting the next section
                      setTimeout(() => {
                        resolve();
                      }, 1000);
                    };
                  });
                }
              }
              
              // Clear the callback when all sections are done
              window.sectionCompleteCallback = undefined;
            };
            
            // Only start the sequential update once
            updateSectionsSequentially().catch(err => {
              console.error("Error in sequential update:", err);
            });
          }
        } catch (e) {
          // If parsing fails, it's likely an incomplete JSON object
          // Just continue accumulating chunks
        }
      }
    } catch (err) {
      setError(`Gemini analysis failed: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setIsStreamingAnalysis(false);
    }
  };

  // Clean up object URL when component unmounts or when file changes
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Auto-scroll to bottom of response as it streams
  useEffect(() => {
    if (responseRef.current && markdownResponse) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [markdownResponse]);

  // Auto-scroll analysis container when new content arrives
  useEffect(() => {
    // Only scroll if we have content and the ref is available
    if (analysisRef.current && Object.values(analysisSections).some(section => section)) {
      // Use requestAnimationFrame to ensure the DOM has updated
      requestAnimationFrame(() => {
        if (analysisRef.current) {
          analysisRef.current.scrollTop = analysisRef.current.scrollHeight;
        }
      });
    }
  }, [analysisSections]);

  // Function to render a section with typing animation effect
  const renderAnimatedSection = (title: string, content: string, color: string) => {
    return (
      <div className={`p-3 bg-${color}-50 rounded-md border-l-4 border-${color}-500 transition-all duration-300 ease-in-out`}>
        <h3 className={`text-md font-semibold text-${color}-700 mb-1`}>{title}</h3>
        <p className="text-sm animate-typing">{content}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-4 py-4">
        <header className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center space-x-2">
            <ClerkLogo />
            <NextLogo />
          </div>
          <div className="flex space-x-2">
            <Link href="/document-analysis">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-md text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                Document Analysis
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-md text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-500 rounded-sm mr-3"></div>
              <h1 className="text-xl font-bold text-gray-800">Construction Document Analysis</h1>
            </div>
            
            {/* Main content area with 3-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Column 1: File Upload and Controls */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h2 className="text-lg font-medium mb-3">Upload Document</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center bg-white">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center w-full"
                  >
                    <svg
                      className="w-10 h-10 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="text-sm text-gray-500 mb-1">
                      {file ? file.name : "Click to upload PDF"}
                    </p>
                    <p className="text-xs text-gray-400">MAX. 10MB</p>
                  </label>
                </div>
                
                {error && (
                  <div className="mt-3 p-2 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  onClick={analyzeDocument}
                  disabled={!file || isAnalyzing}
                  className={`mt-3 w-full py-2 px-4 rounded-md text-white font-medium ${
                    !file || isAnalyzing
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } transition-colors`}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Document"}
                </button>

                {/* PDF Preview */}
                {pdfUrl && (
                  <div className="mt-4">
                    <h3 className="text-md font-medium mb-2">PDF Preview</h3>
                    <iframe
                      src={pdfUrl}
                      className="w-full h-[calc(100vh-400px)] border border-gray-300 rounded-md"
                      title="PDF Preview"
                    />
                  </div>
                )}
              </div>
              
              {/* Column 2: Document Content */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h2 className="text-lg font-medium mb-3">Document Content</h2>
                <div 
                  ref={responseRef}
                  className="bg-white border rounded-md p-3 h-[calc(100vh-200px)] overflow-y-auto prose prose-sm max-w-none"
                >
                  {isAnalyzing && !markdownResponse && (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {markdownResponse ? (
                    <div dangerouslySetInnerHTML={{ __html: markdownResponse }} />
                  ) : !isAnalyzing && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p>Document content will appear here</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Column 3: Analysis Results with streaming effect */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h2 className="text-lg font-medium mb-3">Construction Analysis</h2>
                <div 
                  ref={analysisRef}
                  className="bg-white border rounded-md p-3 h-[calc(100vh-200px)] overflow-y-auto"
                >
                  {(isAnalyzing || isStreamingAnalysis) && !analysisSections.comprehensive_summary && (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {analysisSections.comprehensive_summary && (
                      <div className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-500 animate-fadeIn">
                        <h3 className="text-md font-semibold text-blue-700 mb-1">Summary</h3>
                        <StreamingText 
                          text={analysisSections.comprehensive_summary} 
                          speed={1} 
                          onComplete={() => window.sectionCompleteCallback?.()}
                        />
                      </div>
                    )}
                    
                    {analysisSections.risk_and_compliance_analysis && (
                      <div className="p-3 bg-red-50 rounded-md border-l-4 border-red-500 animate-fadeIn">
                        <h3 className="text-md font-semibold text-red-700 mb-1">Risks & Compliance</h3>
                        <StreamingText 
                          text={analysisSections.risk_and_compliance_analysis} 
                          speed={1} 
                          onComplete={() => window.sectionCompleteCallback?.()}
                        />
                      </div>
                    )}
                    
                    {analysisSections.impact_on_scheduling_and_programming && (
                      <div className="p-3 bg-amber-50 rounded-md border-l-4 border-amber-500 animate-fadeIn">
                        <h3 className="text-md font-semibold text-amber-700 mb-1">Scheduling Impact</h3>
                        <StreamingText 
                          text={analysisSections.impact_on_scheduling_and_programming} 
                          speed={1} 
                          onComplete={() => window.sectionCompleteCallback?.()}
                        />
                      </div>
                    )}
                    
                    {analysisSections.forecasting_and_recommendations && (
                      <div className="p-3 bg-green-50 rounded-md border-l-4 border-green-500 animate-fadeIn">
                        <h3 className="text-md font-semibold text-green-700 mb-1">Recommendations</h3>
                        <StreamingText 
                          text={analysisSections.forecasting_and_recommendations} 
                          speed={1} 
                          onComplete={() => window.sectionCompleteCallback?.()}
                        />
                      </div>
                    )}
                    
                    {analysisSections.contextual_understanding && (
                      <div className="p-3 bg-purple-50 rounded-md border-l-4 border-purple-500 animate-fadeIn">
                        <h3 className="text-md font-semibold text-purple-700 mb-1">Context</h3>
                        <StreamingText 
                          text={analysisSections.contextual_understanding} 
                          speed={1} 
                          onComplete={() => window.sectionCompleteCallback?.()}
                        />
                      </div>
                    )}
                  </div>
                  
                  {jsonAnalysis && Object.values(analysisSections).every(section => section) && (
                    <div className="mt-4 animate-fadeIn">
                      <button
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(jsonAnalysis, null, 2)], {
                            type: "application/json",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `construction-analysis-${new Date().toISOString().slice(0, 10)}.json`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
                      >
                        Download Analysis
                      </button>
                    </div>
                  )}
                  
                  {!isAnalyzing && !isStreamingAnalysis && !analysisSections.comprehensive_summary && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p>Analysis results will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Add these animation styles to your global CSS or as a style tag */}
      <style jsx global>{`
        @keyframes typing {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-typing {
          animation: typing 0.5s ease-in-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
} 