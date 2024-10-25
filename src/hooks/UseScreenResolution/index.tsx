import { useEffect, useState } from "react"

interface Resolution {
  width: number,
  height: number
}

const useScreenResolution = ():Resolution => {
  const [resolution, setResolution] = useState<Resolution>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(()=>{
    const handleResolution = () => {
      // funcion al cambiar los stados de resolucion
      setResolution({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    };

    window.addEventListener("resize", handleResolution);

    return () => {
      window.removeEventListener("resize", handleResolution);
    }
  }, [])

  return resolution;
}

export default useScreenResolution