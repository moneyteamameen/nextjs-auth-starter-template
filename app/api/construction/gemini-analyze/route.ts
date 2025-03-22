import { NextRequest, NextResponse } from "next/server";

// Helper function to extract a balanced JSON object from a string
function extractJsonObject(text: string): string | null {
  const start = text.indexOf('{');
  if (start === -1) return null;
  let braceCount = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') {
      braceCount++;
    } else if (text[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        return text.substring(start, i + 1);
      }
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { content, systemPrompt } = await request.json();
    
    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    // Ensure your API key is available
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error("Gemini API key is not set");
    }

    // Use the streaming endpoint with alt=sse
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${geminiApiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: content }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini streaming API error: ${errorText}`);
    }

    // Create a stream that relays chunks from the Gemini streaming API to the client.
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.error("No stream available");
          return;
        }
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulatedText = "";
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          // Process each line individually.
          const lines = buffer.split("\n");
          // Retain any partial line for the next chunk.
          buffer = lines.pop() || "";
          
          for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            if (line === "[DONE]") continue;
            
            // Remove the SSE "data:" prefix if it exists.
            if (line.startsWith("data:")) {
              line = line.slice(5).trim();
            }
            
            try {
              // Parse the outer JSON structure
              const responseObj = JSON.parse(line);
              
              // Extract the text content from the response
              if (responseObj.candidates && 
                  responseObj.candidates[0]?.content?.parts && 
                  responseObj.candidates[0].content.parts[0]?.text) {
                
                const textContent = responseObj.candidates[0].content.parts[0].text;
                accumulatedText += textContent;
                
                // Try to extract a complete JSON object from the accumulated text
                const jsonStr = extractJsonObject(accumulatedText);
                
                if (jsonStr) {
                  try {
                    // Parse the extracted JSON to validate it
                    const jsonFragment = JSON.parse(jsonStr);
                    
                    // Send the valid JSON to the client
                    controller.enqueue(JSON.stringify(jsonFragment));
                    
                    // Remove the processed JSON from the accumulated text
                    accumulatedText = accumulatedText.substring(
                      accumulatedText.indexOf(jsonStr) + jsonStr.length
                    );
                  } catch (err) {
                    console.error("Error parsing extracted JSON:", err);
                    // Continue accumulating text if we can't parse it yet
                  }
                }
              }
            } catch (err) {
              console.error("Error parsing Gemini response line:", err);
            }
          }
        }
        
        // Try to process any remaining text at the end
        if (accumulatedText) {
          const jsonStr = extractJsonObject(accumulatedText);
          if (jsonStr) {
            try {
              const jsonFragment = JSON.parse(jsonStr);
              controller.enqueue(JSON.stringify(jsonFragment));
            } catch (err) {
              console.error("Error parsing final JSON fragment:", err);
            }
          }
        }
        
        controller.close();
      }
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/event-stream" }
    });
  } catch (error) {
    console.error("Error in Gemini analysis:", error);
    return NextResponse.json(
      { error: `Gemini streaming analysis failed: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 