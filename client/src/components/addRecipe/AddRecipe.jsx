import React from 'react'
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AddRecipe() {
    const username = useSelector(state => state.userData.userData.username);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [ingredients, setIngredients] = React.useState('');
    const [directions, setDirections] = React.useState('');
    const [image, setImage] = React.useState(null);
    const [dashboardNav, setDashboardNav] = React.useState(false);

    //using useEffect to get the recipe data from the server as from autofill
    //post data 
    const postData = async () => {
        //using form data to send data
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('ingredients', ingredients);
        formData.append('directions', directions);
        formData.append('image', image);
        formData.append('author', username);
        //axios post request
        const response = await axios.post(`https://savourly-v1.herokuapp.com/recipe/`, formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        const result = await response.data;
        if (result.message === 'Recipe created') {
            setDashboardNav(true);
            alert('Recipe added successfully');
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
                    New Thumbnail
                    <input type="file" placeholder="Image" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="submitButton" onClick={() => { postData() }}>
                    Submit
                </div>
                {
                    dashboardNav ? <Navigate to="/dashboard">Back to Dashboard</Navigate> : null
                }
            </div>
        </>
    )
}

export default AddRecipe