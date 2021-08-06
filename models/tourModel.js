const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: [true, 'Tour name must be unique']
    },

    rating: {
        type: Number,
        default: 0
    },

    price: {
        type: Number,
        required: [true, 'Tours must have a price']
    }
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour