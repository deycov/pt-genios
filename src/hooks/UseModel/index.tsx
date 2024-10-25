import { AnalizeDispatch, FileCSV } from "../../types/AppTypes";
import { analyzeEmotion, analyzeSentiment } from "../../models";

const useModel = async (
  data: FileCSV[], 
  modelName: 'emotion' | 'sentiment',
  setAnalyzeData: AnalizeDispatch,
  setErrMsg: React.Dispatch<React.SetStateAction<string>>,
  setIsErr: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoad: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  const batches: FileCSV[][] = [];
  for (let i = 0; i < data.length; i += 20) {
    batches.push(data.slice(i, i + 20));
  }

  try {
    setIsLoad(true);
    for (const batch of batches) {
      for (const item of batch) {
        const text = item.text;
        let analyzeData;

        if (modelName === 'emotion') {
          const emotionRes = await analyzeEmotion(text);
          analyzeData = { ...item, emotion: emotionRes };
        } else {
          const sentimentRes = await analyzeSentiment(text);
          analyzeData = { ...item, sentiment: sentimentRes };
        }

        setAnalyzeData((prevData) => [...prevData, analyzeData]);
      }
    }
  } catch (err) {
    const error = err as Error;
    console.error("Error in data analysis:", error.message);
    setErrMsg(error.message);
    setIsErr(true);
  } finally {
    setIsLoad(false);
  }
};

export default useModel;
