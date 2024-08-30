const express = require('express')
const router = express.Router({mergeParams: true})
const eventController = require('../controllers/eventController')
const { isLoggedIn, isStaff, verifyStaffEventOwner } = require('../middleware')
const catchAsync = require('../utilites/catchAsync')
const { validateEvent } = require('../middleware')


router.get('/', catchAsync(eventController.showEvents));

router.get('/new', isLoggedIn, isStaff, eventController.newEventForm);

router.post('/', isLoggedIn, isStaff, validateEvent, catchAsync(eventController.createEvent));

router.get('/:id/edit', isLoggedIn, isStaff, catchAsync(verifyStaffEventOwner), catchAsync(eventController.editEventForm));

router.put('/:id', isLoggedIn, isStaff, validateEvent, catchAsync(verifyStaffEventOwner), catchAsync(eventController.updateEvent));

router.delete('/:id', isLoggedIn, isStaff, catchAsync(verifyStaffEventOwner), catchAsync(eventController.deleteEvent));

module.exports = router
