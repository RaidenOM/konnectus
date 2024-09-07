const express = require('express')
const router = express.Router({mergeParams: true})
const dashboardController = require('../controllers/dashboardController')
const { isLoggedIn, isStaff } = require('../middleware')
const catchAsync = require('../utilites/catchAsync')



router.get('/', isLoggedIn, isStaff, catchAsync(dashboardController.showDashboard))

module.exports = router