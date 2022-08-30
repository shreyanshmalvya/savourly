import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import Auth from '../../components/auth/Auth'

const Login = () => {
    return (
        <div className='homeWrapper'>
            <div className='home'>
                <Navbar />
                <Auth />
                <div className="creator">
                    <p>Created by Shreyansh Malviya</p>
                </div>
            </div>
        </div>
    )
}
export default Login;