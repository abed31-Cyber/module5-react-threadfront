
import './App.css'
import { AuthProvider } from '../context/AuthContext.jsx'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Profile from './components/profile/Profile.jsx'
import Commentary from './components/comment/comment.jsx'
import Register from './components/Register.jsx'
import HomePage from './components/HomePage.jsx'
import Login from './components/Login.jsx'
import Feed from './components/Feed/feed.jsx'
import CreatePost from './components/Post/CreatePost.jsx'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
      <nav>
       <Link to="/">Accueil</Link>
       <Link to="/profile">profile</Link>
       <Link to="/feed">feed</Link>
       <Link to="/comment">test unitaire comment</Link>
       
      </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Login" element={<Login/>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/comment" element={<Commentary />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App