import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import Navbar from './components/common/navbar/Navbar.jsx'
import HomePage from './components/home/HomePage.jsx'
import Footer from './components/common/footer/Footer.jsx'
import AllRoomsPage from './components/booking_rooms/all-rooms/AllRoomsPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </StrictMode>,
)