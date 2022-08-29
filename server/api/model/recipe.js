const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    _id :  mongoose.Schema.Types.ObjectId,
    author: {type  : String , required  : true},
    title: {type  : String , required  : true},
    description: {type  : String , required  : true},
    ingredients: {type  : String , required  : true},
    directions: {type  : String , required  : true},
    image: {type  : String , required  : true},
});

module.exports = mongoose.model('Recipe', recipeSchema);
