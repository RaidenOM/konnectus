const User = require('../models/user')
const Student = require('../models/student')
const Staff = require('../models/staff')
const Alumni = require('../models/alumni')


module.exports.userProfile = async (req, res) => {
    const user = req.user; // Get the logged-in user
    let userDetails;

    if (user.role === 'student') {
        userDetails = await Student.findOne({ userId: user._id }).populate('userId');
    } else if (user.role === 'staff') {
        userDetails = await Staff.findOne({ userId: user._id }).populate('userId');
    } else if (user.role === 'alumni') {
        userDetails = await Alumni.findOne({ userId: user._id }).populate('userId');
    }

    res.render('users/profile', { user, userDetails });
}


module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password, role, student, staff } = req.body;
        const user = new User({ username, email, role });
        
        // Register the user and log them in
        const registeredUser = await User.register(user, password);
        
        // Create specific user type based on role
        if (role === 'student') {
            const studentData = new Student({
                userId: registeredUser._id,
                name: student.name,
                graduationYear: student.graduationYear,
                major: student.major
            });
            await studentData.save();
        } else if (role === 'staff') {
            const staffData = new Staff({
                userId: registeredUser._id,
                name: staff.name,
                currentPosition: staff.currentPosition
            });
            await staffData.save();
        }

        // Log in the registered user
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Konnectus!');
            res.redirect('/alumni');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}


module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/alumni'; // Fixed the route name
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
}
