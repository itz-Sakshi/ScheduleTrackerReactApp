import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import App from './App.jsx'
// import User from "./components/user.jsx"
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  // {
  //   path: "/:username",
  //   element:<User/>
  // },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
