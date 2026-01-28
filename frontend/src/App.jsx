import {Routes,Route,Navigate} from 'react-router-dom'
import './App.css'
import {useEffect} from 'react'
import SignupPage from './pages/SignupPage'
import Login from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import {useAuthStore} from './store/useAuthStore'
import Loader from './components/Loader'
import {Toaster} from 'react-hot-toast'

function App() {

  const {authUser,isCheckingAuth,checkAuth}=useAuthStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log({authUser})

  if(isCheckingAuth) return <Loader/>
  
  return (
    <div className='min-h-screen bg-linear-to-br from-[#141e30] via-[#243b55] to-[#141e30] flex items-center justify-center'>

      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
