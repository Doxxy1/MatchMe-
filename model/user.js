const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
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
    }


});

module.exports = mongoose.model('User', userSchema);
