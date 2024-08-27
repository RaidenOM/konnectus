if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const Alumni = require('./models/alumni');
const Student = require('./models/student');
const Staff = require('./models/staff');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const localStrategy = require('passport-local');
const session = require('express-session');
const User = require('./models/user');
const ExpressError = require('./utilites/expressError');
const catchAsync = require('./utilites/catchAsync');
const { storeReturnTo, isLoggedIn, isStaff, isAlumni } = require('./middleware');
const Event = require('./models/event')
const Job = require('./models/job');
const dbUrl = process.env.DB_URL

// 3. Connect to MongoDB
mongoose.connect(dbUrl)
    .then(() => {
        console.log('connected to database');
    })
    .catch((err) => {
        console.log(err);
    });

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!',
    },
});

const sessionConfig = {
    store,
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },
};

// Initialize Express App
const app = express();

// Set View Engine
app.engine('ejs', require('ejs-mate')); // Use EJS-mate for layout support
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SESSION AND FLASH
app.use(session(sessionConfig));
app.use(flash());

// PASSPORT SETUP
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware Setup
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(methodOverride('_method')); // Support for PUT and DELETE methods
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/profile', isLoggedIn, catchAsync(async (req, res) => {
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
}));

app.get('/alumni', catchAsync(async (req, res) => {
    const alumnis = await Alumni.find({});
    res.render('alumni/listAlumni', { alumnis });
}));

app.get('/alumni/new', isStaff, (req, res) => {
    res.render('alumni/createAlumni');
});

app.get('/alumni/:id/edit', isStaff, catchAsync(async (req, res) => {
    const { id } = req.params;
    const alumni = await Alumni.findById(id);
    res.render('alumni/editAlumni', { alumni });
}));

app.get('/alumni/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const alumni = await Alumni.findById(id);
    res.render('alumni/showAlumni', { alumni });
}));

app.post('/alumni', isStaff, catchAsync(async (req, res) => {
    const { username, password, email, name, currentPosition, graduationYear, major, bio} = req.body.alumni
    const user = new User({username, email})
    const registeredUser = await User.register(user, password)
    const alumni = new Alumni({userId: user.id, username, currentPosition, graduationYear, major, bio, name})

    await user.save()
    await alumni.save()

    req.flash('success', 'Alumni created successfully!'); // Added flash message
    res.redirect('/alumni');
}));

app.delete('/alumni/:id', isStaff, catchAsync(async (req, res) => {
    const { id } = req.params;

    // Find the alumni by ID
    const alumni = await Alumni.findById(id);

    if (!alumni) {
        req.flash('error', 'Alumni not found');
        return res.redirect('/alumni');
    }

    // Delete the associated user
    await User.findByIdAndDelete(alumni.userId);

    // Delete the alumni
    await Alumni.findByIdAndDelete(id);

    req.flash('success', 'Alumni and associated user deleted successfully!');
    res.redirect('/alumni');
}));

app.put('/alumni/:id', isStaff, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Alumni.findByIdAndUpdate(id, req.body.alumni);
    req.flash('success', 'Alumni updated successfully!'); // Added flash message
    res.redirect(`/alumni/${id}`);
}));

// USER ROUTES
app.get('/login', (req, res) => {
    res.render('users/login');
});

app.get('/register', (req, res) => {
    res.render('users/register');
});

app.post('/register', catchAsync(async (req, res) => {
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
            req.flash('success', 'Welcome to Vibelink!');
            res.redirect('/alumni');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

app.post('/login', storeReturnTo, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
}), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/alumni'; // Fixed the route name
    res.redirect(redirectUrl);
});

app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
});

//EVENT ROUTES
app.get('/events', async (req, res) => {
    const events = await Event.find({});
    res.render('events/listEvents', { events });
});

app.get('/events/new', isLoggedIn, isStaff, (req, res) => {
    res.render('events/createEvent');
});

app.post('/events', async (req, res) => {
    const { title, description, date, location } = req.body.event;
    const event = new Event({ title, description, date, location, createdBy: req.user._id });
    await event.save();
    req.flash('success', 'Event created successfully!');
    res.redirect('/events');
});

app.get('/events/:id/edit', isLoggedIn, isStaff, async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
        req.flash('error', 'Event not found!');
        return res.redirect('/events');
    }
    res.render('events/editEvent', { event });
});

app.put('/events/:id', isLoggedIn, isStaff, async (req, res) => {
    const { id } = req.params;
    const { title, description, date, location } = req.body.event;
    const event = await Event.findByIdAndUpdate(id, { title, description, date, location });
    if (!event) {
        req.flash('error', 'Event not found!');
        return res.redirect('/events');
    }
    req.flash('success', 'Event updated successfully!');
    res.redirect(`/events`);
});

app.delete('/events/:id', isLoggedIn, isStaff, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    req.flash('success', 'Event deleted successfully!');
    res.redirect('/events');
}));

//JOB ROUTES
app.get('/jobs', catchAsync(async (req, res) => {
    const jobs = await Job.find({}).populate('postedBy', 'name'); // Populate the alumni's name
    console.log(jobs);
    res.render('jobs/listJobs', { jobs });
}));

app.get('/jobs/new', isLoggedIn, isAlumni, (req, res) => {
    res.render('jobs/createJob');
});

app.get('/jobs/:id', isLoggedIn, catchAsync(async (req, res) => {
    const job = await Job.findById(req.params.id).populate('postedBy');
    if (!job) {
        req.flash('error', 'Job not found!');
        return res.redirect('/jobs');
    }
    res.render('jobs/viewJob', { job, user: req.user});
}));

app.post('/jobs', isLoggedIn, isAlumni, catchAsync(async (req, res) => {
    const { title, description, company, location } = req.body.job;
    const alumni = await Alumni.findOne({userId: req.user.id})
    console.log(alumni)
    console.log(req.user)
    const job = new Job({
        title,
        description,
        company,
        location,
        postedBy: alumni.id
    });
    await job.save();
    req.flash('success', 'Job posted successfully!');
    res.redirect('/jobs');
}));

app.delete('/jobs/:id', isLoggedIn, isAlumni, catchAsync(async (req, res) => {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
        req.flash('error', 'Job not found!');
        return res.redirect('/jobs');
    }
    req.flash('success', 'Job deleted successfully!');
    res.redirect('/jobs');
}));

// HANDLE ALL ROUTES
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    const { message, status = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(status).render('error', { err });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
