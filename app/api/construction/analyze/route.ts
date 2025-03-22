import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create form data for FastAPI
    const apiFormData = new FormData();
    apiFormData.append("file", file);

    // Forward to your existing FastAPI endpoint for document conversion
    const fastApiResponse = await fetch("http://localhost:8000/convert", {
      method: "POST",
      body: apiFormData,
    });

    if (!fastApiResponse.ok) {
      const errorText = await fastApiResponse.text();
      throw new Error(`FastAPI error: ${errorText}`);
    }

    // Get the JSON response from FastAPI
    const data = await fastApiResponse.json();
    
    // Return the markdown content as a streaming response
    return new Response(data.markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8"
      }
    });
  } catch (error) {
    console.error("Error in construction analysis:", error);
    return NextResponse.json(
      { error: `Analysis failed: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 