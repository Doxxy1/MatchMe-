const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companySchema = new Schema({
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
    logoUrl: {
        type: String

    }


});

module.exports = mongoose.model('Company', companySchema);
