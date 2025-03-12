import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/user/signup/SignUp'
import Login from './pages/user/login/Login'
import Detail from './pages/user/detail/Detail'
import Comparison from './pages/user/comparison/Comparison'
import Cart from './pages/user/cart/Cart'
import Purchase from './pages/user/purchase/Purchase'
import OrderTracking from './pages/user/tracking/OrderTracking'
import './App.css'
import AdminHome from "./pages/admin/home/AdminHome.tsx";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.tsx";
import {Role} from "./enum/Role.ts";
import {useAuth} from "./hook/UseAuth.tsx";
import UserHome from "./pages/user/home/UserHome.tsx";

function App() {
  const {role, isLoading} = useAuth()

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<UserHome/> } />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/' element={<UserHome/> }/>
          <Route path='/equipment/:equipment_id' element={<Detail />} />
          <Route path='/comparison' element={<Comparison />}/>
          <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>}/>
          <Route path='/purchase' element={<ProtectedRoute><Purchase /></ProtectedRoute>}/>
          <Route path='/order-tracking' element={<ProtectedRoute><OrderTracking /></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
