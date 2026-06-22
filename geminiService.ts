import React, { useState, useRef } from 'react';
import { SessionData, SessionMeta, ImageSize, TranscriptMeta } from '../types';
import { FileText, Link, Image as ImageIcon, Info, Wand2, Loader2, Upload, X, Briefcase, Plus, Check, Copy } from 'lucide-react';
import { generateImage } from '../services/geminiService';
import { parseTranscriptFile } from '../utils/fileParsing';

interface FormSectionProps {
  data: SessionData;
  setData: React.Dispatch<React.SetStateAction<SessionData>>;
  apiKey: string;
  transcript: string;
  setTranscript: (val: string) => void;
  transcriptMeta: TranscriptMeta | null;
  setTranscriptMeta: (meta: TranscriptMeta | null) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export const FormSection: React.FC<FormSectionProps> = ({ data, setData, apiKey, transcript, setTranscript, transcriptMeta, setTranscriptMeta, isLoading, onSubmit }) => {
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isParsingTranscript, setIsParsingTranscript] = useState(false);
  const transcriptFileRef = useRef<HTMLInputElement>(null);

  const handleTranscriptUploadClick = () => transcriptFileRef.current?.click();

  const handleTranscriptFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsingTranscript(true);
    try {
      const text = await parseTranscriptFile(file);
      setTranscript(text);
      setTranscriptMeta({ name: file.name, size: file.size });
    } catch (err: any) {
      alert(err.message || "Failed to read transcript file.");
    } finally {
      setIsParsingTranscript(false);
      if (transcriptFileRef.current) transcriptFileRef.current.value = '';
    }
  };

  const handleMetaChange = (key: keyof SessionMeta, value: string) => {
    setData(prev => ({ ...prev, meta: { ...prev.meta, [key]: value } }));
  };

  const handleTextChange = (key: keyof SessionData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size check (approx 1MB limit for smooth processing)
      if (file.size > 1024 * 1024) {
        alert("File too large. Please upload a logo smaller than 1MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setData(prev => ({ ...prev, logo: '' }));
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setImageError(null);
    setGeneratedImage(null);
    
    try {
      const base64 = await generateImage(imagePrompt, imageSize, apiKey);
      setGeneratedImage(base64);
    } catch (err: any) {
      setImageError(err.message || "Failed to generate image.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopyImage = async () => {
    if (generatedImage) {
      try {
        await navigator.clipboard.writeText(generatedImage);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }
  };

  const handleAddImageToNotes = () => {
      if (generatedImage) {
          const currentImages = data.images ? data.images + '\n' : '';
          handleTextChange('images', currentImages + generatedImage);
      }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-slate-800">Session Input</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Meta Section */}
        <div className="space-y-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
          <div className="flex items-center gap-2 mb-2 text-indigo-900 font-medium text-sm">
            <Info className="w-4 h-4" />
            <span>Session Metadata</span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Session Title</label>
            <input
              type="text"
              placeholder="e.g. AI Tools Day 1"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              value={data.meta.title}
              onChange={(e) => handleMetaChange('title', e.target.value)}
            />
          </div>
        </div>

        {/* Branding/Logo Section */}
        <div className="space-y-3 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
           <div className="flex items-center gap-2 mb-1 text-slate-800 font-medium text-sm">
            <Briefcase className="w-4 h-4 text-slate-500" />
            <span>Custom Branding</span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Company Logo (Optional)</label>
            {!data.logo ? (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 transition-colors hover:border-indigo-300 hover:bg-slate-50">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <label className="cursor-pointer flex flex-col items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                      <div className="p-2 bg-indigo-50 rounded-full text-indigo-600">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-medium">Click to Upload Logo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLogoUpload} 
                        className="hidden" 
                      />
                    </label>
                    <span className="text-xs text-slate-400">Recommended: PNG/JPG (Max 1MB)</span>
                  </div>
                </div>
            ) : (
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="relative group bg-white p-2 rounded border border-slate-200">
                  <img src={data.logo} alt="Logo Preview" className="h-12 w-auto object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Logo Uploaded</p>
                  <button 
                    onClick={clearLogo}
                    className="text-xs text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 mt-1"
                  >
                    <X className="w-3 h-3" />
                    Remove logo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transcript Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText className="w-4 h-4" />
              Content (Transcript or Notes)
            </label>
            <button
              onClick={handleTranscriptUploadClick}
              disabled={isParsingTranscript || isLoading}
              className="flex items-center gap-1 px-2 py-1 text-xs border border-slate-300 bg-white rounded hover:bg-slate-50 transition-colors text-slate-600"
            >
              <Upload className="w-3 h-3" /> Upload .vtt / .txt
            </button>
          </div>
          <input type="file" ref={transcriptFileRef} onChange={handleTranscriptFileChange} accept=".vtt,.txt" className="hidden" />
          {transcriptMeta && (
            <div className="mb-2 bg-indigo-50 border border-indigo-100 p-2 rounded flex items-center justify-between">
              <span className="text-xs text-indigo-800 truncate">
                {transcriptMeta.name} ({(transcriptMeta.size / 1024).toFixed(1)} KB)
              </span>
              <button onClick={() => setTranscriptMeta(null)} className="text-slate-400 hover:text-red-500" title="Detach file label">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <textarea
            className="w-full h-64 p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono leading-relaxed resize-none"
            placeholder={isParsingTranscript ? "Reading file..." : "Paste raw transcript, rough notes, or upload a .vtt / .txt file..."}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        </div>

        {/* Resources Section */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Link className="w-4 h-4" />
            Resources (One per line: Label - URL)
          </label>
          <textarea
            className="w-full h-32 p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono resize-none"
            placeholder="Notion Doc - https://example.com/doc&#10;Github Repo - https://github.com/..."
            value={data.resources}
            onChange={(e) => handleTextChange('resources', e.target.value)}
          />
        </div>

        {/* AI Image Generator Tool */}
        <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-indigo-100 shadow-sm">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-indigo-900 font-medium text-sm">
                <Wand2 className="w-4 h-4 text-purple-600" />
                <span>AI Image Generator</span>
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">New</span>
           </div>
           
           <div className="space-y-3">
             <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Image Prompt</label>
                <textarea
                  className="w-full h-20 p-3 bg-white border border-indigo-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm resize-none"
                  placeholder="Describe the image you want (e.g., 'A futuristic robot analyzing data on a holographic screen')"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                />
             </div>
             
             <div className="flex items-end gap-3">
               <div className="flex-1">
                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Size</label>
                 <select 
                   className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                   value={imageSize}
                   onChange={(e) => setImageSize(e.target.value as ImageSize)}
                 >
                   <option value="1K">1K (Standard)</option>
                   <option value="2K">2K (High Res)</option>
                   <option value="4K">4K (Ultra Res)</option>
                 </select>
               </div>
               <button
                 onClick={handleGenerateImage}
                 disabled={isGeneratingImage || !imagePrompt.trim()}
                 className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors h-[38px]
                   ${isGeneratingImage || !imagePrompt.trim()
                     ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                     : 'bg-purple-600 text-white hover:bg-purple-700'}`}
               >
                 {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                 {isGeneratingImage ? 'Generating...' : 'Generate'}
               </button>
             </div>
           </div>

           {imageError && (
             <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-100">
               Error: {imageError}
             </div>
           )}

           {generatedImage && (
             <div className="mt-4 space-y-3">
               <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-800 shadow-md">
                 <img src={generatedImage} alt="Generated" className="w-full h-auto object-contain max-h-64" />
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={handleCopyImage}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {copySuccess ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copySuccess ? 'Copied!' : 'Copy Base64'}
                  </button>
                  <button 
                    onClick={handleAddImageToNotes}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Notes
                  </button>
               </div>
               <p className="text-xs text-slate-500 text-center">
                 Tip: Click "Add to Notes" to automatically append this image to your list below.
               </p>
             </div>
           )}
        </div>

        {/* Images Section */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <ImageIcon className="w-4 h-4" />
            Image URLs (Optional - Leave empty for Auto-Prompts)
          </label>
          <textarea
            className="w-full h-32 p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono resize-none"
            placeholder="Paste direct URLs (e.g., https://site.com/img.png). &#10;Leave EMPTY to let AI generate image prompts for backend processing."
            value={data.images}
            onChange={(e) => handleTextChange('images', e.target.value)}
          />
        </div>

      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <button
          onClick={onSubmit}
          disabled={isLoading || !transcript}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-md transition-all
            ${isLoading || !transcript 
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:transform active:scale-[0.98]'}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Notes...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate HTML Notes
            </>
          )}
        </button>
      </div>
    </div>
  );
};
