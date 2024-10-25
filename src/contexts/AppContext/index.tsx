import React from "react";
import Papa from "papaparse";
import { ChildrenProps, FileCSV, AnalizeCSV, SetterBoolean } from "../../types/AppTypes";
import useModel from "../../hooks/UseModel";

interface App {
  data: FileCSV[];
  errMsg: string;
  isErr: boolean;
  setIsErr: SetterBoolean;
  isLoad: boolean;
  analyzeData: AnalizeCSV[];
  minurData: FileCSV[];
  setAnalyzeData: React.Dispatch<React.SetStateAction<AnalizeCSV[]>>;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  setIsLoad: SetterBoolean;
}

const initializeApp: App = {
  data: [],
  errMsg: '',
  isErr: false,
  setIsErr: () => {},
  isLoad: true,
  analyzeData: [],
  minurData: [],
  setAnalyzeData: () => {},
  setErrMsg: () => {},
  setIsLoad: () => {}
};

const AppContext = React.createContext<App>(initializeApp);

export const useApp = () => React.useContext(AppContext);

export const AppContextProvider = ({ children }: ChildrenProps): JSX.Element => {
  const [analyzeData, setAnalyzeData] = React.useState<AnalizeCSV[]>([]);
  const [data, setData] = React.useState<FileCSV[]>([]);
  const [minurData, setMinurData] = React.useState<FileCSV[]>([]);
  const [errMsg, setErrMsg] = React.useState<string>('');
  const [isErr, setIsErr] = React.useState<boolean>(false);
  const [isLoad, setIsLoad] = React.useState<boolean>(true);

  const urlCSV = 'DataRedesSociales.csv';

  // Carga y análisis del CSV
  React.useEffect(() => {
    const getDataFromCSV = async () => {
      await Papa.parse(urlCSV, {
        download: true,
        header: true, 
        complete: (res) => {
          const dataFetch = res.data as FileCSV[];
          setData(dataFetch);
          const arr = dataFetch.slice(1, 500);
          setMinurData(arr);
        },
        error: (err) => {
          setIsErr(true);
          setErrMsg(err.message);
        }
      });
      setIsLoad(false);
    };

    getDataFromCSV();
  }, [urlCSV]);

  // Ejecutar el modelo después de que minurData esté disponible
  React.useEffect(() => {
    const analyzeData = async () => {
      if (minurData.length > 0) {
        await useModel(minurData, 'emotion', setAnalyzeData, setErrMsg, setIsErr, setIsLoad);
        await useModel(minurData, 'sentiment', setAnalyzeData, setErrMsg, setIsErr, setIsLoad);
      }
    };

    analyzeData();
  }, [minurData]);

  const value: App = {
    data,
    analyzeData,
    errMsg,
    isErr,
    setIsErr,
    isLoad,
    minurData,
    setAnalyzeData,
    setErrMsg,
    setIsLoad
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
