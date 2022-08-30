import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.svg'
import './navbar.css'


const Navbar = () => {
  return (
    <div className="navbarWrapper">
      <div className="logo">
        <Link to='/'>
          <img src={logo} alt="logo" />
        </Link>
      </div>

      <Link to='/login'>
        <div className="loginButton">
          <span className='Login'>Login</span>
        </div>
      </Link>
    </div>
  )
}

export default Navbar