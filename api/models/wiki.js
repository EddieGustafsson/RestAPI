const mongoose = require('mongoose');

const wikiSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    service: {type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true},
    private: {type: Boolean, default: false}
});

module.exports = mongoose.model('Wiki', wikiSchema);