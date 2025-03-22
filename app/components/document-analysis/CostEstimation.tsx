import { MODEL_PRICING, formatCurrency } from "../../utils/constants";

interface CostEstimationProps {
  selectedModel: string;
  costs: {
    input: number;
    output: number;
    total: number;
    inputTokens: number;
    outputTokens: number;
  };
}

export default function CostEstimation({ selectedModel, costs }: CostEstimationProps) {
  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold mb-3 text-gray-800">Cost Estimation</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-left font-medium text-gray-500">Model</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Tokens</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Rate (per 1M)</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2 font-medium text-gray-700" rowSpan={2}>
                {selectedModel}
              </td>
              <td className="px-4 py-2 text-gray-600">
                {costs.inputTokens.toLocaleString()} (input)
              </td>
              <td className="px-4 py-2 text-gray-600">
                ${(MODEL_PRICING[selectedModel as keyof typeof MODEL_PRICING].input * 1000000).toFixed(2)}
              </td>
              <td className="px-4 py-2 font-medium text-blue-600">
                {formatCurrency(costs.input)}
              </td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2 text-gray-600">
                ~{costs.outputTokens.toLocaleString()} (output est.)
              </td>
              <td className="px-4 py-2 text-gray-600">
                ${(MODEL_PRICING[selectedModel as keyof typeof MODEL_PRICING].output * 1000000).toFixed(2)}
              </td>
              <td className="px-4 py-2 font-medium text-blue-600">
                {formatCurrency(costs.output)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700" colSpan={3}>
                Total Estimated Cost
              </td>
              <td className="px-4 py-2 font-medium text-blue-600">
                {formatCurrency(costs.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Note: Output tokens are estimated at 20% of input tokens. Actual usage may vary.
      </p>
    </div>
  );
} 