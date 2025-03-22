import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Forward the request to the FastAPI backend
    const response = await fetch("http://127.0.0.1:8000/convert", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error converting file:", error);
    return NextResponse.json(
      { error: "Failed to convert file" },
      { status: 500 }
    );
  }
} 