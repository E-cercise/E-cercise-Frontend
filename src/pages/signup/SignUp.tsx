import React from 'react'
import { AutoComplete, Button, Divider } from 'antd'
import { Link } from 'react-router-dom'
import './SignUp.css'

function SignUp() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <div className='w-[22vw] h-[530px] bg-[#E7E7E7] p-6 rounded-md'>
            <p className='text-center text-lg font-bold mt-2 mb-6'>Sign Up</p>
            <div className='flex flex-col items-center space-y-5 mb-5'>                    
                <AutoComplete placeholder='First Name' style={{ height: 30 }} className='w-full placeholder:text-sm'/>
                <AutoComplete placeholder='Last Name' style={{ height: 30 }} className='w-full'/>
                <AutoComplete placeholder='Email' style={{ height: 30 }} className='w-full'/>
                <AutoComplete placeholder='Password' style={{ height: 30 }} className='w-full'/>
                <AutoComplete placeholder='Confirm Password' style={{ height: 30 }} className='w-full'/>
                <AutoComplete placeholder='Address' style={{ height: 30 }} className='w-full'/>
                <Divider style={{ borderColor: 'black', fontSize: 12 }}>Or with</Divider>
                <Button className='w-full text-[12px] font-bold' color="default" variant="solid">Sign Up</Button>
            </div>
            <p className='text-center text-xs'>Already have an account? <Link to='/login' className='underline underline-offset-1 text-[#0087E7]'>Login</Link></p>
        </div>
    </div>
  )
}

export default SignUp