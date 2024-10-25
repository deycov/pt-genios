import { HfInference } from '@huggingface/inference';

const hf = new HfInference('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');

export const analyzeEmotion = async (text: string) => {
  try {
    const result = await hf.textClassification({
      model: 'finiteautomata/beto-emotion-analysis',
      inputs: text,
    });
    console.log('Emotion Analysis Result:', result);
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const analyzeSentiment = async (text: string) => {
  try {
    const result = await hf.textClassification({
      model: 'finiteautomata/beto-sentiment-analysis',
      inputs: text,
    });
    console.log('Sentiment Analysis Result:', result);
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};