import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/signup/SignUp'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import Detail from './pages/detail/Detail'
import Comparison from './pages/comparison/Comparison'
import Cart from './pages/cart/Cart'
import Purchase from './pages/purchase/Purchase'
import OrderTracking from './pages/tracking/OrderTracking'
import './App.css'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/home' element={<Home/>}/>
          <Route path='/equipment/:equipment_id' element={<Detail />} />
          <Route path='/comparison' element={<Comparison />}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/purchase' element={<Purchase />}/>
          <Route path='/order-tracking' element={<OrderTracking />}/>
        </Routes>
      </BrowserRouter>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </div>
  )
}

export default App
