const mongoose = require('mongoose')

const alumniSchema = new mongoose.Schema({
    name: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    major: { type: String, required: true },
    currentPosition: { type: String, required: true },
    bio: { type: String },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})

module.exports = mongoose.model('Alumni', alumniSchema)