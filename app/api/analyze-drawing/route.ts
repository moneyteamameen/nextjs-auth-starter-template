import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

interface GridSection {
  x: number;
  y: number;
  width: number;
  height: number;
  base64Content: string;
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const model = formData.get('model') as string;
        const fileType = formData.get('fileType') as string;
        const gridSize = parseInt(formData.get('gridSize') as string) || 2; // Default 2x2 grid
        const pageNumber = parseInt(formData.get('pageNumber') as string) || 1; // Default to first page

        let imageBuffer: Buffer;
        
        if (fileType === 'pdf') {
            // Handle PDF file
            const bytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(bytes);
            const pdfPages = pdfDoc.getPages();
            
            // Validate page number
            const pageIndex = pageNumber - 1; // Convert from 1-based to 0-based indexing
            if (pageIndex < 0 || pageIndex >= pdfPages.length) {
                throw new Error(`Invalid page number: ${pageNumber}. PDF has ${pdfPages.length} pages.`);
            }
            
            // Extract the specified page
            const page = pdfPages[pageIndex];
            const pngBytes = await page.exportAsPNG();
            imageBuffer = Buffer.from(pngBytes);
        } else {
            // Handle image file
            const bytes = await file.arrayBuffer();
            imageBuffer = Buffer.from(bytes);
        }

        // Use sharp to get image dimensions
        const imageInfo = await sharp(imageBuffer).metadata();
        const { width, height } = imageInfo;

        if (!width || !height) {
            throw new Error('Could not determine image dimensions');
        }

        // Split image into grid sections
        const sections: GridSection[] = [];
        const sectionWidth = Math.floor(width / gridSize);
        const sectionHeight = Math.floor(height / gridSize);

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                // Extract section from image
                const sectionBuffer = await sharp(imageBuffer)
                    .extract({
                        left: x * sectionWidth,
                        top: y * sectionHeight,
                        width: sectionWidth,
                        height: sectionHeight
                    })
                    .toBuffer();
                
                sections.push({
                    x,
                    y,
                    width: sectionWidth,
                    height: sectionHeight,
                    base64Content: sectionBuffer.toString('base64')
                });
            }
        }

        // Process each grid section with the LLM
        const analysisTasks = sections.map((section, index) => 
            analyzeSection(section, index, model, gridSize * gridSize)
        );
        
        const sectionResults = await Promise.all(analysisTasks);
        
        // Combine results
        const combinedResult = {
            gridSize,
            sections: sectionResults,
            summary: await summarizeResults(sectionResults, model)
        };

        return NextResponse.json({ result: combinedResult });
    } catch (error) {
        console.error('Error analyzing file:', error);
        return NextResponse.json(
            { error: 'Failed to analyze file' },
            { status: 500 }
        );
    }
}

async function analyzeSection(section: GridSection, index: number, model: string, totalSections: number) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `This is an image from a construction drawing, grid section ${index + 1} of ${totalSections} (row ${section.y + 1}, column ${section.x + 1}). Please analyze this section and provide detailed observations about any construction elements, measurements, annotations, or technical details visible in this section only.`
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${section.base64Content}`
                            }
                        }
                    ]
                }
            ]
        })
    });

    const data = await response.json();
    
    return {
        gridPosition: { x: section.x, y: section.y },
        analysis: data.choices[0].message.content
    };
}

async function summarizeResults(sectionResults: any[], model: string) {
    const sectionsText = sectionResults.map((section, index) => 
        `Section ${index + 1} (Row ${section.gridPosition.y + 1}, Column ${section.gridPosition.x + 1}): ${section.analysis}`
    ).join('\n\n');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'user',
                    content: `I have analyzed a construction drawing by dividing it into sections. Based on the following section analyses, please provide a comprehensive summary of the entire drawing, identifying key elements, measurements, and how different sections relate to each other:\n\n${sectionsText}`
                }
            ]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
} 