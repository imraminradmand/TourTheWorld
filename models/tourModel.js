const mongoose = require("mongoose")
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: [true, 'Tour name must be unique'],
        maxLength: [40, 'Tour name must be less than 40 characters'],
        minLength: [10, 'Tour name must be more than 10 characters'],
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
        required: [true, 'Tour must have a difficulty rating'],
        enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'please choose from easy, medium, or difficult'
        }
    },

    ratingsAverage: {
        type: Number,
        default: 4.5,
        max: [5, 'cannot have a rating above 5'],
        min: [1, 'cannot have a rating below 1']
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
        type: Number,
        validate: {
            validator: function(value) {
                return value < this.price
            },
            message: 'Discount cannot be more than original price'
        }
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

    slug: {
        type: String,
    },

    secretTour: {
        type: Boolean,
        default: false
    }
    }, 
    {
        toJSON: { virtuals: true},
        toObject: { virtuals: true}
    }

)

//cannot use this in query as its just a virtual property
tourSchema.virtual('durationWeek').get(function() {
    return this.duration / 7
})

//Document middleware, this will be called before doc is saved, only on insert single
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true})
    next()
})

//Query middleware 
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true }})
    next()
})

//Aggregation middleware
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true }}})
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour