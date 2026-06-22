import React, { useState } from 'react';
import { KeyRound, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { DEFAULT_LOGO } from '../constants';

interface ApiKeyGateProps {
  onSubmit: (key: string, remember: boolean) => void;
  initialKey?: string;
}

const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onSubmit, initialKey = '' }) => {
  const [key, setKey] = useState(initialKey);
  const [remember, setRemember] = useState(!!initialKey);
  const [show, setShow] = useState(false);

  const handleSubmit = () => {
    if (!key.trim()) return;
    onSubmit(key.trim(), remember);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <img src={DEFAULT_LOGO} alt="Be10X" className="h-10 w-auto object-contain mb-4" />
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
            <KeyRound className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-lg font-bold text-slate-800">Enter your Gemini API key</h1>
          <p className="text-sm text-slate-500 mt-1">
            The key is used only in your browser to generate content. It is never sent to or stored on any server.
          </p>
        </div>

        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">API Key</label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="Paste your Gemini API key"
            className="w-full px-3 py-2.5 pr-10 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            title={show ? 'Hide' : 'Show'}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <label className="flex items-center gap-2 mt-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 accent-indigo-600"
          />
          <span className="text-sm text-slate-600">Remember me on this device</span>
        </label>
        {initialKey && (
          <p className="text-xs text-slate-500 mt-2">
            Your saved key is filled in — just click Continue, or paste a different key.
          </p>
        )}
        {remember && (
          <p className="text-xs text-amber-600 mt-1">
            The key will be saved in this browser so you don't have to re-enter it. Only use this on a device you trust.
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!key.trim()}
          className={`w-full mt-5 py-2.5 rounded-md font-semibold transition-colors ${
            key.trim()
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>

        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 mt-4"
        >
          Get a free Gemini API key <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default ApiKeyGate;
