const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, require: true},
    type: {type: String, require: true},
    userId: {type: Number, require: true}
});

module.exports = mongoose.model('Service', serviceSchema);