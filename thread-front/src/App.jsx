import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Profile } from './components/Profile.jsx'

import HomePage from './components/HomePage.jsx'

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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
