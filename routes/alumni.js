const express = require('express')
const router = express.Router({mergeParams: true})
const { isLoggedIn, isStaff, verifyStaffAlumniOwner } = require('../middleware')
const alumniController = require('../controllers/alumniController')
const catchAsync = require('../utilites/catchAsync')

router.get('/', catchAsync(alumniController.showAlumnis));

router.get('/new', isLoggedIn, isStaff, alumniController.newAlumniForm);

router.get('/:id/edit', isLoggedIn, isStaff, catchAsync(verifyStaffAlumniOwner), catchAsync(alumniController.editAlumniForm));

router.get('/:id', catchAsync(alumniController.showAlumni));

router.post('/', isLoggedIn, isStaff, catchAsync(alumniController.createAlumni));

router.delete('/:id', isLoggedIn, isStaff, catchAsync(verifyStaffAlumniOwner), catchAsync(alumniController.deleteAlumni));

router.put('/:id', isLoggedIn, isStaff, catchAsync(verifyStaffAlumniOwner), catchAsync(alumniController.updateAlumni));

module.exports = router