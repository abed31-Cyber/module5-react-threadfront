
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './components/Register.jsx'
import HomePage from './components/HomePage.jsx'
import Login from './components/Login.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/Login" element={<Login/>}/>
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App