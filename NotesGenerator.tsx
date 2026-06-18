import React, { useState } from 'react';
import { Download, Code, Eye, Copy, Check } from 'lucide-react';

interface PreviewSectionProps {
  htmlContent: string | null;
  error: string | null;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({ htmlContent, error }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    if (!htmlContent) return;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'session-notes.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!htmlContent) return;
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-red-600">
            <h3 className="text-lg font-bold mb-2">Error Generating Notes</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!htmlContent) {
    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 bg-slate-50/50">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-sm font-medium">Output will appear here</p>
          <p className="text-xs mt-1">Fill in the form and click Generate</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-3 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-slate-200">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5
              ${viewMode === 'preview' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5
              ${viewMode === 'code' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Code className="w-4 h-4" />
            Source
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="Copy HTML to Clipboard"
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download HTML
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-100 overflow-hidden relative">
        {viewMode === 'preview' ? (
          <iframe
            srcDoc={htmlContent}
            title="Preview"
            className="w-full h-full bg-white"
            sandbox="allow-same-origin"
          />
        ) : (
          <textarea
            readOnly
            value={htmlContent}
            className="w-full h-full p-4 font-mono text-sm text-slate-700 bg-slate-50 resize-none focus:outline-none"
          />
        )}
      </div>
    </div>
  );
};
