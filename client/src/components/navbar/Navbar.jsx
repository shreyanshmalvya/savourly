import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.svg'
import './navbar.css'


const Navbar = () => {
  const login = useSelector(state => state.login.login)
  return (
    <div className="navbarWrapper">
      <div className="logo">
        <Link to='/'>
          <img src={logo} alt="logo" />
        </Link>
      </div>
      {
        login ?
          <Link to='/dashboard'>
            <div className="loginButton">
              <span className='Login'>Dashboard</span>
            </div>
          </Link>
          :
          <Link to='/login'>
            <div className="loginButton">
              <span className='Login'>Login</span>
            </div>
          </Link>
      }

    </div>
  )
}

export default Navbar