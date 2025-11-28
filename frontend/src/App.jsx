import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminDashboard from './screens/admin/AdminDashboard'
import AdminMenu from './screens/admin/AdminMenu'
import AdminBooking from './screens/admin/AdminBooking'
import AdminGallery from './screens/admin/AdminGallery'
import Home from './Home'
import SignUp from './SignUp'
import LogIn from './LogIn'
import Menu from './Menu'
import Booking from './Booking'
import Gallery from './Gallery'
import UserDashboard from './screens/user/UserDashboard'
import UserBooking from './screens/user/UserBooking'
import AdminPackages from './screens/admin/AdminPackages'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/gallery" element={<Gallery />} />

        <Route path="/a_home" element={<AdminDashboard />} />
        <Route path="/a_menu" element={<AdminMenu />} />
        <Route path="/a_booking" element={<AdminBooking />} />
        <Route path="/a_gallery" element={<AdminGallery />} />
        <Route path="/a_packages" element={<AdminPackages />} />

        <Route path="/home" element={<UserDashboard />} />
        <Route path="/u_booking" element={<UserBooking />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
