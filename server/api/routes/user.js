const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

//signup route
router.post('/signup', (req, res, next) => {
    //usning regex to check if the email is valid
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
            message: 'Invalid email address'
        });
    }
    //check if user already exists
    User.find({ email: req.body.data.email }).exec().then(user => {
        if (user.length >= 1) {
            return res.status(200).json({
                message: 'Email already exists'
            });
        } else {
            //user does not exist, create new user, 
            //using hashing algorithm to hash the password before saving it in the database
            bcrypt.hash(req.body.data.password, 10, (err, hash) => {
                if (err) {
                    console.log("error in signing up", err)
                    res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.data.username,
                        email: req.body.data.email,
                        password: hash
                    });
                    user.save()
                        .then(result => {
                            //user created successfully
                            console.log(result);
                            res.status(201).json({
                                message: 'User created'
                            });
                        }).catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            });
        }
    })
});

//login route
router.post('/login', (req, res, next) => {
    console.log(req.body)
    User.find({ email: req.body.data.email }).exec().then(user => {
        if (user.length < 1) {
            console.log('User not found');
            return res.status(200).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.data.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(200).json({
                    message: 'Auth failed'
                });
            }
            if (result) {
                //user authenticated successfully
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY, {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: 'Auth successful',
                    username: user[0].username,
                    token: token
                });
            }
            res.status(200).json({
                message: 'Auth failed'
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


//deleting a user
router.delete("/", checkAuth, (req, res, next) => {
    console.log("in delete user")
    console.log(req.userId);
    User.find({ _id: req.userId }).remove().exec()
        .then(result => {
            //user deleted successfully
            console.log(result);
            res.status(200).json({
                message: 'User deleted'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});





module.exports = router