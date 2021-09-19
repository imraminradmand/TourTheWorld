const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },

    email: {
        type: String,
        required:[true, 'email is required'],
        unique: [true, 'account with this email already exists'],
        lowercase: true,
        validate: [validator.isEmail, 'please enter an email in valid format example@exmaple.ca']
    },

    photo: String,

    password: {
        type: String,
        required: [true, 'please create a password'],
        minlength: 8
    },

    passwordConfirmation: {
        type: String,
        required: [true, 'confirm your password']
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User