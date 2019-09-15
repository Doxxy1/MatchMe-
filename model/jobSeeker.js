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
    competence: [
        {
            type : Schema.Types.ObjectID,
            ref: 'Competence'
        }
        ],

    location: {
        type: String,
        required: true

    },

    typeofwork: {
        type: Number,
        required: true

    },
    salary: {
        type: Number,
        required: true

    },
         
    completeJobMatch: [
        {
            type : Schema.Types.ObjectID,
            ref: 'Job'
        }
    ]



});

module.exports = mongoose.model('JobSeeker', jobSeekerSchema);