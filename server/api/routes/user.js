const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

//signup route
router.post('/signup', (req, res, next) => {
    //check if user already exists
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'Email already exists'
            });
        } else {
            //user does not exist, create new user, 
            //using hashing algorithm to hash the password before saving it in the database
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
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
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
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
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth failed'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    });
});


//deleting a user
router.delete("/:userID", (req, res, next) => {
    User.find({ _id: req.params.userID }).remove().exec()
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