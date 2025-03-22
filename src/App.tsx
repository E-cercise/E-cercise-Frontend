import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/signup/SignUp'
import Login from './pages/login/Login'
import Detail from './pages/detail/Detail'
import Comparison from './pages/comparison/Comparison'
import Cart from './pages/cart/Cart'
import Purchase from './pages/purchase/Purchase'
import OrderTracking from './pages/tracking/OrderTracking'
import './App.css'
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.tsx";
import {Role} from "./enum/Role.ts";
import {useAuth} from "./hook/UseAuth.tsx";
import Home from "./pages/home/Home.tsx";
import OrderList from "./pages/order_list/OrderList.tsx";
import AddEquipmentPage from "./pages/add_equipment/AddEquipment.tsx";
import AdminDetailPage from "./pages/detail/AdminDetail.tsx";

function App() {
  const {role, isLoading} = useAuth()

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/> } />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/' element={<Home/> }/>
          <Route path='/equipment/:equipment_id' element={role===Role.Admin?<ProtectedRoute allowedRoles={[Role.Admin]}><AdminDetailPage/></ProtectedRoute>:<Detail />} />
          <Route path='/equipment/add' element={<ProtectedRoute allowedRoles={[Role.Admin]}><AddEquipmentPage />  </ProtectedRoute>}/>
          <Route path='/comparison' element={<Comparison />}/>
          <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>}/>
          <Route path='/purchase' element={<ProtectedRoute><Purchase /></ProtectedRoute>}/>
          <Route path='/order-tracking' element={<ProtectedRoute><OrderTracking /></ProtectedRoute>}/>
          <Route path='/orders' element={<ProtectedRoute allowedRoles={[Role.Admin]}><OrderList/></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
