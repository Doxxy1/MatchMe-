const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const educationSchema = new Schema({
    level: {
        type: String,
        required: true

    },

    field: {
        type: String,
        required: true

    }


});

module.exports = mongoose.model('Education', educationSchema);