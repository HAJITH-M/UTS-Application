import React from 'react'
import NavBar from './components/NavBar/NavBar'
import Header from './components/Header/Header'
import BookingNav from './components/Booking/BookingNav'
import Tracking from './components/Tracking/Tracking'
import NormalBooking from './components/NormalBoooking/NormalBooking'
import Footer from './components/Footer/Footer'
import LoginSignup from './Auth/AuthComponent/LoginSignup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './Auth/ProtectedRoute'
import HomePage from './Pages/HomePage'

const App = () => {
  return (
    <>

     <Router>
      <NavBar/>
        <Routes>
          <Route path='/' element={<LoginSignup/>}/>
          <Route path='/home' element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>

          
        </Routes>
        <Footer/>

      </Router>


      

     
    </>
   
  )
}

export default App