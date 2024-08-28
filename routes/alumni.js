const express = require('express')
const router = express.Router({mergeParams: true})
const {isStaff} = require('../middleware')
const alumniController = require('../controllers/alumniController')
const catchAsync = require('../utilites/catchAsync')

router.get('/', catchAsync(alumniController.showAlumnis));

router.get('/new', isStaff, alumniController.newAlumniForm);

router.get('/:id/edit', isStaff, catchAsync(alumniController.editAlumniForm));

router.get('/:id', catchAsync(alumniController.showAlumni));

router.post('/', isStaff, catchAsync(alumniController.createAlumni));

router.delete('/:id', isStaff, catchAsync(alumniController.deleteAlumni));

router.put('/:id', isStaff, catchAsync(alumniController.updateAlumni));

module.exports = router