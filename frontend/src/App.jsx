import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminHome from './AdminHome'
import AdminMenu from './AdminMenu'
import AdminBooking from './AdminBooking'
import AdminGallery from './AdminGallery'
import Home from './Home'
import SignUp from './SignUp'
import LogIn from './LogIn'
import Menu from './Menu'
import Booking from './Booking'
import Gallery from './Gallery'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/a_home" element={<AdminHome />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/a_menu" element={<AdminMenu />} />
        <Route path="/a_booking" element={<AdminBooking />} />
        <Route path="/a_gallery" element={<AdminGallery />} />


        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
