import React from 'react'
import NavBar from './components/NavBar/NavBar'
import Footer from './components/Footer/Footer'
import LoginSignup from './Auth/AuthComponent/LoginSignup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './Auth/ProtectedRoute'
import HomePage from './Pages/HomePage/HomePage'
import BookingConfirmation from './components/NormalBoooking/BookingConfirmation'
import BookingHistory from './components/NormalBoooking/BookingHistory'
import TrainCrowdPrediction from './components/CrowdPrediction/CrowdPrediction'
import DataTable from './components/python/DataTable'
import TrainsPage from './components/Trains/TrainsComponent'
import AboutPage from './Pages/AboutPage/AboutPage'
import SeasonTicketPage from './Pages/SeasonTicketPage/SeasonTicketPage'
import PlatformTicketPage from './Pages/PlatformTicketPage/PlatformTicketPage'
import QuickBooking from './Pages/QuickBooking/QuickBooking'
import ProfilePage from './Pages/ProfilePage/ProfilePage'
import TicketPage from './Pages/TicketPage/TicketPage'

const App = () => {
  return (
    <>
     <Router>
        <NavBar/>
          <Routes>
            <Route path='/' element={<LoginSignup/>}/>
            <Route path='/d' element={<DataTable/>}/>
            <Route path='/home' element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
            <Route path="/confirm-booking" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />      
            <Route path="/booking-history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
            <Route path="/trains" element={<ProtectedRoute><TrainsPage /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
            <Route path="/seasonticket" element={<ProtectedRoute><SeasonTicketPage /></ProtectedRoute>} />
            <Route path="/platformticket" element={<ProtectedRoute><PlatformTicketPage /></ProtectedRoute>} />
            <Route path="/quickbooking" element={<ProtectedRoute><QuickBooking /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/showticket" element={<ProtectedRoute><TicketPage /></ProtectedRoute>} />

            <Route path='/crowd' element={<TrainCrowdPrediction/>} />
          </Routes>
        <Footer/>
      </Router>  
    </>
   
  )
}

export default App