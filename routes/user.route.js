const express = require('express');
const { getSignUp, postSignUp, getLogin, postLogin, logout } = require('../controllers/users.controller');
const passport = require('passport');
const { saveUrl } = require('../middleware/middleware.js');
const router = express.Router();

router.route('/signup')
//Redirect to the signup page:
.get(getSignUp)
//After register the user:
.post(postSignUp);

router.route('/login')
//Redirect to the login page:
.get(getLogin)
//After user login:
.post(saveUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), postLogin);

//When user logout:
router.get('/logout', logout);

module.exports = router;

