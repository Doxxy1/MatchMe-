const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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
        required: true,
        unique: true

    },
    logoUrl: {
        type: String

    }


});
companySchema.plugin(uniqueValidator);
module.exports = mongoose.model('Company', companySchema);
