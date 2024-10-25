import React from "react";
import { AnalizeDispatch, FileCSV } from "../../types/AppTypes";
import { analyzeEmotion, analyzeSentiment } from "../../models";


const useModel = (
  data: FileCSV[], 
  modelName: string,
  setAnalyzeData: AnalizeDispatch,
  setErrMsg: React.Dispatch<React.SetStateAction<string>>,
  setIsErr: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoad: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [textBatch, setTextBatch] = React.useState<FileCSV[]>([]);
  
  // Generar lotes de 100 textos y actualizarlos progresivamente
  React.useEffect(() => {
    const batches: FileCSV[] = [];
    for (let i = 0; i < data.length; i += 5) {
      batches.push(...data.slice(i, i + 5));
    }
    setTextBatch(batches);
  }, [data]);

  // Procesar cada lote con un modelo, aplicando throttling
  React.useEffect(() => {
    const analyzeDataForBatch = async () => {
      // Recorre cada lote de textos (cada elemento de textBatch es un array de FileCSV[])
      try {
        setIsLoad(true);
        for (let i=0; i <= textBatch.length; i++) {
          // Ahora recorremos cada objeto FileCSV dentro del lote
          if(modelName == 'emotion'){
            const res = await analyzeEmotion(textBatch[i].text); // Usa el modelo para analizar cada texto

            const analyzeData = {
              ...textBatch[i], // Mantén los datos originales de cada objeto FileCSV
              emotion: res    // Agrega el resultado del análisis
            };
            setAnalyzeData((prevData) => [...prevData, analyzeData]); // Actualiza el estado con los nuevos resultados
  
          } else if(modelName == 'sentiment'){
            const res = await analyzeSentiment(textBatch[i].text); // Usa el modelo para analizar cada texto
            const analyzeData = {
              ...textBatch[i], // Mantén los datos originales de cada objeto FileCSV
              sentiment: res  // Agrega el resultado del análisis
            };
            setAnalyzeData((prevData) => [...prevData, analyzeData]); // Actualiza el estado con los nuevos resultados
          } 
        }
      } catch (err) {
        console.error("Error in data analysis:", err);
        setErrMsg((err as Error).message);
        setIsErr(true); 
      } finally {
        setIsLoad(false);
      }
    };
  
    if (textBatch.length > 0) { 
      analyzeDataForBatch();
    }
  }, [textBatch, setAnalyzeData]);
};

export default useModel;
