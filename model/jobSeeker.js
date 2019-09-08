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

    education: [
        {
            type : Schema.Types.ObjectID,
            ref: 'Education'
        }
    ],
    completeJobMatch: [
        {
            type : Schema.Types.ObjectID,
            ref: 'Job'
        }
    ]




});

module.exports = mongoose.model('JobSeeker', jobSeekerSchema);