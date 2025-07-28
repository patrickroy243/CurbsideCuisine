import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import RootRoute from './route/root'
import './index.css'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RootRoute />
    </BrowserRouter>
  </React.StrictMode>
)






// Curbside_Frontend
// >src 
//   >component
//     >loader.jsx
//     >mapApi.jsx
//     >navbar.jsx
//   >page 
//     >home.jsx
//     >login.jsx
//     >truckmap.jsx 
//     >vendor.jsx
//   >route
//     >root.jsx
//   >index.css
//   >main.jsx