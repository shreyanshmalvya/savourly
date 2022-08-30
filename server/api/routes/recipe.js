const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Recipe = require("../model/recipe");
const User = require("../model/user");
const checkAuth = require("../middleware/check-auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

//get request for all recipes in the database
router.get("/", (req, res, next) => {
  Recipe.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json({
        count: docs.length,
        recipes: docs.map((doc) => {
          //returning the recipe metadata
          return {
            _id: doc._id,
            author: doc.author,
            title: doc.title,
            description: doc.description,
            ingredients: doc.ingredients,
            directions: doc.directions,
            image: "https://savourly-v1.herokuapp.com/" + doc.image,
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//get request for a specific recipe
router.get("/:recipeName", (req, res, next) => {
  //searhcing for the recipe in the database
  Recipe.find({ title: req.params.recipeName })
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc.length > 0) {
        console.log(doc);
        // if recipe is found, return the recipe metadata
        res.status(200).json({
          message: "Recipe found by name",
          recipe: doc.map((doc) => {
            return {
              _id: doc._id,
              author: doc.author,
              title: doc.title,
              description: doc.description,
              ingredients: doc.ingredients,
              directions: doc.directions,
              image: "https://savourly-v1.herokuapp.com/" + doc.image,
            };
          }),
        });
      } else {
        //finding in basis if Ingredients as name did not give any results
        Recipe.find({ ingredients: req.params.recipeName })
          .exec()
          .then((doc) => {
            console.log("from second, if", doc);
            if (doc.length > 0) {
              //if recipe is found, return the recipe metadata
              res.status(200).json({
                message: "Recipe found based on Ingredients",
                recipe: doc.map((doc) => {
                  return {
                    _id: doc._id,
                    author: doc.author,
                    title: doc.title,
                    description: doc.description,
                    ingredients: doc.ingredients,
                    directions: doc.directions,
                    image: "https://savourly-v1.herokuapp.com/" + doc.image,
                  };
                }),
              });
            } else {
              //if recipe is not found, return error message
              res.status(404).json({
                message: "Recipe not found",
              });
            }
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//get read recipe data
router.get("/read/:recipeId", (req, res, next) => {
  Recipe.findById(req.params.recipeId)
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          recipe: [
            {
              _id: doc._id,
              author: doc.author,
              title: doc.title,
              description: doc.description,
              ingredients: doc.ingredients,
              directions: doc.directions,
              image: "https://savourly-v1.herokuapp.com/" + doc.image,
            },
          ],
        });
      } else {
        res.status(404).json({
          message: "Recipe not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//get request for recipes by a user
router.get("/user/:userName", checkAuth, (req, res, next) => {
  //searhcing for the recipe in the database
  Recipe.find({ author: req.params.userName })
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        //if recipe is found, return the recipe metadata
        res.status(200).json({
          message: "Recipe found by name",
          recipe: doc.map((doc) => {
            return {
              _id: doc._id,
              author: doc.author,
              title: doc.title,
              description: doc.description,
              ingredients: doc.ingredients,
              directions: doc.directions,
              image: "https://savourly-v1.herokuapp.com/" + doc.image,
            };
          }),
        });
      }
    });
});

//get request for a specific recipe by a user
router.get("/user/:userName/:recipeName", checkAuth, (req, res, next) => {
  //searhcing for the recipe in the database
  Recipe.find({ author: req.params.userName, title: req.params.recipeName })
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        //if recipe is found, return the recipe metadata
        res.status(200).json({
          message: "Recipe found by name",
          recipe: doc.map((doc) => {
            return {
              _id: doc._id,
              author: doc.author,
              title: doc.title,
              description: doc.description,
              ingredients: doc.ingredients,
              directions: doc.directions,
              image: doc.image,
            };
          }),
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//---------------------//

//post request for creating a new recipe
router.post("/", checkAuth, upload.single("image"), (req, res, next) => {
  const recipe = new Recipe({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    ingredients: req.body.ingredients,
    directions: req.body.directions,
    image: req.file.path,
  });
  recipe
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Recipe created",
        recipe: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//patch request for updating a recipe
router.patch(
  "/update/:recipeId",
  checkAuth,
  upload.single("image"),
  (req, res, next) => {
    console.log("here in patch");
    console.log(req.body);
    console.log(req.params.recipeId);
    Recipe.updateOne(
      { _id: req.params.recipeId },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          ingredients: req.body.ingredients,
          directions: req.body.directions,
        },
      }
    )
      .exec()
      .then((result) => {
        console.log(result);
        res.status(200).json({
          message: "Recipe updated",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }
);

//delete a recipe by user
router.delete("/:recipeName", checkAuth, (req, res, next) => {
  console.log(req.body.username);
  Recipe.find({ title: req.params.recipeName, author: req.body.username })
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc.length > 0) {
        console.log("found", doc);
        Recipe.deleteOne({ _id: doc[0]._id })
          .exec()
          .then((result) => {
            console.log(result);
            res.status(200).json({
              message: "Recipe deleted",
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      } else {
        res.status(404).json({
          message: "Recipe not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
