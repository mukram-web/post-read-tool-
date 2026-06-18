import React, { useState } from 'react';
import { SessionData, GenerationStatus, TranscriptMeta } from '../types';
import { FormSection } from './FormSection';
import { PreviewSection } from './PreviewSection';
import { generateSessionNotes } from '../services/geminiService';
import { DEFAULT_LOGO } from '../constants';

interface NotesGeneratorProps {
  transcript: string;
  setTranscript: (val: string) => void;
  transcriptMeta: TranscriptMeta | null;
  setTranscriptMeta: (meta: TranscriptMeta | null) => void;
}

const NotesGenerator: React.FC<NotesGeneratorProps> = ({
  transcript,
  setTranscript,
  transcriptMeta,
  setTranscriptMeta,
}) => {
  const [data, setData] = useState<SessionData>({
    transcript: '',
    resources: '',
    images: '',
    logo: DEFAULT_LOGO,
    meta: {
      title: ''
    }
  });

  const [status, setStatus] = useState<GenerationStatus>({
    isLoading: false,
    error: null,
    result: null
  });

  const handleGenerate = async () => {
    setStatus({ isLoading: true, error: null, result: null });
    try {
      const html = await generateSessionNotes({ ...data, transcript });
      setStatus({ isLoading: false, error: null, result: html });
    } catch (err: any) {
      setStatus({
        isLoading: false,
        error: err.message || "Failed to generate notes. Please check your inputs and try again.",
        result: null
      });
    }
  };

  return (
    <div className="bg-slate-100 text-slate-900 font-sans min-h-[calc(100vh-64px)]">
      <main className="max-w-screen-2xl mx-auto p-4 md:p-6 min-h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-112px)]">
          <div className="h-full overflow-hidden">
            <FormSection
              data={data}
              setData={setData}
              transcript={transcript}
              setTranscript={setTranscript}
              transcriptMeta={transcriptMeta}
              setTranscriptMeta={setTranscriptMeta}
              isLoading={status.isLoading}
              onSubmit={handleGenerate}
            />
          </div>
          <div className="h-full overflow-hidden">
            <PreviewSection
              htmlContent={status.result}
              error={status.error}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotesGenerator;
