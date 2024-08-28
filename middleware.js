const Job = require('./models/job')
const Event = require('./models/event')
const Alumni = require('./models/alumni')

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
    const job = await Job.findById(id)
    if(job.postedBy.equals(req.user.id)) {
        next()
    }else {
        req.flash('error', 'You do not have permissions to do this')
        res.redirect(`/jobs/${id}`)
    }
}

module.exports.verifyStaffEventOwner = async (req, res, next)=>{
    const { id } = req.params
    const event = await Event.findById(id)
    if(!event.createdBy.equals(req.user.id)) {
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