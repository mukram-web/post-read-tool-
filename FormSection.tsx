import React, { useRef, useState } from 'react';
import { parseTranscriptFile } from '../../utils/fileParsing';
import { TranscriptMeta } from './quizTypes';
import { Tag, FileText, Upload, X, Wand2, Loader2 } from 'lucide-react';

interface QuizConfigProps {
  transcript: string;
  setTranscript: (val: string) => void;
  transcriptMeta: TranscriptMeta | null;
  setTranscriptMeta: (meta: TranscriptMeta | null) => void;
  tagName: string;
  setTagName: (val: string) => void;
  questionCount: number;
  setQuestionCount: (val: number) => void;
  onGenerate: () => void;
  hasOutput: boolean;
  isLoading: boolean;
}

const QuizConfig: React.FC<QuizConfigProps> = ({
  transcript,
  setTranscript,
  transcriptMeta,
  setTranscriptMeta,
  tagName,
  setTagName,
  questionCount,
  setQuestionCount,
  onGenerate,
  hasOutput,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    try {
      const text = await parseTranscriptFile(file);
      setTranscript(text);
      setTranscriptMeta({ name: file.name, size: file.size });
    } catch (err: any) {
      alert(err.message || "Failed to read transcript file.");
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = () => {
    setTranscriptMeta(null);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
        <Tag className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-slate-800">Quiz Setup</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Tag + Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Quiz Tag Name (Required)</label>
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g. AI_Tools_Day_1"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Question Count ({questionCount})</label>
            <input
              type="range"
              min="10"
              max="40"
              step="1"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>10</span><span>25</span><span>40</span>
            </div>
          </div>
        </div>

        {/* Transcript (shared) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText className="w-4 h-4" /> Transcript (shared with Session Notes)
            </label>
            <button
              onClick={handleUploadClick}
              disabled={isParsing || isLoading}
              className="flex items-center gap-1 px-2 py-1 text-xs border border-slate-300 bg-white rounded hover:bg-slate-50 transition-colors text-slate-600"
            >
              <Upload className="w-3 h-3" /> Upload .vtt / .txt
            </button>
          </div>

          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".vtt,.txt" className="hidden" />

          {transcriptMeta && (
            <div className="mb-2 bg-indigo-50 border border-indigo-100 p-2 rounded flex items-center justify-between">
              <span className="text-xs text-indigo-800 truncate">
                {transcriptMeta.name} ({(transcriptMeta.size / 1024).toFixed(1)} KB)
              </span>
              <button onClick={handleRemoveFile} className="text-slate-400 hover:text-red-500" title="Detach file label">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="relative">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={isParsing ? "Reading file..." : "Paste the session transcript here, or upload a .vtt / .txt file..."}
              disabled={isParsing || isLoading}
              className="w-full h-64 p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono leading-relaxed resize-none"
            />
            <div className="absolute bottom-2 right-2 text-xs text-slate-400 bg-white/80 px-1 rounded pointer-events-none">
              {transcript.length.toLocaleString()} chars
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <button
          onClick={onGenerate}
          disabled={isLoading || isParsing || !transcript.trim() || !tagName.trim()}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-md transition-all
            ${isLoading || isParsing || !transcript.trim() || !tagName.trim()
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]'}`}
        >
          {isLoading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Generating Quiz...</>
          ) : (
            <><Wand2 className="w-5 h-5" /> {hasOutput ? 'Regenerate Quiz' : 'Generate Quiz'}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizConfig;
