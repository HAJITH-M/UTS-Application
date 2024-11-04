import React from 'react'
import NavBar from './components/NavBar/NavBar'
import Footer from './components/Footer/Footer'
import LoginSignup from './Auth/AuthComponent/LoginSignup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './Auth/ProtectedRoute'
import HomePage from './Pages/HomePage'
import BookingConfirmation from './components/NormalBoooking/BookingConfirmation'
import BookingHistory from './components/NormalBoooking/BookingHistory'

const App = () => {
  return (
    <>
     <Router>
        <NavBar/>
          <Routes>
            <Route path='/' element={<LoginSignup/>}/>
            <Route path='/home' element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
            <Route path="/confirm-booking" element={<BookingConfirmation />} />      
            <Route path="/booking-history" element={<BookingHistory />} />
    
          </Routes>
        <Footer/>
      </Router>  
    </>
   
  )
}

export default App