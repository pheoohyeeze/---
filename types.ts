export type Language = 'Chinese' | 'Lao';

export const LANGUAGE_MAP: Record<Language, string> = {
  'Chinese': 'zh-CN',
  'Lao': 'lo',
};

export interface WordExplanation {
  partOfSpeech: string;
  usage: string;
  exampleSentence: string;
  exampleTranslation: string;
}
