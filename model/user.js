const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true

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
    }


});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
