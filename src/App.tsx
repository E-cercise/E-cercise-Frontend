import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/user/signup/SignUp'
import Login from './pages/user/login/Login'
import UserHome from './pages/user/home/UserHome.tsx'
import Detail from './pages/user/detail/Detail'
import Comparison from './pages/user/comparison/Comparison'
import Cart from './pages/user/cart/Cart'
import Purchase from './pages/user/purchase/Purchase'
import OrderTracking from './pages/user/tracking/OrderTracking'
import './App.css'
import useUserRole from "./hook/UseUserRole.tsx";
import {Role} from "./enum/Role.ts";
import AdminHome from "./pages/admin/home/AdminHome.tsx";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.tsx";

function App() {

  const userRole: string | null = useUserRole()

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={
            userRole === Role.Admin ? <ProtectedRoute allowedRoles={["ADMIN"]}> <AdminHome /></ProtectedRoute>: <ProtectedRoute allowedRoles={["USER"]}><UserHome/></ProtectedRoute>
          } />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/' element={
            userRole === Role.Admin ? <ProtectedRoute allowedRoles={["ADMIN"]}> <AdminHome /></ProtectedRoute>: <ProtectedRoute allowedRoles={["USER"]}><UserHome/></ProtectedRoute>
          }/>
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
