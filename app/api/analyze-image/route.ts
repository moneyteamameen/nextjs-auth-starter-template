import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please add it to your .env.local file." },
        { status: 500 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const question = formData.get('question') as string;
    
    // Validate request
    if (!imageFile || !question) {
      return NextResponse.json(
        { error: "Missing image or question" },
        { status: 400 }
      );
    }
    
    // Convert the image file to a base64 string
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const dataURI = `data:${imageFile.type};base64,${imageBase64}`;
    
    // Call the OpenAI API with the image
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes images from PDF documents. Format your response using Markdown."
        },
        {
          role: "user",
          content: [
            { type: "text", text: question },
            { type: "image_url", image_url: { url: dataURI } }
          ]
        }
      ],
      max_tokens: 1000,
    });
    
    // Extract the result from the OpenAI response
    const result = response.choices[0].message.content || "";
    
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    
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
      { error: `Failed to analyze image: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
} 