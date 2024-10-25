import { Navigate } from "react-router-dom";
import Form from "../../components/Form"
import { useAuth } from "../../contexts/AuthContext"

const Auth = ():JSX.Element => {
  const {isLoggedIn} = useAuth();

  return(
    <>
      {isLoggedIn && 
        <Navigate to={'/'} replace={true} />
      }
      <Form />
    </>
  )
}

export default Auth