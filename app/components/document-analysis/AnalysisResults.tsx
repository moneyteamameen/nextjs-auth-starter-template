import { useState } from "react";

interface AnalysisResultsProps {
  analysisResult: string;
  isAnalyzing: boolean;
  addFollowUpQuestion: (question: string) => Promise<void>;
  downloadAnalysisResult: () => void;
}

export default function AnalysisResults({ 
  analysisResult, 
  isAnalyzing, 
  addFollowUpQuestion,
  downloadAnalysisResult
}: AnalysisResultsProps) {
  const [followUpQuestion, setFollowUpQuestion] = useState("");

  const handleFollowUpSubmit = () => {
    if (followUpQuestion) {
      addFollowUpQuestion(followUpQuestion);
      setFollowUpQuestion("");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-base font-semibold mb-3 text-gray-800">3. Analysis Results</h2>
      
      {!analysisResult ? (
        <div className="border border-gray-200 rounded-lg p-8 text-center h-[200px] flex flex-col items-center justify-center">
          <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <p className="text-sm text-gray-400">
            Upload a document and run analysis to see results here
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="mb-4 overflow-auto max-h-[400px]">
            <div className="prose prose-sm max-w-none">
              {analysisResult.length === 0 ? (
                <p className="text-red-500">Analysis result is empty</p>
              ) : (
                <pre className="whitespace-pre-wrap text-sm">{analysisResult}</pre>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mb-4">
            <button
              onClick={downloadAnalysisResult}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Download Analysis
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(analysisResult);
                alert("Analysis copied to clipboard!");
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Follow-up Questions</h3>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={followUpQuestion}
                onChange={(e) => setFollowUpQuestion(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              />
              <button
                onClick={handleFollowUpSubmit}
                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                disabled={isAnalyzing || !followUpQuestion}
              >
                {isAnalyzing ? "Processing..." : "Ask"}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addFollowUpQuestion("Can you explain this in simpler terms?")}
                className="p-2 text-xs text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-left"
              >
                Can you explain this in simpler terms?
              </button>
              <button
                onClick={() => addFollowUpQuestion("What are the key takeaways?")}
                className="p-2 text-xs text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-left"
              >
                What are the key takeaways?
              </button>
              <button
                onClick={() => addFollowUpQuestion("Can you provide more details about this?")}
                className="p-2 text-xs text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-left"
              >
                Can you provide more details about this?
              </button>
              <button
                onClick={() => addFollowUpQuestion("What are the implications of this?")}
                className="p-2 text-xs text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-left"
              >
                What are the implications of this?
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 