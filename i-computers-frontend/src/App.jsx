import { Routes, Route } from 'react-router-dom'
import './App.css'
import Homepage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from "./pages/AdminPage"
import TestPage from './pages/Test'
import { Toaster } from 'react-hot-toast'
import axios from "axios";


function App() {
  return (
    <>
    <div className='w-full h-screen bg-red-900'>
      <Toaster position = "top-right"/>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/signin" element={<LoginPage/>} />
        <Route path="/signup" element={<RegisterPage/>} />
        <Route path="/admin/*" element={<AdminPage/>} />
        <Route  path ="/test" element={<TestPage/>} />
      </Routes>
    </div>
    </>
  )
}

export default App
