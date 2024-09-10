const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    accountID: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['doctor', 'nurse', 'patient'],
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;