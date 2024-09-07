const Job = require('./models/job')
const Event = require('./models/event')
const Alumni = require('./models/alumni')
const Joi = require('joi')
const ExpressError = require('./utilites/expressError')
const Testimonial = require('./models/testimonial')

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in to complete this action')
        return res.redirect('/login')
    }
    next()
}

module.exports.verifyOwnerAlumni = async (req, res, next)=>{
    const { id } = req.params
    const job = await Job.findById(id).populate('postedBy')
    if(job.postedBy.userId.equals(req.user.id)) {
        next()
    }else {
        req.flash('error', 'You do not have permissions to do this')
        res.redirect(`/jobs/${id}`)
    }
}

module.exports.verifyStaffEventOwner = async (req, res, next)=>{
    const { id } = req.params
    const event = await Event.findById(id).populate('createdBy')
    if(!event.createdBy.userId.equals(req.user.id)) {
        req.flash('error', 'You do not have permissions to do this')
        return res.redirect(`/events`)
    }
    next()
}

module.exports.verifyStaffAlumniOwner = async (req, res, next)=>{
    const { id } = req.params
    const alumni = await Alumni.findById(id)
    if(!alumni.createdBy.equals(req.user.id)) {
        req.flash('error', 'You do not have permissions to do this')
        return res.redirect(`/alumni/${id}`)
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
        delete req.session.returnTo; // Clear the returnTo after using it
    }
    next();
};

module.exports.isStaff = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== 'staff') {
        req.flash('error', 'You do not have permission to access this page.');
        return res.redirect('/'); // Redirect to the home page or another route
    }
    next(); // User is staff, proceed to the next middleware/route handler
};

module.exports.isAlumni = (req, res, next) => {
    if(!req.isAuthenticated() || req.user.role !== 'alumni') {
        req.flash('error', 'You do not have permission to access this page')
        return res.redirect('/')
    }
    next()
}

module.exports.validateEvent = (req, res, next) => {
    const eventSchema = Joi.object({
        event: Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            date: Joi.date().required(),
            location: Joi.string().required(),
        })
    }).required()

    const { error } = eventSchema.validate(req.body)
    if(error) {
        const message = error.details.map(e => e.message).join(',')
        throw new ExpressError(message, 400)
    }else {
        next()
    }
}

module.exports.validateJob = (req, res, next) => {
    const jobSchema = Joi.object({
        job: Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            company: Joi.string().required(),
            location: Joi.string().required(),
            category: Joi.string().required()
        })
    }).required()

    const { error } = jobSchema.validate(req.body)
    if(error) {
        const message = error.details.map(e => e.message).join(',')
        throw new ExpressError(message, 400)
    }else {
        next()
    }
}

module.exports.validateAlumni = (req, res, next) => {
    const alumniSchema = Joi.object({
        alumni: Joi.object({
            username: Joi.string().required(),
            name: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.string().email().required(),
            graduationYear: Joi.string().pattern(/^\d{4}$/).required(),
            major: Joi.string().required(),
            currentPosition: Joi.string().required(),
            bio: Joi.string().required()
        })
    }).required()

    const { error } = alumniSchema.validate(req.body)
    if(error) {
        const message = error.details.map(e => e.message).join(',')
        throw new ExpressError(message, 400)
    }else {
        next()
    }
}

module.exports.validateTestimonial = (req, res, next) => {
    const testimonialSchema = Joi.object({
        testimonial: Joi.object({
            content: Joi.string().required()
        })
    }).required()

    const { error } = testimonialSchema.validate(req.body)
    if(error) {
        const message = error.details.map(e => e.message).join(',')
        throw new ExpressError(message, 400)
    }else {
        next()
    }
}

module.exports.isAlumniTestimonialOwner = async (req, res, next) => {
    const { id } = req.params
    const testimonial = await Testimonial.findById(id).populate('alumniId')
    if(!testimonial.alumniId.userId.equals(req.user.id)) {
        req.flash('error', 'You do not have permissions to do this')
        return res.redirect(`/testimonial`)
    }
    next()
}