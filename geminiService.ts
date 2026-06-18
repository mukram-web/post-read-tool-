import { GoogleGenAI } from "@google/genai";
import { SessionData, ImageSize } from "./types";
import { SYSTEM_PROMPT, GEMINI_MODEL, GEMINI_IMAGE_MODEL, BASE_STYLES } from "./constants";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string, size: ImageSize): Promise<string> => {
  const client = getClient();
  const response = await client.models.generateContent({
    model: GEMINI_IMAGE_MODEL,
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        imageSize: size,
      }
    }
  });

  // Extract image from response
  const candidates = response.candidates;
  if (candidates) {
     for (const candidate of candidates) {
        if (candidate.content && candidate.content.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
     }
  }
  throw new Error("No image generated.");
};

export const generateSessionNotes = async (data: SessionData): Promise<string> => {
  const client = getClient();
  
  // Transform resources format from "Label - URL" to "Label | URL" for the prompt
  const formattedResources = data.resources
    .split('\n')
    .map(line => line.replace(' - ', ' | '))
    .join('\n');

  // Construct the prompt with clear blocks
  const userPrompt = `
---METADATA START---
Title: ${data.meta.title || "Untitled Session"}
Brand/Organization: ${data.meta.brand || "Not specified"}
---METADATA END---

---TRANSCRIPT OR NOTES START---
${data.transcript}
---TRANSCRIPT OR NOTES END---

---RESOURCES START---
${formattedResources || ""}
---RESOURCES END---

---IMAGE URLS START---
${data.images || ""}
---IMAGE URLS END---
`;

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3,
      },
      contents: userPrompt,
    });

    const text = response.text;
    if (!text) throw new Error("No content generated.");
    
    // Clean up markdown code blocks if present
    const cleanNotesHtml = text.replace(/^```html/, '').replace(/^```/, '').replace(/```$/, '');
    
    // Wrap the LLM's HTML body content into the full document structure
    // Note: LLM generates the H1 and Metadata section now based on instructions
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.meta.title || "Session Notes"}</title>
  <style>
    ${BASE_STYLES}
  </style>
</head>
<body>
  <div class="container">
    <header>
      ${data.logo ? `<img class="logo" src="${data.logo}" alt="Company Logo" />` : ''}
    </header>
    <main>
      ${cleanNotesHtml}
    </main>
  </div>
</body>
</html>`;

    return fullHtml;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};