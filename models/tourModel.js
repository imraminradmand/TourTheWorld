const mongoose = require("mongoose")
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: [true, 'Tour name must be unique'],
        trim: true
    },

    duration: {
        type: Number,
        required: [true, 'Tour must have duration']
    },

    maxGroupSize: {
        type: Number,
        required: [true, 'Tour must have a group size']
    },

    difficulty: {
        type: String,
        required: [true, 'Tour must have a difficulty rating']
    },

    ratingsAverage: {
        type: Number,
        default: 4.5
    },

    ratingsQuantity: {
        type: Number,
        default: 0
    },

    price: {
        type: Number,
        required: [true, 'Tours must have a price']
    },

    priceDiscount: {
        type: Number
    },

    summary: {
        type: String,
        trim: true,
        required: [true, 'Tour must have a summary']
    },

    description: {
        type: String,
        trim: true
    },

    imageCover: {
        type: String,
        required: [true, 'Tour needs a cover image']
    },

    images: {
        type: [String]
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },

    startDates: {
        type: [Date]
    }, 

    slug: String,
}, {
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
})

//cannot use this in query as its just a virtual property
tourSchema.virtual('durationWeek').get(function() {
    return this.duration / 7
})

//Document middleware, this will be called before doc is saved, only on insert single
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true})
    next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour