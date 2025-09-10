import React from 'react';
import { Language, WordExplanation } from '../types';
import { CloseIcon, LoaderIcon } from './Icons';

interface WordExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string | null;
  explanation: WordExplanation | null;
  isLoading: boolean;
  error: string | null;
  targetLang: Language;
}

const WordExplanationModal: React.FC<WordExplanationModalProps> = ({
  isOpen,
  onClose,
  word,
  explanation,
  isLoading,
  error,
  targetLang,
}) => {
  if (!isOpen) return null;

  const labels = targetLang === 'Lao' ? {
    title: 'ລາຍລະອຽດຄຳ:',
    partOfSpeech: 'ປະເພດຂອງຄຳ',
    usage: 'ການນໍາໃຊ້',
    example: 'ຕົວຢ່າງ',
    loading: 'ກຳລັງວິເຄາະຄຳ...',
    errorTitle: 'ບໍ່ສາມາດໂຫຼດຄຳອະທິບາຍໄດ້',
  } : {
    title: '单词详情：',
    partOfSpeech: '词性',
    usage: '用法',
    example: '示例',
    loading: '正在分析单词...',
    errorTitle: '无法加载解释',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-500/20 w-full max-w-md p-6 sm:p-8 relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ animationFillMode: 'forwards' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-700/50 hover:bg-cyan-600 rounded-full text-slate-400 hover:text-white transition-all duration-200"
          title="Close"
          aria-label="Close"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
          {labels.title} <span className="text-cyan-300">{word}</span>
        </h2>

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-48">
            <LoaderIcon className="w-10 h-10 text-cyan-400" />
            <p className="mt-4 text-slate-400">{labels.loading}</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center text-red-400 bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
            <p className="font-semibold">{labels.errorTitle}</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {explanation && !isLoading && !error && (
          <div className="space-y-5 text-slate-300">
            <div>
              <h3 className="font-semibold text-slate-400 text-sm uppercase tracking-wider">{labels.partOfSpeech}</h3>
              <p className="text-lg">{explanation.partOfSpeech}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-400 text-sm uppercase tracking-wider">{labels.usage}</h3>
              <p>{explanation.usage}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-400 text-sm uppercase tracking-wider">{labels.example}</h3>
              <p className="text-lg">{explanation.exampleSentence}</p>
              <p className="text-slate-400 italic mt-1">"{explanation.exampleTranslation}"</p>
            </div>
          </div>
        )}
      </div>
       <style>{`
        @keyframes fade-in-scale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default WordExplanationModal;