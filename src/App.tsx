import {BrowserRouter, Route, Routes} from 'react-router-dom'
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
import {useAuth} from "./hook/UseAuth.ts";
import Home from "./pages/home/Home.tsx";
import AdminOrderList from "./pages/order_list/AdminOrderList.tsx";
import AddEquipmentPage from "./pages/add_equipment/AddEquipment.tsx";
import AdminDetailPage from "./pages/detail/AdminDetail.tsx";
import UserProfilePage from "./pages/user_profile/UserProfile.tsx";
import AdminOrderTracking from './pages/tracking/AdminOrderTracking.tsx'

function App() {
    const {userId, role, isLoading} = useAuth()

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Home/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/signup' element={<SignUp/>}/>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/equipment/:equipment_id' element={role === Role.Admin ?
                        <ProtectedRoute allowedRoles={[Role.Admin]}><AdminDetailPage/></ProtectedRoute> : <Detail/>}/>
                    <Route path='/equipment/add'
                           element={<ProtectedRoute allowedRoles={[Role.Admin]}><AddEquipmentPage/> </ProtectedRoute>}/>
                    <Route path='/comparison' element={<Comparison/>}/>
                    <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
                    <Route path='/purchase' element={<ProtectedRoute><Purchase/></ProtectedRoute>}/>
                    <Route path='/order-tracking' element={<ProtectedRoute><OrderTracking/></ProtectedRoute>}/>
                    <Route path='/order-tracking/admin' element={<ProtectedRoute allowedRoles={[Role.Admin]}><AdminOrderTracking/></ProtectedRoute>}/>
                    <Route path='/orders/admin'
                           element={<ProtectedRoute allowedRoles={[Role.Admin]}><AdminOrderList/></ProtectedRoute>}/>
                    <Route path='/profile'
                           element={<ProtectedRoute allowedRoles={[Role.Admin, Role.User]}><UserProfilePage/>
                           </ProtectedRoute>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
