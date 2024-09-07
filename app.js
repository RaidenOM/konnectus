if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const localStrategy = require('passport-local');
const session = require('express-session');
const User = require('./models/user');
const ExpressError = require('./utilites/expressError');
const dbUrl = process.env.DB_URL
const alumniRoutes = require('./routes/alumni')
const eventRoutes = require('./routes/event')
const jobRoutes = require('./routes/job')
const userRoutes = require('./routes/user') 
const testimonialRoutes = require('./routes/testimonial')
const dashboardRoutes = require('./routes/dashboard')
const Testimonial = require('./models/testimonial')
const Event = require('./models/event')
const Job = require('./models/job')

//Connect to MongoDB
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

app.use('/alumni', alumniRoutes)
app.use('/', userRoutes)
app.use('/events', eventRoutes)
app.use('/jobs', jobRoutes)
app.use('/testimonial', testimonialRoutes)
app.use('/dashboard', dashboardRoutes)


app.get('/', async (req, res) => {
    const testimonials = await Testimonial.find()
        .populate({
            path: 'alumniId', // Populate alumniId
            populate: { // Populate the userId inside the alumniId
                path: 'userId', // Reference to User
                select: 'profilePicture name' // Select only necessary fields from User
            }
        })

        const events = await Event.find({}).populate('createdBy');

        const jobs = await Job.find({}).populate('postedBy');

    res.render('home', { testimonials, events, jobs });
});


app.get('/info', async (req, res) => {
    res.render('info');
});

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
