const User = require('../models/user');
const Alumni = require('../models/alumni');
const Staff = require('../models/staff');
const Event = require('../models/event');
const Job = require('../models/job');
const Testimonial = require('../models/testimonial');
const Student = require('../models/student');

module.exports.showDashboard = async (req, res) => {
    try {
        // Count totals
        const totalUsers = await User.countDocuments();
        const totalAlumni = await Alumni.countDocuments();
        const totalStudents = await Student.countDocuments();
        const totalStaff = await Staff.countDocuments();
        const totalEventsHeld = await Event.countDocuments({ date: { $lt: new Date() } });
        const totalUpcomingEvents = await Event.countDocuments({ date: { $gte: new Date() } });
        const totalJobListings = await Job.countDocuments();
        const totalTestimonials = await Testimonial.countDocuments();

        // Total donation money and money spent
        const totalDonationMoney = 160000;
        const totalDonationSpent = 58000;

        // Aggregate user registrations by date
        const userRegistrationData = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Aggregate jobs by category
        const jobCategoryData = await Job.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 } // Count the number of jobs per category
                }
            },
            {
                $sort: { count: -1 } // Optional: Sort by count descending
            }
        ]);

        // Render the dashboard view and pass the data
        res.render('staff/dashboard', {
            totalUsers,
            totalAlumni,
            totalStudents,
            totalStaff,
            totalEventsHeld,
            totalUpcomingEvents,
            totalJobListings,
            totalTestimonials,
            totalDonationMoney,
            totalDonationSpent,
            userRegistrationData,  // Pass user registration data for the graph
            jobCategoryData
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};
