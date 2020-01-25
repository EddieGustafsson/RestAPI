const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    userId: Number
});

module.exports = mongoose.model('Service', serviceSchema);