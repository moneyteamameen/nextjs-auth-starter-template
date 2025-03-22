// OpenAI model pricing constants
export const MODEL_PRICING = {
  "gpt-4o": {
    input: 5.00 / 1000000, // $5.00 per 1M tokens
    output: 15.00 / 1000000, // $15.00 per 1M tokens
  },
  "gpt-4o-mini": {
    input: 0.15 / 1000000, // $0.15 per 1M tokens
    output: 0.60 / 1000000, // $0.60 per 1M tokens
  },
  "gpt-3.5-turbo": {
    input: 0.50 / 1000000, // $0.50 per 1M tokens
    output: 1.50 / 1000000, // $1.50 per 1M tokens
  }
};

// Model token limits
export const MODEL_TOKEN_LIMITS = {
  "gpt-4o": 128000,
  "gpt-4o-mini": 128000,
  "gpt-3.5-turbo": 16000
};

// Predefined prompt templates
export const PROMPT_TEMPLATES = [
  {
    name: "Summary",
    prompt: "Summarize the following document in 3-5 paragraphs:\n\n{document}",
    description: "Generate a concise summary of the document"
  },
  {
    name: "Key Points",
    prompt: "Extract the 5-7 most important key points from the following document:\n\n{document}",
    description: "Extract the most important points from the document"
  },
  {
    name: "Question Answering",
    prompt: "Based on the following document, answer this question: {question}\n\n{document}",
    description: "Answer specific questions about the document content"
  },
  {
    name: "Sentiment Analysis",
    prompt: "Analyze the sentiment of the following document. Is it positive, negative, or neutral? Provide examples to support your analysis:\n\n{document}",
    description: "Analyze the emotional tone of the document"
  },
  {
    name: "Custom Analysis",
    prompt: "{customPrompt}\n\n{document}",
    description: "Create your own custom analysis prompt"
  }
];

// Format currency to display with appropriate precision
export const formatCurrency = (amount: number) => {
  if (amount < 0.01) {
    return `$${amount.toFixed(6)}`;
  } else {
    return `$${amount.toFixed(2)}`;
  }
}; 