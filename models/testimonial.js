const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema({
    alumniId: { // Reference to the alumni giving the testimonial
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumni',
        required: true
    },

    content: {
        type: String,
        required: true,
        trim: true
    }


}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
})

module.exports = mongoose.model('Testimonial', testimonialSchema);