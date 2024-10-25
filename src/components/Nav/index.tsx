import React from "react";
import { signOut } from "../../firebase/auth"
import useScreenResolution from "../../hooks/UseScreenResolution";

const Nav = ():JSX.Element => {
  const resolution = useScreenResolution();
  const [isMobile, setIsMobile] = React.useState<boolean>(false); 
  
  React.useEffect(()=>{
    const mobileBreak = 768
    if(resolution.width < mobileBreak)
      setIsMobile(true)
    else
      setIsMobile(false)
  },[resolution])
  
  const logOut = async () => {
    await signOut().catch((err) => {console.error(err)})
  }
  
  return(
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        {isMobile ? 
          <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><a href="#sentiments">Sentiments</a></li>
            <li><a href="#emotions">Emotions</a></li>
          </ul>
        </div>
        :
          <ul className="menu menu-horizontal px-1">
            <li><a href="#sentiments">Sentiments</a></li>
            <li><a href="#emotions">Emotions</a></li>
          </ul>
        }
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Tech Text App 😶📃</a>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button 
          className="btn btn-error"
          onClick={ () => {
              logOut()
            }
          }
        >
          logOut
        </button>
      </div>
    </div>
  )
}

export default Nav