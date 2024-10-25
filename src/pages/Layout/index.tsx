import Nav from "../../components/Nav"
import { ChildrenProps } from "../../types/AppTypes"

const Layout = ({ children }: ChildrenProps):JSX.Element => {
  return(
    <>
      <Nav />
      { children }
    </>
  )
}

export default Layout