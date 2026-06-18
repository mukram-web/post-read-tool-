import React, { useState } from 'react';
import QuizConfig from './QuizConfig';
import ResultsDisplay from './ResultsDisplay';
import { generateQuestions } from './quizService';
import { QuestionArray, TranscriptMeta } from './quizTypes';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

interface QuizGeneratorProps {
  transcript: string;
  setTranscript: (val: string) => void;
  transcriptMeta: TranscriptMeta | null;
  setTranscriptMeta: (meta: TranscriptMeta | null) => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  transcript,
  setTranscript,
  transcriptMeta,
  setTranscriptMeta,
}) => {
  const [tagName, setTagName] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [questions, setQuestions] = useState<QuestionArray | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!transcript.trim() || !tagName.trim()) return;

    setIsLoading(true);
    setError(null);
    setQuestions(null);

    try {
      const result = await generateQuestions({ transcript, tagName, questionCount });
      const questionsWithIds = result.map(q => ({ ...q, id: generateId() }));
      setQuestions(questionsWithIds);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while generating the quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 text-slate-900 font-sans min-h-[calc(100vh-64px)]">
      <main className="max-w-screen-2xl mx-auto p-4 md:p-6 min-h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-112px)]">
          <div className="h-full overflow-hidden">
            <QuizConfig
              transcript={transcript}
              setTranscript={setTranscript}
              transcriptMeta={transcriptMeta}
              setTranscriptMeta={setTranscriptMeta}
              tagName={tagName}
              setTagName={setTagName}
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
              onGenerate={handleGenerate}
              hasOutput={!!questions}
              isLoading={isLoading}
            />
          </div>

          <div className="h-full overflow-hidden relative">
            {error && (
              <div className="absolute top-3 left-3 right-3 z-20 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-sm">Generation Error</h3>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="text-xs font-semibold underline">Dismiss</button>
                </div>
              </div>
            )}
            <ResultsDisplay questions={questions} setQuestions={setQuestions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizGenerator;
