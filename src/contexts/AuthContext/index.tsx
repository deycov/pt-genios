import { onAuthStateChanged, User } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase";
import { ChildrenProps } from "../../types/AppTypes";

// Define la estructura del usuario autenticado
interface CurrentUser {
  email: string | null;
  displayName: string | null;
  uid: string;
}

// Define la estructura de contexto
interface Auth {
  username: string,
  setUsername: React.Dispatch<React.SetStateAction<string>>,
  password: string,
  setPassword: React.Dispatch<React.SetStateAction<string>>,
  currentUser: CurrentUser | null,
  isLoggedIn: boolean,
  isLoad: boolean,
  isErr: boolean,
  errMsg: string,
  setIsErr: React.Dispatch<React.SetStateAction<boolean>>, 
  setIsLoad: React.Dispatch<React.SetStateAction<boolean>>, 
  setErrMsg: React.Dispatch<React.SetStateAction<string>>
}

// Valor inicial del contexto
const initializeContext: Auth = {
  username: '',
  setUsername: () => {},
  password: '',
  setPassword: () => {},
  currentUser: null,
  isLoggedIn: false,
  isLoad: true,
  isErr: false,
  errMsg: '',
  setIsErr: () => {}, 
  setIsLoad: () => {}, 
  setErrMsg: () => {}
};

// Definimos el contexto con el tipo adecuado
const AuthContext = React.createContext<Auth>(initializeContext);

export const useAuth = () => {
  return React.useContext(AuthContext);
}

export const AuthContextProvider = ({ children }: ChildrenProps): JSX.Element => {
  //estados de login y register
  const [username, setUsername] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')

  // estados de carda y de error
  const [errMsg, setErrMsg] = React.useState<string>('');
  const [isErr, setIsErr] = React.useState<boolean>(false);
  const [isLoad, setIsLoad] = React.useState<boolean>(true);

  //estados de auth by firebase
  const [currentUser, setCurrentUser] = React.useState<CurrentUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  React.useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user: User | null) => {
      try {
        setIsLoad(true);
        if (user) {
          // Establecemos el estado con la información del usuario autenticado
          setCurrentUser({
            ...user
          });
          setIsLoggedIn(true);
        } else {
          // No hay usuario autenticado
          setCurrentUser(null);
          setIsLoggedIn(false);
        }  
      } catch (err) {
        setIsErr(true);
        setErrMsg((err as Error).message);
      } finally {
        setIsLoad(false);
      }
    }); 

    return () => unSubscribe();
  }, []);

  const value: Auth = {
    username,
    setUsername,
    password,
    setPassword,
    currentUser,
    isLoggedIn,
    isLoad,
    isErr,
    errMsg,
    setIsErr, 
    setIsLoad, 
    setErrMsg
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
