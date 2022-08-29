import React, { useEffect } from 'react'
// import { useDispatch } from 'react-redux'
// import {Link} from 'react-router-dom'
// import { incrementByAmount } from '../../redux/title'
import axios from 'axios';
import './search.css'


const Search = () => {
    //declaring states
    const [query, setQuery] = React.useState('')
    const [search, setSearch] = React.useState('');
    const [recipeList, setRecipeList] = React.useState([]);
    const [searchToggle, setSearchToggle] = React.useState(false);
    const [searchResults, setSearchResults] = React.useState([]);


    //storing the value of the search input in the state
    const searchHandler = () => {
        setSearch(query);
    };

    // //intializing redux state
    // const dispatch = useDispatch()
    // //fuction to pass title into store
    // const getTitle = (reqTitle) => {
    //     dispatch(incrementByAmount(reqTitle));
    // }

    //using useEffect to fetch data from the api
    useEffect(() => {
        //fetching results from the api
        if (search) {
            const result = async () => {
                const response = await axios.get(`http://localhost:5000/recipe/${search}`);
                const result = await response.data.recipe;
                setSearchResults(result);
            }
            result();
        }
    }, [search]);


    //using use effect to get list of top recipes from the api
    useEffect(() => {
        const result = async () => {
            const response = await axios.get(`http://localhost:5000/recipe/`);
            const result = await response.data.recipes;
            return result
        }
        result().then(result => {
            setRecipeList(result)
        })
    }, []);

    return (
        <>
            <div className="searchWrapper">
                <div className="search">
                    <div className="searchInput">
                        <input id='searchTerm' type="text" placeholder="Search for any recipe" onChange={(val) => setQuery(val.target.value)} />
                    </div>
                    <div className="searchIcon">
                        <div className='searchButton' id='searchIcon' type="submit" onClick={() => { searchHandler(); setSearchToggle(true) }}>Search</div>
                    </div>
                </div>
            </div >
            <div className="topRecipes">
                Top Recipes 
            </div>
            <div className="searchResults">
                {!searchToggle ?
                    <>
                        {recipeList.map((recipe, index) => {
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
                                        <div className="readOption">
                                            Read
                                            {/* <Link to= '/read'>Read</Link> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                    :
                    <>
                        {searchResults?.map((result, key) => {
                             console.log("at search",result)
                            return (
                                //return data in leaflet from
                                <div className="resultWrapper" key={key}>
                                    <div className="searchResult" >
                                        <div className="thumbnail">
                                            <img src={result.image} alt="thumbnail" />
                                        </div>
                                        <div className="searchResultTitle">
                                            {result.title}
                                        </div>
                                        <div className="searchResultDescription" >
                                            {result.description}
                                        </div>
                                        <div className="readOption">
                                            Read
                                            {/* <Link to= '/read'>Read</Link> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                }
            </div>
        </>
    )
}

export default Search