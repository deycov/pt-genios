import React, { ChangeEvent, MouseEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { SetterBoolean, SetterUseState } from "../../types/AppTypes";
import { createUser, loginUser } from "../../firebase/auth";
import Load from "../Load";
import Error from "../Error";

// Separar la validación de inputs en una función
const validateInputs = (username: string, password: string, setErrMsg: SetterUseState, setIsErr: SetterBoolean ): boolean => {
  if (!username || !password) {
    setIsErr(true);
    setErrMsg("Email and password are required");
    return false;
  }
  if (!username.includes("@") || !username.includes(".com")) {
    setIsErr(true);
    setErrMsg("Email needs a correct form, using '@' and '.com'");
    return false;
  }
  if (password.length < 8) {
    setErrMsg("The password must be at least 8 characters long");
    return false;
  }
  return true;
};

const Form = (): JSX.Element => {
  const [isLogin, setIsLogin] = React.useState(true);
  const {
    username, 
    setUsername, 
    password, 
    setPassword,
    isErr,
    setIsErr, 
    isLoad,
    setIsLoad, 
    errMsg,
    setErrMsg
  } = useAuth();

  const handleChange = (event: ChangeEvent<HTMLInputElement>, setter: SetterUseState) => {
    setter(event.target.value);
  };

  const handleSubmit = async (
    event: MouseEvent<HTMLInputElement, globalThis.MouseEvent>, 
    auth: string
  ) => {
    event.preventDefault();
    setIsLoad(true); // Activar estado de carga antes de hacer la petición
    const User = { username, password };

    if (auth === 'login') {
      if (validateInputs(username, password, setErrMsg, setIsErr)) {  
        await loginUser(username, password)
          .then(() => {
            console.log("User logged in:", User);
          })
          .catch((err: Error) => {
            setIsErr(true);
            setErrMsg(err.message); // Mostrar el mensaje de error real
          })
          .finally(() => {
            setIsLoad(false); // Desactivar estado de carga
          });
      } else {
        setIsLoad(false); 
      }
    } else {
      if (validateInputs(username, password, setErrMsg, setIsErr)) {
        await createUser(username, password)
          .then(() => {
            console.log("User registered:", User);
          })
          .catch((err: Error) => {
            setIsErr(true);
            setErrMsg(err.message); // Mostrar el mensaje de error real
          })
          .finally(() => {
            setIsLoad(false); // Desactivar estado de carga
          });
      } else {
        setIsLoad(false); 
      }
    }
  };
  
  const authAction = isLogin ? "Login" : "Register"; // Texto dinámico para login/register

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('banner.jpg')" }}>
      
      {isLoad && <Load />}  {/* Mostrar componente de carga */}
      {isErr && <Error message={errMsg}/>} {/* Mostrar error */}

      <div className="flex items-center justify-center h-screen">
        <div className="card w-96 bg-white bg-opacity-25 shadow-xl p-8">
          <h2 className="text-center text-2xl text-white font-bold mb-4">{authAction}</h2>
          
          <form>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-white ">Email</span>
              </label>
              <input 
                type="email" 
                value={username} 
                placeholder="Email Here"
                onChange={(e) => handleChange(e, setUsername)}
                className="input input-bordered w-full" 
              />
            </div>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-white ">Password</span>
              </label>
              <input 
                type="password" 
                value={password}
                placeholder="Enter your password" 
                className="input input-bordered w-full" 
                onChange={(e) => handleChange(e, setPassword)}
              />
            </div>
            
            <div className="form-control">
              <input 
                type="submit"
                value={authAction}
                className={`btn btn-primary w-full ${isLoad ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => handleSubmit(e, isLogin ? 'login' : 'register')}
                disabled={isLoad}  // Desactivar botón si está cargando
              />
            </div>
          </form>
          
          <p className="text-center text-white  mt-4">
            {isLogin ? (
              <>
                Don't have an account? <a className="text-blue-200 cursor-pointer" onClick={() => setIsLogin(false)}>Sign up</a>
              </>
            ) : (
              <>
                Already have an account? <a className="text-emerald-300 cursor-pointer" onClick={() => setIsLogin(true)}>Log in</a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Form;
