import React from 'react'
import { AutoComplete, Button, Divider } from 'antd'
import { Link } from 'react-router-dom'
import './Login.css'

function Login() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <div className='w-[22vw] h-[330px] bg-[#E7E7E7] p-6 rounded-md'>
            <p className='text-center text-lg font-bold mt-2 mb-6'>Login</p>
            <div className='flex flex-col items-center space-y-5 mb-5'>
                <AutoComplete placeholder='Email' style={{ height: 30 }} className='w-full'/>
                <AutoComplete placeholder='Password' style={{ height: 30 }} className='w-full' />
                <Divider style={{ borderColor: 'black', fontSize: 12 }}>Or With</Divider>
                <Button className='w-full text-[12px] font-bold' color="default" variant="solid">Login</Button>
            </div>
            <p className='text-center text-xs '>Don't have an account? <Link to='/signup' className='underline underline-offset-1 text-[#0087E7]'>Sign Up</Link></p>
        </div>
    </div>
  )
}

export default Login