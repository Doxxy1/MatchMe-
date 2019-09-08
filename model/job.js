const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema({
    name: {
        type: String,
        required: true

    },
    company: {
        type: Schema.Types.ObjectID,
        ref: 'Company'
    },

    education: [
        {
            type : Schema.Types.ObjectID,
            ref: 'Education'
        }
    ],

    description: {
        type: String,
        required: true

    },
    jobSeekerInterest: [
        {
            type : Schema.Types.ObjectID,
            ref: 'User'
        }
    ],
    companyInterest: [
        {
            type : Schema.Types.ObjectID,
            ref: 'User'
        }
    ]



});

module.exports = mongoose.model('Job', jobSchema);
