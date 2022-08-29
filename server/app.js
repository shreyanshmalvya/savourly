const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

//creating routes for scalabe architechure
const recipieRoute = require('./api/routes/recipe');
const userRoute = require('./api/routes/user');

//mongoose connection request
mongoose.connect(`mongodb+srv://savourly:${process.env.MONGO_PASS}@savourly.sqa6rxf.mongodb.net/?retryWrites=true&w=majority`);

//using bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

//handling CORS errors by adding headers
app.use((req,res,next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    //for options request
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, DELETE, POST')
    }
    next();
});

//forwarding routes 
app.use('/recipe', recipieRoute);
app.use('/user', userRoute);

//handling errors 404 and 500 errors and sending a response
app.use((req, res,next) =>{
    const error = new Error();
    error.status = 404;
    next(error);
});

// a funnel for all other errors !404 
app.use((error, req, res, next)=>{
    res.status = error.status || 500;
    res.json({
        error : error.message
    });
});


module.exports = app;