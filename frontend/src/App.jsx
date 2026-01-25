import {Routes,Route} from 'react-router'
import './App.css'
import SignupPage from './pages/SignupPage'
import Login from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import {useAuthStore} from './store/useAuthStore'
function App() {
  const {authUser,isLoading,login}=useAuthStore()
  console.log("authUser",authUser)
  console.log("loading",isLoading)
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#141e30] via-[#243b55] to-[#141e30] flex items-center justify-center'>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default App
