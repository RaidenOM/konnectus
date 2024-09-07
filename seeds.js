const mongoose = require('mongoose');
const User = require('./models/user');
const Alumni = require('./models/alumni');
const Staff = require('./models/staff');
const Student = require('./models/student');
const Event = require('./models/event');
const Job = require('./models/job');
const Testimonial = require('./models/testimonial');

// Use dotenv for environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Database connection
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl)
    .then(() => {
        console.log("Database Connected!");
    })
    .catch(err => {
        console.log("Database Connection Error!", err);
    });

const seedDatabase = async () => {
    await User.deleteMany({});
    await Alumni.deleteMany({});
    await Staff.deleteMany({});
    await Student.deleteMany({});
    await Job.deleteMany({});
    await Event.deleteMany({});
    await Testimonial.deleteMany({})

    const getRandomCategory = () => {
        const categories = ['Engineering', 'Marketing', 'Sales', 'Human Resources', 'Other'];
        const randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];
    };

    // Create users
    const usersData = [
        { username: 'john_doe', email: 'john@example.com', password: 'john123', role: 'alumni', profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg', createdAt: new Date('2024-04-01') },
        { username: 'jane_smith', email: 'jane@example.com', password: 'jane123', role: 'alumni', profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg', createdAt: new Date('2024-01-06') },
        { username: 'alex_johnson', email: 'alex@example.com', password: 'alex123', role: 'alumni', profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg', createdAt: new Date('2024-01-06') },
        { username: 'emily_white', email: 'emily@example.com', password: 'emily123', role: 'alumni', profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg', createdAt: new Date('2024-01-06') },
        { username: 'daniel_wilson', email: 'daniel@example.com', password: 'daniel123', role: 'alumni', profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg', createdAt: new Date('2024-04-01') },
        { username: 'mark_brown', email: 'mark@example.com', password: 'mark123', role: 'staff', profilePicture: 'https://randomuser.me/api/portraits/men/6.jpg', createdAt: new Date('2024-01-05') },
        { username: 'lisa_clark', email: 'lisa@example.com', password: 'lisa123', role: 'staff', profilePicture: 'https://randomuser.me/api/portraits/women/7.jpg', createdAt: new Date('2024-01-05') },
        { username: 'tom_jackson', email: 'tom@example.com', password: 'tom123', role: 'staff', profilePicture: 'https://randomuser.me/api/portraits/men/8.jpg', createdAt: new Date('2024-01-06') },
        { username: 'chris_miller', email: 'chris@example.com', password: 'chris123', role: 'student', profilePicture: 'https://randomuser.me/api/portraits/men/9.jpg', createdAt: new Date('2024-01-07') },
        { username: 'sarah_davis', email: 'sarah@example.com', password: 'sarah123', role: 'student', profilePicture: 'https://randomuser.me/api/portraits/women/10.jpg', createdAt: new Date('2024-04-01') },
    ];

    // Create users and set their passwords
    const createdUsers = [];
    for (const userData of usersData) {
        const user = new User(userData);
        await user.setPassword(userData.password); // Assuming setPassword hashes the password
        createdUsers.push(await user.save()); // Save user after setting the password
    }

    // Create alumni
    const alumni = [
        { name: 'John Doe', graduationYear: 2020, major: 'Computer Science', currentPosition: 'Software Engineer', bio: 'Passionate about technology and coding.', userId: createdUsers[0]._id, createdBy: createdUsers[0]._id },
        { name: 'Jane Smith', graduationYear: 2019, major: 'Business Administration', currentPosition: 'Marketing Manager', bio: 'Experienced in managing marketing campaigns.', userId: createdUsers[1]._id, createdBy: createdUsers[1]._id },
        { name: 'Alex Johnson', graduationYear: 2021, major: 'Electrical Engineering', currentPosition: 'Data Analyst', bio: 'Analytical thinker with strong problem-solving skills.', userId: createdUsers[2]._id, createdBy: createdUsers[2]._id },
        { name: 'Emily White', graduationYear: 2020, major: 'Graphic Design', currentPosition: 'Creative Director', bio: 'Expert in visual communication and design.', userId: createdUsers[3]._id, createdBy: createdUsers[3]._id },
        { name: 'Daniel Wilson', graduationYear: 2018, major: 'Psychology', currentPosition: 'Human Resources Specialist', bio: 'Focused on employee engagement and satisfaction.', userId: createdUsers[4]._id, createdBy: createdUsers[4]._id },
    ];

    const createdAlumni = await Alumni.insertMany(alumni);

    // Create staff
    const staffMembers = [
        { name: 'Mark Brown', currentPosition: 'Head of Alumni Relations', userId: createdUsers[5]._id },
        { name: 'Lisa Clark', currentPosition: 'Career Services Director', userId: createdUsers[6]._id },
        { name: 'Tom Jackson', currentPosition: 'Event Coordinator', userId: createdUsers[7]._id },
    ];

    const createdStaff = await Staff.insertMany(staffMembers);

    // Create students
    const students = [
        { name: 'Chris Miller', graduationYear: 2023, major: 'Mathematics', userId: createdUsers[8]._id },
        { name: 'Sarah Davis', graduationYear: 2024, major: 'Biology', userId: createdUsers[9]._id },
    ];

    const createdStudents = await Student.insertMany(students);

    // Create jobs
    const jobs = [
        { title: 'Software Engineer', description: 'Develop software solutions.', company: 'Tech Innovations', location: 'New York, NY', category: getRandomCategory(), postedBy: createdAlumni[0]._id }, // John Doe
        { title: 'Marketing Manager', description: 'Manage marketing strategies.', company: 'Marketing Gurus', location: 'Los Angeles, CA', category: getRandomCategory(), postedBy: createdAlumni[1]._id }, // Jane Smith
        { title: 'Data Analyst', description: 'Analyze data for business insights.', company: 'Data Insights', location: 'Chicago, IL', category: getRandomCategory(), postedBy: createdAlumni[2]._id }, // Alex Johnson
        { title: 'Creative Director', description: 'Lead creative projects.', company: 'Creative Solutions', location: 'San Francisco, CA', category: getRandomCategory(), postedBy: createdAlumni[3]._id }, // Emily White
        { title: 'Human Resources Specialist', description: 'Oversee recruitment processes.', company: 'HR Experts', location: 'Austin, TX', category: getRandomCategory(), postedBy: createdAlumni[4]._id }, // Daniel Wilson
    ];

    await Job.insertMany(jobs);

    // Create events with image URLs
    const events = [
        {
            title: 'Tech Conference 2024',
            description: 'Join us for a day of tech talks and networking.',
            date: new Date('2025-03-15'),
            location: 'Tech Center, San Francisco',
            createdBy: createdStaff[0]._id,
            image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg' // Add your image URL here
        },
        {
            title: 'Career Fair',
            description: 'Meet recruiters from top companies.',
            date: new Date('2025-04-10'),
            location: 'University Hall',
            createdBy: createdStaff[1]._id,
            image: 'https://images.pexels.com/photos/1181403/pexels-photo-1181403.jpeg' // Add your image URL here
        },
        {
            title: 'Alumni Networking Event',
            description: 'Reconnect with fellow alumni and share experiences.',
            date: new Date('2025-05-20'),
            location: 'Community Center',
            createdBy: createdStaff[2]._id,
            image: 'https://images.pexels.com/photos/3769740/pexels-photo-3769740.jpeg' // Add your image URL here
        },
        {
            title: 'Workshops on Resume Building',
            description: 'Enhance your resume with expert tips.',
            date: new Date('2024-06-25'),
            location: 'Career Services Office',
            createdBy: createdStaff[0]._id,
            image: 'https://images.pexels.com/photos/3184326/pexels-photo-3184326.jpeg' // Add your image URL here
        },
    ];

    await Event.insertMany(events);

    // Create testimonials
    const testimonials = [
        { alumniId: createdAlumni[0]._id, content: "This school changed my life!"},
        { alumniId: createdAlumni[1]._id, content: "I learned so much during my time here."},
        { alumniId: createdAlumni[2]._id, content: "The network I've built has been invaluable."},
        // Add more testimonials as needed
    ];

    await Testimonial.insertMany(testimonials);

    console.log('Database seeded!');
};

seedDatabase().then(() => {
    mongoose.connection.close();
});
