import React, { useState } from 'react';
import { Language } from '../types';
import { CopyIcon } from './Icons';

interface LanguageInputProps {
  language: Language;
  text: string;
  setText: (text: string) => void;
  isReadOnly?: boolean;
  isLoading?: boolean;
  placeholder: string;
  onWordClick?: (word: string) => void;
}

const LanguageInput: React.FC<LanguageInputProps> = ({
  language,
  text,
  setText,
  isReadOnly = false,
  isLoading = false,
  placeholder,
  onWordClick,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const renderInteractiveText = () => {
    // Regex to split by spaces and common punctuation, keeping the delimiters
    const parts = text.split(/(\s+|[.,!?"])/g).filter(Boolean);

    return parts.map((part, index) => {
      // Check if the part is a word (not space or punctuation)
      const isWord = !/(\s+|[.,!?"])/g.test(part);

      if (isWord && onWordClick) {
        return (
          <span
            key={index}
            onClick={() => onWordClick(part)}
            className="cursor-pointer hover:bg-cyan-500/20 rounded p-0.5 -m-0.5 transition-colors duration-150"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onWordClick(part)}
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col w-full">
      <label className="mb-2 text-sm font-medium text-slate-400">{language}</label>
      <div className="relative w-full h-48">
        {isReadOnly ? (
          <div 
            className="w-full h-full p-4 text-slate-200 bg-slate-900 border border-slate-700 rounded-lg overflow-y-auto"
            aria-live="polite"
          >
            {text ? (
              <p className="whitespace-pre-wrap">{renderInteractiveText()}</p>
            ) : (
              <span className="text-slate-500">{placeholder}</span>
            )}
          </div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            readOnly={false}
            placeholder={placeholder}
            className="w-full h-full p-4 text-slate-200 bg-slate-900 border border-slate-700 rounded-lg resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
          />
        )}
        
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-lg">
                <div className="w-20 h-20 text-cyan-400">
                    <svg fill="currentColor" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="15">
                            <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                            <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                        </circle>
                        <circle cx="60" cy="15" r="9" fillOpacity="0.3">
                            <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate>
                            <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate>
                        </circle>
                        <circle cx="105" cy="15" r="15">
                            <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                            <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                        </circle>
                    </svg>
                </div>
            </div>
        )}
        
        {text && isReadOnly && !isLoading && (
          <button
            onClick={handleCopy}
            className="absolute bottom-3 right-3 p-2 bg-slate-700 hover:bg-cyan-600 rounded-md transition-all duration-200 text-slate-300 hover:text-white"
            title="Copy to clipboard"
          >
            {copied ? (
              <span className="text-xs px-1">Copied!</span>
            ) : (
              <CopyIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default LanguageInput;
