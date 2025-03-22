import { MODEL_TOKEN_LIMITS, PROMPT_TEMPLATES, formatCurrency } from "../../utils/constants";

interface AnalysisConfigProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedTemplate: number;
  setSelectedTemplate: (template: number) => void;
  question: string;
  setQuestion: (question: string) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  tokenCount: number;
  costs: {
    input: number;
    output: number;
    total: number;
    inputTokens: number;
    outputTokens: number;
  };
  truncatedContent: boolean;
  analyzeDocument: () => Promise<void>;
  isAnalyzing: boolean;
}

export default function AnalysisConfig({
  selectedModel,
  setSelectedModel,
  selectedTemplate,
  setSelectedTemplate,
  question,
  setQuestion,
  customPrompt,
  setCustomPrompt,
  tokenCount,
  costs,
  truncatedContent,
  analyzeDocument,
  isAnalyzing
}: AnalysisConfigProps) {
  return (
    <div className="mt-6">
      <h2 className="text-base font-semibold mb-3 text-gray-800">2. Configure Analysis</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Model
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4o-mini">GPT-4o Mini</option>
          <option value="gpt-4o">GPT-4o</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Token limit: {(MODEL_TOKEN_LIMITS[selectedModel as keyof typeof MODEL_TOKEN_LIMITS]).toLocaleString()} tokens
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Analysis Template
        </label>
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          {PROMPT_TEMPLATES.map((template, index) => (
            <option key={index} value={index}>
              {template.name} - {template.description}
            </option>
          ))}
        </select>
      </div>
      
      {selectedTemplate === 2 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question about the document"
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      )}
      
      {selectedTemplate === 4 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Prompt
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter your custom analysis prompt"
            className="w-full p-2 border border-gray-300 rounded-md text-sm h-24"
          />
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs text-gray-600">
            Document tokens: <span className="font-medium">{tokenCount.toLocaleString()}</span>
          </span>
          <div className="text-xs text-gray-600 mt-1">
            Estimated cost: <span className="font-medium text-blue-600">{formatCurrency(costs.total)}</span>
          </div>
          {truncatedContent && (
            <div className="text-xs text-amber-600 mt-1">
              Document was truncated to fit model's token limit
            </div>
          )}
        </div>
        <button
          onClick={analyzeDocument}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Document"}
        </button>
      </div>
    </div>
  );
} 