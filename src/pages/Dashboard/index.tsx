import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Load from "../../components/Load";
import Error from "../../components/Error";
import React, { useEffect, useState } from "react";
import { Emotions } from "../../types/AppTypes";

type Emotion = Emotions[];
type EmotionSentimentItem = { label: string; score: number };
  
interface EmotionYSentiment {
  emotion: Emotion[], 
  sentiment: Emotion[] 
}

const Dashboard = (): JSX.Element => {
  const { isLoggedIn } = useAuth();
  const { 
    data,
    analyzeData,
    isErr,
    setIsErr,
    isLoad,
  } = useApp();
  

  const [dataEmotionYSentiment, setDataEmotionYSentiment] = useState<EmotionYSentiment>({
    emotion: [],
    sentiment: []
  });

  // Estados para almacenar los resultados
  const [highestEmotion, setHighestEmotion] = useState<EmotionSentimentItem | null>(null);
  const [highestSentiment, setHighestSentiment] = useState<EmotionSentimentItem | null>(null);
  const [emotionCounts, setEmotionCounts] = useState<Record<string, number>>({});
  const [sentimentCounts, setSentimentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const chargeInfo = () => {
      const emotion: Emotion[] = [];
      const sentiment: Emotion[] = [];
      
      for (const key in analyzeData) {
        if (Object.prototype.hasOwnProperty.call(analyzeData, key)) {
          if (analyzeData[key].emotion) emotion.push(analyzeData[key].emotion);
          else sentiment.push(analyzeData[key].sentiment);
        }
      }
      setDataEmotionYSentiment({ emotion, sentiment });
    };
    chargeInfo();
  }, [analyzeData]);

  useEffect(() => {
    if (!dataEmotionYSentiment) return;
  
    const findHighestScore = (items: EmotionSentimentItem[][]): EmotionSentimentItem | null => {
      let highest: EmotionSentimentItem | null = null;
      items.flat().forEach(item => {
        if (!highest || item.score > highest.score) highest = item;
      });
      return highest;
    };
  
    setHighestEmotion(findHighestScore(dataEmotionYSentiment.emotion));
    setHighestSentiment(findHighestScore(dataEmotionYSentiment.sentiment));
  
    // Nueva función para contar solo el label con el score más alto
    const countOccurrences = (items: EmotionSentimentItem[][]): Record<string, number> => {
      const counts: Record<string, number> = {};
      items.forEach(arr => {
        const maxItem = arr.reduce((prev, current) => (current.score > prev.score ? current : prev));
        counts[maxItem.label] = (counts[maxItem.label] || 0) + 1;
      });
      return counts;
    };
  
    setEmotionCounts(countOccurrences(dataEmotionYSentiment.emotion));
    setSentimentCounts(countOccurrences(dataEmotionYSentiment.sentiment));
  
  }, [dataEmotionYSentiment]);
  

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

  return (
    <>
      {!isLoggedIn && <Navigate to={'/auth'} replace={true} />}

      {isErr && <Error message="Ocurrio un error al obtener uno de los datos, vuelva a intentarlo mas tarde" />}

      <div className="col-span-3 flex flex-col items-center lg:col-span-3 border-spacing-1">
        <h2 className="text-xl font-bold mb-4">Data analyzed</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="border border-violet-400 shadow-md p-4 rounded-lg w-36 text-center">
            <p className="text-lg font-semibold">Data charge</p>
            <p className="text-3xl">{data.length}</p>
          </div>
          <div className="border border-violet-400 shadow-md p-4 rounded-lg w-36 text-center">
            <p className="text-lg font-semibold">Data analyzed</p>
            <p className="text-3xl">{analyzeData.length}</p>
          </div>
        </div>
      </div>

      <div id="sentiments">
        <div className="col-span-3 flex flex-col items-center lg:col-span-3 border-spacing-1 border-red-700">
          <h1> Sentiments </h1>
          <h2 className="text-xl font-bold mb-4">Summary</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(sentimentCounts).map(([label, count]) => (
              <div key={label} className="border border-white shadow-md p-4 rounded-lg w-36 text-center">
                <p className="text-lg font-semibold">{label}</p>
                <p className="text-3xl">{count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 flex flex-col space-y-8 lg:grid lg:grid-cols-3 lg:gap-4 lg:items-start">
          <div className="col-span-1 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Sentiments Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(sentimentCounts).map(([label, count]) => ({ label, score: count }))}
                  dataKey="score"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {Object.keys(sentimentCounts).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="col-span-2 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Sentiments Breakdown</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={Object.entries(sentimentCounts).map(([label, count]) => ({ label, score: count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#82ca9d">
                  {Object.keys(sentimentCounts).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="divider px-5"></div>

      <div id="emotions">
        <div className="col-span-3 flex flex-col items-center lg:col-span-3 border-spacing-1">
          {isLoad ? (
            <Load />
          ) : (
            <>
              <h1> Emotions </h1>
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {Object.entries(emotionCounts).map(([label, count]) => (
                  <div key={label} className="border border-white shadow-md p-4 rounded-lg w-36 text-center">
                    <p className="text-lg font-semibold">{label}</p>
                    <p className="text-3xl">{count}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4 flex flex-col space-y-8 lg:grid lg:grid-cols-3 lg:gap-4 lg:items-start">
          <div className="col-span-1 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Emotions Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(emotionCounts).map(([label, count]) => ({ label, score: count }))}
                  dataKey="score"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {Object.keys(emotionCounts).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="col-span-2 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Emotions Breakdown</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={Object.entries(emotionCounts).map(([label, count]) => ({ label, score: count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#82ca9d">
                  {Object.keys(emotionCounts).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
