import React, { useState } from 'react';
import { SessionData, GenerationStatus } from './types';
import { FormSection } from './FormSection';
import { PreviewSection } from './PreviewSection';
import { generateSessionNotes } from './geminiService';
import { DEFAULT_LOGO } from './constants';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<SessionData>({
    transcript: '',
    resources: '',
    images: '',
    logo: DEFAULT_LOGO,
    meta: {
      title: '',
      brand: ''
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
      const html = await generateSessionNotes(data);
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
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
              Session Notes Generator
            </h1>
          </div>
          <div className="text-xs font-medium text-slate-500 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
            Powered by Gemini 2.0 Flash
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto p-4 md:p-6 h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Column: Input */}
          <div className="h-full overflow-hidden">
            <FormSection 
              data={data} 
              setData={setData} 
              isLoading={status.isLoading} 
              onSubmit={handleGenerate} 
            />
          </div>

          {/* Right Column: Output */}
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

export default App;
