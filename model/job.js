const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema({
    name: {
        type: String,
        required: true

    },
    employer: {
        type: Schema.Types.ObjectID,
        ref: 'Employer'
    }


});

module.exports = mongoose.model('Job', jobSchema);
