import React from 'react'
import './dashboard.css';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dash from '../../components/dashboard/Dash';
import Navbar from '../../components/navbar/Navbar';

function Dashboard() {
    const token = localStorage.getItem('token');
    const [backtoLogin, setBacktoLogin] = React.useState(false);
    if (!token) {
        setBacktoLogin(true);
    }
    const userName = useSelector(state => state.userData.userData.username);
    return (
        <>
            {token &&
                <>
                    <Navbar />
                    <div className="dashboardWrapper">
                        Welcome to the dashboard! {userName} <br />
                        Here you can see all of your recipes and edit them.
                    </div>
                    <Dash />
                    <div className="creator">
                        <p>Created by Shreyansh Malviya</p>
                    </div>
                </>
            }
            {
                backtoLogin && <Navigate to='/login' />
            }
        </>
    )
}

export default Dashboard