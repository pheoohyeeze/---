import React, { useState, useCallback } from 'react';
import { Language, WordExplanation } from './types';
import { translateText, getWordExplanation } from './services/geminiService';
import LanguageInput from './components/LanguageInput';
import WordExplanationModal from './components/WordExplanationModal';
import { SwapIcon, LoaderIcon } from './components/Icons';

function App() {
  const [sourceLang, setSourceLang] = useState<Language>('Chinese');
  const [targetLang, setTargetLang] = useState<Language>('Lao');
  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordExplanation, setWordExplanation] = useState<WordExplanation | null>(null);
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  const handleSwapLanguages = useCallback(() => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
    setError(null);
  }, [sourceLang, targetLang, sourceText, translatedText]);

  const handleTranslate = async () => {
    if (!sourceText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    try {
        const result = await translateText(sourceText, sourceLang, targetLang);
        if (result.startsWith('Error:')) {
            setError(result);
            setTranslatedText('');
        } else {
            setTranslatedText(result);
        }
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(`Error: ${errorMessage}`);
        setTranslatedText('');
    } finally {
        setIsLoading(false);
    }
  };

  const handleWordClick = async (word: string) => {
    if(!word) return;

    setSelectedWord(word);
    setIsModalOpen(true);
    setIsExplanationLoading(true);
    setExplanationError(null);
    setWordExplanation(null);

    try {
        const explanation = await getWordExplanation(word, sourceText, translatedText, sourceLang, targetLang);
        setWordExplanation(explanation);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setExplanationError(errorMessage);
    } finally {
        setIsExplanationLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        setSelectedWord(null);
        setWordExplanation(null);
        setExplanationError(null);
    }, 300);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
        <main className="w-full max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 sm:p-8">
            <header className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                Chinese-Lao Translator
              </h1>
              <p className="text-slate-400 mt-2">
                Powered by Gemini. Click on a translated word for details.
              </p>
            </header>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2">
              <LanguageInput
                language={sourceLang}
                text={sourceText}
                setText={setSourceText}
                placeholder={`Enter ${sourceLang} text...`}
              />

              <button
                onClick={handleSwapLanguages}
                className="p-3 my-2 md:my-0 bg-slate-700 hover:bg-cyan-600 rounded-full text-slate-300 hover:text-white transition-all duration-200 transform hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
                title="Swap languages"
              >
                <SwapIcon className="w-5 h-5" />
              </button>

              <LanguageInput
                language={targetLang}
                text={translatedText}
                setText={setTranslatedText}
                isReadOnly
                isLoading={isLoading}
                placeholder="Translation will appear here..."
                onWordClick={handleWordClick}
              />
            </div>

            {error && (
              <div className="mt-4 text-center text-red-400 bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleTranslate}
                disabled={isLoading || !sourceText.trim()}
                className="flex items-center justify-center w-full md:w-auto px-12 py-3 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="w-6 h-6 mr-3" />
                    Translating...
                  </>
                ) : (
                  'Translate'
                )}
              </button>
            </div>
          </div>
          <footer className="text-center mt-6 text-slate-500 text-sm">
              <p>Built by a world-class senior frontend React engineer.</p>
          </footer>
        </main>
      </div>
      <WordExplanationModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          word={selectedWord}
          explanation={wordExplanation}
          isLoading={isExplanationLoading}
          error={explanationError}
          targetLang={targetLang}
      />
    </>
  );
}

export default App;