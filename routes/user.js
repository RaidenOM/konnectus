const express = require('express')
const router = express.Router({mergeParams: true})
const userController = require('../controllers/userController');
const { isLoggedIn, storeReturnTo } = require('../middleware');
const catchAsync = require('../utilites/catchAsync')
const passport = require('passport')

router.get('/profile', isLoggedIn, userController.userProfile)

router.get('/login', userController.loginForm);

router.get('/register', userController.registerForm);

router.post('/register', catchAsync(userController.registerUser));

router.post('/login', storeReturnTo, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
}), userController.loginUser);

router.get('/logout', userController.logoutUser);

module.exports = router