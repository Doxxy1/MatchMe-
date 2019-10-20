const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true

    },
    password: {
        type: String,
        required: true

    },
    company: {
        type: Schema.Types.ObjectID,
        ref: 'Company'
    },
    jobSeeker: {
        type: Schema.Types.ObjectID,
        ref: 'JobSeeker'
    },
    isCompany: {
        type: Boolean,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    profilePictureUrl: {
        type: String

    }


});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
