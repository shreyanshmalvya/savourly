import React, {useEffect} from 'react'
import { Navigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import EditRecipe from '../../components/editRecipe/EditRecipe';
import { useSelector } from 'react-redux';

function Edit() {
    const login = useSelector(state => state.login.login);
    const [backtoLogin, setBacktoLogin] = React.useState(false);
    useEffect(() => {
        if (!login) {
            setBacktoLogin(true);
        }
    }, [login]);
    return (
        <>
            {login &&
                <>
                    <Navbar />
                    <EditRecipe />
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

export default Edit