import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Helplines from './pages/Helplines'
import Contacts from './pages/Contacts'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import OfflineBanner from './components/OfflineBanner'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <OfflineBanner/> 
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <PrivateRoute><Home /></PrivateRoute>
          } />
          <Route path="/helplines" element={
            <PrivateRoute><Helplines /></PrivateRoute>
          } />
          <Route path="/contacts" element={
            <PrivateRoute><Contacts /></PrivateRoute>
          } />
          <Route path="/about" element={
            <PrivateRoute><About /></PrivateRoute>
          } />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App