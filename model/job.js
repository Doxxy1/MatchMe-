const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema({
    name: {
        type: String,
        required: true

    }


});

module.exports = mongoose.model('Job', jobSchema);
