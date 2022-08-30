import React from 'react'
import './dashboard.css';
import { Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dash from '../../components/dashboard/Dash';
import Navbar from '../../components/navbar/Navbar';
import { useEffect } from 'react';

function Dashboard() {
    const login = useSelector(state => state.login.login);
    console.log(login)
    const [backtoLogin, setBacktoLogin] = React.useState(false);
    useEffect(() => {
        if (!login) {
            setBacktoLogin(true);
        }
    }, [login]);
    const userName = useSelector(state => state.userData.userData.username);
    return (
        <div>
            {login &&
                <div>
                    <Navbar />
                    <div className="dashboardWrapper">
                        Welcome to the dashboard! {userName} <br />
                        Here you can see all of your recipes and edit them.
                        <Link to='/add'>
                            <div className="loginButton">
                                Add_Recipe
                            </div>
                        </Link>
                    </div>
                    <Dash />
                    <div className="creator">
                        <p>Created by Shreyansh Malviya</p>
                    </div>
                </div>
            }
            {
                backtoLogin && <Navigate to='/login' />
            }
        </div>
    )
}

export default Dashboard