module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in to complete this action')
        return res.redirect('/login')
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