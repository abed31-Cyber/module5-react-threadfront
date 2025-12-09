
import './App.css'

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Profile } from './components/Profile.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './components/Register.jsx'
import HomePage from './components/HomePage.jsx'
import Login from './components/Login.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
      <nav>
       <Link to="/">Accueil</Link>
       <Link to="/profile">profile</Link>
      </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Login" element={<Login/>}/>
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App