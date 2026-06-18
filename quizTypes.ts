import React, { useState, useMemo } from 'react';
import { QuestionArray, Question } from './quizTypes';
import { Code, Eye, Copy, Check, Download, Pencil, Trash2, AlertTriangle, CheckCircle2, Tag, ListChecks } from 'lucide-react';

interface ResultsDisplayProps {
  questions: QuestionArray | null;
  setQuestions: React.Dispatch<React.SetStateAction<QuestionArray | null>>;
}

const FORBIDDEN_PHRASES = [
  'according to', 'as per', 'based on',
  'from the transcript', 'from the material', 'from the pdf',
  'in the transcript', 'in the material', 'in the pdf',
  'in this session', 'in today’s class', 'in the reading',
  'pre-read', 'post-read'
];

const validateQuestion = (q: Question): string[] => {
  const issues: string[] = [];
  const content = (q.questions + " " + Object.values(q.options).join(" ")).toLowerCase();

  FORBIDDEN_PHRASES.forEach(phrase => {
    if (content.includes(phrase)) {
      issues.push(`Contains prohibited phrase: "${phrase}"`);
    }
  });

  if (q.queType === 'SINGLE_CORRECT') {
    const correctCount = Object.values(q.correctAnswer).filter(Boolean).length;
    if (correctCount !== 1) {
      issues.push(`SINGLE_CORRECT must have exactly 1 correct answer (found ${correctCount})`);
    }
  } else if (q.queType === 'MULTIPLE_CORRECT') {
    const correctCount = Object.values(q.correctAnswer).filter(Boolean).length;
    if (correctCount < 1) {
      issues.push(`MULTIPLE_CORRECT must have at least 1 correct answer`);
    }
  }

  return issues;
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ questions, setQuestions }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');
  const [copied, setCopied] = useState(false);

  const validationIssues = useMemo(() => {
    if (!questions) return new Map<string, string[]>();
    const map = new Map<string, string[]>();
    questions.forEach((q) => {
      if (!q.id) return;
      const issues = validateQuestion(q);
      if (issues.length > 0) {
        map.set(q.id, issues);
      }
    });
    return map;
  }, [questions]);

  const handleDelete = (id: string) => {
    setQuestions(prev => prev ? prev.filter(q => q.id !== id) : null);
  };

  const handleUpdateQuestion = (id: string, updatedQuestion: Question) => {
    setQuestions(prev => prev ? prev.map(q => q.id === id ? updatedQuestion : q) : null);
  };

  const getCleanJson = () => {
    if (!questions) return '';
    const cleanQuestions = questions.map(({ id, ...rest }) => rest);
    return JSON.stringify(cleanQuestions, null, 2);
  };

  const handleCopy = () => {
    if (!questions) return;
    navigator.clipboard.writeText(getCleanJson());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!questions) return;
    const blob = new Blob([getCleanJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalQuestions = questions ? questions.length : 0;
  const hasValidationErrors = validationIssues.size > 0;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-3 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-slate-200">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5
                ${activeTab === 'preview' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5
                ${activeTab === 'json' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Code className="w-4 h-4" /> JSON
            </button>
          </div>
          {hasValidationErrors && (
            <span className="text-xs font-semibold text-amber-700 flex items-center bg-amber-50 px-2 py-1 rounded border border-amber-200">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {validationIssues.size} to review
            </span>
          )}
        </div>

        {questions && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        {!questions ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <ListChecks className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500">Your quiz will appear here</p>
            <p className="text-xs mt-1">Add a transcript and tag, then generate.</p>
          </div>
        ) : activeTab === 'json' ? (
          <div className="bg-slate-900 text-green-300 p-4 rounded-lg border border-slate-700 font-mono text-sm overflow-x-auto h-full">
            <pre>{getCleanJson()}</pre>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-slate-500 text-sm">Showing {totalQuestions} questions</div>
            {questions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                issues={validationIssues.get(q.id!)}
                onDelete={() => handleDelete(q.id!)}
                onSave={(updatedQ) => handleUpdateQuestion(q.id!, updatedQ)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const QuestionCard: React.FC<{
  question: Question;
  index: number;
  issues?: string[];
  onDelete: () => void;
  onSave: (q: Question) => void;
}> = ({ question, index, issues, onDelete, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Question>(question);

  const handleSave = () => {
    onSave(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(question);
    setIsEditing(false);
  };

  const handleCorrectOptionChange = (opt: string) => {
    if (editData.queType === 'SINGLE_CORRECT') {
      setEditData({
        ...editData,
        correctAnswer: { A: opt === 'A', B: opt === 'B', C: opt === 'C', D: opt === 'D' }
      });
    } else {
      setEditData({
        ...editData,
        correctAnswer: { ...editData.correctAnswer, [opt]: !editData.correctAnswer[opt] }
      });
    }
  };

  const handleTypeChange = (newType: "SINGLE_CORRECT" | "MULTIPLE_CORRECT") => {
    let newCorrect = { ...editData.correctAnswer };
    if (newType === 'SINGLE_CORRECT') {
      const firstTrue = Object.keys(newCorrect).find(k => newCorrect[k]);
      newCorrect = { A: false, B: false, C: false, D: false };
      newCorrect[firstTrue || 'A'] = true;
    }
    setEditData({ ...editData, queType: newType, correctAnswer: newCorrect });
  };

  if (isEditing) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-sm border border-indigo-300">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-slate-500">Editing Q{index + 1}</span>
          <select
            value={editData.queType}
            onChange={(e) => handleTypeChange(e.target.value as "SINGLE_CORRECT" | "MULTIPLE_CORRECT")}
            className="bg-white text-slate-700 text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="SINGLE_CORRECT">SINGLE CORRECT</option>
            <option value="MULTIPLE_CORRECT">MULTIPLE CORRECT</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Question Text</label>
          <textarea
            value={editData.questions}
            onChange={(e) => setEditData({ ...editData, questions: e.target.value })}
            className="w-full bg-white text-slate-900 border border-slate-300 p-2 rounded text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 mb-4">
          <label className="block text-xs font-semibold text-slate-500">
            Options ({editData.queType === 'SINGLE_CORRECT' ? 'Select 1 correct' : 'Select all correct'})
          </label>
          {['A', 'B', 'C', 'D'].map((opt) => (
            <div key={opt} className="flex items-center gap-2">
              <input
                type={editData.queType === 'SINGLE_CORRECT' ? "radio" : "checkbox"}
                name={`correct-${question.id}`}
                checked={!!editData.correctAnswer[opt]}
                onChange={() => handleCorrectOptionChange(opt)}
                className="accent-green-600 w-4 h-4"
              />
              <span className="bg-slate-100 text-slate-700 w-6 h-6 flex items-center justify-center rounded text-xs font-semibold">{opt}</span>
              <input
                type="text"
                value={editData.options[opt as keyof typeof editData.options]}
                onChange={(e) => setEditData({ ...editData, options: { ...editData.options, [opt]: e.target.value } })}
                className="flex-1 bg-white text-slate-900 border border-slate-300 p-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={handleCancel} className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded">Cancel</button>
          <button onClick={handleSave} className="px-3 py-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded">Save</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-5 rounded-lg shadow-sm border ${issues ? 'border-amber-300' : 'border-slate-200'} relative group`}>
      <div className="absolute top-4 right-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
        <button onClick={() => setIsEditing(true)} className="p-1 text-slate-400 hover:text-indigo-600" title="Edit">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={onDelete} className="p-1 text-slate-400 hover:text-red-600" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {issues && issues.length > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-md p-3">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Content warning:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                {issues.map((issue, i) => <li key={i}>{issue}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-3 pr-16">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
          Q{index + 1}
        </span>
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{question.queType.replace('_', ' ')}</span>
      </div>

      <h3 className="text-slate-900 font-medium text-base mb-4">{question.questions}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {(Object.keys(question.options) as Array<keyof typeof question.options>).map((key) => {
          const isCorrect = question.correctAnswer[key];
          return (
            <div
              key={key}
              className={`p-3 rounded-md border text-sm flex items-center ${
                isCorrect ? 'bg-green-50 border-green-300 text-green-800' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                isCorrect ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {key}
              </span>
              {question.options[key]}
              {isCorrect && <CheckCircle2 className="w-5 h-5 ml-auto text-green-600" />}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
        {question.tags.map((tag, i) => (
          <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <Tag className="w-3 h-3 mr-1 opacity-60" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;
