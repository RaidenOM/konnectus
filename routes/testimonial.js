const express = require('express')
const router = express.Router({mergeParams: true})
const testimonialController = require('../controllers/testimonialController')
const { isLoggedIn, isAlumni, isAlumniTestimonialOwner, validateTestimonial } = require('../middleware')
const catchAsync = require('../utilites/catchAsync')

router.get('/', catchAsync(testimonialController.showTestimonials))
router.get('/new', isLoggedIn, isAlumni, testimonialController.newTestimonialForm)
router.get('/:id/edit', isLoggedIn, isAlumni, catchAsync(isAlumniTestimonialOwner), catchAsync(testimonialController.editTestimonialForm))
router.post('/', isLoggedIn, isAlumni, validateTestimonial, catchAsync(testimonialController.createTestimonial))
router.delete('/:id', isLoggedIn, isAlumni, catchAsync(isAlumniTestimonialOwner), catchAsync(testimonialController.deleteTestimonial))
router.put('/:id', isLoggedIn, isAlumni, catchAsync(isAlumniTestimonialOwner), validateTestimonial, catchAsync(testimonialController.updateTestimonial))

module.exports = router