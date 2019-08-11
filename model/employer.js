const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employerSchema = new Schema({
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

    jobsListed: [
        {
            type: Schema.Types.ObjectID,
            ref: 'Job'
        }
    ]

});

module.exports = mongoose.model('Employer', employerSchema);
