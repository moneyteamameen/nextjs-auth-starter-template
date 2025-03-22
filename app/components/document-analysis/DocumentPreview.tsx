interface DocumentPreviewProps {
  markdown: string;
  downloadMarkdown: () => void;
}

export default function DocumentPreview({ markdown, downloadMarkdown }: DocumentPreviewProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Document Preview</h3>
        {markdown && (
          <button
            onClick={downloadMarkdown}
            className="px-3 py-1 text-xs font-medium text-blue-600 bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors"
          >
            Download MD
          </button>
        )}
      </div>
      <div className="border border-gray-200 rounded-md bg-gray-50 h-[200px] overflow-auto p-3">
        {markdown ? (
          <pre className="whitespace-pre-wrap text-xs text-gray-700">
            {markdown.substring(0, 1000)}
            {markdown.length > 1000 ? "..." : ""}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">No markdown content to display</p>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {markdown ? (
          markdown.length > 1000 ? "Showing first 1000 characters only" : `Showing all ${markdown.length} characters`
        ) : (
          "No content available"
        )}
      </p>
    </div>
  );
} 