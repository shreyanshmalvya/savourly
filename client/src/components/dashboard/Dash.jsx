import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { incrementByAmount } from '../../redux/title'
import { Link } from 'react-router-dom';

function Dash() {
    const username = useSelector(state => state.userData.userData.username);
    const [userRecipe, setUserRecipe] = React.useState([]);
    const [reRender, setReRender] = React.useState(false);
    const dispatch = useDispatch();
    const getTitle = (reqTitle) => {
        dispatch(incrementByAmount(reqTitle));
    }

    const deleteRecipe = async(recipename) => {
        console.log(recipename)
        const response = await axios.delete(`http://localhost:5000/recipe/${recipename}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data:{
                username: username
            }
        });
        const result = response.data;
        console.log(result);
        if(result.message === 'Recipe deleted') {
            setReRender(true);
            alert('Recipe deleted successfully');
            console.log(reRender);
        }
    }

    //using use effect to get all recipes by the user from the database
    useEffect(() => {
        const allRecipes = async () => {
            const response = await axios.get(`http://localhost:5000/recipe/user/${username}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const result = await response.data;
            return result;
        }
        allRecipes().then(result => {
            setUserRecipe(result.recipe);
        })
    }, [username, reRender]);
    return (
        <div className='searchResults' style={{"padding" : "20px"}}>
            {userRecipe.map((recipe, index) => {
                return (
                    <div className="resultWrapper" key={index}>
                        <div className="searchResult" >
                            <div className="thumbnail">
                                <img src={recipe.image} alt="thumbnail" />
                            </div>
                            <div className="searchResultTitle">
                                {recipe.title}
                            </div>
                            <div className="searchResultDescription" >
                                {recipe.description}
                            </div>
                            <div className="buttonWrapper" style={{"display": "flex" , "flex-direction": "row"}}>
                                <Link to='/read'>
                                    <div className="readOption" onClick={() => getTitle(recipe._id)} >
                                        Read
                                    </div>
                                </Link>
                                <Link to='/edit'>
                                    <div className="readOption" onClick={() => getTitle(recipe._id)} >
                                        Edit
                                    </div>
                                </Link>
                                    <div className="readOption" onClick={() => {deleteRecipe(recipe.title)}} >
                                        Delete
                                    </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default Dash;