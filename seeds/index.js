const mongoose = require('mongoose');
const Alumni = require('../models/alumni'); // Adjust the path based on your project structure

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/vibelink')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Database connection error:', err);
});

// seed.js

const alumniData = [
    {
        name: "John Doe",
        graduationYear: 2020,
        fieldOfStudy: "Computer Science",
        email: "john.doe@example.com",
        location: "New York, NY",
        profession: "Software Engineer",
        successStory: "Developed a successful tech startup.",
        major: "Computer Science",
        currentPosition: "Lead Developer at TechCorp"
    },
    {
        name: "Jane Smith",
        graduationYear: 2019,
        fieldOfStudy: "Mechanical Engineering",
        email: "jane.smith@example.com",
        location: "San Francisco, CA",
        profession: "Mechanical Engineer",
        successStory: "Designed innovative robotics systems.",
        major: "Mechanical Engineering",
        currentPosition: "Senior Engineer at RoboInc"
    },
    {
        name: "Alice Johnson",
        graduationYear: 2021,
        fieldOfStudy: "Electrical Engineering",
        email: "alice.johnson@example.com",
        location: "Austin, TX",
        profession: "Electrical Engineer",
        successStory: "Led a project for renewable energy solutions.",
        major: "Electrical Engineering",
        currentPosition: "Project Manager at GreenEnergy"
    },
    {
        name: "Bob Brown",
        graduationYear: 2018,
        fieldOfStudy: "Civil Engineering",
        email: "bob.brown@example.com",
        location: "Chicago, IL",
        profession: "Civil Engineer",
        successStory: "Worked on major infrastructure projects.",
        major: "Civil Engineering",
        currentPosition: "Site Engineer at BuildCo"
    },
    {
        name: "Charlie Davis",
        graduationYear: 2017,
        fieldOfStudy: "Information Technology",
        email: "charlie.davis@example.com",
        location: "Seattle, WA",
        profession: "IT Consultant",
        successStory: "Provided IT solutions to Fortune 500 companies.",
        major: "Information Technology",
        currentPosition: "IT Consultant at SolutionsCorp"
    },
];

// Seed the database
const seedDB = async () => {
    await Alumni.deleteMany({}); // Clear the existing data
    await Alumni.insertMany(alumniData); // Insert seed data
    console.log('Database seeded successfully!');
    mongoose.connection.close(); // Close the connection
};

seedDB()