const mongoose = require('mongoose');

const patientInfoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    accountID: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    filterInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FilterInfo',
    },
    schedule: [{
        time: {
            type: String,
            required: true
        },
        dayOfWeek: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            required: true
        }
    }]
});

const PatientInfo = mongoose.model('PatientInfo', patientInfoSchema);

module.exports = PatientInfo;