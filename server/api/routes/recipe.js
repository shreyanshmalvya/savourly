const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const Recipe = require('../model/recipe');
const User = require('../model/user');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

//get request for all recipes in the database
router.get('/', (req, res, next) => {
    Recipe.find().exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                count: docs.length,
                recipes: docs.map(doc => {
                    //returning the recipe metadata 
                    return {
                        _id: doc._id,
                        author: doc.author,
                        title: doc.title,
                        description: doc.description,
                        ingredients: doc.ingredients,
                        directions: doc.directions,
                        image: doc.image,
                    }
                })
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        });
});

//get request for a specific recipe
router.get('/:recipeName', (req, res, next) => {
    //searhcing for the recipe in the database
    Recipe.find({ title: req.params.recipeName }).exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                //if recipe is found, return the recipe metadata
                res.status(200).json({
                    message: "Recipe found by name",
                    recipe: doc.map(doc => {
                        return {
                            _id: doc._id,
                            author: doc.author,
                            title: doc.title,
                            description: doc.description,
                            ingredients: doc.ingredients,
                            directions: doc.directions,
                            image: doc.image,
                        }
                    })
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    //finding in basis if Ingredients
    Recipe.find({ ingredients: req.params.recipeName }).exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                //if recipe is found, return the recipe metadata
                res.status(200).json({
                    message: 'Recipe found based on Ingredients',
                    recipe: doc.map(doc => {
                        return {
                            _id: doc._id,
                            author: doc.author,
                            title: doc.title,
                            description: doc.description,
                            ingredients: doc.ingredients,
                            directions: doc.directions,
                            image: doc.image,
                        }
                    })
                });
            }
        }).catch(err => { });

});

//get request for recipes by a user
router.get('/:userName', checkAuth, (req, res, next) => {
    //searhcing for the recipe in the database
    Recipe.find({ author: req.params.userName }).exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                //if recipe is found, return the recipe metadata
                res.status(200).json({
                    message: "Recipe found by name",
                    recipe: doc.map(doc => {
                        return {
                            _id: doc._id,
                            author: doc.author,
                            title: doc.title,
                            description: doc.description,
                            ingredients: doc.ingredients,
                            directions: doc.directions,
                            image: doc.image,
                        }
                    })
                });
            }
        })

});

//get request for a specific recipe by a user
router.get('/:userName/:recipeName', checkAuth, (req, res, next) => {
    //searhcing for the recipe in the database
    Recipe.find({ author: req.params.userName, title: req.params.recipeName }).exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                //if recipe is found, return the recipe metadata
                res.status(200).json({
                    message: "Recipe found by name",
                    recipe: doc.map(doc => {
                        return {
                            _id: doc._id,
                            author: doc.author,
                            title: doc.title,
                            description: doc.description,
                            ingredients: doc.ingredients,
                            directions: doc.directions,
                            image: doc.image,
                        }
                    })
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
})

//---------------------//

//post request for creating a new recipe
router.post('/', checkAuth, upload.single('image'), (req, res, next) => {
    User.findById(req.userData.userId).then(user => {
        if (!user) {
            console.log("failed")
            // return res.status(401).json({
            //     message: 'Auth failed'
            // });
        } else {
            console.log(user)
            const recipe = new Recipe({
                _id: new mongoose.Types.ObjectId(),
                author: user.author,
                title: req.body.title,
                description: req.body.description,
                ingredients: req.body.ingredients,
                directions: req.body.directions,
                image: req.file.path
            });
            recipe.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Recipe created'
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                })
        }

    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
})

//patch request for updating a recipe
router.patch('/:recipeName', checkAuth, upload.single('image'), (req, res, next) => {
    Recipe.updateOne({ title: req.params.recipeName }, { $set: { title: req.body.title, description: req.body.description, ingredients: req.body.ingredients, directions: req.body.directions, image: req.file.path } })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Recipe updated'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//delete a recipe by user
router.delete('/:recipeName', checkAuth, (req, res, next) => {
    Recipe.remove({ title: req.params.recipeName, author: req.userData.userId })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'Recipe deleted'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;