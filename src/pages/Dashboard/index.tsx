import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"
import { useApp } from "../../contexts/AppContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Load from "../../components/Load";
import Error from "../../components/Error";

const Dashboard = ():JSX.Element => {
  const { isLoggedIn } = useAuth();
  const { 
    data,
    analyzeData,
    isErr,
    setIsErr,
    isLoad,
   } = useApp()
  
  const dataSentiments = [
    { label: "NEG", score: 0.900 },
    { label: "POS", score: 0.070 },
    { label: "NEU", score: 0.004 },
  ];
  const dataEmotions = [
    { label: "joy", score: 0.9796417951583862 },
    { label: "surprise", score: 0.00461892643943429 },
    { label: "fear", score: 0.0018139064777642488 },
    { label: "disgust", score: 0.0014999592676758766 },
    { label: "sadness", score: 0.0004579558444675058 },
    { label: "anger", score: 0.00038118776865303516 },
    { label: "others", score: 0.011586288921535015 },
  ];
  

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];
  
  return(
    <>
      {!isLoggedIn && 
        <Navigate to={'/auth'} replace={true} />
      }

      { isErr && 
        <Error message="Ocurrio un error al obtener uno de los datos, vuelva a intentarlo mas tarde"/> 
      }

      {/* Resumen de Analisis */}
      <div className="col-span-3 flex flex-col items-center lg:col-span-3 border-spacing-1 border-blue-700">
          
          <h2 className="text-xl font-bold mb-4">
            Data analyzed
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="border border-violet-400 border-spacing-1 shadow-md p-4 rounded-lg w-36 text-center">
              <p className="text-lg font-semibold">Data charge</p>
              <p className="text-3xl">{data.length}</p>
            </div>
            <div className="border border-violet-400 border-spacing-1 shadow-md p-4 rounded-lg w-36 text-center">
              <p className="text-lg font-semibold">Data analyzed</p>
              <p className="text-3xl">{analyzeData.length}</p>
            </div>
          </div>
        </div>

      {/* Resumen de datos */}
      <div id="sentiments">
        <div className="col-span-3 flex flex-col items-center lg:col-span-3 border-spacing-1 border-red-700">
          <h1> Sentiments </h1>
          <h2 className="text-xl font-bold mb-4">Summary</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="border border-white border-spacing-1 shadow-md p-4 rounded-lg w-36 text-center">
              <p className="text-lg font-semibold">Messages</p>
              <p className="text-3xl">300</p>
            </div>
            <div className="border border-white border-spacing-1 shadow-md p-4 rounded-lg w-36 text-center">
              <p className="text-lg font-semibold">Positive</p>
              <p className="text-3xl">120</p>
            </div>
            <div className="border border-white border-spacing-1 shadow-md p-4 rounded-lg w-36 text-center">
              <p className="text-lg font-semibold">Neutral</p>
              <p className="text-3xl">100</p>
            </div>
            <div className="border border-white border-spacing-1 shadow-md p-4 rounded-lg w-36 text-center">
              <p className="text-lg font-semibold">Negative</p>
              <p className="text-3xl">80</p>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:items-start">
          {/* Gráficos */}
          <div className="col-span-1 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Emotions Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataSentiments}
                  dataKey="score"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {dataSentiments.map((entry, index) => (
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
              <BarChart data={dataSentiments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#82ca9d">
                  {dataSentiments.map((entry, index) => (
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
          {
            isLoad ?
              <Load />
            :
            <>
              <h1> Emotions </h1>
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="border border-white border-spacing-1 shadow-md p-4 rounded-lg w-36 text-center">
                  <p className="text-lg font-semibold">Joy</p>
                  <p className="text-3xl">300</p>
                </div>
                <div className="border border-white border-spacing-1 shadow-md p-4 rounded-lg w-36 text-center">
                  <p className="text-lg font-semibold">Surprise</p>
                  <p className="text-3xl">120</p>
                </div>
                <div className="border border-white border-spacing-1 shadow-md p-4 rounded-lg w-36 text-center">
                  <p className="text-lg font-semibold">Fear</p>
                  <p className="text-3xl">100</p>
                </div>
                <div className="border border-white border-spacing-1 shadow-md p-4 rounded-lg w-36 text-center">
                  <p className="text-lg font-semibold">Disgust</p>
                  <p className="text-3xl">80</p>
                </div>
                <div className="border border-white border-spacing-1 shadow-md p-4 rounded-lg w-36 text-center">
                  <p className="text-lg font-semibold">Sadness</p>
                  <p className="text-3xl">300</p>
                </div>
                <div className="border border-white border-spacing-1 shadow-md p-4 rounded-lg w-36 text-center">
                  <p className="text-lg font-semibold">Anger</p>
                  <p className="text-3xl">120</p>
                </div>
                <div className="border border-white border-spacing-1 shadow-md p-4 rounded-lg w-36 text-center">
                  <p className="text-lg font-semibold">Others</p>
                  <p className="text-3xl">100</p>
                </div>
              </div>
            </>
          }
          
          
        </div>

        <div className=" p-4 flex flex-col space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:items-start">
          {/* Gráficos */}
          <div className="col-span-1 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Emotions Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataSentiments}
                  dataKey="score"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {dataSentiments.map((entry, index) => (
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
              <BarChart data={dataEmotions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#82ca9d">
                  {dataEmotions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard