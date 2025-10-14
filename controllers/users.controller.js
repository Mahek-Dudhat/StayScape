const express = require('express');
const wrapAsync = require('../utils/wrapAsync.js');
const User = require('../models/user.model.js');
const saveUrl = require('../middleware/middleware.js');
const ExpressError = require('../ExpressError.js');


//Redirect to the signup page:
const getSignUp = (req, res) => {
    res.render('./users/signup.ejs');
}

//After register the user:
const postSignUp = wrapAsync(async (req, res, next) => {

    try {
        let { username, email, password } = req.body;

        let newUser = new User({ username, email });

        let registredUser = await User.register(newUser, password);

        if (registredUser) {
            req.login(registredUser, (err) => {
                if (err) {
                    
                    //  req.flash('err', "Invalid username or password!");
                    req.flash('err', "Login failed after registration!");
                    return res.redirect('/login');
                }
                req.session.name = username;
                req.flash('scsmsg', `Welcome back to Airbnb, ${username}!`);
                res.redirect('/listing');
            })
        }
    } catch (e) {
        req.flash('err', e.message);
        res.redirect('/signup');
    }

})

//Redirect to the login page:
const getLogin = (req, res) => {
    res.render('./users/login.ejs');
}

//After user login:
const postLogin = async (req, res, next) => {

    //console.log(req.path + " " + req.originalUrl);

    req.flash('scsmsg', `Welcome back! ${req.user.username}`);
    res.redirect(res.locals.redirectTo || '/listing');
    // res.send('Welcome back!');
}

//When user logout:
const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('scsmsg', 'You are logged out now!');
        res.redirect('/listing');
    })
}

module.exports = { getSignUp, postSignUp, getLogin, postLogin, logout };
