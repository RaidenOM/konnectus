const mongoose = require('mongoose')

const staffSchema = new mongoose.Schema({
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
    currentPosition: {
        type: String,
        required: true,
        trim: true,
    }
})

module.exports = mongoose.model('Staff', staffSchema)