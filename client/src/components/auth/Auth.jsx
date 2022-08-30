import axios from 'axios';
import React from 'react'
import './auth.css'
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { incrementByAmount } from '../../redux/userData';
import { setLogin } from '../../redux/login';

function Auth() {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [formtype, setFormtype] = React.useState(true); //true for login, false for register
    const [dashboardNav, setDashboardNav] = React.useState(false);
    const dispatch = useDispatch();
    
    const loginHandler = async () => {
        const response = await axios.post(`https://savourly-v1.herokuapp.com/user/login`, {
            data: {
                email: email,
                password: password
            }
        })
        const result = await response.data;
        if (result.message === "Auth successful") {
            const token = await response.data.token;
            localStorage.setItem('token', token);
            dispatch(setLogin(true))
            dispatch(incrementByAmount({username: result.username}));
            setDashboardNav(true);
        } else {
            alert(result.message);
            setFormtype(true)
        }
    }
    const signupHandler = async () => {
        const response = await axios.post(`https://savourly-v1.herokuapp.com/user/signup`, {
            data: {
                username: username,
                email: email,
                password: password
            }
        })
        const result = await response.data;
        if (result.message === "User Created") {
            alert(result.message);
            setFormtype(true);
        } else {
            alert(result.message);
        }
    }

    return (
        <div>
            {
                formtype ?
                    <>
                        <div className="loginWrapper">
                            <div className="loginForm">
                                <div className="loginHeader">
                                    <h1>Login</h1>
                                </div>
                                <div className="loginBody">
                                    <div className="loginInput">
                                        <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className="loginInput">
                                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <div className="loginButton">
                                        <div onClick={loginHandler}>Login</div>
                                    </div>
                                </div>
                                <div className="optionsMessage">
                                    New user? <span onClick={() => setFormtype(false)}>Signup</span>
                                </div>
                            </div>
                        </div>
                    </> :
                    <>
                        <div className="signupWrapper">
                            <div className="signupForm">
                                <div className="signupHeader">
                                    <h1>Signup</h1>
                                </div>
                                <div className="signupBody">
                                    <div className="signupInput">
                                        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                                    </div>
                                    <div className="signupInput">
                                        <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className="signupInput">
                                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <div className="signupButton">
                                        <div onClick={signupHandler}>Signup</div>
                                    </div>
                                </div>
                                <div className="optionsMessage">
                                    Already a user? <span onClick={() => setFormtype(true)}>Login</span>
                                </div>
                            </div>
                        </div>
                    </>
            }
            {
                dashboardNav ? <Navigate to="/dashboard" /> : null
            }
        </div>
    )
}

export default Auth;