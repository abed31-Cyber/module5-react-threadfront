import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from './components/HomePage.jsx'
import Feed from './components/Feed.jsx'
import PostCard from './components/PostCard.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
