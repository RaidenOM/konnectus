const User = require('../models/user')
const Student = require('../models/student')
const Staff = require('../models/staff')
const Alumni = require('../models/alumni')
const cloudinary = require('cloudinary').v2

const DEFAULT_PROFILE_PICTURE = 'https://res.cloudinary.com/dnltrumxv/image/upload/v1725041443/Konnectus/tmvkfcg23qv8p5lckdkz.png'

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

module.exports.deleteProfile = async (req, res) => {
    const user = req.user

    if(user.profilePicture != DEFAULT_PROFILE_PICTURE) {
        const publicId = user.profilePicture.split('/').slice(7).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId); 
    }

    const role = user.role

    if(role==='student') {
        await Student.findOneAndDelete({userId: user.id})
    }else if(role==='staff') {
        await Staff.findOneAndDelete({userId: user.id})
    }else if(role==='alumni') {
        await Alumni.findOneAndDelete({userId: user.id})
    }

    await User.findByIdAndDelete(user.id)

    res.redirect('/')
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

        const profilePicture = req.file ? req.file.path : null;
        
        // Register the user and log them in
        const registeredUser = await User.register(user, password);

        //Add profile picture to registered user if provided
        if(profilePicture) {
            registeredUser.profilePicture = profilePicture
            await registeredUser.save()
        }
        
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
