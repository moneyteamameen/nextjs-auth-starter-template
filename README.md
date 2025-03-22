# Document Analysis with OpenAI

This application allows users to upload documents, convert them to markdown, and analyze them using OpenAI's language models. It provides a user-friendly interface for document analysis with features like:

- Document upload and conversion
- Multiple analysis templates (Summary, Key Points, Question Answering, etc.)
- Support for different OpenAI models (GPT-3.5 Turbo, GPT-4o Mini, GPT-4o)
- Follow-up questions to create a prompt chain
- Cost estimation for API usage

## Features

### Document Management
- Upload documents and convert them to markdown
- Download converted markdown files
- Calculate token counts for OpenAI API usage

### Document Analysis
- Analyze documents using different templates:
  - Summary generation
  - Key points extraction
  - Question answering
  - Sentiment analysis
  - Custom analysis with your own prompts
- Ask follow-up questions to refine the analysis
- View the prompt chain to understand the conversation flow

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with your API keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Environment Setup

This application is designed to work in an Anaconda environment. To set up:

1. Create a new Anaconda environment:
   ```
   conda create -n document-analysis python=3.10
   ```
2. Activate the environment:
   ```
   conda activate document-analysis
   ```
3. Install required Python packages:
   ```
   pip install openai
   ```

## Technologies Used

- Next.js (App Router)
- React
- Clerk for authentication
- OpenAI API for document analysis
- Tailwind CSS for styling

## API Routes

- `/api/convert`: Converts uploaded documents to markdown
- `/api/analyze`: Analyzes documents using OpenAI models

## Token Handling

The application includes smart token handling to manage large documents:
- Automatically truncates documents that exceed model token limits
- Provides token count and cost estimation
- Handles different model token limits appropriately

## License

This project is licensed under the MIT License.
