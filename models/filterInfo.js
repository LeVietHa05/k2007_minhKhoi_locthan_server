const mongoose = require('mongoose');

const filterInfoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    used: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isFinished: {
        type: Boolean,
        required: true
    },
    forPatient: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PatientInfo',
    }]
});

module.exports = mongoose.model('FilterInfo', filterInfoSchema);