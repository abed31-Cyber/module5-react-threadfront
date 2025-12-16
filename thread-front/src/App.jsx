<<<<<<< HEAD

import './App.css'

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Profile } from './components/Profile.jsx'
import Register from './components/Register.jsx'
import HomePage from './components/HomePage.jsx'
import Login from './components/Login.jsx'
import Feed from './components/Feed/feed.jsx'
=======
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../context/AuthContext.jsx'
import CatClawEffectProvider from './CatClawEffectProvider';
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import Profile from './components/profile/Profile.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Feed from './components/Feed/feed.jsx';
import CreatePost from './components/Post/CreatePost.jsx';
import PostDetail from './components/Post/PostDetail.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
>>>>>>> 91e7cf37f959e6aa42829c70b2b2dcf2d9399234

function App() {

  return (
<<<<<<< HEAD
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
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </BrowserRouter>
    </>
=======
    <AuthProvider>
      <CatClawEffectProvider>
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
            <Route path='/posts/:postId' element={<PostDetail />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </BrowserRouter>
      </CatClawEffectProvider>
    </AuthProvider>
>>>>>>> 91e7cf37f959e6aa42829c70b2b2dcf2d9399234
  )
}

export default App

