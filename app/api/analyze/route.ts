import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// This is a mock implementation for demo purposes
// In a real application, you would use the OpenAI API
export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please add it to your .env.local file." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { model, messages } = body;
    
    // Validate request
    if (!model || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    // Extract the result from the OpenAI response
    const result = response.choices[0].message.content || "";
    
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Error analyzing document:", error);
    
    // Handle specific OpenAI API errors
    if (error.response) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.response.status} - ${error.response.data.error.message}` },
        { status: error.response.status }
      );
    }
    
    // Handle authentication errors
    if (error.message && error.message.includes("authentication")) {
      return NextResponse.json(
        { error: "Invalid OpenAI API key. Please check your API key in the .env.local file." },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to analyze document: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
} 