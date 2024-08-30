const express = require('express')
const router = express.Router({mergeParams: true})
const { isLoggedIn, isAlumni, verifyOwnerAlumni} = require('../middleware')
const jobController = require('../controllers/jobController')
const catchAsync = require('../utilites/catchAsync')
const { validateJob } = require('../middleware')



router.get('/', catchAsync(jobController.showJobs));

router.get('/new', isLoggedIn, isAlumni, jobController.newJobForm);

router.get('/:id', isLoggedIn, catchAsync(jobController.showJob));

router.post('/', isLoggedIn, isAlumni, validateJob, catchAsync(jobController.createJob));

router.delete('/:id', isLoggedIn, isAlumni, catchAsync(verifyOwnerAlumni) , catchAsync(jobController.deleteJob));

module.exports = router