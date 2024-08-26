const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    graduationYear: {
        type: Number,
        required: true,
    },
    major: {
        type: String,
        required: true,
        trim: true,
    }
})

module.exports = mongoose.model('Student', studentSchema)