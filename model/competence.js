const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const competenceSchema = new Schema({
    skill: {
        type: String,
        required: true

    },

    level: {
        type: String,
        required: true

    }


});

module.exports = mongoose.model('Competence', competenceSchema);