import React from 'react'
import { AutoComplete, Button, Divider } from 'antd'

function SignUp() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <div className='w-[27vw] h-[85vh] bg-[#E7E7E7] p-6 rounded-md'>
            <p className='text-center text-lg font-bold mb-5'>Sign Up</p>
            <div className='flex flex-col items-center space-y-5 mb-5'>                    
                <AutoComplete placeholder="First Name" style={{ height: 30 }} className='w-full'/>
                <AutoComplete placeholder="Last Name" style={{ height: 30 }} className='w-full'/>
                <AutoComplete placeholder="Email" style={{ height: 30 }} className='w-full'/>
                <AutoComplete placeholder="Password" style={{ height: 30 }} className='w-full'/>
                <AutoComplete placeholder="Confirm Password" style={{ height: 30 }} className='w-full'/>
                <AutoComplete placeholder="Address" style={{ height: 30 }} className='w-full'/>
                <Divider style={{ borderColor: 'black' }} className='ml-2 mr-2'>Or with</Divider>
                <Button className='w-full'>Sign Up</Button>
            </div>
            <p className='text-center text-xs'>Already have an account? <a href="" className='underline underline-offset-1 text-[#0087E7]'>Login</a></p>
        </div>
    </div>
  )
}

export default SignUp