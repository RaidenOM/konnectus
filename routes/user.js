const express = require('express')
const router = express.Router({mergeParams: true})
const userController = require('../controllers/userController');
const { isLoggedIn, storeReturnTo } = require('../middleware');
const catchAsync = require('../utilites/catchAsync')
const passport = require('passport')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })

router.get('/profile', isLoggedIn, userController.userProfile)

router.delete('/profile', isLoggedIn, userController.deleteProfile)

router.get('/login', userController.loginForm);

router.get('/register', userController.registerForm);

router.post('/register', upload.single('profilePicture'), catchAsync(userController.registerUser));

router.post('/login', storeReturnTo, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
}), userController.loginUser);

router.get('/logout', userController.logoutUser);

module.exports = router