import './App.css'

import Layout from '../pages/Layout';

import { AuthContextProvider } from '../contexts/AuthContext'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Auth from '../pages/Auth';
import { AppContextProvider } from '../contexts/AppContext';
import Dashboard from '../pages/Dashboard';

const router = createBrowserRouter([
  {
    path: "/auth",
    element: 
      <Auth /> 
  },
  {
    path: "/",
    element: 
      <Layout>
        <Dashboard />
      </Layout>
  }
]);

function App() {

  return (
    <AppContextProvider>
      <AuthContextProvider>
        <RouterProvider router={router}>
            
        </RouterProvider>
      </AuthContextProvider>
    </AppContextProvider>
  )
}

export default App
