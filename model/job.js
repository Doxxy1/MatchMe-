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
    ]


});

module.exports = mongoose.model('Job', jobSchema);
