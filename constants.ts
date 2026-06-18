export const GEMINI_MODEL = 'gemini-2.0-flash';
export const GEMINI_IMAGE_MODEL = 'gemini-3-pro-image-preview';

// This is the prompt provided by the user to be used as the System Instruction
export const SYSTEM_PROMPT = `
You are a highly skilled AI assistant and expert note-taker. You will be given a **full session transcript** (3–4 hours of content) or raw notes.

**Your task is to generate comprehensive HTML session notes** inside a <section id="detailed-notes"> container.

====================================================
INPUT DATA EXPLANATION
====================================================
You will receive input in the following blocks:
1. ---METADATA---: Title and Brand info.
2. ---TRANSCRIPT OR NOTES---: The main content to process.
3. ---RESOURCES---: A raw list of resources.
4. ---IMAGE URLS---: A list of image URLs to embed.

====================================================
INSTRUCTIONS
====================================================

1. **Session Header**:
   - Start the content inside the section with the **Session Title** using an <h1> tag.
   - Display the Brand/Organization (if provided) immediately under the title using <p class="meta">.

2. **"Links to Resources Used in the Session"**:
   - Immediately after the header, create a section titled **Links to Resources Used in the Session**.
   - Extract **all URLs** mentioned in the transcript or provided in the ---RESOURCES--- block.
   - List each as a clickable link in an HTML list (<ul>).

3. **"Detailed and Structured Notes"**:
   - Provide thorough, structured notes covering **every major point, concept, example, and demonstration**.
   - **Include complete explanations** preserving all details and context.
   - **Use clear HTML headings** (<h2> for main sections, <h3> for subsections).
   - **Number each section and subsection** in the heading text (e.g., **1.0 Introduction**, **1.1 Subtopic**, **2.0 Main Topic**). Ensure numbering is hierarchical and consistent.

4. **"Use of Tables for Comparisons and Processes"**:
   - If information is better presented in a table (comparisons, lists of tools, step-by-step processes), **convert it into an HTML table**.
   - Use <table>, <thead>, <tbody>.
   - Ensure tables are neatly formatted and **do not split words** awkwardly.

5. **"Handling Images (CRITICAL)"**:
   - If URLs are provided in the ---IMAGE URLS--- block, you **MUST** embed them as <img> tags.
   - Place them after meaningful headings where they provide context.
   - Syntax: <img class="section-image" src="URL" alt="Description">

6. **"Self-Check Questions and Further Learning"**:
   - Conclude with a section titled **Self-Check Questions and Further Learning**.
   - Provide **at least 6 thoughtful questions** to test understanding.
   - Use a numbered list (<ol>).

7. **"Content Completeness and Fidelity"**:
   - **Preserve all important information**. Do not oversimplify.
   - Include analogies, specific examples, and technical terms.

====================================================
OUTPUT FORMAT RULES
====================================================
- **Output valid HTML ONLY.**
- **Wrap the entire content inside a <section id="detailed-notes">...</section> tag.**
- Do NOT include <html>, <head>, <body>, or <style> tags.
`;

export const BASE_STYLES = `
    /* Premium Typography & Layout */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    body {
      background: #fff;
      color: #1e293b;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      margin: 40px;
      line-height: 1.75;
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Headings */
    h1, h2, h3, h4 {
      color: #0f172a;
      font-weight: 700;
      letter-spacing: -0.025em;
    }

    h1 { 
      font-size: 2.25em; 
      margin-bottom: 0.25em; 
      line-height: 1.2;
    }
    
    .meta {
        color: #64748b;
        font-size: 0.95em;
        margin-bottom: 1.5em;
        padding-bottom: 1.5em;
        border-bottom: 3px solid #0f172a;
    }
    
    h2 { 
      font-size: 1.75em; 
      margin-top: 2em; 
      margin-bottom: 1em; 
      border-bottom: 1px solid #e2e8f0; 
      padding-bottom: 10px;
    }
    
    h3 { font-size: 1.35em; margin-top: 1.5em; margin-bottom: 0.75em; }
    h4 { font-size: 1.1em; margin-top: 1.25em; margin-bottom: 0.5em; font-weight: 600; }

    /* Content */
    p { margin-bottom: 1.25em; color: #334155; }
    li { margin-bottom: 0.5em; color: #334155; }
    ul, ol { margin-bottom: 1.5em; padding-left: 1.5em; }

    strong { color: #0f172a; font-weight: 700; }
    a { color: #2563eb; text-decoration: underline; text-underline-offset: 2px; }
    a:hover { color: #1d4ed8; }

    /* Tables - Enhanced Visuals */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 2em 0;
      border: 1px solid #cbd5e1;
      font-size: 0.95em;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    th {
      background-color: #f1f5f9; /* Distinct header background */
      color: #0f172a;
      font-weight: 600;
      text-align: left;
      padding: 14px 16px;
      border: 1px solid #cbd5e1;
    }

    td {
      padding: 14px 16px;
      border: 1px solid #cbd5e1;
      color: #334155;
      vertical-align: top;
      word-wrap: break-word; 
      overflow-wrap: break-word;
    }

    tr:nth-child(even) {
      background-color: #f8fafc; /* Zebra striping */
    }
    
    tr:hover {
      background-color: #f1f5f9;
    }

    /* Images */
    .section-image {
      display: block;
      margin: 2em auto;
      max-width: 100%;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }
    
    .logo {
      display: block;
      max-height: 80px;
      margin-bottom: 20px;
    }
`;
// Default Be10X logo, pre-filled into the form on load
export const DEFAULT_LOGO = "data:image/png;base64,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";
