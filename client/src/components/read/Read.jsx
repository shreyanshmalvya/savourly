import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import './read.css'

function Read() {
    const id = useSelector(state => state.title.title)
    console.log(id)
    //fetches recipe details from the api
    const [recipe, setRecipe] = React.useState([{
        "_id": "",
        "author": "",
        "title": "",
        "description": "",
        "ingredients": "",
        "directions": "",
        "image": ""
    }]);

    useEffect(() => {
        const result = async () => {
            const response = await axios.get(`https://savourly-v1.herokuapp.com/recipe/read/${id}`);
            const result = await response.data.recipe[0];
            return result
        }
        result().then(result => {
            setRecipe(result)
        }
        )
    }, [id])

    console.log(recipe);

    return (
        <>
            <div className="recipeWrapper">
                <div className="recipe">
                    <div className="recipeTitle">
                        <h1>{recipe.title}</h1>
                    </div>
                    <div className="topWrapper">
                        <div className="recipeImage">
                            <img src={recipe.image} alt={recipe.title} />
                        </div>
                        <div className="recipeDescription">
                            <div>{recipe.description}</div>
                            <div className="recipeIngredients">
                                <div>Ingredients:</div>
                                <div>{recipe.ingredients}</div>
                            </div>
                        </div>
                    </div>
                    <div className="recipeInstructions">
                        <div>Instructions</div>
                        {recipe.directions}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Read