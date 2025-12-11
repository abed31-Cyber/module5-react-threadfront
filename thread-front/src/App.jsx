import './App.css'
import { AuthProvider } from '../context/AuthContext.jsx'
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import Profile from './components/profile/Profile.jsx'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Feed from './components/Feed/feed.jsx'
import CreatePost from './components/Post/CreatePost.jsx'
import PostDetail from './components/Post/PostDetail.jsx'
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
      {/* <nav>
       <Link to="/">Accueil</Link>
       <Link to="/profile">profile</Link>
       <Link to="/">feed</Link>
      </nav> */}
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/createpost" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
           <Route path="/feed" element={<Feed />} />
           <Route path='/posts/:postId' element={<PrivateRoute><PostDetail /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

