const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSeekerSchema = new Schema({
    name: {
        type: String,
        required: true

    },

    phone: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true

    },
    description: {
        type: String,
        required: true

    }

});

module.exports = mongoose.model('JobSeeker', jobSeekerSchema);
