// Lightweight transcript file parsing for .txt and .vtt files.
// (PDF parsing intentionally removed — the combined tool only ingests transcripts.)

export const parseTranscriptFile = async (file: File): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'vtt':
      return parseVtt(file);
    case 'txt':
      return parseTxt(file);
    default:
      throw new Error(`Unsupported file type: .${extension}. Please upload a .txt or .vtt file.`);
  }
};

const parseTxt = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

// Strips WebVTT headers, timestamps, cue numbers and IDs to leave clean spoken text.
const parseVtt = async (file: File): Promise<string> => {
  const text = await parseTxt(file);

  let cleaned = text
    .replace(/^WEBVTT[\s\S]*?\n\n/g, '')
    .replace(/(\d{2}:)?\d{2}:\d{2}\.\d{3}\s+-->\s+(\d{2}:)?\d{2}:\d{2}\.\d{3}.*/g, '')
    .replace(/^\s*\d+\s*$/gm, '')
    .replace(/^[0-9a-fA-F-]{36}$/gm, '')
    .replace(/^NOTE\s+.*/gm, '');

  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
};
