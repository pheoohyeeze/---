import { GoogleGenAI, Type } from "@google/genai";
import { Language, WordExplanation } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function translateText(
  text: string,
  sourceLang: Language,
  targetLang: Language
): Promise<string> {
  if (!text.trim()) {
    return '';
  }

  try {
    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. 
    Provide only the raw translated text. Do not include any explanations, formatting, or introductory phrases.
    
    Text to translate: "${text}"`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error translating text:", error);
    if (error instanceof Error) {
        return `Error: Translation failed. ${error.message}`;
    }
    return "An unknown error occurred during translation.";
  }
}

export async function getWordExplanation(
  word: string,
  sourceText: string,
  translatedText: string,
  sourceLang: Language,
  targetLang: Language
): Promise<WordExplanation> {
  try {
    const prompt = `You are a linguistic assistant helping a ${sourceLang} speaker learn ${targetLang}.
    The user provided a source text and its translation.
    Source Text (${sourceLang}): "${sourceText}"
    Translated Text (${targetLang}): "${translatedText}"

    From the translated text, please analyze the word "${word}".

    Provide a concise explanation for this word.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            partOfSpeech: {
              type: Type.STRING,
              description: `The grammatical part of speech of the word "${word}" (e.g., Noun, Verb, Adjective).`,
            },
            usage: {
              type: Type.STRING,
              description: `A brief explanation of how to use the word "${word}".`,
            },
            exampleSentence: {
              type: Type.STRING,
              description: `A simple example sentence in ${targetLang} using the word "${word}".`,
            },
            exampleTranslation: {
                type: Type.STRING,
                description: `The translation of the example sentence into ${sourceLang}.`,
            },
          },
          required: ["partOfSpeech", "usage", "exampleSentence", "exampleTranslation"],
        },
      },
    });

    const jsonString = response.text.trim();
    const cleanedJsonString = jsonString.replace(/^```json\n?/, '').replace(/```$/, '');
    return JSON.parse(cleanedJsonString);
  } catch (error) {
    console.error("Error getting word explanation:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get explanation for "${word}". ${error.message}`);
    }
    throw new Error(`An unknown error occurred while explaining "${word}".`);
  }
}
