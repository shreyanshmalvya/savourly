import axios from 'axios';
import React from 'react'
import './editRecipe.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {Navigate} from 'react-router-dom';

function EditRecipe() {
    const id = useSelector(state => state.title.title);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [ingredients, setIngredients] = React.useState('');
    const [directions, setDirections] = React.useState('');
    const [image, setImage] = React.useState('');
    const [dashboardNav, setDashboardNav] = React.useState(false);

    //using useEffect to get the recipe data from the server as from autofill
    useEffect(() => {
        const getFormData = async () => {
            const response = await axios.get(`https://savourly-v1.herokuapp.com/recipe/read/${id}`);
            const result = await response.data.recipe[0];
            return result;
        }
        getFormData().then(result => {
            setTitle(result.title);
            setDescription(result.description);
            setIngredients(result.ingredients);
            setDirections(result.directions);
            setImage(result.image);
        }).catch(err => {
            console.log(err);
        });
    }, [id]);

    //post data 
    const patchData = async () => {
        const response = await axios.patch(`https://savourly-v1.herokuapp.com/recipe/update/${id}`, {
            title: title,
            description: description,
            ingredients: ingredients,
            directions: directions,
            image: image
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },

        });
        const result = await response.data;
        if(result.message === 'Recipe updated') {
            setDashboardNav(true);
            alert('Recipe updated successfully');
        }
    }

    return (
        <>
            <div className="editWrapper">
                <div className="editForm">
                    Title:
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    Description:
                    <textarea type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    Ingredients
                    <input type="text" placeholder="Ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
                    Directions:
                    <textarea type="text" placeholder="Directions" value={directions} onChange={(e) => setDirections(e.target.value)} />
                    Image/Thumbnail:
                    <img src={image} alt="thumbnail" />
                    New Thumbnail
                    <input type="file" placeholder="Image" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="submitButton" onClick={() => { patchData() }}>
                    Submit
                </div>
                {
                    dashboardNav ? <Navigate to="/dashboard">Back to Dashboard</Navigate> : null
                }
            </div>
        </>
    )
}

export default EditRecipe