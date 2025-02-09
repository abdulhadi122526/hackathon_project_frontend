import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import Layout from './Layout.jsx'
import ProtectedRoute from '../components/protactedrout.jsx'


const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Login />
      },
      {
        path: "signup",
        element: <Signup />
      },
      {
        path: "home",
        element: <ProtectedRoute component={<Home/>}/>
      },

    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
